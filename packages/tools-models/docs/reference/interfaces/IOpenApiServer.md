# Interface: IOpenApiServer

An OpenAPI Server Object.

## See

https://spec.openapis.org/oas/latest.html#server-object

## Properties

### url {#url}

> **url**: `string`

The target URL.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields-3

***

### description? {#description}

> `optional` **description**: `string`

A description of the server.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields-3

***

### name? {#name}

> `optional` **name**: `string`

A unique server name.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields-3

***

### variables? {#variables}

> `optional` **variables**: `object`

URL template variables.

#### Index Signature

\[`name`: `string`\]: [`IOpenApiServerVariable`](IOpenApiServerVariable.md)

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields-3
