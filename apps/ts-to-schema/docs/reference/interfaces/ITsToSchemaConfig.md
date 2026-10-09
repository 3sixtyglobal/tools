# Interface: ITsToSchemaConfig

Configuration for the tool.

## Properties

### baseUrl {#baseurl}

> **baseUrl**: `string`

The base url for the type references e.g. https://schema.3sixty.global/my-namespace/.

***

### types {#types}

> **types**: `string`[]

The source files to generate the types from.

***

### externalReferences? {#externalreferences}

> `optional` **externalReferences?**: `object`

External type references.

#### Index Signature

\[`id`: `string`\]: `string`

***

### suppressPackageWarnings? {#suppresspackagewarnings}

> `optional` **suppressPackageWarnings?**: `string`[]

Package names where diagnostics should be suppressed, e.g. jose.
