// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { ObjectOrArray } from "@twin.org/core";

/**
 * Represents a Question with an exclusive list of possible answers, but not an inclusive list.
 */
export interface IQuestionOneOfChoice {
	/**
	 * Specifies an inclusive list of possible answers.
	 */
	anyOf?: never;

	/**
	 * Specifies an exclusive list of possible answers.
	 */
	oneOf: ObjectOrArray<string>;
}
