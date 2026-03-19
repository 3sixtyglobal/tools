// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IPatchOperation } from "@twin.org/core";

/**
 * Uses an external framework type.
 */
export interface TestExternalPatchOperation {
	/**
	 * The patch operation from the framework package.
	 */
	operation: IPatchOperation;
}
