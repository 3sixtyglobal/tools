// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { JsonLdObjectWithNoContext } from "./jsonLdUtilities.js";
import type { ITestLocalAgreement } from "./testLocalAgreement.js";

/**
 * Validates JsonLdObjectWithNoContext for a base type imported from a local file.
 */
export interface TestJsonLdUtilityTypeLocalImport {
	/**
	 * Agreement with @context removed.
	 */
	agreement: JsonLdObjectWithNoContext<ITestLocalAgreement>;
}
