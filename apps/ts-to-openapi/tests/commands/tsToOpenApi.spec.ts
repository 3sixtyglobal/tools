// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { deepStrictEqual } from "node:assert";
import { mkdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { CLIDisplay } from "@twin.org/cli-core";
import { Is } from "@twin.org/core";
import { tsToOpenApi } from "../../src/commands/tsToOpenApi.js";
import type { ITsToOpenApiConfig } from "../../src/models/ITsToOpenApiConfig.js";

const TEST_DATA_LOCATION = path.resolve(path.join(__dirname, ".tmp"));
const TEST_CONFIG_LOCATION = path.join(TEST_DATA_LOCATION, "config");
const TEST_WORKING_LOCATION = path.join(TEST_DATA_LOCATION, "work");
const TEST_OUTPUT_FILE2 = path.join(TEST_DATA_LOCATION, "output2.json");
const TEST_FIXTURES_LOCATION = path.join(__dirname, "fixtures");

let writeBuffer: string[] = [];
let errorBuffer: string[] = [];

function toOrderedDeepValue(value: unknown): unknown {
	if (Is.array(value)) {
		return value.map(v => toOrderedDeepValue(v));
	}

	if (Is.object(value)) {
		return Object.entries(value)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([key, nestedValue]) => [key, toOrderedDeepValue(nestedValue)]);
	}

	return value;
}

describe("TSToOpenApi", () => {
	beforeEach(async () => {
		await rm(TEST_DATA_LOCATION, { recursive: true, force: true });
		await mkdir(TEST_CONFIG_LOCATION, { recursive: true });
		await mkdir(TEST_WORKING_LOCATION, { recursive: true });

		writeBuffer = [];
		errorBuffer = [];

		CLIDisplay.write = (buffer: string | Uint8Array): void => {
			writeBuffer.push(...buffer.toString().split("\n"));
		};

		CLIDisplay.writeError = (buffer: string | Uint8Array): void => {
			errorBuffer.push(...buffer.toString().split("\n"));
		};
	});

	afterEach(async () => {
		await rm(TEST_CONFIG_LOCATION, { recursive: true, force: true });
		await rm(TEST_WORKING_LOCATION, { recursive: true, force: true });
	});

	test("Can run using process directly valid config", async () => {
		const config: ITsToOpenApiConfig = {
			title: "TWIN - Test Endpoints",
			version: "1.0.0",
			description: "REST API for TWIN - Test Endpoints.",
			licenseName: "Apache 2.0 License",
			licenseUrl: "https://opensource.org/licenses/Apache-2.0",
			servers: ["https://localhost"],
			authMethods: ["jwtBearer"],
			restRoutes: []
		};

		const res = await tsToOpenApi(config, TEST_OUTPUT_FILE2, TEST_WORKING_LOCATION);
		expect(res).toEqual(undefined);
	});

	test("Can generate simple spec", async () => {
		const config = JSON.parse(
			await readFile(path.join(TEST_FIXTURES_LOCATION, "simple.config.json"), "utf8")
		) as ITsToOpenApiConfig;
		const expectedOutput = JSON.parse(
			await readFile(path.join(TEST_FIXTURES_LOCATION, "simple.spec.json"), "utf8")
		);

		await tsToOpenApi(config, TEST_OUTPUT_FILE2, TEST_WORKING_LOCATION);

		const output = JSON.parse(await readFile(TEST_OUTPUT_FILE2, "utf8"));

		deepStrictEqual(toOrderedDeepValue(output), toOrderedDeepValue(expectedOutput));
	});

	test("Can generate medium spec", async () => {
		const config = JSON.parse(
			await readFile(path.join(TEST_FIXTURES_LOCATION, "medium.config.json"), "utf8")
		) as ITsToOpenApiConfig;
		const expectedOutput = JSON.parse(
			await readFile(path.join(TEST_FIXTURES_LOCATION, "medium.spec.json"), "utf8")
		);

		await tsToOpenApi(config, TEST_OUTPUT_FILE2, TEST_WORKING_LOCATION);

		const output = JSON.parse(await readFile(TEST_OUTPUT_FILE2, "utf8"));

		deepStrictEqual(toOrderedDeepValue(output), toOrderedDeepValue(expectedOutput));
	});

	test("Can generate advanced spec", async () => {
		const config = JSON.parse(
			await readFile(path.join(TEST_FIXTURES_LOCATION, "advanced.config.json"), "utf8")
		) as ITsToOpenApiConfig;
		const expectedOutput = JSON.parse(
			await readFile(path.join(TEST_FIXTURES_LOCATION, "advanced.spec.json"), "utf8")
		);

		await tsToOpenApi(config, TEST_OUTPUT_FILE2, TEST_WORKING_LOCATION);

		const output = JSON.parse(await readFile(TEST_OUTPUT_FILE2, "utf8"));
		deepStrictEqual(toOrderedDeepValue(output), toOrderedDeepValue(expectedOutput));
	});
});
