# Interface: IOpenApi

The OpenAPI document definition.

## See

https://spec.openapis.org/oas/latest.html#openapi-object

## Properties

### openapi {#openapi}

> **openapi**: `string`

The OpenAPI specification version.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields

***

### $self? {#self}

> `optional` **$self**: `string`

The self-assigned URI of the document.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields

***

### info {#info}

> **info**: [`IOpenApiInfo`](IOpenApiInfo.md)

The metadata for the API.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields

***

### jsonSchemaDialect? {#jsonschemadialect}

> `optional` **jsonSchemaDialect**: `string`

The default JSON Schema dialect URI.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields

***

### servers? {#servers}

> `optional` **servers**: [`IOpenApiServer`](IOpenApiServer.md)[]

Connectivity information for target servers.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields

***

### paths? {#paths}

> `optional` **paths**: `object`

Available paths and operations.

#### Index Signature

\[`path`: `string`\]: [`IOpenApiPathItem`](IOpenApiPathItem.md)

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields

***

### webhooks? {#webhooks}

> `optional` **webhooks**: `object`

Incoming webhooks keyed by name.

#### Index Signature

\[`name`: `string`\]: [`IOpenApiPathItem`](IOpenApiPathItem.md)

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields

***

### components? {#components}

> `optional` **components**: [`IOpenApiComponents`](IOpenApiComponents.md)

Reusable components.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields

***

### security? {#security}

> `optional` **security**: [`IOpenApiSecurityRequirement`](IOpenApiSecurityRequirement.md)[]

API-wide security requirements.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields

***

### tags? {#tags}

> `optional` **tags**: [`IOpenApiTag`](IOpenApiTag.md)[]

Tags used by the API description.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields

***

### externalDocs? {#externaldocs}

> `optional` **externalDocs**: [`IOpenApiExternalDocumentation`](IOpenApiExternalDocumentation.md)

Additional external documentation.

#### See

https://spec.openapis.org/oas/latest.html#fixed-fields
