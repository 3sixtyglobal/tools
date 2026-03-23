// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SOME_VALUE = "value";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SOME_VALUE_2: string = "value2";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CONST_STRING = "fixed" as const;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CONST_NUM = 42 as const;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CONST_TUPLE = ["alpha", "beta", 3] as const;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CONST_CONFIG = { host: "localhost", port: 8080, debug: false } as const;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SOME_CONFIG = { timeout: 5000, name: "default" };

/**
 * Coverage for type query references.
 */
export interface TestTypeQuery {
	/**
	 * Type query fallback for runtime value references.
	 */
	mirrored: typeof SOME_VALUE;

	/**
	 * Type query fallback for runtime value references.
	 */
	mirrored2: typeof SOME_VALUE_2;

	/**
	 * as const string literal resolves to exact const value.
	 */
	constString: typeof CONST_STRING;

	/**
	 * as const number literal resolves to exact const value.
	 */
	constNum: typeof CONST_NUM;

	/**
	 * as const array resolves to a fixed-length typed tuple.
	 */
	constTuple: typeof CONST_TUPLE;

	/**
	 * Indexed access on as const tuple resolves to a literal union.
	 */
	constTupleValue: (typeof CONST_TUPLE)[number];

	/**
	 * as const object resolves to a structured const-valued object schema.
	 */
	constConfig: typeof CONST_CONFIG;

	/**
	 * Non-const object infers widened property types.
	 */
	inferredConfig: typeof SOME_CONFIG;
}
