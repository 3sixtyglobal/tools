# Class: Utility

General-purpose utility methods for working with TypeScript AST nodes.

Enum-related helpers live in TypeScriptEnum.
Reference-mapping regex helpers live in TypeScriptRegEx.

## Constructors

### Constructor

> **new Utility**(): `Utility`

#### Returns

`Utility`

## Methods

### isTypeNameInput() {#istypenameinput}

> `static` **isTypeNameInput**(`value`): `boolean`

Determine whether an input value is a valid TypeScript type identifier.
An identifier must start with a letter, underscore, or dollar sign and contain only
alphanumerics, underscores, or dollar signs thereafter.

#### Parameters

##### value

`string`

The value to inspect.

#### Returns

`boolean`

True if the value looks like a type name.

***

### extractTupleElementType() {#extracttupleelementtype}

> `static` **extractTupleElementType**(`element`): `TypeNode` \| `undefined`

Extract the inner type node from a named or rest tuple element.
Named tuple members and rest elements both wrap an inner type node; this unwraps them.
Plain type nodes are returned as-is.

#### Parameters

##### element

`TypeNode`

The tuple element.

#### Returns

`TypeNode` \| `undefined`

The inner type node.

***

### getNodeJsDocDescription() {#getnodejsdocdescription}

> `static` **getNodeJsDocDescription**(`node`): `string` \| `undefined`

Extract the JSDoc description comment for an AST node.
Only top-level JSDoc block comments are considered; inline tags are ignored.

#### Parameters

##### node

`Node`

The node to inspect.

#### Returns

`string` \| `undefined`

The trimmed description text, or undefined when absent.

***

### getJSDocTagCommentText() {#getjsdoctagcommenttext}

> `static` **getJSDocTagCommentText**(`jsDocTag`): `string` \| `undefined`

Convert a JSDoc tag's comment portion to a plain text string.
JSDoc tag comments may be plain strings or arrays of link/text parts.

#### Parameters

##### jsDocTag

`JSDocTag`

The JSDoc tag.

#### Returns

`string` \| `undefined`

The comment text, or undefined when absent.

***

### getNodeTags() {#getnodetags}

> `static` **getNodeTags**(`node`, `tagName`): `object`

Read all custom JSDoc tags matching a tag name from a node and convert them to key/value pairs.
Each matching tag's comment must be in the form "key: value"; entries that do not follow this
convention are silently skipped.

#### Parameters

##### node

`Node`

The node to inspect.

##### tagName

`string`

The tag name to filter by (e.g., 'json-schema').

#### Returns

`object`

The extracted key/value pairs.

***

### getNodeTagComment() {#getnodetagcomment}

> `static` **getNodeTagComment**(`node`, `tagName`): `string` \| `undefined`

Read the plain comment text for the first matching JSDoc tag on a node.

#### Parameters

##### node

`Node`

The node to inspect.

##### tagName

`string`

The tag name to filter by (e.g., 'default').

#### Returns

`string` \| `undefined`

The trimmed comment text, or undefined when absent.

***

### parseTagValue() {#parsetagvalue}

> `static` **parseTagValue**(`value`): `unknown`

Parse a custom JSDoc tag value into JSON-compatible data.
Values that begin with a JSON token character ({, [, ", true, false, null) or look like a
number are parsed with JSON.parse.  All other values are returned as plain strings.

#### Parameters

##### value

`string`

The raw value text.

#### Returns

`unknown`

The parsed value.
