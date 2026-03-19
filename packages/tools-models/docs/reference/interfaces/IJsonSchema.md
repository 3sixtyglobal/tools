# Interface: IJsonSchema

JSON schema representation used by the TypeScript conversion utilities.

## See

https://json-schema.org/draft/2020-12/json-schema-core

## Indexable

\[`key`: `string`\]: `unknown`

Allow additional extension keywords.

### See

 - https://www.learnjsonschema.com/2020-12/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-4.3.1

## Properties

### $schema? {#schema}

> `optional` **$schema**: `string`

Dialect URI for the schema document.

#### See

 - https://www.learnjsonschema.com/2020-12/core/schema/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-8.1.1

***

### $id? {#id}

> `optional` **$id**: `string`

Canonical identifier for the schema resource.

#### See

 - https://www.learnjsonschema.com/2020-12/core/id/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-8.2.1

***

### $ref? {#ref}

> `optional` **$ref**: `string`

Reference to another schema resource.

#### See

 - https://www.learnjsonschema.com/2020-12/core/ref/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-8.2.3.1

***

### $anchor? {#anchor}

> `optional` **$anchor**: `string`

Location-independent identifier fragment.

#### See

 - https://www.learnjsonschema.com/2020-12/core/anchor/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-8.2.2

***

### $dynamicRef? {#dynamicref}

> `optional` **$dynamicRef**: `string`

Runtime-resolved dynamic schema reference.

#### See

 - https://www.learnjsonschema.com/2020-12/core/dynamicref/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-8.2.3.2

***

### $dynamicAnchor? {#dynamicanchor}

> `optional` **$dynamicAnchor**: `string`

Dynamic extension point anchor.

#### See

 - https://www.learnjsonschema.com/2020-12/core/dynamicanchor/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-8.2.2

***

### $vocabulary? {#vocabulary}

> `optional` **$vocabulary**: `object`

Declares vocabularies for a meta-schema dialect.

#### Index Signature

\[`uri`: `string`\]: `boolean`

#### See

 - https://www.learnjsonschema.com/2020-12/core/vocabulary/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-8.1.2

***

### $comment? {#comment}

> `optional` **$comment**: `string`

Maintainer comment for tools.

#### See

 - https://www.learnjsonschema.com/2020-12/core/comment/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-8.3

***

### $defs? {#defs}

> `optional` **$defs**: `object`

Reusable inlined schema definitions.

#### Index Signature

\[`id`: `string`\]: `IJsonSchema`

#### See

 - https://www.learnjsonschema.com/2020-12/core/defs/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-8.2.4

***

### title? {#title}

> `optional` **title**: `string`

Human-friendly schema title.

#### See

 - https://www.learnjsonschema.com/2020-12/meta-data/title/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-9.1

***

### description? {#description}

> `optional` **description**: `string`

Human-friendly schema description.

#### See

 - https://www.learnjsonschema.com/2020-12/meta-data/description/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-9.1

***

### type? {#type}

> `optional` **type**: `string` \| `string`[]

Constrain allowed JSON value types.

#### See

 - https://www.learnjsonschema.com/2020-12/validation/type/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.1.1

***

### properties? {#properties}

> `optional` **properties**: `object`

Property schemas for object members.

#### Index Signature

\[`id`: `string`\]: `IJsonSchema`

#### See

 - https://www.learnjsonschema.com/2020-12/applicator/properties/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-10.3.2.1

***

### patternProperties? {#patternproperties}

> `optional` **patternProperties**: `object`

Property schemas selected by regex on property names.

#### Index Signature

\[`pattern`: `string`\]: `IJsonSchema`

#### See

 - https://www.learnjsonschema.com/2020-12/applicator/patternproperties/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-10.3.2.2

***

### required? {#required}

> `optional` **required**: `string`[]

Object property names that must be present.

#### See

 - https://www.learnjsonschema.com/2020-12/validation/required/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.5.3

***

### dependentSchemas? {#dependentschemas}

> `optional` **dependentSchemas**: `object`

Property-level schema dependencies.

#### Index Signature

\[`property`: `string`\]: `IJsonSchema`

#### See

 - https://www.learnjsonschema.com/2020-12/applicator/dependentschemas/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-10.2.2.4

***

### dependentRequired? {#dependentrequired}

> `optional` **dependentRequired**: `object`

Property-level required-key dependencies.

#### Index Signature

\[`property`: `string`\]: `string`[]

#### See

 - https://www.learnjsonschema.com/2020-12/validation/dependentrequired/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.5.4

***

### items? {#items}

> `optional` **items**: `boolean` \| `IJsonSchema`

