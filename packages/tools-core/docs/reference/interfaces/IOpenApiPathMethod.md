# Interface: IOpenApiPathMethod

The Open API config definition.

## Properties

### operationId {#operationid}

> **operationId**: `string`

The operation id.

***

### summary {#summary}

> **summary**: `string`

Summary.

***

### tags? {#tags}

> `optional` **tags**: `string`[]

Tags.

***

### parameters? {#parameters}

> `optional` **parameters**: `object`[]

Parameters.

#### name

> **name**: `string`

#### in

> **in**: `string`

#### description?

> `optional` **description**: `string`

#### required

> **required**: `boolean`

#### schema

> **schema**: `object`

##### schema.type?

> `optional` **type**: `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"integer"` \| `"null"` \| `"array"` \| (`"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"integer"` \| `"null"` \| `"array"`)[]

##### schema.enum?

> `optional` **enum**: `AnySchemaObject`[]

##### schema.$ref?

> `optional` **$ref**: `string`

#### style?

> `optional` **style**: `string`

***

### requestBody? {#requestbody}

> `optional` **requestBody**: `object`

Request body.

#### required

> **required**: `boolean`

#### description?

> `optional` **description**: `string`

#### content?

> `optional` **content**: `object`

##### Index Signature

\[`contentType`: `string`\]: `object`

***

### responses? {#responses}

> `optional` **responses**: `object`

Response body.

#### Index Signature

\[`code`: `string`\]: [`IOpenApiResponse`](IOpenApiResponse.md)

***

### security? {#security}

> `optional` **security**: `object`[]

Security model for the API.

#### Index Signature

\[`name`: `string`\]: `string`[]
