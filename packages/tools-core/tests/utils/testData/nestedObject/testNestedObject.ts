// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Nested objects with inline schema expansion.
 */
export interface TestNestedObject {
	/**
	 * Primary id.
	 */
	id: string;

	/**
	 * Nested profile object.
	 */
	profile: {
		/**
		 * Contact email.
		 */
		email: string;

		/**
		 * Optional settings object.
		 */
		settings?: {
			/**
			 * Theme value.
			 */
			theme: string;
		};
	};

	/**
	 * Optional labels.
	 */
	labels?: string[];
}
