// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

const uniqueKey: unique symbol = Symbol("uniqueKey");

/**
 * Test symbol-typed property values and symbol-keyed members.
 * Symbol-based members should be skipped with diagnostics.
 */
export interface TestSymbolType {
	/**
	 * A regular string property that should appear in the schema.
	 */
	regularString: string;

	/**
	 * A symbol-typed property — should be skipped with a symbolValuedProperty diagnostic.
	 */
	symbolTyped: symbol;

	/**
	 * A well-known symbol key — should be skipped with a symbolKeyedMember diagnostic.
	 */
	[Symbol.iterator]: string;

	/**
	 * A unique symbol const key — should be skipped with a symbolKeyedMember diagnostic.
	 */
	[uniqueKey]: boolean;

	/**
	 * A regular number property that should appear in the schema.
	 */
	regularNumber: number;
}
