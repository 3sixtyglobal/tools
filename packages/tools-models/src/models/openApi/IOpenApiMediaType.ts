// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOpenApiExample } from "./IOpenApiExample.js";
import type { IOpenApiReference } from "./IOpenApiReference.js";
import type { IJsonSchema } from "../jsonSchema/IJsonSchema.js";

/**
 * An OpenAPI Media Type Object.
 * @see https://spec.openapis.org/oas/latest.html#media-type-object
 */
export interface IOpenApiMediaType {
	/**
	 * A schema describing the complete content.
	 */
	schema?: IJsonSchema;

	/**
	 * A schema describing each item within a sequential media type.
	 */
	itemSchema?: IJsonSchema;

	/**
	 * A single shorthand example.
	 */
	example?: unknown;

	/**
	 * Named examples for the media type.
	 */
	examples?: {
		[id: string]: IOpenApiExample | IOpenApiReference;
	};

	/**
	 * Encoding metadata keyed by property name.
	 */
	encoding?: {
		[id: string]: unknown;
	};

	/**
	 * Positional encoding metadata for multipart payloads.
	 */
	prefixEncoding?: unknown[];

	/**
	 * Repeating item encoding metadata for multipart payloads.
	 */
	itemEncoding?: unknown;
}
