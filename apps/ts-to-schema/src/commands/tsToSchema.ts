// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { CLIDisplay, CLIUtils } from "@twin.org/cli-core";
import { GeneralError, I18n, Is, StringHelper } from "@twin.org/core";
import { type IJsonSchema, JsonSchemaHelper } from "@twin.org/tools-core";
import type { Command } from "commander";
import { createGenerator } from "ts-json-schema-generator";
import type { ITsToSchemaConfig } from "../models/ITsToSchemaConfig.js";

/**
 * Build the root command to be consumed by the CLI.
 * @param program The command to build on.
 */
export function buildCommandTsToSchema(program: Command): void {
	program
		.argument(
			I18n.formatMessage("commands.ts-to-schema.options.config.param"),
			I18n.formatMessage("commands.ts-to-schema.options.config.description")
		)
		.argument(
			I18n.formatMessage("commands.ts-to-schema.options.output-folder.param"),
			I18n.formatMessage("commands.ts-to-schema.options.output-folder.description")
		)
		.action(async (config, outputFolder, opts) => {
			await actionCommandTsToSchema(config, outputFolder, opts);
		});
}

/**
 * Action the root command.
 * @param configFile The optional configuration file.
 * @param outputFolder The output folder for the schemas.
 * @param opts The options for the command.
 */
export async function actionCommandTsToSchema(
	configFile: string,
	outputFolder: string,
	opts: unknown
): Promise<void> {
	let outputWorkingDir: string | undefined;
	try {
		let config: ITsToSchemaConfig | undefined;

		const fullConfigFile = path.resolve(configFile);
		const fullOutputFolder = path.resolve(outputFolder);
		outputWorkingDir = path.join(fullOutputFolder, "working");

		CLIDisplay.value(I18n.formatMessage("commands.ts-to-schema.labels.configJson"), fullConfigFile);
		CLIDisplay.value(
			I18n.formatMessage("commands.ts-to-schema.labels.outputFolder"),
			fullOutputFolder
		);
		CLIDisplay.value(
			I18n.formatMessage("commands.ts-to-schema.labels.outputWorkingDir"),
			outputWorkingDir
		);
		CLIDisplay.break();

		try {
			CLIDisplay.task(I18n.formatMessage("commands.ts-to-schema.progress.loadingConfigJson"));
			CLIDisplay.break();

			config = await CLIUtils.readJsonFile<ITsToSchemaConfig>(fullConfigFile);
		} catch (err) {
			throw new GeneralError("commands", "commands.ts-to-schema.configFailed", undefined, err);
		}

		if (Is.empty(config)) {
			throw new GeneralError("commands", "commands.ts-to-schema.configFailed");
		}

		CLIDisplay.task(I18n.formatMessage("commands.ts-to-schema.progress.creatingWorkingDir"));
		await mkdir(outputWorkingDir, { recursive: true });
		CLIDisplay.break();

		await tsToSchema(config ?? {}, fullOutputFolder, outputWorkingDir);

		CLIDisplay.break();
		CLIDisplay.done();
	} finally {
		try {
			if (outputWorkingDir) {
				await rm(outputWorkingDir, { recursive: true });
			}
		} catch {}
	}
}

/**
 * Convert the TypeScript definitions to JSON Schemas.
 * @param config The configuration for the app.
 * @param outputFolder The location of the folder to output the JSON schemas.
 * @param workingDirectory The folder the app was run from.
 */
