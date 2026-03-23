// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Coverage for import type references.
 */
export interface TestImportType {
	/**
	 * Imported type reference from external package.
	 */
	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	operation: import("@twin.org/core").IPatchOperation;
}
