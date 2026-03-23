// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Types in this model are intentionally unsupported.
 */
export interface TestDisallowedTypes {
	/**
	 * Disallowed date/time alias.
	 */
	dateTimeValue: Date;

	/**
	 * Disallowed regular-expression alias.
	 */
	regExValue: RegExp;

	/**
	 * Disallowed function type reference.
	 */
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	functionValue: Function;

	/**
	 * Disallowed bigint keyword.
	 */
	bigIntValue: bigint;
}
