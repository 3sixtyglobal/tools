// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IOpenApiParameter } from "./IOpenApiParameter.js";
import type { IOpenApiPathMethod } from "./IOpenApiPathMethod.js";
import type { IOpenApiReference } from "./IOpenApiReference.js";
import type { IOpenApiServer } from "./IOpenApiServer.js";

/**
 * An OpenAPI Path Item Object.
 * @see https://spec.openapis.org/oas/latest.html#path-item-object
 */
export interface IOpenApiPathItem {
	/**
	 * A referenced definition of this path item.
	 */
	$ref?: string;

	/**
	 * A summary applying to all operations in the path.
	 */
	summary?: string;

	/**
	 * A description applying to all operations in the path.
	 */
	description?: string;

	/**
	 * A GET operation on the path.
	 */
	get?: IOpenApiPathMethod;

	/**
	 * A PUT operation on the path.
	 */
	put?: IOpenApiPathMethod;

	/**
	 * A POST operation on the path.
	 */
	post?: IOpenApiPathMethod;

	/**
	 * A DELETE operation on the path.
	 */
	delete?: IOpenApiPathMethod;

	/**
	 * An OPTIONS operation on the path.
	 */
	options?: IOpenApiPathMethod;

	/**
	 * A HEAD operation on the path.
	 */
	head?: IOpenApiPathMethod;

	/**
	 * A PATCH operation on the path.
	 */
	patch?: IOpenApiPathMethod;

	/**
	 * A TRACE operation on the path.
	 */
	trace?: IOpenApiPathMethod;

	/**
	 * A QUERY operation on the path.
	 */
	query?: IOpenApiPathMethod;

	/**
	 * Additional non-standard HTTP operations keyed by method name.
	 */
	additionalOperations?: {
		[method: string]: IOpenApiPathMethod;
	};

	/**
	 * Alternative servers for this path.
	 */
	servers?: IOpenApiServer[];

	/**
	 * Shared parameters for all operations on this path.
	 */
	parameters?: (IOpenApiParameter | IOpenApiReference)[];
}
