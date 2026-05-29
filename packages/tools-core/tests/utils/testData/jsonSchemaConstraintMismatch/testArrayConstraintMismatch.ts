// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Example applying an array constraint to a non-array property.
 */
export interface TestArrayConstraintMismatch {
	/**
	 * A string property incorrectly annotated with minItems.
	 * @json-schema minItems:1
	 */
	label: string;
}
