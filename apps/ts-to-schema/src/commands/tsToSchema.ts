// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { CLIDisplay, CLIUtils } from "@twin.org/cli-core";
import { GeneralError, I18n, Is, StringHelper } from "@twin.org/core";
import { TypeScriptToSchema } from "@twin.org/tools-core";
import type { IJsonSchema } from "@twin.org/tools-models";
import type { Command } from "commander";
import { compileValidators } from "./compileValidators.js";
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
		.argument(
			I18n.formatMessage("commands.ts-to-schema.options.compiled-folder.param"),
			I18n.formatMessage("commands.ts-to-schema.options.compiled-folder.description")
		)
		.action(async (config, outputFolder, compiledFolder, opts) => {
			await actionCommandTsToSchema(config, outputFolder, compiledFolder, opts);
		});
}

/**
 * Action the root command.
 * @param configFile The optional configuration file.
 * @param outputFolder The output folder for the schemas.
 * @param compiledFolder The optional output folder for the compiled validators of the schemas.
 * @param opts The options for the command.
 */
export async function actionCommandTsToSchema(
	configFile: string,
	outputFolder: string,
	compiledFolder: string | undefined,
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
		const fullCompiledFolder = Is.stringValue(compiledFolder)
			? path.resolve(compiledFolder)
			: undefined;
		if (Is.stringValue(fullCompiledFolder)) {
			CLIDisplay.value(
				I18n.formatMessage("commands.ts-to-schema.labels.compiledFolder"),
				fullCompiledFolder
			);
		}
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

		const schemas = await tsToSchema(config ?? {}, fullOutputFolder, outputWorkingDir);

		if (Is.stringValue(fullCompiledFolder)) {
			await compileValidators(config, schemas, fullCompiledFolder, process.cwd());
		}

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
 * @returns The schemas written.
 */
export async function tsToSchema(
	config: ITsToSchemaConfig,
	outputFolder: string,
	workingDirectory: string
): Promise<IJsonSchema[]> {
	CLIDisplay.break();
	CLIDisplay.task(I18n.formatMessage("commands.ts-to-schema.progress.writingSchemas"));

	const typeScriptToSchema = new TypeScriptToSchema();
	const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};

	let combinedSchemas: { [id: string]: IJsonSchema } = {};
	const writtenSchemas: IJsonSchema[] = [];
	for (const typeSource of config.types) {
		const typeSourceParts = typeSource.split("/");
		const typeName = StringHelper.pascalCase(
			typeSourceParts[typeSourceParts.length - 1].replace(/(\.d)?\.ts$/, ""),
			false
		);
		const schemaTitle = StringHelper.stripPrefix(typeName);

		CLIDisplay.task(I18n.formatMessage("commands.ts-to-schema.progress.generatingSchema"));
		CLIDisplay.value(I18n.formatMessage("commands.ts-to-schema.progress.models"), typeSource, 1);

		if (!combinedSchemas[schemaTitle]) {
			const schemas = await typeScriptToSchema.generateSchema(
				config.baseUrl,
				config.baseUrl,
				packageSchemas,
				typeSource,
				{
					externalReferences: config.externalReferences,
					suppressPackageWarnings: config.suppressPackageWarnings,
					onDiagnostic: diagnostic => {
						const message = I18n.hasMessage(diagnostic.code)
							? I18n.formatMessage(diagnostic.code, diagnostic.properties)
							: diagnostic.code;
						CLIDisplay.warning(
							I18n.formatMessage("commands.ts-to-schema.warnings.schemaDiagnostic", {
								message,
								path: diagnostic.path
							})
						);
					}
				}
			);
			if (Is.empty(schemas[schemaTitle])) {
				throw new GeneralError("commands", "commands.ts-to-schema.schemaNotFound", {
					type: typeName
				});
			}
			combinedSchemas = { ...combinedSchemas, ...schemas };
		}

		const schemaObject = combinedSchemas[schemaTitle];

		const content = JSON.stringify(schemaObject, undefined, "\t");

		const filename = path.join(outputFolder, `${StringHelper.stripPrefix(typeName)}.json`);
		CLIDisplay.value(
			I18n.formatMessage("commands.ts-to-schema.progress.writingSchema"),
			filename,
			1
		);
		await writeFile(filename, `${content}\n`);
		writtenSchemas.push(schemaObject);
	}

	return writtenSchemas;
}
