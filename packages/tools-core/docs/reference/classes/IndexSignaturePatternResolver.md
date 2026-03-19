# Class: IndexSignaturePatternResolver

Resolves regex patterns for index signature key types.

## Constructors

### Constructor

> **new IndexSignaturePatternResolver**(): `IndexSignaturePatternResolver`

#### Returns

`IndexSignaturePatternResolver`

## Methods

### isSupportedIndexSignature() {#issupportedindexsignature}

> `static` **isSupportedIndexSignature**(`member`): `boolean`

Determine whether an index signature can be represented as JSON object additionalProperties.

#### Parameters

##### member

`IndexSignatureDeclaration`

The index signature declaration.

#### Returns

`boolean`

True if supported.

***

### extractIndexSignaturePattern() {#extractindexsignaturepattern}

> `static` **extractIndexSignaturePattern**(`context`, `member`, `getTypeParameterBinding`): `string` \| `undefined`

Extract a regex pattern for an index signature key type when representable.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### member

`IndexSignatureDeclaration`

The index signature declaration.

##### getTypeParameterBinding

(`context`, `typeName`) => `TypeNode` \| `null` \| `undefined`

Callback for resolving generic bindings.

#### Returns

`string` \| `undefined`

The property-name pattern, if derivable.
