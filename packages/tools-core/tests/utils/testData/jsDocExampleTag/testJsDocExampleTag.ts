// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Test interface for JSDoc example tag support.
 */
export interface JsDocExampleTagTest {
	/**
	 * A string property with a single example.
	 * @example "hello"
	 */
	singleExampleTag?: string;

	/**
	 * A string property with multiple examples.
	 * @example "foo"
	 * @example "bar"
	 */
	multipleExamplesTag?: string;

	/**
	 * A number property with a numeric example.
	 * @example 42
	 */
	numberExampleTag?: number;

	/**
	 * An object property with an object example.
	 * @example {"key":"value"}
	 */
	objectExampleTag?: { [id: string]: string };

	/**
	 * Both example tags are combined, with jsDoc values listed first.
	 * @example "from-example"
	 * @json-schema examples:["from-json-schema"]
	 */
	combinedExamplesTag?: string;
}
