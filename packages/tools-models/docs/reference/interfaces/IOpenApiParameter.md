# Interface: IOpenApiParameter

An OpenAPI Parameter Object.

## See

https://spec.openapis.org/oas/latest.html#parameter-object

## Properties

### name {#name}

> **name**: `string`

The name of the parameter.

***

### in {#in}

> **in**: [`OpenApiParameterLocation`](../type-aliases/OpenApiParameterLocation.md)

The location of the parameter.

***

### description? {#description}

> `optional` **description**: `string`

A brief description of the parameter.

***

### required? {#required}

> `optional` **required**: `boolean`

Whether the parameter is required.

***

### deprecated? {#deprecated}

> `optional` **deprecated**: `boolean`

Whether the parameter is deprecated.

***

### allowEmptyValue? {#allowemptyvalue}

> `optional` **allowEmptyValue**: `boolean`

Whether empty values are allowed for query parameters.

***

### example? {#example}

> `optional` **example**: `unknown`

A shorthand example for the parameter.

***

### examples? {#examples}

> `optional` **examples**: `object`

Named examples for the parameter.

#### Index Signature

\[`id`: `string`\]: [`IOpenApiExample`](IOpenApiExample.md) \| [`IOpenApiReference`](IOpenApiReference.md)

***

### style? {#style}

> `optional` **style**: [`OpenApiParameterStyle`](../type-aliases/OpenApiParameterStyle.md)

The serialization style for the parameter.

***

### explode? {#explode}

> `optional` **explode**: `boolean`

Whether exploded serialization is used.

***

### allowReserved? {#allowreserved}

> `optional` **allowReserved**: `boolean`

Whether reserved characters may pass through unchanged.

***

### schema? {#schema}

> `optional` **schema**: [`IJsonSchema`](IJsonSchema.md)

The schema describing the parameter.

***

### content? {#content}

> `optional` **content**: `object`

Content-based parameter serialization.

#### Index Signature

\[`contentType`: `string`\]: [`IOpenApiReference`](IOpenApiReference.md) \| [`IOpenApiMediaType`](IOpenApiMediaType.md)
