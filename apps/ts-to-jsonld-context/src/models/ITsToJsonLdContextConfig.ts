// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Configuration for the tool.
 */
export interface ITsToJsonLdContextConfig {
	/**
	 * The prefix to use for the context e.g. twin-common.
	 */
	prefix: string;

	/**
	 * The base URL for the context e.g. https://schema.twindev.org/common/
	 */
	contextUrl: string;

	/**
	 * Additional context URLs to include in the context.
	 */
	additionalContextUrls?: { [id: string]: string };

	/**
	 * Fixed mappings to include in the context.
	 */
	fixedMappings?: { [id: string]: string };

	/**
	 * The source files to generate the types from.
	 */
	types: string[];

	/**
	 * Whether to include protected properties in the generated context.
	 * @default false
	 */
	includeProtected?: boolean;
}
