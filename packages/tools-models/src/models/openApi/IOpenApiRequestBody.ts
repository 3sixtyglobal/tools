// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOpenApiMediaType } from "./IOpenApiMediaType.js";
import type { IOpenApiReference } from "./IOpenApiReference.js";

/**
 * An OpenAPI Request Body Object.
 * @see https://spec.openapis.org/oas/latest.html#request-body-object
 */
export interface IOpenApiRequestBody {
	/**
	 * A brief description of the request body.
	 */
	description?: string;

	/**
	 * The content of the request body.
	 */
	content: {
		[contentType: string]: IOpenApiMediaType | IOpenApiReference;
	};

	/**
	 * Whether the request body is required.
	 */
	required?: boolean;
}
