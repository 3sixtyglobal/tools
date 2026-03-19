// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * An OpenAPI Server Variable Object.
 * @see https://spec.openapis.org/oas/latest.html#server-variable-object
 */
export interface IOpenApiServerVariable {
	/**
	 * Allowed substitution values.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-4
	 */
	enum?: string[];

	/**
	 * The default substitution value.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-4
	 */
	default: string;

	/**
	 * A description of the variable.
	 * @see https://spec.openapis.org/oas/latest.html#fixed-fields-4
	 */
	description?: string;
}
