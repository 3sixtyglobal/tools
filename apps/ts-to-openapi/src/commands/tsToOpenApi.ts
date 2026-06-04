// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { CLIDisplay, CLIUtils } from "@twin.org/cli-core";
import { GeneralError, I18n, Is, ObjectHelper, StringHelper } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import { Constants, TypeScriptToSchema } from "@twin.org/tools-core";
import {
	type IJsonSchema,
	type IOpenApi,
	type IOpenApiExample,
	type IOpenApiHeader,
	type IOpenApiPathItem,
	type IOpenApiPathMethod,
	type IOpenApiResponse,
	type IOpenApiSecurityScheme,
	type IPackageJson,
	OpenApiConstants,
	type OpenApiParameterLocation,
	type OpenApiParameterStyle
} from "@twin.org/tools-models";
import { HttpStatusCode, MimeTypes } from "@twin.org/web";
import type { Command } from "commander";
import {
	HTTP_STATUS_CODE_MAP,
	getHttpExampleFromType,
	getHttpStatusCodeFromType
} from "./httpStatusCodeMap.js";
import type { IInputPath } from "../models/IInputPath.js";
import type { IInputResult } from "../models/IInputResult.js";
import type { IRestRoute } from "../models/IRestRoute.js";
import type { IRestRouteEntryPoint } from "../models/IRestRouteEntryPoints.js";
import type { ITag } from "../models/ITag.js";
import type { ITsToOpenApiConfig } from "../models/ITsToOpenApiConfig.js";
import type { ITsToOpenApiConfigEntryPoint } from "../models/ITsToOpenApiConfigEntryPoint.js";

/**
 * Build the root command to be consumed by the CLI.
 * @param program The command to build on.
 */
export function buildCommandTsToOpenApi(program: Command): void {
	program
		.argument(
			I18n.formatMessage("commands.ts-to-openapi.options.config.param"),
			I18n.formatMessage("commands.ts-to-openapi.options.config.description")
		)
		.argument(
			I18n.formatMessage("commands.ts-to-openapi.options.output-file.param"),
			I18n.formatMessage("commands.ts-to-openapi.options.output-file.description")
		)
		.action(async (config, outputFile, opts) => {
			await actionCommandTsToOpenApi(config, outputFile, opts);
		});
}

/**
 * Action the root command.
 * @param configFile The optional configuration file.
 * @param outputFile The output file for the generation OpenApi spec.
 * @param opts The options for the command.
 */
export async function actionCommandTsToOpenApi(
	configFile: string,
	outputFile: string,
	opts: unknown
): Promise<void> {
	let outputWorkingDir: string | undefined;
	try {
		let config: ITsToOpenApiConfig | undefined;

		const fullConfigFile = path.resolve(configFile);
		const fullOutputFile = path.resolve(outputFile);
		outputWorkingDir = path.join(path.dirname(fullOutputFile), "working");

		CLIDisplay.value(
			I18n.formatMessage("commands.ts-to-openapi.labels.configJson"),
			fullConfigFile
		);
		CLIDisplay.value(
			I18n.formatMessage("commands.ts-to-openapi.labels.outputFile"),
			fullOutputFile
		);
		CLIDisplay.value(
			I18n.formatMessage("commands.ts-to-openapi.labels.outputWorkingDir"),
			outputWorkingDir
		);
		CLIDisplay.break();

		try {
			CLIDisplay.task(I18n.formatMessage("commands.ts-to-openapi.progress.loadingConfigJson"));
			CLIDisplay.break();

			config = await CLIUtils.readJsonFile<ITsToOpenApiConfig>(fullConfigFile);
		} catch (err) {
			throw new GeneralError("commands", "commands.ts-to-openapi.configFailed", undefined, err);
		}

		if (Is.empty(config)) {
			throw new GeneralError("commands", "commands.ts-to-openapi.configFailed");
		}

		CLIDisplay.task(I18n.formatMessage("commands.ts-to-openapi.progress.creatingWorkingDir"));
		await mkdir(outputWorkingDir, { recursive: true });
		CLIDisplay.break();

		await tsToOpenApi(config ?? {}, fullOutputFile, outputWorkingDir);

		CLIDisplay.break();
		CLIDisplay.done();
	} finally {
		try {
			if (outputWorkingDir) {
				await rm(outputWorkingDir, { recursive: true });
			}
		} catch {}
	}
}

/**
 * Convert the TypeScript definitions to OpenAPI spec.
 * @param config The configuration for the app.
 * @param outputFile The location of the file to output the OpenAPI spec.
 * @param workingDirectory The folder the app was run from.
 */
