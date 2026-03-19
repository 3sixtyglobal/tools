// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * An OpenAPI License Object.
 * @see https://spec.openapis.org/oas/latest.html#license-object
 */
export interface IOpenApiLicense {
	/**
	 * The license name.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-2
	 */
	name: string;

	/**
	 * The SPDX license expression.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-2
	 */
	identifier?: string;

	/**
	 * The URI for the license.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-2
	 */
	url?: string;
}
