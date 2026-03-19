// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
/* eslint-disable jsdoc/require-param, jsdoc/require-returns */
import { JsonHelper, ObjectHelper } from "@twin.org/core";
import type { IJsonSchema } from "@twin.org/tools-models";
import * as ts from "typescript";
import { ObjectTransformer } from "./objectTransformer.js";
import type { ITypeScriptToSchemaContext } from "../models/ITypeScriptToSchemaContext.js";

/**
 * Static utility-type schema mapping helpers.
 */
export class UtilityTypeSchemaMapper {
	/**
	 * Map Partial<T> to an object schema with no required properties.
	 * @param context The generation context.
	 * @param typeNode The Partial type reference.
	 * @param resolveUtilityBaseObjectSchema Callback to resolve base object schemas.
	 * @returns The mapped schema.
	 */
	public static mapPartialUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode,
		resolveUtilityBaseObjectSchema: (
			context: ITypeScriptToSchemaContext,
			baseTypeNode: ts.TypeNode
		) => IJsonSchema | undefined
	): IJsonSchema | undefined {
		const baseTypeNode = typeNode.typeArguments?.[0];
		if (!baseTypeNode) {
			return undefined;
		}

		const objectSchema = resolveUtilityBaseObjectSchema(context, baseTypeNode);
		if (objectSchema) {
			const partialSchema = ObjectTransformer.toInlineUtilityObjectSchema(objectSchema);
			delete partialSchema.required;
			return partialSchema;
		}

		return undefined;
	}

	/**
	 * Map Required<T> to an object schema with all properties required.
	 * @param context The generation context.
	 * @param typeNode The Required type reference.
	 * @param resolveUtilityBaseObjectSchema Callback to resolve base object schemas.
	 * @returns The mapped schema.
	 */
	public static mapRequiredUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode,
		resolveUtilityBaseObjectSchema: (
			context: ITypeScriptToSchemaContext,
			baseTypeNode: ts.TypeNode
		) => IJsonSchema | undefined
	): IJsonSchema | undefined {
		const baseTypeNode = typeNode.typeArguments?.[0];
		if (!baseTypeNode) {
			return undefined;
		}

		const objectSchema = resolveUtilityBaseObjectSchema(context, baseTypeNode);
		if (objectSchema) {
			const requiredSchema = ObjectTransformer.toInlineUtilityObjectSchema(objectSchema);
			if (requiredSchema.properties) {
				requiredSchema.required = Object.keys(requiredSchema.properties);
			}
			return requiredSchema;
		}

		return undefined;
	}

	/**
	 * Map Pick<T, K> to an object schema with selected keys preserved.
	 */
	public static mapPickUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode,
		resolveUtilityBaseObjectSchema: (
			context: ITypeScriptToSchemaContext,
			baseTypeNode: ts.TypeNode
		) => IJsonSchema | undefined,
		extractUtilityTypeKeys: (
			context: ITypeScriptToSchemaContext,
			keysNode: ts.TypeNode | undefined
		) => string[]
	): IJsonSchema | undefined {
		const baseTypeNode = typeNode.typeArguments?.[0];
		const pickedKeys = extractUtilityTypeKeys(context, typeNode.typeArguments?.[1]);
		if (!baseTypeNode || pickedKeys.length === 0) {
			return undefined;
		}

		const baseSchema = resolveUtilityBaseObjectSchema(context, baseTypeNode);
		if (baseSchema) {
			return ObjectTransformer.pickKeysFromObjectSchema(baseSchema, pickedKeys);
		}

		return undefined;
	}

	/**
	 * Map Omit<T, K> to an object schema with selected keys removed.
	 */
	public static mapOmitUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode,
		resolveUtilityBaseObjectSchema: (
			context: ITypeScriptToSchemaContext,
			baseTypeNode: ts.TypeNode
		) => IJsonSchema | undefined,
		extractUtilityTypeKeys: (
			context: ITypeScriptToSchemaContext,
			keysNode: ts.TypeNode | undefined
		) => string[]
	): IJsonSchema | undefined {
		const baseTypeNode = typeNode.typeArguments?.[0];
		const omittedKeys = extractUtilityTypeKeys(context, typeNode.typeArguments?.[1]);
		if (!baseTypeNode || omittedKeys.length === 0) {
			return undefined;
		}

		const baseSchema = resolveUtilityBaseObjectSchema(context, baseTypeNode);
		if (baseSchema) {
			return ObjectTransformer.omitKeysFromObjectSchema(baseSchema, omittedKeys);
		}

		return undefined;
	}

	/**
	 * Map Exclude<T, U> to a schema that removes U members from T.
	 */
	public static mapExcludeUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode,
		mapTypeNodeToSchema: (
			context: ITypeScriptToSchemaContext,
			typeNode: ts.TypeNode
		) => IJsonSchema | undefined
	): IJsonSchema | undefined {
		const sourceTypeNode = typeNode.typeArguments?.[0];
		const excludedTypeNode = typeNode.typeArguments?.[1];
		if (!sourceTypeNode || !excludedTypeNode) {
			return undefined;
		}

		const sourceTypes = ts.isUnionTypeNode(sourceTypeNode)
			? sourceTypeNode.types
			: [sourceTypeNode];
		const excludedTypes = ts.isUnionTypeNode(excludedTypeNode)
			? excludedTypeNode.types
			: [excludedTypeNode];

		const sourceSchemas = sourceTypes
			.map(sourceType => mapTypeNodeToSchema(context, sourceType))
			.filter((schema): schema is IJsonSchema => schema !== undefined);
		const excludedSchemas = excludedTypes
			.map(excludedType => mapTypeNodeToSchema(context, excludedType))
			.filter((schema): schema is IJsonSchema => schema !== undefined)
			.map(schema => JsonHelper.canonicalize(schema));

		if (sourceSchemas.length === 0) {
			return undefined;
		}

		const excludedSchemaKeys = new Set(excludedSchemas);
		const remainingSchemas = sourceSchemas.filter(
			schema => !excludedSchemaKeys.has(JsonHelper.canonicalize(schema))
		);

		if (remainingSchemas.length === 0) {
			return undefined;
		}

		if (remainingSchemas.length === 1) {
			return remainingSchemas[0];
		}

		return {
			anyOf: remainingSchemas
		};
	}

	/**
	 * Map Extract<T, U> to a schema that keeps U members from T.
	 */
	public static mapExtractUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode,
		mapTypeNodeToSchema: (
			context: ITypeScriptToSchemaContext,
			typeNode: ts.TypeNode
		) => IJsonSchema | undefined
	): IJsonSchema | undefined {
		const sourceTypeNode = typeNode.typeArguments?.[0];
		const includedTypeNode = typeNode.typeArguments?.[1];
		if (!sourceTypeNode || !includedTypeNode) {
			return undefined;
		}

		const sourceTypes = ts.isUnionTypeNode(sourceTypeNode)
			? sourceTypeNode.types
			: [sourceTypeNode];
		const includedTypes = ts.isUnionTypeNode(includedTypeNode)
			? includedTypeNode.types
			: [includedTypeNode];

		const sourceSchemas = sourceTypes
			.map(sourceType => mapTypeNodeToSchema(context, sourceType))
			.filter((schema): schema is IJsonSchema => schema !== undefined);
		const includedSchemaKeys = new Set(
			includedTypes
				.map(includedType => mapTypeNodeToSchema(context, includedType))
				.filter((schema): schema is IJsonSchema => schema !== undefined)
				.map(schema => JsonHelper.canonicalize(schema))
		);

		if (sourceSchemas.length === 0 || includedSchemaKeys.size === 0) {
			return undefined;
		}

		const matchedSchemas = sourceSchemas.filter(schema =>
			includedSchemaKeys.has(JsonHelper.canonicalize(schema))
		);

		if (matchedSchemas.length === 0) {
			return undefined;
		}

		if (matchedSchemas.length === 1) {
			return matchedSchemas[0];
		}

		return {
			anyOf: matchedSchemas
		};
	}

	/**
	 * Map NonNullable<T> by removing null and undefined branches from T.
	 */
	public static mapNonNullableUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode,
		mapTypeNodeToSchema: (
			context: ITypeScriptToSchemaContext,
			typeNode: ts.TypeNode
		) => IJsonSchema | undefined
	): IJsonSchema | undefined {
		const sourceTypeNode = typeNode.typeArguments?.[0];
		if (!sourceTypeNode) {
			return undefined;
		}

		const sourceTypes = ts.isUnionTypeNode(sourceTypeNode)
			? sourceTypeNode.types
			: [sourceTypeNode];
		const nonNullableTypes = sourceTypes.filter(
			sourceType => !UtilityTypeSchemaMapper.isNullOrUndefinedTypeNode(sourceType)
		);

		if (nonNullableTypes.length === 0) {
			return undefined;
		}

		const mappedSchemas = nonNullableTypes
			.map(sourceType => mapTypeNodeToSchema(context, sourceType))
			.filter((schema): schema is IJsonSchema => schema !== undefined);

		if (mappedSchemas.length === 0) {
			return undefined;
		}

		if (mappedSchemas.length === 1) {
			return mappedSchemas[0];
		}

		const uniqueSchemas = mappedSchemas.filter((schema, index, allSchemas) => {
			const schemaKey = JsonHelper.canonicalize(schema);
			return allSchemas.findIndex(s => JsonHelper.canonicalize(s) === schemaKey) === index;
		});

		if (uniqueSchemas.length === 1) {
			return uniqueSchemas[0];
		}

		return {
			anyOf: uniqueSchemas
		};
	}

	/**
	 * Map Record<K, V> to an object schema with key constraints where possible.
	 */
	public static mapRecordUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode,
		mapTypeNodeToSchema: (
			context: ITypeScriptToSchemaContext,
			typeNode: ts.TypeNode
		) => IJsonSchema | undefined
	): IJsonSchema | undefined {
		const keyTypeNode = typeNode.typeArguments?.[0];
		const valueTypeNode = typeNode.typeArguments?.[1];
		if (!keyTypeNode || !valueTypeNode) {
			return undefined;
		}

		const valueSchema = mapTypeNodeToSchema(context, valueTypeNode);
		if (!valueSchema) {
			return undefined;
		}

		const recordLiteralKeys = UtilityTypeSchemaMapper.extractRecordLiteralKeys(keyTypeNode);
		if (recordLiteralKeys.length > 0) {
			const properties: { [key: string]: IJsonSchema } = {};
			for (const key of recordLiteralKeys) {
				properties[key] = ObjectHelper.clone(valueSchema);
			}
			return {
				type: "object",
				properties,
				required: recordLiteralKeys
			};
		}

		return {
			type: "object",
			additionalProperties: valueSchema
		};
	}

	/**
	 * Map JsonLdObject utility types using key-removal and optional key-addition rules.
	 */
	public static mapJsonLdObjectUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode,
		options: {
			keysToRemove: string[];
			keyToAdd?: "id" | "@id" | "type" | "@type" | "@context";
			isAddedKeyRequired?: boolean;
		},
		resolveUtilityBaseObjectSchema: (
			context: ITypeScriptToSchemaContext,
			baseTypeNode: ts.TypeNode
		) => IJsonSchema | undefined,
		mapTypeNodeToSchema: (
			context: ITypeScriptToSchemaContext,
			typeNode: ts.TypeNode
		) => IJsonSchema | undefined
	): IJsonSchema | undefined {
		const baseTypeNode = typeNode.typeArguments?.[0];
		if (!baseTypeNode) {
			return undefined;
		}

		const baseSchema = resolveUtilityBaseObjectSchema(context, baseTypeNode);
		if (!baseSchema) {
			return undefined;
		}

		const mappedSchema = ObjectTransformer.omitKeysFromObjectSchema(
			baseSchema,
			options.keysToRemove
		);
		if (!options.keyToAdd) {
			return mappedSchema;
		}

		const valueTypeNode = typeNode.typeArguments?.[1];
		const valueSchema = valueTypeNode
			? mapTypeNodeToSchema(context, valueTypeNode)
			: UtilityTypeSchemaMapper.mapJsonLdObjectDefaultSchemaByKey(baseSchema, options.keyToAdd);
		if (!valueSchema) {
			return undefined;
		}

		mappedSchema.type = "object";
		mappedSchema.properties ??= {};
		mappedSchema.properties[options.keyToAdd] = valueSchema;

		if (options.isAddedKeyRequired) {
			const requiredKeys = new Set(mappedSchema.required ?? []);
			requiredKeys.add(options.keyToAdd);
			mappedSchema.required = [...requiredKeys];
		}

		return mappedSchema;
	}

	/**
	 * Map ObjectOrArray<T> to a schema accepting T or T[].
	 */
	public static mapObjectOrArrayUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode,
		mapTypeNodeToSchema: (
			context: ITypeScriptToSchemaContext,
			typeNode: ts.TypeNode
		) => IJsonSchema | undefined
	): IJsonSchema | undefined {
		const baseTypeNode = typeNode.typeArguments?.[0];
		if (!baseTypeNode) {
			return undefined;
		}

		const itemSchema = mapTypeNodeToSchema(context, baseTypeNode);
		if (!itemSchema) {
			return undefined;
		}

		const scalarSchemas =
			Array.isArray(itemSchema.anyOf) && Object.keys(itemSchema).length === 1
				? itemSchema.anyOf
				: [itemSchema];

		return {
			anyOf: [...scalarSchemas, { type: "array", items: itemSchema }]
		};
	}

	/**
	 * Map SingleOccurrenceArray<T, U> to a non-empty array containing exactly one U.
	 */
	public static mapSingleOccurrenceArrayUtilityType(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeReferenceNode,
		mapTypeNodeToSchema: (
			context: ITypeScriptToSchemaContext,
			typeNode: ts.TypeNode
		) => IJsonSchema | undefined
	): IJsonSchema | undefined {
		const primaryTypeNode = typeNode.typeArguments?.[0];
		if (!primaryTypeNode) {
			return undefined;
		}

		const primarySchema = mapTypeNodeToSchema(context, primaryTypeNode);
		if (!primarySchema) {
			return undefined;
		}

		const singleOccurrenceTypeNode = typeNode.typeArguments?.[1];
		if (!singleOccurrenceTypeNode) {
			return {
				type: "array",
				items: primarySchema,
				minItems: 1
			};
		}

		const singleOccurrenceSchema = mapTypeNodeToSchema(context, singleOccurrenceTypeNode);
		if (!singleOccurrenceSchema) {
			return {
				type: "array",
				items: primarySchema,
				minItems: 1
			};
		}

		if (
			JsonHelper.canonicalize(primarySchema) === JsonHelper.canonicalize(singleOccurrenceSchema)
		) {
			return {
				type: "array",
				items: primarySchema,
				minItems: 1
			};
		}

		const itemSchema: IJsonSchema = {
			anyOf: [primarySchema, singleOccurrenceSchema]
		};

		return {
			type: "array",
			items: itemSchema,
			contains: singleOccurrenceSchema,
			minContains: 1,
			maxContains: 1,
			minItems: 1
		};
	}

	/**
	 * Determine whether a type node represents null or undefined.
	 */
	private static isNullOrUndefinedTypeNode(typeNode: ts.TypeNode): boolean {
		if (
			typeNode.kind === ts.SyntaxKind.NullKeyword ||
			typeNode.kind === ts.SyntaxKind.UndefinedKeyword
		) {
			return true;
		}

		if (ts.isLiteralTypeNode(typeNode)) {
			return typeNode.literal.kind === ts.SyntaxKind.NullKeyword;
		}

		if (ts.isTypeReferenceNode(typeNode) && ts.isIdentifier(typeNode.typeName)) {
			return typeNode.typeName.text === "undefined";
		}

		return false;
	}

	/**
	 * Extract literal keys from a Record key type argument.
	 */
	private static extractRecordLiteralKeys(keyTypeNode: ts.TypeNode): string[] {
		if (ts.isLiteralTypeNode(keyTypeNode) && ts.isStringLiteral(keyTypeNode.literal)) {
			return [keyTypeNode.literal.text];
		}

		if (ts.isUnionTypeNode(keyTypeNode)) {
			const keys = keyTypeNode.types
				.filter(type => ts.isLiteralTypeNode(type) && ts.isStringLiteral(type.literal))
				.map(type => (type as ts.LiteralTypeNode).literal as ts.StringLiteral)
				.map(literal => literal.text);
			return keys.length === keyTypeNode.types.length ? keys : [];
		}

		return [];
	}

	/**
	 * Resolve a default schema for JsonLdObject utility key additions when the type argument is omitted.
	 */
	private static mapJsonLdObjectDefaultSchemaByKey(
		baseSchema: IJsonSchema,
		keyToAdd: "id" | "@id" | "type" | "@type" | "@context"
	): IJsonSchema {
		if (keyToAdd === "id" || keyToAdd === "@id") {
			return UtilityTypeSchemaMapper.mapJsonLdObjectWithIdDefaultIdSchema(baseSchema);
		}

		if (keyToAdd === "@context") {
			return UtilityTypeSchemaMapper.mapJsonLdObjectWithContextDefaultContextSchema(baseSchema);
		}

		return UtilityTypeSchemaMapper.mapJsonLdObjectWithTypeDefaultTypeSchema(baseSchema);
	}

	/**
	 * Resolve default id schema for JsonLdObjectWithId when Id type argument is omitted.
	 */
	private static mapJsonLdObjectWithIdDefaultIdSchema(baseSchema: IJsonSchema): IJsonSchema {
		return UtilityTypeSchemaMapper.mapJsonLdObjectDefaultEitherSchema(baseSchema, "id", "@id", {
			type: "string"
		});
	}

	/**
	 * Resolve default type schema for JsonLdObjectWithType when Type argument is omitted.
	 */
	private static mapJsonLdObjectWithTypeDefaultTypeSchema(baseSchema: IJsonSchema): IJsonSchema {
		return UtilityTypeSchemaMapper.mapJsonLdObjectDefaultEitherSchema(baseSchema, "type", "@type", {
			anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }]
		});
	}

	/**
	 * Resolve default context schema for JsonLdObjectWithContext when Context argument is omitted.
	 */
	private static mapJsonLdObjectWithContextDefaultContextSchema(
		baseSchema: IJsonSchema
	): IJsonSchema {
		return UtilityTypeSchemaMapper.mapJsonLdObjectDefaultEitherSchema(
			baseSchema,
			"@context",
			"@context",
			{
				type: "array",
				items: { type: "string" }
			}
		);
	}

	/**
	 * Resolve default schema from either of two source keys, with fallback when both are absent.
	 */
	private static mapJsonLdObjectDefaultEitherSchema(
		baseSchema: IJsonSchema,
		firstKey: string,
		secondKey: string,
		fallbackSchema: IJsonSchema
	): IJsonSchema {
		const firstSchema = ObjectTransformer.resolvePropertySchemaFromObjectSchema(
			baseSchema,
			firstKey
		);
		const secondSchema = ObjectTransformer.resolvePropertySchemaFromObjectSchema(
			baseSchema,
			secondKey
		);

		if (firstSchema && secondSchema) {
			if (JsonHelper.canonicalize(firstSchema) === JsonHelper.canonicalize(secondSchema)) {
				return firstSchema;
			}

			return {
				anyOf: [firstSchema, secondSchema]
			};
		}

		if (firstSchema) {
			return firstSchema;
		}

		if (secondSchema) {
			return secondSchema;
		}

		return fallbackSchema;
	}
}
