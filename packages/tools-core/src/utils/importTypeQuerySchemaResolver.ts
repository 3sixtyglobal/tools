// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Is, StringHelper } from "@twin.org/core";
import type { IJsonSchema } from "@twin.org/tools-models";
import * as ts from "typescript";
import { DiagnosticReporter } from "./diagnosticReporter.js";
import { FileUtils } from "./fileUtils.js";
import { JsonSchemaBuilder } from "./jsonSchemaBuilder.js";
import { Resolver } from "./resolver.js";
import type { ITypeScriptToSchemaContext } from "../models/ITypeScriptToSchemaContext.js";

/**
 * Static helpers for import type and type query schema resolution.
 */
export class ImportTypeQuerySchemaResolver {
	/**
	 * Map import type nodes (e.g. import("pkg").Type) to schema references.
	 * @param context The generation context.
	 * @param typeNode The import type node.
	 * @returns The mapped schema.
	 */
	public static mapImportTypeNodeToSchema(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.ImportTypeNode
	): IJsonSchema | undefined {
		if (
			typeNode.isTypeOf ||
			!ts.isLiteralTypeNode(typeNode.argument) ||
			!ts.isStringLiteral(typeNode.argument.literal)
		) {
			DiagnosticReporter.report(
				context,
				typeNode,
				"jsonSchemaBuilder.diagnostic.unsupportedImportTypeForm",
				{ argument: typeNode.getText() }
			);
			return {};
		}

		const moduleSpecifier = typeNode.argument.literal.text;
		const typeName = ImportTypeQuerySchemaResolver.extractImportTypeName(typeNode.qualifier);
		if (!typeName) {
			DiagnosticReporter.report(
				context,
				typeNode,
				"jsonSchemaBuilder.diagnostic.unresolvedImportTypeQualifier",
				{ argument: moduleSpecifier }
			);
			return {};
		}

		const title = StringHelper.stripPrefix(typeName);
		const existingSchemaId = JsonSchemaBuilder.findExistingSchemaIdByTitle(context, title);
		const resolvedSchemaId =
			existingSchemaId ??
			ImportTypeQuerySchemaResolver.resolveImportTypeReferenceSchemaId(
				context,
				moduleSpecifier,
				typeName,
				title
			);

		return {
			$ref: resolvedSchemaId ?? `${context.namespace}${title}`
		};
	}

	/**
	 * Map a type query node (typeof expr) to schema by resolving the referenced variable.
	 * @param context The generation context.
	 * @param typeNode The type query node.
	 * @returns The mapped schema.
	 */
	public static mapTypeQueryNodeToSchema(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeQueryNode
	): IJsonSchema {
		if (ts.isQualifiedName(typeNode.exprName) && ts.isIdentifier(typeNode.exprName.left)) {
			const localValue = JsonSchemaBuilder.resolveLocalConstObjectProperty(
				context,
				typeNode.exprName.left.text,
				typeNode.exprName.right.text
			);
			if (localValue !== undefined) {
				return { const: localValue };
			}

			const importedValue = ImportTypeQuerySchemaResolver.resolveConstObjectProperty(
				context,
				typeNode.exprName.left.text,
				typeNode.exprName.right.text
			);
			if (importedValue !== undefined) {
				return { const: importedValue };
			}

			DiagnosticReporter.report(
				context,
				typeNode,
				"jsonSchemaBuilder.diagnostic.unresolvedTypeQueryTarget",
				{ target: typeNode.getText() }
			);
			return {};
		}

		const exprName = ts.isIdentifier(typeNode.exprName) ? typeNode.exprName.text : undefined;
		if (!exprName || !context.activeSourceFile) {
			DiagnosticReporter.report(
				context,
				typeNode,
				"jsonSchemaBuilder.diagnostic.unresolvedTypeQueryTarget",
				{ target: typeNode.getText() }
			);
			return {};
		}

		const localDeclaration = JsonSchemaBuilder.findVariableDeclaration(
			context.activeSourceFile,
			exprName
		);
		if (localDeclaration) {
			if (localDeclaration.type) {
				return JsonSchemaBuilder.mapTypeNodeToSchema(context, localDeclaration.type) ?? {};
			}
			if (localDeclaration.initializer) {
				return JsonSchemaBuilder.inferSchemaFromExpression(context, localDeclaration.initializer);
			}
		}

		const importedTypeQuerySchema = JsonSchemaBuilder.resolveImportedTypeQuerySchema(
			context,
			exprName
		);
		if (importedTypeQuerySchema) {
			return importedTypeQuerySchema;
		}

		DiagnosticReporter.report(
			context,
			typeNode,
			"jsonSchemaBuilder.diagnostic.unresolvedTypeQueryTarget",
			{ target: exprName }
		);

		return {};
	}

