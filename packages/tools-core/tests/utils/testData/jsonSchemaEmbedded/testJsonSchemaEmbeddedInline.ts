// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Root schema referencing an inline-embedded type.
 */
export interface ITestJsonSchemaEmbeddedInline {
	user: IPersonInline;
	manager: IPersonInline;
}

/**
 * Person should be fully inlined into referencing properties.
 * @json-schema embedded:inline
 */
export interface IPersonInline {
	name: string;
	age?: number;
}
