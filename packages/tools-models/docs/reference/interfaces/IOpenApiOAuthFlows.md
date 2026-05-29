# Interface: IOpenApiOAuthFlows

An OpenAPI OAuth Flows Object.

## See

https://spec.openapis.org/oas/latest.html#oauth-flows-object

## Properties

### implicit? {#implicit}

> `optional` **implicit?**: [`IOpenApiOAuthFlow`](IOpenApiOAuthFlow.md)

Configuration for the implicit flow.

***

### password? {#password}

> `optional` **password?**: [`IOpenApiOAuthFlow`](IOpenApiOAuthFlow.md)

Configuration for the resource owner password flow.

***

### clientCredentials? {#clientcredentials}

> `optional` **clientCredentials?**: [`IOpenApiOAuthFlow`](IOpenApiOAuthFlow.md)

Configuration for the client credentials flow.

***

### authorizationCode? {#authorizationcode}

> `optional` **authorizationCode?**: [`IOpenApiOAuthFlow`](IOpenApiOAuthFlow.md)

Configuration for the authorization code flow.

***

### deviceAuthorization? {#deviceauthorization}

> `optional` **deviceAuthorization?**: [`IOpenApiOAuthFlow`](IOpenApiOAuthFlow.md)

Configuration for the device authorization flow.
