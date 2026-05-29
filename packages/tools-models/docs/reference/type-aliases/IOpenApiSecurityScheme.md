# Type Alias: IOpenApiSecurityScheme

> **IOpenApiSecurityScheme** = \{ `type`: `"apiKey"`; `description?`: `string`; `name`: `string`; `in`: `"query"` \| `"header"` \| `"cookie"`; `deprecated?`: `boolean`; \} \| \{ `type`: `"http"`; `description?`: `string`; `scheme`: `string`; `bearerFormat?`: `string`; `deprecated?`: `boolean`; \} \| \{ `type`: `"mutualTLS"`; `description?`: `string`; `deprecated?`: `boolean`; \} \| \{ `type`: `"oauth2"`; `description?`: `string`; `flows`: [`IOpenApiOAuthFlows`](../interfaces/IOpenApiOAuthFlows.md); `oauth2MetadataUrl?`: `string`; `deprecated?`: `boolean`; \} \| \{ `type`: `"openIdConnect"`; `description?`: `string`; `openIdConnectUrl`: `string`; `deprecated?`: `boolean`; \}

An OpenAPI Security Scheme Object.

## See

https://spec.openapis.org/oas/latest.html#security-scheme-object
