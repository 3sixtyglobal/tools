# Function: tsToSchema()

> **tsToSchema**(`config`, `outputFolder`, `workingDirectory`): `Promise`\<`IJsonSchema`[]\>

Convert the TypeScript definitions to JSON Schemas.

## Parameters

### config

[`ITsToSchemaConfig`](../interfaces/ITsToSchemaConfig.md)

The configuration for the app.

### outputFolder

`string`

The location of the folder to output the JSON schemas.

### workingDirectory

`string`

The folder the app was run from.

## Returns

`Promise`\<`IJsonSchema`[]\>

The schemas written.
