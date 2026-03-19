// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * An OpenAPI Security Requirement Object.
 * @see https://spec.openapis.org/oas/latest.html#security-requirement-object
 */
export interface IOpenApiSecurityRequirement {
	[name: string]: string[];
}
