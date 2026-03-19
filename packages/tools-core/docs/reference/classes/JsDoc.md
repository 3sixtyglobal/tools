# Class: JsDoc

General-purpose utility methods for working with JsDoc.

## Constructors

### Constructor

> **new JsDoc**(): `JsDoc`

#### Returns

`JsDoc`

## Methods

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
