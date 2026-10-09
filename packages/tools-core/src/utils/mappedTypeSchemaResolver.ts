// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Is, JsonHelper } from "@3sixty/core";
import type { IJsonSchema } from "@3sixty/tools-models";
import * as ts from "typescript";
import { JsonSchemaBuilder } from "./jsonSchemaBuilder.js";
import type { ITypeScriptToSchemaContext } from "../models/ITypeScriptToSchemaContext.js";

/**
 * Static mapped-type schema transformation helpers.
 */
export class MappedTypeSchemaResolver {
	/**
	 * Resolve mapped type output keys, including remapped key names via `as`.
	 * @param context The generation context.
	 * @param typeNode The mapped type node.
	 * @param mappedKeys The resolved source keys from the mapped type constraint.
	 * @param mappedTypeParameterName The mapped type parameter identifier.
	 * @returns The resolved source-to-output mapped key entries.
	 */
	public static resolveMappedTypePropertyEntries(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.MappedTypeNode,
		mappedKeys: string[],
		mappedTypeParameterName: string
	): { sourceKey: string; mappedKey: string }[] | undefined {
		if (!typeNode.nameType) {
			return mappedKeys.map(mappedKey => ({ sourceKey: mappedKey, mappedKey }));
		}

		const mappedEntries: { sourceKey: string; mappedKey: string }[] = [];

		for (const sourceKey of mappedKeys) {
			const mappedKey = MappedTypeSchemaResolver.resolveMappedTypeRemappedKey(
				context,
				typeNode.nameType,
				sourceKey,
				mappedTypeParameterName
			);
			if (mappedKey !== null && !Is.stringValue(mappedKey)) {
				return undefined;
			}
			if (Is.stringValue(mappedKey)) {
				mappedEntries.push({ sourceKey, mappedKey });
			}
		}

		return mappedEntries;
	}

	/**
	 * Resolve a remapped mapped-type key expression for a concrete source key.
	 * @param context The generation context.
	 * @param nameTypeNode The mapped type name remapping expression node.
	 * @param sourceKey The concrete source key currently being evaluated.
	 * @param mappedTypeParameterName The mapped type parameter identifier.
	 * @returns The remapped key, null when excluded via never, or undefined when unresolved.
	 */
	public static resolveMappedTypeRemappedKey(
		context: ITypeScriptToSchemaContext,
		nameTypeNode: ts.TypeNode,
		sourceKey: string,
		mappedTypeParameterName: string
	): string | null | undefined {
		if (ts.isParenthesizedTypeNode(nameTypeNode)) {
			return MappedTypeSchemaResolver.resolveMappedTypeRemappedKey(
				context,
				nameTypeNode.type,
				sourceKey,
				mappedTypeParameterName
			);
		}

		if (nameTypeNode.kind === ts.SyntaxKind.NeverKeyword) {
			return null;
		}

		if (JsonSchemaBuilder.isMappedTypeParameterReference(nameTypeNode, mappedTypeParameterName)) {
			return sourceKey;
		}

		if (ts.isLiteralTypeNode(nameTypeNode)) {
			if (ts.isStringLiteral(nameTypeNode.literal) || ts.isNumericLiteral(nameTypeNode.literal)) {
				return nameTypeNode.literal.text;
			}
			if (nameTypeNode.literal.kind === ts.SyntaxKind.TrueKeyword) {
				return "true";
			}
			if (nameTypeNode.literal.kind === ts.SyntaxKind.FalseKeyword) {
				return "false";
			}
		}

		if (ts.isIntersectionTypeNode(nameTypeNode)) {
			const hasMappedKeyReference = nameTypeNode.types.some(type =>
				JsonSchemaBuilder.isMappedTypeParameterReference(type, mappedTypeParameterName)
			);
			const hasStringKeyword = nameTypeNode.types.some(
				type => type.kind === ts.SyntaxKind.StringKeyword
			);
			if (hasMappedKeyReference && hasStringKeyword) {
				return sourceKey;
			}
			return undefined;
		}

		if (ts.isTemplateLiteralTypeNode(nameTypeNode)) {
			let remappedKey = nameTypeNode.head.text;
			for (const span of nameTypeNode.templateSpans) {
				const spanValue = MappedTypeSchemaResolver.resolveMappedTypeRemappedKey(
					context,
					span.type,
					sourceKey,
					mappedTypeParameterName
				);
				if (!Is.stringValue(spanValue)) {
					return undefined;
				}
				remappedKey += `${spanValue}${span.literal.text}`;
			}

			return remappedKey;
		}

		if (ts.isTypeReferenceNode(nameTypeNode) && ts.isIdentifier(nameTypeNode.typeName)) {
			const intrinsicName = nameTypeNode.typeName.text;
			if (nameTypeNode.typeArguments?.length === 1) {
				const intrinsicInput = MappedTypeSchemaResolver.resolveMappedTypeRemappedKey(
					context,
					nameTypeNode.typeArguments[0],
					sourceKey,
					mappedTypeParameterName
				);
				if (!Is.stringValue(intrinsicInput)) {
					return undefined;
				}

				return MappedTypeSchemaResolver.applyIntrinsicMappedTypeKeyRemap(
					intrinsicName,
					intrinsicInput
				);
			}
		}

		if (ts.isConditionalTypeNode(nameTypeNode)) {
			if (
				!JsonSchemaBuilder.isMappedTypeParameterReference(
					nameTypeNode.checkType,
					mappedTypeParameterName
				)
			) {
				return undefined;
			}

			const satisfies = MappedTypeSchemaResolver.evaluateMappedKeyExtendsCondition(
				context,
				sourceKey,
				nameTypeNode.extendsType
			);
			if (satisfies === undefined) {
				return undefined;
			}

			const branchType = satisfies ? nameTypeNode.trueType : nameTypeNode.falseType;
			return MappedTypeSchemaResolver.resolveMappedTypeRemappedKey(
				context,
				branchType,
				sourceKey,
				mappedTypeParameterName
			);
		}

		return undefined;
	}

