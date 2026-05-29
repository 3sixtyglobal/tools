// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

export interface IBaseType {
	"@context"?: string;
	identifier?: string;
	foo: string;
}

/**
 * @json-schema embedded:inline
 */
export type IConstrained = IBaseType & Required<Pick<IBaseType, "@context" | "identifier">>;

export type IExtended = IConstrained & {
	bar: number;
};