Schema for array items (or boolean form).

#### See

 - https://www.learnjsonschema.com/2020-12/applicator/items/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-10.3.1.2

***

### prefixItems? {#prefixitems}

> `optional` **prefixItems**: `IJsonSchema`[]

Tuple-style schemas for leading array positions.

#### See

 - https://www.learnjsonschema.com/2020-12/applicator/prefixitems/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-10.3.1.1

***

### additionalProperties? {#additionalproperties}

> `optional` **additionalProperties**: `boolean` \| `IJsonSchema`

Schema for properties not listed in properties/patternProperties.

#### See

 - https://www.learnjsonschema.com/2020-12/applicator/additionalproperties/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-10.3.2.3

***

### anyOf? {#anyof}

> `optional` **anyOf**: `IJsonSchema`[]

Union where at least one branch schema must match.

#### See

 - https://www.learnjsonschema.com/2020-12/applicator/anyof/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-10.2.1.2

***

### allOf? {#allof}

> `optional` **allOf**: `IJsonSchema`[]

Intersection where all branch schemas must match.

#### See

 - https://www.learnjsonschema.com/2020-12/applicator/allof/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-10.2.1.1

***

### oneOf? {#oneof}

> `optional` **oneOf**: `IJsonSchema`[]

Exactly one branch schema must match.

#### See

 - https://www.learnjsonschema.com/2020-12/applicator/oneof/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-10.2.1.3

***

### not? {#not}

> `optional` **not**: `IJsonSchema`

Negated schema condition.

#### See

 - https://www.learnjsonschema.com/2020-12/applicator/not/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-10.2.1.4

***

### if? {#if}

> `optional` **if**: `IJsonSchema`

Condition schema for conditional application.

#### See

 - https://www.learnjsonschema.com/2020-12/applicator/if/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-10.2.2.1

***

### then? {#then}

> `optional` **then**: `IJsonSchema`

Schema applied when if matches.

#### See

 - https://www.learnjsonschema.com/2020-12/applicator/then/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-10.2.2.2

***

### else? {#else}

> `optional` **else**: `IJsonSchema`

Schema applied when if does not match.

#### See

 - https://www.learnjsonschema.com/2020-12/applicator/else/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-10.2.2.3

***

### contains? {#contains}

> `optional` **contains**: `IJsonSchema`

Array must contain at least one matching item.

#### See

 - https://www.learnjsonschema.com/2020-12/applicator/contains/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-10.3.1.3

***

### propertyNames? {#propertynames}

> `optional` **propertyNames**: `IJsonSchema`

Schema for validating object property names.

#### See

 - https://www.learnjsonschema.com/2020-12/applicator/propertynames/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-10.3.2.4

***

### const? {#const}

> `optional` **const**: `unknown`

Single fixed value constraint.

#### See

 - https://www.learnjsonschema.com/2020-12/validation/const/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.1.3

***

### enum? {#enum}

> `optional` **enum**: `unknown`[]

Enumerated set of allowed values.

#### See

 - https://www.learnjsonschema.com/2020-12/validation/enum/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.1.2

***

### examples? {#examples}

> `optional` **examples**: `unknown`[]

Example instances for documentation tooling.

#### See

 - https://www.learnjsonschema.com/2020-12/meta-data/examples/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-9.5

***

### default? {#default}

> `optional` **default**: `unknown`

Suggested default instance value.

#### See

 - https://www.learnjsonschema.com/2020-12/meta-data/default/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-9.2

***

### format? {#format}

> `optional` **format**: `string`

Semantic format annotation.

#### See

 - https://www.learnjsonschema.com/2020-12/format-annotation/format/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-7.1

***

### pattern? {#pattern}

> `optional` **pattern**: `string`

Regular expression that strings must match.

#### See

 - https://www.learnjsonschema.com/2020-12/validation/pattern/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.3.3

***

### contentEncoding? {#contentencoding}

> `optional` **contentEncoding**: `string`

Content encoding annotation for string instances.

#### See

 - https://www.learnjsonschema.com/2020-12/content/contentencoding/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-8.3

***

### contentMediaType? {#contentmediatype}

> `optional` **contentMediaType**: `string`

Media type annotation for string content.

#### See

 - https://www.learnjsonschema.com/2020-12/content/contentmediatype/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-8.4

***

### contentSchema? {#contentschema}

> `optional` **contentSchema**: `IJsonSchema`

Schema for the decoded content payload.

#### See

 - https://www.learnjsonschema.com/2020-12/content/contentschema/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-8.5

***

### readOnly? {#readonly}

