// Copyright 2026 3Sixty Trade Ltd.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The inputs which determine the outputs of an incremental run of a tool.
 */
export interface IIncrementalInputs {
	/**
	 * The folder of the package the tool is run for, its dependencies are hashed.
	 */
	packageFolder: string;

	/**
	 * The folder of the tool, its code is hashed so changing the tool regenerates the outputs.
	 */
	toolFolder: string;

	/**
	 * Files whose contents are inputs, such as the configuration.
	 */
	files: string[];

	/**
	 * The source files of the types, every source file in the folders they live in is hashed as
	 * the types can import any of them.
	 */
	types: string[];

	/**
	 * Patterns relative to the package for source files which are not inputs, such as the outputs.
	 */
	ignore?: string[];

	/**
	 * Any other values which affect the outputs, such as the arguments.
	 */
	values?: unknown;
}
