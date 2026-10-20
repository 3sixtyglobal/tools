// Copyright 2026 3Sixty Trade Ltd.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The cache recording the inputs and outputs of the last incremental run of a tool.
 */
export interface IIncrementalCache {
	/**
	 * The hash of the inputs.
	 */
	inputs: string;

	/**
	 * The hash of each output file, keyed by its path relative to the package.
	 */
	outputs: { [file: string]: string };
}
