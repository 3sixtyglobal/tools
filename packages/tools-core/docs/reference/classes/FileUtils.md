# Class: FileUtils

Utility helpers for TypeScript file and directory paths.

## Constructors

### Constructor

> **new FileUtils**(): `FileUtils`

#### Returns

`FileUtils`

## Methods

### normalizeFilePath() {#normalizefilepath}

> `static` **normalizeFilePath**(`filePath`): `string`

Normalize path separators for consistent comparisons.

#### Parameters

##### filePath

`string`

The file path.

#### Returns

`string`

The normalized file path.

***

### getDirectoryPath() {#getdirectorypath}

> `static` **getDirectoryPath**(`filePath`): `string`

Get the directory portion of a file path.

#### Parameters

##### filePath

`string`

The file path.

#### Returns

`string`

The directory path.

***

### resolveRelativePath() {#resolverelativepath}

> `static` **resolveRelativePath**(`baseDirectory`, `relativePath`): `string`

Resolve a relative path against a base directory.

#### Parameters

##### baseDirectory

`string`

The base directory.

##### relativePath

`string`

The relative path.

#### Returns

`string`

The resolved path.

***

### resolveImportSourceFilePath() {#resolveimportsourcefilepath}

> `static` **resolveImportSourceFilePath**(`sourceFilePath`, `importPath`): `string` \| `undefined`

Resolve a local import specifier to a TypeScript source file path.

#### Parameters

##### sourceFilePath

`string`

The importing source file path.

##### importPath

`string`

The import specifier.

#### Returns

`string` \| `undefined`

The resolved source file path.

***

### isGlobPattern() {#isglobpattern}

> `static` **isGlobPattern**(`sourceFileOrGlob`): `boolean`

Determine if the provided path includes glob pattern tokens.

#### Parameters

##### sourceFileOrGlob

`string`

The direct source file path or glob pattern.

#### Returns

`boolean`

True if the value is a glob pattern.

***

### resolveSourceFiles() {#resolvesourcefiles}

> `static` **resolveSourceFiles**(`sourceFileOrGlob`): `string`[]

Resolve source files from a direct path or a glob pattern.

#### Parameters

##### sourceFileOrGlob

`string`

The direct source file path or glob pattern.

#### Returns

`string`[]

The resolved source file paths.
