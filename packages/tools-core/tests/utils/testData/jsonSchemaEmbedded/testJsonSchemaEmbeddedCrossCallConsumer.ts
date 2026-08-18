// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { CrossCallEmbedded } from "./testJsonSchemaEmbeddedCrossCall.js";

/**
 * Consumer of the cross-call embedded type.
 */
export interface CrossCallConsumer {
	first: CrossCallEmbedded;
	second: CrossCallEmbedded;
}
