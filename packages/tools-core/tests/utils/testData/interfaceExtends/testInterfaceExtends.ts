// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Derived interface extending multiple base interfaces.
 */
export interface ITestInterface extends ITestInterfaceBaseA, ITestInterfaceBaseB {
	/**
	 * Derived interface identifier.
	 */
	id: string;
}

/**
 * Base interface A.
 */
export interface ITestInterfaceBaseA {
	/**
	 * Base A field.
	 */
	baseA: string;
}

/**
 * Base interface B.
 */
export interface ITestInterfaceBaseB {
	/**
	 * Base B field.
	 */
	baseB: number;
}
