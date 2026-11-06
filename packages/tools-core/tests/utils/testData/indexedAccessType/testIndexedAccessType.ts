// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

interface IIndexedAccessSource {
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
export interface ITestIndexedAccessType {
	/**
	 * Single indexed string key.
	 */
	idValue: IIndexedAccessSource["id"];

	/**
	 * Single indexed number key.
	 */
	countValue: IIndexedAccessSource["count"];

	/**
	 * Indexed union of keys.
	 */
	unionValue: IIndexedAccessSource["id" | "count"];

	/**
	 * Indexed optional source key.
	 */
	optionalStatus: IIndexedAccessSource["status"];

	/**
	 * Indexed object-valued key.
	 */
	nestedValue: IIndexedAccessSource["nested"];
}
