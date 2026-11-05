// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdExpandedTermDefinition } from "./IJsonLdExpandedTermDefinition.js";
import type { IJsonLdKeyword } from "./IJsonLdKeyword.js";

/**
 * This is a copy of the types from the npm jsonld package. This is necessary as the JSON schema generators
 * that are used in other packages cannot understand some of the types e.g. OrArray
 */

/**
 * A context definition defines a local context in a node object.
 * @see https://www.w3.org/TR/json-ld11/#context-definitions
 */
export interface IJsonLdContextDefinition {
	[key: string]:
		| null
		| string
		| IJsonLdExpandedTermDefinition
		| IJsonLdContextDefinition[keyof IJsonLdContextDefinition];

	"@base"?: IJsonLdKeyword["@base"];
	"@direction"?: IJsonLdKeyword["@direction"];
	"@import"?: IJsonLdKeyword["@import"];
	"@language"?: IJsonLdKeyword["@language"];
	"@propagate"?: IJsonLdKeyword["@propagate"];
	"@protected"?: IJsonLdKeyword["@protected"];
	"@type"?: {
		"@container": "@set";
		"@protected"?: IJsonLdKeyword["@protected"];
	};
	"@version"?: IJsonLdKeyword["@version"];
	"@vocab"?: IJsonLdKeyword["@vocab"];
}
