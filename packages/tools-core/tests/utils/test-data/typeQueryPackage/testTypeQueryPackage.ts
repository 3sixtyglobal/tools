// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { JsonLdContexts } from "@twin.org/data-json-ld";

/**
 * Coverage for package-imported const-object type query references.
 */
export interface TestTypeQueryPackage {
	/**
	 * Package-imported type query should resolve to a const schema value.
	 */
	context: typeof JsonLdContexts.JsonLdContext;
}
