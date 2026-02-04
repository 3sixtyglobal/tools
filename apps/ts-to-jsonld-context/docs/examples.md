# @twin.org/ts-to-jsonld-context - Examples

## Command Line Tool

First install the tool with the following script.

```shell
npm install @twin.org/ts-to-jsonld-context
```

You can then run the tool from the command line e.g.

```shell
ts-to-jsonld-context
```

Reads the comments from the model properties to generate the definitions.

## Types

```ts
/**
 * The index of the entry.
 * json-ld type:schema:Integer
 */
index: number;
```

will produce

```json
"index": {
  "@id": "twin-ais:index",
  "@type": "schema:Integer"
},
```

```ts
/**
 * The object to associate with the entry as JSON-LD.
 * json-ld type:json
 */
entryObject: IJsonLdNodeObject;
```

will produce

```json
"entryObject": {
  "@id": "twin-ais:entryObject",
  "@type": "@json"
},
```

## Namespace

If the property refers to an external namespace defined in the config, property is not included in the output:

```ts
/**
 * The identity of the user which added the entry to the stream.
 * json-ld namespace:twin-common
 */
userIdentity?: string;
```

## Containers

For a container type:

```ts
/**
 * Entries in the stream.
 * json-ld container:set
 */
entries?: IAuditableItemStreamEntry[];
```

produces

```json
"entries": {
  "@id": "twin-ais:entries",
  "@container": "@set"
},
```

## IDs

For a plain id mapping:

```ts
/**
 * Entries in the stream.
 * json-ld id
 */
foo: unknown;
```

produces

```json
"foo": {
  "@id": "twin-ais:foo"
},
```

For an id with name:

```ts
/**
 * Entries in the stream.
 * json-ld id:bar
 */
foo: unknown;
```

produces

```json
"foo": {
  "@id": "twin-ais:bar"
},
```

For an id with namespace and name:

```ts
/**
 * Entries in the stream.
 * json-ld id:dee:bar
 */
foo: unknown;
```

produces

```json
"foo": {
  "@id": "dee:bar"
},
```

## Example Config

```json
{
  "prefix": "twin-ais",
  "contextUrl": "https://schema.twindev.org/ais/",
  "additionalContextUrls": {
    "twin-common": "https://schema.twindev.org/common/",
    "twin-immutable-proof": "https://schema.twindev.org/immutable-proof/",
    "schema": "http://schema.org/"
  },
  "fixedMappings": {
    "id": "@id",
    "type": "@type"
  },
  "types": [
    "./src/models/IAuditableItemStream.ts",
    "./src/models/IAuditableItemStreamList.ts",
    "./src/models/IAuditableItemStreamEntry.ts",
    "./src/models/IAuditableItemStreamEntryList.ts",
    "./src/models/IAuditableItemStreamEntryObjectList.ts"
  ]
}
```
