# Interface: IIncrementalCache

The cache recording the inputs and outputs of the last incremental run of a tool.

## Properties

### toolVersion? {#toolversion}

> `optional` **toolVersion?**: `string`

The version of the tool, a different version always regenerates the outputs.

***

### inputs {#inputs}

> **inputs**: `string`

The hash of the inputs.

***

### outputs {#outputs}

> **outputs**: `object`

The hash of each output file, keyed by its path relative to the package.

#### Index Signature

\[`file`: `string`\]: `string`
