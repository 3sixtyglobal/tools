// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Mixed optional and required props.
 */
export interface TestOptionalProps {
	/**
	 * Required string.
	 */
	requiredName: string;

	/**
	 * Optional numeric value.
	 */
	optionalCount?: number;

	/**
	 * Required boolean.
	 */
	isEnabled: boolean;
}
