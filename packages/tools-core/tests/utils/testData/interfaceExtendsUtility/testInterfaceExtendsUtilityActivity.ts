// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { ObjectOrArray } from "@twin.org/core";
import type { IJsonLdLanguageMap } from "../jsonLd/IJsonLdLanguageMap.js";
import type { IJsonLdNodeObject } from "../jsonLd/IJsonLdNodeObject.js";
import type { JsonLdObjectWithContext } from "../jsonLdUtilityType/jsonLdUtilities.js";

/**
 * Activity base interface with optional object.
 */
export interface IActivityBase {
	/**
	 * The LD Context.
	 */
	"@context": string;
	/**
	 * Activity Type.
	 */
	type: ObjectOrArray<string>;
	/**
	 * The generator of the Activity.
	 */
	generator?: ObjectOrArray<string | IJsonLdNodeObject>;
	/**
	 * The Actor behind the Activity.
	 */
	actor?: ObjectOrArray<string | IJsonLdNodeObject>;
	/**
	 * The object affected by the Activity.
	 */
	object?: ObjectOrArray<string | IJsonLdNodeObject>;
	/**
	 * The target of the Activity.
	 */
	target?: ObjectOrArray<string | IJsonLdNodeObject>;
	/**
	 * Summary of the Activity.
	 */
	summary?: string | IJsonLdLanguageMap;
	/**
	 * Result of the Activity.
	 */
	result?: ObjectOrArray<string | IJsonLdNodeObject>;
	/**
	 * Activity's origin.
	 */
	origin?: ObjectOrArray<string | IJsonLdNodeObject>;
	/**
	 * Instrument used in the Activity.
	 */
	instrument?: ObjectOrArray<string | IJsonLdNodeObject>;
}

/**
 * Activity interface that makes object required and more concrete.
 */
export interface IActivity<O extends object = object, T extends object = object> extends Omit<
	IActivityBase,
	"object"
> {
	/**
	 * Activity's Object.
	 */
	object: ObjectOrArray<JsonLdObjectWithContext<O & { type: ObjectOrArray<string> }>>;

	/**
	 * Activity's target.
	 */
	target?: JsonLdObjectWithContext<T & { type: ObjectOrArray<string> }>;
}
