// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Branch with literal type discriminator alpha.
 */
interface IAlphaBranch {
	/**
	 * Branch discriminator.
	 */
	type: "alpha";

	/**
	 * Alpha payload.
	 */
	alphaValue: string;
}

/**
 * Branch with literal type discriminator beta.
 */
interface IBetaBranch {
	/**
	 * Branch discriminator.
	 */
	type: "beta";

	/**
	 * Beta payload.
	 */
	betaValue: number;
}

/**
 * Classic literal-tag discriminated union.
 */
export type TypeLiteralTagDiscriminatedUnion = IAlphaBranch | IBetaBranch;
