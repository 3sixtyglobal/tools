// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IJsonLdNodeObject, IJsonLdNodePrimitive } from "@twin.org/data-json-ld";

/**
 * Event object for System Events.
 */
export interface IEventObject extends IJsonLdNodeObject {
	id: string;
	type: string;
	/**
	 * json-ld type:@json
	 */
	detail: { [id: string]: IJsonLdNodePrimitive };
}
