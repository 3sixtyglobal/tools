# Class: ImportTypeQuerySchemaResolver

Static helpers for import type and type query schema resolution.

## Constructors

### Constructor

> **new ImportTypeQuerySchemaResolver**(): `ImportTypeQuerySchemaResolver`

#### Returns

`ImportTypeQuerySchemaResolver`

## Methods

### mapImportTypeNodeToSchema() {#mapimporttypenodetoschema}

> `static` **mapImportTypeNodeToSchema**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map import type nodes (e.g. import("pkg").Type) to schema references.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

##### typeNode

`ImportTypeNode`

#### Returns

`IJsonSchema` \| `undefined`

***

### mapTypeQueryNodeToSchema() {#maptypequerynodetoschema}

> `static` **mapTypeQueryNodeToSchema**(`context`, `typeNode`): `IJsonSchema`

Map a type query node (typeof expr) to schema by resolving the referenced variable.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

##### typeNode

`TypeQueryNode`

#### Returns

`IJsonSchema`

***

### resolveImportTypeReferenceSchemaId() {#resolveimporttypereferenceschemaid}

> `static` **resolveImportTypeReferenceSchemaId**(`context`, `moduleSpecifier`, `typeName`, `title`): `string` \| `undefined`

Resolve import-type references to local or external schema ids.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

##### moduleSpecifier

`string`

##### typeName

`string`

##### title

`string`

#### Returns

`string` \| `undefined`
