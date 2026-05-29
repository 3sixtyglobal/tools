# Interface: IOpenApiResponses

An OpenAPI Responses Object.

## See

https://spec.openapis.org/oas/latest.html#responses-object

## Indexable

> \[`code`: `string`\]: [`IOpenApiReference`](IOpenApiReference.md) \| [`IOpenApiResponse`](IOpenApiResponse.md) \| `undefined`

Named HTTP status code or status code range responses.

### See

https://spec.openapis.org/oas/latest.html#patterned-fields-0

## Properties

### default? {#default}

> `optional` **default?**: [`IOpenApiReference`](IOpenApiReference.md) \| [`IOpenApiResponse`](IOpenApiResponse.md)

The default response for otherwise undeclared status codes.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields-13
