# Interface: ITypeScriptToSchemaOptions

Options for TypeScript to JSON schema generation.

## Properties

### externalReferences? {#externalreferences}

> `optional` **externalReferences?**: `object`

Mapping of package ids, type ids, wildcard patterns, or regex patterns to schema id prefixes
or replacement templates for referenced schemas.

#### Index Signature

\[`id`: `string`\]: `string`

***

### onDiagnostic? {#ondiagnostic}

> `optional` **onDiagnostic?**: (`diagnostic`) => `void`

Optional diagnostic callback for non-fatal generation issues.

#### Parameters

##### diagnostic

[`ITypeScriptToSchemaDiagnostics`](ITypeScriptToSchemaDiagnostics.md)

The diagnostic details for the generation issue.

#### Returns

`void`

***

### suppressPackageWarnings? {#suppresspackagewarnings}

> `optional` **suppressPackageWarnings?**: `string`[]

Package names where diagnostics should be suppressed, e.g. jose.
