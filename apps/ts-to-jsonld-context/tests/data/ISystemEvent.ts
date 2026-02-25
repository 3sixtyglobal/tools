// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IEventObject } from "./IEventObject.js";

/**
 * System Event
 */
export interface ISystemEvent {
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

	/**
	 * json-ld id:https://schema.org/numberOfItems
	 */
	numberOfItems: number;

	/**
	 * json-ld id
	 */
	defaultMappedId: string;

	/**
	 * json-ld id:eventIdentifier
	 */
	renamedId: string;

	/**
	 * json-ld type:xsd:string
	 */
	typedOnly: string;

	/**
	 * json-ld container:set
	 */
	tags: string[];

	/**
	 * json-ld id:unece:eventTypeCode
	 * json-ld type:xsd:string
	 * json-ld container:list
	 */
	classification: string[];

	/**
	 * The date/time of when the stream was modified.
	 * json-ld namespace:sch
	 */
	dateModified?: string;
}
