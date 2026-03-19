// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IImportedProfile } from "./testNestedImportedTypes.ts";

/**
 * Root schema that references an imported nested object.
 */
export interface TestNestedImported {
	/**
	 * Entity id.
	 */
	id: string;

	/**
	 * Imported profile object.
	 */
	profile: IImportedProfile;
}
