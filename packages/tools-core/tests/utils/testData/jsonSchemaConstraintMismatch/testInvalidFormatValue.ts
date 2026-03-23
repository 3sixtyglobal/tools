// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Example applying an unrecognised format value to a string property.
 */
export interface TestInvalidFormatValue {
	/**
	 * A string property annotated with an invalid format value.
	 * @json-schema format:not-a-real-format
	 */
	label: string;
}
