# Interface: IOpenApiRequestBody

An OpenAPI Request Body Object.

## See

https://spec.openapis.org/oas/latest.html#request-body-object

## Properties

### description? {#description}

> `optional` **description**: `string`

A brief description of the request body.

***

### content {#content}

> **content**: `object`

The content of the request body.

#### Index Signature

\[`contentType`: `string`\]: [`IOpenApiReference`](IOpenApiReference.md) \| [`IOpenApiMediaType`](IOpenApiMediaType.md)

***

### required? {#required}

> `optional` **required**: `boolean`

Whether the request body is required.
