// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Is, ObjectHelper, StringHelper } from "@twin.org/core";
import type { IJsonSchema } from "@twin.org/tools-models";
import { FileUtils } from "./fileUtils.js";
import { JsonSchemaBuilder } from "./jsonSchemaBuilder.js";
import { Resolver } from "./resolver.js";
import { EmbeddedSchemaMode } from "../models/embeddedSchemaMode.js";
import type { ITypeScriptToSchemaContext } from "../models/ITypeScriptToSchemaContext.js";
import type { ITypeScriptToSchemaOptions } from "../models/ITypeScriptToSchemaOptions.js";

/**
 * Class for converting TypeScript types to JSON Schema.
 */
export class TypeScriptToSchema {
	/**
	 * Generates a JSON schema from a TypeScript source file or type name.
	 * @param namespace The schema namespace.
	 * @param packageName The package name.
	 * @param schemas The package schema map.
	 * @param sourceFileOrTypeName The source file to process or type name to resolve.
	 * @param options Additional generation options.
	 * @returns The generated JSON schemas indexed by title.
	 */
	public async generateSchema(
		namespace: string,
		packageName: string,
		schemas: { [id: string]: { [id: string]: IJsonSchema } },
		sourceFileOrTypeName: string,
		options?: ITypeScriptToSchemaOptions
	): Promise<{ [id: string]: IJsonSchema }> {
		const suppressPackageWarnings = (options?.suppressPackageWarnings ?? [])
			.filter(packageNameToSkip => Is.stringValue(packageNameToSkip))
			.map(packageNameToSkip => packageNameToSkip.toLowerCase());
		const filteredOptions: ITypeScriptToSchemaOptions = {
			...options,
			onDiagnostic: diagnostic => {
				if (
					suppressPackageWarnings.some(packageToSkip =>
						this.isDiagnosticFromPackage(diagnostic.path, diagnostic.fileName, packageToSkip)
					)
				) {
					return;
				}

				options?.onDiagnostic?.(diagnostic);
			}
		};

		const context: ITypeScriptToSchemaContext = {
			namespace,
			packageName,
			schemas,
			options: filteredOptions
		};

		let generatedTitles: string[] = [];
		context.schemas[context.packageName] ??= {};
		const visitedFiles: string[] = [];
		const sourceFiles = FileUtils.resolveSourceFiles(sourceFileOrTypeName);

		if (sourceFiles.length > 0) {
			for (const sourceFilePath of sourceFiles) {
				const source = FileUtils.readFile(sourceFilePath);
				if (source) {
					const parsedTitles = JsonSchemaBuilder.parseAllObjectSchemas(
						context,
						sourceFilePath,
						source,
						visitedFiles
					);
					for (const parsedTitle of parsedTitles) {
						if (!generatedTitles.includes(parsedTitle)) {
							generatedTitles.push(parsedTitle);
						}
					}
				}
			}
		} else if (this.isTypeNameInput(sourceFileOrTypeName)) {
			const declarationResult = Resolver.resolveTypeDeclarationAst(
				context.packageName,
				sourceFileOrTypeName
			);
			if (declarationResult) {
				generatedTitles = JsonSchemaBuilder.parseAllObjectSchemas(
					context,
					declarationResult.sourceFile.fileName,
					declarationResult.sourceFile.getFullText(),
					visitedFiles
				);
			}
		} else {
			return {};
		}

		const generatedSchemas: { [id: string]: IJsonSchema } = {};
		for (const generatedTitle of generatedTitles) {
			const generatedSchema = context.schemas[context.packageName][generatedTitle];
			if (generatedSchema) {
				generatedSchemas[generatedTitle] = generatedSchema;
			}
		}

		if (this.isTypeNameInput(sourceFileOrTypeName)) {
			const requestedTitle = StringHelper.stripPrefix(sourceFileOrTypeName);
			const requestedSchema = context.schemas[context.packageName][requestedTitle];
			if (requestedSchema) {
				generatedSchemas[requestedTitle] = requestedSchema;
			}
		}

		for (const [generatedTitle, generatedSchema] of Object.entries(generatedSchemas)) {
			this.inlineEmbeddedSchemas(context, generatedSchema, generatedTitle);
		}

		return generatedSchemas;
	}

