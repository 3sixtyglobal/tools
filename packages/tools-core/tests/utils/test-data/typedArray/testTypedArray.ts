// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Coverage for native typed array references.
 */
export interface TestTypedArray {
	arrayBuffer: ArrayBuffer;
	sharedArrayBuffer: SharedArrayBuffer;
	// eslint-disable-next-line @typescript-eslint/array-type
	readonlyValues: ReadonlyArray<number>;
	int8: Int8Array;
	uint8: Uint8Array;
	uint8Clamped: Uint8ClampedArray;
	int16: Int16Array;
	uint16: Uint16Array;
	int32: Int32Array;
	uint32: Uint32Array;
	float32: Float32Array;
	float64: Float64Array;
}
