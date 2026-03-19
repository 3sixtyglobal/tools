# Interface: IOpenApiOAuthFlow

An OpenAPI OAuth Flow Object.

## See

https://spec.openapis.org/oas/latest.html#oauth-flow-object

## Properties

### authorizationUrl? {#authorizationurl}

> `optional` **authorizationUrl**: `string`

The authorization URL for this flow.

***

### deviceAuthorizationUrl? {#deviceauthorizationurl}

> `optional` **deviceAuthorizationUrl**: `string`

The device authorization URL for this flow.

***

### tokenUrl? {#tokenurl}

> `optional` **tokenUrl**: `string`

The token URL for this flow.

***

### refreshUrl? {#refreshurl}

> `optional` **refreshUrl**: `string`

The refresh URL for this flow.

***

### scopes {#scopes}

> **scopes**: `object`

Available scopes for this flow.

#### Index Signature

\[`name`: `string`\]: `string`
