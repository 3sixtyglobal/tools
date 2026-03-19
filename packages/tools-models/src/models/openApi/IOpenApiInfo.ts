// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOpenApiContact } from "./IOpenApiContact.js";
import type { IOpenApiLicense } from "./IOpenApiLicense.js";

/**
 * An OpenAPI Info Object.
 * @see https://spec.openapis.org/oas/latest.html#info-object
 */
export interface IOpenApiInfo {
	/**
	 * The title of the API.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-0
	 */
	title: string;

	/**
	 * A short summary of the API.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-0
	 */
	summary?: string;

	/**
	 * A description of the API.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-0
	 */
	description?: string;

	/**
	 * The terms of service URI.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-0
	 */
	termsOfService?: string;

	/**
	 * Contact information for the API.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-0
	 */
	contact?: IOpenApiContact;

	/**
	 * License information for the API.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-0
	 */
	license?: IOpenApiLicense;

	/**
	 * The version of the API description.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-0
	 */
	version: string;
}
