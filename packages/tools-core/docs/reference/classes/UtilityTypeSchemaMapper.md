# Class: UtilityTypeSchemaMapper

Static utility-type schema mapping helpers.

## Constructors

### Constructor

> **new UtilityTypeSchemaMapper**(): `UtilityTypeSchemaMapper`

#### Returns

`UtilityTypeSchemaMapper`

## Methods

### mapPartialUtilityType() {#mappartialutilitytype}

> `static` **mapPartialUtilityType**(`context`, `typeNode`, `resolveUtilityBaseObjectSchema`): `IJsonSchema` \| `undefined`

Map Partial<T> to an object schema with no required properties.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The Partial type reference.

##### resolveUtilityBaseObjectSchema

(`context`, `baseTypeNode`) => `IJsonSchema` \| `undefined`

Callback to resolve base object schemas.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapRequiredUtilityType() {#maprequiredutilitytype}

> `static` **mapRequiredUtilityType**(`context`, `typeNode`, `resolveUtilityBaseObjectSchema`): `IJsonSchema` \| `undefined`

Map Required<T> to an object schema with all properties required.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The Required type reference.

##### resolveUtilityBaseObjectSchema

(`context`, `baseTypeNode`) => `IJsonSchema` \| `undefined`

Callback to resolve base object schemas.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapPickUtilityType() {#mappickutilitytype}

> `static` **mapPickUtilityType**(`context`, `typeNode`, `resolveUtilityBaseObjectSchema`, `extractUtilityTypeKeys`): `IJsonSchema` \| `undefined`

Map Pick<T, K> to an object schema with selected keys preserved.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

##### typeNode

`TypeReferenceNode`

##### resolveUtilityBaseObjectSchema

(`context`, `baseTypeNode`) => `IJsonSchema` \| `undefined`

##### extractUtilityTypeKeys

(`context`, `keysNode`) => `string`[]

#### Returns

`IJsonSchema` \| `undefined`

***

### mapOmitUtilityType() {#mapomitutilitytype}

> `static` **mapOmitUtilityType**(`context`, `typeNode`, `resolveUtilityBaseObjectSchema`, `extractUtilityTypeKeys`): `IJsonSchema` \| `undefined`

Map Omit<T, K> to an object schema with selected keys removed.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

##### typeNode

`TypeReferenceNode`

##### resolveUtilityBaseObjectSchema

(`context`, `baseTypeNode`) => `IJsonSchema` \| `undefined`

##### extractUtilityTypeKeys

(`context`, `keysNode`) => `string`[]

#### Returns

`IJsonSchema` \| `undefined`

***

### mapExcludeUtilityType() {#mapexcludeutilitytype}

> `static` **mapExcludeUtilityType**(`context`, `typeNode`, `mapTypeNodeToSchema`): `IJsonSchema` \| `undefined`

Map Exclude<T, U> to a schema that removes U members from T.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

##### typeNode

`TypeReferenceNode`

##### mapTypeNodeToSchema

(`context`, `typeNode`) => `IJsonSchema` \| `undefined`

#### Returns

`IJsonSchema` \| `undefined`

***

### mapExtractUtilityType() {#mapextractutilitytype}

> `static` **mapExtractUtilityType**(`context`, `typeNode`, `mapTypeNodeToSchema`): `IJsonSchema` \| `undefined`

Map Extract<T, U> to a schema that keeps U members from T.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

##### typeNode

`TypeReferenceNode`

##### mapTypeNodeToSchema

(`context`, `typeNode`) => `IJsonSchema` \| `undefined`

#### Returns

`IJsonSchema` \| `undefined`

***

### mapNonNullableUtilityType() {#mapnonnullableutilitytype}

> `static` **mapNonNullableUtilityType**(`context`, `typeNode`, `mapTypeNodeToSchema`): `IJsonSchema` \| `undefined`

Map NonNullable<T> by removing null and undefined branches from T.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

##### typeNode

`TypeReferenceNode`

##### mapTypeNodeToSchema

(`context`, `typeNode`) => `IJsonSchema` \| `undefined`

#### Returns

`IJsonSchema` \| `undefined`

***

### mapRecordUtilityType() {#maprecordutilitytype}

> `static` **mapRecordUtilityType**(`context`, `typeNode`, `mapTypeNodeToSchema`): `IJsonSchema` \| `undefined`

Map Record<K, V> to an object schema with key constraints where possible.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

##### typeNode

`TypeReferenceNode`

##### mapTypeNodeToSchema

(`context`, `typeNode`) => `IJsonSchema` \| `undefined`

#### Returns

`IJsonSchema` \| `undefined`

***

### mapJsonLdObjectUtilityType() {#mapjsonldobjectutilitytype}

> `static` **mapJsonLdObjectUtilityType**(`context`, `typeNode`, `options`, `resolveUtilityBaseObjectSchema`, `mapTypeNodeToSchema`): `IJsonSchema` \| `undefined`

Map JsonLdObject utility types using key-removal and optional key-addition rules.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

##### typeNode

`TypeReferenceNode`

##### options

###### keysToRemove

`string`[]

###### keyToAdd?

`"type"` \| `"id"` \| `"@id"` \| `"@type"` \| `"@context"`

###### isAddedKeyRequired?

`boolean`

##### resolveUtilityBaseObjectSchema

(`context`, `baseTypeNode`) => `IJsonSchema` \| `undefined`

##### mapTypeNodeToSchema

(`context`, `typeNode`) => `IJsonSchema` \| `undefined`

#### Returns

`IJsonSchema` \| `undefined`

***

### mapObjectOrArrayUtilityType() {#mapobjectorarrayutilitytype}

> `static` **mapObjectOrArrayUtilityType**(`context`, `typeNode`, `mapTypeNodeToSchema`): `IJsonSchema` \| `undefined`

Map ObjectOrArray<T> to a schema accepting T or T[].

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

##### typeNode

`TypeReferenceNode`

##### mapTypeNodeToSchema

(`context`, `typeNode`) => `IJsonSchema` \| `undefined`

#### Returns

`IJsonSchema` \| `undefined`

***

### mapSingleOccurrenceArrayUtilityType() {#mapsingleoccurrencearrayutilitytype}

> `static` **mapSingleOccurrenceArrayUtilityType**(`context`, `typeNode`, `mapTypeNodeToSchema`): `IJsonSchema` \| `undefined`

Map SingleOccurrenceArray<T, U> to a non-empty array containing exactly one U.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

##### typeNode

`TypeReferenceNode`

##### mapTypeNodeToSchema

(`context`, `typeNode`) => `IJsonSchema` \| `undefined`

#### Returns

`IJsonSchema` \| `undefined`
