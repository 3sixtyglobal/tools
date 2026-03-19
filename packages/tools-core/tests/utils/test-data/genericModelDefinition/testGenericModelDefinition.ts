// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Generic interface model using a default type parameter.
 */
export interface TestGenericModel<T = string> {
	/**
	 * Direct generic property.
	 */
	prop: T;

	/**
	 * Array of generic values.
	 */
	values: T[];

	/**
	 * Nested object using the same generic value.
	 */
	nested?: {
		value: T;
	};
}

/**
 * Generic interface model without a default type parameter.
 */
export interface TestGenericModelNoDefault<T> {
	/**
	 * Direct unresolved generic property.
	 */
	prop: T;

	/**
	 * Array of unresolved generic values.
	 */
	values: T[];

	/**
	 * Nested object using unresolved generic value.
	 */
	nested?: {
		value: T;
	};
}

/**
 * Generic interface model using a default type parameter.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type GenericAliasModel<T = number> = {
	/**
	 * Numeric generic property.
	 */
	count: T;

	/**
	 * Historical generic values.
	 */
	history?: T[];
};
