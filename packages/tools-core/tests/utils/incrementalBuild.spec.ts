// Copyright 2026 3Sixty Trade Ltd.
// SPDX-License-Identifier: Apache-2.0.
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { IIncrementalInputs } from "../../src/models/IIncrementalInputs.js";
import { IncrementalBuild } from "../../src/utils/incrementalBuild.js";

const TEST_FOLDER = path.resolve(path.join(__dirname, "..", ".tmp", "incremental"));
const TEST_PACKAGE_FOLDER = path.join(TEST_FOLDER, "package");
const TEST_TOOL_FOLDER = path.join(TEST_FOLDER, "tool");
const TEST_OUTSIDE_FILE = path.join(TEST_FOLDER, "IOutside.ts");
const TEST_CACHE_FILE = path.join(TEST_FOLDER, "cache", "incremental.json");
const TEST_OUTPUTS = ["src/output/*.json"];

/**
 * Create the inputs for the test package.
 * @param types The types to include.
 * @returns The inputs.
 */
function createInputs(types: string[]): IIncrementalInputs {
	return {
		packageFolder: TEST_PACKAGE_FOLDER,
		toolFolder: TEST_TOOL_FOLDER,
		files: [path.join(TEST_PACKAGE_FOLDER, "config.json")],
		types,
		ignore: ["src/output/**"],
		values: ["src/output"]
	};
}

