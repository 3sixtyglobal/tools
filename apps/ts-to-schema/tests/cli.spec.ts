// Copyright 2024 IOTA Stiftung.
// Copyright 2026 3Sixty Trade Ltd.
// SPDX-License-Identifier: Apache-2.0.
import { copyFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { CLIDisplay } from "@3sixty/cli-core";
import { CLI } from "../src/cli.js";
import { DEFAULT_CACHE_FILE } from "../src/commands/tsToSchema.js";
import type { ITsToSchemaConfig } from "../src/models/ITsToSchemaConfig.js";

const TEST_DATA_LOCATION = path.resolve(path.join(__dirname, ".tmp"));
const TEST_CONFIG_LOCATION = path.join(TEST_DATA_LOCATION, "config");
const TEST_WORKING_LOCATION = path.join(TEST_DATA_LOCATION, "work");
const TEST_OUTPUT_FOLDER = path.join(TEST_DATA_LOCATION, "output");
const TEST_COMPILED_FOLDER = path.join(TEST_DATA_LOCATION, "compiled");
const TEST_COMPILED_CODES_FOLDER = path.join(TEST_DATA_LOCATION, "compiled-codes");
const TEST_COMPILED_FORMATS_FOLDER = path.join(TEST_DATA_LOCATION, "compiled-formats");
const TEST_INCREMENTAL_SOURCE_FOLDER = path.join(TEST_DATA_LOCATION, "incremental-source");
const TEST_INCREMENTAL_OUTPUT_FOLDER = path.join(TEST_DATA_LOCATION, "incremental-output");
const TEST_INCREMENTAL_COMPILED_FOLDER = path.join(TEST_DATA_LOCATION, "incremental-compiled");
const TEST_INCREMENTAL_CACHE_FILE = path.join(TEST_DATA_LOCATION, "incremental.cache.json");
const JSON_LD_TYPES = [
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
];
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
		await rm(TEST_COMPILED_FOLDER, { recursive: true, force: true });
		await rm(TEST_COMPILED_CODES_FOLDER, { recursive: true, force: true });
		await rm(TEST_INCREMENTAL_SOURCE_FOLDER, { recursive: true, force: true });
		await rm(TEST_INCREMENTAL_OUTPUT_FOLDER, { recursive: true, force: true });
		await rm(TEST_INCREMENTAL_COMPILED_FOLDER, { recursive: true, force: true });
		await rm(TEST_INCREMENTAL_CACHE_FILE, { force: true });
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
			baseUrl: "https://schema.3sixty.global/my-namespace/",
			types: JSON_LD_TYPES
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
			baseUrl: "https://schema.3sixty.global/my-namespace/",
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

	test("Can run with command line arguments and compile the validators", async () => {
		const cli = new CLI();
		const config: ITsToSchemaConfig = {
			baseUrl: "https://schema.3sixty.global/my-namespace/",
			types: JSON_LD_TYPES
		};

		const configFile = path.join(TEST_CONFIG_LOCATION, "config.json");
		await writeFile(configFile, JSON.stringify(config, undefined, "\t"));
		const res = await cli.run(
			["node", "script", configFile, TEST_OUTPUT_FOLDER, TEST_COMPILED_FOLDER],
			"./dist/locales",
			{
				overrideOutputWidth: 1000
			}
		);
		expect(res).toEqual(0);

		const codeFile = path.join(TEST_COMPILED_FOLDER, "validators.ts");
		const code = await readFile(codeFile, "utf8");
		expect(code).toContain("// @ts-nocheck");
		expect(code).toContain('["message"]:');
		expect(code).not.toMatch(/[,{]message:/);
		expect(code).toContain("export const CompiledJsonLdNodeObject: ICompiledValidator = ");
		const validators = await import(codeFile);
		expect(validators.CompiledJsonLdNodeObject({ "@id": "https://example.org/1" })).toEqual(true);
		expect(validators.CompiledJsonLdNodeObject({ "@id": 1 })).toEqual(false);
		expect(validators.CompiledJsonLdNodeObject.errors.length).toBeGreaterThan(0);
	});

	test("Can compile formats using the formats from data-core", async () => {
		const cli = new CLI();
		const config: ITsToSchemaConfig = {
			baseUrl: "https://schema.3sixty.global/my-namespace/",
			types: ["./tests/testData/ITestFormats.ts"]
		};

		const configFile = path.join(TEST_CONFIG_LOCATION, "config.json");
		await writeFile(configFile, JSON.stringify(config, undefined, "\t"));
		const res = await cli.run(
			["node", "script", configFile, TEST_OUTPUT_FOLDER, TEST_COMPILED_FORMATS_FOLDER],
			"./dist/locales",
			{
				overrideOutputWidth: 1000
			}
		);
		expect(res).toEqual(0);

		const codeFile = path.join(TEST_COMPILED_FORMATS_FOLDER, "validators.ts");
		const code = await readFile(codeFile, "utf8");
		const dataCoreImport =
			'import { type ICompiledValidator, JsonSchemaFormats } from "@3sixty/data-core";';
		expect(code).toContain(dataCoreImport);
		expect(code).not.toContain("ajv-formats");

		// data-core is not a dependency of the app, so use the formats it exports from ajv-formats.
		const testCodeFile = path.join(TEST_COMPILED_FORMATS_FOLDER, "validators-test.ts");
		await writeFile(
			testCodeFile,
			code.replace(
				dataCoreImport,
				'import { fullFormats as JsonSchemaFormats } from "ajv-formats/dist/formats.js";'
			)
		);
		const validators = await import(testCodeFile);
		expect(validators.CompiledTestFormats({ created: "2026-09-25T10:00:00Z" })).toEqual(true);
		expect(validators.CompiledTestFormats({ created: "not-a-date" })).toEqual(false);
	});

	test("Can compile a list of const values using its as const object", async () => {
		const cli = new CLI();
		const config: ITsToSchemaConfig = {
			baseUrl: "https://schema.3sixty.global/my-namespace/",
			types: ["./tests/testData/testCodes.ts", "./tests/testData/testNumericCodes.ts"]
		};

		const configFile = path.join(TEST_CONFIG_LOCATION, "config.json");
		await writeFile(configFile, JSON.stringify(config, undefined, "\t"));
		const res = await cli.run(
			["node", "script", configFile, TEST_OUTPUT_FOLDER, TEST_COMPILED_CODES_FOLDER],
			"./dist/locales",
			{
				overrideOutputWidth: 1000
			}
		);
		expect(res).toEqual(0);

		const codeFile = path.join(TEST_COMPILED_CODES_FOLDER, "validators.ts");
		const code = await readFile(codeFile, "utf8");
		expect(code).toContain('from "../../testData/testCodes.js";');
		expect(code).toContain('Object.values(external0["TestCodes"])');
		// Object.values would reorder the integer like key, so its anyOf is compiled instead.
		expect(code).not.toContain('["TestNumericCodes"]');

		const validators = await import(codeFile);
		expect(validators.CompiledTestNumericCodes("numbered")).toEqual(true);
		expect(validators.CompiledTestNumericCodes("other")).toEqual(false);
		expect(validators.CompiledTestCodes("first")).toEqual(true);
		expect(validators.CompiledTestCodes("third")).toEqual(false);
		expect(validators.CompiledTestCodes.errors).toEqual([
			{
				instancePath: "",
				schemaPath: "#/anyOf/0/const",
				keyword: "const",
				params: { allowedValue: "first" },
				message: "must be equal to constant"
			},
			{
				instancePath: "",
				schemaPath: "#/anyOf/1/const",
				keyword: "const",
				params: { allowedValue: "second" },
				message: "must be equal to constant"
			},
			{
				instancePath: "",
				schemaPath: "#/anyOf",
				keyword: "anyOf",
				params: {},
				message: "must match a schema in anyOf"
			}
		]);
	});

	describe("Incremental", () => {
		const sourceFile = path.join(TEST_INCREMENTAL_SOURCE_FOLDER, "testCodes.ts");
		const schemaFile = path.join(TEST_INCREMENTAL_OUTPUT_FOLDER, "TestCodes.json");
		const configFile = path.join(TEST_CONFIG_LOCATION, "incremental.json");

		/**
		 * Run the CLI with the incremental option.
		 * @param cacheFile The cache file to pass, or undefined to use the default.
		 * @returns The exit code.
		 */
		async function runIncremental(cacheFile?: string): Promise<number> {
			const cli = new CLI();
			return cli.run(
				[
					"node",
					"script",
					configFile,
					TEST_INCREMENTAL_OUTPUT_FOLDER,
					TEST_INCREMENTAL_COMPILED_FOLDER,
					"--incremental",
					...(cacheFile ? [cacheFile] : [])
				],
				"./dist/locales",
				{
					overrideOutputWidth: 1000
				}
			);
		}

		beforeAll(async () => {
			await mkdir(TEST_INCREMENTAL_SOURCE_FOLDER, { recursive: true });
			await copyFile("./tests/testData/testCodes.ts", sourceFile);
			const config: ITsToSchemaConfig = {
				baseUrl: "https://schema.3sixty.global/my-namespace/",
				types: [`./${path.relative(process.cwd(), sourceFile).replace(/\\/g, "/")}`]
			};
			await writeFile(configFile, JSON.stringify(config, undefined, "\t"));
		});

		test("Can write the cache when generating the schemas", async () => {
			await rm(TEST_INCREMENTAL_CACHE_FILE, { force: true });
			const res = await runIncremental(TEST_INCREMENTAL_CACHE_FILE);
			expect(res).toEqual(0);

			const cache = JSON.parse(await readFile(TEST_INCREMENTAL_CACHE_FILE, "utf8"));
			expect(cache.toolVersion).toMatch(/^\d+\.\d+\.\d+/);
			expect(cache.inputs).toMatch(/^[\da-f]{64}$/);
			expect(Object.keys(cache.outputs)).toEqual([
				"tests/.tmp/incremental-compiled/validators.ts",
				"tests/.tmp/incremental-output/TestCodes.json"
			]);
		});

		test("Can skip the generation when nothing has changed", async () => {
			const before = await stat(schemaFile);
			const res = await runIncremental(TEST_INCREMENTAL_CACHE_FILE);
			expect(res).toEqual(0);
			const after = await stat(schemaFile);
			expect(after.mtimeMs).toEqual(before.mtimeMs);
		});

		test("Can regenerate when a source file has changed", async () => {
			const source = await readFile(sourceFile, "utf8");
			await writeFile(sourceFile, source.replace('Second: "second"', 'Second: "changed"'));
			const res = await runIncremental(TEST_INCREMENTAL_CACHE_FILE);
			expect(res).toEqual(0);
			const content = await readFile(schemaFile, "utf8");
			expect(content).toContain('"changed"');
		});

		test("Can regenerate when an output has been removed", async () => {
			await rm(schemaFile);
			const res = await runIncremental(TEST_INCREMENTAL_CACHE_FILE);
			expect(res).toEqual(0);
			await expect(stat(schemaFile)).resolves.toBeDefined();
		});

		test("Can regenerate when an output has been edited", async () => {
			await writeFile(schemaFile, "{}");
			const res = await runIncremental(TEST_INCREMENTAL_CACHE_FILE);
			expect(res).toEqual(0);
			const content = await readFile(schemaFile, "utf8");
			expect(content).toContain('"changed"');
		});

		test("Can use the default cache file", async () => {
			const defaultCacheFile = path.resolve(DEFAULT_CACHE_FILE);
			await rm(defaultCacheFile, { force: true });
			try {
				const res = await runIncremental();
				expect(res).toEqual(0);
				await expect(stat(defaultCacheFile)).resolves.toBeDefined();
			} finally {
				await rm(defaultCacheFile, { force: true });
			}
		});
	});
});
