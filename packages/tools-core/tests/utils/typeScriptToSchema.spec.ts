// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import * as fs from "node:fs";
import path from "node:path";
import { Is } from "@twin.org/core";
import type { IJsonSchema } from "@twin.org/tools-models";
import testComputedPropertyNameSchema from "./testData/computedPropertyName/testComputedPropertyName.json" with { type: "json" };
import testConditionalObjectSchema from "./testData/conditionalType/ConditionalObject.json" with { type: "json" };
import testConditionalPrimitiveSchema from "./testData/conditionalType/ConditionalPrimitive.json" with { type: "json" };
import testConditionalTypeSchema from "./testData/conditionalType/testConditionalType.json" with { type: "json" };
import testDiagnosticsCoverageSchema from "./testData/diagnosticsCoverage/testDiagnosticsCoverage.json" with { type: "json" };
import testEnumAsConstSchema from "./testData/enumAsConst/testEnumAsConst.json" with { type: "json" };
import testEnumDeclarationCodeSchema from "./testData/enumDeclaration/ResponseCode.json" with { type: "json" };
import testEnumDeclarationStateSchema from "./testData/enumDeclaration/ResponseState.json" with { type: "json" };
import testEnumDeclarationSchema from "./testData/enumDeclaration/testEnumDeclaration.json" with { type: "json" };
import testExternalPatchOperationSchema from "./testData/externalPatchOperation/testExternalPatchOperation.json" with { type: "json" };
import testGenericAliasModelSchema from "./testData/genericModelDefinition/GenericAliasModel.json" with { type: "json" };
import testGenericModelSchema from "./testData/genericModelDefinition/TestGenericModel.json" with { type: "json" };
import testGenericModelNoDefaultSchema from "./testData/genericModelDefinition/TestGenericModelNoDefault.json" with { type: "json" };
import testImportTypeSchema from "./testData/importType/testImportType.json" with { type: "json" };
import testIndexedAccessTypeSchema from "./testData/indexedAccessType/testIndexedAccessType.json" with { type: "json" };
import testInterfaceExtendsSchema from "./testData/interfaceExtends/testInterfaceExtends.json" with { type: "json" };
import activitySchema from "./testData/interfaceExtendsUtility/Activity.json" with { type: "json" };
import doubleInheritanceCSchema from "./testData/interfaceExtendsUtility/DoubleInheritanceC.json" with { type: "json" };
import extendPartialInheritedSchema from "./testData/interfaceExtendsUtility/ExtendPartialInherited.json" with { type: "json" };
import extendPickFromInheritedSchema from "./testData/interfaceExtendsUtility/ExtendPickFromInherited.json" with { type: "json" };
import extendRequiredInheritedSchema from "./testData/interfaceExtendsUtility/ExtendRequiredInherited.json" with { type: "json" };
import omitFromTripleInheritanceSchema from "./testData/interfaceExtendsUtility/OmitFromTripleInheritance.json" with { type: "json" };
import omitOptionalityReverseBaseASchema from "./testData/interfaceExtendsUtility/OmitOptionalityReverseBaseA.json" with { type: "json" };
import omitOptionalityReverseFaceBSchema from "./testData/interfaceExtendsUtility/OmitOptionalityReverseFaceB.json" with { type: "json" };
import omitRedefinitionBaseASchema from "./testData/interfaceExtendsUtility/OmitRedefinitionBaseA.json" with { type: "json" };
import omitRedefinitionFaceBSchema from "./testData/interfaceExtendsUtility/OmitRedefinitionFaceB.json" with { type: "json" };
import testInterfaceExtendsUtilitySchema from "./testData/interfaceExtendsUtility/testInterfaceExtendsUtility.json" with { type: "json" };
import testJsonLdUtilityTypeSchema from "./testData/jsonLdUtilityType/testJsonLdUtilityType.json" with { type: "json" };
import testJsonSchemaTagsSchema from "./testData/jsonSchemaTags/testJsonSchemaTags.json" with { type: "json" };
import testLiteralBooleanTypeSchema from "./testData/literalBooleanType/testLiteralBooleanType.json" with { type: "json" };
import testLiteralTagDiscriminatedUnionSchema from "./testData/literalTagDiscriminatedUnion/testLiteralTagDiscriminatedUnion.json" with { type: "json" };
import testFieldMapSchema from "./testData/mappedType/FieldMap.json" with { type: "json" };
import testFilteredSourceMirrorSchema from "./testData/mappedType/FilteredSourceMirror.json" with { type: "json" };
import testOptionalFieldMapSchema from "./testData/mappedType/OptionalFieldMap.json" with { type: "json" };
import testPrefixedSourceMirrorSchema from "./testData/mappedType/PrefixedSourceMirror.json" with { type: "json" };
import testSourceMirrorSchema from "./testData/mappedType/SourceMirror.json" with { type: "json" };
import testMappedTypeSchema from "./testData/mappedType/testMappedType.json" with { type: "json" };
import testUppercaseSourceMirrorSchema from "./testData/mappedType/UppercaseSourceMirror.json" with { type: "json" };
import testMethodSpecificUtilitySchema from "./testData/methodSpecificUtility/testMethodSpecificUtility.json" with { type: "json" };
import testAddressSchema from "./testData/multiple/testAddress.json" with { type: "json" };
import testPersonSchema from "./testData/multiple/testPerson.json" with { type: "json" };
import testImportedProfileSchema from "./testData/nestedImported/testImportedProfile.json" with { type: "json" };
import testImportedSettingsSchema from "./testData/nestedImported/testImportedSettings.json" with { type: "json" };
import testNestedImportedSchema from "./testData/nestedImported/testNestedImported.json" with { type: "json" };
import testNestedObjectSchema from "./testData/nestedObject/testNestedObject.json" with { type: "json" };
import testOneOfDiscriminationSchema from "./testData/oneOfDiscrimination/testOneOfDiscrimination.json" with { type: "json" };
import testThreeWayChoiceSchema from "./testData/oneOfDiscrimination/ThreeWayChoice.json" with { type: "json" };
import testTwoWayChoiceSchema from "./testData/oneOfDiscrimination/TwoWayChoice.json" with { type: "json" };
import testOptionalPropsSchema from "./testData/optionalProps/testOptionalProps.json" with { type: "json" };
import testPrimitivesSchema from "./testData/primitives/testPrimitives.json" with { type: "json" };
import testSignatureMembersSchema from "./testData/signatureMembers/testSignatureMembers.json" with { type: "json" };
import testSpreadArraySchema from "./testData/spreadArray/testSpreadArray.json" with { type: "json" };
import testSymbolTypeSchema from "./testData/symbolType/testSymbolType.json" with { type: "json" };
import testEventKeySchema from "./testData/templateLiteralType/EventKey.json" with { type: "json" };
import testTemplateLiteralTypeSchema from "./testData/templateLiteralType/testTemplateLiteralType.json" with { type: "json" };
import testUserIdSchema from "./testData/templateLiteralType/UserId.json" with { type: "json" };
import testTypedArraySchema from "./testData/typedArray/testTypedArray.json" with { type: "json" };
import testTypeKeywordVariantsSchema from "./testData/typeKeywordVariants/testTypeKeywordVariants.json" with { type: "json" };
import testTypeNullSchema from "./testData/typeNull/testTypeNull.json" with { type: "json" };
import testTypeObjectIntersectionSchema from "./testData/typeObjectIntersection/testTypeObjectIntersection.json" with { type: "json" };
import testTypeObjectUnionSchema from "./testData/typeObjectUnion/testTypeObjectUnion.json" with { type: "json" };
import testTypeOperatorsSchema from "./testData/typeOperators/testTypeOperators.json" with { type: "json" };
import testTypeQuerySchema from "./testData/typeQuery/testTypeQuery.json" with { type: "json" };
import testTypeQueryQualifiedSchema from "./testData/typeQueryQualified/testTypeQueryQualified.json" with { type: "json" };
import testTypeSimpleSchema from "./testData/typeSimple/testTypeSimple.json" with { type: "json" };
import testTypeSimpleIntersectionSchema from "./testData/typeSimpleIntersection/testTypeSimpleIntersection.json" with { type: "json" };
import testTypeSimpleUnionSchema from "./testData/typeSimpleUnion/testTypeSimpleUnion.json" with { type: "json" };
import testTypeUndefinedSchema from "./testData/typeUndefined/testTypeUndefined.json" with { type: "json" };
import testUtilityPersonSchema from "./testData/utilityType/testUtilityPerson.json" with { type: "json" };
import testUtilityTypeSchema from "./testData/utilityType/testUtilityType.json" with { type: "json" };
import { TypeScriptToSchema } from "../../src/utils/typeScriptToSchema.js";