	/**
	 * Determine if a diagnostic originates from a specific package.
	 * @param path The schema or source path associated with the diagnostic.
	 * @param fileName The source filename associated with the diagnostic.
	 * @param packageName The package name to check, e.g. jose.
	 * @returns True if the diagnostic originated from the package.
	 */
	public isDiagnosticFromPackage(
		path: string,
		fileName: string | undefined,
		packageName: string
	): boolean {
		if (!Is.stringValue(packageName)) {
			return false;
		}

		const sourcePaths = [fileName, path]
			.filter((value): value is string => Is.stringValue(value))
			.map(value => value.replace(/\\/g, "/").toLowerCase());
		const normalisedPackageName = packageName.toLowerCase();
		const packagePath = `/node_modules/${normalisedPackageName}/`;
		const packagePathNoTrailingSlash = `/node_modules/${normalisedPackageName}`;

		return sourcePaths.some(
			sourcePath =>
				sourcePath.includes(packagePath) || sourcePath.endsWith(packagePathNoTrailingSlash)
		);
	}

	/**
	 * Rewrite refs to @json-schema embedded local types into the current schema's $defs.
	 * @param context The generation context.
	 * @param schema The root schema to rewrite.
	 * @param rootTitle The title of the root schema.
	 */
	private inlineEmbeddedSchemas(
		context: ITypeScriptToSchemaContext,
		schema: IJsonSchema,
		rootTitle: string
	): void {
		this.inlineEmbeddedSchemasInNode(context, schema, schema, rootTitle, new Set([rootTitle]));
	}

	/**
	 * Traverse a schema tree and move embedded local refs into the root schema's $defs.
	 * @param context The generation context.
	 * @param rootSchema The root schema document being rewritten.
	 * @param currentNode The current schema node.
	 * @param rootTitle The title of the root schema.
	 * @param ancestry Titles currently being expanded to avoid recursion cycles.
	 * @returns True if inline embedding changed this node or a descendant.
	 */
	private inlineEmbeddedSchemasInNode(
		context: ITypeScriptToSchemaContext,
		rootSchema: IJsonSchema,
		currentNode: IJsonSchema,
		rootTitle: string,
		ancestry: Set<string>
	): boolean {
		let hasInlineReplacement = false;

		if (Is.stringValue(currentNode.$ref)) {
			const refId = currentNode.$ref;
			const embeddedMode = context.embeddedSchemaModes?.[refId];
			const embeddedSchema = this.findSchemaById(context, refId);
			const defsKey = embeddedSchema
				? this.getEmbeddedDefinitionKey(embeddedSchema, refId)
				: undefined;

			if (
				embeddedMode &&
				embeddedSchema &&
				defsKey &&
				defsKey !== rootTitle &&
				!ancestry.has(defsKey)
			) {
				const embeddedClone = this.createEmbeddedSchemaClone(context, embeddedSchema, embeddedMode);
				this.inlineEmbeddedSchemasInNode(
					context,
					rootSchema,
					embeddedClone,
					rootTitle,
					new Set([...ancestry, defsKey])
				);

				if (embeddedMode === EmbeddedSchemaMode.Defs) {
					rootSchema.$defs ??= {};
					rootSchema.$defs[defsKey] ??= embeddedClone;
					currentNode.$ref = `#/$defs/${defsKey}`;
				} else {
					this.replaceSchemaNode(currentNode, embeddedClone);
					hasInlineReplacement = true;
				}
			}
		}

		for (const value of Object.values(currentNode)) {
			if (Is.array(value)) {
				for (const item of value) {
					if (Is.object<IJsonSchema>(item)) {
						hasInlineReplacement =
							this.inlineEmbeddedSchemasInNode(context, rootSchema, item, rootTitle, ancestry) ||
							hasInlineReplacement;
					}
				}
			} else if (Is.object<{ [id: string]: unknown }>(value)) {
				for (const nestedValue of Object.values(value)) {
					if (Is.object<IJsonSchema>(nestedValue)) {
						hasInlineReplacement =
							this.inlineEmbeddedSchemasInNode(
								context,
								rootSchema,
								nestedValue,
								rootTitle,
								ancestry
							) || hasInlineReplacement;
					}
				}
			}
		}

		if (hasInlineReplacement) {
			this.flattenInlineAllOfBranches(currentNode);
		}

		return hasInlineReplacement;
	}

