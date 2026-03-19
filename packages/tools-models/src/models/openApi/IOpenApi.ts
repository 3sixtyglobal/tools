// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOpenApiComponents } from "./IOpenApiComponents.js";
import type { IOpenApiExternalDocumentation } from "./IOpenApiExternalDocumentation.js";
import type { IOpenApiInfo } from "./IOpenApiInfo.js";
import type { IOpenApiPathItem } from "./IOpenApiPathItem.js";
import type { IOpenApiSecurityRequirement } from "./IOpenApiSecurityRequirement.js";
import type { IOpenApiServer } from "./IOpenApiServer.js";
import type { IOpenApiTag } from "./IOpenApiTag.js";

/**
 * The OpenAPI document definition.
 * @see https://spec.openapis.org/oas/latest.html#openapi-object
 */
export interface IOpenApi {
	/**
	 * The OpenAPI specification version.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields
	 */
	openapi: string;

	/**
	 * The self-assigned URI of the document.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields
	 */
	$self?: string;

	/**
	 * The metadata for the API.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields
	 */
	info: IOpenApiInfo;

	/**
	 * The default JSON Schema dialect URI.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields
	 */
	jsonSchemaDialect?: string;

	/**
	 * Connectivity information for target servers.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields
	 */
	servers?: IOpenApiServer[];

	/**
	 * Available paths and operations.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields
	 */
	paths?: {
		[path: string]: IOpenApiPathItem;
	};

	/**
	 * Incoming webhooks keyed by name.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields
	 */
	webhooks?: {
		[name: string]: IOpenApiPathItem;
	};

	/**
	 * Reusable components.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields
	 */
	components?: IOpenApiComponents;

	/**
	 * API-wide security requirements.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields
	 */
	security?: IOpenApiSecurityRequirement[];

	/**
	 * Tags used by the API description.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields
	 */
	tags?: IOpenApiTag[];

	/**
	 * Additional external documentation.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields
	 */
	externalDocs?: IOpenApiExternalDocumentation;
}
