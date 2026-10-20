// Copyright 2026 3Sixty Trade Ltd.
// SPDX-License-Identifier: Apache-2.0.
import { access, mkdir, readFile, realpath, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Converter, Is } from "@3sixty/core";
import { Sha256 } from "@3sixty/crypto";
import { glob } from "glob";
import { FileUtils } from "./fileUtils.js";
import type { IIncrementalCache } from "../models/IIncrementalCache.js";
import type { IIncrementalInputs } from "../models/IIncrementalInputs.js";

/**
 * Helpers for tools which skip generating their outputs when nothing has changed since the last
 * run, recorded in a cache file with the hash of the inputs and of each output.
 */
export class IncrementalBuild {
	/**
	 * Hash the inputs which determine the outputs of a tool: the values, the files, the source files
	 * of the types, the dependencies of the package and the code of the tool and of this package.
	 * @param inputs The inputs to hash.
	 * @returns The hash of the inputs.
	 */
	public static async hashInputs(inputs: IIncrementalInputs): Promise<string> {
		const hash = new Sha256(Sha256.SIZE_256);
		hash.update(Converter.utf8ToBytes(JSON.stringify(inputs.values ?? null)));

		for (const file of inputs.files) {
			const content = await readFile(file);
			hash.update(content);
		}

		// The types can import any file in the folders they live in, so all the source files in them
		// are hashed. A type outside the package is hashed on its own.
		const sourceFolders = new Set<string>();
		for (const type of inputs.types) {
			const relativeType = IncrementalBuild.relativePath(inputs.packageFolder, type);
			if (relativeType.startsWith("../")) {
				const content = await readFile(path.resolve(inputs.packageFolder, type));
				hash.update(Converter.utf8ToBytes(relativeType));
				hash.update(content);
			} else {
				sourceFolders.add(relativeType.split("/")[0]);
			}
		}
		await IncrementalBuild.hashFiles(
			hash,
			inputs.packageFolder,
			[...sourceFolders].map(f => `${f}/**/*.ts`),
			["**/node_modules/**", ...(inputs.ignore ?? [])]
		);

		await IncrementalBuild.hashDependencies(hash, inputs.packageFolder);

		const toolsCoreFolder = await IncrementalBuild.findPackageFolder(
			fileURLToPath(import.meta.url)
		);
		for (const folder of [inputs.toolFolder, toolsCoreFolder]) {
			await IncrementalBuild.hashFiles(
				hash,
				folder,
				["package.json", "dist/es/**/*.js", "src/**/*.ts"],
				[]
			);
		}

		return Converter.bytesToHex(hash.digest());
	}

	/**
	 * Is the last run recorded in the cache still up to date, the inputs have to match and the
	 * outputs must be exactly the files it wrote.
	 * @param cacheFile The cache file.
	 * @param inputs The hash of the current inputs.
	 * @param packageFolder The folder of the package.
	 * @param outputs Patterns relative to the package for the outputs of the tool.
	 * @returns True if the outputs are up to date.
	 */
	public static async isUpToDate(
		cacheFile: string,
		inputs: string,
		packageFolder: string,
		outputs: string[]
	): Promise<boolean> {
		let cache: IIncrementalCache;
		try {
			const content = await readFile(cacheFile, "utf8");
			cache = JSON.parse(content) as IIncrementalCache;
		} catch {
			return false;
		}

		if (cache.inputs !== inputs || !Is.object(cache.outputs)) {
			return false;
		}

		const outputHashes = await IncrementalBuild.hashOutputs(packageFolder, outputs);
		const files = Object.keys(outputHashes);
		return (
			files.length === Object.keys(cache.outputs).length &&
			files.every(f => cache.outputs[f] === outputHashes[f])
		);
	}

	/**
	 * Record the inputs and outputs of a successful run in the cache.
	 * @param cacheFile The cache file.
	 * @param inputs The hash of the inputs.
	 * @param packageFolder The folder of the package.
	 * @param outputs Patterns relative to the package for the outputs of the tool.
	 */
	public static async writeCache(
		cacheFile: string,
		inputs: string,
		packageFolder: string,
		outputs: string[]
	): Promise<void> {
		const outputHashes = await IncrementalBuild.hashOutputs(packageFolder, outputs);
		const cache: IIncrementalCache = {
			inputs,
			outputs: outputHashes
		};
		await mkdir(path.dirname(cacheFile), { recursive: true });
		await writeFile(cacheFile, `${JSON.stringify(cache, undefined, "\t")}\n`);
	}

	/**
	 * Find the folder of the package which contains a file.
	 * @param filePath The file to start from.
	 * @returns The nearest folder above the file containing a package.json.
	 */
	public static async findPackageFolder(filePath: string): Promise<string> {
		let folder = path.dirname(filePath);
		let found = await IncrementalBuild.fileExists(path.join(folder, "package.json"));
		while (!found) {
			const parent = path.dirname(folder);
			if (parent === folder) {
				return path.dirname(filePath);
			}
			folder = parent;
			found = await IncrementalBuild.fileExists(path.join(folder, "package.json"));
		}
		return folder;
	}

