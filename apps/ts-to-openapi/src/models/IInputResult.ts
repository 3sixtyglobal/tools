// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IInputPath } from "./IInputPath.js";

/**
 * The set of path results for a package.
 */
export interface IInputResult {
	/**
	 * The paths.
	 */
	paths: IInputPath[];

	/**
	 * The tags.
	 */
	tags: {
		/**
		 * The name of the tag.
		 */
		name: string;

		/**
		 * Description for the tag.
		 */
		description: string;
	}[];
}
