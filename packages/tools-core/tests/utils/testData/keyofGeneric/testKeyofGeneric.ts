// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Coverage for unresolved generic keyof operands.
 */
export interface TestKeyofGeneric<T extends object> {
	/**
	 * Generic keyof operand cannot be fully resolved to concrete keys.
	 */
	genericKey: keyof T;

	/**
	 * A regular property that should still be generated.
	 */
	label: string;
}
