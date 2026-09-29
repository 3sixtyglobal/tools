// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Test codes with integer like keys, which Object.values lists first.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const TestNumericCodes = {
	/**
	 * The named code.
	 */
	Named: "named",

	/**
	 * The numbered code.
	 */
	"10": "numbered"
} as const;

/**
 * Test codes with integer like keys, which Object.values lists first.
 */
export type TestNumericCodes = (typeof TestNumericCodes)[keyof typeof TestNumericCodes];
