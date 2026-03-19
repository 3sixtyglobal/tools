// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOpenApiExample } from "./IOpenApiExample.js";
import type { IOpenApiMediaType } from "./IOpenApiMediaType.js";
import type { IOpenApiReference } from "./IOpenApiReference.js";
import type { IJsonSchema } from "../jsonSchema/IJsonSchema.js";

/**
 * The supported parameter locations.
 */
export type OpenApiParameterLocation = "path" | "query" | "querystring" | "header" | "cookie";

/**
 * The supported parameter styles.
 */
export type OpenApiParameterStyle =
	| "matrix"
	| "label"
	| "simple"
	| "form"
	| "spaceDelimited"
	| "pipeDelimited"
	| "deepObject"
	| "cookie";

/**
 * An OpenAPI Parameter Object.
 * @see https://spec.openapis.org/oas/latest.html#parameter-object
 */
export interface IOpenApiParameter {
	/**
	 * The name of the parameter.
	 */
	name: string;

	/**
	 * The location of the parameter.
	 */
	in: OpenApiParameterLocation;

	/**
	 * A brief description of the parameter.
	 */
	description?: string;

	/**
	 * Whether the parameter is required.
	 */
	required?: boolean;

	/**
	 * Whether the parameter is deprecated.
	 */
	deprecated?: boolean;

	/**
	 * Whether empty values are allowed for query parameters.
	 */
	allowEmptyValue?: boolean;

	/**
	 * A shorthand example for the parameter.
	 */
	example?: unknown;

	/**
	 * Named examples for the parameter.
	 */
	examples?: {
		[id: string]: IOpenApiExample | IOpenApiReference;
	};

	/**
	 * The serialization style for the parameter.
	 */
	style?: OpenApiParameterStyle;

	/**
	 * Whether exploded serialization is used.
	 */
	explode?: boolean;

	/**
	 * Whether reserved characters may pass through unchanged.
	 */
	allowReserved?: boolean;

	/**
	 * The schema describing the parameter.
	 */
	schema?: IJsonSchema;

	/**
	 * Content-based parameter serialization.
	 */
	content?: {
		[contentType: string]: IOpenApiMediaType | IOpenApiReference;
	};
}
