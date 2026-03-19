// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * JSON schema representation used by the TypeScript conversion utilities.
 * @see https://json-schema.org/draft/2020-12/json-schema-core
 */
export interface IJsonSchema {
	/**
	 * Dialect URI for the schema document.
	 * @see https://www.learnjsonschema.com/2020-12/core/schema/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-8.1.1
	 */
	$schema?: string;

	/**
	 * Canonical identifier for the schema resource.
	 * @see https://www.learnjsonschema.com/2020-12/core/id/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-8.2.1
	 */
	$id?: string;

	/**
	 * Reference to another schema resource.
	 * @see https://www.learnjsonschema.com/2020-12/core/ref/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-8.2.3.1
	 */
	$ref?: string;

	/**
	 * Location-independent identifier fragment.
	 * @see https://www.learnjsonschema.com/2020-12/core/anchor/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-8.2.2
	 */
	$anchor?: string;

	/**
	 * Runtime-resolved dynamic schema reference.
	 * @see https://www.learnjsonschema.com/2020-12/core/dynamicref/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-8.2.3.2
	 */
	$dynamicRef?: string;

	/**
	 * Dynamic extension point anchor.
	 * @see https://www.learnjsonschema.com/2020-12/core/dynamicanchor/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-8.2.2
	 */
	$dynamicAnchor?: string;

	/**
	 * Declares vocabularies for a meta-schema dialect.
	 * @see https://www.learnjsonschema.com/2020-12/core/vocabulary/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-8.1.2
	 */
	$vocabulary?: { [uri: string]: boolean };

	/**
	 * Maintainer comment for tools.
	 * @see https://www.learnjsonschema.com/2020-12/core/comment/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-8.3
	 */
	$comment?: string;

	/**
	 * Reusable inlined schema definitions.
	 * @see https://www.learnjsonschema.com/2020-12/core/defs/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-8.2.4
	 */
	$defs?: { [id: string]: IJsonSchema };

	/**
	 * Human-friendly schema title.
	 * @see https://www.learnjsonschema.com/2020-12/meta-data/title/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-9.1
	 */
	title?: string;

	/**
	 * Human-friendly schema description.
	 * @see https://www.learnjsonschema.com/2020-12/meta-data/description/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-9.1
	 */
	description?: string;

	/**
	 * Constrain allowed JSON value types.
	 * @see https://www.learnjsonschema.com/2020-12/validation/type/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.1.1
	 */
	type?: string | string[];

	/**
	 * Property schemas for object members.
	 * @see https://www.learnjsonschema.com/2020-12/applicator/properties/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-10.3.2.1
	 */
	properties?: { [id: string]: IJsonSchema };

	/**
	 * Property schemas selected by regex on property names.
	 * @see https://www.learnjsonschema.com/2020-12/applicator/patternproperties/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-10.3.2.2
	 */
	patternProperties?: { [pattern: string]: IJsonSchema };

	/**
	 * Object property names that must be present.
	 * @see https://www.learnjsonschema.com/2020-12/validation/required/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.5.3
	 */
	required?: string[];

	/**
	 * Property-level schema dependencies.
	 * @see https://www.learnjsonschema.com/2020-12/applicator/dependentschemas/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-10.2.2.4
	 */
	dependentSchemas?: { [property: string]: IJsonSchema };

	/**
	 * Property-level required-key dependencies.
	 * @see https://www.learnjsonschema.com/2020-12/validation/dependentrequired/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.5.4
	 */
	dependentRequired?: { [property: string]: string[] };

	/**
	 * Schema for array items (or boolean form).
	 * @see https://www.learnjsonschema.com/2020-12/applicator/items/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-10.3.1.2
	 */
	items?: IJsonSchema | boolean;

	/**
	 * Tuple-style schemas for leading array positions.
	 * @see https://www.learnjsonschema.com/2020-12/applicator/prefixitems/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-10.3.1.1
	 */
	prefixItems?: IJsonSchema[];

