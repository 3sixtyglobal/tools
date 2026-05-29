// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOpenApiOAuthFlow } from "./IOpenApiOAuthFlow.js";

/**
 * An OpenAPI OAuth Flows Object.
 * @see https://spec.openapis.org/oas/latest.html#oauth-flows-object
 */
export interface IOpenApiOAuthFlows {
	/**
	 * Configuration for the implicit flow.
	 */
	implicit?: IOpenApiOAuthFlow;

	/**
	 * Configuration for the resource owner password flow.
	 */
	password?: IOpenApiOAuthFlow;

	/**
	 * Configuration for the client credentials flow.
	 */
	clientCredentials?: IOpenApiOAuthFlow;

	/**
	 * Configuration for the authorization code flow.
	 */
	authorizationCode?: IOpenApiOAuthFlow;

	/**
	 * Configuration for the device authorization flow.
	 */
	deviceAuthorization?: IOpenApiOAuthFlow;
}