	/**
	 * Evaluate whether a concrete mapped key satisfies an `extends` condition.
	 * @param context The generation context.
	 * @param sourceKey The concrete source key being evaluated.
	 * @param extendsTypeNode The extends condition type node.
	 * @returns True when the key satisfies the condition, false when it does not, otherwise undefined.
	 */
	public static evaluateMappedKeyExtendsCondition(
		context: ITypeScriptToSchemaContext,
		sourceKey: string,
		extendsTypeNode: ts.TypeNode
	): boolean | undefined {
		if (ts.isParenthesizedTypeNode(extendsTypeNode)) {
			return MappedTypeSchemaResolver.evaluateMappedKeyExtendsCondition(
				context,
				sourceKey,
				extendsTypeNode.type
			);
		}

		if (
			extendsTypeNode.kind === ts.SyntaxKind.StringKeyword ||
			extendsTypeNode.kind === ts.SyntaxKind.AnyKeyword ||
			extendsTypeNode.kind === ts.SyntaxKind.UnknownKeyword
		) {
			return true;
		}

		if (
			extendsTypeNode.kind === ts.SyntaxKind.NeverKeyword ||
			extendsTypeNode.kind === ts.SyntaxKind.NumberKeyword ||
			extendsTypeNode.kind === ts.SyntaxKind.BooleanKeyword ||
			extendsTypeNode.kind === ts.SyntaxKind.ObjectKeyword
		) {
			return false;
		}

		if (ts.isLiteralTypeNode(extendsTypeNode)) {
			if (
				ts.isStringLiteral(extendsTypeNode.literal) ||
				ts.isNumericLiteral(extendsTypeNode.literal)
			) {
				return sourceKey === extendsTypeNode.literal.text;
			}
			return false;
		}

		if (ts.isUnionTypeNode(extendsTypeNode)) {
			let hasUndetermined = false;
			for (const memberType of extendsTypeNode.types) {
				const result = MappedTypeSchemaResolver.evaluateMappedKeyExtendsCondition(
					context,
					sourceKey,
					memberType
				);
				if (result === true) {
					return true;
				}
				if (result === undefined) {
					hasUndetermined = true;
				}
			}
			return hasUndetermined ? undefined : false;
		}

		if (
			ts.isTypeOperatorNode(extendsTypeNode) &&
			extendsTypeNode.operator === ts.SyntaxKind.KeyOfKeyword
		) {
			const keys = JsonSchemaBuilder.extractKeyofTypeKeys(context, extendsTypeNode.type);
			if (keys.length > 0) {
				return keys.includes(sourceKey);
			}
			return undefined;
		}

		if (ts.isTypeReferenceNode(extendsTypeNode)) {
			const resolved = JsonSchemaBuilder.resolveReferencedTypeNodeFromLocalDeclaration(
				context,
				extendsTypeNode
			);
			if (resolved) {
				return MappedTypeSchemaResolver.evaluateMappedKeyExtendsCondition(
					context,
					sourceKey,
					resolved
				);
			}
		}

		return undefined;
	}

