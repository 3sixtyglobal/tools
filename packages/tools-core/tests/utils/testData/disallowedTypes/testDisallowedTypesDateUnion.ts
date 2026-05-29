// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Date type in a union branch should be rejected.
 */
export interface TestDisallowedTypesDateUnion {
	value: number | Date;
}
