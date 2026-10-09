// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { HttpMethod } from "@3sixty/web";

/**
 * Interface which defines a REST route.
 */
export interface IRestRoute {
	/**
	 * The id of the operation.
	 */
	operationId: string;

	/**
	 * The path to use for routing.
	 */
	path: string;

	/**
	 * Skips the authentication for this route.
	 */
	skipAuth?: boolean;

	/**
	 * Summary of what task the operation performs.
	 */
	summary: string;

	/**
	 * Tag for the operation.
	 */
	tag: string;

	/**
	 * The http method.
	 */
	method: HttpMethod;

	/**
	 * The type of the request object.
	 */
	requestType?: {
		/**
		 * The object type for the request.
		 */
		type: string;

		/**
		 * The mime type of the request, defaults to "application/json" if there is a body.
		 */
		mimeType?: string;

		/**
		 * Example objects for the request.
		 */
		examples?: {
			/**
			 * Example objects for the request.
			 */
			id: string;

			/**
			 * Description of the example.
			 */
			description?: string;

			/**
			 * The example request object.
			 */
			request: unknown;
		}[];
	};

	/**
	 * The type of the response object.
	 */
	responseType?: {
		/**
		 * The object type of the response.
		 */
		type: string;

		/**
		 * The mime type of the response, defaults to "application/json" if there is a body.
		 */
		mimeType?: string;

		/**
		 * Example objects of the response.
		 */
		examples?: {
			/**
			 * Example objects for the request.
			 */
			id: string;

			/**
			 * Description of the example.
			 */
			description?: string;

			/**
			 * The example response object.
			 */
			response: unknown;
		}[];
	}[];

	/**
	 * Exclude the route from being included in the spec file.
	 */
	excludeFromSpec?: boolean;

	/**
	 * The handler module.
	 */
	handler: () => Promise<unknown>;
}
