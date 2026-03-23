// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Test primitives.
 */
export interface TestPrimitives {
	/**
	 * A string value.
	 */
	stringValue: string;

	/**
	 * A boolean value.
	 */
	booleanValue: boolean;

	/*
	 * A number value.
	 */
	numberValue: number;

	/**
	 * An array of string values.
	 */
	arrayValue: string[];

	/**
	 * An object of unknown values.
	 */
	objectValue: { [id: string]: unknown };

	/**
	 * A value typed as any.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	anyValue: any;

	/**
	 * A value typed as never.
	 */
	neverValue: never;

	/**
	 * A field name that is a reserved keyword in JSON Schema, requiring special handling.
	 */
	"@context": string;

	/**
	 * Callback function that should not be emitted in schema properties.
	 */
	onChanged: (value: string) => void;
}
