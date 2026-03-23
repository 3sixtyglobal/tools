// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Represents a Question with neither anyOf nor oneOf.
 */
export interface IQuestionNeitherChoice {
	/**
	 * Specifies an inclusive list of possible answers.
	 */
	anyOf?: never;

	/**
	 * Specifies an exclusive list of possible answers.
	 */
	oneOf?: never;
}
