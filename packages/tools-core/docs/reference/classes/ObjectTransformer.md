# Class: ObjectTransformer

Applies common object-schema transformations used by the builder.

## Constructors

### Constructor

> **new ObjectTransformer**(): `ObjectTransformer`

#### Returns

`ObjectTransformer`

## Methods

### resolvePropertySchemaFromObjectSchema() {#resolvepropertyschemafromobjectschema}

> `static` **resolvePropertySchemaFromObjectSchema**(`baseSchema`, `propertyKey`): `IJsonSchema` \| `undefined`

Resolve a property schema from an object schema by property key.

#### Parameters

##### baseSchema

`IJsonSchema`

The source object schema.

##### propertyKey

`string`

The property key to resolve.

#### Returns

`IJsonSchema` \| `undefined`

The resolved property schema.

***

### omitKeysFromObjectSchema() {#omitkeysfromobjectschema}

> `static` **omitKeysFromObjectSchema**(`baseSchema`, `omittedKeys`): `IJsonSchema`

Remove keys from an object schema.

#### Parameters

##### baseSchema

`IJsonSchema`

The source object schema.

##### omittedKeys

`string`[]

The keys to remove.

#### Returns

`IJsonSchema`

The transformed object schema.

***

### pickKeysFromObjectSchema() {#pickkeysfromobjectschema}

> `static` **pickKeysFromObjectSchema**(`baseSchema`, `pickedKeys`): `IJsonSchema`

Keep only keys from an object schema.

#### Parameters

##### baseSchema

`IJsonSchema`

The source object schema.

##### pickedKeys

`string`[]

The keys to keep.

#### Returns

`IJsonSchema`

The transformed object schema.

***

### normalizeSchemaDescriptions() {#normalizeschemadescriptions}

> `static` **normalizeSchemaDescriptions**(`schema`): `IJsonSchema`

Normalize schema description whitespace while preserving intentional line breaks.

#### Parameters

##### schema

`IJsonSchema`

The schema to normalize.

#### Returns

`IJsonSchema`

The normalized schema.

***

### renameKeysWithPrefixInObjectSchema() {#renamekeyswithprefixinobjectschema}

> `static` **renameKeysWithPrefixInObjectSchema**(`baseSchema`, `prefix`): `IJsonSchema`

Rename all non-JSON-LD property keys in an object schema by prefixing them.
Keys that already start with "@" are preserved as-is; all others become `prefix:key`.

#### Parameters

##### baseSchema

`IJsonSchema`

The source object schema.

##### prefix

`string`

The namespace prefix to apply.

#### Returns

`IJsonSchema`

The transformed object schema.
