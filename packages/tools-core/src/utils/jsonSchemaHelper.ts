// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Is } from "@twin.org/core";
import type { IJsonSchema } from "../models/IJsonSchema.js";

/**
 * Helper class for JSON Schema processing.
 */
export class JsonSchemaHelper {
	/**
	 * The JSON Schema version used.
	 */
	public static readonly SCHEMA_VERSION = "https://json-schema.org/draft/2020-12/schema";

	/**
	 * Process arrays in the schema object.
	 * @param schemaObject The schema object to process.
	 */
	public static processArrays(schemaObject: IJsonSchema): void {
		if (Is.object<IJsonSchema>(schemaObject)) {
			// new json schema version has prefixItems instead of items for arrays with fixed ordering
			// so convert any old style schemas that use items as an array
			// prefixItems validates fixed positions and is an array
			// items validates the rest and is an object
			// additionalItems no longer exists
			// https://www.learnjsonschema.com/2020-12/applicator/items/
			// https://www.learnjsonschema.com/2020-12/applicator/prefixitems/
			if (Is.array(schemaObject.items)) {
				if (Is.array(schemaObject.additionalItems)) {
					// If the items are an array then this is fixed ordering
					// so move to prefixItems and then do the same for additionalItems
					schemaObject.prefixItems = schemaObject.items;
					delete schemaObject.items;
					schemaObject.items = schemaObject.additionalItems;
					delete schemaObject.additionalItems;
				} else if (
					Is.integer(schemaObject.minItems) &&
					Is.integer(schemaObject.maxItems) &&
					schemaObject.minItems === schemaObject.maxItems &&
					schemaObject.maxItems === schemaObject.items.length
				) {
					// There is a fixed number of items which matches the items array length
					// so move construct an allOf to enforce the fixed length
					schemaObject.items = { allOf: schemaObject.items };
					delete schemaObject.minItems;
					delete schemaObject.maxItems;
				} else {
					// no additional items so wrap in an anyOf
					schemaObject.items = { anyOf: schemaObject.items };
				}
			} else {
				// It's an object, so we should just leave this as is
				// as we can't convert to prefixItems, but should
				// remove any additionalItems as this is not valid
				delete schemaObject.additionalItems;
			}

			JsonSchemaHelper.processSchemaDictionary(schemaObject.properties);
			JsonSchemaHelper.processArrays(schemaObject.additionalProperties);
			JsonSchemaHelper.processSchemaArray(schemaObject.allOf);
			JsonSchemaHelper.processSchemaArray(schemaObject.anyOf);
			JsonSchemaHelper.processSchemaArray(schemaObject.oneOf);
		}
	}

	/**
	 * Process arrays in the schema object.
	 * @param schemaDictionary The schema object to process.
	 */
	public static processSchemaDictionary(schemaDictionary?: { [key: string]: IJsonSchema }): void {
		if (Is.object(schemaDictionary)) {
			for (const item of Object.values(schemaDictionary)) {
				if (Is.object<IJsonSchema>(item)) {
					JsonSchemaHelper.processArrays(item);
				}
			}
		}
	}

	/**
	 * Process arrays in the schema object.
	 * @param schemaArray The schema object to process.
	 */
	public static processSchemaArray(schemaArray?: IJsonSchema[]): void {
		if (Is.arrayValue(schemaArray)) {
			for (const item of schemaArray) {
				if (Is.object<IJsonSchema>(item)) {
					JsonSchemaHelper.processArrays(item);
				}
			}
		}
	}

	/**
	 * Cleanup TypeScript markers from the type name.
	 * @param typeName The definition string to clean up.
	 * @returns The cleaned up definition string.
	 */
	public static normaliseTypeName(typeName: string): string {
		// Remove the partial markers
		let sTypeName = typeName.replace(/^Partial<I(.*?)>/g, "$1");
		sTypeName = sTypeName.replace(/Partial%3CI(.*?)%3E/g, "$1");

		// Remove the omit markers
		sTypeName = sTypeName.replace(/^Omit<I(.*?),.*>/g, "$1");
		sTypeName = sTypeName.replace(/Omit%3CI(.*?)%2C.*%3E/g, "$1");

		// Remove the pick markers
		sTypeName = sTypeName.replace(/^Pick<I(.*?),.*>/g, "$1");
		sTypeName = sTypeName.replace(/Pick%3CI(.*?)%2C.*%3E/g, "$1");

		// Cleanup the generic markers
		sTypeName = sTypeName.replace(/^(.*?)<I(.*?)>/g, "$1<$2>");
		sTypeName = sTypeName.replace(/(.*?)%3CI(.*?)%3E/g, "$1<$2>");

		// Cleanup the unknown markers
		sTypeName = sTypeName.replace(/<unknown>/g, "");
		sTypeName = sTypeName.replace(/%3Cunknown%3E/g, "");

		// Replace the other url markers
		sTypeName = sTypeName.replace(/%7C/g, "|").replace(/%3C/g, "<").replace(/%3E/g, ">");

		return sTypeName;
	}

