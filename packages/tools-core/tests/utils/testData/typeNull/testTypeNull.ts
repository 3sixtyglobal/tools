// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Test null type handling.
 */
export interface TestTypeNull {
	/**
	 * Can be a string or null.
	 */
	nullableString: string | null;

	/**
	 * Must be null.
	 */
	nullOnly: null;
}