export async function tsToOpenApi(
	config: ITsToOpenApiConfig,
	outputFile: string,
	workingDirectory: string
): Promise<void> {
	await writeFile(
		path.join(workingDirectory, "package.json"),
		JSON.stringify(
			{
				version: "1.0.0",
				name: "ts-to-openapi-working",
				dependencies: {}
			},
			undefined,
			"\t"
		)
	);

	const openApi: IOpenApi = {
		openapi: OpenApiConstants.API_VERSION,
		info: {
			title: config.title,
			description: config.description,
			version: config.version,
			license: {
				name: config.licenseName,
				url: config.licenseUrl
			}
		},
		servers: Is.arrayValue(config.servers) ? config.servers.map(s => ({ url: s })) : undefined,
		tags: [],
		paths: {}
	};

	CLIDisplay.task(I18n.formatMessage("commands.ts-to-openapi.progress.creatingSecuritySchemas"));
	CLIDisplay.break();

	const authSecurity: { [name: string]: string[] }[] = [];
	const securitySchemes: { [name: string]: IOpenApiSecurityScheme } = {};

	buildSecurity(config, securitySchemes, authSecurity);

	const responseCodes: string[] = [];
	const inputResults: IInputResult[] = [];
	const typeRoots: string[] = [];
	const restRoutesAndTags = await loadPackages(config, workingDirectory, typeRoots);

	for (const restRouteAndTag of restRoutesAndTags) {
		const paths = await processPackageRestDetails(restRouteAndTag.restRoutes);
		inputResults.push({
			paths,
			tags: restRouteAndTag.tags
		});
	}

	CLIDisplay.task(I18n.formatMessage("commands.ts-to-openapi.progress.generatingSchemas"));

	const generatedSchemas = await generateSchemas(typeRoots);

	for (let i = 0; i < inputResults.length; i++) {
		const result = inputResults[i];
		for (const tag of result.tags) {
			const exists = openApi.tags?.find(t => t.name === tag.name);
			if (!exists) {
				openApi.tags?.push(tag);
			}
		}

		for (const inputPath of result.paths) {
			const responses: ({ code?: HttpStatusCode } & IOpenApiResponse)[] = [];
			const responseTypes = inputPath.responseType;

			const pathSpecificAuthSecurity: { [name: string]: string[] }[] = [];

			if (authSecurity.length > 0 && !inputPath.skipAuth) {
				pathSpecificAuthSecurity.push(...authSecurity);
			}

			if (pathSpecificAuthSecurity.length > 0) {
				responseTypes.push({
					statusCode: HttpStatusCode.unauthorized,
					type: "IUnauthorizedResponse"
				});
			}

			for (const responseType of responseTypes) {
				const responseSchema = resolveSchema(generatedSchemas, responseType.type);
				const isBinaryOctetStream = responseType.type === nameof<Uint8Array>();
				if (responseSchema || isBinaryOctetStream) {
					let headers: { [id: string]: IOpenApiHeader } | undefined;
					let examples: { [id: string]: IOpenApiExample } | undefined;

					if (Is.arrayValue(responseType.examples)) {
						for (const example of responseType.examples) {
							if (
								Is.object<{ headers: { [id: string]: string | string[] }; body: unknown }>(
									example.response
								)
							) {
								if (Is.objectValue(example.response.headers)) {
									headers ??= {};
									const headersSchema = Is.object<IJsonSchema>(responseSchema?.properties?.headers)
										? responseSchema.properties.headers
										: undefined;
									for (const header in example.response.headers) {
										const headerValue = example.response.headers[header];
										const propertySchema = headersSchema?.properties?.[header];
										const schemaType = Is.object<IJsonSchema>(propertySchema)
											? propertySchema?.type
											: undefined;
										headers[header] = {
											schema: {
												type: Is.string(schemaType) ? schemaType : "string"
											},
											description: `e.g. ${
												Is.array(headerValue) ? headerValue.join(",") : headerValue
											}`
										};
									}
								}
								if (!Is.undefined(example.response.body)) {
									examples ??= {};
									examples[example.id] = {
										summary: example.description,
										value: example.response.body
									};
								}
							}
						}
					} else {
						const statusExample = getHttpExampleFromType(responseType.type);
						if (statusExample) {
							examples = {};
							examples.exampleResponse = {
								value: statusExample
							};
						}
					}

					let mimeType: string;
					let schemaType: string | undefined;
					let schemaFormat: string | undefined;
					let schemaRef: string | undefined;
					let description = responseSchema?.description ?? responseType.type;

					if (Is.stringValue(responseType.mimeType)) {
						mimeType = responseType.mimeType;
					} else if (isBinaryOctetStream) {
						mimeType = "application/octet-stream";
					} else {
						const hasBody = Is.notEmpty(responseSchema?.properties?.body);
						if (hasBody) {
							mimeType = MimeTypes.Json;
						} else {
							mimeType = MimeTypes.PlainText;
						}
					}

					// Perform some special handling for binary octet-streams to produce a nicer spec output
					if (isBinaryOctetStream) {
						schemaType = "string";
						schemaFormat = "binary";
						schemaRef = undefined;
						description = "Binary data";
						if (Is.objectValue<IOpenApiExample>(examples)) {
							const exampleKeys = Object.keys(examples);

							const firstExample = examples[exampleKeys[0]];
							description = firstExample.summary ?? description;
							firstExample.summary = "Binary Data";

							for (const exampleKey in examples) {
								examples[exampleKey].value = "";
							}
						}
					} else {
						schemaRef = `#/components/schemas/${StringHelper.stripPrefix(responseType.type)}`;
					}

					responses.push({
						code: responseType.statusCode,
						description,
						content:
							responseType.type === "ICreatedResponse" || responseType.type === "INoContentResponse"
								? undefined
								: {
										[mimeType]: {
											schema: {
												$ref: schemaRef,
												type: schemaType,
												format: schemaFormat
											},
											examples
										}
									},
						headers
					});
				}
			}

			if (inputPath.responseCodes.length > 0) {
				for (const responseCode of inputPath.responseCodes) {
					const responseCodeDetails = HTTP_STATUS_CODE_MAP[responseCode];
					// Only include the response code if it hasn't already been
					// included with a specific response
					if (!responseTypes.some(r => r.statusCode === responseCodeDetails.code)) {
						if (!responseCodes.includes(responseCode)) {
							responseCodes.push(responseCode);
						}

						let examples: { [id: string]: IOpenApiExample } | undefined;

						if (responseCodeDetails.example) {
							examples = {
								exampleResponse: {
									value: responseCodeDetails.example
								}
							};
						}

						const responseCodeSchema = resolveSchema(
							generatedSchemas,
							responseCodeDetails.responseType
						);
						if (responseCodeSchema) {
							responses.push({
								code: responseCodeDetails.code,
								description: responseCodeSchema.description ?? responseCodeDetails.responseType,
								content: {
									[MimeTypes.Json]: {
										schema: {
											$ref: `#/components/schemas/${StringHelper.stripPrefix(responseCodeDetails.responseType)}`
										},
										examples
									}
								}
							});
						}
					}
				}
			}

			const pathQueryHeaderParams: {
				name: string;
				description?: string;
				required: boolean;
				in: OpenApiParameterLocation;
				schema: IJsonSchema;
				style?: OpenApiParameterStyle;
				example?: unknown;
			}[] = inputPath.pathParameters.map(p => ({
				name: p,
				description: "",
				required: true,
				schema: {
					type: "string"
				},
				in: "path",
				style: "simple"
			}));

			const requestExample = inputPath.requestExamples?.[0]?.request as {
				pathParams: { [id: string]: string };
				headers: { [id: string]: string };
				query: { [id: string]: string };
			};

			if (Is.object(requestExample?.pathParams)) {
				for (const pathOrQueryParam of pathQueryHeaderParams) {
					if (requestExample.pathParams[pathOrQueryParam.name]) {
						pathOrQueryParam.example = requestExample.pathParams[pathOrQueryParam.name];
					}
				}
			}

			let requestObject: IJsonSchema | undefined = inputPath.requestType
				? resolveSchema(generatedSchemas, inputPath.requestType)
				: undefined;

			if (requestObject?.properties) {
				// If there are any properties other than body, query, pathParams and headers
				// we should throw an error as we don't know what to do with them
				const otherKeys = Object.keys(requestObject.properties).filter(
					k => !["body", "query", "pathParams", "headers"].includes(k)
				);
				if (otherKeys.length > 0) {
					throw new GeneralError("commands", "commands.ts-to-openapi.unsupportedProperties", {
						keys: otherKeys.join(", ")
					});
				}

				// We only allow specific simple constructs in query and path params.
				const simpleSchemaKeys = ["type", "enum", "anyOf", "oneOf", "allOf", "$ref"];

				// If there is a path params object convert these to params
				if (Is.object<IJsonSchema>(requestObject.properties.pathParams)) {
					for (const pathParam of pathQueryHeaderParams) {
						const prop = requestObject.properties.pathParams.properties?.[pathParam.name];
						if (Is.object<IJsonSchema>(prop)) {
							pathParam.description = prop.description ?? pathParam.description;

							pathParam.schema = {};
							for (const key of simpleSchemaKeys) {
								if (!Is.empty(prop[key])) {
									pathParam.schema[key] = prop[key];
								}
							}
							pathParam.required = true;
							delete requestObject.properties.pathParams.properties?.[pathParam.name];
						}
					}
					delete requestObject.properties.pathParams;
				}

				// If there is a query object convert these to params as well
				if (Is.object<IJsonSchema>(requestObject.properties.query)) {
					for (const prop in requestObject.properties.query.properties) {
						const queryProp = requestObject.properties.query.properties[prop];
						if (Is.object<IJsonSchema>(queryProp)) {
							let example: unknown;
							if (Is.object(requestExample.query) && requestExample.query[prop]) {
								example = requestExample.query[prop];
							}

							const schema: IJsonSchema = {};
							for (const key of simpleSchemaKeys) {
								if (!Is.empty(queryProp[key])) {
									schema[key] = queryProp[key];
								}
							}

							const pathQueryHeaderParam = {
								name: prop,
								description: queryProp.description,
								required: Boolean(requestObject.required?.includes(prop)),
								schema,
								in: "query" as OpenApiParameterLocation,
								example
							};

							pathQueryHeaderParams.push(pathQueryHeaderParam);
							delete requestObject.properties.query.properties[prop];
						}
					}
					delete requestObject.properties.query;
				}

				// If there are headers in the object convert these to spec params
				if (Is.object<IJsonSchema>(requestObject.properties.headers)) {
					const headerProperties = requestObject.properties.headers.properties;

					for (const prop in headerProperties) {
						const headerSchema = headerProperties[prop];
						if (Is.object<IJsonSchema>(headerSchema)) {
							let example: unknown;
							if (Is.object(requestExample.headers) && requestExample.headers[prop]) {
								example = requestExample.headers[prop];
							}

							pathQueryHeaderParams.push({
								name: prop,
								description: headerSchema.description,
								required: true,
								schema: {
									type: "string"
								},
								in: "header",
								style: "simple",
								example
							});
						}
					}
					delete requestObject.properties.headers;
				}

				// If we have used all the properties from the object in the
				// path we should remove it.
				if (Object.keys(requestObject.properties).length === 0 && inputPath.requestType) {
					deleteSchema(generatedSchemas, inputPath.requestType);
					requestObject = undefined;
				}
			}

			if (config.restRoutes) {
				let fullPath = StringHelper.trimTrailingSlashes(inputPath.path);
				if (fullPath.length === 0) {
					fullPath = "/";
				}
				openApi.paths ??= {};
				const openApiPaths = openApi.paths;
				openApiPaths[fullPath] ??= {};
				const pathItem = openApiPaths[fullPath];

				const method = inputPath.method.toLowerCase() as keyof Pick<
					IOpenApiPathItem,
					"get" | "put" | "post" | "delete" | "options" | "head" | "patch"
				>;

				const operation = {
					operationId: inputPath.operationId,
					summary: inputPath.summary,
					tags: [inputPath.tag],
					parameters:
						pathQueryHeaderParams.length > 0
							? pathQueryHeaderParams.map(p => ({
									name: p.name,
									description: p.description,
									in: p.in,
									required: p.required,
									schema: p.schema,
									style: p.style,
									example: p.example
								}))
							: undefined
				} as IOpenApiPathMethod;
				pathItem[method] = operation;

				const pathOperation: IOpenApiPathMethod | undefined = pathItem[method];

				if (pathSpecificAuthSecurity.length > 0) {
					if (pathOperation) {
						pathOperation.security = pathSpecificAuthSecurity;
					}
				}

				if (requestObject && inputPath.requestType) {
					let examples: { [id: string]: IOpenApiExample } | undefined;
					if (Is.arrayValue(inputPath.requestExamples)) {
						for (const example of inputPath.requestExamples) {
							if (
								Is.object<{ body: unknown }>(example.request) &&
								!Is.undefined(example.request.body)
							) {
								examples ??= {};
								examples[example.id] = {
									summary: example.description,
									value: example.request.body
								};
							}
						}
					}

					let requestMimeType: string;
					if (Is.stringValue(inputPath.requestMimeType)) {
						requestMimeType = inputPath.requestMimeType;
					} else {
						const requestSchema = resolveSchema(generatedSchemas, inputPath.requestType);
						const hasBody = Is.notEmpty(requestSchema?.properties?.body);
						if (hasBody) {
							requestMimeType = MimeTypes.Json;
						} else {
							requestMimeType = MimeTypes.PlainText;
						}
					}

					if (pathOperation) {
						pathOperation.requestBody = {
							description: requestObject.description,
							required: true,
							content: {
								[requestMimeType]: {
									schema: {
										$ref: `#/components/schemas/${StringHelper.stripPrefix(inputPath.requestType)}`
									},
									examples
								}
							}
						};
					}
				}

				if (responses.length > 0) {
					const openApiResponses: { [code: string]: IOpenApiResponse } = {};
					for (const response of responses) {
						const code = response.code;
						if (code) {
							delete response.code;
							openApiResponses[code] ??= { description: "" };
							openApiResponses[code] = ObjectHelper.merge(openApiResponses[code], response);
						}
					}
					if (pathOperation) {
						pathOperation.responses = openApiResponses;
					}
				} else if (pathOperation) {
					pathOperation.responses = {};
				}
			}
		}
	}

	await finaliseOutput(
		generatedSchemas,
		openApi,
		securitySchemes,
		config.externalReferences,
		outputFile
	);
}

