// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * A package person field.
 */
export type IPackageJsonPerson =
	| string
	| {
			name: string;
			email?: string;
			url?: string;
	  };
