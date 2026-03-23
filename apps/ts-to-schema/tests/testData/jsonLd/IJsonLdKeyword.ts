// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdContainerType } from "./IJsonLdContainerType.js";
import type { IJsonLdContainerTypeArray } from "./IJsonLdContainerTypeArray.js";
import type { IJsonLdContextDefinitionRoot } from "./IJsonLdContextDefinitionRoot.js";
import type { IJsonLdIncludedBlock } from "./IJsonLdIncludedBlock.js";
import type { IJsonLdListOrSetItem } from "./IJsonLdListOrSetItem.js";
import type { IJsonLdNodeObject } from "./IJsonLdNodeObject.js";
import type { IJsonLdValueObject } from "./IJsonLdValueObject.js";

/**
 * This is a copy of the types from the npm jsonld package. This is necessary as the JSON schema generators
 * that are used in other packages cannot understand some of the types e.g. OrArray
 */

/**
 * A list of keywords and their types.
 * Only used for internal reference; not an actual interface.
 * Not for export.
 * @see https://www.w3.org/TR/json-ld/#keywords
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type IJsonLdKeyword = {
	"@base": string | null;
	"@container":
		| ("@list" | "@set" | IJsonLdContainerType)
		| ("@list" | "@set" | IJsonLdContainerType)[]
		| IJsonLdContainerTypeArray
		| null;
	"@context": IJsonLdContextDefinitionRoot;
	"@direction": "ltr" | "rtl" | null;
	"@graph": IJsonLdValueObject | IJsonLdNodeObject | (IJsonLdValueObject | IJsonLdNodeObject)[];
	"@id": string | string[];
	"@import": string;
	"@included": IJsonLdIncludedBlock;
	"@index": string;
	"@json": "@json";
	"@language": string;
	"@list": IJsonLdListOrSetItem | IJsonLdListOrSetItem[];
	"@nest": object;
	"@none": "@none";
	"@prefix": boolean;
	"@propagate": boolean;
	"@protected": boolean;
	"@reverse": string;
	"@set": IJsonLdListOrSetItem | IJsonLdListOrSetItem[];
	"@type": string;
	"@value": null | boolean | number | string;
	"@version": "1.1";
	"@vocab": string | null;
};
