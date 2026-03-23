// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

interface TypeOperatorSource {
	id: string;
	label: string;
	score: number;
	optionalFlag?: boolean;
}

/**
 * Test readonly and keyof type operators.
 */
export interface TestTypeOperators {
	/**
	 * Readonly array should map as a regular array schema.
	 */
	readonlyArray: readonly string[];

	/**
	 * Keyof type literal should map to enum keys.
	 */
	keyofLiteral: keyof { id: string; label: number };

	/**
	 * Pick using keyof should include all source properties.
	 */
	pickFromKeyof: Pick<TypeOperatorSource, keyof TypeOperatorSource>;

	/**
	 * Omit using keyof should remove all source properties.
	 */
	omitFromKeyof: Omit<TypeOperatorSource, keyof TypeOperatorSource>;
}
