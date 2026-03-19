# Interface: IOpenApiMediaType

An OpenAPI Media Type Object.

## See

https://spec.openapis.org/oas/latest.html#media-type-object

## Properties

### schema? {#schema}

> `optional` **schema**: [`IJsonSchema`](IJsonSchema.md)

A schema describing the complete content.

***

### itemSchema? {#itemschema}

> `optional` **itemSchema**: [`IJsonSchema`](IJsonSchema.md)

A schema describing each item within a sequential media type.

***

### example? {#example}

> `optional` **example**: `unknown`

A single shorthand example.

***

### examples? {#examples}

> `optional` **examples**: `object`

Named examples for the media type.

#### Index Signature

\[`id`: `string`\]: [`IOpenApiExample`](IOpenApiExample.md) \| [`IOpenApiReference`](IOpenApiReference.md)

***

### encoding? {#encoding}

> `optional` **encoding**: `object`

Encoding metadata keyed by property name.

#### Index Signature

\[`id`: `string`\]: `unknown`

***

### prefixEncoding? {#prefixencoding}

> `optional` **prefixEncoding**: `unknown`[]

Positional encoding metadata for multipart payloads.

***

### itemEncoding? {#itemencoding}

> `optional` **itemEncoding**: `unknown`

Repeating item encoding metadata for multipart payloads.
