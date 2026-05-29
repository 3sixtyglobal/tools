// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Event object for System Events.
 */
export interface IEventObject {
	id: string;
	type: string;
	/**
	 * @json-ld type:@json
	 */
	detail: { [id: string]: { foo: string; boo: number } };
}
