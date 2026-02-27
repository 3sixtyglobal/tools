// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { CLIDisplay, CLIUtils } from "@twin.org/cli-core";
import { GeneralError, I18n, Is, ObjectHelper, StringHelper } from "@twin.org/core";
import type { Command } from "commander";
import ts from "typescript";
import type { IJsonLdProps } from "../models/IJsonLdProps.js";
import type { ITsToJsonLdContextConfig } from "../models/ITsToJsonLdContextConfig.js";

/**
 * Build the root command to be consumed by the CLI.
 * @param program The command to build on.
 */
export function buildCommandTsToJsonLdContext(program: Command): void {
	program
		.argument(
			I18n.formatMessage("commands.ts-to-jsonld-context.options.config.param"),
			I18n.formatMessage("commands.ts-to-jsonld-context.options.config.description")
		)
		.argument(
			I18n.formatMessage("commands.ts-to-jsonld-context.options.output-file.param"),
			I18n.formatMessage("commands.ts-to-jsonld-context.options.output-file.description")
		)
		.action(async (config, outputFile, opts) => {
			await actionCommandTsToJsonLdContext(config, outputFile, opts);
		});
}

/**
 * Action the root command.
 * @param configFile The optional configuration file.
 * @param outputFile The output file for the schema.
 * @param opts The options for the command.
 */
export async function actionCommandTsToJsonLdContext(
	configFile: string,
	outputFile: string,
	opts: unknown
): Promise<void> {
	let config: ITsToJsonLdContextConfig | undefined;

	const fullConfigFile = path.resolve(configFile);
	const fullOutputFile = path.resolve(outputFile);

	CLIDisplay.value(
		I18n.formatMessage("commands.ts-to-jsonld-context.labels.configJson"),
		fullConfigFile
	);
	CLIDisplay.value(
		I18n.formatMessage("commands.ts-to-jsonld-context.labels.outputFile"),
		fullOutputFile
	);
	CLIDisplay.break();

	try {
		CLIDisplay.task(I18n.formatMessage("commands.ts-to-jsonld-context.progress.loadingConfigJson"));
		CLIDisplay.break();

		config = await CLIUtils.readJsonFile<ITsToJsonLdContextConfig>(fullConfigFile);
	} catch (err) {
		throw new GeneralError(
			"commands",
			"commands.ts-to-jsonld-context.configFailed",
			undefined,
			err
		);
	}

	if (Is.empty(config)) {
		throw new GeneralError("commands", "commands.ts-to-jsonld-context.configFailed");
	}

	CLIDisplay.break();

	await tsToJsonLdContext(config ?? {}, fullOutputFile);

	CLIDisplay.break();
	CLIDisplay.done();
}

/**
 * Convert the TypeScript definitions to JSON-LD Contexts.
 * @param config The configuration for the app.
 * @param outputFile The output file for the schema.
 */
