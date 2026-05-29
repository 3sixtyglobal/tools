// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Full person model for utility type tests.
 */
export interface Person {
	/**
	 * The unique identifier.
	 */
	id: string;

	/**
	 * The display label.
	 */
	label: string;

	/**
	 * Optional score in the source model.
	 */
	score?: number;
}