function getSchemaByExpectedTitle(
	generatedSchemas: { [id: string]: IJsonSchema },
	expectedSchema: unknown
): IJsonSchema {
	if (Is.object<{ title?: unknown; $id?: unknown }>(expectedSchema)) {
		const byTitle = generatedSchemas[String(expectedSchema.title)];
		if (byTitle) {
			return byTitle;
		}

		const byId = Object.values(generatedSchemas).find(schema => schema.$id === expectedSchema.$id);
		if (byId) {
			return byId;
		}
	}

	throw new Error("Expected schema was not generated");
}

function expectGeneratedSchemasToMatch(
	generatedSchemas: { [id: string]: IJsonSchema },
	expectedSchemas: unknown[],
	expectedTypeNames?: string[]
): void {
	if (expectedTypeNames) {
		expect(Object.keys(generatedSchemas).sort()).toEqual([...expectedTypeNames].sort());
	} else {
		expect(Object.keys(generatedSchemas)).toHaveLength(expectedSchemas.length);
	}

	for (const expectedSchema of expectedSchemas) {
		expect(getSchemaByExpectedTitle(generatedSchemas, expectedSchema)).toEqual(expectedSchema);
	}
}

describe("TypeScriptToSchema", () => {
	test("can generate a schema from a TypeScript source file", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/primitives/testPrimitives.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testPrimitivesSchema]);
		const schema = getSchemaByExpectedTitle(generatedSchemas, testPrimitivesSchema);
		expect(schema.properties?.anyValue).toEqual({
			description: "A value typed as any."
		});
		expect(schema.properties?.neverValue).toEqual({
			description: "A value typed as never.",
			not: {}
		});
	});

	test("can generate schemas for multiple types in one file", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/multiple/testMultiple.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testPersonSchema, testAddressSchema]);
		expect(packageSchemas["@example.com/pkg"].TestPerson).toEqual(testPersonSchema);
		expect(packageSchemas["@example.com/pkg"].TestAddress).toEqual(testAddressSchema);
	});

	test("can generate a schema for interfaces extending multiple interfaces", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/interfaceExtends/testInterfaceExtends.ts"
		);
		expectGeneratedSchemasToMatch(
			generatedSchemas,
			[testInterfaceExtendsSchema],
			["TestInterface", "TestInterfaceBaseA", "TestInterfaceBaseB"]
		);
	});

	test("can generate a schema for an interface extending with utility types", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/interfaceExtendsUtility/testInterfaceExtendsUtility.ts"
		);
		expectGeneratedSchemasToMatch(
			generatedSchemas,
			[
				testInterfaceExtendsUtilitySchema,
				omitRedefinitionBaseASchema,
				omitRedefinitionFaceBSchema,
				omitOptionalityReverseBaseASchema,
				omitOptionalityReverseFaceBSchema,
				doubleInheritanceCSchema,
				omitFromTripleInheritanceSchema,
				extendPickFromInheritedSchema,
				extendPartialInheritedSchema,
				extendRequiredInheritedSchema
			],
			[
				"DoubleInheritanceA",
				"DoubleInheritanceB",
				"DoubleInheritanceC",
				"ExtendPartialInherited",
				"ExtendPickFromInherited",
				"ExtendRequiredInherited",
				"OmitFromTripleInheritance",
				"OmitOptionalityReverseBaseA",
				"OmitOptionalityReverseFaceB",
				"OmitRedefinitionBaseA",
				"OmitRedefinitionFaceB",
				"TestInterfaceUtility",
				"TestInterfaceUtilityBaseA",
				"TestInterfaceUtilityBaseB",
				"TripleBaseA",
				"TripleMidB",
				"TripleTopC"
			]
		);
	});

	test("can generate expected schema for activity utility interface", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/interfaceExtendsUtility/testInterfaceExtendsUtilityActivity.ts",
			{
				externalReferences: {
					"JsonLd(.*)": "https://schema.twindev.org/json-ld/JsonLd$1"
				}
			}
		);

		expect(getSchemaByExpectedTitle(generatedSchemas, activitySchema)).toEqual(activitySchema);
	});

	test("can generate a schema for enum as const type", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/enumAsConst/testEnumAsConst.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testEnumAsConstSchema]);
	});

	test("can generate schemas for enum declarations", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/enumDeclaration/testEnumDeclaration.txt"
		);
		expectGeneratedSchemasToMatch(
			generatedSchemas,
			[testEnumDeclarationSchema, testEnumDeclarationStateSchema, testEnumDeclarationCodeSchema],
			["ResponseState", "ResponseCode", "TestEnumDeclaration"]
		);
	});

	test("can generate a schema for a simple type alias", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/typeSimple/testTypeSimple.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testTypeSimpleSchema]);
	});

	test("can generate schemas for generic model definitions with default type parameters", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/genericModelDefinition/testGenericModelDefinition.ts"
		);
		expectGeneratedSchemasToMatch(
			generatedSchemas,
			[testGenericModelSchema, testGenericModelNoDefaultSchema, testGenericAliasModelSchema],
			["TestGenericModel", "TestGenericModelNoDefault", "GenericAliasModel"]
		);
	});

	test("can generate schemas for conditional types", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/conditionalType/testConditionalType.ts"
		);
		expectGeneratedSchemasToMatch(
			generatedSchemas,
			[testConditionalTypeSchema, testConditionalObjectSchema, testConditionalPrimitiveSchema],
			["ConditionalObject", "ConditionalPrimitive", "TestConditionalType"]
		);
	});

	test("can generate a schema for a simple union type alias", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/typeSimpleUnion/testTypeSimpleUnion.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testTypeSimpleUnionSchema]);
	});

	test("can generate a schema for an object union type alias", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/typeObjectUnion/testTypeObjectUnion.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testTypeObjectUnionSchema]);
	});

	test("can generate oneOf for literal-tag discriminated object unions", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/literalTagDiscriminatedUnion/testLiteralTagDiscriminatedUnion.ts"
		);
		expectGeneratedSchemasToMatch(
			generatedSchemas,
			[testLiteralTagDiscriminatedUnionSchema],
			["AlphaBranch", "BetaBranch", "TypeLiteralTagDiscriminatedUnion"]
		);
	});

	test("can generate oneOf schemas for never-discriminated unions with 2 and 3 branches", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/oneOfDiscrimination/testOneOfDiscrimination.ts"
		);
		expectGeneratedSchemasToMatch(
			generatedSchemas,
			[testOneOfDiscriminationSchema, testTwoWayChoiceSchema, testThreeWayChoiceSchema],
			["TestOneOfDiscrimination", "TwoWayChoice", "ThreeWayChoice"]
		);
	});

	test("can generate oneOf schema for intersection with never-discriminated object union branches", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/discriminatedUnion/IQuestion.ts"
		);

		const outputDir = fs.mkdtempSync(
			path.join("tests", "utils", "testData", "discriminatedUnion", "output-")
		);
		try {
			let validatedSchemaCount = 0;
			for (const [title, schema] of Object.entries(generatedSchemas)) {
				const generatedPath = path.join(outputDir, `${title}.json`);
				fs.writeFileSync(generatedPath, `${JSON.stringify(schema, undefined, "\t")}\n`, "utf8");

				const expectedPath = path.join(
					"tests",
					"utils",
					"testData",
					"discriminatedUnion",
					`${title}.json`
				);
				if (fs.existsSync(expectedPath)) {
					const expectedSchema = JSON.parse(fs.readFileSync(expectedPath, "utf8")) as IJsonSchema;
					expect(schema).toEqual(expectedSchema);
					validatedSchemaCount++;
				}
			}

			expect(validatedSchemaCount).toBeGreaterThan(0);
			expect(generatedSchemas.Question).toBeDefined();
		} finally {
			fs.rmSync(outputDir, { recursive: true, force: true });
		}
	});

	test("can generate a schema with null types", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/typeNull/testTypeNull.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testTypeNullSchema]);
	});

	test("can generate a schema with undefined branches", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/typeUndefined/testTypeUndefined.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testTypeUndefinedSchema]);
	});

	test("can generate a schema with object and boolean keyword variants", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/typeKeywordVariants/testTypeKeywordVariants.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testTypeKeywordVariantsSchema]);
	});

	test("can generate schemas for native typed array references", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/typedArray/testTypedArray.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testTypedArraySchema]);
	});

	test("can generate a schema with readonly and keyof type operators", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/typeOperators/testTypeOperators.ts"
		);
		expectGeneratedSchemasToMatch(
			generatedSchemas,
			[testTypeOperatorsSchema],
			["TypeOperatorSource", "TestTypeOperators"]
		);
	});

	test("can generate a schema with indexed access type operators", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/indexedAccessType/testIndexedAccessType.ts"
		);
		expectGeneratedSchemasToMatch(
			generatedSchemas,
			[testIndexedAccessTypeSchema],
			["IndexedAccessSource", "TestIndexedAccessType"]
		);
	});

	test("can generate schemas for template literal types", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/templateLiteralType/testTemplateLiteralType.ts"
		);
		expectGeneratedSchemasToMatch(
			generatedSchemas,
			[testTemplateLiteralTypeSchema, testUserIdSchema, testEventKeySchema],
			["UserId", "EventKey", "TestTemplateLiteralType"]
		);
	});

	test("can generate schemas for generic mapped types", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/mappedType/testMappedType.ts"
		);
		expectGeneratedSchemasToMatch(
			generatedSchemas,
			[
				testMappedTypeSchema,
				testFieldMapSchema,
				testSourceMirrorSchema,
				testOptionalFieldMapSchema,
				testPrefixedSourceMirrorSchema,
				testUppercaseSourceMirrorSchema,
				testFilteredSourceMirrorSchema
			],
			[
				"FieldKeys",
				"FieldMap",
				"SourceModel",
				"SourceMirror",
				"OptionalFieldMap",
				"PrefixedSourceMirror",
				"UppercaseSourceMirror",
				"FilteredSourceMirror",
				"TestMappedType"
			]
		);
	});

	test("can generate schemas for computable computed property names and report unresolved keys", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const diagnostics: { code: string; properties?: { [key: string]: unknown }; path: string }[] =
			[];

		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/computedPropertyName/testComputedPropertyName.ts",
			{
				externalReferences: {},
				onDiagnostic: diagnostic => diagnostics.push(diagnostic)
			}
		);

		expectGeneratedSchemasToMatch(generatedSchemas, [testComputedPropertyNameSchema]);
		expect(diagnostics.length).toBe(1);
		expect(diagnostics[0].code).toBe("jsonSchemaBuilder.diagnostic.symbolKeyedMember");
		expect(diagnostics[0].path).toContain("testComputedPropertyName.ts");
	});

	test("can generate a schema skipping symbol-typed and symbol-keyed members with diagnostics", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const diagnostics: { code: string; properties?: { [key: string]: unknown }; path: string }[] =
			[];

		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/symbolType/testSymbolType.ts",
			{
				externalReferences: {},
				onDiagnostic: diagnostic => diagnostics.push(diagnostic)
			}
		);

		expectGeneratedSchemasToMatch(generatedSchemas, [testSymbolTypeSchema]);
		expect(diagnostics.length).toBe(3);
		const codes = diagnostics.map(d => d.code);
		expect(
			codes.filter(c => c === "jsonSchemaBuilder.diagnostic.symbolValuedProperty").length
		).toBe(1);
		expect(codes.filter(c => c === "jsonSchemaBuilder.diagnostic.symbolKeyedMember").length).toBe(
			2
		);
		for (const diagnostic of diagnostics) {
			expect(diagnostic.path).toContain("testSymbolType.ts");
		}
	});

	test("reports diagnostics for unsupported constructs while still generating fallback schemas", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const diagnostics: { code: string; properties?: { [key: string]: unknown }; path: string }[] =
			[];

		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/diagnosticsCoverage/testDiagnosticsCoverage.ts",
			{
				externalReferences: {},
				onDiagnostic: diagnostic => diagnostics.push(diagnostic)
			}
		);

		expectGeneratedSchemasToMatch(generatedSchemas, [testDiagnosticsCoverageSchema]);

		const codes = diagnostics.map(d => d.code);
		expect(codes).toContain("jsonSchemaBuilder.diagnostic.functionTypedProperty");
		expect(codes).toContain("jsonSchemaBuilder.diagnostic.unsupportedTypeElementMember");
		expect(codes).toContain("jsonSchemaBuilder.diagnostic.unsupportedInferredObjectSpread");
		expect(codes).toContain("jsonSchemaBuilder.diagnostic.unsupportedInferredObjectComputedKey");
		expect(codes).toContain("jsonSchemaBuilder.diagnostic.unsupportedInferredTupleElement");
		expect(codes).toContain("jsonSchemaBuilder.diagnostic.unsupportedInferredExpressionKind");
		expect(codes).toContain("jsonSchemaBuilder.diagnostic.unsupportedTemplateLiteralSpan");
		expect(codes).toContain("jsonSchemaBuilder.diagnostic.unsupportedUtilityType");
		expect(codes).toContain("jsonSchemaBuilder.diagnostic.unsupportedImportTypeForm");
		expect(
			codes.filter(c => c === "jsonSchemaBuilder.diagnostic.unsupportedTypeElementMember").length
		).toBe(2);

		for (const diagnostic of diagnostics) {
			expect(diagnostic.path).toContain("testDiagnosticsCoverage.ts");
		}
	});

	test("logs and ignores method-specific utility and callable helper types", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const diagnostics: { code: string; properties?: { [key: string]: unknown }; path: string }[] =
			[];

		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/methodSpecificUtility/testMethodSpecificUtility.ts",
			{
				externalReferences: {},
				onDiagnostic: diagnostic => diagnostics.push(diagnostic)
			}
		);

		expectGeneratedSchemasToMatch(generatedSchemas, [testMethodSpecificUtilitySchema]);

		const utilityDiagnostics = diagnostics.filter(
			d => d.code === "jsonSchemaBuilder.diagnostic.unsupportedUtilityType"
		);
		expect(utilityDiagnostics.length).toBe(10);

		const utilityTypeNames = utilityDiagnostics
			.map(d => d.properties?.utilityType)
			.filter((value): value is string => Is.stringValue(value));
		expect(utilityTypeNames).toEqual([
			"Awaited",
			"ReturnType",
			"Parameters",
			"ConstructorParameters",
			"InstanceType",
			"ThisParameterType",
			"OmitThisParameter",
			"ThisType",
			"CallableFunction",
			"NewableFunction"
		]);
	});

	test("can generate a schema for a simple object intersection type alias", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/typeSimpleIntersection/testTypeSimpleIntersection.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testTypeSimpleIntersectionSchema]);
	});

	test("can generate a schema for an interface with object intersection property", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/typeObjectIntersection/testTypeObjectIntersection.ts"
		);
		expectGeneratedSchemasToMatch(
			generatedSchemas,
			[testTypeObjectIntersectionSchema],
			["Person", "TypeObjectIntersection"]
		);
	});

	test("can generate a schema for Partial, Omit, Required, Pick, Exclude, Extract, ObjectOrArray and SingleOccurrenceArray utility type aliases", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};

		const generatedPersonSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/utilityType/testUtilityPerson.ts"
		);
		expectGeneratedSchemasToMatch(generatedPersonSchemas, [testUtilityPersonSchema]);

		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/utilityType/testUtilityType.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [
			testUtilityTypeSchema,
			testUtilityPersonSchema
		]);
		const schema = getSchemaByExpectedTitle(generatedSchemas, testUtilityTypeSchema);
		expect(schema.properties?.partialType.required).toBeUndefined();
		expect(schema.properties?.requiredType.required).toEqual(["id", "label", "score"]);
		expect(schema.properties?.pickType.required).toEqual(["id", "label"]);
		expect(schema.properties?.excludeType.anyOf).toEqual([
			{ const: "running" },
			{ const: "sleeping" }
		]);
		expect(schema.properties?.excludeTypeObject.anyOf).toEqual([
			{
				type: "object",
				properties: {
					a: { type: "string" }
				},
				required: ["a"]
			},
			{
				type: "object",
				properties: {
					c: { type: "string" }
				},
				required: ["c"]
			}
		]);
		expect(schema.properties?.excludeTypeObject.description).toEqual(
			"Excluded view of person object."
		);
		expect(schema.properties?.extractType.anyOf).toEqual([
			{ const: "running" },
			{ const: "sleeping" }
		]);
		expect(schema.properties?.extractTypeObject.anyOf).toEqual([
			{
				type: "object",
				properties: {
					b: { type: "string" }
				},
				required: ["b"]
			},
			{
				type: "object",
				properties: {
					c: { type: "string" }
				},
				required: ["c"]
			}
		]);
		expect(schema.properties?.extractTypeObject.description).toEqual(
			"Extracted view of person object."
		);
		expect(schema.properties?.nonNullableType.anyOf).toEqual([
			{ const: "walking" },
			{ const: "running" }
		]);
		expect(schema.properties?.nonNullablePersonType.$ref).toEqual(
			"https://schema.twindev.org/test/Person"
		);
		expect(schema.properties?.recordStringNumberType.type).toEqual("object");
		expect(schema.properties?.recordStringNumberType.additionalProperties).toEqual({
			type: "number"
		});
		expect(schema.properties?.recordFixedKeysType.type).toEqual("object");
		expect(schema.properties?.recordFixedKeysType.properties).toEqual({
			id: { type: "string" },
			label: { type: "string" }
		});
		expect(schema.properties?.recordFixedKeysType.required).toEqual(["id", "label"]);
		expect(schema.properties?.recordPersonType.type).toEqual("object");
		expect(schema.properties?.recordPersonType.additionalProperties).toEqual({
			$ref: "https://schema.twindev.org/test/Person"
		});
		expect(schema.properties?.combinedType.required).toEqual(["id"]);
		expect(schema.properties?.objectOrArrayType.anyOf).toHaveLength(2);
		expect(schema.properties?.objectOrArrayPersonType.anyOf).toHaveLength(2);
		expect(schema.properties?.objectOrArrayPersonType.anyOf?.[0].$ref).toEqual(
			"https://schema.twindev.org/test/Person"
		);
		const secondAnyOfItems = schema.properties?.objectOrArrayPersonType.anyOf?.[1].items;
		expect(
			typeof secondAnyOfItems === "object" && secondAnyOfItems ? secondAnyOfItems.$ref : undefined
		).toEqual("https://schema.twindev.org/test/Person");
		expect(schema.properties?.singleOccurrenceArrayType.type).toEqual("array");
		expect(schema.properties?.singleOccurrenceArrayType.items).toEqual({
			anyOf: [{ type: "string" }, { type: "number" }]
		});
		expect(schema.properties?.singleOccurrenceArrayType.contains).toEqual({ type: "number" });
		expect(schema.properties?.singleOccurrenceArrayType.minContains).toEqual(1);
		expect(schema.properties?.singleOccurrenceArrayType.maxContains).toEqual(1);
		expect(schema.properties?.singleOccurrenceArrayType.minItems).toEqual(1);
		expect(schema.properties?.singleOccurrenceArrayPersonType.type).toEqual("array");
		expect(schema.properties?.singleOccurrenceArrayPersonType.items).toEqual({
			anyOf: [{ $ref: "https://schema.twindev.org/test/Person" }, { type: "string" }]
		});
		expect(schema.properties?.singleOccurrenceArrayPersonType.contains).toEqual({
			type: "string"
		});
		expect(schema.properties?.singleOccurrenceArrayPersonType.minContains).toEqual(1);
		expect(schema.properties?.singleOccurrenceArrayPersonType.maxContains).toEqual(1);
		expect(schema.properties?.singleOccurrenceArrayPersonType.minItems).toEqual(1);
		expect(packageSchemas["@example.com/pkg"].Person).toEqual(testUtilityPersonSchema);
	});

	test("can generate a schema for JsonLdObject utilities for id and type variants", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};

		const generatedPersonSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/utilityType/testUtilityPerson.ts"
		);
		expectGeneratedSchemasToMatch(generatedPersonSchemas, [testUtilityPersonSchema]);

		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/jsonLdUtilityType/testJsonLdUtilityType.ts"
		);
		expect(getSchemaByExpectedTitle(generatedSchemas, testJsonLdUtilityTypeSchema)).toEqual(
			testJsonLdUtilityTypeSchema
		);
		expect(getSchemaByExpectedTitle(generatedSchemas, testUtilityPersonSchema)).toEqual(
			testUtilityPersonSchema
		);
		const schema = getSchemaByExpectedTitle(generatedSchemas, testJsonLdUtilityTypeSchema);
		expect(schema.properties?.withExistingId.required).toEqual(["label", "id"]);
		expect(schema.properties?.withAtId.properties?.id.type).toEqual("string");
		expect(schema.properties?.withoutId.properties?.id.type).toEqual("string");
		expect(schema.properties?.withCustomId.properties?.id.type).toEqual("number");
		expect(schema.properties?.withAtIdFromId.required).toEqual(["label", "@id"]);
		expect(schema.properties?.withAtIdFromId.properties?.["@id"].type).toEqual("string");
		expect(schema.properties?.withOptionalAtId.required).toEqual(["label"]);
		expect(schema.properties?.withOptionalAtId.properties?.["@id"].type).toEqual("string");
		expect(schema.properties?.withNoAtId.required).toEqual(["label"]);
		expect(schema.properties?.withNoAtId.properties?.["@id"]).toBeUndefined();
		expect(schema.properties?.withOptionalId.required).toEqual(["label"]);
		expect(schema.properties?.withOptionalId.properties?.id.type).toEqual("string");
		expect(schema.properties?.withOptionalIdNoSource.required).toEqual(["name"]);
		expect(schema.properties?.withOptionalIdNoSource.properties?.id.type).toEqual("string");
		expect(schema.properties?.withNoId.required).toEqual(["label"]);
		expect(schema.properties?.withNoId.properties?.id).toBeUndefined();
		expect(schema.properties?.withExistingType.required).toEqual(["value", "type"]);
		expect(schema.properties?.withExistingType.properties?.type.const).toEqual("Person");
		expect(schema.properties?.withAtType.required).toEqual(["value", "type"]);
		expect(schema.properties?.withAtType.properties?.type.const).toEqual("Event");
		expect(schema.properties?.withoutType.required).toEqual(["name", "type"]);
		expect(schema.properties?.withoutType.properties?.type.anyOf).toEqual([
			{ type: "string" },
			{ type: "array", items: { type: "string" } }
		]);
		expect(schema.properties?.withCustomType.required).toEqual(["name", "type"]);
		expect(schema.properties?.withCustomType.properties?.type.const).toEqual("CustomType");
		expect(schema.properties?.withAtTypeFromType.required).toEqual(["label", "@type"]);
		expect(schema.properties?.withAtTypeFromType.properties?.["@type"].const).toEqual("Thing");
		expect(schema.properties?.withOptionalAtType.required).toEqual(["label"]);
		expect(schema.properties?.withOptionalAtType.properties?.["@type"].type).toEqual("string");
		expect(schema.properties?.withNoAtType.required).toEqual(["label"]);
		expect(schema.properties?.withNoAtType.properties?.["@type"]).toBeUndefined();
		expect(schema.properties?.withOptionalType.required).toEqual(["label"]);
		expect(schema.properties?.withOptionalType.properties?.type.type).toEqual("string");
		expect(schema.properties?.withOptionalTypeNoSource.required).toEqual(["name"]);
		expect(schema.properties?.withOptionalTypeNoSource.properties?.type.anyOf).toEqual([
			{ type: "string" },
			{ type: "array", items: { type: "string" } }
		]);
		expect(schema.properties?.withNoType.required).toEqual(["label"]);
		expect(schema.properties?.withNoType.properties?.type).toBeUndefined();
		expect(schema.properties?.withExistingContext.required).toEqual(["value", "@context"]);
		expect(schema.properties?.withExistingContext.properties?.["@context"]).toEqual({
			type: "array",
			items: { type: "string" }
		});
		expect(schema.properties?.withoutContext.required).toEqual(["name", "@context"]);
		expect(schema.properties?.withoutContext.properties?.["@context"]).toEqual({
			$ref: "https://schema.twindev.org/json-ld/JsonLdContextDefinitionRoot"
		});
		expect(schema.properties?.withCustomContext.required).toEqual(["name", "@context"]);
		expect(schema.properties?.withCustomContext.properties?.["@context"]).toEqual({
			type: "object",
			properties: {
				schema: { type: "string" }
			},
			required: ["schema"]
		});
		expect(schema.properties?.withOptionalContext.required).toEqual(["label"]);
		expect(schema.properties?.withOptionalContext.properties?.["@context"]).toEqual({
			type: "array",
			items: { type: "string" }
		});
		expect(schema.properties?.withOptionalContextNoSource.required).toEqual(["name"]);
		expect(schema.properties?.withOptionalContextNoSource.properties?.["@context"]).toEqual({
			$ref: "https://schema.twindev.org/json-ld/JsonLdContextDefinitionRoot"
		});
		expect(schema.properties?.withNoContext.required).toEqual(["label"]);
		expect(schema.properties?.withNoContext.properties?.["@context"]).toBeUndefined();
		expect(packageSchemas["@example.com/pkg"].Person).toEqual(testUtilityPersonSchema);
	});

	test("can resolve JsonLdObject utility base types from local imports without pre-generated schema order", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};

		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/jsonLdUtilityType/testJsonLdUtilityTypeLocalImport.ts"
		);

		expect(Object.keys(generatedSchemas)).toContain("TestJsonLdUtilityTypeLocalImport");
		const schema = generatedSchemas.TestJsonLdUtilityTypeLocalImport;
		expect(schema.type).toEqual("object");
		expect(schema.properties?.agreement?.type).toEqual("object");
		expect(schema.properties?.agreement?.properties?.["@id"]).toEqual({
			type: "string",
			description: "Identifier for the agreement."
		});
		expect(schema.properties?.agreement?.properties?.payload).toEqual({
			type: "number",
			description: "A test payload value."
		});
		expect(schema.properties?.agreement?.properties?.["@context"]).toBeUndefined();
		expect(schema.properties?.agreement?.required).toEqual(["@id", "payload"]);
	});

	test("can generate schemas from a glob source pattern", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};

		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/utilityType/*.ts"
		);

		expectGeneratedSchemasToMatch(generatedSchemas, [
			testUtilityPersonSchema,
			testUtilityTypeSchema
		]);
		expect(packageSchemas["@example.com/pkg"].Person).toEqual(testUtilityPersonSchema);
		expect(packageSchemas["@example.com/pkg"].TestUtilityType).toEqual(testUtilityTypeSchema);
	});

	test("can generate required from non-optional properties", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/optionalProps/testOptionalProps.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testOptionalPropsSchema]);
	});

	test("can apply @json-schema tags to generated schema", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/jsonSchemaTags/testJsonSchemaTags.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testJsonSchemaTagsSchema]);
	});

	test("throws for unsupported @json-schema tag keys", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};

		await expect(
			tsToSchema.generateSchema(
				"https://schema.twindev.org/test/",
				"@example.com/pkg",
				packageSchemas,
				"tests/utils/testData/jsonSchemaInvalidTags/testJsonSchemaInvalidTags.ts"
			)
		).rejects.toThrow("jsonSchemaBuilder.invalidJsonSchemaTagKey");
	});

	test("throws for array constraint applied to a non-array type", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};

		await expect(
			tsToSchema.generateSchema(
				"https://schema.twindev.org/test/",
				"@example.com/pkg",
				packageSchemas,
				"tests/utils/testData/jsonSchemaConstraintMismatch/testArrayConstraintMismatch.ts"
			)
		).rejects.toThrow("jsonSchemaBuilder.constraintOnIncompatibleType");
	});

	test("throws for numeric constraint applied to a non-numeric type", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};

		await expect(
			tsToSchema.generateSchema(
				"https://schema.twindev.org/test/",
				"@example.com/pkg",
				packageSchemas,
				"tests/utils/testData/jsonSchemaConstraintMismatch/testNumericConstraintMismatch.ts"
			)
		).rejects.toThrow("jsonSchemaBuilder.constraintOnIncompatibleType");
	});

	test("throws for string constraint applied to a non-string type", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};

		await expect(
			tsToSchema.generateSchema(
				"https://schema.twindev.org/test/",
				"@example.com/pkg",
				packageSchemas,
				"tests/utils/testData/jsonSchemaConstraintMismatch/testStringConstraintMismatch.ts"
			)
		).rejects.toThrow("jsonSchemaBuilder.constraintOnIncompatibleType");
	});

	test("throws for object constraint applied to a non-object type", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};

		await expect(
			tsToSchema.generateSchema(
				"https://schema.twindev.org/test/",
				"@example.com/pkg",
				packageSchemas,
				"tests/utils/testData/jsonSchemaConstraintMismatch/testObjectConstraintMismatch.ts"
			)
		).rejects.toThrow("jsonSchemaBuilder.constraintOnIncompatibleType");
	});

	test("throws for an unrecognised format value", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};

		await expect(
			tsToSchema.generateSchema(
				"https://schema.twindev.org/test/",
				"@example.com/pkg",
				packageSchemas,
				"tests/utils/testData/jsonSchemaConstraintMismatch/testInvalidFormatValue.ts"
			)
		).rejects.toThrow("jsonSchemaBuilder.invalidFormatValue");
	});

	test("excludes enclosing objects for disallowed type names and reports diagnostics", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const diagnostics: { code: string; properties?: { [key: string]: unknown } }[] = [];

		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/disallowedTypes/testDisallowedTypes.ts",
			{ onDiagnostic: diagnostic => diagnostics.push(diagnostic) }
		);

		expect(generatedSchemas).toEqual({});
		expect(diagnostics).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					code: "jsonSchemaBuilder.diagnostic.excludedEnclosingObjectDisallowedType",
					properties: {
						disallowedTypeName: "Date",
						enclosingObjectName: "TestDisallowedTypes",
						propertyName: "dateTimeValue"
					}
				})
			])
		);
	});

	test("excludes enclosing objects for disallowed type names in union branches", async () => {
		const tsToSchema = new TypeScriptToSchema();
		for (const [sourcePath, expectedProperties] of [
			[
				"tests/utils/testData/disallowedTypes/testDisallowedTypesBigIntUnion.ts",
				{
					disallowedTypeName: "bigint",
					enclosingObjectName: "TestDisallowedTypesBigIntUnion",
					propertyName: "value"
				}
			],
			[
				"tests/utils/testData/disallowedTypes/testDisallowedTypesUnion.ts",
				{
					disallowedTypeName: "bigint",
					enclosingObjectName: "TestDisallowedTypesUnion",
					propertyName: "bigIntLiteralUnion"
				}
			],
			[
				"tests/utils/testData/disallowedTypes/testDisallowedTypesDateUnion.ts",
				{
					disallowedTypeName: "Date",
					enclosingObjectName: "TestDisallowedTypesDateUnion",
					propertyName: "value"
				}
			]
		] as const) {
			const diagnostics: { code: string; properties?: { [key: string]: unknown } }[] = [];
			const generatedSchemas = await tsToSchema.generateSchema(
				"https://schema.twindev.org/test/",
				"@example.com/pkg",
				{},
				sourcePath,
				{ onDiagnostic: diagnostic => diagnostics.push(diagnostic) }
			);

			expect(generatedSchemas).toEqual({});
			expect(diagnostics).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						code: "jsonSchemaBuilder.diagnostic.excludedEnclosingObjectDisallowedType",
						properties: expectedProperties
					})
				])
			);
		}
	});

	test("can generate schema for spread and tuple arrays", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/spreadArray/testSpreadArray.ts"
		);
		expectGeneratedSchemasToMatch(
			generatedSchemas,
			[testSpreadArraySchema],
			["SpreadTest", "TestObjectA", "TestObjectB"]
		);
	});

	test("can ignore method and call signatures in interfaces", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/signatureMembers/testSignatureMembers.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testSignatureMembersSchema]);
	});

	test("can generate a ref for an import type node", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/importType/testImportType.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testImportTypeSchema]);
	});

	test("can generate an open schema for a typeof type query node", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/typeQuery/testTypeQuery.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testTypeQuerySchema]);
	});

	test("can generate const schemas for qualified typeof on named const object properties", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/typeQueryQualified/testTypeQueryQualified.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testTypeQueryQualifiedSchema]);
		const schema = getSchemaByExpectedTitle(generatedSchemas, testTypeQueryQualifiedSchema);
		expect(schema.properties?.constHost).toEqual({
			const: "localhost",
			description:
				"Qualified typeof resolves the exact string value from a named const object property."
		});
		expect(schema.properties?.constPort).toEqual({
			const: 8080,
			description:
				"Qualified typeof resolves the exact numeric value from a named const object property."
		});
	});

	test("can generate const schemas for literal true and false type nodes", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/literalBooleanType/testLiteralBooleanType.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testLiteralBooleanTypeSchema]);
		const schema = getSchemaByExpectedTitle(generatedSchemas, testLiteralBooleanTypeSchema);
		expect(schema.properties?.trueLiteral.const).toBe(true);
		expect(schema.properties?.falseLiteral.const).toBe(false);
	});

	test("can generate inline schemas for nested object properties", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/nestedObject/testNestedObject.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testNestedObjectSchema]);
	});

	test("can generate refs for imported nested object types", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/nestedImported/testNestedImported.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [
			testNestedImportedSchema,
			testImportedProfileSchema,
			testImportedSettingsSchema
		]);
		expect(packageSchemas["@example.com/pkg"].ImportedProfile).toEqual(testImportedProfileSchema);
		expect(packageSchemas["@example.com/pkg"].ImportedSettings).toEqual(testImportedSettingsSchema);
	});

	test("can generate a ref for IPatchOperation from @twin.org/core across namespaces", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};

		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/externalPatchOperation/testExternalPatchOperation.ts"
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [testExternalPatchOperationSchema]);
		const secondSchema = getSchemaByExpectedTitle(
			generatedSchemas,
			testExternalPatchOperationSchema
		);
		expect(secondSchema.properties?.operation).toEqual({
			$ref: "https://schema.twindev.org/test/PatchOperation",
			description: "The patch operation from the framework package."
		});
		expect(packageSchemas["@twin.org/core"]?.PatchOperation?.$id).toBe(
			"https://schema.twindev.org/test/PatchOperation"
		);
		expect(packageSchemas["@twin.org/core"].IPatchOperation).toBeUndefined();
		expect(packageSchemas["@example.com/pkg"].TestExternalPatchOperation).toEqual(secondSchema);
		expect(packageSchemas["@example.com/pkg"].PatchOperation).toBeUndefined();
	});

	test("can use reference mapping namespace for uncached external package schemas", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};

		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/externalPatchOperation/testExternalPatchOperation.ts",
			{ externalReferences: { "@twin.org/core": "https://schema.twindev.org/mapped/" } }
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [], ["TestExternalPatchOperation"]);
		const schema = getSchemaByExpectedTitle(generatedSchemas, testExternalPatchOperationSchema);

		expect(schema.properties?.operation).toEqual({
			$ref: "https://schema.twindev.org/mapped/PatchOperation",
			description: "The patch operation from the framework package."
		});
		expect(packageSchemas["@twin.org/core"]?.PatchOperation?.$id).toBe(
			"https://schema.twindev.org/mapped/PatchOperation"
		);
	});

	test("can prefer existing package schema over reference mapping namespace", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {
			"@twin.org/core": {
				PatchOperation: {
					$id: "https://schema.twindev.org/existing/PatchOperation"
				}
			}
		};

		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/externalPatchOperation/testExternalPatchOperation.ts",
			{ externalReferences: { "@twin.org/core": "https://schema.twindev.org/mapped/" } }
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [], ["TestExternalPatchOperation"]);
		const schema = getSchemaByExpectedTitle(generatedSchemas, testExternalPatchOperationSchema);

		expect(schema.properties?.operation).toEqual({
			$ref: "https://schema.twindev.org/existing/PatchOperation",
			description: "The patch operation from the framework package."
		});
		expect(packageSchemas["@twin.org/core"]?.PatchOperation?.$id).toBe(
			"https://schema.twindev.org/existing/PatchOperation"
		);
	});

	test("can use wildcard reference mapping for imported type ids", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};

		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/externalPatchOperation/testExternalPatchOperation.ts",
			{ externalReferences: { "*Operation": "https://schema.twindev.org/wildcard/" } }
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [], ["TestExternalPatchOperation"]);
		const schema = getSchemaByExpectedTitle(generatedSchemas, testExternalPatchOperationSchema);

		expect(schema.properties?.operation).toEqual({
			$ref: "https://schema.twindev.org/wildcard/PatchOperation",
			description: "The patch operation from the framework package."
		});
		expect(packageSchemas["@twin.org/core"]?.PatchOperation?.$id).toBe(
			"https://schema.twindev.org/wildcard/PatchOperation"
		);
	});

	test("can use regex literal reference mapping for imported type ids", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};

		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/test/",
			"@example.com/pkg",
			packageSchemas,
			"tests/utils/testData/externalPatchOperation/testExternalPatchOperation.ts",
			{ externalReferences: { "/.*Operation$/": "https://schema.twindev.org/regex/" } }
		);
		expectGeneratedSchemasToMatch(generatedSchemas, [], ["TestExternalPatchOperation"]);
		const schema = getSchemaByExpectedTitle(generatedSchemas, testExternalPatchOperationSchema);

		expect(schema.properties?.operation).toEqual({
			$ref: "https://schema.twindev.org/regex/PatchOperation",
			description: "The patch operation from the framework package."
		});
		expect(packageSchemas["@twin.org/core"]?.PatchOperation?.$id).toBe(
			"https://schema.twindev.org/regex/PatchOperation"
		);
	});

	test("can generate schemas for all jsonLd types via glob", async () => {
		const tsToSchema = new TypeScriptToSchema();
		const packageSchemas: { [id: string]: { [id: string]: IJsonSchema } } = {};
		const generatedSchemas = await tsToSchema.generateSchema(
			"https://schema.twindev.org/json-ld/",
			"@twin.org/data-json-ld",
			packageSchemas,
			"tests/utils/testData/jsonLd/*.ts"
		);
		for (const [title, schema] of Object.entries(generatedSchemas)) {
			const fixturePath = path.join("tests/utils/testData/jsonLd", `${title}.json`);
			const expectedSchema = JSON.parse(fs.readFileSync(fixturePath, "utf8")) as IJsonSchema;
			expect(schema).toEqual(expectedSchema);
		}
	});
});
