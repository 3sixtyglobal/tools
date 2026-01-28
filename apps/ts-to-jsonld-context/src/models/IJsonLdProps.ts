// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * JSON-LD property metadata.
 */
export interface IJsonLdProps {
	/**
	 * Include only the property.
	 */
	idOnly?: boolean;

	/**
	 * The namespace of the property.
	 */
	namespace?: string;

	/**
	 * The type information of the property.
	 */
	propertyType?: {
		namespace?: string;
		type?: string;
	};

	/**
	 * The container type of the property.
	 */
	container?: string;
}
