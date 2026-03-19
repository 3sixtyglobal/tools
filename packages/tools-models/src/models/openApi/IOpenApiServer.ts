// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOpenApiServerVariable } from "./IOpenApiServerVariable.js";

/**
 * An OpenAPI Server Object.
 * @see https://spec.openapis.org/oas/latest.html#server-object
 */
export interface IOpenApiServer {
	/**
	 * The target URL.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-3
	 */
	url: string;

	/**
	 * A description of the server.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-3
	 */
	description?: string;

	/**
	 * A unique server name.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-3
	 */
	name?: string;

	/**
	 * URL template variables.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-3
	 */
	variables?: {
		[name: string]: IOpenApiServerVariable;
	};
}