/**
 * Finalise the schemas and output the spec.
 * @param generatedSchemas The generated schemas with package information.
 * @param openApi The OpenAPI spec.
 * @param securitySchemes The security schemes.
 * @param externalReferences The external references.
 * @param outputFile The output file.
 */
async function finaliseOutput(
	generatedSchemas: { [packageName: string]: { [schemaName: string]: IJsonSchema } },
	openApi: IOpenApi,
	securitySchemes: { [name: string]: IOpenApiSecurityScheme },
	externalReferences: { [type: string]: string } | undefined,
	outputFile: string
): Promise<void> {
	CLIDisplay.break();
	CLIDisplay.task(I18n.formatMessage("commands.ts-to-openapi.progress.finalisingSchemas"));

	const { finalSchemas, substituteSchemas } = prepareFinalSchemas(
		generatedSchemas,
		externalReferences
	);

	removeStandardSchemas(finalSchemas);
	applyRefOnlySchemaSubstitutions(openApi, substituteSchemas);

	const sortedSchemas = buildSortedPrunedSchemas(openApi, finalSchemas, generatedSchemas);

	// Schemas that have been kept as local component schemas must not have their
	// $ref values in paths rewritten to external URLs.
	const localSchemaNames = new Set(Object.keys(sortedSchemas));
	rewriteExternalSchemaReferences(sortedSchemas, externalReferences);
	rewriteExternalSchemaReferences(openApi.paths, externalReferences, localSchemaNames);

	openApi.components = {
		schemas: sortedSchemas,
		securitySchemes
	};

	validateComponentSchemaRefs(openApi);

	CLIDisplay.task(
		I18n.formatMessage("commands.ts-to-openapi.progress.writingOutputFile"),
		outputFile
	);

	try {
		await mkdir(path.dirname(outputFile), { recursive: true });
	} catch {}
	await writeFile(outputFile, `${JSON.stringify(openApi, undefined, "\t")}\n`);
}

