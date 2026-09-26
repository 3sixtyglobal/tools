# Interface: IExternalValidator

A compiled validator exported by a dependency, imported instead of compiling its schema again.

## Properties

### moduleSpecifier {#modulespecifier}

> **moduleSpecifier**: `string`

The module specifier to import the validator from.

***

### exportName {#exportname}

> **exportName**: `string`

The name the module exports the validator as.

***

### validator {#validator}

> **validator**: (`data`) => `boolean`

The validator itself.

#### Parameters

##### data

`unknown`

#### Returns

`boolean`
