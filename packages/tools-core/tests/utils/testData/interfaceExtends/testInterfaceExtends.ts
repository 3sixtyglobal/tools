// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Derived interface extending multiple base interfaces.
 */
export interface TestInterface extends TestInterfaceBaseA, TestInterfaceBaseB {
	/**
	 * Derived interface identifier.
	 */
	id: string;
}

/**
 * Base interface A.
 */
export interface TestInterfaceBaseA {
	/**
	 * Base A field.
	 */
	baseA: string;
}

/**
 * Base interface B.
 */
export interface TestInterfaceBaseB {
	/**
	 * Base B field.
	 */
	baseB: number;
}
