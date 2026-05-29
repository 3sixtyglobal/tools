// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

export interface IBaseType {
	"@context"?: string;
	identifier?: string;
	foo: string;
}

/**
 * @json-schema title:ConstrainedDefs
 * @json-schema embedded:defs
 */
export type IConstrainedDefs = IBaseType & Required<Pick<IBaseType, "@context" | "identifier">>;

export type IExtendedDefs = IConstrainedDefs & {
	bar: number;
};