	/**
	 * Build a conservative fallback schema for mapped types whose key remapping cannot be resolved.
	 * @param context The generation context.
	 * @param typeNode The mapped type node.
	 * @param mappedKeys The resolved source keys from the mapped type constraint.
	 * @param mappedTypeParameterName The mapped type parameter identifier.
	 * @param sourceObjectSchema The optional source object schema for property lookups.
	 * @returns The fallback mapped type schema.
	 */
	public static buildMappedTypeFallbackSchema(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.MappedTypeNode,
		mappedKeys: string[],
		mappedTypeParameterName: string,
		sourceObjectSchema?: IJsonSchema
	): IJsonSchema {
		const additionalProperties =
			MappedTypeSchemaResolver.buildMappedTypeFallbackAdditionalProperties(
				context,
				typeNode,
				mappedKeys,
				mappedTypeParameterName,
				sourceObjectSchema
			);

		return {
			type: "object",
			additionalProperties: additionalProperties ?? {}
		};
	}

	/**
	 * Build fallback additionalProperties for unresolved mapped key remapping.
	 * @param context The generation context.
	 * @param typeNode The mapped type node.
	 * @param mappedKeys The resolved source keys from the mapped type constraint.
	 * @param mappedTypeParameterName The mapped type parameter identifier.
	 * @param sourceObjectSchema The optional source object schema for property lookups.
	 * @returns The fallback additionalProperties schema.
	 */
	public static buildMappedTypeFallbackAdditionalProperties(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.MappedTypeNode,
		mappedKeys: string[],
		mappedTypeParameterName: string,
		sourceObjectSchema?: IJsonSchema
	): IJsonSchema | undefined {
		const resolvedPropertySchemas = mappedKeys
			.map(mappedKey =>
				JsonSchemaBuilder.mapMappedTypePropertySchema(
					context,
					typeNode,
					mappedKey,
					mappedTypeParameterName,
					sourceObjectSchema
				)
			)
			.filter((mappedType): mappedType is IJsonSchema => mappedType !== undefined);

		if (resolvedPropertySchemas.length === 0) {
			return undefined;
		}

		const uniqueSchemas = resolvedPropertySchemas.filter((schema, index, allSchemas) => {
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
	 * Merge mapped property schemas when multiple source keys remap to the same output key.
	 * @param existingSchema The existing schema already assigned to the mapped key.
	 * @param nextSchema The next schema to merge into the mapped key.
	 * @returns The merged schema.
	 */
	public static mergeMappedTypePropertySchemas(
		existingSchema: IJsonSchema,
		nextSchema: IJsonSchema
	): IJsonSchema {
		const schemaVariants = [
			...(existingSchema.anyOf ?? [existingSchema]),
			...(nextSchema.anyOf ?? [nextSchema])
		];

		const uniqueSchemas = schemaVariants.filter((schema, index, allSchemas) => {
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
	 * Resolve required remapped keys from the source object's required key set.
	 * @param mappedEntries The source-to-output mapped key entries.
	 * @param sourceObjectSchema The source object schema containing required keys.
	 * @returns The required output keys.
	 */
	public static resolveMappedTypeSourceRequiredPropertyKeys(
		mappedEntries: { sourceKey: string; mappedKey: string }[],
		sourceObjectSchema: IJsonSchema
	): string[] | undefined {
		if (!Is.array<string>(sourceObjectSchema.required)) {
			return undefined;
		}

		const sourceRequiredKeys = new Set(sourceObjectSchema.required);
		const remappedRequiredKeys = mappedEntries
			.filter(mappedEntry => sourceRequiredKeys.has(mappedEntry.sourceKey))
			.map(mappedEntry => mappedEntry.mappedKey);

		return [...new Set(remappedRequiredKeys)];
	}

	/**
	 * Apply TypeScript intrinsic string remapping helpers to a key.
	 * @param intrinsicName The intrinsic helper name.
	 * @param value The input key value.
	 * @returns The remapped key value.
	 * @internal
	 */
	private static applyIntrinsicMappedTypeKeyRemap(
		intrinsicName: string,
		value: string
	): string | undefined {
		switch (intrinsicName) {
			case "Uppercase":
				return value.toUpperCase();
			case "Lowercase":
				return value.toLowerCase();
			case "Capitalize":
				return value.length > 0 ? `${value[0].toUpperCase()}${value.slice(1)}` : value;
			case "Uncapitalize":
				return value.length > 0 ? `${value[0].toLowerCase()}${value.slice(1)}` : value;
			default:
				return undefined;
		}
	}
}
