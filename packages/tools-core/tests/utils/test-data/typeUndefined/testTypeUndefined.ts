// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Test undefined type handling.
 */
export interface TestTypeUndefined {
	/**
	 * Keeps the string branch and drops undefined.
	 */
	stringOrUndefined: string | undefined;

	/**
	 * Keeps the string branch and drops void.
	 */
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	stringOrVoid: string | void;

	/**
	 * Keeps the null branch and drops undefined.
	 */
	nullOrUndefined: null | undefined;

	/**
	 * Keeps the null branch and drops void.
	 */
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	nullOrVoid: null | void;

	/**
	 * Undefined-only properties are not representable in JSON Schema.
	 */
	undefinedOnly: undefined;

	/**
	 * Void-only properties are not representable in JSON Schema.
	 */
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	voidOnly: void;
}