describe("IncrementalBuild", () => {
	beforeEach(async () => {
		await rm(TEST_FOLDER, { recursive: true, force: true });
		await mkdir(path.join(TEST_PACKAGE_FOLDER, "src", "models"), { recursive: true });
		await mkdir(path.join(TEST_PACKAGE_FOLDER, "src", "output"), { recursive: true });
		await mkdir(TEST_TOOL_FOLDER, { recursive: true });
		await writeFile(path.join(TEST_PACKAGE_FOLDER, "package.json"), '{ "name": "test" }');
		await writeFile(path.join(TEST_PACKAGE_FOLDER, "config.json"), "{}");
		await writeFile(path.join(TEST_PACKAGE_FOLDER, "src", "models", "IModel.ts"), "export {};");
		await writeFile(path.join(TEST_PACKAGE_FOLDER, "src", "output", "Model.json"), "{}");
		await writeFile(path.join(TEST_TOOL_FOLDER, "package.json"), '{ "name": "tool" }');
		await writeFile(TEST_OUTSIDE_FILE, "export {};");
	});

	afterAll(async () => {
		await rm(TEST_FOLDER, { recursive: true, force: true });
	});

	test("can hash the same inputs to the same value", async () => {
		const inputs = createInputs(["./src/models/IModel.ts"]);
		const first = await IncrementalBuild.hashInputs(inputs);
		const second = await IncrementalBuild.hashInputs(inputs);
		expect(first).toMatch(/^[\da-f]{64}$/);
		expect(second).toEqual(first);
	});

	test("can change the hash when a source file in the type folders changes", async () => {
		const inputs = createInputs(["./src/models/IModel.ts"]);
		const before = await IncrementalBuild.hashInputs(inputs);
		await writeFile(path.join(TEST_PACKAGE_FOLDER, "src", "IOther.ts"), "export {};");
		const after = await IncrementalBuild.hashInputs(inputs);
		expect(after).not.toEqual(before);
	});

	test("can change the hash when a file input changes", async () => {
		const inputs = createInputs(["./src/models/IModel.ts"]);
		const before = await IncrementalBuild.hashInputs(inputs);
		await writeFile(path.join(TEST_PACKAGE_FOLDER, "config.json"), '{ "changed": true }');
		const after = await IncrementalBuild.hashInputs(inputs);
		expect(after).not.toEqual(before);
	});

	test("can change the hash when the tool changes", async () => {
		const inputs = createInputs(["./src/models/IModel.ts"]);
		const before = await IncrementalBuild.hashInputs(inputs);
		await writeFile(path.join(TEST_TOOL_FOLDER, "package.json"), '{ "name": "tool", "v": 2 }');
		const after = await IncrementalBuild.hashInputs(inputs);
		expect(after).not.toEqual(before);
	});

	test("can ignore the source files matching the ignore patterns", async () => {
		const inputs = createInputs(["./src/models/IModel.ts"]);
		const before = await IncrementalBuild.hashInputs(inputs);
		await writeFile(path.join(TEST_PACKAGE_FOLDER, "src", "output", "validators.ts"), "export {};");
		const after = await IncrementalBuild.hashInputs(inputs);
		expect(after).toEqual(before);
	});

	test("can hash a type outside the package on its own", async () => {
		const inputs = createInputs([TEST_OUTSIDE_FILE]);
		const before = await IncrementalBuild.hashInputs(inputs);
		await writeFile(TEST_OUTSIDE_FILE, "export const changed = true;");
		const after = await IncrementalBuild.hashInputs(inputs);
		expect(after).not.toEqual(before);
	});

	test("can fail the up to date check when there is no cache", async () => {
		const upToDate = await IncrementalBuild.isUpToDate(
			TEST_CACHE_FILE,
			"inputs",
			TEST_PACKAGE_FOLDER,
			TEST_OUTPUTS
		);
		expect(upToDate).toEqual(false);
	});

	test("can pass the up to date check when the inputs and outputs are unchanged", async () => {
		await IncrementalBuild.writeCache(TEST_CACHE_FILE, "inputs", TEST_PACKAGE_FOLDER, TEST_OUTPUTS);
		const upToDate = await IncrementalBuild.isUpToDate(
			TEST_CACHE_FILE,
			"inputs",
			TEST_PACKAGE_FOLDER,
			TEST_OUTPUTS
		);
		expect(upToDate).toEqual(true);
	});

	test("can fail the up to date check when the inputs have changed", async () => {
		await IncrementalBuild.writeCache(TEST_CACHE_FILE, "inputs", TEST_PACKAGE_FOLDER, TEST_OUTPUTS);
		const upToDate = await IncrementalBuild.isUpToDate(
			TEST_CACHE_FILE,
			"changed",
			TEST_PACKAGE_FOLDER,
			TEST_OUTPUTS
		);
		expect(upToDate).toEqual(false);
	});

	test("can fail the up to date check when an output has changed or been removed", async () => {
		const outputFile = path.join(TEST_PACKAGE_FOLDER, "src", "output", "Model.json");
		await IncrementalBuild.writeCache(TEST_CACHE_FILE, "inputs", TEST_PACKAGE_FOLDER, TEST_OUTPUTS);

		await writeFile(outputFile, '{ "changed": true }');
		const changedUpToDate = await IncrementalBuild.isUpToDate(
			TEST_CACHE_FILE,
			"inputs",
			TEST_PACKAGE_FOLDER,
			TEST_OUTPUTS
		);
		expect(changedUpToDate).toEqual(false);

		await rm(outputFile);
		const removedUpToDate = await IncrementalBuild.isUpToDate(
			TEST_CACHE_FILE,
			"inputs",
			TEST_PACKAGE_FOLDER,
			TEST_OUTPUTS
		);
		expect(removedUpToDate).toEqual(false);
	});

	test("can only track the outputs matching the patterns", async () => {
		await IncrementalBuild.writeCache(TEST_CACHE_FILE, "inputs", TEST_PACKAGE_FOLDER, TEST_OUTPUTS);
		await writeFile(path.join(TEST_PACKAGE_FOLDER, "src", "output", "types.jsonld"), "{}");
		const upToDate = await IncrementalBuild.isUpToDate(
			TEST_CACHE_FILE,
			"inputs",
			TEST_PACKAGE_FOLDER,
			TEST_OUTPUTS
		);
		expect(upToDate).toEqual(true);
	});

	test("can find the folder of the package containing a file", async () => {
		const folder = await IncrementalBuild.findPackageFolder(
			path.join(TEST_PACKAGE_FOLDER, "src", "models", "IModel.ts")
		);
		expect(folder).toEqual(TEST_PACKAGE_FOLDER);
	});

	test("can make a path relative to the package with forward slashes", () => {
		expect(
			IncrementalBuild.relativePath(
				TEST_PACKAGE_FOLDER,
				path.join(TEST_PACKAGE_FOLDER, "src", "models", "IModel.ts")
			)
		).toEqual("src/models/IModel.ts");
	});
});
