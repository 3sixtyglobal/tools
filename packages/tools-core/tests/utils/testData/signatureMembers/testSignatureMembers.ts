// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Coverage for ignored method and call signatures.
 */
export interface TestSignatureMembers {
	/**
	 * Call signatures are intentionally ignored.
	 * @param input The input value.
	 * @returns The result.
	 */
	(input: string): number;

	/**
	 * Included property member.
	 */
	id: string;

	/**
	 * Method signatures are intentionally ignored.
	 * @param input The input value.
	 * @returns The result.
	 */
	execute(input: string): number;
}
