// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IEventObject } from "./IEventObject.js";

/**
 * System Event
 */
export interface ISystemEvent extends IJsonLdNodeObject {
	/**
	 * JSON-LD Context.
	 */
	"@context": "https://schema.twindev.org/supply-chain";

	/**
	 * The id
	 */
	id: string;

	/**
	 * JSON-LD Type.
	 */
	type: "SystemEvent";

	/**
	 * json-ld id:unece:typeCode
	 * json-ld type:xsd:string
	 */
	typeCode: "add" | "create" | "notify" | "updated";

	/**
	 *
	 * json-ld type:@id
	 */
	source: IEventObject;

	/**
	 * json-ld type:@id
	 */
	object: IEventObject;

	/**
	 * json-ld type:@id
	 */
	target?: IEventObject;

	/**
	 * json-ld id:dcterms:date
	 * json-ld type:xsd:dateTimestamp
	 */
	date: string;
}