export async function tsToSchema(
	config: ITsToSchemaConfig,
	outputFolder: string,
	workingDirectory: string
): Promise<void> {
	await writeFile(
		path.join(workingDirectory, "tsconfig.json"),
		JSON.stringify(
			{
				compilerOptions: {
					module: "nodenext",
					moduleResolution: "nodenext",
					target: "ES2022"
				}
			},
			undefined,
			"\t"
		)
	);

	CLIDisplay.break();
	CLIDisplay.task(I18n.formatMessage("commands.ts-to-schema.progress.writingSchemas"));
	for (const typeSource of config.types) {
		const typeSourceParts = typeSource.split("/");
		const type = StringHelper.pascalCase(
			typeSourceParts[typeSourceParts.length - 1].replace(/(\.d)?\.ts$/, ""),
			false
		);

		let schemaObject;
		if (Is.object<IJsonSchema>(config.overrides?.[type])) {
			CLIDisplay.task(I18n.formatMessage("commands.ts-to-schema.progress.overridingSchema"));
			schemaObject = config.overrides?.[type];
		} else {
			CLIDisplay.task(I18n.formatMessage("commands.ts-to-schema.progress.generatingSchema"));

			const autoExpandTypes = config.autoExpandTypes ?? [];
			const defaultExpandTypes = ["/ObjectOrArray<.*>/"];
			for (const defaultType of defaultExpandTypes) {
				if (!autoExpandTypes.includes(defaultType)) {
					autoExpandTypes.push(defaultType);
				}
			}

			const schemas = await generateSchemas(typeSource, type, autoExpandTypes, workingDirectory);
			if (Is.empty(schemas[type])) {
				throw new GeneralError("commands", "commands.ts-to-schema.schemaNotFound", { type });
			}
			schemaObject = schemas[type];
		}

		schemaObject = finaliseSchema(schemaObject, config.baseUrl, type);

		let content = JSON.stringify(schemaObject, undefined, "\t");

		if (Is.objectValue(config.externalReferences)) {
			for (const external in config.externalReferences) {
				content = content.replace(
					new RegExp(`#/definitions/${external}`, "g"),
					config.externalReferences[external]
				);
			}
		}

		// First replace all types that start with II to a single I with the new base url
		content = content.replace(/#\/definitions\/II(.*)/g, `${config.baseUrl}I$1`);

		// Then other types starting with capitals (optionally interfaces starting with I)
		content = content.replace(/#\/definitions\/I?([A-Z].*)/g, `${config.baseUrl}$1`);

		const filename = path.join(outputFolder, `${StringHelper.stripPrefix(type)}.json`);
		CLIDisplay.value(
			I18n.formatMessage("commands.ts-to-schema.progress.writingSchema"),
			filename,
			1
		);
		await writeFile(filename, `${content}\n`);
	}
}

/**
 * Generate schemas for the models.
 * @param modelDirWildcards The filenames for all the models.
 * @param types The types of the schema objects.
 * @param autoExpandTypes The types to automatically expand.
 * @param outputWorkingDir The working directory.
 * @returns Nothing.
 * @internal
 */
async function generateSchemas(
	typeSource: string,
	type: string,
	autoExpandTypes: string[],
	outputWorkingDir: string
): Promise<{
	[id: string]: IJsonSchema;
}> {
	const allSchemas: { [id: string]: IJsonSchema } = {};

	CLIDisplay.value(I18n.formatMessage("commands.ts-to-schema.progress.models"), typeSource, 1);
	const generator = createGenerator({
		path: typeSource,
		type,
		tsconfig: path.join(outputWorkingDir, "tsconfig.json"),
		skipTypeCheck: true,
		expose: "all"
	});

	const schema = generator.createSchema("*");

	if (schema.definitions) {
		for (const def in schema.definitions) {
			const defSub = JsonSchemaHelper.normaliseTypeName(def);
			allSchemas[defSub] = schema.definitions[def] as IJsonSchema;
		}
	}

	const referencedSchemas: { [id: string]: IJsonSchema } = {};

	JsonSchemaHelper.extractTypes(allSchemas, [type, ...autoExpandTypes], referencedSchemas);
	JsonSchemaHelper.expandTypes(referencedSchemas, autoExpandTypes);

	return referencedSchemas;
}

/**
 * Process the schema object to ensure it has the correct properties.
 * @param schemaObject The schema object to process.
 * @param baseUrl The base URL for the schema references.
 * @param type The type of the schema object.
 * @returns The finalised schema object.
 */
function finaliseSchema(schemaObject: IJsonSchema, baseUrl: string, type: string): IJsonSchema {
	JsonSchemaHelper.processArrays(schemaObject);
	const { description, ...rest } = schemaObject;
	return {
		$schema: JsonSchemaHelper.SCHEMA_VERSION,
		$id: `${baseUrl}${StringHelper.stripPrefix(type)}`,
		description,
		...rest
	};
}