/**
 * Collect all local component schema $ref names referenced anywhere in a value.
 * @param value The value to scan.
 * @param refs The set of ref names to populate.
 */
function collectComponentSchemaRefs(value: unknown, refs: Set<string>): void {
	if (Is.array(value)) {
		for (const item of value) {
			collectComponentSchemaRefs(item, refs);
		}
		return;
	}
	if (Is.object(value)) {
		if (Is.string(value.$ref) && value.$ref.startsWith("#/components/schemas/")) {
			refs.add(value.$ref.slice("#/components/schemas/".length));
		}
		for (const child of Object.values(value)) {
			collectComponentSchemaRefs(child, refs);
		}
	}
}

/**
 * Validate that every local component schema $ref in paths resolves to a defined schema.
 * @param openApi The OpenAPI spec to validate.
 * @throws GeneralError if any local component schema $ref does not resolve to a defined schema.
 */
function validateComponentSchemaRefs(openApi: IOpenApi): void {
	const refs = new Set<string>();
	collectComponentSchemaRefs(openApi.paths, refs);
	collectComponentSchemaRefs(openApi.components?.schemas, refs);
	const schemas = openApi.components?.schemas ?? {};
	const missing = [...refs].filter(name => !(name in schemas));
	if (missing.length > 0) {
		throw new GeneralError("commands", "commands.ts-to-openapi.unresolvedComponentRefs", {
			refs: missing.join(", ")
		});
	}
}

/**
 * Prepare schemas for final component output and collect schema substitutions.
 * Works directly with allPackageSchemas to preserve all definitions across packages.
 * @param generatedSchemas The generated schemas with package information.
 * @param externalReferences The external reference mappings.
 * @returns The prepared schemas and substitutions.
 */
function prepareFinalSchemas(
	generatedSchemas: { [packageName: string]: { [schemaName: string]: IJsonSchema } },
	externalReferences: { [type: string]: string } | undefined
): {
	finalSchemas: { [id: string]: IJsonSchema };
	substituteSchemas: { from: string; to: string }[];
} {
	const substituteSchemas: { from: string; to: string }[] = [];
	const finalSchemas: { [id: string]: IJsonSchema } = {};

	// Build a map of all schemas across all packages
	const allSchemasMap: { [id: string]: IJsonSchema } = {};
	for (const packageName in generatedSchemas) {
		const packageSchemas = generatedSchemas[packageName];
		for (const schemaName in packageSchemas) {
			// Use the unqualified name for first occurrence (non-conflict case)
			if (!(schemaName in allSchemasMap)) {
				allSchemasMap[schemaName] = packageSchemas[schemaName];
			}
		}
	}

	for (const schema in allSchemasMap) {
		const props = allSchemasMap[schema].properties;
		let skipSchema = false;
		let isLocalWrapper = false;

		if (Is.object<{ [id: string]: IJsonSchema | boolean }>(props)) {
			tidySchemaProperties(props, true);

			// Any request/response objects should be added to the final schemas
			// but only the body property, if there is no body then we don't
			// need to add it to the schemas
			if (schema.endsWith("Response") || schema.endsWith("Request")) {
				if (Is.object<IJsonSchema>(props.body)) {
					allSchemasMap[schema] = props.body;
					// Body was extracted from a local API wrapper type; external reference
					// patterns must not override this — the schema stays in components.
					isLocalWrapper = true;
				} else {
					// Body is absent or a boolean schema (true = any, false = never).
					// Emit an empty schema {} to prevent dangling $refs in paths that
					// reference this type, while still keeping it in components.
					allSchemasMap[schema] = {};
					isLocalWrapper = true;
				}
			}
		}

		// If the schema is external then remove it from the final schemas.
		// Local API wrapper types (Request/Response schemas whose body was extracted)
		// are always kept as local component schemas regardless of external ref patterns.
		if (!isLocalWrapper && resolveExternalReference(schema, externalReferences)) {
			skipSchema = true;
		}

		if (!skipSchema) {
			// If the final schema has no properties and is just a ref to another object type
			// then replace the references with that of the referenced type.
			const ref = allSchemasMap[schema].$ref;
			if (!Is.arrayValue(allSchemasMap[schema].properties) && Is.stringValue(ref)) {
				substituteSchemas.push({ from: schema, to: ref });
			} else {
				finalSchemas[StringHelper.stripPrefix(schema)] = allSchemasMap[schema];
			}
		}
	}

	return {
		finalSchemas,
		substituteSchemas
	};
}

