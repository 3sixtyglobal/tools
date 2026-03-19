// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

interface IndexedAccessSource {
	id: string;
	count: number;
	status?: "active" | "disabled";
	nested: {
		label: string;
	};
}

/**
 * Test indexed access type handling.
 */
export interface TestIndexedAccessType {
	/**
	 * Single indexed string key.
	 */
	idValue: IndexedAccessSource["id"];

	/**
	 * Single indexed number key.
	 */
	countValue: IndexedAccessSource["count"];

	/**
	 * Indexed union of keys.
	 */
	unionValue: IndexedAccessSource["id" | "count"];

	/**
	 * Indexed optional source key.
	 */
	optionalStatus: IndexedAccessSource["status"];

	/**
	 * Indexed object-valued key.
	 */
	nestedValue: IndexedAccessSource["nested"];
}
