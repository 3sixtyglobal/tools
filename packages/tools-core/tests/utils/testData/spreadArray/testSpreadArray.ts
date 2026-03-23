// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Array spread and tuple combinations.
 */
export interface SpreadTest {
	/**
	 * A simple homogeneous array.
	 */
	simple: string[];

	/**
	 * A homogeneous array with multiple primitive types.
	 */
	multiType: (string | number)[];

	/**
	 * A tuple with fixed prefix followed by spread items.
	 */
	spreadStart: [number, ...string[]];

	/**
	 * A tuple with spread items followed by a fixed suffix item.
	 */
	spreadEnd: [...string[], number];

	/**
	 * Mixed tuple/array union with spread combinations.
	 */
	spreadCombined: string | [string] | [number, string, ...number[]] | [...number[], string, number];

	/**
	 * Mixed tuple/array union with spread combinations using objects.
	 */
	spreadCombinedObject:
		| TestObjectA
		| [TestObjectA]
		| [TestObjectB, TestObjectA, ...TestObjectB[]]
		| [...TestObjectB[], TestObjectA, TestObjectB];
}

export interface TestObjectA {
	/**
	 * A simple title field.
	 */
	title: string;
}

export interface TestObjectB {
	/**
	 * A simple description field.
	 */
	description: string;
}
