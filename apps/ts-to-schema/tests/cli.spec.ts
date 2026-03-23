// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { rm, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { CLIDisplay } from "@twin.org/cli-core";
import { CLI } from "../src/cli.js";
import type { ITsToSchemaConfig } from "../src/models/ITsToSchemaConfig.js";

const TEST_DATA_LOCATION = path.resolve(path.join(__dirname, ".tmp"));
const TEST_CONFIG_LOCATION = path.join(TEST_DATA_LOCATION, "config");
const TEST_WORKING_LOCATION = path.join(TEST_DATA_LOCATION, "work");
const TEST_OUTPUT_FOLDER = path.join(TEST_DATA_LOCATION, "output");
let writeBuffer: string[] = [];
let errorBuffer: string[] = [];

describe("CLI", () => {
	beforeAll(async () => {
		await rm(TEST_DATA_LOCATION, { recursive: true, force: true });
		await mkdir(TEST_CONFIG_LOCATION, { recursive: true });
		await mkdir(TEST_WORKING_LOCATION, { recursive: true });
	});

	afterAll(async () => {
		await rm(TEST_CONFIG_LOCATION, { recursive: true, force: true });
		await rm(TEST_WORKING_LOCATION, { recursive: true, force: true });
	});

	beforeEach(() => {
		writeBuffer = [];
		errorBuffer = [];

		CLIDisplay.write = (buffer: string | Uint8Array): void => {
			writeBuffer.push(...buffer.toString().split("\n"));
		};

		CLIDisplay.writeError = (buffer: string | Uint8Array): void => {
			errorBuffer.push(...buffer.toString().split("\n"));
		};
	});

	test("Can fail to run with no command line arguments", async () => {
		const cli = new CLI();
		const res = await cli.run([], undefined, { overrideOutputWidth: 1000 });
		expect(res).toEqual(1);
	});

	test("Can fail to run with 3 command line arguments and invalid config", async () => {
		const cli = new CLI();
		const res = await cli.run(["node", "script", "config"], "./dist/locales", {
			overrideOutputWidth: 1000
		});
		expect(res).toEqual(1);
	});

	test("Can run with command line arguments and valid config", async () => {
		const cli = new CLI();
		const config: ITsToSchemaConfig = {
			baseUrl: "https://schema.twindev.org/my-namespace/",
			types: [
				"./tests/testData/jsonLd/IJsonLdObject.ts",
				"./tests/testData/jsonLd/IJsonLdDocument.ts",
				"./tests/testData/jsonLd/IJsonLdNodeObject.ts",
				"./tests/testData/jsonLd/IJsonLdNodePrimitive.ts",
				"./tests/testData/jsonLd/IJsonLdGraphObject.ts",
				"./tests/testData/jsonLd/IJsonLdValueObject.ts",
				"./tests/testData/jsonLd/IJsonLdListObject.ts",
				"./tests/testData/jsonLd/IJsonLdSetObject.ts",
				"./tests/testData/jsonLd/IJsonLdLanguageMap.ts",
				"./tests/testData/jsonLd/IJsonLdIndexMap.ts",
				"./tests/testData/jsonLd/IJsonLdIndexMapItem.ts",
				"./tests/testData/jsonLd/IJsonLdIdMap.ts",
				"./tests/testData/jsonLd/IJsonLdTypeMap.ts",
				"./tests/testData/jsonLd/IJsonLdIncludedBlock.ts",
				"./tests/testData/jsonLd/IJsonLdContextDefinition.ts",
				"./tests/testData/jsonLd/IJsonLdContextDefinitionRoot.ts",
				"./tests/testData/jsonLd/IJsonLdContextDefinitionElement.ts",
				"./tests/testData/jsonLd/IJsonLdExpandedTermDefinition.ts",
				"./tests/testData/jsonLd/IJsonLdKeyword.ts",
				"./tests/testData/jsonLd/IJsonLdListOrSetItem.ts",
				"./tests/testData/jsonLd/IJsonLdContainerType.ts",
				"./tests/testData/jsonLd/IJsonLdContainerTypeArray.ts",
				"./tests/testData/jsonLd/IJsonLdJsonPrimitive.ts",
				"./tests/testData/jsonLd/IJsonLdJsonArray.ts",
				"./tests/testData/jsonLd/IJsonLdJsonObject.ts",
				"./tests/testData/jsonLd/IJsonLdJsonValue.ts"
			]
		};

		const configFile = path.join(TEST_CONFIG_LOCATION, "config.json");
		await writeFile(configFile, JSON.stringify(config, undefined, "\t"));
		const res = await cli.run(
			["node", "script", configFile, TEST_OUTPUT_FOLDER],
			"./dist/locales",
			{
				overrideOutputWidth: 1000
			}
		);
		expect(res).toEqual(0);
	});

	test("Can run with command line arguments and valid config with external linked", async () => {
		const cli = new CLI();
		const config: ITsToSchemaConfig = {
			baseUrl: "https://schema.twindev.org/my-namespace/",
			types: ["./tests/testData/IExternalElement.d.ts"],
			externalReferences: {
				IJsonLdNodeObject: "https://example.com/IJsonLdDocument"
			}
		};

		const configFile = path.join(TEST_CONFIG_LOCATION, "config.json");
		await writeFile(configFile, JSON.stringify(config, undefined, "\t"));
		const res = await cli.run(
			["node", "script", configFile, TEST_OUTPUT_FOLDER],
			"./dist/locales",
			{
				overrideOutputWidth: 1000
			}
		);
		expect(res).toEqual(0);
	});
});
