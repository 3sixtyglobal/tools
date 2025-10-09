// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type {
	IAcceptedResponse,
	IBadRequestResponse,
	IConflictResponse,
	ICreatedResponse,
	IForbiddenResponse,
	IInternalServerErrorResponse,
	INoContentResponse,
	INotFoundResponse,
	IOkResponse,
	IUnauthorizedResponse,
	IUnprocessableEntityResponse
} from "@twin.org/api-models";
import { nameof } from "@twin.org/nameof";
import { HttpStatusCode } from "@twin.org/web";

export const HTTP_STATUS_CODE_MAP: {
	[id: string]: {
		code: HttpStatusCode;
		responseType: string;
		example?: unknown;
	};
} = {
	ok: {
		code: HttpStatusCode.ok,
		responseType: nameof<IOkResponse>()
	},
	created: {
		code: HttpStatusCode.created,
		responseType: nameof<ICreatedResponse>()
	},
	accepted: {
		code: HttpStatusCode.accepted,
		responseType: nameof<IAcceptedResponse>()
	},
	noContent: {
		code: HttpStatusCode.noContent,
		responseType: nameof<INoContentResponse>()
	},
	badRequest: {
		code: HttpStatusCode.badRequest,
		responseType: nameof<IBadRequestResponse>(),
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
		responseType: nameof<IUnauthorizedResponse>(),
		example: {
			name: "UnauthorizedError",
			message: "errorMessage"
		}
	},
	forbidden: {
		code: HttpStatusCode.forbidden,
		responseType: nameof<IForbiddenResponse>(),
		example: {
			name: "NotImplementedError",
			message: "errorMessage",
			properties: {
				method: "aMethod"
			}
		}
	},
	notFound: {
		code: HttpStatusCode.notFound,
		responseType: nameof<INotFoundResponse>(),
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
		responseType: nameof<IConflictResponse>(),
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
		responseType: nameof<IInternalServerErrorResponse>(),
		example: {
			name: "InternalServerError",
			message: "errorMessage"
		}
	},
	unprocessableEntity: {
		code: HttpStatusCode.unprocessableEntity,
		responseType: nameof<IUnprocessableEntityResponse>(),
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
