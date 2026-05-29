# Class: RegEx

Utility methods for pattern matching and regex construction.

## Constructors

### Constructor

> **new RegEx**(): `RegEx`

#### Returns

`RegEx`

## Methods

### isReferencePatternMatch() {#isreferencepatternmatch}

> `static` **isReferencePatternMatch**(`pattern`, `packageName`, `typeName`, `schemaTitle`): `boolean`

Determine whether a reference mapping pattern matches an external reference.

#### Parameters

##### pattern

`string`

The mapping pattern.

##### packageName

`string`

The external package name.

##### typeName

`string`

The imported type name.

##### schemaTitle

`string`

The derived schema title.

#### Returns

`boolean`

True if matched.

***

### applyReferencePatternReplacement() {#applyreferencepatternreplacement}

> `static` **applyReferencePatternReplacement**(`pattern`, `replacement`, `packageName`, `typeName`, `schemaTitle`): `string` \| `undefined`

Apply a reference mapping replacement to the first matching candidate.

#### Parameters

##### pattern

`string`

The mapping pattern.

##### replacement

`string`

The replacement template.

##### packageName

`string`

The external package name.

##### typeName

`string`

The imported type name.

##### schemaTitle

`string`

The derived schema title.

#### Returns

`string` \| `undefined`

The replaced value if a candidate matches.
