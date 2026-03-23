// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { FileUtils } from "../../src/utils/fileUtils.js";

describe("FileUtils", () => {
	test("can normalize a windows file path", async () => {
		const normalized = FileUtils.normalizeFilePath("a\\b\\c.ts");
		expect(normalized).toBe("a/b/c.ts");
	});

	test("can get a directory path", async () => {
		const directoryPath = FileUtils.getDirectoryPath("tests/utils/file.ts");
		expect(directoryPath).toBe("tests/utils");
	});

	test("can resolve a relative path", async () => {
		const resolvedPath = FileUtils.resolveRelativePath(
			"tests/utils/test-data",
			"../typeScriptToSchema.spec.ts"
		);
		expect(resolvedPath).toBe("tests/utils/typeScriptToSchema.spec.ts");
	});

	test("returns absolute paths unchanged", async () => {
		const prefix = process.platform === "win32" ? "D:/" : "/mnt/d/";
		const absolutePath = `${prefix}work/file.ts`;
		const resolvedPath = FileUtils.resolveRelativePath("tests/utils", absolutePath);
		expect(resolvedPath).toBe(absolutePath);
	});

	test("preserves absolute posix base paths when resolving relatives", async () => {
		const prefix = process.platform === "win32" ? "D:/" : "/mnt/d/";
		const resolvedPath = FileUtils.resolveRelativePath(
			`${prefix}workspace/tools/packages/tools-core/src/utils`,
			"../models/example.ts"
		);
		expect(resolvedPath).toBe(`${prefix}workspace/tools/packages/tools-core/src/models/example.ts`);
	});

	test("can detect glob patterns", async () => {
		expect(FileUtils.isGlobPattern("tests/utils/*.ts")).toBe(true);
		expect(FileUtils.isGlobPattern("tests/utils/file.ts")).toBe(false);
	});

	test("can resolve source files from a glob pattern", async () => {
		const sourceFiles = FileUtils.resolveSourceFiles("tests/utils/testData/utilityType/*.ts");
		expect(sourceFiles.length).toBe(2);
		expect(sourceFiles.some(file => file.endsWith("testUtilityPerson.ts"))).toBe(true);
		expect(sourceFiles.some(file => file.endsWith("testUtilityType.ts"))).toBe(true);
	});
});
