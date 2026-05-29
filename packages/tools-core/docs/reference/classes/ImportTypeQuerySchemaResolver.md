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

The generation context.

##### typeNode

`ImportTypeNode`

The import type node.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapTypeQueryNodeToSchema() {#maptypequerynodetoschema}

> `static` **mapTypeQueryNodeToSchema**(`context`, `typeNode`): `IJsonSchema`

Map a type query node (typeof expr) to schema by resolving the referenced variable.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeQueryNode`

The type query node.

#### Returns

`IJsonSchema`

The mapped schema.

***

### resolveImportTypeReferenceSchemaId() {#resolveimporttypereferenceschemaid}

> `static` **resolveImportTypeReferenceSchemaId**(`context`, `moduleSpecifier`, `typeName`, `title`): `string` \| `undefined`

Resolve import-type references to local or external schema ids.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### moduleSpecifier

`string`

The import module specifier.

##### typeName

`string`

The imported type name.

##### title

`string`

The stripped schema title.

#### Returns

`string` \| `undefined`

The resolved schema id.
