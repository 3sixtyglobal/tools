# Interface: IOpenApiResponse

An OpenAPI Response Object.

## See

https://spec.openapis.org/oas/latest.html#response-object

## Properties

### summary? {#summary}

> `optional` **summary?**: `string`

A short summary of the meaning of the response.

***

### description {#description}

> **description**: `string`

A description of the response.

***

### headers? {#headers}

> `optional` **headers?**: `object`

The headers for the response.

#### Index Signature

\[`id`: `string`\]: [`IOpenApiReference`](IOpenApiReference.md) \| [`IOpenApiHeader`](IOpenApiHeader.md)

***

### content? {#content}

> `optional` **content?**: `object`

The content for the response.

#### Index Signature

\[`contentType`: `string`\]: [`IOpenApiReference`](IOpenApiReference.md) \| [`IOpenApiMediaType`](IOpenApiMediaType.md)

***

### links? {#links}

> `optional` **links?**: `object`

Design-time links from this response.

#### Index Signature

\[`id`: `string`\]: `unknown`
