// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { GeneralError, Is, ObjectHelper, JsonHelper, StringHelper } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import { type IJsonSchema, JsonSchemaTagNames } from "@twin.org/tools-models";
import * as ts from "typescript";
import { Constants } from "./constants.js";
import { DiagnosticReporter } from "./diagnosticReporter.js";
import { DisallowedTypeGuard } from "./disallowedTypeGuard.js";
import { Enum } from "./enum.js";
import { FileUtils } from "./fileUtils.js";
import { ImportTypeQuerySchemaResolver } from "./importTypeQuerySchemaResolver.js";
import { IndexSignaturePatternResolver } from "./indexSignaturePatternResolver.js";
import { IntersectionSchemaMerger } from "./intersectionSchemaMerger.js";
import { MappedTypeSchemaResolver } from "./mappedTypeSchemaResolver.js";
import { ObjectTransformer } from "./objectTransformer.js";
import { RegEx } from "./regEx.js";
import { Resolver } from "./resolver.js";
import { TemplateLiteralPatternBuilder } from "./templateLiteralPatternBuilder.js";
import { Utility } from "./utility.js";
import { UtilityTypeSchemaMapper } from "./utilityTypeSchemaMapper.js";
import type { ITypeScriptToSchemaContext } from "../models/ITypeScriptToSchemaContext.js";

/**
 * Builder for composing JSON schema fragments from TypeScript AST nodes.
 */
export class JsonSchemaBuilder {
	/**
	 * The JSON Schema version used.
	 */
	public static readonly SCHEMA_VERSION = "https://json-schema.org/draft/2020-12/schema";

	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof(JsonSchemaBuilder);

	/**
	 * Dictionary of TypeScript utility type names to their schema mapping handlers.
	 */
	private static readonly _utilityTypeHandlers: {
		[key: string]: (
			context: ITypeScriptToSchemaContext,
			typeNode: ts.TypeReferenceNode
		) => IJsonSchema | undefined;
	} = {
		Partial: (context, typeNode) => JsonSchemaBuilder.mapPartialUtilityType(context, typeNode),
		Required: (context, typeNode) => JsonSchemaBuilder.mapRequiredUtilityType(context, typeNode),
		Pick: (context, typeNode) => JsonSchemaBuilder.mapPickUtilityType(context, typeNode),
		Omit: (context, typeNode) => JsonSchemaBuilder.mapOmitUtilityType(context, typeNode),
		Exclude: (context, typeNode) => JsonSchemaBuilder.mapExcludeUtilityType(context, typeNode),
		Extract: (context, typeNode) => JsonSchemaBuilder.mapExtractUtilityType(context, typeNode),
		NonNullable: (context, typeNode) =>
			JsonSchemaBuilder.mapNonNullableUtilityType(context, typeNode),
		Record: (context, typeNode) => JsonSchemaBuilder.mapRecordUtilityType(context, typeNode),
		JsonLdObjectWithId: (context, typeNode) =>
			JsonSchemaBuilder.mapJsonLdObjectUtilityType(context, typeNode, {
				keysToRemove: ["id", "@id"],
				keyToAdd: "id",
				isAddedKeyRequired: true
			}),
		JsonLdObjectWithAtId: (context, typeNode) =>
			JsonSchemaBuilder.mapJsonLdObjectUtilityType(context, typeNode, {
				keysToRemove: ["id", "@id"],
				keyToAdd: "@id",
				isAddedKeyRequired: true
			}),
		JsonLdObjectWithOptionalId: (context, typeNode) =>
			JsonSchemaBuilder.mapJsonLdObjectUtilityType(context, typeNode, {
				keysToRemove: ["id", "@id"],
				keyToAdd: "id",
				isAddedKeyRequired: false
			}),
		JsonLdObjectWithOptionalAtId: (context, typeNode) =>
			JsonSchemaBuilder.mapJsonLdObjectUtilityType(context, typeNode, {
				keysToRemove: ["id", "@id"],
				keyToAdd: "@id",
				isAddedKeyRequired: false
			}),
		JsonLdObjectWithNoId: (context, typeNode) =>
			JsonSchemaBuilder.mapJsonLdObjectUtilityType(context, typeNode, {
				keysToRemove: ["id"]
			}),
		JsonLdObjectWithNoAtId: (context, typeNode) =>
			JsonSchemaBuilder.mapJsonLdObjectUtilityType(context, typeNode, {
				keysToRemove: ["@id"]
			}),
		JsonLdObjectWithType: (context, typeNode) =>
			JsonSchemaBuilder.mapJsonLdObjectUtilityType(context, typeNode, {
				keysToRemove: ["type", "@type"],
				keyToAdd: "type",
				isAddedKeyRequired: true
			}),
		JsonLdObjectWithAtType: (context, typeNode) =>
			JsonSchemaBuilder.mapJsonLdObjectUtilityType(context, typeNode, {
				keysToRemove: ["type", "@type"],
				keyToAdd: "@type",
				isAddedKeyRequired: true
			}),
		JsonLdObjectWithOptionalType: (context, typeNode) =>
			JsonSchemaBuilder.mapJsonLdObjectUtilityType(context, typeNode, {
				keysToRemove: ["type", "@type"],
				keyToAdd: "type",
				isAddedKeyRequired: false
			}),
		JsonLdObjectWithOptionalAtType: (context, typeNode) =>
			JsonSchemaBuilder.mapJsonLdObjectUtilityType(context, typeNode, {
				keysToRemove: ["type", "@type"],
				keyToAdd: "@type",
				isAddedKeyRequired: false
			}),
		JsonLdObjectWithNoType: (context, typeNode) =>
			JsonSchemaBuilder.mapJsonLdObjectUtilityType(context, typeNode, {
				keysToRemove: ["type"]
			}),
		JsonLdObjectWithNoAtType: (context, typeNode) =>
			JsonSchemaBuilder.mapJsonLdObjectUtilityType(context, typeNode, {
				keysToRemove: ["@type"]
			}),
		JsonLdObjectWithContext: (context, typeNode) =>
			JsonSchemaBuilder.mapJsonLdObjectUtilityType(context, typeNode, {
				keysToRemove: ["@context"],
				keyToAdd: "@context",
				isAddedKeyRequired: true
			}),
		JsonLdObjectWithOptionalContext: (context, typeNode) =>
			JsonSchemaBuilder.mapJsonLdObjectUtilityType(context, typeNode, {
				keysToRemove: ["@context"],
				keyToAdd: "@context",
				isAddedKeyRequired: false
			}),
		JsonLdObjectWithNoContext: (context, typeNode) =>
			JsonSchemaBuilder.mapJsonLdObjectUtilityType(context, typeNode, {
				keysToRemove: ["@context"]
			}),
		SingleOccurrenceArray: (context, typeNode) =>
			JsonSchemaBuilder.mapSingleOccurrenceArrayUtilityType(context, typeNode),
		ObjectOrArray: (context, typeNode) =>
			JsonSchemaBuilder.mapObjectOrArrayUtilityType(context, typeNode)
	};

	/**
	 * Parse all object declarations from a source file.
	 * @param context The generation context.
	 * @param sourceFilePath The source file path.
	 * @param source The TypeScript source.
	 * @param visitedFiles The list of visited source files.
	 * @returns The generated schema titles.
	 */
	public static parseAllObjectSchemas(
		context: ITypeScriptToSchemaContext,
		sourceFilePath: string,
		source: string,
		visitedFiles: string[]
	): string[] {
		const absoluteSourcePath = FileUtils.normalizeFilePath(sourceFilePath);
		if (visitedFiles.includes(absoluteSourcePath)) {
			return [];
		}
		visitedFiles.push(absoluteSourcePath);

		const sourceFile = ts.createSourceFile(sourceFilePath, source, ts.ScriptTarget.Latest, true);
		const previousSourceFile = context.activeSourceFile;
		context.activeSourceFile = sourceFile;
		context.schemas[context.packageName] ??= {};
		const packageSchemaEntries = context.schemas[context.packageName];
		const parsedTitles: string[] = [];

		// Preload local imports so utility type mapping can resolve referenced
		// object schemas while processing declarations in this file.
		for (const statement of sourceFile.statements) {
			// import { Foo } from "./module.js"  (local relative import)
			if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
				const importPath = statement.moduleSpecifier.text;
				if (importPath.startsWith(".")) {
					const resolvedImportPath = FileUtils.resolveImportSourceFilePath(
						sourceFilePath,
						importPath
					);
					if (resolvedImportPath) {
						const importedSource = FileUtils.readFile(resolvedImportPath);
						if (importedSource) {
							const importedTitles = JsonSchemaBuilder.parseAllObjectSchemas(
								context,
								resolvedImportPath,
								importedSource,
								visitedFiles
							);
							for (const importedTitle of importedTitles) {
								if (!parsedTitles.includes(importedTitle)) {
									parsedTitles.push(importedTitle);
								}
							}
						}
					}
				}
			}
		}

		for (const statement of sourceFile.statements) {
			let title: string | undefined;
			let schema: Partial<IJsonSchema> | undefined;
			context.activeDisallowedType = undefined;

			// interface IFoo { prop: string; }  (interface declaration)
			if (ts.isInterfaceDeclaration(statement)) {
				const boundContext = JsonSchemaBuilder.withTypeParameterBindings(
					context,
					statement.typeParameters
				);
				title = StringHelper.stripPrefix(statement.name.text);
				boundContext.activeEnclosingObjectName = title;
				schema = JsonSchemaBuilder.buildBaseSchema(context.namespace, title, statement);
				JsonSchemaBuilder.buildObjectSchema(boundContext, schema, statement.members);
				JsonSchemaBuilder.applyInterfaceExtendsSchema(boundContext, schema, statement);
				// type Foo = string | number  or  type Foo = { prop: string }  (type alias declaration)
			} else if (ts.isTypeAliasDeclaration(statement)) {
				const boundContext = JsonSchemaBuilder.withTypeParameterBindings(
					context,
					statement.typeParameters
				);
				title = StringHelper.stripPrefix(statement.name.text);
				boundContext.activeEnclosingObjectName = title;

				// { prop: string }  (type alias whose RHS is an inline object type)
				if (ts.isTypeLiteralNode(statement.type)) {
					schema = JsonSchemaBuilder.buildBaseSchema(context.namespace, title, statement);
					JsonSchemaBuilder.buildObjectSchema(boundContext, schema, statement.type.members);
				} else {
					// Const-and-type enum patterns always take priority so that JsDoc descriptions
					// on the const object members are preserved in the generated oneOf schema.
					const constValues = Enum.extractEnumValuesFromConstAndType(
						statement.name.text,
						sourceFile
					);
					if (constValues) {
						schema = JsonSchemaBuilder.buildBaseSchema(context.namespace, title, statement);
						JsonSchemaBuilder.buildEnumSchema(schema, constValues);
					} else {
						const mappedType = JsonSchemaBuilder.mapTypeNodeToSchema(boundContext, statement.type);
						if (mappedType) {
							schema = JsonSchemaBuilder.buildBaseSchema(context.namespace, title, statement);
							Object.assign(schema, mappedType);
						}
					}
				}
				// enum Color { Red = "red", Blue = "blue" }  (native enum declaration)
			} else if (ts.isEnumDeclaration(statement)) {
				title = StringHelper.stripPrefix(statement.name.text);
				const enumValues = Enum.extractEnumValuesFromEnumDeclaration(statement);
				if (enumValues && enumValues.length > 0) {
					schema = JsonSchemaBuilder.buildBaseSchema(context.namespace, title, statement);
					JsonSchemaBuilder.buildEnumSchema(schema, enumValues);
				}
			}

			const activeDisallowedType = context.activeDisallowedType as
				| {
						disallowedTypeName: string;
						propertyName: string;
						enclosingObjectName: string;
				  }
				| undefined;
			if (activeDisallowedType) {
				DiagnosticReporter.report(
					context,
					statement,
					"jsonSchemaBuilder.diagnostic.excludedEnclosingObjectDisallowedType",
					{
						disallowedTypeName: activeDisallowedType.disallowedTypeName,
						enclosingObjectName: activeDisallowedType.enclosingObjectName,
						propertyName: activeDisallowedType.propertyName
					}
				);
				context.activeDisallowedType = undefined;
			} else if (title && schema) {
				const mappedSchema = ObjectHelper.removeEmptyProperties(
					ObjectTransformer.normalizeSchemaDescriptions(schema as IJsonSchema)
				);
				packageSchemaEntries[title] = mappedSchema;
				if (!parsedTitles.includes(title)) {
					parsedTitles.push(title);
				}
			}
		}

