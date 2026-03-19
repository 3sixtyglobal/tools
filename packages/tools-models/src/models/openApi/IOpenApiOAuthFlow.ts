// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * An OpenAPI OAuth Flow Object.
 * @see https://spec.openapis.org/oas/latest.html#oauth-flow-object
 */
export interface IOpenApiOAuthFlow {
	/**
	 * The authorization URL for this flow.
	 */
	authorizationUrl?: string;

	/**
	 * The device authorization URL for this flow.
	 */
	deviceAuthorizationUrl?: string;

	/**
	 * The token URL for this flow.
	 */
	tokenUrl?: string;

	/**
	 * The refresh URL for this flow.
	 */
	refreshUrl?: string;

	/**
	 * Available scopes for this flow.
	 */
	scopes: {
		[name: string]: string;
	};
}
