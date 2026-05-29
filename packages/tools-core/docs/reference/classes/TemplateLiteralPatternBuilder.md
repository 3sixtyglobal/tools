# Class: TemplateLiteralPatternBuilder

Builds regex patterns for TypeScript template literal types.

## Constructors

### Constructor

> **new TemplateLiteralPatternBuilder**(): `TemplateLiteralPatternBuilder`

#### Returns

`TemplateLiteralPatternBuilder`

## Methods

### buildTemplateLiteralPattern() {#buildtemplateliteralpattern}

> `static` **buildTemplateLiteralPattern**(`typeNode`): `string` \| `undefined`

Build a regular-expression pattern for a template literal type.

#### Parameters

##### typeNode

`TemplateLiteralTypeNode`

The template literal type node.

#### Returns

`string` \| `undefined`

The regex pattern, or undefined if a safe pattern cannot be derived.
