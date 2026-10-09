// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Configuration for the tool.
 */
export interface ITsToSchemaConfig {
	/**
	 * The base url for the type references e.g. https://schema.3sixty.global/my-namespace/.
	 */
	baseUrl: string;

	/**
	 * The source files to generate the types from.
	 */
	types: string[];

	/**
	 * External type references.
	 */
	externalReferences?: { [id: string]: string };

	/**
	 * Package names where diagnostics should be suppressed, e.g. jose.
	 */
	suppressPackageWarnings?: string[];
}
