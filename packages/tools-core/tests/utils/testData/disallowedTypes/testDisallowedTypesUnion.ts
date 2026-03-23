// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Disallowed types inside union branches should still throw.
 */
export interface TestDisallowedTypesUnion {
	/**
	 * Disallowed bigint literal branch.
	 */
	bigIntLiteralUnion: 1n | 2n;

	/**
	 * Allowed branch plus disallowed bigint keyword branch.
	 */
	bigIntUnion: string | bigint;

	/**
	 * Allowed branch plus disallowed Date branch.
	 */
	dateUnion: number | Date;
}
