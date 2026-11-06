// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Root schema referencing an embedded type.
 */
export interface ITestJsonSchemaEmbedded {
	user: IPerson;
	manager: IPerson;
}

/**
 * Person should be inlined into referencing schemas.
 * @json-schema embedded:defs
 */
export interface IPerson {
	name: string;
	age?: number;
}
