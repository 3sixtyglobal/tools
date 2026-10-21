# Function: actionCommandTsToJsonLdContext()

> **actionCommandTsToJsonLdContext**(`configFile`, `outputFile`, `opts`, `toolVersion?`): `Promise`\<`void`\>

Action the root command.

## Parameters

### configFile

`string`

The optional configuration file.

### outputFile

`string`

The output file for the schema.

### opts

The options for the command.

#### incremental?

`string` \| `boolean`

Skip the generation when unchanged, optionally with the cache file.

### toolVersion?

`string`

The version of the tool, a change regenerates incremental outputs.

## Returns

`Promise`\<`void`\>
