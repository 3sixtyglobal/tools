# Interface: IOpenApiComponents

An OpenAPI Components Object.

## See

https://spec.openapis.org/oas/latest.html#components-object

## Properties

### schemas? {#schemas}

> `optional` **schemas**: `object`

Reusable schemas.

#### Index Signature

\[`name`: `string`\]: `boolean` \| [`IJsonSchema`](IJsonSchema.md)

***

### responses? {#responses}

> `optional` **responses**: `object`

Reusable responses.

#### Index Signature

\[`name`: `string`\]: [`IOpenApiReference`](IOpenApiReference.md) \| [`IOpenApiResponse`](IOpenApiResponse.md)

***

### parameters? {#parameters}

> `optional` **parameters**: `object`

Reusable parameters.

#### Index Signature

\[`name`: `string`\]: [`IOpenApiReference`](IOpenApiReference.md) \| [`IOpenApiParameter`](IOpenApiParameter.md)

***

### examples? {#examples}

> `optional` **examples**: `object`

Reusable examples.

#### Index Signature

\[`name`: `string`\]: [`IOpenApiExample`](IOpenApiExample.md) \| [`IOpenApiReference`](IOpenApiReference.md)

***

### requestBodies? {#requestbodies}

> `optional` **requestBodies**: `object`

Reusable request bodies.

#### Index Signature

\[`name`: `string`\]: [`IOpenApiReference`](IOpenApiReference.md) \| [`IOpenApiRequestBody`](IOpenApiRequestBody.md)

***

### headers? {#headers}

> `optional` **headers**: `object`

Reusable headers.

#### Index Signature

\[`name`: `string`\]: [`IOpenApiReference`](IOpenApiReference.md) \| [`IOpenApiHeader`](IOpenApiHeader.md)

***

### securitySchemes? {#securityschemes}

> `optional` **securitySchemes**: `object`

Reusable security schemes.

#### Index Signature

\[`name`: `string`\]: [`IOpenApiReference`](IOpenApiReference.md) \| [`IOpenApiSecurityScheme`](../type-aliases/IOpenApiSecurityScheme.md)

***

### pathItems? {#pathitems}

> `optional` **pathItems**: `object`

Reusable path items.

#### Index Signature

\[`name`: `string`\]: [`IOpenApiPathItem`](IOpenApiPathItem.md)

***

### mediaTypes? {#mediatypes}

> `optional` **mediaTypes**: `object`

Reusable media types.

#### Index Signature

\[`name`: `string`\]: [`IOpenApiReference`](IOpenApiReference.md) \| [`IOpenApiMediaType`](IOpenApiMediaType.md)
