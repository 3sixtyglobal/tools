# Function: actionCommandTsToSchema()

> **actionCommandTsToSchema**(`configFile`, `outputFolder`, `compiledFolder`, `opts`): `Promise`\<`void`\>

Action the root command.

## Parameters

### configFile

`string`

The optional configuration file.

### outputFolder

`string`

The output folder for the schemas.

### compiledFolder

`string` \| `undefined`

The optional output folder for the compiled validators of the schemas.

### opts

The options for the command.

#### incremental?

`string` \| `boolean`

Skip the generation when unchanged, optionally with the cache file.

## Returns

`Promise`\<`void`\>
