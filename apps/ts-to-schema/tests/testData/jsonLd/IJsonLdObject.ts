// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdJsonObject } from "./IJsonLdJsonObject.js";
import type { IJsonLdKeyword } from "./IJsonLdKeyword.js";
import type { IJsonLdNodeObject } from "./IJsonLdNodeObject.js";

/**
 * This is a copy of the types from the npm jsonld package. This is necessary as the JSON schema generators
 * that are used in other packages cannot understand some of the types e.g. OrArray
 */

/**
 * An object represents the pre-defined properties of the node object
 * in the graph serialized by the JSON-LD document.
 * @see https://www.w3.org/TR/json-ld11/#node-objects
 */
export interface IJsonLdObject {
	"@context"?: IJsonLdKeyword["@context"];
	"@id"?: IJsonLdKeyword["@id"];
	"@included"?: IJsonLdKeyword["@included"];
	"@graph"?: IJsonLdNodeObject | IJsonLdNodeObject[];
	"@nest"?: IJsonLdJsonObject | IJsonLdJsonObject[];
	"@type"?: IJsonLdKeyword["@type"] | IJsonLdKeyword["@type"][];
	"@reverse"?: { [key: string]: IJsonLdKeyword["@reverse"] };
	"@index"?: IJsonLdKeyword["@index"];
}
