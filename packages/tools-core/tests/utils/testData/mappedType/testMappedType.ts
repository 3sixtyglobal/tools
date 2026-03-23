// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

type FieldKeys = "id" | "label";

interface SourceModel {
	id: string;
	count: number;
	active?: boolean;
}

/**
 * Generic mapped type with fixed keys.
 */
export type FieldMap = { [K in FieldKeys]: number };

/**
 * Homomorphic mapped type preserving source properties.
 */
export type SourceMirror = { [K in keyof SourceModel]: SourceModel[K] };

/**
 * Optional mapped type with fixed keys.
 */
export type OptionalFieldMap = { [K in FieldKeys]?: string };

/**
 * Mapped type remapping source keys with a template literal.
 */
export type PrefixedSourceMirror = { [K in keyof SourceModel as `api_${K}`]: SourceModel[K] };

/**
 * Mapped type remapping source keys with a conditional uppercase transform.
 */
export type UppercaseSourceMirror = {
	[K in keyof SourceModel as K extends string ? Uppercase<K> : never]: SourceModel[K];
};

/**
 * Mapped type filtering keys via a conditional extends check against a literal union.
 */
export type FilteredSourceMirror = {
	[K in keyof SourceModel as K extends "id" | "count" ? K : never]: SourceModel[K];
};

/**
 * Test mapped type handling.
 */
export interface TestMappedType {
	/**
	 * Fixed-key mapped type.
	 */
	fieldMap: FieldMap;

	/**
	 * Source-preserving mapped type.
	 */
	mirror: SourceMirror;

	/**
	 * Optional mapped type.
	 */
	optionalFieldMap: OptionalFieldMap;

	/**
	 * Template remapped source keys.
	 */
	prefixedMirror: PrefixedSourceMirror;

	/**
	 * Unresolved remapped source keys with safe fallback.
	 */
	uppercaseMirror: UppercaseSourceMirror;

	/**
	 * Conditionally filtered source keys.
	 */
	filteredMirror: FilteredSourceMirror;
}