	/**
	 * Extract type from properties definition.
	 * @param allTypes All the known types.
	 * @param schema The schema to extract from.
	 * @param output The output types.
	 */
	public static extractTypesFromSchema(
		allTypes: { [id: string]: IJsonSchema },
		schema: IJsonSchema,
		output: { [id: string]: IJsonSchema }
	): void {
		const additionalTypes = [];

		if (Is.stringValue(schema.$ref)) {
			additionalTypes.push(
				JsonSchemaHelper.normaliseTypeName(schema.$ref.replace("#/definitions/", ""))
			);
		} else if (Is.object<IJsonSchema>(schema.items)) {
			if (Is.arrayValue<IJsonSchema>(schema.items)) {
				for (const itemSchema of schema.items) {
					JsonSchemaHelper.extractTypesFromSchema(allTypes, itemSchema, output);
				}
			} else {
				JsonSchemaHelper.extractTypesFromSchema(allTypes, schema.items, output);
			}
		} else if (Is.object(schema.properties) || Is.object(schema.additionalProperties)) {
			if (Is.object(schema.properties)) {
				for (const prop in schema.properties) {
					const p = schema.properties[prop];
					if (Is.object<IJsonSchema>(p)) {
						JsonSchemaHelper.extractTypesFromSchema(allTypes, p, output);
					}
				}
			}
			if (Is.object(schema.additionalProperties)) {
				JsonSchemaHelper.extractTypesFromSchema(allTypes, schema.additionalProperties, output);
			}
		} else if (Is.arrayValue(schema.anyOf)) {
			for (const prop of schema.anyOf) {
				if (Is.object<IJsonSchema>(prop)) {
					JsonSchemaHelper.extractTypesFromSchema(allTypes, prop, output);
				}
			}
		} else if (Is.arrayValue(schema.oneOf)) {
			for (const prop of schema.oneOf) {
				if (Is.object<IJsonSchema>(prop)) {
					JsonSchemaHelper.extractTypesFromSchema(allTypes, prop, output);
				}
			}
		}

		if (additionalTypes.length > 0) {
			JsonSchemaHelper.extractTypes(allTypes, additionalTypes, output);
		}
	}

	/**
	 * Extract the required types from all the known schemas.
	 * @param allSchemas All the known schemas.
	 * @param requiredTypes The required types.
	 * @param referencedSchemas The references schemas.
	 */
	public static extractTypes(
		allSchemas: { [id: string]: IJsonSchema },
		requiredTypes: string[],
		referencedSchemas: { [id: string]: IJsonSchema }
	): void {
		for (const typeKey of Object.keys(allSchemas)) {
			if (!referencedSchemas[typeKey]) {
				for (const requiredType of requiredTypes) {
					const regex = JsonSchemaHelper.stringToRegEx(requiredType);

					if (regex.test(typeKey)) {
						referencedSchemas[typeKey] = allSchemas[typeKey];
						JsonSchemaHelper.extractTypesFromSchema(
							allSchemas,
							allSchemas[typeKey],
							referencedSchemas
						);
					}
				}
			}
		}
	}

	/**
	 * Expand the types inline.
	 * @param schemas The schemas to include the expanded types.
	 * @param expandedTypes The types to expand.
	 */
	public static expandTypes(schemas: { [id: string]: IJsonSchema }, expandedTypes: string[]): void {
		for (const typeKey of Object.keys(schemas)) {
			const schema = schemas[typeKey];

			JsonSchemaHelper.expandSchemaTypes(schemas, schema, expandedTypes);
		}
	}

	/**
	 * Expand the types inline.
	 * @param allSchemas All the known schemas.
	 * @param schema The schemas to include the expanded types.
	 * @param expandedTypes The types to expand.
	 */
	public static expandSchemaTypes(
		allSchemas: { [id: string]: IJsonSchema },
		schema: IJsonSchema,
		expandedTypes: string[]
	): void {
		if (Is.stringValue(schema.$ref)) {
			for (const expandedType of expandedTypes) {
				const typeName = JsonSchemaHelper.normaliseTypeName(
					schema.$ref.replace("#/definitions/", "")
				);
				const regex = JsonSchemaHelper.stringToRegEx(expandedType);
				if (regex.test(typeName) && allSchemas[typeName]) {
					delete schema.$ref;
					Object.assign(schema, allSchemas[typeName]);
					break;
				}
			}
		} else if (Is.object<IJsonSchema>(schema.items)) {
			if (Is.arrayValue<IJsonSchema>(schema.items)) {
				for (const itemSchema of schema.items) {
					JsonSchemaHelper.expandSchemaTypes(allSchemas, itemSchema, expandedTypes);
				}
			} else {
				JsonSchemaHelper.expandSchemaTypes(allSchemas, schema.items, expandedTypes);
			}
		} else if (Is.object(schema.properties) || Is.object(schema.additionalProperties)) {
			if (Is.object(schema.properties)) {
				for (const prop in schema.properties) {
					const p = schema.properties[prop];
					if (Is.object<IJsonSchema>(p)) {
						JsonSchemaHelper.expandSchemaTypes(allSchemas, p, expandedTypes);
					}
				}
			}
			if (Is.object(schema.additionalProperties)) {
				JsonSchemaHelper.expandSchemaTypes(allSchemas, schema.additionalProperties, expandedTypes);
			}
		} else if (Is.arrayValue(schema.anyOf)) {
			for (const prop of schema.anyOf) {
				if (Is.object<IJsonSchema>(prop)) {
					JsonSchemaHelper.expandSchemaTypes(allSchemas, prop, expandedTypes);
				}
			}
		} else if (Is.arrayValue(schema.oneOf)) {
			for (const prop of schema.oneOf) {
				if (Is.object<IJsonSchema>(prop)) {
					JsonSchemaHelper.expandSchemaTypes(allSchemas, prop, expandedTypes);
				}
			}
		}
	}

	/**
	 * Convert a string pattern to a regular expression.
	 * @param matchPattern The pattern to convert.
	 * @returns The regular expression.
	 */
	public static stringToRegEx(matchPattern: string): RegExp {
		return matchPattern.startsWith("/") && matchPattern.endsWith("/")
			? new RegExp(matchPattern.slice(1, -1))
			: new RegExp(`^${matchPattern}$`);
	}
}
