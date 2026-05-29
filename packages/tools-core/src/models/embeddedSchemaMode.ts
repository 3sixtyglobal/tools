// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The available embedded schema modes.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const EmbeddedSchemaMode = {
	/**
	 * Referenced schemas are added to the "defs" section of the root schema.
	 */
	Defs: "defs",

	/**
	 * Referenced schemas are inlined into the referencing schema.
	 */
	Inline: "inline"
} as const;

/**
 * The embedded schema mode value type.
 */
export type EmbeddedSchemaMode = (typeof EmbeddedSchemaMode)[keyof typeof EmbeddedSchemaMode];
