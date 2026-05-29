# Interface: ITsToJsonLdContextConfig

Configuration for the tool.

## Properties

### prefix {#prefix}

> **prefix**: `string`

The prefix to use for the context e.g. twin-common.

***

### contextUrl {#contexturl}

> **contextUrl**: `string`

The base URL for the context e.g. https://schema.twindev.org/common/

***

### additionalContextUrls? {#additionalcontexturls}

> `optional` **additionalContextUrls?**: `object`

Additional context URLs to include in the context.

#### Index Signature

\[`id`: `string`\]: `string`

***

### fixedMappings? {#fixedmappings}

> `optional` **fixedMappings?**: `object`

Fixed mappings to include in the context.

#### Index Signature

\[`id`: `string`\]: `string`

***

### types {#types}

> **types**: `string`[]

The source files to generate the types from.

***

### includeProtected? {#includeprotected}

> `optional` **includeProtected?**: `boolean`

Whether to include protected properties in the generated context.

#### Default

```ts
false
```
