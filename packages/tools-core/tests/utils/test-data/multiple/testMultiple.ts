// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Test person details.
 */
export interface TestPerson {
	/**
	 * The person's name.
	 */
	name: string;

	/**
	 * The person's age.
	 */
	age: number;
}

/**
 * Test address information.
 */
export interface TestAddress {
	/**
	 * The street address.
	 */
	street: string;

	/**
	 * The city name.
	 */
	city: string;

	/**
	 * Postal code array.
	 */
	codes: string[];
}