	/**
	 * Resolve import-type references to local or external schema ids.
	 * @param context The generation context.
	 * @param moduleSpecifier The import module specifier.
	 * @param typeName The imported type name.
	 * @param title The stripped schema title.
	 * @returns The resolved schema id.
	 */
	public static resolveImportTypeReferenceSchemaId(
		context: ITypeScriptToSchemaContext,
		moduleSpecifier: string,
		typeName: string,
		title: string
	): string | undefined {
		const mappedReference = JsonSchemaBuilder.resolveReferenceMappingTarget(
			context,
			moduleSpecifier,
			typeName
		);

		if (moduleSpecifier.startsWith(".")) {
			if (mappedReference?.schemaId) {
				return mappedReference.schemaId;
			}

			const activeFilePath = context.activeSourceFile?.fileName;
			if (!activeFilePath) {
				return undefined;
			}

			const resolvedImportPath = FileUtils.resolveImportSourceFilePath(
				activeFilePath,
				moduleSpecifier
			);
			if (!resolvedImportPath) {
				return undefined;
			}

			const importedSource = FileUtils.readFile(resolvedImportPath);
			if (!importedSource) {
				return undefined;
			}

			JsonSchemaBuilder.parseAllObjectSchemas(context, resolvedImportPath, importedSource, []);
			return context.schemas[context.packageName]?.[title]?.$id;
		}

		const cachedSchemaId = context.schemas[moduleSpecifier]?.[title]?.$id;
		if (cachedSchemaId) {
			return cachedSchemaId;
		}

		const declarationResult = Resolver.resolveTypeDeclarationAst(
			moduleSpecifier,
			typeName,
			context.activeSourceFile?.fileName
		);
		if (!declarationResult) {
			return mappedReference?.schemaId;
		}

		const externalContext: ITypeScriptToSchemaContext = {
			namespace: mappedReference?.namespace ?? context.namespace,
			packageName: moduleSpecifier,
			schemas: context.schemas,
			activeSourceFile: context.activeSourceFile,
			embeddedSchemaModes: context.embeddedSchemaModes,
			options: context.options
		};

		JsonSchemaBuilder.parseAllObjectSchemas(
			externalContext,
			declarationResult.sourceFile.fileName,
			declarationResult.sourceFile.getFullText(),
			[]
		);

		return context.schemas[moduleSpecifier]?.[title]?.$id ?? mappedReference?.schemaId;
	}

	/**
	 * Resolve a property value from a const object declaration in an imported source file.
	 * @param context The generation context.
	 * @param objectName The imported object symbol name.
	 * @param propertyName The property name to resolve from the object.
	 * @returns The resolved literal property value.
	 * @internal
	 */
	private static resolveConstObjectProperty(
		context: ITypeScriptToSchemaContext,
		objectName: string,
		propertyName: string
	): string | number | undefined {
		if (!context.activeSourceFile) {
			return undefined;
		}

		const importReference = ImportTypeQuerySchemaResolver.findImportedValueReference(
			context.activeSourceFile,
			objectName
		);
		if (!importReference) {
			return undefined;
		}

		const resolvedPath = ImportTypeQuerySchemaResolver.resolveImportDeclarationSourceFile(
			context.activeSourceFile.fileName,
			importReference.moduleSpecifier
		);
		if (!resolvedPath) {
			return undefined;
		}

		const importedSource = FileUtils.readFile(resolvedPath);
		if (!importedSource) {
			return undefined;
		}

		const importedSourceFile = ts.createSourceFile(
			resolvedPath,
			importedSource,
			ts.ScriptTarget.Latest,
			true
		);

		let objDecl = importedSourceFile.statements
			.filter((stmt): stmt is ts.VariableStatement => ts.isVariableStatement(stmt))
			.flatMap(stmt => [...stmt.declarationList.declarations])
			.find(decl => ts.isIdentifier(decl.name) && decl.name.text === importReference.importedName);

		objDecl ??= ImportTypeQuerySchemaResolver.findVariableDeclarationInModuleGraph(
			resolvedPath,
			importReference.importedName,
			new Set<string>()
		);

		if (!objDecl) {
			return undefined;
		}

		const valueFromInitializer =
			ImportTypeQuerySchemaResolver.extractConstObjectPropertyFromDeclarationInitializer(
				objDecl,
				propertyName
			);
		if (valueFromInitializer !== undefined) {
			return valueFromInitializer;
		}

		if (objDecl.type) {
			return ImportTypeQuerySchemaResolver.extractConstObjectPropertyFromDeclarationType(
				objDecl.type,
				propertyName
			);
		}

		return undefined;
	}

