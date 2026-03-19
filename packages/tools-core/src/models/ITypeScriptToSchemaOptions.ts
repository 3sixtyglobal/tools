// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { ITypeScriptToSchemaDiagnostics } from "./ITypeScriptToSchemaDiagnostics.js";

/**
 * Options for TypeScript to JSON schema generation.
 */
export interface ITypeScriptToSchemaOptions {
	/**
	 * Mapping of package ids, type ids, wildcard patterns, or regex patterns to schema id prefixes
	 * or replacement templates for referenced schemas.
	 */
	externalReferences?: { [id: string]: string };

	/**
	 * Optional diagnostic callback for non-fatal generation issues.
	 * @param diagnostic The diagnostic details for the generation issue.
	 */
	onDiagnostic?: (diagnostic: ITypeScriptToSchemaDiagnostics) => void;

	/**
	 * Package names where diagnostics should be suppressed, e.g. jose.
	 */
	suppressPackageWarnings?: string[];
}