/**
 * Remove standard schemas that should not appear in the final OpenAPI output.
 * @param finalSchemas The final schemas map.
 */
function removeStandardSchemas(finalSchemas: { [id: string]: IJsonSchema }): void {
	const removeTypes = ["HttpStatusCode", ...Constants.ARRAY_NUMBER_TYPE_NAMES];
	for (const type of removeTypes) {
		delete finalSchemas[type];
	}
}

/**
 * Apply substitutions for ref-only wrapper schemas to path refs.
 * @param openApi The OpenAPI document.
 * @param substituteSchemas The collected schema substitutions.
 */
function applyRefOnlySchemaSubstitutions(
	openApi: IOpenApi,
	substituteSchemas: { from: string; to: string }[]
): void {
	const refOnlySubstitutions: { from: string; to: string }[] = [];
	const componentsPrefix = "#/components/schemas/";

	for (const substitution of substituteSchemas) {
		if (substitution.to.startsWith(componentsPrefix)) {
			refOnlySubstitutions.push({
				from: StringHelper.stripPrefix(substitution.from),
				to: StringHelper.stripPrefix(substitution.to.slice(componentsPrefix.length))
			});
		}
	}

	if (refOnlySubstitutions.length > 0) {
		rewriteSchemaRefs(openApi.paths, refOnlySubstitutions);
	}
}

/**
 * Apply equivalent-response schema substitutions to paths and final schemas.
 * @param openApi The OpenAPI document.
 * @param finalSchemas The final schemas map.
 * @param substituteSchemas The collected schema substitutions.
 */
/**
 * Build sorted and tidied schemas from the current OpenAPI references.
 * @param openApi The OpenAPI document.
 * @param finalSchemas The candidate schemas.
 * @param generatedSchemas The generated schemas with package information.
 * @returns The sorted schema map.
 */
function buildSortedPrunedSchemas(
	openApi: IOpenApi,
	finalSchemas: { [id: string]: IJsonSchema },
	generatedSchemas: { [packageName: string]: { [schemaName: string]: IJsonSchema } }
): { [id: string]: IJsonSchema } {
	const prunedSchemas = pruneToReferencedSchemas(openApi, finalSchemas, generatedSchemas);
	const prunedSchemaKeys = Object.keys(prunedSchemas);
	prunedSchemaKeys.sort();

	const sortedSchemas: { [id: string]: IJsonSchema } = {};
	for (const key of prunedSchemaKeys) {
		tidySchemaProperties(prunedSchemas[key], false);
		delete prunedSchemas[key].title;
		sortedSchemas[key] = prunedSchemas[key];
	}

	return sortedSchemas;
}

/**
 * Prune schemas to only those referenced by the OpenAPI document and their transitive dependencies.
 * @param openApi The generated OpenAPI document.
 * @param schemas The candidate schemas.
 * @param generatedSchemas The generated schemas with package information.
 * @returns The pruned schemas.
 */
function pruneToReferencedSchemas(
	openApi: IOpenApi,
	schemas: { [id: string]: IJsonSchema },
	generatedSchemas: { [packageName: string]: { [schemaName: string]: IJsonSchema } }
): { [id: string]: IJsonSchema } {
	const referencedSchemaNames = new Set<string>();
	const pendingSchemaNames: string[] = [];

	const enqueueSchemaRef = (ref: string): void => {
		const schemaName = normaliseSchemaRefName(ref, generatedSchemas);
		if (schemaName && !referencedSchemaNames.has(schemaName)) {
			referencedSchemaNames.add(schemaName);
			pendingSchemaNames.push(schemaName);
		}
	};

	collectSchemaRefs(openApi.paths, enqueueSchemaRef);

	while (pendingSchemaNames.length > 0) {
		const schemaName = pendingSchemaNames.pop();
		if (schemaName) {
			collectSchemaRefs(schemas[schemaName], enqueueSchemaRef);
		}
	}

	const prunedSchemas: { [id: string]: IJsonSchema } = {};
	for (const schemaName of referencedSchemaNames) {
		const schema = schemas[schemaName];
		if (Is.object<IJsonSchema>(schema)) {
			prunedSchemas[schemaName] = schema;
		}
	}

	return prunedSchemas;
}

/**
 * Rewrite schema refs using the provided substitutions.
 * @param value The value to rewrite.
 * @param substitutions The schema substitutions.
 */
function rewriteSchemaRefs(value: unknown, substitutions: { from: string; to: string }[]): void {
	if (Is.array(value)) {
		for (const item of value) {
			rewriteSchemaRefs(item, substitutions);
		}
		return;
	}

	if (Is.object<{ $ref?: unknown }>(value)) {
		if (Is.stringValue(value.$ref)) {
			for (const substitution of substitutions) {
				if (value.$ref === `#/components/schemas/${substitution.from}`) {
					value.$ref = `#/components/schemas/${substitution.to}`;
				}
			}
		}

		for (const objectValue of Object.values(value)) {
			rewriteSchemaRefs(objectValue, substitutions);
		}
	}
}

