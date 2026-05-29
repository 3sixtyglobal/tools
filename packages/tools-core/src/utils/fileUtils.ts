// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { globSync } from "glob";

/**
 * Utility helpers for TypeScript file and directory paths.
 */
export class FileUtils {
	/**
	 * Does the file exist.
	 * @param filePath The file path.
	 * @returns True if the file exists.
	 */
	public static fileExists(filePath: string): boolean {
		return existsSync(filePath);
	}

	/**
	 * Read the file.
	 * @param filePath The file path.
	 * @returns The file contents.
	 */
	public static readFile(filePath: string): string {
		return readFileSync(filePath, "utf-8");
	}

	/**
	 * Resolve a path.
	 * @param filePath The file path.
	 * @returns The resolved path.
	 */
	public static resolvePath(filePath: string): string {
		return path.resolve(filePath);
	}

	/**
	 * Get the current working directory.
	 * @returns The current working directory.
	 */
	public static getCurrentWorkingDirectory(): string {
		return process.cwd();
	}

	/**
	 * Normalize path separators for consistent comparisons.
	 * @param filePath The file path.
	 * @returns The normalized file path.
	 */
	public static normalizeFilePath(filePath: string): string {
		return filePath.replaceAll("\\", "/");
	}

	/**
	 * Get the directory portion of a file path.
	 * @param filePath The file path.
	 * @returns The directory path.
	 */
	public static getDirectoryPath(filePath: string): string {
		const normalizedPath = FileUtils.normalizeFilePath(filePath);
		const lastSeparatorIndex = normalizedPath.lastIndexOf("/");
		return lastSeparatorIndex > -1 ? normalizedPath.slice(0, lastSeparatorIndex) : normalizedPath;
	}

	/**
	 * Resolve a relative path against a base directory.
	 * @param baseDirectory The base directory.
	 * @param relativePath The relative path.
	 * @returns The resolved path.
	 */
	public static resolveRelativePath(baseDirectory: string, relativePath: string): string {
		const normalizedRelative = FileUtils.normalizeFilePath(relativePath);

		// Return absolute paths unchanged (Windows drive letter or POSIX root)
		if (path.isAbsolute(normalizedRelative)) {
			return normalizedRelative;
		}

		const normalizedBase = FileUtils.normalizeFilePath(baseDirectory);

		if (path.isAbsolute(normalizedBase)) {
			return FileUtils.normalizeFilePath(path.resolve(baseDirectory, relativePath));
		}

		// Base was relative — resolve to absolute then express relative to CWD to preserve relative form
		return FileUtils.normalizeFilePath(
			path.relative(process.cwd(), path.resolve(baseDirectory, relativePath))
		);
	}

	/**
	 * Resolve a local import specifier to a TypeScript source file path.
	 * @param sourceFilePath The importing source file path.
	 * @param importPath The import specifier.
	 * @returns The resolved source file path.
	 */
	public static resolveImportSourceFilePath(
		sourceFilePath: string,
		importPath: string
	): string | undefined {
		const sourceDirectory = FileUtils.getDirectoryPath(sourceFilePath);
		const resolvedBase = FileUtils.resolveRelativePath(sourceDirectory, importPath);
		const baseWithoutExtension = resolvedBase.replace(/\.(c|m)?js$/u, "");
		const candidates = [
			resolvedBase,
			`${resolvedBase}.ts`,
			`${resolvedBase}.d.ts`,
			`${resolvedBase}/index.ts`,
			`${resolvedBase}/index.d.ts`,
			`${baseWithoutExtension}.ts`,
			`${baseWithoutExtension}/index.ts`,
			`${baseWithoutExtension}.d.ts`,
			`${baseWithoutExtension}/index.d.ts`
		];

		for (const candidate of candidates) {
			if (FileUtils.fileExists(candidate)) {
				return candidate;
			}
		}

		return undefined;
	}

	/**
	 * Determine if the provided path includes glob pattern tokens.
	 * @param sourceFileOrGlob The direct source file path or glob pattern.
	 * @returns True if the value is a glob pattern.
	 */
	public static isGlobPattern(sourceFileOrGlob: string): boolean {
		return /[*?[\]{}]/u.test(sourceFileOrGlob);
	}

	/**
	 * Resolve source files from a direct path or a glob pattern.
	 * @param sourceFileOrGlob The direct source file path or glob pattern.
	 * @returns The resolved source file paths.
	 */
	public static resolveSourceFiles(sourceFileOrGlob: string): string[] {
		if (!FileUtils.isGlobPattern(sourceFileOrGlob)) {
			return FileUtils.fileExists(sourceFileOrGlob) ? [sourceFileOrGlob] : [];
		}

		const sourceFiles = globSync(sourceFileOrGlob, {
			windowsPathsNoEscape: true,
			withFileTypes: false
		});

		return sourceFiles
			.filter(
				sourceFile => /\.(ts|tsx|mts|cts)$/u.test(sourceFile) && FileUtils.fileExists(sourceFile)
			)
			.sort((sourceFileA, sourceFileB) => sourceFileA.localeCompare(sourceFileB));
	}
}
