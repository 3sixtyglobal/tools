# Interface: IOpenApiPathMethod

An OpenAPI Operation Object.

## See

https://spec.openapis.org/oas/latest.html#operation-object

## Properties

### tags? {#tags}

> `optional` **tags?**: `string`[]

Tags for the operation.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields-7

***

### summary? {#summary}

> `optional` **summary?**: `string`

A short summary of the operation.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields-7

***

### description? {#description}

> `optional` **description?**: `string`

A verbose description of the operation.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields-7

***

### externalDocs? {#externaldocs}

> `optional` **externalDocs?**: [`IOpenApiExternalDocumentation`](IOpenApiExternalDocumentation.md)

Additional external documentation for the operation.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields-7

***

### operationId? {#operationid}

> `optional` **operationId?**: `string`

A unique identifier for the operation.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields-7

***

### parameters? {#parameters}

> `optional` **parameters?**: ([`IOpenApiReference`](IOpenApiReference.md) \| [`IOpenApiParameter`](IOpenApiParameter.md))[]

Parameters for the operation.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields-7

***

### requestBody? {#requestbody}

> `optional` **requestBody?**: [`IOpenApiReference`](IOpenApiReference.md) \| [`IOpenApiRequestBody`](IOpenApiRequestBody.md)

The request body for the operation.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields-7

***

### responses {#responses}

> **responses**: [`IOpenApiResponses`](IOpenApiResponses.md)

The responses for the operation.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields-7

***

### callbacks? {#callbacks}

> `optional` **callbacks?**: `object`

Callbacks related to the operation.

#### Index Signature

\[`id`: `string`\]: `unknown`

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields-7

***

### deprecated? {#deprecated}

> `optional` **deprecated?**: `boolean`

Whether the operation is deprecated.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields-7

***

### security? {#security}

> `optional` **security?**: [`IOpenApiSecurityRequirement`](IOpenApiSecurityRequirement.md)[]

Security requirements for the operation.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields-7

***

### servers? {#servers}

> `optional` **servers?**: [`IOpenApiServer`](IOpenApiServer.md)[]

Alternative servers for the operation.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields-7
