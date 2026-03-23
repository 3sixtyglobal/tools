// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Two-branch never-discriminated object union.
 */
export type TwoWayChoice =
	| {
			alpha: string;
			beta?: never;
	  }
	| {
			alpha?: never;
			beta: number;
	  };

/**
 * Three-branch never-discriminated object union.
 */
export type ThreeWayChoice =
	| {
			first: boolean;
			second?: never;
			third?: never;
	  }
	| {
			first?: never;
			second: string;
			third?: never;
	  }
	| {
			first?: never;
			second?: never;
			third: number;
	  };

/**
 * Test oneOf discrimination for 2 and 3 union branches.
 */
export interface TestOneOfDiscrimination {
	/**
	 * Two-way discriminated union.
	 */
	twoWay: TwoWayChoice;

	/**
	 * Three-way discriminated union.
	 */
	threeWay: ThreeWayChoice;
}
