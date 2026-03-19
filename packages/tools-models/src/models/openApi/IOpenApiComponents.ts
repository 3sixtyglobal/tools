// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOpenApiExample } from "./IOpenApiExample.js";
import type { IOpenApiHeader } from "./IOpenApiHeader.js";
import type { IOpenApiMediaType } from "./IOpenApiMediaType.js";
import type { IOpenApiParameter } from "./IOpenApiParameter.js";
import type { IOpenApiPathItem } from "./IOpenApiPathItem.js";
import type { IOpenApiReference } from "./IOpenApiReference.js";
import type { IOpenApiRequestBody } from "./IOpenApiRequestBody.js";
import type { IOpenApiResponse } from "./IOpenApiResponse.js";
import type { IOpenApiSecurityScheme } from "./IOpenApiSecurityScheme.js";
import type { IJsonSchema } from "../jsonSchema/IJsonSchema.js";

/**
 * An OpenAPI Components Object.
 * @see https://spec.openapis.org/oas/latest.html#components-object
 */
export interface IOpenApiComponents {
	/**
	 * Reusable schemas.
	 */
	schemas?: {
		[name: string]: IJsonSchema | boolean;
	};

	/**
	 * Reusable responses.
	 */
	responses?: {
		[name: string]: IOpenApiResponse | IOpenApiReference;
	};

	/**
	 * Reusable parameters.
	 */
	parameters?: {
		[name: string]: IOpenApiParameter | IOpenApiReference;
	};

	/**
	 * Reusable examples.
	 */
	examples?: {
		[name: string]: IOpenApiExample | IOpenApiReference;
	};

	/**
	 * Reusable request bodies.
	 */
	requestBodies?: {
		[name: string]: IOpenApiRequestBody | IOpenApiReference;
	};

	/**
	 * Reusable headers.
	 */
	headers?: {
		[name: string]: IOpenApiHeader | IOpenApiReference;
	};

	/**
	 * Reusable security schemes.
	 */
	securitySchemes?: {
		[name: string]: IOpenApiSecurityScheme | IOpenApiReference;
	};

	/**
	 * Reusable path items.
	 */
	pathItems?: {
		[name: string]: IOpenApiPathItem;
	};

	/**
	 * Reusable media types.
	 */
	mediaTypes?: {
		[name: string]: IOpenApiMediaType | IOpenApiReference;
	};
}
