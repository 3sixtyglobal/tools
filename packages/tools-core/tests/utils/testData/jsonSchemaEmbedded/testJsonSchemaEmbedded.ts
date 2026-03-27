// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Root schema referencing an embedded type.
 */
export interface TestJsonSchemaEmbedded {
	user: Person;
	manager: Person;
}

/**
 * Person should be inlined into referencing schemas.
 * @json-schema embedded:defs
 */
export interface Person {
	name: string;
	age?: number;
}