> `optional` **readOnly**: `boolean`

Annotation indicating read-only semantics.

#### See

 - https://www.learnjsonschema.com/2020-12/meta-data/readonly/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-9.4

***

### writeOnly? {#writeonly}

> `optional` **writeOnly**: `boolean`

Annotation indicating write-only semantics.

#### See

 - https://www.learnjsonschema.com/2020-12/meta-data/writeonly/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-9.4

***

### deprecated? {#deprecated}

> `optional` **deprecated**: `boolean`

Annotation indicating deprecation.

#### See

 - https://www.learnjsonschema.com/2020-12/meta-data/deprecated/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-9.3

***

### discriminator? {#discriminator}

> `optional` **discriminator**: `object`

Non-standard extension used by some tooling ecosystems.

#### propertyName

> **propertyName**: `string`

***

### minLength? {#minlength}

> `optional` **minLength**: `number`

Minimum length for strings.

#### See

 - https://www.learnjsonschema.com/2020-12/validation/minlength/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.3.2

***

### maxLength? {#maxlength}

> `optional` **maxLength**: `number`

Maximum length for strings.

#### See

 - https://www.learnjsonschema.com/2020-12/validation/maxlength/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.3.1

***

### minimum? {#minimum}

> `optional` **minimum**: `number`

Inclusive lower numeric bound.

#### See

 - https://www.learnjsonschema.com/2020-12/validation/minimum/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.2.4

***

### maximum? {#maximum}

> `optional` **maximum**: `number`

Inclusive upper numeric bound.

#### See

 - https://www.learnjsonschema.com/2020-12/validation/maximum/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.2.2

***

### exclusiveMinimum? {#exclusiveminimum}

> `optional` **exclusiveMinimum**: `number`

Exclusive lower numeric bound.

#### See

 - https://www.learnjsonschema.com/2020-12/validation/exclusiveminimum/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.2.5

***

### exclusiveMaximum? {#exclusivemaximum}

> `optional` **exclusiveMaximum**: `number`

Exclusive upper numeric bound.

#### See

 - https://www.learnjsonschema.com/2020-12/validation/exclusivemaximum/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.2.3

***

### multipleOf? {#multipleof}

> `optional` **multipleOf**: `number`

Numeric divisor constraint.

#### See

 - https://www.learnjsonschema.com/2020-12/validation/multipleof/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.2.1

***

### minItems? {#minitems}

> `optional` **minItems**: `number`

Minimum array length.

#### See

 - https://www.learnjsonschema.com/2020-12/validation/minitems/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.4.2

***

### maxItems? {#maxitems}

> `optional` **maxItems**: `number`

Maximum array length.

#### See

 - https://www.learnjsonschema.com/2020-12/validation/maxitems/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.4.1

***

### uniqueItems? {#uniqueitems}

> `optional` **uniqueItems**: `boolean`

Require array elements to be unique.

#### See

 - https://www.learnjsonschema.com/2020-12/validation/uniqueitems/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.4.3

***

### minProperties? {#minproperties}

> `optional` **minProperties**: `number`

Minimum number of object properties.

#### See

 - https://www.learnjsonschema.com/2020-12/validation/minproperties/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.5.2

***

### maxProperties? {#maxproperties}

> `optional` **maxProperties**: `number`

Maximum number of object properties.

#### See

 - https://www.learnjsonschema.com/2020-12/validation/maxproperties/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.5.1

***

### minContains? {#mincontains}

> `optional` **minContains**: `number`

Minimum number of contains matches.

#### See

 - https://www.learnjsonschema.com/2020-12/validation/mincontains/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.4.5

***

### maxContains? {#maxcontains}

> `optional` **maxContains**: `number`

Maximum number of contains matches.

#### See

 - https://www.learnjsonschema.com/2020-12/validation/maxcontains/
 - https://json-schema.org/draft/2020-12/json-schema-validation#section-6.4.4

***

### unevaluatedItems? {#unevaluateditems}

> `optional` **unevaluatedItems**: `boolean` \| `IJsonSchema`

Schema applied to array items not yet evaluated by adjacent applicators.

#### See

 - https://www.learnjsonschema.com/2020-12/unevaluated/unevaluateditems/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-11.2

***

### unevaluatedProperties? {#unevaluatedproperties}

> `optional` **unevaluatedProperties**: `boolean` \| `IJsonSchema`

Schema applied to object properties not yet evaluated by adjacent applicators.

#### See

 - https://www.learnjsonschema.com/2020-12/unevaluated/unevaluatedproperties/
 - https://json-schema.org/draft/2020-12/json-schema-core#section-11.3
