// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

export interface IThing {
	identifier?: string;
	foo: string;
}

/**
 * @json-schema embedded:defs
 */
export type IUneceThingConstrained = IThing & Required<Pick<IThing, "identifier">>;

export interface IUsesConstrained {
	thing: IUneceThingConstrained;
}
