// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * An OpenAPI Contact Object.
 * @see https://spec.openapis.org/oas/latest.html#contact-object
 */
export interface IOpenApiContact {
	/**
	 * The identifying name of the contact person or organisation.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-1
	 */
	name?: string;

	/**
	 * The URI for the contact information.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-1
	 */
	url?: string;

	/**
	 * The email address for the contact.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-1
	 */
	email?: string;
}