	/**
	 * Find a variable declaration by traversing import and export chains.
	 * @param sourceFilePath The source file path to inspect.
	 * @param variableName The variable name to find.
	 * @param visitedFiles The set of visited files to prevent recursion cycles.
	 * @returns The matched variable declaration.
	 * @internal
	 */
	private static findVariableDeclarationInModuleGraph(
		sourceFilePath: string,
		variableName: string,
		visitedFiles: Set<string>
	): ts.VariableDeclaration | undefined {
		const normalizedSourceFilePath = FileUtils.normalizeFilePath(sourceFilePath);
		if (visitedFiles.has(normalizedSourceFilePath)) {
			return undefined;
		}
		visitedFiles.add(normalizedSourceFilePath);

		const source = FileUtils.readFile(sourceFilePath);
		if (!source) {
			return undefined;
		}

		const sourceFile = ts.createSourceFile(sourceFilePath, source, ts.ScriptTarget.Latest, true);

		const declaration = sourceFile.statements
			.filter((stmt): stmt is ts.VariableStatement => ts.isVariableStatement(stmt))
			.flatMap(stmt => [...stmt.declarationList.declarations])
			.find(decl => ts.isIdentifier(decl.name) && decl.name.text === variableName);
		if (declaration) {
			return declaration;
		}

		const compilerOptions: ts.CompilerOptions = {
			module: ts.ModuleKind.NodeNext,
			moduleResolution: ts.ModuleResolutionKind.NodeNext,
			target: ts.ScriptTarget.ESNext,
			skipLibCheck: true
		};

		const moduleSpecifiers = sourceFile.statements
			.filter(statement => ts.isExportDeclaration(statement) || ts.isImportDeclaration(statement))
			.flatMap(statement => {
				const moduleSpecifier = statement.moduleSpecifier;
				return moduleSpecifier && ts.isStringLiteral(moduleSpecifier) ? [moduleSpecifier.text] : [];
			});

		for (const moduleSpecifier of moduleSpecifiers) {
			const resolvedModulePath = ts.resolveModuleName(
				moduleSpecifier,
				sourceFilePath,
				compilerOptions,
				ts.sys
			).resolvedModule?.resolvedFileName;

			if (resolvedModulePath) {
				const declarationInModule =
					ImportTypeQuerySchemaResolver.findVariableDeclarationInModuleGraph(
						resolvedModulePath,
						variableName,
						visitedFiles
					);
				if (declarationInModule) {
					return declarationInModule;
				}
			}
		}

		return undefined;
	}

	/**
	 * Find an imported symbol reference by local identifier name.
	 * @param sourceFile The active source file.
	 * @param localName The local identifier name.
	 * @returns The imported symbol reference.
	 * @internal
	 */
	private static findImportedValueReference(
		sourceFile: ts.SourceFile,
		localName: string
	):
		| {
				moduleSpecifier: string;
				importedName: string;
		  }
		| undefined {
		for (const statement of sourceFile.statements) {
			if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
				const bindings = statement.importClause?.namedBindings;
				if (bindings && ts.isNamedImports(bindings)) {
					const importElement = bindings.elements.find(el => el.name.text === localName);
					if (importElement) {
						return {
							moduleSpecifier: statement.moduleSpecifier.text,
							importedName: importElement.propertyName?.text ?? importElement.name.text
						};
					}
				}
			}
		}

