# Class: UtilityTypeSchemaMapper

Static utility-type schema mapping helpers.

## Constructors

### Constructor

> **new UtilityTypeSchemaMapper**(): `UtilityTypeSchemaMapper`

#### Returns

`UtilityTypeSchemaMapper`

## Methods

### mapPartialUtilityType() {#mappartialutilitytype}

> `static` **mapPartialUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map Partial<T> to an object schema with no required properties.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The Partial type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapRequiredUtilityType() {#maprequiredutilitytype}

> `static` **mapRequiredUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map Required<T> to an object schema with all properties required.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The Required type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapPickUtilityType() {#mappickutilitytype}

> `static` **mapPickUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map Pick<T, K> to an object schema with selected keys preserved.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The Pick type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapOmitUtilityType() {#mapomitutilitytype}

> `static` **mapOmitUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map Omit<T, K> to an object schema with selected keys removed.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The Omit type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapExcludeUtilityType() {#mapexcludeutilitytype}

> `static` **mapExcludeUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map Exclude<T, U> to a schema that removes U members from T.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The Exclude type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapExtractUtilityType() {#mapextractutilitytype}

> `static` **mapExtractUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map Extract<T, U> to a schema that keeps U members from T.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The Extract type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapNonNullableUtilityType() {#mapnonnullableutilitytype}

> `static` **mapNonNullableUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map NonNullable<T> by removing null and undefined branches from T.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The NonNullable type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapRecordUtilityType() {#maprecordutilitytype}

> `static` **mapRecordUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map Record<K, V> to an object schema with key constraints where possible.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The Record type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapJsonLdObjectUtilityType() {#mapjsonldobjectutilitytype}

> `static` **mapJsonLdObjectUtilityType**(`context`, `typeNode`, `options`): `IJsonSchema` \| `undefined`

Map JsonLdObject utility types using key-removal and optional key-addition rules.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The JsonLdObject utility type reference.

##### options

The mapping options for key removal and optional key addition.

###### keysToRemove

`string`[]

The property keys to remove from the base schema.

###### keyToAdd?

`"type"` \| `"id"` \| `"@id"` \| `"@type"` \| `"@context"`

The optional key to add after removal.

###### isAddedKeyRequired?

`boolean`

True when the added key must be required.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapObjectOrArrayUtilityType() {#mapobjectorarrayutilitytype}

> `static` **mapObjectOrArrayUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map ObjectOrArray<T> to a schema accepting T or T[].

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The ObjectOrArray type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapSingleOccurrenceArrayUtilityType() {#mapsingleoccurrencearrayutilitytype}

> `static` **mapSingleOccurrenceArrayUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map SingleOccurrenceArray<T, U> to a non-empty array containing exactly one U.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The SingleOccurrenceArray type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.
