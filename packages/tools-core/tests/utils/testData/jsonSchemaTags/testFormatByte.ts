// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Interface with a base64 binary property annotated with format:byte.
 */
export interface TestFormatByte {
	/**
	 * A base64-encoded binary payload.
	 * @json-schema format:byte
	 */
	binaryPayload?: string;
}
