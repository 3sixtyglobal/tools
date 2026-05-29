# Tools Models Examples

This package exports the shared interfaces and constants used by the generator libraries and CLI applications. In most cases you will use these types to describe JSON Schema and OpenAPI documents in a type-safe way.

## Define A JSON Schema Document

```ts
import type { IJsonSchema, JsonSchemaTypeNames } from '@twin.org/tools-models';

const schemaType: JsonSchemaTypeNames = 'object';

const productSchema: IJsonSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://schema.example.com/catalog/product',
  title: 'Product',
  type: schemaType,
  properties: {
    id: { type: 'string' },
    name: { type: 'string', minLength: 1 },
    price: { type: 'number', minimum: 0 }
  },
  required: ['id', 'name', 'price'],
  additionalProperties: false
};
```

## Work With Supported JSON Schema Tags

`JsonSchemaTagNames` lists the tag names recognised by the schema builders after alias mapping. This is useful when validating custom documentation tags before handing source files to the generator.

```ts
import { JsonSchemaTagNames } from '@twin.org/tools-models';

const supportedTags = new Set(JsonSchemaTagNames);

if (supportedTags.has('minimum')) {
  console.log('minimum is supported');
}
```

## Define An OpenAPI Document

```ts
import type { IOpenApi } from '@twin.org/tools-models';

const openApiDocument: IOpenApi = {
  openapi: '3.1.1',
  info: {
    title: 'Catalog API',
    version: '1.0.0',
    description: 'Operations for querying catalogue entries.'
  },
  paths: {
    '/products/{productId}': {
      get: {
        operationId: 'getProduct',
        responses: {
          '200': {
            description: 'The requested product.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' }
        },
        required: ['id', 'name']
      }
    }
  }
};
```