	/**
	 * Flatten inline-expanded object allOf branches into the containing schema.
	 * @param schema The schema to flatten.
	 */
	private flattenInlineAllOfBranches(schema: IJsonSchema): void {
		if (!Is.array(schema.allOf) || schema.allOf.length === 0) {
			return;
		}

		const remainingBranches: IJsonSchema[] = [];
		const mergedProperties: { [id: string]: IJsonSchema } = {};
		const mergedRequired = new Set<string>(
			(Is.array(schema.required) ? schema.required : []).filter(
				(requiredKey): requiredKey is string => Is.stringValue(requiredKey)
			)
		);
		let hasMergedBranch = false;

		for (const branch of schema.allOf) {
			if (this.canFlattenInlineAllOfBranch(branch)) {
				hasMergedBranch = true;
				schema.type ??= "object";
				if (Is.object(branch.properties)) {
					Object.assign(mergedProperties, branch.properties);
				}
				if (Is.array(branch.required)) {
					for (const requiredKey of branch.required) {
						if (Is.stringValue(requiredKey)) {
							mergedRequired.add(requiredKey);
						}
					}
				}
			} else {
				remainingBranches.push(branch);
			}
		}

		if (!hasMergedBranch) {
			return;
		}

		if (Object.keys(mergedProperties).length > 0) {
			schema.properties = Object.assign(schema.properties ?? {}, mergedProperties);
		}

		if (mergedRequired.size > 0) {
			schema.required = [...mergedRequired];
		}

		if (remainingBranches.length > 0) {
			schema.allOf = remainingBranches;
		} else {
			delete schema.allOf;
		}
	}

	/**
	 * Determine whether an allOf branch can be flattened into its parent after inline embedding.
	 * @param branch The allOf branch.
	 * @returns True if the branch is a plain object schema.
	 */
	private canFlattenInlineAllOfBranch(branch: IJsonSchema): boolean {
		return Boolean(
			!branch.$ref &&
			!branch.allOf &&
			!branch.anyOf &&
			!branch.oneOf &&
			!branch.items &&
			(branch.type === "object" || Is.object(branch.properties) || Is.array(branch.required))
		);
	}

	/**
	 * Create a clone of an embedded schema suitable for defs or inline expansion.
	 * @param context The generation context.
	 * @param embeddedSchema The source schema.
	 * @param embeddedMode The embedding mode.
	 * @returns The cloned schema.
	 */
	private createEmbeddedSchemaClone(
		context: ITypeScriptToSchemaContext,
		embeddedSchema: IJsonSchema,
		embeddedMode: EmbeddedSchemaMode
	): IJsonSchema {
		let embeddedClone = ObjectHelper.clone(embeddedSchema);
		if (embeddedMode === EmbeddedSchemaMode.Inline) {
			embeddedClone = JsonSchemaBuilder.expandAllOfReferences(context, embeddedClone);
			this.removeSchemaComments(embeddedClone);
		}
		delete embeddedClone.$schema;
		delete embeddedClone.$id;
		if (embeddedMode === EmbeddedSchemaMode.Inline) {
			delete embeddedClone.title;
		}

		return embeddedClone;
	}

	/**
	 * Replace the contents of a schema node while keeping the same object reference.
	 * @param target The schema node to mutate.
	 * @param replacement The replacement content.
	 */
	private replaceSchemaNode(target: IJsonSchema, replacement: IJsonSchema): void {
		for (const key of Object.keys(target)) {
			delete target[key as keyof IJsonSchema];
		}

		Object.assign(target, replacement);
	}

	/**
	 * Find a generated schema by its canonical id across all loaded packages.
	 * @param context The generation context.
	 * @param schemaId The schema id to locate.
	 * @returns The schema when found.
	 */
	private findSchemaById(
		context: ITypeScriptToSchemaContext,
		schemaId: string
	): IJsonSchema | undefined {
		return Object.values(context.schemas)
			.flatMap(packageSchemas => Object.values(packageSchemas))
			.find(schema => schema.$id === schemaId);
	}

	/**
	 * Resolve the local $defs key to use for an embedded schema.
	 * @param schema The embedded schema.
	 * @param schemaId The canonical schema id.
	 * @returns The local definition key.
	 */
	private getEmbeddedDefinitionKey(schema: IJsonSchema, schemaId: string): string {
		return schema.title ?? schemaId.split("/").pop() ?? schemaId;
	}

	/**
	 * Remove $comment fields from a schema tree.
	 * @param schema The schema tree to clean.
	 */
	private removeSchemaComments(schema: IJsonSchema): void {
		delete schema.$comment;

		for (const value of Object.values(schema)) {
			if (Is.array(value)) {
				for (const item of value) {
					if (Is.object<IJsonSchema>(item)) {
						this.removeSchemaComments(item);
					}
				}
			} else if (Is.object<{ [id: string]: unknown }>(value)) {
				for (const nestedValue of Object.values(value)) {
					if (Is.object<IJsonSchema>(nestedValue)) {
						this.removeSchemaComments(nestedValue);
					}
				}
			}
		}
	}

	/**
	 * Determine whether an input value is a valid TypeScript type identifier.
	 * An identifier must start with a letter, underscore, or dollar sign and contain only
	 * alphanumerics, underscores, or dollar signs thereafter.
	 * @param value The value to inspect.
	 * @returns True if the value looks like a type name.
	 * @internal
	 */
	private isTypeNameInput(value: string): boolean {
		return /^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(value);
	}
}
