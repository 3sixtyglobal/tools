// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LOCAL_CONST_OBJ = { host: "localhost", port: 8080 } as const;

/**
 * Coverage for qualified typeof type queries that resolve a named property of a local const object.
 */
export interface TestTypeQueryQualified {
	/**
	 * Qualified typeof resolves the exact string value from a named const object property.
	 */
	constHost: typeof LOCAL_CONST_OBJ.host;

	/**
	 * Qualified typeof resolves the exact numeric value from a named const object property.
	 */
	constPort: typeof LOCAL_CONST_OBJ.port;
}
