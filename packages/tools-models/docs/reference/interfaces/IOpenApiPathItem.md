# Interface: IOpenApiPathItem

An OpenAPI Path Item Object.

## See

https://spec.openapis.org/oas/latest.html#path-item-object

## Properties

### $ref? {#ref}

> `optional` **$ref?**: `string`

A referenced definition of this path item.

***

### summary? {#summary}

> `optional` **summary?**: `string`

A summary applying to all operations in the path.

***

### description? {#description}

> `optional` **description?**: `string`

A description applying to all operations in the path.

***

### get? {#get}

> `optional` **get?**: [`IOpenApiPathMethod`](IOpenApiPathMethod.md)

A GET operation on the path.

***

### put? {#put}

> `optional` **put?**: [`IOpenApiPathMethod`](IOpenApiPathMethod.md)

A PUT operation on the path.

***

### post? {#post}

> `optional` **post?**: [`IOpenApiPathMethod`](IOpenApiPathMethod.md)

A POST operation on the path.

***

### delete? {#delete}

> `optional` **delete?**: [`IOpenApiPathMethod`](IOpenApiPathMethod.md)

A DELETE operation on the path.

***

### options? {#options}

> `optional` **options?**: [`IOpenApiPathMethod`](IOpenApiPathMethod.md)

An OPTIONS operation on the path.

***

### head? {#head}

> `optional` **head?**: [`IOpenApiPathMethod`](IOpenApiPathMethod.md)

A HEAD operation on the path.

***

### patch? {#patch}

> `optional` **patch?**: [`IOpenApiPathMethod`](IOpenApiPathMethod.md)

A PATCH operation on the path.

***

### trace? {#trace}

> `optional` **trace?**: [`IOpenApiPathMethod`](IOpenApiPathMethod.md)

A TRACE operation on the path.

***

### query? {#query}

> `optional` **query?**: [`IOpenApiPathMethod`](IOpenApiPathMethod.md)

A QUERY operation on the path.

***

### additionalOperations? {#additionaloperations}

> `optional` **additionalOperations?**: `object`

Additional non-standard HTTP operations keyed by method name.

#### Index Signature

\[`method`: `string`\]: [`IOpenApiPathMethod`](IOpenApiPathMethod.md)

***

### servers? {#servers}

> `optional` **servers?**: [`IOpenApiServer`](IOpenApiServer.md)[]

Alternative servers for this path.

***

### parameters? {#parameters}

> `optional` **parameters?**: ([`IOpenApiReference`](IOpenApiReference.md) \| [`IOpenApiParameter`](IOpenApiParameter.md))[]

Shared parameters for all operations on this path.
