// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Is, ObjectHelper } from "@twin.org/core";
import type { IJsonSchema } from "@twin.org/tools-models";

/**
 * Applies common object-schema transformations used by the builder.
 */
export class ObjectTransformer {
	/**
	 * Resolve a property schema from an object schema by property key.
	 * @param baseSchema The source object schema.
	 * @param propertyKey The property key to resolve.
	 * @returns The resolved property schema.
	 */
	public static resolvePropertySchemaFromObjectSchema(
		baseSchema: IJsonSchema,
		propertyKey: string
	): IJsonSchema | undefined {
		if (!baseSchema.properties || !Is.object(baseSchema.properties)) {
			return undefined;
		}

		const propertySchema = baseSchema.properties[propertyKey];
		return propertySchema ? ObjectHelper.clone(propertySchema) : undefined;
	}

	/**
	 * Remove keys from an object schema.
	 * @param baseSchema The source object schema.
	 * @param omittedKeys The keys to remove.
	 * @returns The transformed object schema.
	 */
	public static omitKeysFromObjectSchema(
		baseSchema: IJsonSchema,
		omittedKeys: string[]
	): IJsonSchema {
		const omittedKeySet = new Set(omittedKeys);
		const mappedSchema = ObjectTransformer.toInlineUtilityObjectSchema(baseSchema);

		if (Is.object(mappedSchema.properties)) {
			for (const key of Object.keys(mappedSchema.properties)) {
				if (omittedKeySet.has(key)) {
					delete mappedSchema.properties[key];
				}
			}
			if (Object.keys(mappedSchema.properties).length === 0) {
				delete mappedSchema.properties;
			}
		}

		if (Is.array(mappedSchema.required)) {
			mappedSchema.required = mappedSchema.required.filter(key => !omittedKeySet.has(key));
			if (mappedSchema.required.length === 0) {
				delete mappedSchema.required;
			}
		}

		return mappedSchema;
	}

	/**
	 * Keep only keys from an object schema.
	 * @param baseSchema The source object schema.
	 * @param pickedKeys The keys to keep.
	 * @returns The transformed object schema.
	 */
	public static pickKeysFromObjectSchema(
		baseSchema: IJsonSchema,
		pickedKeys: string[]
	): IJsonSchema {
		const pickedKeySet = new Set(pickedKeys);
		const mappedSchema = ObjectTransformer.toInlineUtilityObjectSchema(baseSchema);

		if (Is.object(mappedSchema.properties)) {
			for (const key of Object.keys(mappedSchema.properties)) {
				if (!pickedKeySet.has(key)) {
					delete mappedSchema.properties[key];
				}
			}
			if (Object.keys(mappedSchema.properties).length === 0) {
				delete mappedSchema.properties;
			}
		}

		if (Is.array(mappedSchema.required)) {
			mappedSchema.required = mappedSchema.required.filter(key => pickedKeySet.has(key));
			if (mappedSchema.required.length === 0) {
				delete mappedSchema.required;
			}
		}

		return mappedSchema;
	}

	/**
	 * Normalize utility-derived object schemas for inline property usage.
	 * When the schema contains an allOf, flatten it by merging properties from all branches.
	 * @param schema The source object schema.
	 * @returns The normalized inline schema.
	 * @internal
	 */
	public static toInlineUtilityObjectSchema(schema: IJsonSchema): IJsonSchema {
		const mappedSchema = ObjectHelper.clone(schema);
		delete mappedSchema.$schema;
		delete mappedSchema.$id;
		delete mappedSchema.title;

		// Flatten allOf by merging properties and required arrays from all branches
		// This handles inheritance cases where a type extends another type
		if (Is.array(mappedSchema.allOf) && mappedSchema.allOf.length > 0) {
			const mergedProperties: { [key: string]: unknown } = {};
			const mergedRequired = new Set<string>();

			// Collect properties and required fields from all allOf branches
			for (const branch of mappedSchema.allOf) {
				if (Is.object(branch)) {
					const branchRecord = branch as { [key: string]: unknown };
					// Merge properties
					if (Is.object(branchRecord.properties)) {
						Object.assign(mergedProperties, branchRecord.properties);
					}
					// Collect required fields
					if (Is.array(branchRecord.required)) {
						for (const field of branchRecord.required) {
							if (Is.stringValue(field)) {
								mergedRequired.add(field);
							}
						}
					}
				}
			}

			// Remove allOf and set merged properties at the top level
			delete mappedSchema.allOf;

			if (Object.keys(mergedProperties).length > 0) {
				mappedSchema.properties = Object.assign(mappedSchema.properties ?? {}, mergedProperties);
			}

			if (mergedRequired.size > 0) {
				const existingRequired = Is.array(mappedSchema.required) ? mappedSchema.required : [];
				mappedSchema.required = [...new Set([...existingRequired, ...mergedRequired])];
			}
		}

		return mappedSchema;
	}

	/**
	 * Normalize schema description whitespace while preserving intentional line breaks.
	 * @param schema The schema to normalize.
	 * @returns The normalized schema.
	 */
	public static normalizeSchemaDescriptions(schema: IJsonSchema): IJsonSchema {
		const normalizedSchema = ObjectHelper.clone(schema);
		const normalizeObject = (value: unknown): void => {
			if (Is.array(value)) {
				for (const item of value) {
					normalizeObject(item);
				}
				return;
			}

			if (Is.object(value)) {
				const valueRecord = value as { [key: string]: unknown };
				if (Is.stringValue(valueRecord.description)) {
					valueRecord.description = ObjectTransformer.normalizeSchemaDescriptionText(
						valueRecord.description
					);
				}

				for (const nestedValue of Object.values(valueRecord)) {
					normalizeObject(nestedValue);
				}
			}
		};

		normalizeObject(normalizedSchema);
		return normalizedSchema;
	}

	/**
	 * Normalize a description string while preserving explicit line breaks from source comments.
	 * @param description The description to normalize.
	 * @returns The normalized description.
	 * @internal
	 */
	private static normalizeSchemaDescriptionText(description: string): string {
		return description
			.split(/\r?\n/)
			.map(line => line.replace(/\s{2,}/g, " ").trim())
			.join("\n");
	}
}
