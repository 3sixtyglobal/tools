// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOpenApiOAuthFlows } from "./IOpenApiOAuthFlows.js";

/**
 * An OpenAPI Security Scheme Object.
 * @see https://spec.openapis.org/oas/latest.html#security-scheme-object
 */
export type IOpenApiSecurityScheme =
	| {
			type: "apiKey";
			description?: string;
			name: string;
			in: "query" | "header" | "cookie";
			deprecated?: boolean;
	  }
	| {
			type: "http";
			description?: string;
			scheme: string;
			bearerFormat?: string;
			deprecated?: boolean;
	  }
	| {
			type: "mutualTLS";
			description?: string;
			deprecated?: boolean;
	  }
	| {
			type: "oauth2";
			description?: string;
			flows: IOpenApiOAuthFlows;
			oauth2MetadataUrl?: string;
			deprecated?: boolean;
	  }
	| {
			type: "openIdConnect";
			description?: string;
			openIdConnectUrl: string;
			deprecated?: boolean;
	  };
