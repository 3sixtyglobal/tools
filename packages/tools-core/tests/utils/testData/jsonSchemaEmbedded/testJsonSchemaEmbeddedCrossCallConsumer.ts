// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { ICrossCallEmbedded } from "./testJsonSchemaEmbeddedCrossCall.js";

/**
 * Consumer of the cross-call embedded type.
 */
export interface ICrossCallConsumer {
	first: ICrossCallEmbedded;
	second: ICrossCallEmbedded;
}
