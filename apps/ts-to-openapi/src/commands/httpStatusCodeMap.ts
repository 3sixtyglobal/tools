// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { HttpStatusCode } from "@3sixty/web";

export const HTTP_STATUS_CODE_MAP: {
	[id: string]: {
		code: HttpStatusCode;
		responseType: string;
		example?: unknown;
	};
} = {
	ok: {
		code: HttpStatusCode.ok,
		responseType: "IOkResponse"
	},
	created: {
		code: HttpStatusCode.created,
		responseType: "ICreatedResponse"
	},
	accepted: {
		code: HttpStatusCode.accepted,
		responseType: "IAcceptedResponse"
	},
	noContent: {
		code: HttpStatusCode.noContent,
		responseType: "INoContentResponse"
	},
	badRequest: {
		code: HttpStatusCode.badRequest,
		responseType: "IBadRequestResponse",
		example: {
			name: "GeneralError",
			message: "errorMessage",
			properties: {
				foo: "bar"
			}
		}
	},
	unauthorized: {
		code: HttpStatusCode.unauthorized,
		responseType: "IUnauthorizedResponse",
		example: {
			name: "UnauthorizedError",
			message: "errorMessage"
		}
	},
	notImplemented: {
		code: HttpStatusCode.notImplemented,
		responseType: "INotImplementedResponse",
		example: {
			name: "NotImplementedError",
			message: "errorMessage",
			properties: {
				method: "aMethod"
			}
		}
	},
	forbidden: {
		code: HttpStatusCode.forbidden,
		responseType: "IForbiddenResponse",
		example: {
			name: "ForbiddenError",
			message: "errorMessage",
			properties: {
				foo: "bar"
			}
		}
	},
	tooManyRequests: {
		code: HttpStatusCode.tooManyRequests,
		responseType: "ITooManyRequestsResponse",
		example: {
			name: "TooManyRequestsError",
			message: "errorMessage",
			properties: {
				requestCount: 5,
				nextRequestTime: "2024-06-01T12:00:00Z"
			}
		}
	},
	notFound: {
		code: HttpStatusCode.notFound,
		responseType: "INotFoundResponse",
		example: {
			name: "NotFoundError",
			message: "errorMessage",
			properties: {
				notFoundId: "1"
			}
		}
	},
	conflict: {
		code: HttpStatusCode.conflict,
		responseType: "IConflictResponse",
		example: {
			name: "ConflictError",
			message: "errorMessage",
			properties: {
				conflicts: ["1"]
			}
		}
	},
	internalServerError: {
		code: HttpStatusCode.internalServerError,
		responseType: "IInternalServerErrorResponse",
		example: {
			name: "InternalServerError",
			message: "errorMessage"
		}
	},
	unprocessableEntity: {
		code: HttpStatusCode.unprocessableEntity,
		responseType: "IUnprocessableEntityResponse",
		example: {
			name: "UnprocessableError",
			message: "errorMessage"
		}
	}
};

/**
 * Get the HTTP status code from the error code type.
 * @param errorCodeType The error code type.
 * @returns The HTTP status code.
 */
export function getHttpStatusCodeFromType(errorCodeType: string): HttpStatusCode {
	for (const httpStatusCodeType of Object.values(HTTP_STATUS_CODE_MAP)) {
		if (httpStatusCodeType.responseType === errorCodeType) {
			return httpStatusCodeType.code;
		}
	}
	return HttpStatusCode.ok;
}

/**
 * Get the HTTP example from the error code type.
 * @param errorCodeType The error code type.
 * @returns The example.
 */
export function getHttpExampleFromType(errorCodeType: string): unknown {
	for (const httpStatusCodeType of Object.values(HTTP_STATUS_CODE_MAP)) {
		if (httpStatusCodeType.responseType === errorCodeType) {
			return httpStatusCodeType.example;
		}
	}
}
