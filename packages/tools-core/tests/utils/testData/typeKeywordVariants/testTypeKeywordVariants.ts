// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Test object and boolean keyword variants.
 */
export interface TestTypeKeywordVariants {
	/**
	 * Object keyword should map to object type.
	 */
	objectKeyword: object;

	/**
	 * Boolean wrapper type should map to boolean type.
	 */
	// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
	booleanWrapper: Boolean;

	/**
	 * Object wrapper type should map to object type.
	 */
	// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
	objectWrapper: Object;

	/**
	 * Map should map to object additionalProperties.
	 */
	mapValue: Map<string, number>;

	/**
	 * Set should map to array with unique items.
	 */
	setValue: Set<string>;

	/**
	 * Template literal index signatures should map to patternProperties.
	 */
	templateIndexed: {
		[key: `x-${string}`]: number;
		[key: `id-${number}`]: string;
	};

	/**
	 * Additional template-literal index signatures should map to patternProperties.
	 */
	secondaryTemplateIndexed: {
		[key: `metric:${string}`]: boolean;
	};

	/**
	 * Named property alongside a patterned index yields a propertyNames guard.
	 */
	mixedNamedAndPatterned: {
		[key: `tag-${string}`]: boolean;
		/**
		 * Static id property.
		 */
		id: string;
	};

	/**
	 * Broad string index alongside patterned index - no propertyNames guard emitted.
	 */
	broadAndPatterned: {
		[key: string]: string | number;
		[key: `id-${string}`]: number;
	};
}
