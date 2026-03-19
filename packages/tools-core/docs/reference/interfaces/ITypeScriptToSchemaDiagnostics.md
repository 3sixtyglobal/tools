# Interface: ITypeScriptToSchemaDiagnostics

Diagnostic payload for non-fatal schema generation issues.

## Properties

### code {#code}

> **code**: `string`

Stable diagnostic code identifying the issue type.

***

### properties? {#properties}

> `optional` **properties**: `object`

Additional structured metadata related to the diagnostic.

#### Index Signature

\[`key`: `string`\]: `unknown`

***

### path {#path}

> **path**: `string`

Schema path where the issue was detected.

***

### fileName? {#filename}

> `optional` **fileName**: `string`

Source file where the diagnostic originated, if available.

***

### line? {#line}

> `optional` **line**: `number`

One-based source line number, when available.

***

### column? {#column}

> `optional` **column**: `number`

One-based source column number, when available.
