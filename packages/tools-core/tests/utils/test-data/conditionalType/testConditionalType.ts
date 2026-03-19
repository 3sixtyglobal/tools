// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Conditional type resolving to object branches.
 */
export type ConditionalObject<T> = T extends string
	? {
			kind: "text";
			value: string;
		}
	: {
			kind: "numeric";
			value: number;
		};

/**
 * Conditional type resolving to primitive branches.
 */
export type ConditionalPrimitive<T> = T extends string ? string : number;

/**
 * Test conditional type handling.
 */
export interface TestConditionalType {
	/**
	 * Reference to object conditional type.
	 */
	objectResult: ConditionalObject<boolean>;

	/**
	 * Reference to primitive conditional type.
	 */
	primitiveResult: ConditionalPrimitive<boolean>;
}
