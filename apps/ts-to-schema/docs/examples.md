# TypeScript to Schema CLI Usage

Use this CLI to turn TypeScript model definitions into JSON Schema files for validation and publishing.

## Running

To install and run the CLI locally use the following commands:

```shell
npm install @twin.org/ts-to-schema -g
ts-to-schema
```

or run directly using NPX:

```shell
npx "@twin.org/ts-to-schema"
```

## Help

```shell
⚙️  TWIN TypeScript To Schema v0.0.3-next.12

Usage: ts-to-schema

Arguments:
  config         Path to the JSON configuration file.
  output-folder  The folder to write the schema files.

Options:
  -V, --version  output the version number
  --lang <lang>  The language to display the output in. (default: "en")
  -h, --help     display help for command
```

## Example Config

```json
{
  "baseUrl": "https://schema.twindev.org/my-namespace/",
  "sourceFiles": ["./dist/types/*.d.ts"],
  "types": ["MyType1", "MyType2"]
}
```