export async function tsToJsonLdContext(
	config: ITsToJsonLdContextConfig,
	outputFile: string
): Promise<void> {
	const program = ts.createProgram(config.types, {});
	const ignoredPropertyNames = new Set<string>(["@context", "type", "@type", "id", "@id"]);

	if (Is.objectValue(config.fixedMappings)) {
		for (const propertyName of Object.keys(config.fixedMappings)) {
			ignoredPropertyNames.add(propertyName);
		}
	}

	const context: { types: string[]; namespaces: string[]; properties: { [id: string]: unknown } } =
		{
			types: [],
			namespaces: [],
			properties: {}
		};

	const processedTypes: { [typeName: string]: IJsonLdProps } = {};

	// Walk the AST for each source file
	for (const sourceFile of program.getSourceFiles()) {
		const resolvedFilename = path.resolve(sourceFile.fileName);
		if (config.types.some(file => resolvedFilename.endsWith(path.resolve(file)))) {
			CLIDisplay.task("Processing", resolvedFilename);

			visit(config, sourceFile, sourceFile, context, program, processedTypes, ignoredPropertyNames);
			CLIDisplay.break();
		}
	}

	const finalObject: {
		"@context": { [key: string]: unknown; "@version": number; "@protected"?: boolean };
	} = {
		"@context": {
			"@version": 1.1
		}
	};

	if (config.includeProtected ?? false) {
		finalObject["@context"]["@protected"] = true;
	}

	finalObject["@context"][config.prefix] = config.contextUrl;

	const usedNamespaces: string[] = ObjectHelper.clone(context.namespaces);
	const idx = usedNamespaces.indexOf(config.prefix);
	if (idx !== -1) {
		usedNamespaces.splice(idx, 1);
	}

	if (Is.objectValue(config.additionalContextUrls)) {
		for (const [key, value] of Object.entries(config.additionalContextUrls)) {
			if (context.namespaces.includes(key)) {
				finalObject["@context"][key] = value;
				const idx2 = usedNamespaces.indexOf(key);
				usedNamespaces.splice(idx2, 1);
			}
		}
	}

	if (usedNamespaces.filter(ns => !ns?.startsWith("http")).length > 0) {
		throw new GeneralError("commands", "commands.ts-to-jsonld-context.namespaceNotInConfig", {
			namespaces: usedNamespaces.join(", ")
		});
	}

	if (Is.objectValue(config.fixedMappings)) {
		for (const [key, value] of Object.entries(config.fixedMappings)) {
			finalObject["@context"][key] = value;
		}
	}

	for (const typeName of context.types) {
		const noPrefixType = StringHelper.stripPrefix(typeName);
		if (!noPrefixType.startsWith("JsonLd")) {
			finalObject["@context"][noPrefixType] = `${config.prefix}:${noPrefixType}`;
		}
	}

	for (const [propertyName, propertyValue] of Object.entries(context.properties).sort((a, b) =>
		a[0].localeCompare(b[0])
	)) {
		finalObject["@context"][propertyName] = propertyValue;
	}

	CLIDisplay.break();
	CLIDisplay.task(
		I18n.formatMessage("commands.ts-to-jsonld-context.labels.writingOutputFile"),
		outputFile
	);
	await writeFile(outputFile, `${JSON.stringify(finalObject, null, 2)}\n`);
}

/**
 * Visit a node in the AST.
 * @param config The configuration for the app.
 * @param node The node to visit.
 * @param sourceFile The source file being processed.
 * @param context The JSON-LD context being built.
 * @param context.types The types collected in the context.
 * @param context.namespaces The namespaces collected in the context.
 * @param context.properties The properties collected in the context.
 * @param program The TypeScript program for resolving inherited interfaces.
 * @param processedTypes The types that have already been processed.
 * @param ignoredJsonLdPropertyNames The JSON-LD property names to ignore in validation.
 */
