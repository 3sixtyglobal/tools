// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Base person model for intersection property tests.
 */
export interface IPerson {
	/**
	 * The identifier.
	 */
	id: string;
}

/**
 * Interface with an intersection-typed property.
 */
export interface TypeObjectIntersection {
	/**
	 * Person extended inline with a first name.
	 */
	extendedPerson: IPerson & { firstName: string };
}
