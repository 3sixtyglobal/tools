# Interface: IOpenApiHeader

An OpenAPI Header Object.

## See

https://spec.openapis.org/oas/latest.html#header-object

## Properties

### description? {#description}

> `optional` **description?**: `string`

The description of the header.

***

### required? {#required}

> `optional` **required?**: `boolean`

Whether the header is required.

***

### deprecated? {#deprecated}

> `optional` **deprecated?**: `boolean`

Whether the header is deprecated.

***

### example? {#example}

> `optional` **example?**: `unknown`

A shorthand example for the header.

***

### examples? {#examples}

> `optional` **examples?**: `object`

Named examples for the header.

#### Index Signature

\[`id`: `string`\]: [`IOpenApiExample`](IOpenApiExample.md) \| [`IOpenApiReference`](IOpenApiReference.md)

***

### style? {#style}

> `optional` **style?**: `"simple"`

The serialization style for the header.

***

### explode? {#explode}

> `optional` **explode?**: `boolean`

Whether exploded serialization is used.

***

### schema? {#schema}

> `optional` **schema?**: [`IJsonSchema`](IJsonSchema.md)

The schema of the header.

***

### content? {#content}

> `optional` **content?**: `object`

The content definition for the header.

#### Index Signature

\[`contentType`: `string`\]: [`IOpenApiReference`](IOpenApiReference.md) \| [`IOpenApiMediaType`](IOpenApiMediaType.md)
