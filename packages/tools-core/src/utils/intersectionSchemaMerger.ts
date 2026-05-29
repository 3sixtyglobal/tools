// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Is, ObjectHelper } from "@twin.org/core";
import type { IJsonSchema } from "@twin.org/tools-models";
import type { ITypeScriptToSchemaContext } from "../models/ITypeScriptToSchemaContext.js";

/**
 * Merges compatible object intersections into a single JSON schema object.
 */
export class IntersectionSchemaMerger {
	/**
	 * Merge simple object intersection parts into a single object schema.
	 * Supports local/known object refs by expanding them before merge.
	 * @param context The generation context.
	 * @param schemas The mapped intersection schemas.
	 * @param toInlineUtilityObjectSchema Callback for converting referenced schemas to inline forms.
	 * @returns The merged schema, or undefined when merge is not safe.
	 */
	public static mergeIntersectionObjectSchemas(
		context: ITypeScriptToSchemaContext,
		schemas: IJsonSchema[],
		toInlineUtilityObjectSchema: (schema: IJsonSchema) => IJsonSchema
	): IJsonSchema | undefined {
		const mergedProperties: { [id: string]: IJsonSchema } = {};
		const mergedRequired = new Set<string>();
		const preservedRefs = new Set<string>();

		for (const schema of schemas) {
			const isRefSchema = Is.stringValue(schema.$ref);
			if (isRefSchema && schema.$ref) {
				preservedRefs.add(schema.$ref);
			}

			const objectSchema = IntersectionSchemaMerger.resolveIntersectionObjectSchema(
				context,
				schema,
				toInlineUtilityObjectSchema
			);
			if (!objectSchema) {
				return undefined;
			}
			if (
				objectSchema.$ref ||
				objectSchema.allOf ||
				objectSchema.anyOf ||
				objectSchema.oneOf ||
				objectSchema.items
			) {
				return undefined;
			}

			if (!isRefSchema) {
				if (Is.object(objectSchema.properties)) {
					for (const [propertyName, propertySchema] of Object.entries(objectSchema.properties)) {
						mergedProperties[propertyName] = propertySchema;
					}
				}

				if (Is.array(objectSchema.required)) {
					for (const propertyName of objectSchema.required) {
						mergedRequired.add(propertyName);
					}
				}
			}
		}

		return {
			type: "object",
			properties: Object.keys(mergedProperties).length > 0 ? mergedProperties : undefined,
			required: mergedRequired.size > 0 ? [...mergedRequired] : undefined,
			allOf:
				preservedRefs.size > 0
					? [...preservedRefs].map(schemaRef => ({
							$ref: schemaRef
						}))
					: undefined
		};
	}

	/**
	 * Resolve an intersection component to a plain object schema when possible.
	 * @param context The generation context.
	 * @param schema The mapped intersection component schema.
	 * @returns The resolved object schema.
	 * @internal
	 */
	private static resolveIntersectionObjectSchema(
		context: ITypeScriptToSchemaContext,
		schema: IJsonSchema,
		toInlineUtilityObjectSchema: (schema: IJsonSchema) => IJsonSchema
	): IJsonSchema | undefined {
		if (schema.type === "object" && Is.object(schema.properties)) {
			return ObjectHelper.clone(schema);
		}

		if (schema.$ref) {
			for (const packageSchemas of Object.values(context.schemas)) {
				for (const referencedSchema of Object.values(packageSchemas)) {
					if (
						referencedSchema.$id === schema.$ref &&
						referencedSchema.type === "object" &&
						Is.object(referencedSchema.properties)
					) {
						return toInlineUtilityObjectSchema(referencedSchema);
					}
				}
			}
		}

		return undefined;
	}
}
