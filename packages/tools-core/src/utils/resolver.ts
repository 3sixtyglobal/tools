// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import * as ts from "typescript";
import { FileUtils } from "./fileUtils.js";

/**
 * Resolve TypeScript type declarations from package names.
 */
export class Resolver {
	/**
	 * Cache for resolved package entry files.
	 * @internal
	 */
	private static readonly _resolvedModuleFileCache: { [id: string]: string | null | undefined } =
		{};

	/**
	 * Cache for parsed source files.
	 * @internal
	 */
	private static readonly _sourceFileCache: { [id: string]: ts.SourceFile | null | undefined } = {};

	/**
	 * Cache for resolved type declarations.
	 * @internal
	 */
	private static readonly _typeDeclarationCache: {
		[id: string]:
			| {
					sourceFile: ts.SourceFile;
					declaration: ts.InterfaceDeclaration | ts.TypeAliasDeclaration;
			  }
			| null
			| undefined;
	} = {};

	/**
	 * Resolve a type declaration AST from a package and type name.
	 * @param packageName The package to inspect.
	 * @param typeName The type to resolve.
	 * @param containingFilePath An optional source file path to use as the starting point for
	 * package resolution. When provided, TypeScript module resolution walks up from that file's
	 * directory, which allows transitive dependencies installed alongside the source file (e.g.
	 * in a sub-directory node_modules) to be found even when they are not reachable from the
	 * current working directory. The path is normalised to absolute before use;
	 * falls back to process.cwd() when omitted.
	 * @returns The resolved declaration AST.
	 */
	public static resolveTypeDeclarationAst(
		packageName: string,
		typeName: string,
		containingFilePath?: string
	):
		| {
				sourceFile: ts.SourceFile;
				declaration: ts.InterfaceDeclaration | ts.TypeAliasDeclaration;
		  }
		| undefined {
		// path.resolve normalises both absolute and relative paths to an absolute form so that
		// TypeScript module resolution can correctly walk up the directory tree to node_modules.
		const containingFile = containingFilePath
			? FileUtils.normalizeFilePath(FileUtils.resolvePath(containingFilePath))
			: `${FileUtils.normalizeFilePath(FileUtils.getCurrentWorkingDirectory())}/__typeScriptToSchema__.ts`;
		const resolveDir = FileUtils.getDirectoryPath(containingFile);
		const cacheKey = `${resolveDir}::${packageName}::${typeName}`;
		const moduleCacheKey = `${resolveDir}::${packageName}`;

		const cachedDeclaration = Resolver._typeDeclarationCache[cacheKey];
		if (cachedDeclaration !== undefined) {
			return cachedDeclaration ?? undefined;
		}

		const compilerOptions = Resolver.getModuleResolutionCompilerOptions();
		const resolvedModuleFileName = Resolver.resolvePackageEntryFile(
			packageName,
			containingFile,
			compilerOptions,
			moduleCacheKey
		);

		if (!resolvedModuleFileName) {
			Resolver._typeDeclarationCache[cacheKey] = null;
			return undefined;
		}

		const declarationResult = Resolver.findTypeDeclarationInModuleGraph(
			resolvedModuleFileName,
			typeName,
			new Set<string>(),
			compilerOptions
		);

		Resolver._typeDeclarationCache[cacheKey] = declarationResult ?? null;
		return declarationResult;
	}

	/**
	 * Resolve and cache the package entry file for a module name.
	 * @param packageName The package to resolve.
	 * @param containingFile The containing file for module resolution.
	 * @param compilerOptions Compiler options for module resolution.
	 * @param cacheKey The cache key to use for the resolved module file cache.
	 * @returns The resolved entry file path.
	 * @internal
	 */
	private static resolvePackageEntryFile(
		packageName: string,
		containingFile: string,
		compilerOptions: ts.CompilerOptions,
		cacheKey: string
	): string | undefined {
		const cachedResolvedModuleFile = Resolver._resolvedModuleFileCache[cacheKey];
		if (cachedResolvedModuleFile !== undefined) {
			return cachedResolvedModuleFile ?? undefined;
		}

		const resolvedModule = ts.resolveModuleName(
			packageName,
			containingFile,
			compilerOptions,
			ts.sys
		).resolvedModule;
		const resolvedModuleFileName = resolvedModule?.resolvedFileName;
		if (!resolvedModuleFileName) {
			Resolver._resolvedModuleFileCache[cacheKey] = null;
			return undefined;
		}

		Resolver._resolvedModuleFileCache[cacheKey] = resolvedModuleFileName;
		return resolvedModuleFileName;
	}

