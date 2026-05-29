// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Diagnostic payload for non-fatal schema generation issues.
 */
export interface ITypeScriptToSchemaDiagnostics {
	/**
	 * Stable diagnostic code identifying the issue type.
	 */
	code: string;

	/**
	 * Additional structured metadata related to the diagnostic.
	 */
	properties?: { [key: string]: unknown };

	/**
	 * Schema path where the issue was detected.
	 */
	path: string;

	/**
	 * Source file where the diagnostic originated, if available.
	 */
	fileName?: string;

	/**
	 * One-based source line number, when available.
	 */
	line?: number;

	/**
	 * One-based source column number, when available.
	 */
	column?: number;
}