		return undefined;
	}

	/**
	 * Resolve an import declaration module specifier to a source file.
	 * @param containingSourceFilePath The path of the file containing the import declaration.
	 * @param moduleSpecifier The module specifier to resolve.
	 * @returns The resolved source file path.
	 * @internal
	 */
	private static resolveImportDeclarationSourceFile(
		containingSourceFilePath: string,
		moduleSpecifier: string
	): string | undefined {
		const resolvedContainingSourceFilePath = FileUtils.resolvePath(containingSourceFilePath);

		if (moduleSpecifier.startsWith(".")) {
			return (
				FileUtils.resolveImportSourceFilePath(resolvedContainingSourceFilePath, moduleSpecifier) ??
				(moduleSpecifier.endsWith(".js")
					? FileUtils.resolveImportSourceFilePath(
							resolvedContainingSourceFilePath,
							`${moduleSpecifier.slice(0, -3)}.ts`
						)
					: undefined)
			);
		}

		const compilerOptions: ts.CompilerOptions = {
			module: ts.ModuleKind.NodeNext,
			moduleResolution: ts.ModuleResolutionKind.NodeNext,
			target: ts.ScriptTarget.ESNext,
			skipLibCheck: true
		};

		return ts.resolveModuleName(
			moduleSpecifier,
			resolvedContainingSourceFilePath,
			compilerOptions,
			ts.sys
		).resolvedModule?.resolvedFileName;
	}

	/**
	 * Extract a const-object property value from a declaration initializer.
	 * @param objectDeclaration The variable declaration containing the object initializer.
	 * @param propertyName The property name to resolve.
	 * @returns The extracted literal property value.
	 * @internal
	 */
	private static extractConstObjectPropertyFromDeclarationInitializer(
		objectDeclaration: ts.VariableDeclaration,
		propertyName: string
	): string | number | undefined {
		if (!objectDeclaration.initializer) {
			return undefined;
		}

		let objLiteral: ts.ObjectLiteralExpression | undefined;
		if (ts.isObjectLiteralExpression(objectDeclaration.initializer)) {
			objLiteral = objectDeclaration.initializer;
		} else if (
			ts.isAsExpression(objectDeclaration.initializer) &&
			ts.isObjectLiteralExpression(objectDeclaration.initializer.expression)
		) {
			objLiteral = objectDeclaration.initializer.expression;
		}

		if (!objLiteral) {
			return undefined;
		}

		const prop = objLiteral.properties
			.filter((p): p is ts.PropertyAssignment => ts.isPropertyAssignment(p))
			.find(p => ts.isIdentifier(p.name) && p.name.text === propertyName);

		if (!prop) {
			return undefined;
		}

		if (ts.isStringLiteral(prop.initializer)) {
			return prop.initializer.text;
		}
		if (ts.isNumericLiteral(prop.initializer)) {
			return Number(prop.initializer.text);
		}

		return undefined;
	}

	/**
	 * Extract a const-object property value from a declaration type annotation.
	 * @param declarationTypeNode The declaration type node to inspect.
	 * @param propertyName The property name to resolve.
	 * @returns The extracted literal property value.
	 * @internal
	 */
	private static extractConstObjectPropertyFromDeclarationType(
		declarationTypeNode: ts.TypeNode,
		propertyName: string
	): string | number | undefined {
		if (ts.isParenthesizedTypeNode(declarationTypeNode)) {
			return ImportTypeQuerySchemaResolver.extractConstObjectPropertyFromDeclarationType(
				declarationTypeNode.type,
				propertyName
			);
		}

		if (
			ts.isTypeOperatorNode(declarationTypeNode) &&
			declarationTypeNode.operator === ts.SyntaxKind.ReadonlyKeyword
		) {
			return ImportTypeQuerySchemaResolver.extractConstObjectPropertyFromDeclarationType(
				declarationTypeNode.type,
				propertyName
			);
		}

		if (
			ts.isTypeReferenceNode(declarationTypeNode) &&
			ts.isIdentifier(declarationTypeNode.typeName) &&
			declarationTypeNode.typeName.text === "Readonly" &&
			Is.arrayValue(declarationTypeNode.typeArguments)
		) {
			return ImportTypeQuerySchemaResolver.extractConstObjectPropertyFromDeclarationType(
				declarationTypeNode.typeArguments[0],
				propertyName
			);
		}

		if (ts.isTypeLiteralNode(declarationTypeNode)) {
			const propertySignature = declarationTypeNode.members.find(
				(member): member is ts.PropertySignature => {
					if (!ts.isPropertySignature(member) || !member.name) {
						return false;
					}

					return (
						(ts.isIdentifier(member.name) && member.name.text === propertyName) ||
						(ts.isStringLiteral(member.name) && member.name.text === propertyName) ||
						(ts.isNumericLiteral(member.name) && member.name.text === propertyName)
					);
				}
			);

			if (propertySignature?.type) {
				return ImportTypeQuerySchemaResolver.extractLiteralValueFromTypeNode(
					propertySignature.type
				);
			}
		}

		return undefined;
	}

	/**
	 * Extract a literal value from a type node when possible.
	 * @param typeNode The type node to inspect.
	 * @returns The extracted literal value.
	 * @internal
	 */
	private static extractLiteralValueFromTypeNode(
		typeNode: ts.TypeNode
	): string | number | undefined {
		if (ts.isLiteralTypeNode(typeNode)) {
			if (ts.isStringLiteral(typeNode.literal)) {
				return typeNode.literal.text;
			}

			if (ts.isNumericLiteral(typeNode.literal)) {
				return Number(typeNode.literal.text);
			}
		}

		return undefined;
	}

	/**
	 * Extract a referenced type name from an import type qualifier.
	 * @param qualifier The import type qualifier.
	 * @returns The extracted type name.
	 * @internal
	 */
	private static extractImportTypeName(qualifier: ts.EntityName | undefined): string | undefined {
		if (!qualifier) {
			return undefined;
		}

		if (ts.isIdentifier(qualifier)) {
			return qualifier.text;
		}

		return qualifier.right.text;
	}
}
