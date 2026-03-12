# Class: JsonSchemaHelper

Helper class for JSON Schema processing.

## Constructors

### Constructor

> **new JsonSchemaHelper**(): `JsonSchemaHelper`

#### Returns

`JsonSchemaHelper`

## Properties

### SCHEMA\_VERSION {#schema_version}

> `readonly` `static` **SCHEMA\_VERSION**: `"https://json-schema.org/draft/2020-12/schema"` = `"https://json-schema.org/draft/2020-12/schema"`

The JSON Schema version used.

## Methods

### processArrays() {#processarrays}

> `static` **processArrays**(`schemaObject`): `void`

Process arrays in the schema object.

#### Parameters

##### schemaObject

`AnySchemaObject`

The schema object to process.

#### Returns

`void`

***

### processSchemaDictionary() {#processschemadictionary}

> `static` **processSchemaDictionary**(`schemaDictionary?`): `void`

Process arrays in the schema object.

#### Parameters

##### schemaDictionary?

The schema object to process.

#### Returns

`void`

***

### processSchemaArray() {#processschemaarray}

> `static` **processSchemaArray**(`schemaArray?`): `void`

Process arrays in the schema object.

#### Parameters

##### schemaArray?

`AnySchemaObject`[]

The schema object to process.

#### Returns

`void`

***

### normaliseTypeName() {#normalisetypename}

> `static` **normaliseTypeName**(`typeName`): `string`

Cleanup TypeScript markers from the type name.

#### Parameters

##### typeName

`string`

The definition string to clean up.

#### Returns

`string`

The cleaned up definition string.

***

### extractTypesFromSchema() {#extracttypesfromschema}

> `static` **extractTypesFromSchema**(`allTypes`, `schema`, `output`): `void`

Extract type from properties definition.

#### Parameters

##### allTypes

All the known types.

##### schema

`AnySchemaObject`

The schema to extract from.

##### output

The output types.

#### Returns

`void`

***

### extractTypes() {#extracttypes}

> `static` **extractTypes**(`allSchemas`, `requiredTypes`, `referencedSchemas`): `void`

Extract the required types from all the known schemas.

#### Parameters

##### allSchemas

All the known schemas.

##### requiredTypes

`string`[]

The required types.

##### referencedSchemas

The references schemas.

#### Returns

`void`

***

### expandTypes() {#expandtypes}

> `static` **expandTypes**(`schemas`, `expandedTypes`): `void`

Expand the types inline.

#### Parameters

##### schemas

The schemas to include the expanded types.

##### expandedTypes

`string`[]

The types to expand.

#### Returns

`void`

***

### expandSchemaTypes() {#expandschematypes}

> `static` **expandSchemaTypes**(`allSchemas`, `schema`, `expandedTypes`): `void`

Expand the types inline.

#### Parameters

##### allSchemas

All the known schemas.

##### schema

`AnySchemaObject`

The schemas to include the expanded types.

##### expandedTypes

`string`[]

The types to expand.

#### Returns

`void`

***

### stringToRegEx() {#stringtoregex}

> `static` **stringToRegEx**(`matchPattern`): `RegExp`

Convert a string pattern to a regular expression.

#### Parameters

##### matchPattern

`string`

The pattern to convert.

#### Returns

`RegExp`

The regular expression.
