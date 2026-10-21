# Interface: IIncrementalCache

The cache recording the inputs and outputs of the last incremental run of a tool.

## Properties

### inputs {#inputs}

> **inputs**: `string`

The hash of the inputs.

***

### outputs {#outputs}

> **outputs**: `object`

The hash of each output file, keyed by its path relative to the package.

#### Index Signature

\[`file`: `string`\]: `string`