function visit(
	config: ITsToJsonLdContextConfig,
	node: ts.Node,
	sourceFile: ts.SourceFile,
	context: { types: string[]; namespaces: string[]; properties: { [id: string]: unknown } },
	program: ts.Program,
	processedTypes: { [typeName: string]: IJsonLdProps },
	ignoredJsonLdPropertyNames: Set<string>
): void {
	let jsonLdProps: IJsonLdProps = {};

	// Handle different node types
	if (ts.isInterfaceDeclaration(node)) {
		CLIDisplay.value(
			I18n.formatMessage("commands.ts-to-jsonld-context.labels.model"),
			node.name.text
		);
		context.types.push(node.name.text);

		if (Is.array(node.members)) {
			node.members.forEach(member => {
				if (ts.isPropertySignature(member)) {
					const propertyName = member.name?.getText(sourceFile).replace(/["']/g, "");

					if (Is.stringValue(propertyName)) {
						const jsDocComments: string[] = extractComments(member);

						jsonLdProps = extractJsonLdProps(jsDocComments);

						if (!ignoredJsonLdPropertyNames.has(propertyName) && !Is.objectValue(jsonLdProps)) {
							throw new GeneralError("commands", "commands.ts-to-jsonld-context.noJsonLdProps", {
								propertyName
							});
						}

						const contextInfo: {
							"@id"?: string;
							"@type"?: string;
							"@container"?: string;
						} = {};

						const usedNamespaces: (string | undefined)[] = [];

						if (Is.objectValue(jsonLdProps.propertyId)) {
							usedNamespaces.push(jsonLdProps.propertyId.namespace);
							if (
								!Is.stringValue(jsonLdProps.propertyId.namespace) &&
								isHttpUrl(jsonLdProps.propertyId.id)
							) {
								contextInfo["@id"] = jsonLdProps.propertyId.id;
							} else {
								contextInfo["@id"] =
									`${jsonLdProps.propertyId.namespace ?? config.prefix}:${jsonLdProps.propertyId.id}`;
							}
						} else if (Is.object(jsonLdProps.propertyId)) {
							contextInfo["@id"] = `${config.prefix}:${propertyName}`;
						}

						if (Is.objectValue(jsonLdProps.propertyType)) {
							let fullType =
								jsonLdProps.propertyType.type === "json" ? "@json" : jsonLdProps.propertyType.type;

							if (Is.stringValue(jsonLdProps.propertyType.namespace)) {
								fullType = `${jsonLdProps.propertyType.namespace}:${jsonLdProps.propertyType.type}`;

								usedNamespaces.push(jsonLdProps.propertyType.namespace);
							}

							if (!Is.stringValue(contextInfo["@id"])) {
								contextInfo["@id"] = `${config.prefix}:${propertyName}`;
							}
							contextInfo["@type"] = fullType;
						}

						if (Is.stringValue(jsonLdProps.container)) {
							if (!Is.stringValue(contextInfo["@id"])) {
								contextInfo["@id"] = `${config.prefix}:${propertyName}`;
							}
							contextInfo["@container"] = `@${jsonLdProps.container}`;
						}

						if (Is.objectValue(contextInfo)) {
							if (Is.stringValue(jsonLdProps.namespace)) {
								usedNamespaces.push(jsonLdProps.namespace);
							}
							context.properties[propertyName] = contextInfo;
						}

						for (const ns of usedNamespaces) {
							if (Is.stringValue(ns) && !context.namespaces.includes(ns)) {
								context.namespaces.push(ns);
							}
						}

						CLIDisplay.value(
							I18n.formatMessage("commands.ts-to-jsonld-context.labels.property"),
							propertyName,
							1
						);

						if (Is.objectValue(contextInfo)) {
							CLIDisplay.value("", JSON.stringify(contextInfo), 2);
						}
					}
				}
			});
		}

		processedTypes[node.name.text] = jsonLdProps;

		if (node.heritageClauses) {
			for (const clause of node.heritageClauses) {
				if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
					for (const type of clause.types) {
						const inheritedInterfaceName = extractBaseInterfaceName(type, sourceFile);

						if (!processedTypes[inheritedInterfaceName]) {
							const result = findInterfaceByName(inheritedInterfaceName, program);
							if (result) {
								visit(
									config,
									result.interfaceDeclaration,
									result.sourceFile,
									context,
									program,
									processedTypes,
									ignoredJsonLdPropertyNames
								);
							}
						}
					}
				}
			}
		}
	}

	ts.forEachChild(node, child =>
		visit(config, child, sourceFile, context, program, processedTypes, ignoredJsonLdPropertyNames)
	);
}

/**
 * Find an interface by name in the program.
 * @param interfaceName The name of the interface to find.
 * @param program The TypeScript program.
 * @returns The found interface declaration with its source file or undefined.
 */
function findInterfaceByName(
	interfaceName: string,
	program: ts.Program
): { interfaceDeclaration: ts.InterfaceDeclaration; sourceFile: ts.SourceFile } | undefined {
	for (const sourceFile of program.getSourceFiles()) {
		let foundInterface: ts.InterfaceDeclaration | undefined;

		ts.forEachChild(sourceFile, node => {
			if (ts.isInterfaceDeclaration(node) && node.name.text === interfaceName) {
				foundInterface = node;
			}
		});

		if (foundInterface) {
			return { interfaceDeclaration: foundInterface, sourceFile };
		}
	}

	return undefined;
}

/**
 * Extract JSDoc comments from a property signature.
 * @param member The property signature member.
 * @returns The extracted comments.
 */
function extractComments(member: ts.Node): string[] {
	const jsDocComments: string[] = [];
	const jsDocs = ObjectHelper.propertyGet<ts.JSDoc[] | undefined>(member, "jsDoc");

	if (Is.arrayValue(jsDocs)) {
		for (const doc of jsDocs) {
			if (Is.string(doc.comment)) {
				jsDocComments.push(...doc.comment.split("\n").map(part => part.trim()));
			} else if (Is.arrayValue<string>(doc.comment)) {
				jsDocComments.push(...doc.comment.map(part => part.text));
			}
		}
	}
	return jsDocComments;
}

/**
 * Determine if the value is an HTTP(S) URL.
 * @param value The value to test.
 * @returns True if the value is an HTTP(S) URL.
 */
function isHttpUrl(value: string | undefined): boolean {
	return Is.stringValue(value) && /^https?:\/\//.test(value);
}

/**
 * Parse a qualified value which may contain namespace and id.
 * @param value The value to parse.
 * @returns The parsed namespace and id.
 */
function parseQualifiedValue(value: string): { namespace?: string; id: string } {
	if (isHttpUrl(value)) {
		return { id: value };
	}

	const colonPos = value.indexOf(":");
	if (colonPos > 0 && colonPos < value.length - 1) {
		return {
			namespace: value.slice(0, colonPos),
			id: value.slice(colonPos + 1)
		};
	}

	return { id: value };
}

/**
 * Extract JSON-LD properties from comments.
 * @param comments The comments to extract from.
 * @returns The extracted JSON-LD properties.
 */
function extractJsonLdProps(comments: string[]): IJsonLdProps {
	const jsonLdProps: IJsonLdProps = {};

	for (const comment of comments) {
		if (/^json-ld id$/.exec(comment)) {
			jsonLdProps.propertyId = {};
		} else {
			const idMatch = /^json-ld id:(.*)$/.exec(comment);
			if (idMatch) {
				jsonLdProps.propertyId = parseQualifiedValue(idMatch[1]);
			} else {
				const namespaceMatch = /^json-ld namespace:(.*)/.exec(comment);
				if (namespaceMatch) {
					jsonLdProps.namespace = namespaceMatch[1];
				} else {
					const containerMatch = /^json-ld container:(.*)$/.exec(comment);
					if (containerMatch) {
						jsonLdProps.container = containerMatch[1];
					} else {
						const typeMatch = /^json-ld type:(.*)$/.exec(comment);
						if (typeMatch) {
							const parsedType = parseQualifiedValue(typeMatch[1]);
							jsonLdProps.propertyType = {
								type: parsedType.id,
								namespace: parsedType.namespace
							};
						}
					}
				}
			}
		}
	}

	return jsonLdProps;
}

/**
 * Extract the base interface name from a type reference using the AST.
 * Handles utility types like Omit<InterfaceName, "deleted"> by extracting the first type argument.
 * @param type The type reference expression node.
 * @param sourceFile The source file for extracting text.
 * @returns The base interface name.
 */
function extractBaseInterfaceName(type: ts.TypeReferenceType, sourceFile: ts.SourceFile): string {
	// Check if it's an expression with type arguments (e.g., Omit<Interface, "deleted">)
	if (
		ts.isExpressionWithTypeArguments(type) &&
		type.typeArguments &&
		type.typeArguments.length > 0
	) {
		// Extract the first type argument which should be the interface name
		const firstTypeArg = type.typeArguments[0];
		return firstTypeArg.getText(sourceFile);
	}

	// Otherwise, treat the whole expression as the interface name
	return type.getText(sourceFile);
}
