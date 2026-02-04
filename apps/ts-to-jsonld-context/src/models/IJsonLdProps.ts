// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * JSON-LD property metadata.
 */
export interface IJsonLdProps {
	/**
	 * The id of the property.
	 */
	propertyId?: {
		namespace?: string;
		id?: string;
	};

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