/**
 * Collect schema references from a value.
 * @param value The value to inspect.
 * @param onRef The callback for each schema ref.
 */
function collectSchemaRefs(value: unknown, onRef: (ref: string) => void): void {
	if (Is.array(value)) {
		for (const item of value) {
			collectSchemaRefs(item, onRef);
		}
		return;
	}

	if (Is.object<{ $ref?: unknown }>(value)) {
		if (Is.stringValue(value.$ref)) {
			onRef(value.$ref);
		}

		for (const objectValue of Object.values(value)) {
			collectSchemaRefs(objectValue, onRef);
		}
	}
}

/**
 * Normalise a schema ref to a component schema name.
 * Resolves the canonical schema name from a schema reference by searching all packages.
 * @param ref The schema ref.
 * @param generatedSchemas The generated schemas with package information.
 * @returns The normalised schema name if it exists.
 */
function normaliseSchemaRefName(
	ref: string,
	generatedSchemas: { [packageName: string]: { [schemaName: string]: IJsonSchema } }
): string | undefined {
	const refParts = ref.split("/");
	const rawName = refParts[refParts.length - 1];
	if (!Is.stringValue(rawName)) {
		return undefined;
	}

	const schemaName = StringHelper.stripPrefix(rawName);

	// Search across all packages for the schema
	for (const packageName in generatedSchemas) {
		const packageSchemas = generatedSchemas[packageName];
		if (schemaName in packageSchemas) {
			return schemaName;
		}
	}

	return undefined;
}

/**
 * Rewrite component schema refs to external refs when configured.
 * @param value The object to walk and rewrite in place.
 * @param externalReferences The external reference mappings.
 * @param preservedSchemas An optional set of local component schema names whose refs must not be rewritten.
 */
function rewriteExternalSchemaReferences(
	value: unknown,
	externalReferences: { [type: string]: string } | undefined,
	preservedSchemas?: Set<string>
): void {
	if (!Is.object(externalReferences)) {
		return;
	}

	if (Is.array(value)) {
		for (const item of value) {
			rewriteExternalSchemaReferences(item, externalReferences, preservedSchemas);
		}
		return;
	}

	if (Is.object<{ $ref?: unknown }>(value)) {
		if (Is.stringValue(value.$ref)) {
			const schemaPrefix = "#/components/schemas/";
			if (value.$ref.startsWith(schemaPrefix)) {
				const schemaName = value.$ref.slice(schemaPrefix.length);
				if (!preservedSchemas?.has(schemaName)) {
					const externalReference = resolveExternalReference(schemaName, externalReferences);
					if (Is.stringValue(externalReference)) {
						value.$ref = externalReference;
					}
				}
			}
		}

		for (const objectValue of Object.values(value)) {
			rewriteExternalSchemaReferences(objectValue, externalReferences, preservedSchemas);
		}
	}
}

/**
 * Resolve a schema name to an external reference URL if configured.
 * @param schemaName The schema name.
 * @param externalReferences The external reference mappings.
 * @returns The external reference URL if matched.
 */
function resolveExternalReference(
	schemaName: string,
	externalReferences: { [type: string]: string } | undefined
): string | undefined {
	if (!Is.object(externalReferences)) {
		return undefined;
	}

	const schemaCandidates = [schemaName, StringHelper.stripPrefix(schemaName)].filter(candidate =>
		Is.stringValue(candidate)
	);

	for (const external in externalReferences) {
		const re = new RegExp(`^${external}$`);
		for (const candidate of schemaCandidates) {
			if (re.test(candidate)) {
				return candidate.replace(re, externalReferences[external]);
			}
		}
	}

	return undefined;
}

/**
 * Build the security schemas from the config.
 * @param config The configuration.
 * @param securitySchemes The security schemes.
 * @param authSecurity The auth security.
 */
function buildSecurity(
	config: ITsToOpenApiConfig,
	securitySchemes: { [name: string]: IOpenApiSecurityScheme },
	authSecurity: { [name: string]: string[] }[]
): void {
	if (Is.arrayValue(config.authMethods)) {
		for (const authMethod of config.authMethods) {
			const security: { [name: string]: string[] } = {};
			if (authMethod === "basic") {
				securitySchemes.basicAuthScheme = {
					type: "http",
					scheme: "basic"
				};
				security.basicAuthScheme = [];
			} else if (authMethod === "jwtBearer") {
				securitySchemes.jwtBearerAuthScheme = {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT"
				};
				security.jwtBearerAuthScheme = [];
			} else if (authMethod === "jwtCookie") {
				securitySchemes.jwtCookieAuthScheme = {
					type: "apiKey",
					in: "cookie",
					name: "auth_token"
				};
				security.jwtCookieAuthScheme = [];
			}
			authSecurity.push(security);
		}
	}
}

/**
 * Process the REST details for a package.
 * @param restRoutes The REST routes to process.
 * @returns The paths and schemas for the input.
 * @internal
 */