	/**
	 * Get the path relative to the package, with forward slashes.
	 * @param packageFolder The folder of the package.
	 * @param filePath The path to make relative.
	 * @returns The relative path.
	 */
	public static relativePath(packageFolder: string, filePath: string): string {
		return FileUtils.normalizeFilePath(
			path.relative(packageFolder, path.resolve(packageFolder, filePath))
		);
	}

	/**
	 * Hash each output file.
	 * @param packageFolder The folder of the package.
	 * @param outputs Patterns relative to the package for the outputs of the tool.
	 * @returns The hash of each file keyed by its path relative to the package.
	 * @internal
	 */
	private static async hashOutputs(
		packageFolder: string,
		outputs: string[]
	): Promise<{ [file: string]: string }> {
		const hashes: { [file: string]: string } = {};
		const files = await IncrementalBuild.findFiles(packageFolder, outputs, []);
		for (const file of files) {
			const content = await readFile(path.join(packageFolder, file));
			hashes[file] = Converter.bytesToHex(Sha256.sum256(content));
		}
		return hashes;
	}

	/**
	 * Hash the version of every dependency of the package. The TWIN dependencies are often linked to
	 * local builds which change without a new version, so their declarations and schemas are hashed
	 * as well.
	 * @param hash The hash to update.
	 * @param packageFolder The folder of the package.
	 * @internal
	 */
	private static async hashDependencies(hash: Sha256, packageFolder: string): Promise<void> {
		let packageJson: {
			dependencies?: { [name: string]: string };
			devDependencies?: { [name: string]: string };
		};
		try {
			const content = await readFile(path.join(packageFolder, "package.json"), "utf8");
			packageJson = JSON.parse(content);
		} catch {
			return;
		}

		const dependencies = Object.keys({
			...packageJson.dependencies,
			...packageJson.devDependencies
		}).sort();

		for (const dependency of dependencies) {
			const dependencyFolder = await IncrementalBuild.resolveDependency(packageFolder, dependency);
			if (Is.stringValue(dependencyFolder)) {
				const dependencyPackageJson = await readFile(
					path.join(dependencyFolder, "package.json"),
					"utf8"
				);
				const version = (JSON.parse(dependencyPackageJson) as { version?: string }).version;
				hash.update(Converter.utf8ToBytes(`${dependency}:${version}`));

				if (dependency.startsWith("@3sixty/")) {
					await IncrementalBuild.hashFiles(
						hash,
						dependencyFolder,
						["dist/types/**/*.d.ts", "dist/es/schemas/*.json"],
						[]
					);
				}
			} else {
				hash.update(Converter.utf8ToBytes(`${dependency}:missing`));
			}
		}
	}

	/**
	 * Resolve the folder a dependency is installed in.
	 * @param packageFolder The folder of the package.
	 * @param dependency The name of the dependency.
	 * @returns The real folder of the dependency, or undefined if it is not installed.
	 * @internal
	 */
	private static async resolveDependency(
		packageFolder: string,
		dependency: string
	): Promise<string | undefined> {
		try {
			return await realpath(path.join(packageFolder, "node_modules", dependency));
		} catch {
			return undefined;
		}
	}

	/**
	 * Does the file exist.
	 * @param filePath The file to check.
	 * @returns True if the file exists.
	 * @internal
	 */
	private static async fileExists(filePath: string): Promise<boolean> {
		try {
			await access(filePath);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Add the paths and contents of the matching files to the hash, in a stable order.
	 * @param hash The hash to update.
	 * @param folder The folder to find the files in.
	 * @param patterns The patterns of the files to include.
	 * @param ignore The patterns of the files to exclude.
	 * @internal
	 */
	private static async hashFiles(
		hash: Sha256,
		folder: string,
		patterns: string[],
		ignore: string[]
	): Promise<void> {
		const files = await IncrementalBuild.findFiles(folder, patterns, ignore);
		for (const file of files) {
			const content = await readFile(path.join(folder, file));
			hash.update(Converter.utf8ToBytes(file));
			hash.update(content);
		}
	}

	/**
	 * Find the matching files in a folder, including those in dot folders.
	 * @param folder The folder to find the files in.
	 * @param patterns The patterns of the files to include.
	 * @param ignore The patterns of the files to exclude.
	 * @returns The paths of the files relative to the folder, sorted.
	 * @internal
	 */
	private static async findFiles(
		folder: string,
		patterns: string[],
		ignore: string[]
	): Promise<string[]> {
		const entries = await glob(patterns, { cwd: folder, dot: true, ignore, withFileTypes: true });
		return entries
			.filter(entry => entry.isFile())
			.map(entry => entry.relativePosix())
			.sort();
	}
}
