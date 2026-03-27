// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Root schema referencing an inline-embedded type.
 */
export interface TestJsonSchemaEmbeddedInline {
	user: PersonInline;
	manager: PersonInline;
}

/**
 * Person should be fully inlined into referencing properties.
 * @json-schema embedded:inline
 */
export interface PersonInline {
	name: string;
	age?: number;
}
