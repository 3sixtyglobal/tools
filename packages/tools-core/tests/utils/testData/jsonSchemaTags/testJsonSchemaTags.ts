// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Example using @json-schema tags.
 * @json-schema title:CustomJsonSchemaTagsTest
 * @json-schema description:Custom description from json-schema tags.
 * @json-schema id:https://schema.3sixty.global/test/CustomJsonSchemaTagsTest
 * @json-schema comment:Schema comment from json-schema tags.
 */
export interface JsonSchemaTagsTest {
	/**
	 * Timestamp in RFC 3339 format.
	 * @json-schema format:date-time
	 */
	formatTag?: string;

	/**
	 * Uppercase-only string pattern.
	 * @json-schema pattern:^[A-Z]+$
	 */
	patternTag?: string;

	/**
	 * Reference to a local definition.
	 * @json-schema ref:#/$defs/MyRef
	 */
	refTag?: string;

	/**
	 * Declares the media type for string content.
	 * @json-schema contentMediaType:application/json
	 */
	contentMediaTypeTag?: string;

	/**
	 * Declares the content encoding for string content.
	 * @json-schema contentEncoding:base64
	 */
	contentEncodingTag?: string;

	/**
	 * @json-schema discriminator:{"propertyName":"kind"}
	 */
	discriminatorTag?: string;

	/**
	 * @json-schema minimum:1
	 */
	minimumTag?: number;

	/**
	 * @json-schema exclusiveMinimum:0
	 */
	exclusiveMinimumTag?: number;

	/**
	 * @json-schema maximum:100
	 */
	maximumTag?: number;

	/**
	 * @json-schema exclusiveMaximum:101
	 */
	exclusiveMaximumTag?: number;

	/**
	 * @json-schema multipleOf:5
	 */
	multipleOfTag?: number;

	/**
	 * @json-schema minLength:2
	 */
	minLengthTag?: string;

	/**
	 * @json-schema maxLength:10
	 */
	maxLengthTag?: string;

	/**
	 * @json-schema minProperties:1
	 */
	minPropertiesTag?: { [id: string]: string };

	/**
	 * @json-schema maxProperties:3
	 */
	maxPropertiesTag?: { [id: string]: string };

	/**
	 * @json-schema minItems:1
	 */
	minItemsTag?: string[];

	/**
	 * @json-schema maxItems:4
	 */
	maxItemsTag?: string[];

	/**
	 * @json-schema uniqueItems:true
	 */
	uniqueItemsTag?: string[];

	/**
	 * @json-schema propertyNames:{"type":"string","pattern":"^[a-z]+$"}
	 */
	propertyNamesTag?: { [id: string]: string };

	/**
	 * @json-schema contains:{"type":"number"}
	 */
	containsTag?: (string | number)[];

	/**
	 * @json-schema not:{"const":"blocked"}
	 */
	notTag?: string;

	/**
	 * @json-schema contains:{"type":"number"}
	 * @json-schema minContains:1
	 */
	minContainsTag?: (string | number)[];

	/**
	 * @json-schema contains:{"type":"number"}
	 * @json-schema maxContains:2
	 */
	maxContainsTag?: (string | number)[];

	/**
	 * @json-schema const:"fixed"
	 */
	constTag?: string;

	/**
	 * @json-schema examples:["a","b"]
	 */
	examplesTag?: string;

	/**
	 * @json-schema default:"fallback"
	 */
	defaultTag?: string;

	/**
	 * @default "jsdoc-fallback"
	 */
	jsDocDefaultTag?: string;

	/**
	 * @default 42
	 */
	jsDocDefaultNumberTag?: number;

	/**
	 * @json-schema if:{"type":"string"}
	 */
	ifTag?: string;

	/**
	 * @json-schema then:{"minLength":3}
	 */
	thenTag?: string;

	/**
	 * @json-schema else:{"maxLength":2}
	 */
	elseTag?: string;

	/**
	 * @json-schema readOnly:true
	 */
	readOnlyTag?: string;

	/**
	 * @json-schema writeOnly:true
	 */
	writeOnlyTag?: string;

	/**
	 * Field marked as deprecated.
	 * @json-schema deprecated:true
	 */
	deprecatedTag?: string;

	/**
	 * Schema describing decoded content payload.
	 * @json-schema contentSchema:{"type":"object","required":["value"]}
	 */
	contentSchemaTag?: string;

	/**
	 * @json-schema title:OverriddenPropertyTitle
	 */
	titleTag?: string;

	/**
	 * @json-schema description:Overridden property description.
	 */
	descriptionTag?: string;

	/**
	 * @json-schema id:https://schema.3sixty.global/test/property-id
	 */
	idTag?: string;
}
