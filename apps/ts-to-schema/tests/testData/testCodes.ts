// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Test codes defined by an as const object.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const TestCodes = {
	/**
	 * The first code.
	 */
	First: "first",

	/**
	 * The second code.
	 */
	Second: "second"
} as const;

/**
 * Test codes defined by an as const object.
 */
export type TestCodes = (typeof TestCodes)[keyof typeof TestCodes];
