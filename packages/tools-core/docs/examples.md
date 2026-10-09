# Tools Core Examples

This package provides the lower-level building blocks used by the CLI applications. The most common entry point is `TypeScriptToSchema`, which parses TypeScript declarations and returns JSON Schema documents keyed by title.

## Generate Schemas From TypeScript

```ts
import type { IJsonSchema } from '@3sixty/tools-models';
import { TypeScriptToSchema } from '@3sixty/tools-core';

const converter = new TypeScriptToSchema();
const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};

const generatedSchemas = await converter.generateSchema(
  'https://schema.example.com/demo/',
  '@example/demo-package',
  packageSchemas,
  './dist/types/models.d.ts'
);

console.log(Object.keys(generatedSchemas));
```

When you already know the exported type you want, pass the type name instead of a file path. The helper resolves the declaration and returns the generated schema for that type together with any dependent schemas.

```ts
import type { IJsonSchema } from '@3sixty/tools-models';
import { TypeScriptToSchema } from '@3sixty/tools-core';

const converter = new TypeScriptToSchema();
const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};

const generatedSchemas = await converter.generateSchema(
  'https://schema.example.com/demo/',
  '@example/demo-package',
  packageSchemas,
  'DemoRequest'
);

const requestSchema = generatedSchemas.DemoRequest;
```

## Transform Generated Object Schemas

`TypeScriptSchemaObjectTransformer` helps when you need to adapt object schemas produced by the builder for utility types such as `Pick` and `Omit`, or when you want cleaner description text before serialising the result.

```ts
import type { IJsonSchema } from '@3sixty/tools-models';
import { TypeScriptSchemaObjectTransformer } from '@3sixty/tools-core';

const transformer = new TypeScriptSchemaObjectTransformer();

const personSchema: IJsonSchema = {
  title: 'Person',
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' }
  },
  required: ['id', 'name', 'email']
};

const publicPersonSchema = transformer.omitKeysFromObjectSchema(personSchema, ['email']);
const personSummarySchema = transformer.pickKeysFromObjectSchema(personSchema, ['id', 'name']);
```

If your schema descriptions come from multiline source comments, `normalizeSchemaDescriptions` removes duplicated whitespace while keeping intentional line breaks intact.

```ts
import type { IJsonSchema } from '@3sixty/tools-models';
import { TypeScriptSchemaObjectTransformer } from '@3sixty/tools-core';

const transformer = new TypeScriptSchemaObjectTransformer();

const schemaWithDescription: IJsonSchema = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      description: 'Current   status.\n\n  Used in responses.'
    }
  }
};

const normalisedSchema = transformer.normalizeSchemaDescriptions(schemaWithDescription);
```