async function processPackageRestDetails(restRoutes: IRestRoute[]): Promise<IInputPath[]> {
	const paths: IInputPath[] = [];

	CLIDisplay.task(I18n.formatMessage("commands.ts-to-openapi.progress.processingRoutes"));

	for (const route of restRoutes) {
		CLIDisplay.value(
			I18n.formatMessage("commands.ts-to-openapi.labels.route"),
			`${route.operationId} ${route.method} ${route.path}`,
			1
		);
		const pathParameters: string[] = [];

		const pathPaths = route.path.split("/");
		const finalPathParts = [];
		for (const part of pathPaths) {
			if (part.startsWith(":")) {
				finalPathParts.push(`{${part.slice(1)}}`);
				pathParameters.push(part.slice(1));
			} else {
				finalPathParts.push(part);
			}
		}

		const responseType: {
			statusCode: HttpStatusCode;
			type: string;
			mimeType?: string;
			description?: string;
			examples?: {
				id: string;
				description?: string;
				response: unknown;
			}[];
		}[] = [];

		// If there is no response type automatically add a success
		if (Is.empty(route.responseType)) {
			// But only if we haven't got a response already for different content type
			if (responseType.length === 0) {
				responseType.push({
					type: "IOkResponse",
					statusCode: HttpStatusCode.ok
				});
			}
		} else if (Is.array(route.responseType)) {
			// Find the response codes for the response types
			for (const rt of route.responseType) {
				const responseCode = getHttpStatusCodeFromType(rt.type);
				responseType.push({
					...rt,
					mimeType: rt.mimeType,
					statusCode: responseCode,
					examples: rt.examples
				});
			}
		}

		const inputPath: IInputPath = {
			path: finalPathParts.join("/"),
			method: route.method,
			pathParameters,
			operationId: route.operationId,
			tag: route.tag,
			summary: route.summary,
			requestType: route.requestType?.type,
			requestMimeType: route.requestType?.mimeType,
			requestExamples: route.requestType?.examples,
			responseType,
			responseCodes: ["badRequest", "internalServerError"],
			skipAuth: route.skipAuth ?? false
		};

		const handlerSource = route.handler.toString();

		let match;
		const re = /httpstatuscode\.([_a-z]*)/gi;
		while ((match = re.exec(handlerSource)) !== null) {
			inputPath.responseCodes.push(match[1]);
		}

		paths.push(inputPath);
	}

	CLIDisplay.break();

	return paths;
}

/**
 * Generate schemas for the models.
 * Preserves all schema definitions from all packages in allPackageSchemas.
 * Each package's schemas are tracked separately to prevent any data loss.
 * @param modelDirWildcards The filenames for all the models.
 * @returns The generated schemas with package provenance information.
 * @internal
 */
async function generateSchemas(
	modelDirWildcards: string[]
): Promise<{ [packageName: string]: { [schemaName: string]: IJsonSchema } }> {
	const typeScriptToSchema = new TypeScriptToSchema();
	const allPackageSchemas: { [packageName: string]: { [schemaName: string]: IJsonSchema } } = {};

	for (const files of modelDirWildcards) {
		CLIDisplay.value(
			I18n.formatMessage("commands.ts-to-openapi.progress.models"),
			files.replace(/\\/g, "/"),
			1
		);

		await typeScriptToSchema.generateSchema(
			"#/components/schemas/",
			"@twin.org/ts-to-openapi",
			allPackageSchemas,
			files
		);
	}

	return allPackageSchemas;
}

/**
 * Resolve a schema by its raw or stripped interface type name.
 * Searches across all packages in allPackageSchemas to find the schema.
 * When multiple packages define the same schema, returns the first match found.
 * @param generatedSchemas The generated schemas with package information.
 * @param typeName The type name.
 * @returns The resolved schema if present.
 */
function resolveSchema(
	generatedSchemas: { [packageName: string]: { [schemaName: string]: IJsonSchema } },
	typeName: string | undefined
): IJsonSchema | undefined {
	if (!Is.stringValue(typeName)) {
		return undefined;
	}

	const strippedName = StringHelper.stripPrefix(typeName);

	// Search across all packages for the schema
	for (const packageName in generatedSchemas) {
		const packageSchemas = generatedSchemas[packageName];
		if (typeName in packageSchemas) {
			return packageSchemas[typeName];
		}
		if (strippedName !== typeName && strippedName in packageSchemas) {
			return packageSchemas[strippedName];
		}
	}

	return undefined;
}

/**
 * Delete a schema by its raw or stripped interface type name.
 * Removes the schema from all packages that define it.
 * @param generatedSchemas The generated schemas with package information.
 * @param typeName The type name.
 */
function deleteSchema(
	generatedSchemas: { [packageName: string]: { [schemaName: string]: IJsonSchema } },
	typeName: string | undefined
): void {
	if (!Is.stringValue(typeName)) {
		return;
	}

	const strippedName = StringHelper.stripPrefix(typeName);

	for (const packageName in generatedSchemas) {
		const packageSchemas = generatedSchemas[packageName];
		delete packageSchemas[typeName];
		if (strippedName !== typeName) {
			delete packageSchemas[strippedName];
		}
	}
}

/**
 * Tidy up schemas for OpenAPI context.
 * Removes unsupported schema keywords and normalises nested property schemas.
 * @param value The schema value to tidy.
 * @param removeRefDescriptions Whether to remove descriptions from $ref objects.
 * @internal
 */
function tidySchemaProperties(value: unknown, removeRefDescriptions: boolean): void {
	if (Is.array(value)) {
		for (const item of value) {
			tidySchemaProperties(item, removeRefDescriptions);
		}
		return;
	}

	if (Is.object<{ [id: string]: unknown; $ref?: unknown; description?: unknown }>(value)) {
		delete value.$schema;
		delete value.$id;
		delete value.$comment;

		if (removeRefDescriptions) {
			for (const prop of Object.keys(value)) {
				const schemaProperty = value[prop];
				if (Is.object<IJsonSchema>(schemaProperty)) {
					// For OpenAPI we don't include a description for items that have refs.
					if (schemaProperty.$ref) {
						delete schemaProperty.description;
					}

					if (schemaProperty.properties) {
						tidySchemaProperties(schemaProperty.properties, true);
					}

					if (
						schemaProperty.items &&
						Is.object<IJsonSchema>(schemaProperty.items) &&
						Is.object<IJsonSchema>(schemaProperty.items.properties)
					) {
						tidySchemaProperties(schemaProperty.items.properties, true);
					}
				}
			}
		} else {
			for (const objectValue of Object.values(value)) {
				tidySchemaProperties(objectValue, false);
			}
		}
	}
}

/**
 * Load the packages from config and get the routes and tags from them.
 * @param tsToOpenApiConfig The app config.
 * @param outputWorkingDir The working directory.
 * @param typeRoots The model roots.
 * @returns The routes and tags for each package.
 * @internal
 */
async function loadPackages(
	tsToOpenApiConfig: ITsToOpenApiConfig,
	outputWorkingDir: string,
	typeRoots: string[]
): Promise<
	{
		restRoutes: IRestRoute[];
		tags: ITag[];
	}[]
