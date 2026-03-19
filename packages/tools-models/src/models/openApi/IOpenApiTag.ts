// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOpenApiExternalDocumentation } from "./IOpenApiExternalDocumentation.js";

/**
 * An OpenAPI Tag Object.
 * @see https://spec.openapis.org/oas/latest.html#tag-object
 */
export interface IOpenApiTag {
	/**
	 * The name of the tag.
	 */
	name: string;

	/**
	 * A short summary of the tag.
	 */
	summary?: string;

	/**
	 * A description of the tag.
	 */
	description?: string;

	/**
	 * Additional external documentation for the tag.
	 */
	externalDocs?: IOpenApiExternalDocumentation;

	/**
	 * Parent tag name.
	 */
	parent?: string;

	/**
	 * A machine-readable category for the tag.
	 */
	kind?: string;
}
