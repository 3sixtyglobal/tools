// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOpenApiExternalDocumentation } from "./IOpenApiExternalDocumentation.js";
import type { IOpenApiParameter } from "./IOpenApiParameter.js";
import type { IOpenApiReference } from "./IOpenApiReference.js";
import type { IOpenApiRequestBody } from "./IOpenApiRequestBody.js";
import type { IOpenApiResponses } from "./IOpenApiResponses.js";
import type { IOpenApiSecurityRequirement } from "./IOpenApiSecurityRequirement.js";
import type { IOpenApiServer } from "./IOpenApiServer.js";

/**
 * An OpenAPI Operation Object.
 * @see https://spec.openapis.org/oas/latest.html#operation-object
 */
export interface IOpenApiPathMethod {
	/**
	 * Tags for the operation.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-7
	 */
	tags?: string[];

	/**
	 * A short summary of the operation.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-7
	 */
	summary?: string;

	/**
	 * A verbose description of the operation.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-7
	 */
	description?: string;

	/**
	 * Additional external documentation for the operation.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-7
	 */
	externalDocs?: IOpenApiExternalDocumentation;

	/**
	 * A unique identifier for the operation.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-7
	 */
	operationId?: string;

	/**
	 * Parameters for the operation.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-7
	 */
	parameters?: (IOpenApiParameter | IOpenApiReference)[];

	/**
	 * The request body for the operation.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-7
	 */
	requestBody?: IOpenApiRequestBody | IOpenApiReference;

	/**
	 * The responses for the operation.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-7
	 */
	responses: IOpenApiResponses;

	/**
	 * Callbacks related to the operation.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-7
	 */
	callbacks?: {
		[id: string]: unknown;
	};

	/**
	 * Whether the operation is deprecated.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-7
	 */
	deprecated?: boolean;

	/**
	 * Security requirements for the operation.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-7
	 */
	security?: IOpenApiSecurityRequirement[];

	/**
	 * Alternative servers for the operation.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-7
	 */
	servers?: IOpenApiServer[];
}
