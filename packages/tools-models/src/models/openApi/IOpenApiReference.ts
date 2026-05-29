// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * An OpenAPI Reference Object.
 * @see https://spec.openapis.org/oas/latest.html#reference-object
 */
export interface IOpenApiReference {
	/**
	 * The reference identifier.
	 */
	$ref: string;

	/**
	 * A summary override for the referenced object.
	 */
	summary?: string;

	/**
	 * A description override for the referenced object.
	 */
	description?: string;
}
