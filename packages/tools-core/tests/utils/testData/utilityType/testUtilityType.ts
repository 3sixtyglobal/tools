// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { ObjectOrArray, SingleOccurrenceArray } from "@3sixty/core";
import type { Person } from "./testUtilityPerson.js";

/**
 * Utility type wrapper using Partial, Omit, Required and Pick on an imported type.
 */

export interface TestUtilityType {
	/**
	 * Full person information.
	 */
	fullType: Person;

	/**
	 * Partial view of person information.
	 */
	partialType: Partial<Person>;

	/**
	 * Omitted view of person information.
	 */
	omitType: Omit<Person, "label">;

	/**
	 * Required view of person information.
	 */
	requiredType: Required<Person>;

	/**
	 * Picked view of person information.
	 */
	pickType: Pick<Person, "id" | "label">;

	/**
	 * Excluded view of person status.
	 */
	excludeType: Exclude<"walking" | "running" | "sleeping", "walking">;

	/**
	 * Excluded view of person object.
	 */
	excludeTypeObject: Exclude<{ a: string } | { b: string } | { c: string }, { b: string }>;

	/**
	 * Extracted view of person status.
	 */
	extractType: Extract<"walking" | "running" | "sleeping", "running" | "sleeping">;

	/**
	 * Extracted view of person object.
	 */
	extractTypeObject: Extract<
		{ a: string } | { b: string } | { c: string },
		{ b: string } | { c: string }
	>;

	/**
	 * Non-nullable view of person status.
	 */
	nonNullableType: NonNullable<"walking" | "running" | null | undefined>;

	/**
	 * Non-nullable view of person object.
	 */
	nonNullablePersonType: NonNullable<Person | null>;

	/**
	 * Record view with arbitrary string keys.
	 */
	recordStringNumberType: { [key: string]: number };

	/**
	 * Record view with fixed literal keys.
	 */
	// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
	recordFixedKeysType: Record<"id" | "label", string>;

	/**
	 * Record view of person objects.
	 */
	recordPersonType: { [key: string]: Person };

	/**
	 * Combined view of person information.
	 */
	combinedType: Omit<Pick<Person, "id" | "label">, "label">;

	/**
	 * Object or array of strings.
	 */
	objectOrArrayType: ObjectOrArray<string>;

	/**
	 * Object or array of persons.
	 */
	objectOrArrayPersonType: ObjectOrArray<Person>;

	/**
	 * Non-empty array of strings with a single number occurrence.
	 */
	singleOccurrenceArrayType: SingleOccurrenceArray<string, number>;

	/**
	 * Non-empty array of persons with a single string occurrence.
	 */
	singleOccurrenceArrayPersonType: SingleOccurrenceArray<Person, string>;
}