> {
	const restRoutes: {
		restRoutes: IRestRoute[];
		tags: ITag[];
	}[] = [];

	let localNpmRoot = await CLIUtils.findNpmRoot(process.cwd());
	localNpmRoot = localNpmRoot.replace(/[/\\]node_modules/, "");

	const packages: string[] = [];
	const localPackages: string[] = [];

	for (const configRestRoutes of tsToOpenApiConfig.restRoutes) {
		if (Is.stringValue(configRestRoutes.package)) {
			const existsLocally = await CLIUtils.dirExists(
				path.join(localNpmRoot, "node_modules", configRestRoutes.package)
			);
			if (existsLocally) {
				if (!localPackages.includes(configRestRoutes.package)) {
					localPackages.push(configRestRoutes.package);
				}
			} else {
				const version = configRestRoutes.version ?? "latest";
				const newPackage = `${configRestRoutes.package}@${version}`;
				if (!packages.includes(newPackage)) {
					packages.push(`${configRestRoutes.package}@${version}`);
				}
			}
		}
	}

	if (packages.length > 0) {
		CLIDisplay.task(
			I18n.formatMessage("commands.ts-to-openapi.progress.installingNpmPackages"),
			packages.join(" ")
		);
		await CLIUtils.runShellCmd("npm", ["install", ...packages], outputWorkingDir);
		CLIDisplay.break();
	}

	for (const configRestRoutes of tsToOpenApiConfig.restRoutes) {
		const typeFolders = ["models", "errors"];
		const packageName = configRestRoutes.package;
		const packageRoot = configRestRoutes.packageRoot;
		if (!Is.stringValue(packageName) && !Is.stringValue(packageRoot)) {
			throw new GeneralError("commands", "commands.ts-to-openapi.packageNameOrRootMissing");
		}

		let rootFolder;
		let npmResolveFolder;
		if (Is.stringValue(packageName)) {
			if (localPackages.includes(packageName)) {
				npmResolveFolder = localNpmRoot;
				rootFolder = path.join(localNpmRoot, "node_modules", packageName);
			} else {
				npmResolveFolder = outputWorkingDir;
				rootFolder = path.join(outputWorkingDir, "node_modules", packageName);

				const downloadedPackageExists = await CLIUtils.dirExists(rootFolder);
				if (!downloadedPackageExists) {
					throw new GeneralError("commands", "commands.ts-to-openapi.packageResolutionFailed", {
						package: packageName,
						workingDir: outputWorkingDir
					});
				}
			}
		} else {
			rootFolder = path.resolve(packageRoot ?? "");
			npmResolveFolder = rootFolder;
		}

		const pkgJson = (await CLIUtils.readJsonFile<IPackageJson>(
			path.join(rootFolder, "package.json")
		)) ?? { name: "" };
		CLIDisplay.task(
			I18n.formatMessage("commands.ts-to-openapi.progress.processingPackage"),
			pkgJson.name
		);

		for (const typeFolder of typeFolders) {
			const typesDir = path.join(rootFolder, "dist", "types", typeFolder);
			if (await CLIUtils.dirExists(typesDir)) {
				const newRoot = path.join(typesDir, "**/*.ts");
				if (!typeRoots.includes(newRoot)) {
					typeRoots.push(newRoot);
				}
			}
		}
		if (pkgJson.dependencies) {
			const nodeModulesFolder = await CLIUtils.findNpmRoot(npmResolveFolder);
			for (const dep in pkgJson.dependencies) {
				if (dep.startsWith("@twin.org")) {
					for (const typeFolder of typeFolders) {
						const typesDirDep = path.join(nodeModulesFolder, dep, "dist", "types", typeFolder);
						if (await CLIUtils.dirExists(typesDirDep)) {
							const newRoot = path.join(typesDirDep, "**/*.ts");
							if (!typeRoots.includes(newRoot)) {
								typeRoots.push(newRoot);
							}
						}
					}
				}
			}
		}

		CLIDisplay.task(
			I18n.formatMessage("commands.ts-to-openapi.progress.importingModule"),
			pkgJson.name
		);

		const pkg = await import(pathToFileURL(path.join(rootFolder, "dist/es/index.js")).href);

		if (!Is.array(pkg.restEntryPoints)) {
			throw new GeneralError("commands", "commands.ts-to-openapi.missingRestRoutesEntryPoints", {
				method: "restEntryPoints",
				package: pkgJson.name
			});
		}

		const packageEntryPoints: IRestRouteEntryPoint[] = pkg.restEntryPoints;

		const entryPoints: ITsToOpenApiConfigEntryPoint[] =
			configRestRoutes.entryPoints ?? packageEntryPoints.map(e => ({ name: e.name }));

		for (const entryPoint of entryPoints) {
			const packageEntryPoint = packageEntryPoints.find(e => e.name === entryPoint.name);

			if (!Is.object<IRestRouteEntryPoint>(packageEntryPoint)) {
				throw new GeneralError("commands", "commands.ts-to-openapi.missingRestRoutesEntryPoint", {
					entryPoint: entryPoint.name,
					package: pkgJson.name
				});
			}

			let baseRouteName = StringHelper.trimTrailingSlashes(
				entryPoint.baseRoutePath ?? packageEntryPoint.defaultBaseRoute ?? ""
			);

			if (baseRouteName.length > 0) {
				baseRouteName = `/${StringHelper.trimLeadingSlashes(baseRouteName)}`;
			}

			let routes: IRestRoute[] = packageEntryPoint.generateRoutes(baseRouteName, "dummy-service");

			routes = routes.filter(r => !(r.excludeFromSpec ?? false));

			if (Is.stringValue(entryPoint.operationIdDistinguisher)) {
				for (const route of routes) {
					route.operationId = `${route.operationId}${entryPoint.operationIdDistinguisher}`;
				}
			}

			restRoutes.push({
				restRoutes: routes,
				tags: packageEntryPoint.tags
			});
		}

		CLIDisplay.break();
	}

	return restRoutes;
}
