// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { access, rm, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { CLIDisplay } from "@3sixty/cli-core";
import { CLI } from "../src/cli.js";
import { DEFAULT_CACHE_FILE } from "../src/commands/tsToJsonLdContext.js";
import type { ITsToJsonLdContextConfig } from "../src/models/ITsToJsonLdContextConfig.js";

const TEST_DATA_LOCATION = path.resolve(path.join(__dirname, ".tmp"));
const TEST_CONFIG_LOCATION = path.join(TEST_DATA_LOCATION, "config");
const TEST_WORKING_LOCATION = path.join(TEST_DATA_LOCATION, "work");
const TEST_OUTPUT_FOLDER = path.join(TEST_DATA_LOCATION, "output");
const TEST_LOCALES_LOCATION = path.resolve("./dist/locales");
const TEST_FIXTURE_CONFIG_FILE = path.join(__dirname, "data", "config.json");
const TEST_FIXTURE_OUTPUT_FILE = path.join(__dirname, "data", "context.jsonld");
const TEST_INCREMENTAL_CACHE_FILE = path.join(TEST_DATA_LOCATION, "incremental.cache.json");
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
		const config: ITsToJsonLdContextConfig = {
			prefix: "twin-common",
			contextUrl: "https://schema.3sixty.global/common/",
			additionalContextUrls: {
				schema: "http://schema.org/"
			},
			fixedMappings: {
				id: "@id",
				type: "@type"
			},
			types: []
		};

		const configFile = path.join(TEST_CONFIG_LOCATION, "config.json");
		await writeFile(configFile, JSON.stringify(config, undefined, "\t"));
		const res = await cli.run(
			["node", "script", configFile, TEST_OUTPUT_FOLDER],
			TEST_LOCALES_LOCATION,
			{
				overrideOutputWidth: 1000
			}
		);
		expect(res).toEqual(0);
	});

	test("Can run fixture config and validate generated context output", async () => {
		const cli = new CLI();
		const expectedContext = JSON.parse(await readFile(TEST_FIXTURE_OUTPUT_FILE, "utf8"));

		const res = await cli.run(
			["node", "script", TEST_FIXTURE_CONFIG_FILE, TEST_FIXTURE_OUTPUT_FILE],
			TEST_LOCALES_LOCATION,
			{
				overrideOutputWidth: 1000
			}
		);

		expect(res).toEqual(0);

		const generatedContext = JSON.parse(await readFile(TEST_FIXTURE_OUTPUT_FILE, "utf8"));
		expect(generatedContext).toEqual(expectedContext);
	});

	test("Can include ignored property when it has explicit json-ld comment", async () => {
		const cli = new CLI();
		const typeFile = path.join(TEST_WORKING_LOCATION, "IEntity.ts");
		const outputFile = path.join(TEST_WORKING_LOCATION, "ignored-with-comment.context.jsonld");

		await writeFile(
			typeFile,
			`export interface IEntity {
	/**
	 * @json-ld id:customEntityId
	 */
	id: string;
}
`
		);

		const config: ITsToJsonLdContextConfig = {
			prefix: "twin-test",
			contextUrl: "https://schema.3sixty.global/test/",
			fixedMappings: {
				id: "@id",
				type: "@type"
			},
			types: [typeFile]
		};

		const configFile = path.join(TEST_CONFIG_LOCATION, "ignored-with-comment.config.json");
		await writeFile(configFile, JSON.stringify(config, undefined, "\t"));

		const res = await cli.run(["node", "script", configFile, outputFile], TEST_LOCALES_LOCATION, {
			overrideOutputWidth: 1000
		});

		expect(res).toEqual(0);

		const generatedContext = JSON.parse(await readFile(outputFile, "utf8"));
		expect(generatedContext["@context"].id).toEqual({
			"@id": "twin-test:customEntityId"
		});
	});

	test("Can keep referenced additional context urls and omit unused ones", async () => {
		const cli = new CLI();
		const outputFile = path.join(
			TEST_WORKING_LOCATION,
			"additional-context-pruning.context.jsonld"
		);

		const config: ITsToJsonLdContextConfig = {
			prefix: "twin-supply-chain",
			contextUrl: "https://schema.3sixty.global/supply-chain",
			additionalContextUrls: {
				unece: "https://vocabulary.uncefact.org/",
				dcterms: "http://purl.org/dc/terms/",
				xsd: "http://www.w3.org/2001/XMLSchema#",
				sch: "http://schema.org/",
				unused: "https://example.com/unused#"
			},
			fixedMappings: {
				id: "@id",
				type: "@type"
			},
			types: [
				path.join(__dirname, "data", "ISystemEvent.ts"),
				path.join(__dirname, "data", "IEventObject.ts")
			]
		};

		const configFile = path.join(TEST_CONFIG_LOCATION, "additional-context-pruning.config.json");
		await writeFile(configFile, JSON.stringify(config, undefined, "\t"));

		const res = await cli.run(["node", "script", configFile, outputFile], TEST_LOCALES_LOCATION, {
			overrideOutputWidth: 1000
		});

		expect(res).toEqual(0);

		const generatedContext = JSON.parse(await readFile(outputFile, "utf8"));
		expect(generatedContext["@context"].sch).toBeUndefined();
		expect(generatedContext["@context"].unused).toBeUndefined();
	});

	describe("Incremental", () => {
		const typeFile = path.join(TEST_WORKING_LOCATION, "IIncremental.ts");
		const outputFile = path.join(TEST_WORKING_LOCATION, "incremental.context.jsonld");
		const configFile = path.join(TEST_CONFIG_LOCATION, "incremental.config.json");

		/**
		 * Write the type the context is generated from.
		 * @param propertyId The JSON-LD id of its property.
		 */
		async function writeType(propertyId: string): Promise<void> {
			await writeFile(
				typeFile,
				`export interface IIncremental {
	/**
	 * @json-ld id:${propertyId}
	 */
	name: string;
}
`
			);
		}

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
					outputFile,
					"--incremental",
					...(cacheFile ? [cacheFile] : [])
				],
				TEST_LOCALES_LOCATION,
				{
					overrideOutputWidth: 1000
				}
			);
		}

		beforeAll(async () => {
			await writeType("firstName");
			const config: ITsToJsonLdContextConfig = {
				prefix: "twin-test",
				contextUrl: "https://schema.3sixty.global/test/",
				types: [typeFile]
			};
			await writeFile(configFile, JSON.stringify(config, undefined, "\t"));
		});

		test("Can write the cache when generating the context", async () => {
			await rm(TEST_INCREMENTAL_CACHE_FILE, { force: true });
			const res = await runIncremental(TEST_INCREMENTAL_CACHE_FILE);
			expect(res).toEqual(0);

			const cache = JSON.parse(await readFile(TEST_INCREMENTAL_CACHE_FILE, "utf8"));
			expect(cache.inputs).toMatch(/^[\da-f]{64}$/);
			expect(Object.keys(cache.outputs)).toEqual(["tests/.tmp/work/incremental.context.jsonld"]);
		});

		test("Can skip the generation when nothing has changed", async () => {
			const before = await stat(outputFile);
			const res = await runIncremental(TEST_INCREMENTAL_CACHE_FILE);
			expect(res).toEqual(0);
			const after = await stat(outputFile);
			expect(after.mtimeMs).toEqual(before.mtimeMs);
		});

		test("Can regenerate when a source file has changed", async () => {
			await writeType("lastName");
			const res = await runIncremental(TEST_INCREMENTAL_CACHE_FILE);
			expect(res).toEqual(0);
			const generatedContext = JSON.parse(await readFile(outputFile, "utf8"));
			expect(generatedContext["@context"].name).toEqual({ "@id": "twin-test:lastName" });
		});

		test("Can regenerate when the output has been edited", async () => {
			await writeFile(outputFile, "{}");
			const res = await runIncremental(TEST_INCREMENTAL_CACHE_FILE);
			expect(res).toEqual(0);
			const generatedContext = JSON.parse(await readFile(outputFile, "utf8"));
			expect(generatedContext["@context"].name).toEqual({ "@id": "twin-test:lastName" });
		});

		test("Can use the default cache file", async () => {
			const defaultCacheFile = path.resolve(DEFAULT_CACHE_FILE);
			await rm(defaultCacheFile, { force: true });
			try {
				const res = await runIncremental();
				expect(res).toEqual(0);
				await expect(access(defaultCacheFile)).resolves.toBeUndefined();
			} finally {
				await rm(defaultCacheFile, { force: true });
			}
		});
	});
});
