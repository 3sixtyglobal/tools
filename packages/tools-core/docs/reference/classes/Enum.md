# Class: Enum

Utility methods for extracting enum values from TypeScript AST nodes.

Handles three distinct patterns used to define enumerable sets of values:
- Native enum declarations: `enum Color { Red = "red" }`
- Const-object-with-matching-type patterns: `const Foo = { A: "a" } as const` paired with a type alias named identically to the const

## Constructors

### Constructor

> **new Enum**(): `Enum`

#### Returns

`Enum`

## Methods

### extractEnumValuesFromConstAndType() {#extractenumvaluesfromconstandtype}

> `static` **extractEnumValuesFromConstAndType**(`name`, `sourceFile`): `object`[] \| `undefined`

Extract enum values from a const-and-type pair where a const object and a type alias share the
same name.  The const object is located first because its members may carry JSDoc descriptions
that would be lost if the type alias were processed in isolation.

#### Parameters

##### name

`string`

The name to search for.

##### sourceFile

`SourceFile`

The source file to search.

#### Returns

`object`[] \| `undefined`

The extracted enum entries or undefined when the pattern is not present.

***

### extractEnumEntriesFromConstObject() {#extractenumentriesfromconstobject}

> `static` **extractEnumEntriesFromConstObject**(`objLiteral`): `object`[]

Extract enum entries from a const object literal.
Only properties whose initializer is a string or numeric literal are included.

#### Parameters

##### objLiteral

`ObjectLiteralExpression`

The object literal expression.

#### Returns

`object`[]

The extracted enum entries.

***

### extractEnumValuesFromEnumDeclaration() {#extractenumvaluesfromenumdeclaration}

> `static` **extractEnumValuesFromEnumDeclaration**(`declaration`): `object`[]

Extract enum values from a native TypeScript enum declaration.
Numeric members without an explicit initializer are auto-incremented from the previous value.

#### Parameters

##### declaration

`EnumDeclaration`

The enum declaration.

#### Returns

`object`[]

The extracted enum entries.
