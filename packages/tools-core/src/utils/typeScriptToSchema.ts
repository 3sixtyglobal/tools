// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Is, StringHelper } from "@twin.org/core";
import type { IJsonSchema } from "@twin.org/tools-models";
import { FileUtils } from "./fileUtils.js";
import { JsonSchemaBuilder } from "./jsonSchemaBuilder.js";
import { Resolver } from "./resolver.js";
import { Utility } from "./utility.js";
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
		} else if (Utility.isTypeNameInput(sourceFileOrTypeName)) {
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

		if (Utility.isTypeNameInput(sourceFileOrTypeName)) {
			const requestedTitle = StringHelper.stripPrefix(sourceFileOrTypeName);
			const requestedSchema = context.schemas[context.packageName][requestedTitle];
			if (requestedSchema) {
				generatedSchemas[requestedTitle] = requestedSchema;
			}
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
}
