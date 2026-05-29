// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * A package bugs field.
 */
export type IPackageJsonBugs =
	| string
	| {
			url?: string;
			email?: string;
	  };
