// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type * as ts from "typescript";
import type { ITypeScriptToSchemaContext } from "../models/ITypeScriptToSchemaContext.js";

/**
 * Emits non-fatal diagnostics during schema mapping.
 */
export class DiagnosticReporter {
	/**
	 * Emit an optional non-fatal schema generation diagnostic.
	 * @param context The generation context.
	 * @param node The related AST node.
	 * @param code The diagnostic code.
	 * @param properties The values to substitute into the localised message.
	 */
	public static report(
		context: ITypeScriptToSchemaContext,
		node: ts.Node,
		code: string,
		properties?: { [key: string]: unknown }
	): void {
		if (!context.options?.onDiagnostic) {
			return;
		}

		const sourceFile = context.activeSourceFile;
		const sourcePosition = sourceFile
			? sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile))
			: undefined;

		context.options.onDiagnostic({
			code,
			properties,
			path: sourceFile
				? `${sourceFile.fileName}:${(sourcePosition?.line ?? 0) + 1}:${(sourcePosition?.character ?? 0) + 1}`
				: "unknown",
			fileName: sourceFile?.fileName,
			line: sourcePosition ? sourcePosition.line + 1 : undefined,
			column: sourcePosition ? sourcePosition.character + 1 : undefined
		});
	}
}
