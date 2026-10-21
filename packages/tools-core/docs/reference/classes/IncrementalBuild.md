# Class: IncrementalBuild

Helpers for tools which skip generating their outputs when nothing has changed since the last
run, recorded in a cache file with the hash of the inputs and of each output.

## Constructors

### Constructor

> **new IncrementalBuild**(): `IncrementalBuild`

#### Returns

`IncrementalBuild`

## Methods

### hashInputs() {#hashinputs}

> `static` **hashInputs**(`inputs`): `Promise`\<`string`\>

Hash the inputs which determine the outputs of a tool: the values, the files, the source files
of the types and the dependencies of the package, which include the tool.

#### Parameters

##### inputs

[`IIncrementalInputs`](../interfaces/IIncrementalInputs.md)

The inputs to hash.

#### Returns

`Promise`\<`string`\>

The hash of the inputs.

***

### isUpToDate() {#isuptodate}

> `static` **isUpToDate**(`cacheFile`, `inputs`, `packageFolder`, `outputs`, `toolVersion?`): `Promise`\<`boolean`\>

Is the last run recorded in the cache still up to date, the tool version and inputs have to
match and the outputs must be exactly the files it wrote.

#### Parameters

##### cacheFile

`string`

The cache file.

##### inputs

`string`

The hash of the current inputs.

##### packageFolder

`string`

The folder of the package.

##### outputs

`string`[]

Patterns relative to the package for the outputs of the tool.

##### toolVersion?

`string`

The version of the tool.

#### Returns

`Promise`\<`boolean`\>

True if the outputs are up to date.

***

### writeCache() {#writecache}

> `static` **writeCache**(`cacheFile`, `inputs`, `packageFolder`, `outputs`, `toolVersion?`): `Promise`\<`void`\>

Record the inputs and outputs of a successful run in the cache.

#### Parameters

##### cacheFile

`string`

The cache file.

##### inputs

`string`

The hash of the inputs.

##### packageFolder

`string`

The folder of the package.

##### outputs

`string`[]

Patterns relative to the package for the outputs of the tool.

##### toolVersion?

`string`

The version of the tool.

#### Returns

`Promise`\<`void`\>

***

### findPackageFolder() {#findpackagefolder}

> `static` **findPackageFolder**(`filePath`): `Promise`\<`string`\>

Find the folder of the package which contains a file.

#### Parameters

##### filePath

`string`

The file to start from.

#### Returns

`Promise`\<`string`\>

The nearest folder above the file containing a package.json.

***

### relativePath() {#relativepath}

> `static` **relativePath**(`packageFolder`, `filePath`): `string`

Get the path relative to the package, with forward slashes.

#### Parameters

##### packageFolder

`string`

The folder of the package.

##### filePath

`string`

The path to make relative.

#### Returns

`string`

The relative path.
