# Interface: IOpenApiTag

An OpenAPI Tag Object.

## See

https://spec.openapis.org/oas/latest.html#tag-object

## Properties

### name {#name}

> **name**: `string`

The name of the tag.

***

### summary? {#summary}

> `optional` **summary?**: `string`

A short summary of the tag.

***

### description? {#description}

> `optional` **description?**: `string`

A description of the tag.

***

### externalDocs? {#externaldocs}

> `optional` **externalDocs?**: [`IOpenApiExternalDocumentation`](IOpenApiExternalDocumentation.md)

Additional external documentation for the tag.

***

### parent? {#parent}

> `optional` **parent?**: `string`

Parent tag name.

***

### kind? {#kind}

> `optional` **kind?**: `string`

A machine-readable category for the tag.
