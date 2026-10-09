// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { rm, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { CLIDisplay } from "@3sixty/cli-core";
import { CLI } from "../src/cli.js";
import type { ITsToJsonLdContextConfig } from "../src/models/ITsToJsonLdContextConfig.js";

const TEST_DATA_LOCATION = path.resolve(path.join(__dirname, ".tmp"));
const TEST_CONFIG_LOCATION = path.join(TEST_DATA_LOCATION, "config");
const TEST_WORKING_LOCATION = path.join(TEST_DATA_LOCATION, "work");
const TEST_OUTPUT_FOLDER = path.join(TEST_DATA_LOCATION, "output");
const TEST_LOCALES_LOCATION = path.resolve("./dist/locales");
const TEST_FIXTURE_CONFIG_FILE = path.join(__dirname, "data", "config.json");
const TEST_FIXTURE_OUTPUT_FILE = path.join(__dirname, "data", "context.jsonld");
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
});
