# Tools Core Examples

Use these helpers to normalise generated schemas and keep references consistent before writing documents.

## JsonSchemaHelper

```typescript
import { JsonSchemaHelper } from '@twin.org/tools-core';

console.log(JsonSchemaHelper.SCHEMA_VERSION); // "https://json-schema.org/draft/2020-12/schema"
```

```typescript
import type { IJsonSchema } from '@twin.org/tools-core';
import { JsonSchemaHelper } from '@twin.org/tools-core';

const schemaObject: IJsonSchema = {
  type: 'array',
  items: [{ type: 'string' }, { type: 'number' }],
  additionalItems: { type: 'boolean' }
};

JsonSchemaHelper.processArrays(schemaObject);

console.log(schemaObject.prefixItems); // [{ type: "string" }, { type: "number" }]

console.log(schemaObject.items); // { type: "boolean" }
```

```typescript
import type { IJsonSchema } from '@twin.org/tools-core';
import { JsonSchemaHelper } from '@twin.org/tools-core';

const schemaDictionary: { [key: string]: IJsonSchema } = {
  id: { $ref: '#/definitions/Partial%3CIOrder%3E' },
  amount: { type: 'number' }
};

JsonSchemaHelper.processSchemaDictionary(schemaDictionary);

console.log(schemaDictionary.id.$ref); // "Order"
```

```typescript
import type { IJsonSchema } from '@twin.org/tools-core';
import { JsonSchemaHelper } from '@twin.org/tools-core';

const schemaArray: IJsonSchema[] = [
  {
    items: [{ type: 'string' }],
    additionalItems: { type: 'number' }
  },
  {
    items: [{ type: 'string' }],
    additionalItems: { type: 'number' }
  }
];

JsonSchemaHelper.processSchemaArray(schemaArray);

console.log(schemaArray[0].prefixItems); // [{ type: "string" }]
```

```typescript
import { JsonSchemaHelper } from '@twin.org/tools-core';

console.log(JsonSchemaHelper.normaliseTypeName('#/definitions/Pick%3CIOrder%2C%22id%22%3E')); // "#/definitions/Order"
```

```typescript
import type { IJsonSchema } from '@twin.org/tools-core';
import { JsonSchemaHelper } from '@twin.org/tools-core';

const allSchemas: { [id: string]: IJsonSchema } = {
  Order: {
    type: 'object',
    properties: {
      customer: { $ref: '#/definitions/Customer' }
    }
  },
  Customer: {
    type: 'object',
    properties: {
      name: { type: 'string' }
    }
  }
};

const extracted: { [id: string]: IJsonSchema } = {};

JsonSchemaHelper.extractTypesFromSchema(allSchemas, allSchemas.Order, extracted);

console.log(Object.keys(extracted)); // ["Customer"]
```

```typescript
import type { IJsonSchema } from '@twin.org/tools-core';
import { JsonSchemaHelper } from '@twin.org/tools-core';

const allSchemas: { [id: string]: IJsonSchema } = {
  Order: {
    type: 'object',
    properties: {
      customer: { $ref: '#/definitions/Customer' }
    }
  },
  Customer: {
    type: 'object',
    properties: {
      name: { type: 'string' }
    }
  }
};

const referencedSchemas: { [id: string]: IJsonSchema } = {};

JsonSchemaHelper.extractTypes(allSchemas, ['Order'], referencedSchemas);

console.log(Object.keys(referencedSchemas)); // ["Order", "Customer"]
```

```typescript
import type { IJsonSchema } from '@twin.org/tools-core';
import { JsonSchemaHelper } from '@twin.org/tools-core';

const schemas: { [id: string]: IJsonSchema } = {
  Order: {
    type: 'object',
    properties: {
      customer: { $ref: '#/definitions/Customer' }
    }
  },
  Customer: {
    type: 'object',
    properties: {
      name: { type: 'string' }
    }
  }
};

JsonSchemaHelper.expandTypes(schemas, ['Customer']);

console.log(schemas.Order.properties?.customer); // { type: "object", properties: { name: { type: "string" } } }
```

```typescript
import type { IJsonSchema } from '@twin.org/tools-core';
import { JsonSchemaHelper } from '@twin.org/tools-core';

const schemas: { [id: string]: IJsonSchema } = {
  Customer: {
    type: 'object',
    properties: {
      name: { type: 'string' }
    }
  }
};

const customerRef: IJsonSchema = { $ref: '#/definitions/Customer' };

JsonSchemaHelper.expandSchemaTypes(schemas, customerRef, ['Customer']);

console.log(customerRef); // { type: "object", properties: { name: { type: "string" } } }
```

```typescript
import { JsonSchemaHelper } from '@twin.org/tools-core';

const regex = JsonSchemaHelper.stringToRegEx('/Order.*/');

console.log(regex.test('OrderCreated')); // true
```

## OpenApiHelper

```typescript
import { OpenApiHelper } from '@twin.org/tools-core';

console.log(OpenApiHelper.API_VERSION); // "3.1.1"
```
