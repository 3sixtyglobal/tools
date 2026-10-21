# Interface: IIncrementalInputs

The inputs which determine the outputs of an incremental run of a tool.

## Properties

### packageFolder {#packagefolder}

> **packageFolder**: `string`

The folder of the package the tool is run for, its dependencies are hashed.

***

### toolFolder {#toolfolder}

> **toolFolder**: `string`

The folder of the tool, its code is hashed so changing the tool regenerates the outputs.

***

### files {#files}

> **files**: `string`[]

Files whose contents are inputs, such as the configuration.

***

### types {#types}

> **types**: `string`[]

The source files of the types, every source file in the folders they live in is hashed as
the types can import any of them.

***

### ignore? {#ignore}

> `optional` **ignore?**: `string`[]

Patterns relative to the package for source files which are not inputs, such as the outputs.

***

### values? {#values}

> `optional` **values?**: `unknown`

Any other values which affect the outputs, such as the arguments.