		for (const statement of sourceFile.statements) {
			// import { Foo } from "./module.js"  (re-scan imports to process any newly visible schemas)
			if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
				const importPath = statement.moduleSpecifier.text;
				if (importPath.startsWith(".")) {
					const resolvedImportPath = FileUtils.resolveImportSourceFilePath(
						sourceFilePath,
						importPath
					);
					if (resolvedImportPath) {
						const importedSource = FileUtils.readFile(resolvedImportPath);
						if (importedSource) {
							const importedTitles = JsonSchemaBuilder.parseAllObjectSchemas(
								context,
								resolvedImportPath,
								importedSource,
								visitedFiles
							);
							for (const importedTitle of importedTitles) {
								if (!parsedTitles.includes(importedTitle)) {
									parsedTitles.push(importedTitle);
								}
							}
						}
					}
				}
			}
		}

		context.activeSourceFile = previousSourceFile;
		return parsedTitles;
	}

	/**
	 * Apply @json-schema tags from JSDoc to a schema object.
	 * @param schema The schema to expand.
	 * @param node The node to inspect for tags.
	 * @throws GeneralError Thrown when a tag key is not supported by IJsonSchema.
	 */
	public static applyJsonSchemaTags(schema: Partial<IJsonSchema>, node: ts.Node): void {
		const tags = Utility.getNodeTags(node, "json-schema");
		for (const [rawKey, rawValue] of Object.entries(tags)) {
			const schemaKey = JsonSchemaBuilder.mapJsonSchemaTagKey(rawKey);
			if (!JsonSchemaBuilder.isAllowedJsonSchemaTagKey(schemaKey)) {
				throw new GeneralError(JsonSchemaBuilder.CLASS_NAME, "invalidJsonSchemaTagKey", {
					rawKey,
					schemaKey
				});
			}
			const parsedValue = Utility.parseTagValue(rawValue);
			ObjectHelper.propertySet(schema, schemaKey, parsedValue);
		}
	}

	/**
	 * Determine whether a mapped @json-schema tag key is supported.
	 * @param key The mapped schema key.
	 * @returns True if the key is supported.
	 */
	public static isAllowedJsonSchemaTagKey(key: string): boolean {
		return JsonSchemaTagNames.includes(key);
	}

	/**
	 * Build the base schema with common properties.
	 * @param namespace The namespace for generated schema id.
	 * @param title The schema title.
	 * @param statement The type statement node.
	 * @returns The base schema to be expanded.
	 */
	public static buildBaseSchema(
		namespace: string,
		title: string,
		statement: ts.Node
	): Partial<IJsonSchema> {
		const schema: Partial<IJsonSchema> = {
			$schema: JsonSchemaBuilder.SCHEMA_VERSION,
			$id: `${namespace}${title}`,
			title
		};

		const description = Utility.getNodeJsDocDescription(statement);
		if (description) {
			schema.description = description;
		}

		JsonSchemaBuilder.applyJsonSchemaTags(schema, statement);
		return schema;
	}

	/**
	 * Add enum information to a schema.
	 * @param schema The schema to expand.
	 * @param entries The enum entries.
	 */
	public static buildEnumSchema(
		schema: Partial<IJsonSchema>,
		entries: { value: string | number; description?: string }[]
	): void {
		schema.oneOf = entries.map(entry => ({
			const: entry.value,
			description: entry.description
		}));
	}

	/**
	 * Build an object schema from interface or type literal members.
	 * @param context The generation context.
	 * @param schema The schema to expand.
	 * @param members The members to process.
	 */
	public static buildObjectSchema(
		context: ITypeScriptToSchemaContext,
		schema: Partial<IJsonSchema>,
		members: ts.NodeArray<ts.TypeElement>
	): void {
		const { properties, required, patternProperties, additionalProperties, propertyNames } =
			JsonSchemaBuilder.buildObjectMembersSchema(context, members);
		schema.type = "object";
		if (Object.keys(properties).length > 0) {
			schema.properties = properties;
		}
		if (patternProperties) {
			schema.patternProperties = patternProperties;
		}
		if (propertyNames) {
			schema.propertyNames = propertyNames;
		}
		if (additionalProperties) {
			schema.additionalProperties = additionalProperties;
		}
		if (required.length > 0) {
			schema.required = required;
		}
	}

	/**
	 * Build property schemas and required list from type members.
	 * @param context The generation context.
	 * @param members The members to process.
	 * @returns The object property schema map and required list.
	 */
	public static buildObjectMembersSchema(
		context: ITypeScriptToSchemaContext,
		members: ts.NodeArray<ts.TypeElement>
	): {
		properties: { [key: string]: IJsonSchema };
		required: string[];
		patternProperties?: { [pattern: string]: IJsonSchema };
		additionalProperties?: IJsonSchema;
		propertyNames?: IJsonSchema;
	} {
		const properties: { [key: string]: IJsonSchema } = {};
		const required: string[] = [];
		const indexSignatureSchemas: IJsonSchema[] = [];
		const patternPropertySchemas: { pattern: string; schema: IJsonSchema }[] = [];

		for (const member of members) {
			if (context.activeDisallowedType) {
				break;
			}

			// prop: string  or  prop?: string  (property signature member)
			if (ts.isPropertySignature(member) && member.type) {
				if (JsonSchemaBuilder.isSymbolTypeNode(member.type)) {
					DiagnosticReporter.report(
						context,
						member,
						"jsonSchemaBuilder.diagnostic.symbolValuedProperty",
						{
							propertyName: member.name.getText()
						}
					);
				} else {
					const isMemberTypeAllowed = JsonSchemaBuilder.checkTypeNodeAllowed(
						context,
						member.type,
						member.name.getText(),
						context.activeEnclosingObjectName
					);
					if (isMemberTypeAllowed && JsonSchemaBuilder.isFunctionPropertyType(member.type)) {
						DiagnosticReporter.report(
							context,
							member,
							"jsonSchemaBuilder.diagnostic.functionTypedProperty",
							{
								propertyName: member.name.getText()
							}
						);
					} else if (isMemberTypeAllowed) {
						const memberName = member.name
							? JsonSchemaBuilder.extractPropertyName(context, member.name)
							: undefined;
						const memberTypeSchema = memberName
							? JsonSchemaBuilder.mapMemberTypeToSchema(context, member.type)
							: undefined;

						if (memberName && memberTypeSchema) {
							const memberDescription = Utility.getNodeJsDocDescription(member);
							if (memberDescription) {
								memberTypeSchema.description = memberDescription;
							}
							JsonSchemaBuilder.applyJsonSchemaTags(memberTypeSchema, member);
							properties[memberName] = ObjectHelper.removeEmptyProperties(memberTypeSchema);
							if (!member.questionToken) {
								required.push(memberName);
							}
						}
					}
				}
			}

			// [key: string]: Value  (index signature member)
			if (ts.isIndexSignatureDeclaration(member)) {
				const valueTypeSchema = member.type
					? (JsonSchemaBuilder.mapTypeNodeToSchema(context, member.type) ?? {})
					: {};
				if (IndexSignaturePatternResolver.isSupportedIndexSignature(member)) {
					indexSignatureSchemas.push(valueTypeSchema);
				} else {
					const pattern = IndexSignaturePatternResolver.extractIndexSignaturePattern(
						context,
						member,
						(boundContext, typeName) =>
							JsonSchemaBuilder.getTypeParameterBinding(boundContext, typeName)
					);
					if (pattern) {
						patternPropertySchemas.push({ pattern, schema: valueTypeSchema });
					} else {
						DiagnosticReporter.report(
							context,
							member,
							"jsonSchemaBuilder.diagnostic.unsupportedIndexSignature",
							{ keyType: member.parameters[0]?.type?.getText() ?? "unknown" }
						);
					}
				}
			}

			if (!ts.isPropertySignature(member) && !ts.isIndexSignatureDeclaration(member)) {
				// any other member kind (method signatures, call signatures, etc.) is reported and skipped
				DiagnosticReporter.report(
					context,
					member,
					"jsonSchemaBuilder.diagnostic.unsupportedTypeElementMember",
					{ kind: ts.SyntaxKind[member.kind] }
				);
			}
		}

		const uniqueIndexSignatureSchemas = indexSignatureSchemas.filter((schema, index, schemas) => {
			const schemaKey = JsonHelper.canonicalize(schema);
			return schemas.findIndex(s => JsonHelper.canonicalize(s) === schemaKey) === index;
		});

		let additionalProperties: IJsonSchema | undefined;
		if (uniqueIndexSignatureSchemas.length === 1) {
			additionalProperties = uniqueIndexSignatureSchemas[0];
		} else if (uniqueIndexSignatureSchemas.length > 1) {
			additionalProperties = { anyOf: uniqueIndexSignatureSchemas };
		}

		const patternProperties = JsonSchemaBuilder.mergePatternPropertySchemas(patternPropertySchemas);

		let propertyNames: IJsonSchema | undefined;
		if (patternPropertySchemas.length > 0 && uniqueIndexSignatureSchemas.length === 0) {
			const staticKeys = Object.keys(properties);
			const patternSchemas: IJsonSchema[] = Object.keys(patternProperties ?? {}).map(p => ({
				pattern: p
			}));
			if (staticKeys.length === 0) {
				propertyNames = patternSchemas.length === 1 ? patternSchemas[0] : { anyOf: patternSchemas };
			} else {
				propertyNames = { anyOf: [{ enum: staticKeys }, ...patternSchemas] };
			}
		}

		return { properties, required, patternProperties, additionalProperties, propertyNames };
	}

	/**
	 * Build an object schema from a type literal node.
	 * @param context The generation context.
	 * @param typeNode The type literal node.
	 * @returns The object schema.
	 */
	public static buildTypeLiteralSchema(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeLiteralNode
	): IJsonSchema {
		const { properties, required, patternProperties, additionalProperties, propertyNames } =
			JsonSchemaBuilder.buildObjectMembersSchema(context, typeNode.members);
		return {
			type: "object",
			properties: Object.keys(properties).length > 0 ? properties : undefined,
			required: required.length > 0 ? required : undefined,
			patternProperties,
			propertyNames,
			additionalProperties
		};
	}

	/**
	 * Merge pattern property schemas by pattern, deduplicating equivalent branches.
	 * @param patternPropertySchemas Pattern and schema entries to merge.
	 * @returns Merged patternProperties map.
	 */
	public static mergePatternPropertySchemas(
		patternPropertySchemas: { pattern: string; schema: IJsonSchema }[]
	): { [pattern: string]: IJsonSchema } | undefined {
		if (patternPropertySchemas.length === 0) {
			return undefined;
		}

		const groupedSchemas: { [pattern: string]: IJsonSchema[] } = {};
		for (const patternPropertySchema of patternPropertySchemas) {
			groupedSchemas[patternPropertySchema.pattern] ??= [];
			groupedSchemas[patternPropertySchema.pattern].push(patternPropertySchema.schema);
		}

		const mergedPatternProperties: { [pattern: string]: IJsonSchema } = {};
		for (const [pattern, schemas] of Object.entries(groupedSchemas)) {
			const uniqueSchemas = schemas.filter((schema, index, allSchemas) => {
				const schemaKey = JsonHelper.canonicalize(schema);
				return allSchemas.findIndex(s => JsonHelper.canonicalize(s) === schemaKey) === index;
			});

			mergedPatternProperties[pattern] =
				uniqueSchemas.length === 1 ? uniqueSchemas[0] : { anyOf: uniqueSchemas };
		}

		return mergedPatternProperties;
	}

	/**
	 * Map a property type node to schema.
	 * @param context The generation context.
	 * @param typeNode The member type node.
	 * @returns The mapped member schema.
	 */
	public static mapMemberTypeToSchema(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeNode
	): IJsonSchema | undefined {
		// [string, number]  or  [label: string, ...rest: string[]]  (tuple type)
		if (ts.isTupleTypeNode(typeNode)) {
			return JsonSchemaBuilder.mapTupleTypeToSchema(context, typeNode);
		}

		// typeof variable  (type query, resolves the type of a declared value)
		if (ts.isTypeQueryNode(typeNode)) {
			return ImportTypeQuerySchemaResolver.mapTypeQueryNodeToSchema(context, typeNode);
		}

		// { prop: string }  (inline object type literal as a member type)
		if (ts.isTypeLiteralNode(typeNode)) {
			return JsonSchemaBuilder.buildTypeLiteralSchema(context, typeNode);
		}

		return JsonSchemaBuilder.mapTypeNodeToSchema(context, typeNode);
	}

	/**
	 * Map TypeScript type nodes to JSON schema.
	 * @param context The generation context.
	 * @param typeNode The node to process.
	 * @returns The mapped schema.
	 */
	public static mapTypeNodeToSchema(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeNode
	): IJsonSchema | undefined {
		if (
			!JsonSchemaBuilder.checkTypeNodeAllowed(
				context,
				typeNode,
				undefined,
				context.activeEnclosingObjectName
			)
		) {
			return undefined;
		}

		// readonly T[] or keyof T  (type operator node)
		if (ts.isTypeOperatorNode(typeNode)) {
			if (typeNode.operator === ts.SyntaxKind.ReadonlyKeyword) {
				return JsonSchemaBuilder.mapTypeNodeToSchema(context, typeNode.type);
			}

			if (typeNode.operator === ts.SyntaxKind.KeyOfKeyword) {
				const keyofKeys = JsonSchemaBuilder.extractKeyofTypeKeys(context, typeNode.type);
				if (keyofKeys.length > 0) {
					return { enum: keyofKeys };
				}
				if (JsonSchemaBuilder.isGenericKeyofOperand(context, typeNode.type)) {
					return {};
				}
				DiagnosticReporter.report(
					context,
					typeNode,
					"jsonSchemaBuilder.diagnostic.unresolvedKeyofOperand",
					{
						operand: typeNode.type.getText()
					}
				);
				return {};
			}
		}

		// T["key"]  (indexed access type)
		if (ts.isIndexedAccessTypeNode(typeNode)) {
			return JsonSchemaBuilder.mapIndexedAccessTypeToSchema(context, typeNode);
		}

		// `prefix-${T}`  (template literal type)
		if (ts.isTemplateLiteralTypeNode(typeNode)) {
			return JsonSchemaBuilder.mapTemplateLiteralTypeToSchema(context, typeNode);
		}

		// { [K in keyof T]: T[K] }  (mapped type)
		if (ts.isMappedTypeNode(typeNode)) {
			return JsonSchemaBuilder.mapMappedTypeToSchema(context, typeNode);
		}

		// T extends U ? X : Y  (conditional type)
		if (ts.isConditionalTypeNode(typeNode)) {
			return JsonSchemaBuilder.mapConditionalTypeToSchema(context, typeNode);
		}

		// (string | number)  (parenthesised type, unwrap and recurse)
		if (ts.isParenthesizedTypeNode(typeNode)) {
			return JsonSchemaBuilder.mapTypeNodeToSchema(context, typeNode.type);
		}

		// [string, number]  or  [label: string, ...rest: string[]]  (tuple type)
		if (ts.isTupleTypeNode(typeNode)) {
			return JsonSchemaBuilder.mapTupleTypeToSchema(context, typeNode);
		}

		// unknown  (open schema, accepts any value)
		if (typeNode.kind === ts.SyntaxKind.UnknownKeyword) {
			return {};
		}
		// any  (open schema, accepts any value)
		if (typeNode.kind === ts.SyntaxKind.AnyKeyword) {
			return {};
		}
		// never  (empty schema that rejects all values)
		if (typeNode.kind === ts.SyntaxKind.NeverKeyword) {
			return { not: {} };
		}
		if (typeNode.kind === ts.SyntaxKind.UndefinedKeyword) {
			return undefined;
		}
		if (typeNode.kind === ts.SyntaxKind.VoidKeyword) {
			return undefined;
		}

		// string  (string keyword type)
		if (typeNode.kind === ts.SyntaxKind.StringKeyword) {
			return { type: "string" };
		}
		// number  (number keyword type)
		if (typeNode.kind === ts.SyntaxKind.NumberKeyword) {
			return { type: "number" };
		}
		// boolean  (boolean keyword type)
		if (typeNode.kind === ts.SyntaxKind.BooleanKeyword) {
			return { type: "boolean" };
		}
		// object  (object keyword type)
		if (typeNode.kind === ts.SyntaxKind.ObjectKeyword) {
			return { type: "object" };
		}
		// null  (null keyword type)
		if (typeNode.kind === ts.SyntaxKind.NullKeyword) {
			return { type: "null" };
		}

		// string[]  or  Foo[]  (array type)
		if (ts.isArrayTypeNode(typeNode)) {
			const elementType = JsonSchemaBuilder.mapTypeNodeToSchema(context, typeNode.elementType);
			if (elementType) {
				return {
					type: "array",
					items: elementType
				};
			}
		}

		// MyType<T>  or  Namespace.MyType  (named type reference, possibly with type arguments)
		if (ts.isTypeReferenceNode(typeNode)) {
			const typeName = ts.isIdentifier(typeNode.typeName)
				? typeNode.typeName.text
				: typeNode.typeName.right.text;
			const typeParameterBinding = JsonSchemaBuilder.getTypeParameterBinding(context, typeName);
			if (typeParameterBinding !== undefined) {
				return typeParameterBinding
					? JsonSchemaBuilder.mapTypeNodeToSchema(context, typeParameterBinding)
					: {};
			}
			if (typeName === "undefined") {
				return undefined;
			}
			if (typeName === "Boolean") {
				return { type: "boolean" };
			}
			if (typeName === "Object") {
				return { type: "object" };
			}
			if (typeName === "Map") {
				const mapValueType = typeNode.typeArguments?.[1];
				const additionalProperties = mapValueType
					? (JsonSchemaBuilder.mapTypeNodeToSchema(context, mapValueType) ?? {})
					: {};
				return {
					type: "object",
					additionalProperties
				};
			}
			if (typeName === "Set") {
				const setItemType = typeNode.typeArguments?.[0];
				const items = setItemType
					? (JsonSchemaBuilder.mapTypeNodeToSchema(context, setItemType) ?? {})
					: {};
				return {
					type: "array",
					items,
					uniqueItems: true
				};
			}
			if (typeName === "ReadonlyArray") {
				const arrayItemType = typeNode.typeArguments?.[0];
				const items = arrayItemType
					? (JsonSchemaBuilder.mapTypeNodeToSchema(context, arrayItemType) ?? {})
					: {};
				return {
					type: "array",
					items
				};
			}
			if (Constants.ARRAY_NUMBER_TYPE_NAMES.includes(typeName)) {
				return {
					type: "array",
					items: { type: "number" }
				};
			}
			const utilityHandler = JsonSchemaBuilder._utilityTypeHandlers[typeName];
			if (utilityHandler) {
				return utilityHandler(context, typeNode);
			}

			if (Constants.UNSUPPORTED_UTILITY_TYPE_NAMES.includes(typeName)) {
				DiagnosticReporter.report(
					context,
					typeNode,
					"jsonSchemaBuilder.diagnostic.unsupportedUtilityType",
					{ utilityType: typeName }
				);
				return {};
			}

			const title = StringHelper.stripPrefix(typeName);
			const importedModuleSpecifier = context.activeSourceFile
				? JsonSchemaBuilder.findImportedModuleSpecifier(
						context.activeSourceFile,
						typeNode,
						typeName
					)
				: undefined;
			if (!importedModuleSpecifier || importedModuleSpecifier.startsWith(".")) {
				const mappedReference = JsonSchemaBuilder.resolveReferenceMappingTarget(
					context,
					"",
					typeName
				);
				if (mappedReference?.schemaId) {
					return {
						$ref: mappedReference.schemaId
					};
				}
			}
			const resolvedImportedSchemaId = JsonSchemaBuilder.resolveExternalTypeReferenceSchemaId(
				context,
				typeNode,
				typeName
			);
			const existingSchemaId = resolvedImportedSchemaId
				? undefined
				: JsonSchemaBuilder.findExistingSchemaIdByTitle(context, title);
			return {
				$ref: resolvedImportedSchemaId ?? existingSchemaId ?? `${context.namespace}${title}`
			};
		}

		// import("./module.js").TypeName  (import type node)
		if (ts.isImportTypeNode(typeNode)) {
			return ImportTypeQuerySchemaResolver.mapImportTypeNodeToSchema(context, typeNode);
		}

		// { prop: string }  (inline object type literal)
		if (ts.isTypeLiteralNode(typeNode)) {
			return JsonSchemaBuilder.buildTypeLiteralSchema(context, typeNode);
		}

		// "hello" or 42 or true or false  (literal type node wrapping a literal keyword or value)
		if (ts.isLiteralTypeNode(typeNode)) {
			// "hello"  (string literal type)
			if (ts.isStringLiteral(typeNode.literal)) {
				return { const: typeNode.literal.text };
			}
			// 42  (numeric literal type)
			if (ts.isNumericLiteral(typeNode.literal)) {
				return { const: Number(typeNode.literal.text) };
			}
			if (typeNode.literal.kind === ts.SyntaxKind.NullKeyword) {
				// null  (null keyword inside a literal type node)
				return { type: "null" };
			}
			if (typeNode.literal.kind === ts.SyntaxKind.TrueKeyword) {
				// true  (boolean true literal type — distinct from the boolean keyword type)
				return { const: true };
			}
			if (typeNode.literal.kind === ts.SyntaxKind.FalseKeyword) {
				// false  (boolean false literal type — distinct from the boolean keyword type)
				return { const: false };
			}
		}

		// string | number | null  (union type)
		if (ts.isUnionTypeNode(typeNode)) {
			const mappedUnionTypes = typeNode.types
				.map(unionType => JsonSchemaBuilder.mapTypeNodeToSchema(context, unionType))
				.filter((mappedType): mappedType is IJsonSchema => mappedType !== undefined);

			if (mappedUnionTypes.length > 0) {
				if (mappedUnionTypes.length === 1) {
					return mappedUnionTypes[0];
				}

				if (
					JsonSchemaBuilder.isNeverDiscriminatedObjectUnion(
						context,
						typeNode.types,
						mappedUnionTypes
					) ||
					JsonSchemaBuilder.isLiteralTagDiscriminatedObjectUnion(context, mappedUnionTypes) ||
					JsonSchemaBuilder.isDisjointPrimitiveKeywordUnion(
						typeNode,
						typeNode.types,
						mappedUnionTypes
					)
				) {
					return {
						oneOf: mappedUnionTypes
					};
				}

				return {
					anyOf: mappedUnionTypes
				};
			}
		}

		// TypeA & TypeB  (intersection type, try to merge into a single object schema)
		if (ts.isIntersectionTypeNode(typeNode)) {
			const mappedIntersectionTypes = typeNode.types
				.map(intersectionType => JsonSchemaBuilder.mapTypeNodeToSchema(context, intersectionType))
				.filter((mappedType): mappedType is IJsonSchema => mappedType !== undefined);

			if (mappedIntersectionTypes.length > 0) {
				const mergedIntersectionObjectSchema =
					IntersectionSchemaMerger.mergeIntersectionObjectSchemas(
						context,
						mappedIntersectionTypes,
						schema => ObjectTransformer.toInlineUtilityObjectSchema(schema)
					);
				if (mergedIntersectionObjectSchema) {
					return mergedIntersectionObjectSchema;
				}

				return {
					allOf: mappedIntersectionTypes
				};
			}
		}

		// typeof variable  (type query, treated as an open schema)
		if (ts.isTypeQueryNode(typeNode)) {
			return ImportTypeQuerySchemaResolver.mapTypeQueryNodeToSchema(context, typeNode);
		}

		DiagnosticReporter.report(context, typeNode, "jsonSchemaBuilder.diagnostic.unmappedTypeNode", {
			kind: ts.SyntaxKind[typeNode.kind]
		});

		return undefined;
	}

	/**
	 * Determine whether a union of primitive keyword branches is pairwise disjoint.
	 * @param unionTypeNode The union node being mapped.
	 * @param unionTypeNodes The original union branch type nodes.
	 * @param unionSchemas The mapped union branch schemas.
	 * @returns True if every branch is a primitive keyword schema and no branches overlap.
	 */
	public static isDisjointPrimitiveKeywordUnion(
		unionTypeNode: ts.UnionTypeNode,
		unionTypeNodes: ts.NodeArray<ts.TypeNode>,
		unionSchemas: IJsonSchema[]
	): boolean {
		if (unionSchemas.length < 2 || unionSchemas.length !== unionTypeNodes.length) {
			return false;
		}

		let unionContainer: ts.Node = unionTypeNode;
		while (ts.isParenthesizedTypeNode(unionContainer.parent)) {
			unionContainer = unionContainer.parent;
		}

		if (
			!ts.isTypeAliasDeclaration(unionContainer.parent) ||
			unionContainer.parent.type !== unionContainer
		) {
			// Keep nested/property unions as anyOf; only top-level alias unions are promoted.
			return false;
		}

		const primitiveKinds = new Set<ts.SyntaxKind>([
			ts.SyntaxKind.StringKeyword,
			ts.SyntaxKind.NumberKeyword,
			ts.SyntaxKind.BooleanKeyword,
			ts.SyntaxKind.NullKeyword
		]);

		if (!unionTypeNodes.every(unionBranchType => primitiveKinds.has(unionBranchType.kind))) {
			// Mixed or non-primitive unions can overlap in value space.
			return false;
		}

		const schemaTypeDomains = unionSchemas.map(schema => {
			if (schema.type === "integer") {
				return "number";
			}

			return Is.stringValue(schema.type) ? schema.type : undefined;
		});

		if (
			schemaTypeDomains.some(
				schemaType =>
					schemaType !== "string" &&
					schemaType !== "number" &&
					schemaType !== "boolean" &&
					schemaType !== "null"
			)
		) {
			// Only primitive keyword domains are considered disjoint enough for oneOf.
			return false;
		}

		// oneOf is safe when every branch maps to a unique primitive domain.
		return new Set(schemaTypeDomains).size === unionSchemas.length;
	}

	/**
	 * Determine whether a union of schemas represents mutually exclusive object branches.
	 * @param context The generation context.
	 * @param unionTypeNodes The union branch type nodes for cross-checking with the mapped schemas.
	 * @param unionSchemas The mapped union branch schemas.
	 * @returns True if each branch is an object schema with a unique required key set.
	 */
	public static isNeverDiscriminatedObjectUnion(
		context: ITypeScriptToSchemaContext,
		unionTypeNodes: ts.NodeArray<ts.TypeNode>,
		unionSchemas: IJsonSchema[]
	): boolean {
		if (unionSchemas.length < 2 || unionSchemas.length !== unionTypeNodes.length) {
			return false;
		}

		const branchInfos: {
			requiredKeys: Set<string>;
			forbiddenKeys: Set<string>;
		}[] = [];
		let hasNeverDiscriminator = false;

		for (const unionTypeNode of unionTypeNodes) {
			const branchMembers = JsonSchemaBuilder.resolveNeverDiscriminatorMembers(
				context,
				unionTypeNode
			);
			if (!branchMembers) {
				return false;
			}

			const branchInfo: {
				requiredKeys: Set<string>;
				forbiddenKeys: Set<string>;
			} = {
				requiredKeys: new Set<string>(),
				forbiddenKeys: new Set<string>()
			};

			for (const member of branchMembers) {
				if (ts.isPropertySignature(member) && member.type && member.name) {
					const propertyName = JsonSchemaBuilder.extractPropertyName(context, member.name);
					if (propertyName) {
						if (member.type.kind === ts.SyntaxKind.NeverKeyword) {
							// never marks a property as impossible in this branch.
							branchInfo.forbiddenKeys.add(propertyName);
							hasNeverDiscriminator = true;
						} else if (!member.questionToken) {
							// Required non-never keys are the positive branch signals.
							branchInfo.requiredKeys.add(propertyName);
						}
					}
				}
			}

			branchInfos.push(branchInfo);
		}

		if (!hasNeverDiscriminator) {
			return false;
		}

		for (const branchInfo of branchInfos) {
			if (branchInfo.requiredKeys.size === 0 && branchInfo.forbiddenKeys.size === 0) {
				// Require each branch to contribute at least one discriminating signal.
				return false;
			}
		}

		for (let i = 0; i < branchInfos.length; i++) {
			for (let j = i + 1; j < branchInfos.length; j++) {
				const firstBranch = branchInfos[i];
				const secondBranch = branchInfos[j];

				const firstExcludesSecond = [...firstBranch.requiredKeys].some(requiredKey =>
					secondBranch.forbiddenKeys.has(requiredKey)
				);
				const secondExcludesFirst = [...secondBranch.requiredKeys].some(requiredKey =>
					firstBranch.forbiddenKeys.has(requiredKey)
				);

				if (!firstExcludesSecond && !secondExcludesFirst) {
					// Branch pairs must be mutually exclusive in at least one direction.
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * Determine whether object union branches are discriminated by a shared required literal tag.
	 * @param context The generation context.
	 * @param unionSchemas The mapped union branch schemas.
	 * @returns True if the union can be safely represented as oneOf.
	 */
	public static isLiteralTagDiscriminatedObjectUnion(
		context: ITypeScriptToSchemaContext,
		unionSchemas: IJsonSchema[]
	): boolean {
		if (unionSchemas.length < 2) {
			return false;
		}

		const resolvedObjectSchemas = unionSchemas
			.map(schema => JsonSchemaBuilder.resolveLocalSchemaReference(context, schema) ?? schema)
			.filter(
				(
					schema
				): schema is IJsonSchema & {
					properties: { [key: string]: IJsonSchema };
					required: string[];
				} =>
					schema.type === "object" &&
					Is.object(schema.properties) &&
					Is.array<string>(schema.required)
			);

		if (resolvedObjectSchemas.length !== unionSchemas.length) {
			return false;
		}

		const requiredDiscriminatorKeys = resolvedObjectSchemas.map(objectSchema => {
			const discriminators = new Map<string, unknown>();

			for (const requiredKey of objectSchema.required) {
				const propertySchema = objectSchema.properties[requiredKey];
				if (
					Is.object(propertySchema) &&
					Object.prototype.hasOwnProperty.call(propertySchema, "const")
				) {
					discriminators.set(requiredKey, propertySchema.const);
				}
			}

			return discriminators;
		});

		const candidateKeys = new Set<string>(requiredDiscriminatorKeys[0].keys());
		for (const discriminatorMap of requiredDiscriminatorKeys.slice(1)) {
			for (const candidateKey of [...candidateKeys]) {
				if (!discriminatorMap.has(candidateKey)) {
					candidateKeys.delete(candidateKey);
				}
			}
		}

		for (const candidateKey of candidateKeys) {
			const discriminatorValues = requiredDiscriminatorKeys.map(discriminatorMap =>
				JsonHelper.canonicalize(discriminatorMap.get(candidateKey))
			);

			if (new Set(discriminatorValues).size === unionSchemas.length) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Resolve branch members that can encode never-based discriminators.
	 * @param context The generation context.
	 * @param unionTypeNode The union branch type node.
	 * @returns Type members for the branch when resolvable.
	 */
	public static resolveNeverDiscriminatorMembers(
		context: ITypeScriptToSchemaContext,
		unionTypeNode: ts.TypeNode
	): ts.NodeArray<ts.TypeElement> | undefined {
		const findTypeMembersInSourceFile = (
			sourceFile: ts.SourceFile,
			typeName: string
		): ts.NodeArray<ts.TypeElement> | undefined => {
			for (const statement of sourceFile.statements) {
				if (ts.isInterfaceDeclaration(statement) && statement.name.text === typeName) {
					return statement.members;
				}

				if (
					ts.isTypeAliasDeclaration(statement) &&
					statement.name.text === typeName &&
					ts.isTypeLiteralNode(statement.type)
				) {
					return statement.type.members;
				}
			}

			return undefined;
		};

		// { discriminator: "a"; other: string }  (inline type literal as union branch)
		if (ts.isTypeLiteralNode(unionTypeNode)) {
			return unionTypeNode.members;
		}

		// BranchType  (named type reference resolves to its declaration)
		if (!ts.isTypeReferenceNode(unionTypeNode)) {
			return undefined;
		}

		const sourceFile = context.activeSourceFile;
		if (!sourceFile) {
			return undefined;
		}

		// BranchType  (plain identifier type name)
		const typeName = ts.isIdentifier(unionTypeNode.typeName)
			? unionTypeNode.typeName.text
			: unionTypeNode.typeName.right.text;

		const localMembers = findTypeMembersInSourceFile(sourceFile, typeName);
		if (localMembers) {
			return localMembers;
		}

		const importedTypeReference = JsonSchemaBuilder.findImportedTypeReference(context, typeName);
		if (!importedTypeReference?.moduleSpecifier.startsWith(".")) {
			return undefined;
		}

		const resolvedImportPath = JsonSchemaBuilder.resolveImportDeclarationSourceFile(
			sourceFile.fileName,
			importedTypeReference.moduleSpecifier
		);
		if (!resolvedImportPath) {
			return undefined;
		}

		const importedSource = FileUtils.readFile(resolvedImportPath);
		if (!importedSource) {
			return undefined;
		}

		const importedSourceFile = ts.createSourceFile(
			resolvedImportPath,
			importedSource,
			ts.ScriptTarget.Latest,
			true
		);

		return findTypeMembersInSourceFile(importedSourceFile, importedTypeReference.candidateTypeName);
	}

	/**
	 * Resolve a local $ref schema to its stored schema definition.
	 * @param context The generation context.
	 * @param schema The schema that may contain a local reference.
	 * @returns The resolved schema when available.
	 */
	public static resolveLocalSchemaReference(
		context: ITypeScriptToSchemaContext,
		schema: IJsonSchema
	): IJsonSchema | undefined {
		if (!schema.$ref?.startsWith(context.namespace)) {
			return undefined;
		}

		const schemaTitle = schema.$ref.slice(context.namespace.length);
		return context.schemas[context.packageName]?.[schemaTitle];
	}

	/**
	 * Resolve a property value from a const object declaration in an imported source file.
	 * @param context The generation context.
	 * @param objectName The name of the const object.
	 * @param propertyName The name of the property to resolve.
	 * @returns The resolved string or number value, or undefined if unresolvable.
	 */
	public static resolveConstObjectProperty(
		context: ITypeScriptToSchemaContext,
		objectName: string,
		propertyName: string
	): string | number | undefined {
		if (!context.activeSourceFile) {
			return undefined;
		}

		const importReference = JsonSchemaBuilder.findImportedValueReference(
			context.activeSourceFile,
			objectName
		);
		if (!importReference) {
			return undefined;
		}

		const resolvedPath = JsonSchemaBuilder.resolveImportDeclarationSourceFile(
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
			// export const FOO = { ... } as const  (variable statement)
			.filter((stmt): stmt is ts.VariableStatement => ts.isVariableStatement(stmt))
			.flatMap(stmt => [...stmt.declarationList.declarations])
			// FOO  (plain identifier binding name)
			.find(decl => ts.isIdentifier(decl.name) && decl.name.text === importReference.importedName);

		objDecl ??= JsonSchemaBuilder.findVariableDeclarationInModuleGraph(
			resolvedPath,
			importReference.importedName,
			new Set<string>()
		);

		if (!objDecl) {
			return undefined;
		}

		const valueFromInitializer =
			JsonSchemaBuilder.extractConstObjectPropertyFromDeclarationInitializer(objDecl, propertyName);
		if (valueFromInitializer !== undefined) {
			return valueFromInitializer;
		}

		if (objDecl.type) {
			return JsonSchemaBuilder.extractConstObjectPropertyFromDeclarationType(
				objDecl.type,
				propertyName
			);
		}

		return undefined;
	}

	/**
	 * Find a variable declaration by traversing import and export chains.
	 * @param sourceFilePath The source file path to start from.
	 * @param variableName The variable declaration name to find.
	 * @param visitedFiles The file set already visited.
	 * @returns The variable declaration when found.
	 */
	public static findVariableDeclarationInModuleGraph(
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
				const declarationInModule = JsonSchemaBuilder.findVariableDeclarationInModuleGraph(
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
	 * @param sourceFile The source file to inspect.
	 * @param localName The local identifier name.
	 * @returns The module specifier and imported symbol name.
	 */
	public static findImportedValueReference(
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
	 * @param containingSourceFilePath The containing source file path.
	 * @param moduleSpecifier The module specifier text.
	 * @returns The resolved source file path.
	 */
	public static resolveImportDeclarationSourceFile(
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
	 * @param objectDeclaration The variable declaration.
	 * @param propertyName The property to resolve.
	 * @returns The resolved value.
	 */
	public static extractConstObjectPropertyFromDeclarationInitializer(
		objectDeclaration: ts.VariableDeclaration,
		propertyName: string
	): string | number | undefined {
		if (!objectDeclaration.initializer) {
			return undefined;
		}

		let objLiteral: ts.ObjectLiteralExpression | undefined;
		// { key: "value" }  (plain object literal initializer)
		if (ts.isObjectLiteralExpression(objectDeclaration.initializer)) {
			objLiteral = objectDeclaration.initializer;
		} else if (
			// { key: "value" } as const  (object literal wrapped in as-expression)
			ts.isAsExpression(objectDeclaration.initializer) &&
			// { key: "value" }  (unwrap the as-expression to get the literal)
			ts.isObjectLiteralExpression(objectDeclaration.initializer.expression)
		) {
			objLiteral = objectDeclaration.initializer.expression;
		}

		if (!objLiteral) {
			return undefined;
		}

		const prop = objLiteral.properties
			// key: "value"  (named property assignment)
			.filter((p): p is ts.PropertyAssignment => ts.isPropertyAssignment(p))
			// myProp  (plain identifier property name)
			.find(p => ts.isIdentifier(p.name) && p.name.text === propertyName);

		if (!prop) {
			return undefined;
		}

		// "value"  (string literal property value)
		if (ts.isStringLiteral(prop.initializer)) {
			return prop.initializer.text;
		}
		// 42  (numeric literal property value)
		if (ts.isNumericLiteral(prop.initializer)) {
			return Number(prop.initializer.text);
		}

		return undefined;
	}

	/**
	 * Extract a const-object property value from a declaration type annotation.
	 * @param declarationTypeNode The declaration type annotation.
	 * @param propertyName The property to resolve.
	 * @returns The resolved value.
	 */
	public static extractConstObjectPropertyFromDeclarationType(
		declarationTypeNode: ts.TypeNode,
		propertyName: string
	): string | number | undefined {
		if (ts.isParenthesizedTypeNode(declarationTypeNode)) {
			return JsonSchemaBuilder.extractConstObjectPropertyFromDeclarationType(
				declarationTypeNode.type,
				propertyName
			);
		}

		if (
			ts.isTypeOperatorNode(declarationTypeNode) &&
			declarationTypeNode.operator === ts.SyntaxKind.ReadonlyKeyword
		) {
			return JsonSchemaBuilder.extractConstObjectPropertyFromDeclarationType(
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
			return JsonSchemaBuilder.extractConstObjectPropertyFromDeclarationType(
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
				return JsonSchemaBuilder.extractLiteralValueFromTypeNode(propertySignature.type);
			}
		}

		return undefined;
	}

	/**
	 * Extract a literal value from a type node when possible.
	 * @param typeNode The type node.
	 * @returns The literal value.
	 */
	public static extractLiteralValueFromTypeNode(
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
	 * @returns The resolved type name.
	 */
	public static extractImportTypeName(qualifier: ts.EntityName | undefined): string | undefined {
		if (!qualifier) {
			return undefined;
		}

		// TypeName  (plain identifier, e.g. import("pkg").TypeName)
		if (ts.isIdentifier(qualifier)) {
			return qualifier.text;
		}

		// Namespace.TypeName  (qualified name, e.g. import("pkg").Namespace.TypeName)
		return qualifier.right.text;
	}

	/**
	 * Resolve import-type references to local or external schema ids.
	 * @param context The generation context.
	 * @param moduleSpecifier The import module specifier.
	 * @param typeName The imported type name.
	 * @param title The derived schema title.
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

		const declarationResult = Resolver.resolveTypeDeclarationAst(moduleSpecifier, typeName);
		if (!declarationResult) {
			return mappedReference?.schemaId;
		}

		const externalContext: ITypeScriptToSchemaContext = {
			namespace: mappedReference?.namespace ?? context.namespace,
			packageName: moduleSpecifier,
			schemas: context.schemas,
			activeSourceFile: context.activeSourceFile,
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
	 * Infer a primitive JSON schema from a literal expression.
	 * @param context The generation context.
	 * @param expr The expression to inspect.
	 * @param asConst Whether to produce exact const schemas matching an as-const assertion.
	 * @returns The inferred schema.
	 */
	public static inferSchemaFromExpression(
		context: ITypeScriptToSchemaContext,
		expr: ts.Expression,
		asConst: boolean = false
	): IJsonSchema {
		// expr satisfies Type  (satisfies operator, unwrap and recurse)
		if (ts.isSatisfiesExpression(expr)) {
			return JsonSchemaBuilder.inferSchemaFromExpression(context, expr.expression, asConst);
		}

		// expr as const  or  expr as Type  (as-expression, detect const assertion)
		// TypeScript does not have a dedicated SyntaxKind for `as const`.  Instead the
		// compiler represents it as an AsExpression whose type child is a TypeReferenceNode
		// whose typeName identifier text is literally "const".  Checking for that string is
		// the only reliable way to distinguish `as const` from `as SomeNamedType`.
		if (ts.isAsExpression(expr)) {
			const isConstAssertion =
				// expr as Type  (type reference in the as clause)
				ts.isTypeReferenceNode(expr.type) &&
				// const  (the identifier must be "const")
				ts.isIdentifier(expr.type.typeName) &&
				expr.type.typeName.text === "const";
			return JsonSchemaBuilder.inferSchemaFromExpression(
				context,
				expr.expression,
				isConstAssertion
			);
		}

		if (
			// -42  (prefix unary minus applied to a numeric literal)
			ts.isPrefixUnaryExpression(expr) &&
			expr.operator === ts.SyntaxKind.MinusToken &&
			// 42  (the operand must be a bare numeric literal)
			ts.isNumericLiteral(expr.operand)
		) {
			return asConst ? { const: -Number(expr.operand.text) } : { type: "number" };
		}

		// "hello"  or  `hello`  (plain string or no-substitution template literal)
		if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) {
			return asConst ? { const: expr.text } : { type: "string" };
		}
		// 42  (numeric literal)
		if (ts.isNumericLiteral(expr)) {
			return asConst ? { const: Number(expr.text) } : { type: "number" };
		}
		if (expr.kind === ts.SyntaxKind.TrueKeyword) {
			return asConst ? { const: true } : { type: "boolean" };
		}
		if (expr.kind === ts.SyntaxKind.FalseKeyword) {
			return asConst ? { const: false } : { type: "boolean" };
		}
		if (expr.kind === ts.SyntaxKind.NullKeyword) {
			return asConst ? { const: null } : { type: "null" };
		}
		// { key: "value" }  (object literal expression)
		if (ts.isObjectLiteralExpression(expr)) {
			return JsonSchemaBuilder.inferObjectLiteralSchema(context, expr, asConst);
		}
		// ["a", "b"]  (array literal expression)
		if (ts.isArrayLiteralExpression(expr)) {
			return JsonSchemaBuilder.inferArrayLiteralSchema(context, expr, asConst);
		}

		DiagnosticReporter.report(
			context,
			expr,
			"jsonSchemaBuilder.diagnostic.unsupportedInferredExpressionKind",
			{ kind: ts.SyntaxKind[expr.kind] }
		);
		return {};
	}

	/**
	 * Infer an object schema from an object literal expression, using const or widened types.
	 * @param context The generation context.
	 * @param expr The object literal expression.
	 * @param asConst Whether property value schemas should be exact const types.
	 * @returns The inferred object schema.
	 */
	public static inferObjectLiteralSchema(
		context: ITypeScriptToSchemaContext,
		expr: ts.ObjectLiteralExpression,
		asConst: boolean
	): IJsonSchema {
		const properties: { [key: string]: IJsonSchema } = {};
		const required: string[] = [];
		for (const property of expr.properties) {
			// key: "value"  (named property assignment)
			if (ts.isPropertyAssignment(property)) {
				if (ts.isComputedPropertyName(property.name)) {
					DiagnosticReporter.report(
						context,
						property.name,
						"jsonSchemaBuilder.diagnostic.unsupportedInferredObjectComputedKey",
						{ propertyName: property.name.getText() }
					);
				} else {
					let key: string | undefined;
					// myProp  or  "my-prop"  (identifier or quoted string key)
					if (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) {
						key = property.name.text;
					}
					if (key !== undefined) {
						properties[key] = JsonSchemaBuilder.inferSchemaFromExpression(
							context,
							property.initializer,
							asConst
						);
						required.push(key);
					}
				}
				// { shorthand }  (shorthand property, resolves the variable's type/value)
			} else if (ts.isShorthandPropertyAssignment(property)) {
				const shorthandDeclaration = JsonSchemaBuilder.findVariableDeclaration(
					context.activeSourceFile,
					property.name.text
				);
				if (shorthandDeclaration?.type) {
					properties[property.name.text] =
						JsonSchemaBuilder.mapTypeNodeToSchema(context, shorthandDeclaration.type) ?? {};
					required.push(property.name.text);
				} else if (shorthandDeclaration?.initializer) {
					properties[property.name.text] = JsonSchemaBuilder.inferSchemaFromExpression(
						context,
						shorthandDeclaration.initializer,
						asConst
					);
					required.push(property.name.text);
				} else {
					DiagnosticReporter.report(
						context,
						property,
						"jsonSchemaBuilder.diagnostic.unsupportedInferredObjectMemberKind",
						{ kind: "ShorthandPropertyAssignment", memberName: property.name.text }
					);
				}
				// { ...spread }  (spread assignment, not supported for inference)
			} else if (ts.isSpreadAssignment(property)) {
				DiagnosticReporter.report(
					context,
					property,
					"jsonSchemaBuilder.diagnostic.unsupportedInferredObjectSpread",
					{ expression: property.expression.getText() }
				);
			} else {
				DiagnosticReporter.report(
					context,
					property,
					"jsonSchemaBuilder.diagnostic.unsupportedInferredObjectMemberKind",
					{ kind: ts.SyntaxKind[property.kind] }
				);
			}
		}
		if (Object.keys(properties).length === 0) {
			return { type: "object" };
		}
		return { type: "object", properties, required };
	}

	/**
	 * Infer an array schema from an array literal expression.
	 * For as-const arrays a fixed-length tuple schema is produced; otherwise a plain array schema.
	 * @param context The generation context.
	 * @param expr The array literal expression.
	 * @param asConst Whether to produce a const-exact tuple schema.
	 * @returns The inferred array schema.
	 */
	public static inferArrayLiteralSchema(
		context: ITypeScriptToSchemaContext,
		expr: ts.ArrayLiteralExpression,
		asConst: boolean
	): IJsonSchema {
		if (!asConst || expr.elements.length === 0) {
			return { type: "array" };
		}
		const prefixItems: IJsonSchema[] = [];
		for (const element of expr.elements) {
			// [...items]  or a hole in [1,, 3]  (spread or omitted element, not supported)
			if (ts.isSpreadElement(element) || ts.isOmittedExpression(element)) {
				DiagnosticReporter.report(
					context,
					element,
					"jsonSchemaBuilder.diagnostic.unsupportedInferredTupleElement",
					{ kind: ts.SyntaxKind[element.kind] }
				);
				return { type: "array" };
			}

			prefixItems.push(JsonSchemaBuilder.inferSchemaFromExpression(context, element, true));
		}
		return {
			type: "array",
			prefixItems,
			items: false,
			minItems: prefixItems.length,
			maxItems: prefixItems.length
		};
	}

	/**
	 * Map conditional type nodes (e.g. T extends U ? X : Y) to schema.
	 * @param context The generation context.
	 * @param typeNode The conditional type node.
	 * @returns The mapped schema.
	 */
	public static mapConditionalTypeToSchema(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.ConditionalTypeNode
	): IJsonSchema | undefined {
		const trueSchema = JsonSchemaBuilder.mapTypeNodeToSchema(context, typeNode.trueType);
		const falseSchema = JsonSchemaBuilder.mapTypeNodeToSchema(context, typeNode.falseType);

		if (!trueSchema && !falseSchema) {
			return undefined;
		}

		if (trueSchema && falseSchema) {
			if (JsonHelper.canonicalize(trueSchema) === JsonHelper.canonicalize(falseSchema)) {
				return trueSchema;
			}

			return {
				anyOf: [trueSchema, falseSchema]
			};
		}

		return trueSchema ?? falseSchema;
	}

	/**
	 * Map indexed access type nodes (e.g. T["id"]) to schema.
	 * @param context The generation context.
	 * @param typeNode The indexed access type node.
	 * @returns The mapped schema.
	 */
	public static mapIndexedAccessTypeToSchema(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.IndexedAccessTypeNode
	): IJsonSchema | undefined {
		const baseSchema =
			JsonSchemaBuilder.resolveUtilityBaseObjectSchema(context, typeNode.objectType) ??
			JsonSchemaBuilder.mapTypeNodeToSchema(context, typeNode.objectType);
		if (!baseSchema) {
			return undefined;
		}

		const indexKeys = JsonSchemaBuilder.extractIndexedAccessKeys(context, typeNode.indexType);
		if (indexKeys.length === 0) {
			if (
				typeNode.indexType.kind === ts.SyntaxKind.NumberKeyword &&
				baseSchema.type === "array" &&
				Is.object(baseSchema.items)
			) {
				return ObjectHelper.clone(baseSchema.items);
			}

			if (
				typeNode.indexType.kind === ts.SyntaxKind.NumberKeyword &&
				baseSchema.type === "array" &&
				Is.array(baseSchema.prefixItems)
			) {
				const uniquePrefixSchemas = baseSchema.prefixItems.filter((schema, index, allSchemas) => {
					const schemaKey = JsonHelper.canonicalize(schema);
					return allSchemas.findIndex(s => JsonHelper.canonicalize(s) === schemaKey) === index;
				});

				if (uniquePrefixSchemas.length === 1) {
					return ObjectHelper.clone(uniquePrefixSchemas[0]);
				}

				if (uniquePrefixSchemas.length > 1) {
					return {
						anyOf: uniquePrefixSchemas.map(schema => ObjectHelper.clone(schema))
					};
				}
			}

			if (
				(typeNode.indexType.kind === ts.SyntaxKind.StringKeyword ||
					typeNode.indexType.kind === ts.SyntaxKind.NumberKeyword) &&
				Is.object(baseSchema.additionalProperties)
			) {
				return ObjectHelper.clone(baseSchema.additionalProperties);
			}

			return undefined;
		}

		const resolvedPropertySchemas = indexKeys
			.map(indexKey =>
				ObjectTransformer.resolvePropertySchemaFromObjectSchema(baseSchema, indexKey)
			)
			.filter((schema): schema is IJsonSchema => schema !== undefined);

		if (resolvedPropertySchemas.length === 0) {
			return undefined;
		}

		const uniqueSchemas = resolvedPropertySchemas.filter((schema, index, allSchemas) => {
			const schemaKey = JsonHelper.canonicalize(schema);
			return allSchemas.findIndex(s => JsonHelper.canonicalize(s) === schemaKey) === index;
		});

		if (uniqueSchemas.length === 1) {
			return uniqueSchemas[0];
		}

		return {
			anyOf: uniqueSchemas
		};
	}

	/**
	 * Map template literal type nodes to string schemas.
	 * @param context The generation context.
	 * @param typeNode The template literal type node.
	 * @returns The mapped schema.
	 */
	public static mapTemplateLiteralTypeToSchema(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TemplateLiteralTypeNode
	): IJsonSchema {
		const templatePattern = TemplateLiteralPatternBuilder.buildTemplateLiteralPattern(typeNode);
		if (!templatePattern) {
			DiagnosticReporter.report(
				context,
				typeNode,
				"jsonSchemaBuilder.diagnostic.unsupportedTemplateLiteralSpan",
				{ type: typeNode.getText() }
			);
		}

		return templatePattern
			? {
					type: "string",
					pattern: templatePattern
				}
			: {
					type: "string"
				};
	}

	/**
	 * Map mapped type nodes to object schemas.
	 * @param context The generation context.
	 * @param typeNode The mapped type node.
	 * @returns The mapped schema.
	 */
	public static mapMappedTypeToSchema(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.MappedTypeNode
	): IJsonSchema | undefined {
		const mappedTypeParameterName = typeNode.typeParameter.name.text;
		const mappedKeys = JsonSchemaBuilder.extractMappedTypeKeys(
			context,
			typeNode.typeParameter.constraint
		);
		const sourceObjectSchema = JsonSchemaBuilder.resolveMappedTypeSourceObjectSchema(
			context,
			typeNode
		);
		const mappedEntries = MappedTypeSchemaResolver.resolveMappedTypePropertyEntries(
			context,
			typeNode,
			mappedKeys,
			mappedTypeParameterName
		);

		if (mappedEntries === undefined) {
			DiagnosticReporter.report(
				context,
				typeNode,
				"jsonSchemaBuilder.diagnostic.unresolvedMappedTypeRemap",
				{
					typeName: typeNode.typeParameter.name.text
				}
			);
			return MappedTypeSchemaResolver.buildMappedTypeFallbackSchema(
				context,
				typeNode,
				mappedKeys,
				mappedTypeParameterName,
				sourceObjectSchema
			);
		}

		if (sourceObjectSchema && JsonSchemaBuilder.isHomomorphicMappedType(typeNode)) {
			const mappedSchema = ObjectTransformer.toInlineUtilityObjectSchema(sourceObjectSchema);
			JsonSchemaBuilder.applyMappedTypeOptionality(mappedSchema, typeNode.questionToken);
			return mappedSchema;
		}

		const properties: { [key: string]: IJsonSchema } = {};
		for (const mappedEntry of mappedEntries) {
			const propertySchema = JsonSchemaBuilder.mapMappedTypePropertySchema(
				context,
				typeNode,
				mappedEntry.sourceKey,
				mappedTypeParameterName,
				sourceObjectSchema
			);
			if (propertySchema) {
				const existingPropertySchema = properties[mappedEntry.mappedKey];
				properties[mappedEntry.mappedKey] = existingPropertySchema
					? MappedTypeSchemaResolver.mergeMappedTypePropertySchemas(
							existingPropertySchema,
							propertySchema
						)
					: propertySchema;
			}
		}

		if (mappedKeys.length > 0 && mappedEntries.length === 0) {
			return {
				type: "object"
			};
		}

		if (Object.keys(properties).length > 0) {
			let requiredPropertyKeys = Object.keys(properties);
			if (
				typeNode.questionToken === undefined &&
				sourceObjectSchema &&
				JsonSchemaBuilder.isMappedTypeIndexedValueByTypeParameter(typeNode, mappedTypeParameterName)
			) {
				const sourceRequiredKeys =
					MappedTypeSchemaResolver.resolveMappedTypeSourceRequiredPropertyKeys(
						mappedEntries,
						sourceObjectSchema
					);
				if (sourceRequiredKeys) {
					requiredPropertyKeys = sourceRequiredKeys;
				}
			}

			const mappedSchema: IJsonSchema = {
				type: "object",
				properties
			};
			JsonSchemaBuilder.applyMappedTypeRequiredKeys(
				mappedSchema,
				requiredPropertyKeys,
				typeNode.questionToken
			);
			return mappedSchema;
		}

		const additionalProperties = typeNode.type
			? (JsonSchemaBuilder.mapTypeNodeToSchema(context, typeNode.type) ?? {})
			: {};

		return {
			type: "object",
			additionalProperties
		};
	}

	/**
	 * Determine whether a mapped type value uses indexed access with the mapped key parameter.
	 * @param typeNode The mapped type node.
	 * @param mappedTypeParameterName The mapped type parameter name.
	 * @returns True if the value shape is based on source indexed access.
	 */
	public static isMappedTypeIndexedValueByTypeParameter(
		typeNode: ts.MappedTypeNode,
		mappedTypeParameterName: string
	): boolean {
		return (
			typeNode.type !== undefined &&
			// T[K]  (value type is an indexed access)
			ts.isIndexedAccessTypeNode(typeNode.type) &&
			JsonSchemaBuilder.isMappedTypeParameterReference(
				typeNode.type.indexType,
				mappedTypeParameterName
			)
		);
	}

	/**
	 * Check whether a type node is allowed for schema generation.
	 * @param context The generation context.
	 * @param typeNode The type node to inspect.
	 * @param propertyName The optional property name when the type is a property type.
	 * @param enclosingObjectName The optional enclosing object name when the type is a property type.
	 * @returns True when the type is allowed.
	 */
	public static checkTypeNodeAllowed(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeNode,
		propertyName?: string,
		enclosingObjectName?: string
	): boolean {
		const disallowedTypeName = DisallowedTypeGuard.getDisallowedTypeName(typeNode);
		if (disallowedTypeName) {
			if (Is.stringValue(propertyName) && Is.stringValue(enclosingObjectName)) {
				context.activeDisallowedType = {
					disallowedTypeName,
					propertyName,
					enclosingObjectName
				};
			}

			return false;
		}

		return true;
	}

	/**
	 * Determine whether a property type should be treated as a function and skipped.
	 * @param typeNode The property type node.
	 * @returns True if the property type is function-like.
	 */
	public static isFunctionPropertyType(typeNode: ts.TypeNode): boolean {
		if (ts.isParenthesizedTypeNode(typeNode)) {
			return JsonSchemaBuilder.isFunctionPropertyType(typeNode.type);
		}

		if (ts.isFunctionTypeNode(typeNode) || ts.isConstructorTypeNode(typeNode)) {
			return true;
		}

		if (ts.isTypeReferenceNode(typeNode)) {
			const typeName = ts.isIdentifier(typeNode.typeName)
				? typeNode.typeName.text
				: typeNode.typeName.right.text;
			return typeName === "Function";
		}

		return false;
	}

	/**
	 * Determine whether a type node represents symbol or unique symbol.
	 * @param typeNode The type node to inspect.
	 * @returns True when the type is symbol or unique symbol.
	 */
	public static isSymbolTypeNode(typeNode: ts.TypeNode): boolean {
		// (symbol)  (parenthesised type, unwrap and recurse)
		if (ts.isParenthesizedTypeNode(typeNode)) {
			return JsonSchemaBuilder.isSymbolTypeNode(typeNode.type);
		}

		if (typeNode.kind === ts.SyntaxKind.SymbolKeyword) {
			return true;
		}

		// unique symbol  (unique symbol type operator)
		if (
			ts.isTypeOperatorNode(typeNode) &&
			typeNode.operator === ts.SyntaxKind.UniqueKeyword &&
			typeNode.type.kind === ts.SyntaxKind.SymbolKeyword
		) {
			return true;
		}

		return false;
	}

	/**
	 * Determine whether a computed property expression references a symbol.
	 * Covers well-known symbols (Symbol.iterator, etc.) and const variables
	 * declared with a unique symbol type annotation.
	 * @param context The generation context.
	 * @param expression The computed property expression.
	 * @returns True when the key is symbol-based.
	 */
	public static isSymbolKeyedComputedExpression(
		context: ITypeScriptToSchemaContext,
		expression: ts.Expression
	): boolean {
		if (
			// Symbol.iterator  (property access on the Symbol object)
			ts.isPropertyAccessExpression(expression) &&
			// Symbol  (the object must be the bare "Symbol" identifier)
			ts.isIdentifier(expression.expression) &&
			expression.expression.text === "Symbol"
		) {
			return true;
		}

		// mySymbol  (identifier whose const declaration has a Symbol type)
		if (ts.isIdentifier(expression)) {
			const decl = JsonSchemaBuilder.findConstVariableDeclaration(context, expression.text);
			if (decl?.type && JsonSchemaBuilder.isSymbolTypeNode(decl.type)) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Extract a property name from TypeScript property syntax.
	 * Computed names are resolved when they evaluate to concrete literals.
	 * @param context The generation context.
	 * @param propertyName The property name node.
	 * @returns The normalized property name.
	 */
	public static extractPropertyName(
		context: ITypeScriptToSchemaContext,
		propertyName: ts.PropertyName
	): string | undefined {
		// myProp  or  #privateField  (identifier or private-identifier property name)
		if (ts.isIdentifier(propertyName) || ts.isPrivateIdentifier(propertyName)) {
			return propertyName.text;
		}

		// "my-prop"  or  0  (string or numeric literal property name)
		if (ts.isStringLiteral(propertyName) || ts.isNumericLiteral(propertyName)) {
			return propertyName.text;
		}

		// [computedKey]  (computed property name)
		if (ts.isComputedPropertyName(propertyName)) {
			if (JsonSchemaBuilder.isSymbolKeyedComputedExpression(context, propertyName.expression)) {
				DiagnosticReporter.report(
					context,
					propertyName,
					"jsonSchemaBuilder.diagnostic.symbolKeyedMember",
					{
						memberName: propertyName.getText()
					}
				);
			} else {
				const computedPropertyName = JsonSchemaBuilder.resolveComputedPropertyNameExpression(
					context,
					propertyName.expression,
					new Set<string>()
				);
				if (Is.stringValue(computedPropertyName)) {
					return computedPropertyName;
				}

				DiagnosticReporter.report(
					context,
					propertyName,
					"jsonSchemaBuilder.diagnostic.unsupportedComputedPropertyName",
					{
						propertyName: propertyName.getText()
					}
				);
			}
		}

		return undefined;
	}

	/**
	 * Find a variable declaration by name in a source file.
	 * @param sourceFile The source file to search.
	 * @param variableName The variable name.
	 * @returns The declaration if found.
	 */
	public static findVariableDeclaration(
		sourceFile: ts.SourceFile | undefined,
		variableName: string
	): ts.VariableDeclaration | undefined {
		if (!sourceFile) {
			return undefined;
		}

		for (const statement of sourceFile.statements) {
			// const foo = ...  or  let foo = ...  (any variable statement)
			if (ts.isVariableStatement(statement)) {
				for (const declaration of statement.declarationList.declarations) {
					// foo  (plain identifier binding matching the requested name)
					if (ts.isIdentifier(declaration.name) && declaration.name.text === variableName) {
						return declaration;
					}
				}
			}
		}

		return undefined;
	}

	/**
	 * Resolve a schema for an imported identifier used in a type query.
	 * @param context The generation context.
	 * @param localName The local imported symbol name.
	 * @returns The mapped schema if resolvable.
	 */
	public static resolveImportedTypeQuerySchema(
		context: ITypeScriptToSchemaContext,
		localName: string
	): IJsonSchema | undefined {
		const sourceFile = context.activeSourceFile;
		if (!sourceFile) {
			return undefined;
		}

		for (const statement of sourceFile.statements) {
			// import { localName } from "./module.js"  (relative named import)
			if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
				if (statement.moduleSpecifier.text.startsWith(".")) {
					const bindings = statement.importClause?.namedBindings;
					// { Named, Import }  (named import bindings)
					if (bindings && ts.isNamedImports(bindings)) {
						const importElement = bindings.elements.find(el => el.name.text === localName);
						if (importElement) {
							const importedName = importElement.propertyName?.text ?? importElement.name.text;
							const resolvedPath = FileUtils.resolveImportSourceFilePath(
								sourceFile.fileName,
								statement.moduleSpecifier.text
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
							const importedDeclaration = JsonSchemaBuilder.findVariableDeclaration(
								importedSourceFile,
								importedName
							);
							if (!importedDeclaration) {
								return undefined;
							}

							const importedContext: ITypeScriptToSchemaContext = {
								...context,
								activeSourceFile: importedSourceFile
							};

							if (importedDeclaration.type) {
								return (
									JsonSchemaBuilder.mapTypeNodeToSchema(
										importedContext,
										importedDeclaration.type
									) ?? {}
								);
							}

							if (importedDeclaration.initializer) {
								return JsonSchemaBuilder.inferSchemaFromExpression(
									importedContext,
									importedDeclaration.initializer
								);
							}

							return undefined;
						}
					}
				}
			}
		}

		return undefined;
	}

	/**
	 * Resolve computed property name expressions when they can be evaluated to concrete keys.
	 * @param context The generation context.
	 * @param expression The computed property expression.
	 * @param resolvingIdentifiers Identifier names currently being resolved.
	 * @returns The resolved property key.
	 */
	public static resolveComputedPropertyNameExpression(
		context: ITypeScriptToSchemaContext,
		expression: ts.Expression,
		resolvingIdentifiers: Set<string>
	): string | undefined {
		if (
			// "key"  or  `key`  or  42  (literal expressions resolve directly)
			ts.isStringLiteral(expression) ||
			ts.isNoSubstitutionTemplateLiteral(expression) ||
			ts.isNumericLiteral(expression)
		) {
			return expression.text;
		}

		// ("key")  (parenthesised expression, unwrap and recurse)
		if (ts.isParenthesizedExpression(expression)) {
			return JsonSchemaBuilder.resolveComputedPropertyNameExpression(
				context,
				expression.expression,
				resolvingIdentifiers
			);
		}

		// expr as Type  or  <Type>expr  (cast expression, unwrap and recurse)
		if (ts.isAsExpression(expression) || ts.isTypeAssertionExpression(expression)) {
			return JsonSchemaBuilder.resolveComputedPropertyNameExpression(
				context,
				expression.expression,
				resolvingIdentifiers
			);
		}

		// expr satisfies Type  (satisfies operator, unwrap and recurse)
		if (ts.isSatisfiesExpression(expression)) {
			return JsonSchemaBuilder.resolveComputedPropertyNameExpression(
				context,
				expression.expression,
				resolvingIdentifiers
			);
		}

		if (
			// -42  or  +42  (prefix unary numeric expression)
			ts.isPrefixUnaryExpression(expression) &&
			(expression.operator === ts.SyntaxKind.MinusToken ||
				expression.operator === ts.SyntaxKind.PlusToken)
		) {
			const operandValue = JsonSchemaBuilder.resolveComputedPropertyNameExpression(
				context,
				expression.operand,
				resolvingIdentifiers
			);
			if (Is.stringValue(operandValue) && /^\d+(?:\.\d+)?$/.test(operandValue)) {
				return expression.operator === ts.SyntaxKind.MinusToken ? `-${operandValue}` : operandValue;
			}
		}

		// `prefix-${expr}`  (template expression, resolve spans recursively)
		if (ts.isTemplateExpression(expression)) {
			let resolvedKey = expression.head.text;
			for (const span of expression.templateSpans) {
				const spanValue = JsonSchemaBuilder.resolveComputedPropertyNameExpression(
					context,
					span.expression,
					resolvingIdentifiers
				);
				if (!Is.stringValue(spanValue)) {
					return undefined;
				}
				resolvedKey += `${spanValue}${span.literal.text}`;
			}

			return resolvedKey;
		}

		// myConst  (identifier, resolve via const variable declaration)
		if (ts.isIdentifier(expression)) {
			if (resolvingIdentifiers.has(expression.text)) {
				return undefined;
			}

			const constDeclaration = JsonSchemaBuilder.findConstVariableDeclaration(
				context,
				expression.text
			);
			if (constDeclaration?.initializer) {
				resolvingIdentifiers.add(expression.text);
				const identifierValue = JsonSchemaBuilder.resolveComputedPropertyNameExpression(
					context,
					constDeclaration.initializer,
					resolvingIdentifiers
				);
				resolvingIdentifiers.delete(expression.text);
				return identifierValue;
			}
		}

		// OBJ.property  (property access on a known identifier, resolve via const object)
		if (ts.isPropertyAccessExpression(expression) && ts.isIdentifier(expression.expression)) {
			const objectName = expression.expression.text;
			const propertyName = expression.name.text;

			const importedValue = JsonSchemaBuilder.resolveConstObjectProperty(
				context,
				objectName,
				propertyName
			);
			if (importedValue !== undefined) {
				return `${importedValue}`;
			}

			const localValue = JsonSchemaBuilder.resolveLocalConstObjectProperty(
				context,
				objectName,
				propertyName
			);
			if (localValue !== undefined) {
				return `${localValue}`;
			}
		}

		return undefined;
	}

	/**
	 * Find a local const variable declaration in the active source file.
	 * @param context The generation context.
	 * @param variableName The variable name.
	 * @returns The declaration when found.
	 */
	public static findConstVariableDeclaration(
		context: ITypeScriptToSchemaContext,
		variableName: string
	): ts.VariableDeclaration | undefined {
		const sourceFile = context.activeSourceFile;
		if (!sourceFile) {
			return undefined;
		}

		for (const statement of sourceFile.statements) {
			if (
				// const myVar = ...  (const variable statement)
				ts.isVariableStatement(statement) &&
				statement.declarationList.flags === ts.NodeFlags.Const
			) {
				for (const declaration of statement.declarationList.declarations) {
					// myVar  (plain identifier binding matching the requested name)
					if (ts.isIdentifier(declaration.name) && declaration.name.text === variableName) {
						return declaration;
					}
				}
			}
		}

		return undefined;
	}

	/**
	 * Resolve a property value from a local const object declaration.
	 * @param context The generation context.
	 * @param objectName The const object name.
	 * @param propertyName The property to resolve.
	 * @returns The resolved value when available.
	 */
	public static resolveLocalConstObjectProperty(
		context: ITypeScriptToSchemaContext,
		objectName: string,
		propertyName: string
	): string | number | undefined {
		const objectDeclaration = JsonSchemaBuilder.findConstVariableDeclaration(context, objectName);
		if (!objectDeclaration) {
			return undefined;
		}

		const valueFromInitializer =
			JsonSchemaBuilder.extractConstObjectPropertyFromDeclarationInitializer(
				objectDeclaration,
				propertyName
			);
		if (valueFromInitializer !== undefined) {
			return valueFromInitializer;
		}

		if (objectDeclaration.type) {
			return JsonSchemaBuilder.extractConstObjectPropertyFromDeclarationType(
				objectDeclaration.type,
				propertyName
			);
		}

		return undefined;
	}

	/**
	 * Map a tuple type node to schema.
	 * @param context The generation context.
	 * @param tupleTypeNode The tuple type node.
	 * @returns The mapped tuple schema.
	 */
	public static mapTupleTypeToSchema(
		context: ITypeScriptToSchemaContext,
		tupleTypeNode: ts.TupleTypeNode
	): IJsonSchema | undefined {
		const fixedSchemas: IJsonSchema[] = [];
		let restSchema: IJsonSchema | undefined;
		let restIndex = -1;

		for (const [index, element] of tupleTypeNode.elements.entries()) {
			const tupleElementType = Utility.extractTupleElementType(element);
			if (!tupleElementType) {
				return undefined;
			}

			const mappedSchema = JsonSchemaBuilder.mapTypeNodeToSchema(context, tupleElementType);
			if (!mappedSchema) {
				return undefined;
			}

			// ...string[]  (rest element in tuple)
			if (ts.isRestTypeNode(element)) {
				restSchema = JsonSchemaBuilder.extractRestElementSchema(context, element.type);
				restIndex = index;
				if (!restSchema) {
					return undefined;
				}
			} else {
				fixedSchemas.push(mappedSchema);
			}
		}

		if (!restSchema) {
			return {
				type: "array",
				prefixItems: fixedSchemas,
				items: false,
				minItems: fixedSchemas.length,
				maxItems: fixedSchemas.length
			};
		}

		const prefixCount = restIndex > -1 ? restIndex : fixedSchemas.length;
		const prefixItems = fixedSchemas.slice(0, prefixCount);
		const suffixItems = restIndex > -1 ? fixedSchemas.slice(prefixCount) : [];

		if (suffixItems.length === 0) {
			return {
				type: "array",
				prefixItems: prefixItems.length > 0 ? prefixItems : undefined,
				items: restSchema,
				minItems: prefixItems.length
			};
		}

		const anyOfItemSchemas = [restSchema, ...suffixItems];
		const uniqueAnyOfSchemas = anyOfItemSchemas.filter((schema, index, allSchemas) => {
			const schemaKey = JsonHelper.canonicalize(schema);
			return allSchemas.findIndex(s => JsonHelper.canonicalize(s) === schemaKey) === index;
		});

		const effectivePrefixItems = prefixItems;
		const restSchemaKey = JsonHelper.canonicalize(restSchema);

		const uniqueSuffixCandidate = suffixItems.find(
			schema => JsonHelper.canonicalize(schema) !== restSchemaKey
		);
		const exactSingleUniqueSuffixConstraint =
			restIndex === 0 &&
			suffixItems.length > 1 &&
			uniqueSuffixCandidate &&
			suffixItems.filter(
				schema => JsonHelper.canonicalize(schema) === JsonHelper.canonicalize(uniqueSuffixCandidate)
			).length === 1
				? {
						contains: uniqueSuffixCandidate,
						minContains: 1,
						maxContains: 1
					}
				: {};

		return {
			type: "array",
			prefixItems: effectivePrefixItems.length > 0 ? effectivePrefixItems : undefined,
			items:
				uniqueAnyOfSchemas.length === 1 ? uniqueAnyOfSchemas[0] : { anyOf: uniqueAnyOfSchemas },
			minItems: effectivePrefixItems.length + suffixItems.length,
			...exactSingleUniqueSuffixConstraint
		};
	}

	/**
	 * Extract schema for a tuple rest element.
	 * @param context The generation context.
	 * @param restElementType The rest element type.
	 * @returns The mapped rest element schema.
	 */
	public static extractRestElementSchema(
		context: ITypeScriptToSchemaContext,
		restElementType: ts.TypeNode
	): IJsonSchema | undefined {
		// string[]  (array form of rest element type, e.g. ...string[])
		if (ts.isArrayTypeNode(restElementType)) {
			return JsonSchemaBuilder.mapTypeNodeToSchema(context, restElementType.elementType);
		}

		return JsonSchemaBuilder.mapTypeNodeToSchema(context, restElementType);
	}

	/**
	 * Find an existing schema id by title in known package schemas.
	 * @param context The generation context.
	 * @param schemaTitle The schema title to find.
	 * @returns The existing schema id if found.
	 */
	public static findExistingSchemaIdByTitle(
		context: ITypeScriptToSchemaContext,
		schemaTitle: string
	): string | undefined {
		for (const packageSchemaEntries of Object.values(context.schemas)) {
			const existingSchema = packageSchemaEntries[schemaTitle];
			if (existingSchema?.$id) {
				return existingSchema.$id;
			}
		}

		return undefined;
	}

	/**
	 * Apply interface inheritance (`extends`) as `allOf` references.
	 * @param context The generation context.
	 * @param schema The schema to expand.
	 * @param declaration The interface declaration.
	 */
	public static applyInterfaceExtendsSchema(
		context: ITypeScriptToSchemaContext,
		schema: Partial<IJsonSchema>,
		declaration: ts.InterfaceDeclaration
	): void {
		const extendsClause = declaration.heritageClauses?.find(
			clause => clause.token === ts.SyntaxKind.ExtendsKeyword
		);
		if (!extendsClause) {
			return;
		}

		const allOfRefs: IJsonSchema[] = [];
		for (const extendedType of extendsClause.types) {
			const expression = extendedType.expression;
			let typeName: string | undefined;
			// interface IFoo extends BaseType  (plain identifier in extends clause)
			if (ts.isIdentifier(expression)) {
				typeName = expression.text;
				// interface IFoo extends Namespace.BaseType  (qualified extends expression)
			} else if (ts.isPropertyAccessExpression(expression)) {
				typeName = expression.name.text;
			}

			if (typeName) {
				// interface IFoo extends Partial<T>  (utility type in extends, identifier guard)
				// A heritage clause expression is an Identifier node, not a TypeReferenceNode,
				// so it cannot be passed directly to mapTypeNodeToSchema.  A synthetic
				// TypeReferenceNode is constructed here using the same expression + type
				// arguments so the utility handler receives exactly the AST shape it expects.
				if (JsonSchemaBuilder._utilityTypeHandlers[typeName] && ts.isIdentifier(expression)) {
					const syntheticTypeNode = ts.factory.createTypeReferenceNode(
						expression,
						extendedType.typeArguments
					);
					const mappedSchema = JsonSchemaBuilder.mapTypeNodeToSchema(context, syntheticTypeNode);
					if (mappedSchema) {
						allOfRefs.push(mappedSchema);
					}
				} else {
					const title = StringHelper.stripPrefix(typeName);
					const existingSchemaId = JsonSchemaBuilder.findExistingSchemaIdByTitle(context, title);
					allOfRefs.push({
						$ref: existingSchemaId ?? `${context.namespace}${title}`
					});
				}
			}
		}

		if (allOfRefs.length > 0) {
			schema.allOf = allOfRefs;
		}
	}

	/**
	 * Map Partial<T> to an object schema with no required properties.
	 * @param context The generation context.
	 * @param typeNode The Partial type reference.
	 * @returns The mapped schema.
	 */
	public static mapPartialUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode
	): IJsonSchema | undefined {
		return UtilityTypeSchemaMapper.mapPartialUtilityType(context, typeNode, (ctx, baseTypeNode) =>
			JsonSchemaBuilder.resolveUtilityBaseObjectSchema(ctx, baseTypeNode)
		);
	}

	/**
	 * Map Required<T> to an object schema with all properties required.
	 * @param context The generation context.
	 * @param typeNode The Required type reference.
	 * @returns The mapped schema.
	 */
	public static mapRequiredUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode
	): IJsonSchema | undefined {
		return UtilityTypeSchemaMapper.mapRequiredUtilityType(context, typeNode, (ctx, baseTypeNode) =>
			JsonSchemaBuilder.resolveUtilityBaseObjectSchema(ctx, baseTypeNode)
		);
	}

	/**
	 * Map Pick<T, K> to an object schema with selected keys preserved.
	 * @param context The generation context.
	 * @param typeNode The Pick type reference.
	 * @returns The mapped schema.
	 */
	public static mapPickUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode
	): IJsonSchema | undefined {
		return UtilityTypeSchemaMapper.mapPickUtilityType(
			context,
			typeNode,
			(ctx, baseTypeNode) => JsonSchemaBuilder.resolveUtilityBaseObjectSchema(ctx, baseTypeNode),
			(ctx, keysNode) => JsonSchemaBuilder.extractUtilityTypeKeys(ctx, keysNode)
		);
	}

	/**
	 * Map Omit<T, K> to an object schema with selected keys removed.
	 * @param context The generation context.
	 * @param typeNode The Omit type reference.
	 * @returns The mapped schema.
	 */
	public static mapOmitUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode
	): IJsonSchema | undefined {
		return UtilityTypeSchemaMapper.mapOmitUtilityType(
			context,
			typeNode,
			(ctx, baseTypeNode) => JsonSchemaBuilder.resolveUtilityBaseObjectSchema(ctx, baseTypeNode),
			(ctx, keysNode) => JsonSchemaBuilder.extractUtilityTypeKeys(ctx, keysNode)
		);
	}

	/**
	 * Map Exclude<T, U> to a schema that removes U members from T.
	 * @param context The generation context.
	 * @param typeNode The Exclude type reference.
	 * @returns The mapped schema.
	 */
	public static mapExcludeUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode
	): IJsonSchema | undefined {
		return UtilityTypeSchemaMapper.mapExcludeUtilityType(context, typeNode, (ctx, node) =>
			JsonSchemaBuilder.mapTypeNodeToSchema(ctx, node)
		);
	}

	/**
	 * Map Extract<T, U> to a schema that keeps U members from T.
	 * @param context The generation context.
	 * @param typeNode The Extract type reference.
	 * @returns The mapped schema.
	 */
	public static mapExtractUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode
	): IJsonSchema | undefined {
		return UtilityTypeSchemaMapper.mapExtractUtilityType(context, typeNode, (ctx, node) =>
			JsonSchemaBuilder.mapTypeNodeToSchema(ctx, node)
		);
	}

	/**
	 * Map NonNullable<T> by removing null and undefined branches from T.
	 * @param context The generation context.
	 * @param typeNode The NonNullable type reference.
	 * @returns The mapped schema.
	 */
	public static mapNonNullableUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode
	): IJsonSchema | undefined {
		return UtilityTypeSchemaMapper.mapNonNullableUtilityType(context, typeNode, (ctx, node) =>
			JsonSchemaBuilder.mapTypeNodeToSchema(ctx, node)
		);
	}

	/**
	 * Map Record<K, V> to an object schema with key constraints where possible.
	 * @param context The generation context.
	 * @param typeNode The Record type reference.
	 * @returns The mapped schema.
	 */
	public static mapRecordUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode
	): IJsonSchema | undefined {
		return UtilityTypeSchemaMapper.mapRecordUtilityType(context, typeNode, (ctx, node) =>
			JsonSchemaBuilder.mapTypeNodeToSchema(ctx, node)
		);
	}

	/**
	 * Determine whether a type node represents null or undefined.
	 * @param typeNode The type node.
	 * @returns True if the node is null or undefined.
	 */
	public static isNullOrUndefinedTypeNode(typeNode: ts.TypeNode): boolean {
		if (
			// null  or  undefined  (keyword type nodes)
			typeNode.kind === ts.SyntaxKind.NullKeyword ||
			typeNode.kind === ts.SyntaxKind.UndefinedKeyword
		) {
			return true;
		}

		// null  (literal type wrapping the null keyword, e.g. from union members)
		if (ts.isLiteralTypeNode(typeNode)) {
			return typeNode.literal.kind === ts.SyntaxKind.NullKeyword;
		}

		// undefined  (type reference whose name is the identifier "undefined")
		if (ts.isTypeReferenceNode(typeNode) && ts.isIdentifier(typeNode.typeName)) {
			return typeNode.typeName.text === "undefined";
		}

		return false;
	}

	/**
	 * Extract literal keys from a Record key type argument.
	 * @param keyTypeNode The key type argument node.
	 * @returns The extracted literal keys.
	 */
	public static extractRecordLiteralKeys(keyTypeNode: ts.TypeNode): string[] {
		// "key"  (single string literal key type, e.g. Record<"key", V>)
		if (ts.isLiteralTypeNode(keyTypeNode) && ts.isStringLiteral(keyTypeNode.literal)) {
			return [keyTypeNode.literal.text];
		}

		// "a" | "b" | "c"  (union of string literal key types)
		if (ts.isUnionTypeNode(keyTypeNode)) {
			const keys = keyTypeNode.types
				// "key"  (each member must be a string literal type)
				.filter(type => ts.isLiteralTypeNode(type) && ts.isStringLiteral(type.literal))
				.map(type => (type as ts.LiteralTypeNode).literal as ts.StringLiteral)
				.map(literal => literal.text);
			return keys.length === keyTypeNode.types.length ? keys : [];
		}

		return [];
	}

	/**
	 * Map JsonLdObject utility types using key-removal and optional key-addition rules.
	 * @param context The generation context.
	 * @param typeNode The JsonLdObject utility type reference.
	 * @param options Mapping options.
	 * @param options.keysToRemove Keys to remove from the base schema.
	 * @param options.keyToAdd Optional key to add to the base schema.
	 * @param options.isAddedKeyRequired Whether the added key should be required.
	 * @returns The mapped schema.
	 */
	public static mapJsonLdObjectUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode,
		options: {
			keysToRemove: string[];
			keyToAdd?: "id" | "@id" | "type" | "@type" | "@context";
			isAddedKeyRequired?: boolean;
		}
	): IJsonSchema | undefined {
		return UtilityTypeSchemaMapper.mapJsonLdObjectUtilityType(
			context,
			typeNode,
			options,
			(ctx, baseTypeNode) => JsonSchemaBuilder.resolveUtilityBaseObjectSchema(ctx, baseTypeNode),
			(ctx, node) => JsonSchemaBuilder.mapTypeNodeToSchema(ctx, node)
		);
	}

	/**
	 * Resolve a default schema for JsonLdObject utility key additions when the type argument is omitted.
	 * @param baseSchema The base object schema.
	 * @param keyToAdd The key being added by the utility.
	 * @returns The resolved schema.
	 */
	public static mapJsonLdObjectDefaultSchemaByKey(
		baseSchema: IJsonSchema,
		keyToAdd: "id" | "@id" | "type" | "@type" | "@context"
	): IJsonSchema {
		if (keyToAdd === "id" || keyToAdd === "@id") {
			return JsonSchemaBuilder.mapJsonLdObjectWithIdDefaultIdSchema(baseSchema);
		}

		if (keyToAdd === "@context") {
			return JsonSchemaBuilder.mapJsonLdObjectWithContextDefaultContextSchema(baseSchema);
		}

		return JsonSchemaBuilder.mapJsonLdObjectWithTypeDefaultTypeSchema(baseSchema);
	}

	/**
	 * Resolve default id schema for JsonLdObjectWithId when Id type argument is omitted.
	 * @param baseSchema The base object schema.
	 * @returns The resolved id schema.
	 */
	public static mapJsonLdObjectWithIdDefaultIdSchema(baseSchema: IJsonSchema): IJsonSchema {
		return JsonSchemaBuilder.mapJsonLdObjectDefaultEitherSchema(baseSchema, "id", "@id", {
			type: "string"
		});
	}

	/**
	 * Resolve default type schema for JsonLdObjectWithType when Type argument is omitted.
	 * @param baseSchema The base object schema.
	 * @returns The resolved type schema.
	 */
	public static mapJsonLdObjectWithTypeDefaultTypeSchema(baseSchema: IJsonSchema): IJsonSchema {
		return JsonSchemaBuilder.mapJsonLdObjectDefaultEitherSchema(baseSchema, "type", "@type", {
			anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }]
		});
	}

	/**
	 * Resolve default context schema for JsonLdObjectWithContext when Context argument is omitted.
	 * @param baseSchema The base object schema.
	 * @returns The resolved context schema.
	 */
	public static mapJsonLdObjectWithContextDefaultContextSchema(
		baseSchema: IJsonSchema
	): IJsonSchema {
		return JsonSchemaBuilder.mapJsonLdObjectDefaultEitherSchema(
			baseSchema,
			"@context",
			"@context",
			{
				type: "array",
				items: { type: "string" }
			}
		);
	}

	/**
	 * Resolve default schema from either of two source keys, with fallback when both are absent.
	 * @param baseSchema The base object schema.
	 * @param firstKey The primary key to resolve.
	 * @param secondKey The secondary key to resolve.
	 * @param fallbackSchema The fallback schema.
	 * @returns The resolved schema.
	 */
	public static mapJsonLdObjectDefaultEitherSchema(
		baseSchema: IJsonSchema,
		firstKey: string,
		secondKey: string,
		fallbackSchema: IJsonSchema
	): IJsonSchema {
		const firstSchema = ObjectTransformer.resolvePropertySchemaFromObjectSchema(
			baseSchema,
			firstKey
		);
		const secondSchema = ObjectTransformer.resolvePropertySchemaFromObjectSchema(
			baseSchema,
			secondKey
		);

		if (firstSchema && secondSchema) {
			if (JsonHelper.canonicalize(firstSchema) === JsonHelper.canonicalize(secondSchema)) {
				return firstSchema;
			}

			return {
				anyOf: [firstSchema, secondSchema]
			};
		}

		if (firstSchema) {
			return firstSchema;
		}

		if (secondSchema) {
			return secondSchema;
		}

		return fallbackSchema;
	}

	/**
	 * Map ObjectOrArray<T> to a schema accepting T or T[].
	 * @param context The generation context.
	 * @param typeNode The ObjectOrArray type reference.
	 * @returns The mapped schema.
	 */
	public static mapObjectOrArrayUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode
	): IJsonSchema | undefined {
		return UtilityTypeSchemaMapper.mapObjectOrArrayUtilityType(context, typeNode, (ctx, node) =>
			JsonSchemaBuilder.mapTypeNodeToSchema(ctx, node)
		);
	}

	/**
	 * Map SingleOccurrenceArray<T, U> to a non-empty array containing exactly one U.
	 * @param context The generation context.
	 * @param typeNode The SingleOccurrenceArray type reference.
	 * @returns The mapped schema.
	 */
	public static mapSingleOccurrenceArrayUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode
	): IJsonSchema | undefined {
		return UtilityTypeSchemaMapper.mapSingleOccurrenceArrayUtilityType(
			context,
			typeNode,
			(ctx, node) => JsonSchemaBuilder.mapTypeNodeToSchema(ctx, node)
		);
	}

	/**
	 * Add a comment to schemas inlined for utility type transformations.
	 * @param schema The schema to annotate.
	 * @param baseTypeDescription The utility base type description.
	 * @returns The annotated schema.
	 */
	public static annotateUtilityInlineSchema(
		schema: IJsonSchema,
		baseTypeDescription: string
	): IJsonSchema {
		const annotatedSchema = ObjectHelper.clone(schema);
		annotatedSchema.$comment ??= `Inlined utility base type ${baseTypeDescription} so utility transformations can operate on concrete properties instead of a $ref.`;
		return annotatedSchema;
	}

	/**
	 * Resolve a utility base type node to an object schema.
	 * @param context The generation context.
	 * @param baseTypeNode The utility base type node.
	 * @returns The resolved object schema.
	 * @throws GeneralError when a named type reference cannot be resolved to a schema.
	 */
	public static resolveUtilityBaseObjectSchema(
		context: ITypeScriptToSchemaContext,
		baseTypeNode: ts.TypeNode
	): IJsonSchema | undefined {
		// Guard against recursive utility type resolution cycles
		// This prevents infinite loops when processing complex types with indexed access and keyof
		context.resolvingUtilityTypes ??= new Set<string>();

		// { prop: string }  (inline type literal as the base of the utility type)
		if (ts.isTypeLiteralNode(baseTypeNode)) {
			return JsonSchemaBuilder.buildTypeLiteralSchema(context, baseTypeNode);
		}

		// BaseType  (named type reference as the base of the utility type)
		if (ts.isTypeReferenceNode(baseTypeNode)) {
			// BaseType  (plain identifier) vs  Namespace.BaseType  (qualified name)
			const typeName = ts.isIdentifier(baseTypeNode.typeName)
				? baseTypeNode.typeName.text
				: baseTypeNode.typeName.right.text;
			const baseTypeDescription = StringHelper.stripPrefix(typeName);

			// Prevent recursive processing of the same utility base type
			if (context.resolvingUtilityTypes.has(typeName)) {
				return undefined;
			}

			const utilityHandler = JsonSchemaBuilder._utilityTypeHandlers[typeName];
			if (utilityHandler) {
				context.resolvingUtilityTypes.add(typeName);
				try {
					const utilitySchema = utilityHandler(context, baseTypeNode);
					const resolvedUtilitySchema = utilitySchema
						? JsonSchemaBuilder.resolveMappedUtilityBaseObjectSchema(context, utilitySchema)
						: undefined;
					if (resolvedUtilitySchema) {
						return JsonSchemaBuilder.annotateUtilityInlineSchema(
							resolvedUtilitySchema,
							baseTypeDescription
						);
					}
				} finally {
					context.resolvingUtilityTypes.delete(typeName);
				}
			}

			const typeParameterBinding = JsonSchemaBuilder.getTypeParameterBinding(context, typeName);
			if (typeParameterBinding !== undefined) {
				return typeParameterBinding
					? JsonSchemaBuilder.resolveUtilityBaseObjectSchema(context, typeParameterBinding)
					: undefined;
			}
			const directSchema = JsonSchemaBuilder.resolveObjectTypeSchemaForUtility(context, typeName);

			if (directSchema) {
				const expandedSchema = JsonSchemaBuilder.expandAllOfReferences(
					context,
					directSchema,
					StringHelper.stripPrefix(typeName)
				);
				return JsonSchemaBuilder.annotateUtilityInlineSchema(expandedSchema, baseTypeDescription);
			}
		}

		const mappedSchema = JsonSchemaBuilder.mapTypeNodeToSchema(context, baseTypeNode);
		if (mappedSchema) {
			// If we got a $ref, try to resolve it to an actual object schema
			if (mappedSchema.$ref) {
				const resolvedSchema = JsonSchemaBuilder.resolveMappedUtilityBaseObjectSchema(
					context,
					mappedSchema
				);
				if (resolvedSchema) {
					return JsonSchemaBuilder.annotateUtilityInlineSchema(
						resolvedSchema,
						baseTypeNode.getText()
					);
				}
				// $ref exists but can't be expanded to an inline object schema (e.g. the type
				// maps to an external schema URL). Return undefined so the utility type handler
				// degrades gracefully rather than throwing; the type is known, just not inlineable.
				return undefined;
			}
			// If we got a direct schema (non-$ref), try to resolve it as an object
			const resolvedSchema = JsonSchemaBuilder.resolveMappedUtilityBaseObjectSchema(
				context,
				mappedSchema
			);
			if (resolvedSchema) {
				return JsonSchemaBuilder.annotateUtilityInlineSchema(
					resolvedSchema,
					baseTypeNode.getText()
				);
			}
		}

		// mapTypeNodeToSchema produced nothing at all - the type is genuinely unknown.
		// For named type references that are not part of a recursive resolution cycle, throw.
		if (ts.isTypeReferenceNode(baseTypeNode)) {
			const typeName = ts.isIdentifier(baseTypeNode.typeName)
				? baseTypeNode.typeName.text
				: baseTypeNode.typeName.right.text;
			if (!context.resolvingUtilityTypes?.has(typeName)) {
				const importedTypeReference = JsonSchemaBuilder.findImportedTypeReference(
					context,
					typeName
				);
				const importSource = importedTypeReference?.moduleSpecifier ?? "";
				throw new GeneralError(JsonSchemaBuilder.CLASS_NAME, "missingTypeReferenceSchema", {
					typeName,
					importSource: importSource ? ` from module "${importSource}"` : ""
				});
			}
		}

		return undefined;
	}

	/**
	 * Resolve a mapped utility schema to an object schema when possible.
	 * @param context The generation context.
	 * @param mappedSchema The mapped schema.
	 * @returns The resolved object schema.
	 */
	public static resolveMappedUtilityBaseObjectSchema(
		context: ITypeScriptToSchemaContext,
		mappedSchema: IJsonSchema
	): IJsonSchema | undefined {
		if (mappedSchema.type === "object" && mappedSchema.properties) {
			return ObjectHelper.clone(mappedSchema);
		}

		if (mappedSchema.$ref) {
			for (const packageSchemaEntries of Object.values(context.schemas)) {
				for (const referencedSchema of Object.values(packageSchemaEntries)) {
					if (
						referencedSchema.$id === mappedSchema.$ref &&
						referencedSchema.type === "object" &&
						referencedSchema.properties
					) {
						return JsonSchemaBuilder.expandAllOfReferences(
							context,
							ObjectHelper.clone(referencedSchema),
							referencedSchema.title
						);
					}
				}
			}

			// Fall back to resolving by ref title in case a schema was registered
			// without a matching $id, or the ref has been normalised differently.
			const refTitle = mappedSchema.$ref.split("/").pop();
			if (refTitle) {
				const localRefSchema = context.schemas[context.packageName]?.[refTitle];
				if (localRefSchema?.type === "object" && localRefSchema.properties) {
					return JsonSchemaBuilder.expandAllOfReferences(
						context,
						ObjectHelper.clone(localRefSchema),
						localRefSchema.title ?? refTitle
					);
				}

				for (const packageSchemaEntries of Object.values(context.schemas)) {
					const refSchema = packageSchemaEntries[refTitle];
					if (refSchema?.type === "object" && refSchema.properties) {
						return JsonSchemaBuilder.expandAllOfReferences(
							context,
							ObjectHelper.clone(refSchema),
							refSchema.title ?? refTitle
						);
					}
				}
			}
		}

		return undefined;
	}

	/**
	 * Expand allOf references in a schema by inlining referenced schemas.
	 * This handles inheritance cases where a type extends another type.
	 * When applying utility operations (Omit, Pick) to types with allOf inheritance,
	 * the referenced schemas must be expanded so properties are available for omit/pick.
	 * @param context The generation context.
	 * @param schema The schema potentially containing allOf with references.
	 * @param currentSchemaTitle The title of the current schema being processed, used for $comment annotations.
	 * @returns The schema with expanded references merged into properties.
	 */
	public static expandAllOfReferences(
		context: ITypeScriptToSchemaContext,
		schema: IJsonSchema,
		currentSchemaTitle?: string
	): IJsonSchema {
		if (!Is.array(schema.allOf) || schema.allOf.length === 0) {
			return schema;
		}

		const expandedSchema = ObjectHelper.clone(schema);
		const mergedProperties: { [key: string]: IJsonSchema } = {};
		const inheritedPropertySources: { [key: string]: string } = {};
		const mergedRequired = new Set<string>();
		const allOf = Is.array(expandedSchema.allOf) ? expandedSchema.allOf : [];

		// Expand all allOf branches
		for (const branch of allOf) {
			if (Is.object(branch)) {
				const branchRecord = branch as { [key: string]: unknown };
				let branchSourceTitle: string | undefined;
				let referencedSchema: IJsonSchema | undefined;

				// If the branch is a reference, resolve it
				if (Is.stringValue(branchRecord.$ref) && !branchRecord.properties) {
					const refTitle = branchRecord.$ref.split("/").pop();
					if (refTitle) {
						// Look up the referenced schema in the context
						referencedSchema =
							context.schemas[context.packageName]?.[refTitle] ??
							Object.values(context.schemas)
								.flatMap(entries => Object.values(entries))
								.find(s => s.$id === branchRecord.$ref || s.title === refTitle);

						referencedSchema ??= JsonSchemaBuilder.tryLoadExternalSchemaByTitle(context, refTitle);

						if (referencedSchema) {
							branchSourceTitle = referencedSchema.title ?? refTitle;
							referencedSchema = JsonSchemaBuilder.expandAllOfReferences(
								context,
								referencedSchema,
								branchSourceTitle
							);
							// Merge properties from the referenced schema
							if (Is.object(referencedSchema.properties)) {
								for (const [propertyKey, propertySchema] of Object.entries(
									referencedSchema.properties
								)) {
									mergedProperties[propertyKey] = ObjectHelper.clone(propertySchema);
									if (branchSourceTitle) {
										inheritedPropertySources[propertyKey] = branchSourceTitle;
									}
								}
							}
							// Collect required fields from the referenced schema
							if (Is.array(referencedSchema.required)) {
								for (const field of referencedSchema.required) {
									if (Is.stringValue(field)) {
										mergedRequired.add(field);
									}
								}
							}
						}
					}
				} else {
					// Merge properties from direct schema in allOf
					if (Is.object(branchRecord.properties)) {
						for (const [propertyKey, propertySchema] of Object.entries(branchRecord.properties)) {
							if (Is.object(propertySchema)) {
								mergedProperties[propertyKey] = ObjectHelper.clone(propertySchema as IJsonSchema);
								if (branchSourceTitle) {
									inheritedPropertySources[propertyKey] = branchSourceTitle;
								}
							}
						}
					}
					// Merge required fields
					if (Is.array(branchRecord.required)) {
						for (const field of branchRecord.required) {
							if (Is.stringValue(field)) {
								mergedRequired.add(field);
							}
						}
					}
				}
			}
		}

		// If we expanded any references, merge them into the schema
		if (Object.keys(mergedProperties).length > 0 || mergedRequired.size > 0) {
			if (Object.keys(mergedProperties).length > 0) {
				// Step 1: stamp $comment on base (merged) properties that arrived via $ref expansion.
				// The guard `!propertySchema.$comment` ensures that a comment set by a deeper
				// ancestor during a recursive call is never overwritten by a shallower ancestor.
				for (const [propertyKey, propertySchema] of Object.entries(mergedProperties)) {
					const inheritedSource = inheritedPropertySources[propertyKey];
					if (inheritedSource && !propertySchema.$comment) {
						propertySchema.$comment = `Inherited from ${inheritedSource}`;
					}
				}

				// Step 2: stamp $comment on the derived type's own properties so that consumers
				// of the expanded schema know which type introduced each property.  The `??=`
				// guard preserves any $comment already written by a deeper recursive call.
				if (currentSchemaTitle && Is.object(expandedSchema.properties)) {
					for (const [propertyKey, propertySchema] of Object.entries(expandedSchema.properties)) {
						if (Is.object(propertySchema)) {
							const typedPropertySchema = propertySchema;
							typedPropertySchema.$comment ??= `Inherited from ${currentSchemaTitle}`;
							inheritedPropertySources[propertyKey] = currentSchemaTitle;
						}
					}
				}

				// Step 3: merge — base properties first, derived properties on top so that a
				// derived type can override a base property (key order: base insertion order,
				// values from the derived spread win for overlapping keys).
				expandedSchema.properties = {
					...mergedProperties,
					...(expandedSchema.properties ?? {})
				};
			}
			if (mergedRequired.size > 0 || Is.array(expandedSchema.required)) {
				// Build required array in property order: first merged, then existing
				const resultRequired: string[] = [];
				const mergedRequiredSet = new Set(mergedRequired);
				const existingRequired = Is.array(expandedSchema.required) ? expandedSchema.required : [];

				// Add merged required fields in property order
				for (const key of Object.keys(expandedSchema.properties ?? {})) {
					if (mergedRequiredSet.has(key)) {
						resultRequired.push(key);
					}
				}

				// Add existing required fields that aren't in merged
				for (const key of existingRequired) {
					if (Is.stringValue(key) && !mergedRequiredSet.has(key)) {
						resultRequired.push(key);
					}
				}

				if (resultRequired.length > 0) {
					expandedSchema.required = resultRequired;
				}
			}
			// Remove allOf since we've expanded everything
			delete expandedSchema.allOf;
		}

		return expandedSchema;
	}

	/**
	 * Attempt to load an external schema by title from imported module declarations.
	 * @param context The generation context.
	 * @param schemaTitle The schema title.
	 * @returns The loaded schema.
	 */
	public static tryLoadExternalSchemaByTitle(
		context: ITypeScriptToSchemaContext,
		schemaTitle: string
	): IJsonSchema | undefined {
		const existingSchema = Object.values(context.schemas)
			.flatMap(entries => Object.values(entries))
			.find(schema => schema.title === schemaTitle || schema.$id?.endsWith(`/${schemaTitle}`));
		if (existingSchema) {
			return ObjectHelper.clone(existingSchema);
		}

		const sourceFile = context.activeSourceFile;
		if (!sourceFile) {
			return undefined;
		}

		const moduleSpecifiers = [
			...new Set(
				sourceFile.statements
					.filter((statement): statement is ts.ImportDeclaration =>
						ts.isImportDeclaration(statement)
					)
					.flatMap(statement => {
						if (!ts.isStringLiteral(statement.moduleSpecifier)) {
							return [];
						}

						const moduleSpecifier = statement.moduleSpecifier.text;
						return moduleSpecifier.startsWith(".") ? [] : [moduleSpecifier];
					})
			)
		];

		const candidateTypeNames = [`I${schemaTitle}`, schemaTitle];

		for (const moduleSpecifier of moduleSpecifiers) {
			for (const candidateTypeName of candidateTypeNames) {
				const declarationResult = Resolver.resolveTypeDeclarationAst(
					moduleSpecifier,
					candidateTypeName
				);
				if (declarationResult) {
					const mappedReference = JsonSchemaBuilder.resolveReferenceMappingTarget(
						context,
						moduleSpecifier,
						candidateTypeName
					);

					const externalContext: ITypeScriptToSchemaContext = {
						namespace: mappedReference?.namespace ?? context.namespace,
						packageName: moduleSpecifier,
						schemas: context.schemas,
						activeSourceFile: context.activeSourceFile,
						options: context.options
					};

					JsonSchemaBuilder.parseAllObjectSchemas(
						externalContext,
						declarationResult.sourceFile.fileName,
						declarationResult.sourceFile.getFullText(),
						[]
					);

					const loadedSchema =
						context.schemas[moduleSpecifier]?.[schemaTitle] ??
						Object.values(context.schemas[moduleSpecifier] ?? {}).find(
							schema => schema.title === schemaTitle || schema.$id?.endsWith(`/${schemaTitle}`)
						);

					if (loadedSchema) {
						return ObjectHelper.clone(loadedSchema);
					}
				}
			}
		}

		return undefined;
	}

	/**
	 * Resolve an object schema for utility type application.
	 * @param context The generation context.
	 * @param typeName The referenced type name.
	 * @returns The resolved object schema.
	 */
	public static resolveObjectTypeSchemaForUtility(
		context: ITypeScriptToSchemaContext,
		typeName: string
	): IJsonSchema | undefined {
		const typeParameterBinding = JsonSchemaBuilder.getTypeParameterBinding(context, typeName);
		if (typeParameterBinding !== undefined) {
			return typeParameterBinding
				? JsonSchemaBuilder.resolveUtilityBaseObjectSchema(context, typeParameterBinding)
				: undefined;
		}

		const title = StringHelper.stripPrefix(typeName);
		const localSchema = context.schemas[context.packageName]?.[title];

		if (localSchema?.type === "object" && localSchema.properties) {
			return ObjectHelper.clone(localSchema);
		}

		const declarationSchema = JsonSchemaBuilder.mapObjectTypeFromLocalDeclaration(
			context,
			typeName
		);
		if (declarationSchema) {
			return declarationSchema;
		}

		for (const packageEntry of Object.values(context.schemas)) {
			const packageSchema = packageEntry[title];
			if (packageSchema?.type === "object" && packageSchema.properties) {
				return ObjectHelper.clone(packageSchema);
			}
		}

		const importedTypeReference = JsonSchemaBuilder.findImportedTypeReference(context, typeName);
		if (importedTypeReference) {
			const importedSchema = JsonSchemaBuilder.resolveImportedObjectTypeSchemaForUtility(
				context,
				importedTypeReference.moduleSpecifier,
				importedTypeReference.candidateTypeName,
				title
			);
			if (importedSchema) {
				return importedSchema;
			}
		}

		return undefined;
	}

	/**
	 * Find an imported type reference from the active source file by local or exported symbol name.
	 * @param context The generation context.
	 * @param typeName The local or exported type name to find.
	 * @returns The module specifier and exported candidate type name when found.
	 */
	public static findImportedTypeReference(
		context: ITypeScriptToSchemaContext,
		typeName: string
	): { moduleSpecifier: string; candidateTypeName: string } | undefined {
		if (!context.activeSourceFile) {
			return undefined;
		}

		for (const statement of context.activeSourceFile.statements) {
			if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
				if (
					statement.importClause?.namedBindings &&
					ts.isNamedImports(statement.importClause.namedBindings)
				) {
					const importedElement = Array.from(statement.importClause.namedBindings.elements).find(
						e => e.name.text === typeName || (e.propertyName?.text ?? e.name.text) === typeName
					);
					if (importedElement) {
						return {
							moduleSpecifier: statement.moduleSpecifier.text,
							candidateTypeName: importedElement.propertyName?.text ?? importedElement.name.text
						};
					}
				}
			}
		}

		return undefined;
	}

	/**
	 * Resolve an imported object schema for utility type application.
	 * @param context The generation context.
	 * @param moduleSpecifier The module where the type is imported from.
	 * @param candidateTypeName The exported candidate type name.
	 * @param title The stripped title of the requested type.
	 * @returns The resolved object schema.
	 */
	public static resolveImportedObjectTypeSchemaForUtility(
		context: ITypeScriptToSchemaContext,
		moduleSpecifier: string,
		candidateTypeName: string,
		title: string
	): IJsonSchema | undefined {
		context.resolvingImportedObjectSchemas ??= new Set<string>();
		const resolvingKey = `${context.packageName}:${moduleSpecifier}:${candidateTypeName}`;
		if (context.resolvingImportedObjectSchemas.has(resolvingKey)) {
			return undefined;
		}

		context.resolvingImportedObjectSchemas.add(resolvingKey);
		try {
			if (moduleSpecifier.startsWith(".")) {
				if (!context.activeSourceFile) {
					return undefined;
				}

				const resolvedImportPath = JsonSchemaBuilder.resolveImportDeclarationSourceFile(
					context.activeSourceFile.fileName,
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

				const localLoadedSchema =
					context.schemas[context.packageName]?.[title] ??
					context.schemas[context.packageName]?.[StringHelper.stripPrefix(candidateTypeName)] ??
					Object.values(context.schemas[context.packageName] ?? {}).find(
						s =>
							s.title === title ||
							s.title === StringHelper.stripPrefix(candidateTypeName) ||
							s.$id?.endsWith(`/${title}`)
					);
				if (localLoadedSchema?.type === "object" && localLoadedSchema.properties) {
					return ObjectHelper.clone(localLoadedSchema);
				}

				return undefined;
			}

			const declarationResult = Resolver.resolveTypeDeclarationAst(
				moduleSpecifier,
				candidateTypeName
			);
			if (!declarationResult) {
				return undefined;
			}

			const mappedReference = JsonSchemaBuilder.resolveReferenceMappingTarget(
				context,
				moduleSpecifier,
				candidateTypeName
			);
			const externalContext: ITypeScriptToSchemaContext = {
				namespace: mappedReference?.namespace ?? context.namespace,
				packageName: moduleSpecifier,
				schemas: context.schemas,
				activeSourceFile: context.activeSourceFile,
				resolvingImportedObjectSchemas: context.resolvingImportedObjectSchemas,
				options: context.options
			};
			JsonSchemaBuilder.parseAllObjectSchemas(
				externalContext,
				declarationResult.sourceFile.fileName,
				declarationResult.sourceFile.getFullText(),
				[]
			);

			const loadedSchema =
				context.schemas[moduleSpecifier]?.[title] ??
				Object.values(context.schemas[moduleSpecifier] ?? {}).find(
					s => s.title === title || s.$id?.endsWith(`/${title}`)
				);
			if (loadedSchema?.type === "object" && loadedSchema.properties) {
				return ObjectHelper.clone(loadedSchema);
			}

			return undefined;
		} finally {
			context.resolvingImportedObjectSchemas.delete(resolvingKey);
		}
	}

	/**
	 * Map a local interface or type alias declaration to an object schema.
	 * @param context The generation context.
	 * @param typeName The referenced type name.
	 * @returns The mapped schema.
	 */
	public static mapObjectTypeFromLocalDeclaration(
		context: ITypeScriptToSchemaContext,
		typeName: string
	): IJsonSchema | undefined {
		const sourceFile = context.activeSourceFile;
		if (!sourceFile) {
			return undefined;
		}

		context.resolvingTypeNames ??= new Set<string>();
		if (context.resolvingTypeNames.has(typeName)) {
			return {};
		}

		const declaration = sourceFile.statements.find(statement => {
			if (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) {
				return statement.name.text === typeName;
			}
			return false;
		});

		if (!declaration) {
			return undefined;
		}

		context.resolvingTypeNames.add(typeName);
		try {
			if (ts.isInterfaceDeclaration(declaration)) {
				const boundContext = JsonSchemaBuilder.withTypeParameterBindings(
					context,
					declaration.typeParameters
				);
				const { properties, required } = JsonSchemaBuilder.buildObjectMembersSchema(
					boundContext,
					declaration.members
				);
				return {
					type: "object",
					properties: Object.keys(properties).length > 0 ? properties : undefined,
					required: required.length > 0 ? required : undefined
				};
			}

			if (ts.isTypeAliasDeclaration(declaration) && ts.isTypeLiteralNode(declaration.type)) {
				const boundContext = JsonSchemaBuilder.withTypeParameterBindings(
					context,
					declaration.typeParameters
				);
				return JsonSchemaBuilder.buildTypeLiteralSchema(boundContext, declaration.type);
			}
		} finally {
			context.resolvingTypeNames.delete(typeName);
		}

		return undefined;
	}

	/**
	 * Extract string literal keys from a utility type key argument (e.g. Pick or Omit).
	 * @param context The generation context.
	 * @param keysTypeNode The keys type node.
	 * @returns The extracted keys.
	 */
	public static extractUtilityTypeKeys(
		context: ITypeScriptToSchemaContext,
		keysTypeNode: ts.TypeNode | undefined
	): string[] {
		if (!keysTypeNode) {
			return [];
		}

		// readonly T[]  or  keyof T  (type operator node)
		if (ts.isTypeOperatorNode(keysTypeNode)) {
			if (keysTypeNode.operator === ts.SyntaxKind.ReadonlyKeyword) {
				return JsonSchemaBuilder.extractUtilityTypeKeys(context, keysTypeNode.type);
			}

			if (keysTypeNode.operator === ts.SyntaxKind.KeyOfKeyword) {
				return JsonSchemaBuilder.extractKeyofTypeKeys(context, keysTypeNode.type);
			}
		}

		// "key"  (string literal type as a single key)
		if (ts.isLiteralTypeNode(keysTypeNode) && ts.isStringLiteral(keysTypeNode.literal)) {
			return [keysTypeNode.literal.text];
		}

		// "a" | "b"  (union of string literal keys)
		if (ts.isUnionTypeNode(keysTypeNode)) {
			return (
				keysTypeNode.types
					// "key"  (only string literal type members are supported)
					.filter(type => ts.isLiteralTypeNode(type) && ts.isStringLiteral(type.literal))
					.map(type => (type as ts.LiteralTypeNode).literal as ts.StringLiteral)
					.map(literal => literal.text)
			);
		}

		return [];
	}

	/**
	 * Extract property keys from an indexed access index type.
	 * @param context The generation context.
	 * @param indexTypeNode The index type node.
	 * @returns The extracted keys.
	 */
	public static extractIndexedAccessKeys(
		context: ITypeScriptToSchemaContext,
		indexTypeNode: ts.TypeNode
	): string[] {
		// "key"  or  42  (literal type index)
		if (ts.isLiteralTypeNode(indexTypeNode)) {
			// "key"  (string literal index)
			if (ts.isStringLiteral(indexTypeNode.literal)) {
				return [indexTypeNode.literal.text];
			}

			// 0  (numeric literal index)
			if (ts.isNumericLiteral(indexTypeNode.literal)) {
				return [indexTypeNode.literal.text];
			}
		}

		// "a" | "b"  (union of index types, recurse into each branch)
		if (ts.isUnionTypeNode(indexTypeNode)) {
			const keys = indexTypeNode.types.flatMap(unionType =>
				JsonSchemaBuilder.extractIndexedAccessKeys(context, unionType)
			);
			return [...new Set(keys)];
		}

		return JsonSchemaBuilder.extractUtilityTypeKeys(context, indexTypeNode);
	}

	/**
	 * Extract keys for a mapped type constraint.
	 * @param context The generation context.
	 * @param constraintTypeNode The mapped type constraint.
	 * @returns The extracted keys.
	 */
	public static extractMappedTypeKeys(
		context: ITypeScriptToSchemaContext,
		constraintTypeNode: ts.TypeNode | undefined
	): string[] {
		if (!constraintTypeNode) {
			return [];
		}

		// `prefix-${T}`  (template literal constraint, keys cannot be statically enumerated)
		if (ts.isTemplateLiteralTypeNode(constraintTypeNode)) {
			return [];
		}

		// TypeName  (type reference constraint, resolve to its declaration)
		if (ts.isTypeReferenceNode(constraintTypeNode)) {
			const referencedTypeNode = JsonSchemaBuilder.resolveReferencedTypeNodeFromLocalDeclaration(
				context,
				constraintTypeNode
			);
			if (referencedTypeNode) {
				return JsonSchemaBuilder.extractMappedTypeKeys(context, referencedTypeNode);
			}
		}

		return JsonSchemaBuilder.extractUtilityTypeKeys(context, constraintTypeNode);
	}

	/**
	 * Resolve a referenced type node from a local type alias declaration.
	 * @param context The generation context.
	 * @param typeNode The type reference node.
	 * @returns The referenced type node, if found locally.
	 */
	public static resolveReferencedTypeNodeFromLocalDeclaration(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode
	): ts.TypeNode | undefined {
		// TypeName  (plain identifier) vs  Namespace.TypeName  (qualified name)
		const typeName = ts.isIdentifier(typeNode.typeName)
			? typeNode.typeName.text
			: typeNode.typeName.right.text;
		const typeParameterBinding = JsonSchemaBuilder.getTypeParameterBinding(context, typeName);
		if (typeParameterBinding !== undefined) {
			return typeParameterBinding ?? undefined;
		}

		const sourceFile = context.activeSourceFile;
		if (!sourceFile) {
			return undefined;
		}

		const declaration = sourceFile.statements.find(
			// type TypeName = ...  (type alias declaration matching the resolved name)
			(statement): statement is ts.TypeAliasDeclaration =>
				ts.isTypeAliasDeclaration(statement) && statement.name.text === typeName
		);

		return declaration?.type;
	}

	/**
	 * Create a nested mapping context with generic parameters bound.
	 * @param context The current generation context.
	 * @param typeParameters The generic type parameters for the declaration.
	 * @param typeArguments Explicit type arguments, when provided.
	 * @returns The scoped mapping context.
	 */
	public static withTypeParameterBindings(
		context: ITypeScriptToSchemaContext,
		typeParameters: ts.NodeArray<ts.TypeParameterDeclaration> | undefined,
		typeArguments?: ts.NodeArray<ts.TypeNode>
	): ITypeScriptToSchemaContext {
		if (!typeParameters || typeParameters.length === 0) {
			return context;
		}

		const typeParameterBindings = context.typeParameterBindings ?? {};

		for (const [index, typeParameter] of typeParameters.entries()) {
			typeParameterBindings[typeParameter.name.text] =
				typeArguments?.[index] ?? typeParameter.default ?? typeParameter.constraint ?? null;
		}

		return {
			...context,
			typeParameterBindings
		};
	}

	/**
	 * Get a bound generic type parameter for the current mapping scope.
	 * @param context The current generation context.
	 * @param typeName The type name to resolve.
	 * @returns The bound type node, null for unresolved generic parameters, or undefined when not generic.
	 */
	public static getTypeParameterBinding(
		context: ITypeScriptToSchemaContext,
		typeName: string
	): ts.TypeNode | null | undefined {
		if (!context.typeParameterBindings) {
			return undefined;
		}

		return Object.prototype.hasOwnProperty.call(context.typeParameterBindings, typeName)
			? context.typeParameterBindings[typeName]
			: undefined;
	}

	/**
	 * Determine whether a mapped type is a homomorphic source-preserving form.
	 * @param typeNode The mapped type node.
	 * @returns True if the mapped type mirrors an existing object shape.
	 */
	public static isHomomorphicMappedType(typeNode: ts.MappedTypeNode): boolean {
		const mappedTypeParameterName = typeNode.typeParameter.name.text;
		const constraintTypeNode = typeNode.typeParameter.constraint;
		const mappedValueType = typeNode.type;

		// keyof T  (constraint must be a type operator for the type to be homomorphic)
		if (!constraintTypeNode || !mappedValueType || !ts.isTypeOperatorNode(constraintTypeNode)) {
			return false;
		}

		if (constraintTypeNode.operator !== ts.SyntaxKind.KeyOfKeyword) {
			return false;
		}

		// T[K]  (mapped value must be an indexed access of the source object)
		if (!ts.isIndexedAccessTypeNode(mappedValueType)) {
			return false;
		}

		if (
			!JsonSchemaBuilder.isMappedTypeParameterReference(
				mappedValueType.indexType,
				mappedTypeParameterName
			)
		) {
			return false;
		}

		return (
			mappedValueType.objectType.getText() === constraintTypeNode.type.getText() &&
			typeNode.nameType === undefined
		);
	}

	/**
	 * Resolve a source object schema for a mapped type when one exists.
	 * @param context The generation context.
	 * @param typeNode The mapped type node.
	 * @returns The resolved source object schema.
	 */
	public static resolveMappedTypeSourceObjectSchema(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.MappedTypeNode
	): IJsonSchema | undefined {
		const constraintTypeNode = typeNode.typeParameter.constraint;
		if (
			constraintTypeNode &&
			// keyof T  (homomorphic mapped type, constraint is keyof the source object)
			ts.isTypeOperatorNode(constraintTypeNode) &&
			constraintTypeNode.operator === ts.SyntaxKind.KeyOfKeyword
		) {
			return JsonSchemaBuilder.resolveUtilityBaseObjectSchema(context, constraintTypeNode.type);
		}

		return undefined;
	}

	/**
	 * Map a single mapped-type property schema.
	 * @param context The generation context.
	 * @param typeNode The mapped type node.
	 * @param sourcePropertyKey The original property key from the source object, used for lookup when the mapped type is homomorphic.
	 * @param mappedTypeParameterName The mapped type parameter name.
	 * @param sourceObjectSchema The optional source object schema.
	 * @returns The mapped property schema.
	 */
	public static mapMappedTypePropertySchema(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.MappedTypeNode,
		sourcePropertyKey: string,
		mappedTypeParameterName: string,
		sourceObjectSchema?: IJsonSchema
	): IJsonSchema | undefined {
		if (!typeNode.type) {
			return {};
		}

		if (
			// T[K]  (indexed access where the index is the mapped type parameter)
			ts.isIndexedAccessTypeNode(typeNode.type) &&
			JsonSchemaBuilder.isMappedTypeParameterReference(
				typeNode.type.indexType,
				mappedTypeParameterName
			)
		) {
			const indexedPropertySchema = JsonSchemaBuilder.resolveIndexedPropertySchema(
				context,
				typeNode.type.objectType,
				sourcePropertyKey,
				sourceObjectSchema
			);
			if (indexedPropertySchema) {
				return indexedPropertySchema;
			}
		}

		return JsonSchemaBuilder.mapTypeNodeToSchema(context, typeNode.type);
	}

	/**
	 * Resolve a concrete property schema for an indexed access object type and key.
	 * @param context The generation context.
	 * @param objectTypeNode The source object type node.
	 * @param propertyKey The property key to resolve.
	 * @param sourceObjectSchema The optional pre-resolved source object schema.
	 * @returns The resolved property schema.
	 */
	public static resolveIndexedPropertySchema(
		context: ITypeScriptToSchemaContext,
		objectTypeNode: ts.TypeNode,
		propertyKey: string,
		sourceObjectSchema?: IJsonSchema
	): IJsonSchema | undefined {
		const objectSchema =
			sourceObjectSchema ??
			JsonSchemaBuilder.resolveUtilityBaseObjectSchema(context, objectTypeNode);
		if (!objectSchema) {
			return undefined;
		}

		return ObjectTransformer.resolvePropertySchemaFromObjectSchema(objectSchema, propertyKey);
	}

	/**
	 * Determine whether a type node is a reference to the mapped type parameter.
	 * @param typeNode The type node.
	 * @param mappedTypeParameterName The mapped type parameter name.
	 * @returns True if the node references the mapped parameter.
	 */
	public static isMappedTypeParameterReference(
		typeNode: ts.TypeNode,
		mappedTypeParameterName: string
	): boolean {
		return (
			// K  (type reference to the mapped parameter, plain identifier)
			ts.isTypeReferenceNode(typeNode) &&
			// K  (identifier node matching the parameter name)
			ts.isIdentifier(typeNode.typeName) &&
			typeNode.typeName.text === mappedTypeParameterName
		);
	}

	/**
	 * Apply mapped-type optionality to a schema cloned from a source object.
	 * @param schema The mapped schema.
	 * @param optionalToken The mapped type optional token.
	 */
	public static applyMappedTypeOptionality(
		schema: IJsonSchema,
		optionalToken: ts.QuestionToken | ts.PlusToken | ts.MinusToken | undefined
	): void {
		if (!optionalToken) {
			return;
		}

		if (
			optionalToken.kind === ts.SyntaxKind.QuestionToken ||
			optionalToken.kind === ts.SyntaxKind.PlusToken
		) {
			delete schema.required;
			return;
		}

		if (optionalToken.kind === ts.SyntaxKind.MinusToken && Is.object(schema.properties)) {
			schema.required = Object.keys(schema.properties);
		}
	}

	/**
	 * Apply mapped-type required keys for generated property sets.
	 * @param schema The mapped schema.
	 * @param propertyKeys The generated property keys.
	 * @param optionalToken The mapped type optional token.
	 */
	public static applyMappedTypeRequiredKeys(
		schema: IJsonSchema,
		propertyKeys: string[],
		optionalToken: ts.QuestionToken | ts.PlusToken | ts.MinusToken | undefined
	): void {
		if (
			optionalToken &&
			(optionalToken.kind === ts.SyntaxKind.QuestionToken ||
				optionalToken.kind === ts.SyntaxKind.PlusToken)
		) {
			return;
		}

		schema.required = propertyKeys;
	}

	/**
	 * Extract key names from a keyof operand where possible.
	 * @param context The generation context.
	 * @param keysOperandNode The operand used with keyof.
	 * @returns The extracted keys.
	 */
	public static extractKeyofTypeKeys(
		context: ITypeScriptToSchemaContext,
		keysOperandNode: ts.TypeNode
	): string[] {
		// (string | number)  (parenthesised type, unwrap and recurse)
		if (ts.isParenthesizedTypeNode(keysOperandNode)) {
			return JsonSchemaBuilder.extractKeyofTypeKeys(context, keysOperandNode.type);
		}

		if (ts.isTypeReferenceNode(keysOperandNode) && ts.isIdentifier(keysOperandNode.typeName)) {
			const typeParameterBinding = JsonSchemaBuilder.getTypeParameterBinding(
				context,
				keysOperandNode.typeName.text
			);
			if (typeParameterBinding !== undefined) {
				return typeParameterBinding
					? JsonSchemaBuilder.extractKeyofTypeKeys(context, typeParameterBinding)
					: [];
			}
		}

		// { prop: string }  (type literal, enumerate property names as keys)
		if (ts.isTypeLiteralNode(keysOperandNode)) {
			const keyNames = keysOperandNode.members
				.filter(
					// prop: string  (property signature with a name)
					(member): member is ts.PropertySignature & { name: ts.PropertyName } =>
						ts.isPropertySignature(member) && member.name !== undefined
				)
				.map(member => JsonSchemaBuilder.extractPropertyName(context, member.name))
				.filter((keyName): keyName is string => Is.stringValue(keyName));

			return [...new Set(keyNames)];
		}

		const objectSchema = JsonSchemaBuilder.resolveUtilityBaseObjectSchema(context, keysOperandNode);
		if (objectSchema?.properties && Is.object(objectSchema.properties)) {
			return Object.keys(objectSchema.properties);
		}

		return [];
	}

	/**
	 * Determine whether a keyof operand is a generic type parameter reference.
	 * @param context The generation context.
	 * @param keysOperandNode The operand used with keyof.
	 * @returns True if the operand is a generic parameter.
	 */
	public static isGenericKeyofOperand(
		context: ITypeScriptToSchemaContext,
		keysOperandNode: ts.TypeNode
	): boolean {
		if (ts.isParenthesizedTypeNode(keysOperandNode)) {
			return JsonSchemaBuilder.isGenericKeyofOperand(context, keysOperandNode.type);
		}

		if (!ts.isTypeReferenceNode(keysOperandNode) || !ts.isIdentifier(keysOperandNode.typeName)) {
			return false;
		}

		const typeName = keysOperandNode.typeName.text;
		if (JsonSchemaBuilder.getTypeParameterBinding(context, typeName) !== undefined) {
			return true;
		}

		let currentNode: ts.Node | undefined = keysOperandNode;
		while (currentNode) {
			const typedNode = currentNode as ts.Node & {
				typeParameters?: ts.NodeArray<ts.TypeParameterDeclaration>;
			};
			if (typedNode.typeParameters?.some(typeParameter => typeParameter.name.text === typeName)) {
				return true;
			}
			currentNode = currentNode.parent;
		}

		return false;
	}

	/**
	 * Resolve a schema id for an external imported type reference.
	 * @param context The generation context.
	 * @param typeNode The type reference node.
	 * @param typeName The referenced type name.
	 * @returns The resolved schema id.
	 */
	public static resolveExternalTypeReferenceSchemaId(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode,
		typeName: string
	): string | undefined {
		const activeSourceFile = context.activeSourceFile;
		if (!activeSourceFile) {
			return undefined;
		}

		const moduleSpecifier = JsonSchemaBuilder.findImportedModuleSpecifier(
			activeSourceFile,
			typeNode,
			typeName
		);
		if (!moduleSpecifier) {
			return undefined;
		}

		if (moduleSpecifier.startsWith(".")) {
			return JsonSchemaBuilder.resolveReferenceMappingTarget(context, moduleSpecifier, typeName)
				?.schemaId;
		}

		const title = StringHelper.stripPrefix(typeName);
		const cachedSchemaId = context.schemas[moduleSpecifier]?.[title]?.$id;
		if (cachedSchemaId) {
			return cachedSchemaId;
		}

		const mappedReference = JsonSchemaBuilder.resolveReferenceMappingTarget(
			context,
			moduleSpecifier,
			typeName
		);

		const declarationResult = Resolver.resolveTypeDeclarationAst(moduleSpecifier, typeName);
		if (!declarationResult) {
			return mappedReference?.schemaId;
		}

		const externalContext: ITypeScriptToSchemaContext = {
			namespace: mappedReference?.namespace ?? context.namespace,
			packageName: moduleSpecifier,
			schemas: context.schemas,
			activeSourceFile: context.activeSourceFile,
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
	 * Resolve a mapped schema target for an imported reference.
	 * @param context The generation context.
	 * @param packageName The referenced package or module specifier.
	 * @param typeName The imported type name.
	 * @returns The mapped schema id and optional namespace if one matches.
	 */
	public static resolveReferenceMappingTarget(
		context: ITypeScriptToSchemaContext,
		packageName: string,
		typeName: string
	): { schemaId: string; namespace?: string } | undefined {
		const externalReferences = context.options?.externalReferences;
		if (!externalReferences) {
			return undefined;
		}

		const derivedTitle = StringHelper.stripPrefix(typeName);

		if (externalReferences[packageName]) {
			return {
				schemaId: `${externalReferences[packageName]}${derivedTitle}`,
				namespace: externalReferences[packageName]
			};
		}

		if (externalReferences[typeName]) {
			return {
				schemaId: `${externalReferences[typeName]}${derivedTitle}`,
				namespace: externalReferences[typeName]
			};
		}

		if (externalReferences[derivedTitle]) {
			return {
				schemaId: `${externalReferences[derivedTitle]}${derivedTitle}`,
				namespace: externalReferences[derivedTitle]
			};
		}

		for (const [pattern, mappedNamespace] of Object.entries(externalReferences)) {
			if (RegEx.isReferencePatternMatch(pattern, packageName, typeName, derivedTitle)) {
				if (/\$\d+/u.test(mappedNamespace)) {
					const schemaId = RegEx.applyReferencePatternReplacement(
						pattern,
						mappedNamespace,
						packageName,
						typeName,
						derivedTitle
					);
					if (schemaId) {
						return {
							schemaId,
							namespace: schemaId.endsWith(derivedTitle)
								? schemaId.slice(0, -derivedTitle.length)
								: undefined
						};
					}
				}

				return {
					schemaId: `${mappedNamespace}${derivedTitle}`,
					namespace: mappedNamespace
				};
			}
		}

		return undefined;
	}

	/**
	 * Find a module specifier for a referenced type in the active source file imports.
	 * @param sourceFile The active source file.
	 * @param typeNode The referenced type node.
	 * @param typeName The referenced type name.
	 * @returns The module specifier.
	 */
	public static findImportedModuleSpecifier(
		sourceFile: ts.SourceFile,
		typeNode: ts.TypeReferenceNode,
		typeName: string
	): string | undefined {
		for (const statement of sourceFile.statements) {
			// import { ... } from "./module.js"  (import declaration with string specifier)
			if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
				const importClause = statement.importClause;
				if (importClause) {
					if (importClause.name?.text === typeName) {
						return statement.moduleSpecifier.text;
					}

					const namedBindings = importClause.namedBindings;
					if (namedBindings) {
						// import * as Namespace  and  Namespace.TypeName  (namespace import + qualified usage)
						if (ts.isNamespaceImport(namedBindings) && ts.isQualifiedName(typeNode.typeName)) {
							if (namedBindings.name.text === typeNode.typeName.left.getText()) {
								return statement.moduleSpecifier.text;
							}
						}

						// import { Named, Import }  (named import bindings)
						if (ts.isNamedImports(namedBindings)) {
							for (const importSpecifier of namedBindings.elements) {
								if (
									importSpecifier.name.text === typeName ||
									importSpecifier.propertyName?.text === typeName
								) {
									return statement.moduleSpecifier.text;
								}
							}
						}
					}
				}
			}
		}

		return undefined;
	}

	/**
	 * Map custom tag key names to JSON schema property names.
	 * @param key The raw tag key.
	 * @returns The schema key.
	 */
	public static mapJsonSchemaTagKey(key: string): string {
		if (key === "id") {
			return "$id";
		}
		if (key === "ref") {
			return "$ref";
		}
		if (key === "comment") {
			return "$comment";
		}

		return key;
	}
}
