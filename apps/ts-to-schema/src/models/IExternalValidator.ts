// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * A compiled validator exported by a dependency, imported instead of compiling its schema again.
 */
export interface IExternalValidator {
	/**
	 * The module specifier to import the validator from.
	 */
	moduleSpecifier: string;

	/**
	 * The name the module exports the validator as.
	 */
	exportName: string;

	/**
	 * The validator itself.
	 */
	validator: (data: unknown) => boolean;
}
