# Class: DiagnosticReporter

Emits non-fatal diagnostics during schema mapping.

## Constructors

### Constructor

> **new DiagnosticReporter**(): `DiagnosticReporter`

#### Returns

`DiagnosticReporter`

## Methods

### report() {#report}

> `static` **report**(`context`, `node`, `code`, `properties?`): `void`

Emit an optional non-fatal schema generation diagnostic.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### node

`Node`

The related AST node.

##### code

`string`

The diagnostic code.

##### properties?

The values to substitute into the localised message.

#### Returns

`void`