	/**
	 * Schema for properties not listed in properties/patternProperties.
	 * @see https://www.learnjsonschema.com/2020-12/applicator/additionalproperties/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-10.3.2.3
	 */
	additionalProperties?: IJsonSchema | boolean;

	/**
	 * Union where at least one branch schema must match.
	 * @see https://www.learnjsonschema.com/2020-12/applicator/anyof/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-10.2.1.2
	 */
	anyOf?: IJsonSchema[];

	/**
	 * Intersection where all branch schemas must match.
	 * @see https://www.learnjsonschema.com/2020-12/applicator/allof/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-10.2.1.1
	 */
	allOf?: IJsonSchema[];

	/**
	 * Exactly one branch schema must match.
	 * @see https://www.learnjsonschema.com/2020-12/applicator/oneof/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-10.2.1.3
	 */
	oneOf?: IJsonSchema[];

	/**
	 * Negated schema condition.
	 * @see https://www.learnjsonschema.com/2020-12/applicator/not/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-10.2.1.4
	 */
	not?: IJsonSchema;

	/**
	 * Condition schema for conditional application.
	 * @see https://www.learnjsonschema.com/2020-12/applicator/if/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-10.2.2.1
	 */
	if?: IJsonSchema;

	/**
	 * Schema applied when if matches.
	 * @see https://www.learnjsonschema.com/2020-12/applicator/then/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-10.2.2.2
	 */
	then?: IJsonSchema;

	/**
	 * Schema applied when if does not match.
	 * @see https://www.learnjsonschema.com/2020-12/applicator/else/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-10.2.2.3
	 */
	else?: IJsonSchema;

	/**
	 * Array must contain at least one matching item.
	 * @see https://www.learnjsonschema.com/2020-12/applicator/contains/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-10.3.1.3
	 */
	contains?: IJsonSchema;

	/**
	 * Schema for validating object property names.
	 * @see https://www.learnjsonschema.com/2020-12/applicator/propertynames/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-10.3.2.4
	 */
	propertyNames?: IJsonSchema;

	/**
	 * Single fixed value constraint.
	 * @see https://www.learnjsonschema.com/2020-12/validation/const/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.1.3
	 */
	const?: unknown;

	/**
	 * Enumerated set of allowed values.
	 * @see https://www.learnjsonschema.com/2020-12/validation/enum/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.1.2
	 */
	enum?: unknown[];

	/**
	 * Example instances for documentation tooling.
	 * @see https://www.learnjsonschema.com/2020-12/meta-data/examples/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-9.5
	 */
	examples?: unknown[];

	/**
	 * Suggested default instance value.
	 * @see https://www.learnjsonschema.com/2020-12/meta-data/default/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-9.2
	 */
	default?: unknown;

	/**
	 * Semantic format annotation.
	 * @see https://www.learnjsonschema.com/2020-12/format-annotation/format/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-7.1
	 */
	format?: string;

	/**
	 * Regular expression that strings must match.
	 * @see https://www.learnjsonschema.com/2020-12/validation/pattern/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.3.3
	 */
	pattern?: string;

	/**
	 * Content encoding annotation for string instances.
	 * @see https://www.learnjsonschema.com/2020-12/content/contentencoding/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-8.3
	 */
	contentEncoding?: string;

	/**
	 * Media type annotation for string content.
	 * @see https://www.learnjsonschema.com/2020-12/content/contentmediatype/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-8.4
	 */
	contentMediaType?: string;

	/**
	 * Schema for the decoded content payload.
	 * @see https://www.learnjsonschema.com/2020-12/content/contentschema/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-8.5
	 */
	contentSchema?: IJsonSchema;

	/**
	 * Annotation indicating read-only semantics.
	 * @see https://www.learnjsonschema.com/2020-12/meta-data/readonly/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-9.4
	 */
	readOnly?: boolean;

