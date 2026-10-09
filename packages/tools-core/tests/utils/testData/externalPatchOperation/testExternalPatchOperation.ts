// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IPatchOperation } from "@3sixty/core";

/**
 * Uses an external framework type.
 */
export interface TestExternalPatchOperation {
	/**
	 * The patch operation from the framework package.
	 */
	operation: IPatchOperation;
}
