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

The generation context.

##### typeNode

`MappedTypeNode`

The mapped type node.

##### mappedKeys

`string`[]

The resolved source keys from the mapped type constraint.

##### mappedTypeParameterName

`string`

The mapped type parameter identifier.

#### Returns

`object`[] \| `undefined`

The resolved source-to-output mapped key entries.

***

### resolveMappedTypeRemappedKey() {#resolvemappedtyperemappedkey}

> `static` **resolveMappedTypeRemappedKey**(`context`, `nameTypeNode`, `sourceKey`, `mappedTypeParameterName`): `string` \| `null` \| `undefined`

Resolve a remapped mapped-type key expression for a concrete source key.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### nameTypeNode

`TypeNode`

The mapped type name remapping expression node.

##### sourceKey

`string`

The concrete source key currently being evaluated.

##### mappedTypeParameterName

`string`

The mapped type parameter identifier.

#### Returns

`string` \| `null` \| `undefined`

The remapped key, null when excluded via never, or undefined when unresolved.

***

### evaluateMappedKeyExtendsCondition() {#evaluatemappedkeyextendscondition}

> `static` **evaluateMappedKeyExtendsCondition**(`context`, `sourceKey`, `extendsTypeNode`): `boolean` \| `undefined`

Evaluate whether a concrete mapped key satisfies an `extends` condition.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### sourceKey

`string`

The concrete source key being evaluated.

##### extendsTypeNode

`TypeNode`

The extends condition type node.

#### Returns

`boolean` \| `undefined`

True when the key satisfies the condition, false when it does not, otherwise undefined.

***

### buildMappedTypeFallbackSchema() {#buildmappedtypefallbackschema}

> `static` **buildMappedTypeFallbackSchema**(`context`, `typeNode`, `mappedKeys`, `mappedTypeParameterName`, `sourceObjectSchema?`): `IJsonSchema`

Build a conservative fallback schema for mapped types whose key remapping cannot be resolved.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`MappedTypeNode`

The mapped type node.

##### mappedKeys

`string`[]

The resolved source keys from the mapped type constraint.

##### mappedTypeParameterName

`string`

The mapped type parameter identifier.

##### sourceObjectSchema?

`IJsonSchema`

The optional source object schema for property lookups.

#### Returns

`IJsonSchema`

The fallback mapped type schema.

***

### buildMappedTypeFallbackAdditionalProperties() {#buildmappedtypefallbackadditionalproperties}

> `static` **buildMappedTypeFallbackAdditionalProperties**(`context`, `typeNode`, `mappedKeys`, `mappedTypeParameterName`, `sourceObjectSchema?`): `IJsonSchema` \| `undefined`

Build fallback additionalProperties for unresolved mapped key remapping.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`MappedTypeNode`

The mapped type node.

##### mappedKeys

`string`[]

The resolved source keys from the mapped type constraint.

##### mappedTypeParameterName

`string`

The mapped type parameter identifier.

##### sourceObjectSchema?

`IJsonSchema`

The optional source object schema for property lookups.

#### Returns

`IJsonSchema` \| `undefined`

The fallback additionalProperties schema.

***

### mergeMappedTypePropertySchemas() {#mergemappedtypepropertyschemas}

> `static` **mergeMappedTypePropertySchemas**(`existingSchema`, `nextSchema`): `IJsonSchema`

Merge mapped property schemas when multiple source keys remap to the same output key.

#### Parameters

##### existingSchema

`IJsonSchema`

The existing schema already assigned to the mapped key.

##### nextSchema

`IJsonSchema`

The next schema to merge into the mapped key.

#### Returns

`IJsonSchema`

The merged schema.

***

### resolveMappedTypeSourceRequiredPropertyKeys() {#resolvemappedtypesourcerequiredpropertykeys}

> `static` **resolveMappedTypeSourceRequiredPropertyKeys**(`mappedEntries`, `sourceObjectSchema`): `string`[] \| `undefined`

Resolve required remapped keys from the source object's required key set.

#### Parameters

##### mappedEntries

`object`[]

The source-to-output mapped key entries.

##### sourceObjectSchema

`IJsonSchema`

The source object schema containing required keys.

#### Returns

`string`[] \| `undefined`

The required output keys.
