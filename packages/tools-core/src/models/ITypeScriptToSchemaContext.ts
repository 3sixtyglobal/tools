// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonSchema } from "@twin.org/tools-models";
import type * as ts from "typescript";
import type { EmbeddedSchemaMode } from "./embeddedSchemaMode.js";
import type { ITypeScriptToSchemaOptions } from "./ITypeScriptToSchemaOptions.js";

/**
 * Context for TypeScript to JSON schema generation.
 */
export interface ITypeScriptToSchemaContext {
	/**
	 * The namespace for generated schema ids.
	 */
	namespace: string;

	/**
	 * The package name for generated schema ids.
	 */
	packageName: string;

	/**
	 * The schema cache indexed by package and title.
	 */
	schemas: { [id: string]: { [id: string]: IJsonSchema } };

	/**
	 * The currently active source file being mapped.
	 */
	activeSourceFile?: ts.SourceFile;

	/**
	 * The currently active enclosing object (interface/type) being mapped.
	 */
	activeEnclosingObjectName?: string;

	/**
	 * The first disallowed type encountered while mapping the active enclosing object.
	 */
	activeDisallowedType?: {
		disallowedTypeName: string;
		propertyName: string;
		enclosingObjectName: string;
	};

	/**
	 * Type names currently being resolved to avoid recursive local-type expansion loops.
	 */
	resolvingTypeNames?: Set<string>;

	/**
	 * Utility type names currently being processed to avoid infinite recursion cycles
	 * when encountering complex combinations of indexed access types, keyof, and utility types.
	 */
	resolvingUtilityTypes?: Set<string>;

	/**
	 * Imported utility base schemas currently being resolved to avoid recursive re-entry
	 * while parsing module graphs for utility type application.
	 */
	resolvingImportedObjectSchemas?: Set<string>;

	/**
	 * Generic type parameter bindings active for the current mapping scope.
	 */
	typeParameterBindings?: { [id: string]: ts.TypeNode | null };

	/**
	 * Schema ids marked with @json-schema embedded and their embedding mode.
	 */
	embeddedSchemaModes?: { [id: string]: EmbeddedSchemaMode };

	/**
	 * Optional schema generation options.
	 */
	options?: ITypeScriptToSchemaOptions;
}
