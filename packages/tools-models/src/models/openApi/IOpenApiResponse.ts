// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOpenApiHeader } from "./IOpenApiHeader.js";
import type { IOpenApiMediaType } from "./IOpenApiMediaType.js";
import type { IOpenApiReference } from "./IOpenApiReference.js";

/**
 * An OpenAPI Response Object.
 * @see https://spec.openapis.org/oas/latest.html#response-object
 */
export interface IOpenApiResponse {
	/**
	 * A short summary of the meaning of the response.
	 */
	summary?: string;

	/**
	 * A description of the response.
	 */
	description: string;

	/**
	 * The headers for the response.
	 */
	headers?: {
		[id: string]: IOpenApiHeader | IOpenApiReference;
	};

	/**
	 * The content for the response.
	 */
	content?: {
		[contentType: string]: IOpenApiMediaType | IOpenApiReference;
	};

	/**
	 * Design-time links from this response.
	 */
	links?: {
		[id: string]: unknown;
	};
}
