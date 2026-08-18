# Class: TypeScriptToSchema

Class for converting TypeScript types to JSON Schema.

## Constructors

### Constructor

> **new TypeScriptToSchema**(): `TypeScriptToSchema`

#### Returns

`TypeScriptToSchema`

## Methods

### generateSchema() {#generateschema}

> **generateSchema**(`namespace`, `packageName`, `schemas`, `sourceFileOrTypeName`, `options?`, `embeddedSchemaModes?`): `Promise`\<\{\[`id`: `string`\]: `IJsonSchema`; \}\>

Generates a JSON schema from a TypeScript source file or type name.

#### Parameters

##### namespace

`string`

The schema namespace.

##### packageName

`string`

The package name.

##### schemas

The package schema map.

##### sourceFileOrTypeName

`string`

The source file to process or type name to resolve.

##### options?

[`ITypeScriptToSchemaOptions`](../interfaces/ITypeScriptToSchemaOptions.md)

Additional generation options.

##### embeddedSchemaModes?

Shared map of schema ids to embedded modes; pass the same object
across multiple calls so that annotations discovered in one call are visible in later calls.

#### Returns

`Promise`\<\{\[`id`: `string`\]: `IJsonSchema`; \}\>

The generated JSON schemas indexed by title.

***

### isDiagnosticFromPackage() {#isdiagnosticfrompackage}

> **isDiagnosticFromPackage**(`path`, `fileName`, `packageName`): `boolean`

Determine if a diagnostic originates from a specific package.

#### Parameters

##### path

`string`

The schema or source path associated with the diagnostic.

##### fileName

`string` \| `undefined`

The source filename associated with the diagnostic.

##### packageName

`string`

The package name to check, e.g. jose.

#### Returns

`boolean`

True if the diagnostic originated from the package.
