// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { ObjectOrArray } from "@twin.org/core";

/**
 * Represents a Question with an inclusive list of possible answers, but not an exclusive list.
 */
export interface IQuestionAnyOfChoice {
	/**
	 * Specifies an inclusive list of possible answers.
	 */
	anyOf: ObjectOrArray<string>;

	/**
	 * Specifies an exclusive list of possible answers.
	 */
	oneOf?: never;
}
