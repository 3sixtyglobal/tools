// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Shared constants for TypeScript to JSON schema generation.
 */
export class Constants {
	/**
	 * Utility type names currently unsupported and mapped to open schemas with diagnostics.
	 */
	public static readonly UNSUPPORTED_UTILITY_TYPE_NAMES: string[] = [
		"Awaited",
		"ReturnType",
		"Parameters",
		"ConstructorParameters",
		"InstanceType",
		"ThisParameterType",
		"OmitThisParameter",
		"ThisType",
		"CallableFunction",
		"NewableFunction",
		"Uppercase",
		"Lowercase",
		"Capitalize",
		"Uncapitalize"
	];

	/**
	 * Native typed-array and binary type names mapped to JSON number arrays.
	 */
	public static readonly ARRAY_NUMBER_TYPE_NAMES: string[] = [
		"ArrayBuffer",
		"SharedArrayBuffer",
		"Int8Array",
		"Uint8Array",
		"Uint8ClampedArray",
		"Int16Array",
		"Uint16Array",
		"Int32Array",
		"Uint32Array",
		"Float32Array",
		"Float64Array"
	];
}
