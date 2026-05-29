# Class: DisallowedTypeGuard

Validates whether a type node is allowed for schema generation.

## Constructors

### Constructor

> **new DisallowedTypeGuard**(): `DisallowedTypeGuard`

#### Returns

`DisallowedTypeGuard`

## Methods

### getDisallowedTypeName() {#getdisallowedtypename}

> `static` **getDisallowedTypeName**(`typeNode`): `string` \| `undefined`

Resolve a disallowed type name from a type node.

#### Parameters

##### typeNode

`TypeNode`

The type node to inspect.

#### Returns

`string` \| `undefined`

The disallowed type name, if found.
