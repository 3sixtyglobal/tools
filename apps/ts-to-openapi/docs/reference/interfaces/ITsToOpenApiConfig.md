# Interface: ITsToOpenApiConfig

Configuration for the API.

## Properties

### title {#title}

> **title**: `string`

Title of the API.

***

### version {#version}

> **version**: `string`

The version.

***

### description {#description}

> **description**: `string`

Description of the API.

***

### licenseName {#licensename}

> **licenseName**: `string`

The license to use.

***

### licenseUrl {#licenseurl}

> **licenseUrl**: `string`

The license URL.

***

### servers {#servers}

> **servers**: `string`[]

The servers for the endpoints.

***

### authMethods? {#authmethods}

> `optional` **authMethods**: `string`[]

The authentication methods.

***

### restRoutes {#restroutes}

> **restRoutes**: `object`[]

The packages containing routes.

#### package?

> `optional` **package**: `string`

The package containing the routes.

#### version?

> `optional` **version**: `string`

The version of the package to use, defaults to latest.

#### packageRoot?

> `optional` **packageRoot**: `string`

To point to a local instance of a package use this property instead of package/version.

#### entryPoints?

> `optional` **entryPoints**: [`ITsToOpenApiConfigEntryPoint`](ITsToOpenApiConfigEntryPoint.md)[]

The rest entry points to include, defaults to all exported entry points.

***

### externalReferences? {#externalreferences}

> `optional` **externalReferences**: `object`

External type references

#### Index Signature

\[`id`: `string`\]: `string`
