// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The test enum as const.
 */
export const TestEnumAsConst = {
	/**
	 * OK.
	 */
	Ok: "ok",

	/**
	 * Warning.
	 */
	Warning: "warning",

	/**
	 * Error.
	 */
	Error: "error"
} as const;

/**
 * The test enum as const.
 */
export type TestEnumAsConst = (typeof TestEnumAsConst)[keyof typeof TestEnumAsConst];
