// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOpenApiExample } from "./IOpenApiExample.js";
import type { IOpenApiMediaType } from "./IOpenApiMediaType.js";
import type { IOpenApiReference } from "./IOpenApiReference.js";
import type { IJsonSchema } from "../jsonSchema/IJsonSchema.js";

/**
 * An OpenAPI Header Object.
 * @see https://spec.openapis.org/oas/latest.html#header-object
 */
export interface IOpenApiHeader {
	/**
	 * The description of the header.
	 */
	description?: string;

	/**
	 * Whether the header is required.
	 */
	required?: boolean;

	/**
	 * Whether the header is deprecated.
	 */
	deprecated?: boolean;

	/**
	 * A shorthand example for the header.
	 */
	example?: unknown;

	/**
	 * Named examples for the header.
	 */
	examples?: {
		[id: string]: IOpenApiExample | IOpenApiReference;
	};

	/**
	 * The serialization style for the header.
	 */
	style?: "simple";

	/**
	 * Whether exploded serialization is used.
	 */
	explode?: boolean;

	/**
	 * The schema of the header.
	 */
	schema?: IJsonSchema;

	/**
	 * The content definition for the header.
	 */
	content?: {
		[contentType: string]: IOpenApiMediaType | IOpenApiReference;
	};
}
