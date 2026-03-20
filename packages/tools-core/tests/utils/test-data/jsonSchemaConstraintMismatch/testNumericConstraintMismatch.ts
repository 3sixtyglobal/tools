// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Example applying a numeric constraint to a non-numeric property.
 */
export interface TestNumericConstraintMismatch {
	/**
	 * A string property incorrectly annotated with minimum.
	 * @json-schema minimum:0
	 */
	label: string;
}
