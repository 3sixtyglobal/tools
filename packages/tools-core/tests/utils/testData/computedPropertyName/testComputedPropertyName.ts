// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

const keyLiteral = "literalKey" as const;
const keyNumber = 7 as const;
const keyPrefix = "pre" as const;
const keySuffix = "fix" as const;
const keyTemplate = `${keyPrefix}_${keySuffix}` as const;
const keyInlineTemplate = `value_${"x"}` as const;

/**
 * Test computable and non-computable computed property names.
 */
export interface TestComputedPropertyName {
	/**
	 * A key resolved from a const identifier.
	 */
	[keyLiteral]: string;

	/**
	 * A key resolved from a const numeric identifier.
	 */
	[keyNumber]: number;

	/**
	 * A key resolved from a template literal with const spans.
	 */
	[keyTemplate]: boolean;

	/**
	 * A key resolved from an inline string literal.
	 */
	["inlineLiteral"]: string;

	/**
	 * A key resolved from an inline template literal expression.
	 */
	[keyInlineTemplate]: string;

	/**
	 * Non-computable symbol key should be skipped.
	 */
	[Symbol.iterator]: string;
}