	/**
	 * Annotation indicating write-only semantics.
	 * @see https://www.learnjsonschema.com/2020-12/meta-data/writeonly/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-9.4
	 */
	writeOnly?: boolean;

	/**
	 * Annotation indicating deprecation.
	 * @see https://www.learnjsonschema.com/2020-12/meta-data/deprecated/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-9.3
	 */
	deprecated?: boolean;

	/**
	 * Non-standard extension used by some tooling ecosystems.
	 */
	discriminator?: {
		propertyName: string;
	};

	/**
	 * Minimum length for strings.
	 * @see https://www.learnjsonschema.com/2020-12/validation/minlength/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.3.2
	 */
	minLength?: number;

	/**
	 * Maximum length for strings.
	 * @see https://www.learnjsonschema.com/2020-12/validation/maxlength/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.3.1
	 */
	maxLength?: number;

	/**
	 * Inclusive lower numeric bound.
	 * @see https://www.learnjsonschema.com/2020-12/validation/minimum/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.2.4
	 */
	minimum?: number;

	/**
	 * Inclusive upper numeric bound.
	 * @see https://www.learnjsonschema.com/2020-12/validation/maximum/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.2.2
	 */
	maximum?: number;

	/**
	 * Exclusive lower numeric bound.
	 * @see https://www.learnjsonschema.com/2020-12/validation/exclusiveminimum/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.2.5
	 */
	exclusiveMinimum?: number;

	/**
	 * Exclusive upper numeric bound.
	 * @see https://www.learnjsonschema.com/2020-12/validation/exclusivemaximum/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.2.3
	 */
	exclusiveMaximum?: number;

	/**
	 * Numeric divisor constraint.
	 * @see https://www.learnjsonschema.com/2020-12/validation/multipleof/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.2.1
	 */
	multipleOf?: number;

	/**
	 * Minimum array length.
	 * @see https://www.learnjsonschema.com/2020-12/validation/minitems/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.4.2
	 */
	minItems?: number;

	/**
	 * Maximum array length.
	 * @see https://www.learnjsonschema.com/2020-12/validation/maxitems/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.4.1
	 */
	maxItems?: number;

	/**
	 * Require array elements to be unique.
	 * @see https://www.learnjsonschema.com/2020-12/validation/uniqueitems/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.4.3
	 */
	uniqueItems?: boolean;

	/**
	 * Minimum number of object properties.
	 * @see https://www.learnjsonschema.com/2020-12/validation/minproperties/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.5.2
	 */
	minProperties?: number;

	/**
	 * Maximum number of object properties.
	 * @see https://www.learnjsonschema.com/2020-12/validation/maxproperties/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.5.1
	 */
	maxProperties?: number;

	/**
	 * Minimum number of contains matches.
	 * @see https://www.learnjsonschema.com/2020-12/validation/mincontains/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.4.5
	 */
	minContains?: number;

	/**
	 * Maximum number of contains matches.
	 * @see https://www.learnjsonschema.com/2020-12/validation/maxcontains/
	 * @see https://json-schema.org/draft/2020-12/json-schema-validation#section-6.4.4
	 */
	maxContains?: number;

	/**
	 * Schema applied to array items not yet evaluated by adjacent applicators.
	 * @see https://www.learnjsonschema.com/2020-12/unevaluated/unevaluateditems/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-11.2
	 */
	unevaluatedItems?: IJsonSchema | boolean;

	/**
	 * Schema applied to object properties not yet evaluated by adjacent applicators.
	 * @see https://www.learnjsonschema.com/2020-12/unevaluated/unevaluatedproperties/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-11.3
	 */
	unevaluatedProperties?: IJsonSchema | boolean;

	/**
	 * Allow additional extension keywords.
	 * @see https://www.learnjsonschema.com/2020-12/
	 * @see https://json-schema.org/draft/2020-12/json-schema-core#section-4.3.1
	 */
	// eslint-disable-next-line @typescript-eslint/member-ordering
	[key: string]: unknown;
}
