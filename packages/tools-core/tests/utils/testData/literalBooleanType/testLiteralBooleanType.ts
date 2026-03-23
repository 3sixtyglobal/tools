// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Coverage for boolean literal type nodes — true and false as distinct const types rather than the broad boolean keyword.
 */
export interface TestLiteralBooleanType {
	/**
	 * Literal true type maps to a const true schema.
	 */
	trueLiteral: true;

	/**
	 * Literal false type maps to a const false schema.
	 */
	falseLiteral: false;
}
