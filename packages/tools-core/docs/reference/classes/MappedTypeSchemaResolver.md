# Class: MappedTypeSchemaResolver

Static mapped-type schema transformation helpers.

## Constructors

### Constructor

> **new MappedTypeSchemaResolver**(): `MappedTypeSchemaResolver`

#### Returns

`MappedTypeSchemaResolver`

## Methods

### resolveMappedTypePropertyEntries() {#resolvemappedtypepropertyentries}

> `static` **resolveMappedTypePropertyEntries**(`context`, `typeNode`, `mappedKeys`, `mappedTypeParameterName`): `object`[] \| `undefined`

Resolve mapped type output keys, including remapped key names via `as`.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

##### typeNode

`MappedTypeNode`

##### mappedKeys

`string`[]

##### mappedTypeParameterName

`string`

#### Returns

`object`[] \| `undefined`

***

### resolveMappedTypeRemappedKey() {#resolvemappedtyperemappedkey}

> `static` **resolveMappedTypeRemappedKey**(`context`, `nameTypeNode`, `sourceKey`, `mappedTypeParameterName`): `string` \| `null` \| `undefined`

Resolve a remapped mapped-type key expression for a concrete source key.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

##### nameTypeNode

`TypeNode`

##### sourceKey

`string`

##### mappedTypeParameterName

`string`

#### Returns

`string` \| `null` \| `undefined`

***

### evaluateMappedKeyExtendsCondition() {#evaluatemappedkeyextendscondition}

> `static` **evaluateMappedKeyExtendsCondition**(`context`, `sourceKey`, `extendsTypeNode`): `boolean` \| `undefined`

Evaluate whether a concrete mapped key satisfies an `extends` condition.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

##### sourceKey

`string`

##### extendsTypeNode

`TypeNode`

#### Returns

`boolean` \| `undefined`

***

### buildMappedTypeFallbackSchema() {#buildmappedtypefallbackschema}

> `static` **buildMappedTypeFallbackSchema**(`context`, `typeNode`, `mappedKeys`, `mappedTypeParameterName`, `sourceObjectSchema?`): `IJsonSchema`

Build a conservative fallback schema for mapped types whose key remapping cannot be resolved.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

##### typeNode

`MappedTypeNode`

##### mappedKeys

`string`[]

##### mappedTypeParameterName

`string`

##### sourceObjectSchema?

`IJsonSchema`

#### Returns

`IJsonSchema`

***

### buildMappedTypeFallbackAdditionalProperties() {#buildmappedtypefallbackadditionalproperties}

> `static` **buildMappedTypeFallbackAdditionalProperties**(`context`, `typeNode`, `mappedKeys`, `mappedTypeParameterName`, `sourceObjectSchema?`): `IJsonSchema` \| `undefined`

Build fallback additionalProperties for unresolved mapped key remapping.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

##### typeNode

`MappedTypeNode`

##### mappedKeys

`string`[]

##### mappedTypeParameterName

`string`

##### sourceObjectSchema?

`IJsonSchema`

#### Returns

`IJsonSchema` \| `undefined`

***

### mergeMappedTypePropertySchemas() {#mergemappedtypepropertyschemas}

> `static` **mergeMappedTypePropertySchemas**(`existingSchema`, `nextSchema`): `IJsonSchema`

Merge mapped property schemas when multiple source keys remap to the same output key.

#### Parameters

##### existingSchema

`IJsonSchema`

##### nextSchema

`IJsonSchema`

#### Returns

`IJsonSchema`

***

### resolveMappedTypeSourceRequiredPropertyKeys() {#resolvemappedtypesourcerequiredpropertykeys}

> `static` **resolveMappedTypeSourceRequiredPropertyKeys**(`mappedEntries`, `sourceObjectSchema`): `string`[] \| `undefined`

Resolve required remapped keys from the source object's required key set.

#### Parameters

##### mappedEntries

`object`[]

##### sourceObjectSchema

`IJsonSchema`

#### Returns

`string`[] \| `undefined`
