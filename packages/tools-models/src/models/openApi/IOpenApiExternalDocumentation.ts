// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * An OpenAPI External Documentation Object.
 * @see https://spec.openapis.org/oas/latest.html#external-documentation-object
 */
export interface IOpenApiExternalDocumentation {
	/**
	 * A description of the target documentation.
	 */
	description?: string;

	/**
	 * The URI for the target documentation.
	 */
	url: string;
}
