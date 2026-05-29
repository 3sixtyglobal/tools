# Class: IntersectionSchemaMerger

Merges compatible object intersections into a single JSON schema object.

## Constructors

### Constructor

> **new IntersectionSchemaMerger**(): `IntersectionSchemaMerger`

#### Returns

`IntersectionSchemaMerger`

## Methods

### mergeIntersectionObjectSchemas() {#mergeintersectionobjectschemas}

> `static` **mergeIntersectionObjectSchemas**(`context`, `schemas`, `toInlineUtilityObjectSchema`): `IJsonSchema` \| `undefined`

Merge simple object intersection parts into a single object schema.
Supports local/known object refs by expanding them before merge.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### schemas

`IJsonSchema`[]

The mapped intersection schemas.

##### toInlineUtilityObjectSchema

(`schema`) => `IJsonSchema`

Callback for converting referenced schemas to inline forms.

#### Returns

`IJsonSchema` \| `undefined`

The merged schema, or undefined when merge is not safe.
