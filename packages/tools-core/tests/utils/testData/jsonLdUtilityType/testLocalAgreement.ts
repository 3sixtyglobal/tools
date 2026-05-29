// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Base agreement shape used to verify local import utility-base resolution.
 */
export interface ITestLocalAgreement {
	/**
	 * The JSON-LD context.
	 */
	"@context": string[];

	/**
	 * Identifier for the agreement.
	 */
	"@id": string;

	/**
	 * A test payload value.
	 */
	payload: number;
}
