// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOpenApiReference } from "./IOpenApiReference.js";
import type { IOpenApiResponse } from "./IOpenApiResponse.js";

/**
 * An OpenAPI Responses Object.
 * @see https://spec.openapis.org/oas/latest.html#responses-object
 */
export interface IOpenApiResponses {
	/**
	 * Named HTTP status code or status code range responses.
	 * @see https://spec.openapis.org/oas/latest.html#patterned-fields-0
	 */
	[code: string]: IOpenApiResponse | IOpenApiReference | undefined;

	/**
	 * The default response for otherwise undeclared status codes.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-13
	 */
	default?: IOpenApiResponse | IOpenApiReference;
}
