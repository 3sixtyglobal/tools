// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * A package repository field.
 */
export type IPackageJsonRepository =
	| string
	| {
			type?: string;
			url: string;
			directory?: string;
	  };
