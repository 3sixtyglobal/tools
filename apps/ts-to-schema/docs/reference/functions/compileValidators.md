# Function: compileValidators()

> **compileValidators**(`config`, `schemas`, `compiledFolder`, `packageFolder`): `Promise`\<`void`\>

Compile the generated schemas into a module exporting a validator per schema, named by the
schema title with the compiled prefix, as TypeScript so the package compiles it. Refs in the namespaces of
the external references use the compiled validator exported by the dependency of the package
which ships the schema, otherwise the external schema is compiled into the module.

## Parameters

### config

[`ITsToSchemaConfig`](../interfaces/ITsToSchemaConfig.md)

The configuration for the app.

### schemas

`IJsonSchema`[]

The generated schemas to compile.

### compiledFolder

`string`

The folder to write the compiled module to.

### packageFolder

`string`

The folder of the package, used to find its dependencies.

## Returns

`Promise`\<`void`\>
