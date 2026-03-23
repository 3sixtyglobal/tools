// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Example applying an object constraint to a non-object property.
 */
export interface TestObjectConstraintMismatch {
	/**
	 * A string property incorrectly annotated with minProperties.
	 * @json-schema minProperties:1
	 */
	label: string;
}
