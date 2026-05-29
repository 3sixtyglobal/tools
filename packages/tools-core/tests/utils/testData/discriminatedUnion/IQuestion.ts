// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IQuestionAnyOfChoice } from "./IQuestionAnyOfChoice.js";
import type { IQuestionBase } from "./IQuestionBase.js";
import type { IQuestionNeitherChoice } from "./IQuestionNeitherChoice.js";
import type { IQuestionOneOfChoice } from "./IQuestionOneOfChoice.js";

/**
 * A W3C Activity Streams Question.
 *
 * A `Question` represents a question being asked. Use `oneOf` for exclusive
 * choices, `anyOf` for inclusive choices, and `closed` to indicate when the question
 * is closed.
 * @see https://www.w3.org/TR/-vocabulary/#dfn-question
 */
export type IQuestion = IQuestionBase &
	(IQuestionAnyOfChoice | IQuestionOneOfChoice | IQuestionNeitherChoice);

const a: IQuestion = { closed: true };
const b: IQuestion = { anyOf: ["Option 1", "Option 2"] };
const c: IQuestion = { oneOf: ["Option A", "Option B"] };
const d: IQuestion = { closed: "2026-12-31T23:59:59Z", anyOf: ["Yes", "No"] };

console.log(a.closed, b.anyOf, c.oneOf, d.closed, d.anyOf);
