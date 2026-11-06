// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * bigint keyword in a union branch should be rejected.
 */
export interface ITestDisallowedTypesBigIntUnion {
	value: string | bigint;
}
