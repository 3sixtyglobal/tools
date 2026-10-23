# Function: tsToOpenApi()

> **tsToOpenApi**(`config`, `outputFile`, `workingDirectory`, `packageVersion?`): `Promise`\<`void`\>

Convert the TypeScript definitions to OpenAPI spec.

## Parameters

### config

[`ITsToOpenApiConfig`](../interfaces/ITsToOpenApiConfig.md)

The configuration for the app.

### outputFile

`string`

The location of the file to output the OpenAPI spec.

### workingDirectory

`string`

The folder the app was run from.

### packageVersion?

`string`

The npm version or tag for packages without one, defaults to latest.

## Returns

`Promise`\<`void`\>