	/**
	 * Resolve compiler options for module lookup.
	 * @returns The compiler options.
	 * @internal
	 */
	private static getModuleResolutionCompilerOptions(): ts.CompilerOptions {
		return {
			module: ts.ModuleKind.NodeNext,
			moduleResolution: ts.ModuleResolutionKind.NodeNext,
			target: ts.ScriptTarget.ESNext,
			skipLibCheck: true
		};
	}

	/**
	 * Find a type declaration by walking a module import/export graph.
	 * @param sourceFilePath The source file path to inspect.
	 * @param typeName The type name to find.
	 * @param visitedFiles The visited file set.
	 * @param compilerOptions Compiler options for module resolution.
	 * @returns The matched declaration with its source file.
	 * @internal
	 */
	private static findTypeDeclarationInModuleGraph(
		sourceFilePath: string,
		typeName: string,
		visitedFiles: Set<string>,
		compilerOptions: ts.CompilerOptions
	):
		| {
				sourceFile: ts.SourceFile;
				declaration: ts.InterfaceDeclaration | ts.TypeAliasDeclaration;
		  }
		| undefined {
		const absoluteSourcePath = FileUtils.normalizeFilePath(sourceFilePath);
		if (visitedFiles.has(absoluteSourcePath)) {
			return undefined;
		}
		visitedFiles.add(absoluteSourcePath);

		const sourceFile = Resolver.getOrCreateSourceFile(sourceFilePath);
		if (!sourceFile) {
			return undefined;
		}

		for (const statement of sourceFile.statements) {
			// interface IFoo { ... }  or  type Foo = ...  (the declaration we are searching for)
			if (
				(ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) &&
				statement.name.text === typeName
			) {
				return {
					sourceFile,
					declaration: statement
				};
			}
		}

		const moduleSpecifiers = sourceFile.statements
			// import { ... } from "..."  or  export { ... } from "..."  (re-export and import chains)
			.filter(statement => ts.isExportDeclaration(statement) || ts.isImportDeclaration(statement))
			.flatMap(statement => {
				const moduleSpecifier = statement.moduleSpecifier;
				// "./module.js"  (string literal module specifier)
				return moduleSpecifier && ts.isStringLiteral(moduleSpecifier) ? [moduleSpecifier.text] : [];
			});

		for (const moduleSpecifier of moduleSpecifiers) {
			const resolvedImportPath = Resolver.resolveModuleSpecifierFromFile(
				moduleSpecifier,
				sourceFilePath,
				compilerOptions
			);
			if (resolvedImportPath) {
				const declarationResult = Resolver.findTypeDeclarationInModuleGraph(
					resolvedImportPath,
					typeName,
					visitedFiles,
					compilerOptions
				);
				if (declarationResult) {
					return declarationResult;
				}
			}
		}

		return undefined;
	}

	/**
	 * Read and cache a parsed source file.
	 * @param sourceFilePath The source file path.
	 * @returns The parsed source file.
	 * @internal
	 */
	private static getOrCreateSourceFile(sourceFilePath: string): ts.SourceFile | undefined {
		const normalizedPath = FileUtils.normalizeFilePath(sourceFilePath);
		const cachedSourceFile = Resolver._sourceFileCache[normalizedPath];
		if (cachedSourceFile !== undefined) {
			return cachedSourceFile ?? undefined;
		}

		const source = FileUtils.readFile(sourceFilePath);
		if (!source) {
			Resolver._sourceFileCache[normalizedPath] = null;
			return undefined;
		}

		const sourceFile = ts.createSourceFile(sourceFilePath, source, ts.ScriptTarget.Latest, true);
		Resolver._sourceFileCache[normalizedPath] = sourceFile;
		return sourceFile;
	}

	/**
	 * Resolve a module specifier from a containing file.
	 * @param moduleSpecifier The module specifier text.
	 * @param containingFilePath The file containing the import/export.
	 * @param compilerOptions Compiler options for module resolution.
	 * @returns The resolved file path.
	 * @internal
	 */
	private static resolveModuleSpecifierFromFile(
		moduleSpecifier: string,
		containingFilePath: string,
		compilerOptions: ts.CompilerOptions
	): string | undefined {
		return ts.resolveModuleName(moduleSpecifier, containingFilePath, compilerOptions, ts.sys)
			.resolvedModule?.resolvedFileName;
	}
}
