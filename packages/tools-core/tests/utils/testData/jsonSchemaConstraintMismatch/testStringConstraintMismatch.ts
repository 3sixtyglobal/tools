// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Example applying a string constraint to a non-string property.
 */
export interface TestStringConstraintMismatch {
	/**
	 * A number property incorrectly annotated with minLength.
	 * @json-schema minLength:1
	 */
	count: number;
}
