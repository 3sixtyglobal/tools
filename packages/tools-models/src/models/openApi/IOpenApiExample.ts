// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * An OpenAPI Example Object.
 * @see https://spec.openapis.org/oas/latest.html#example-object
 */
export interface IOpenApiExample {
	/**
	 * Short description for the example.
	 */
	summary?: string;

	/**
	 * Long description for the example.
	 */
	description?: string;

	/**
	 * The schema-ready value for the example.
	 */
	dataValue?: unknown;

	/**
	 * The serialized form of the example.
	 */
	serializedValue?: string;

	/**
	 * An external URI for the serialized example.
	 */
	externalValue?: string;

	/**
	 * Backwards-compatible embedded example value.
	 */
	value?: unknown;
}
