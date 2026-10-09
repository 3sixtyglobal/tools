// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Resolver } from "../../src/utils/resolver.js";

describe("Resolver", () => {
	test("can resolve IPatchOperation from @3sixty/core", async () => {
		const resolvedDeclaration = Resolver.resolveTypeDeclarationAst(
			"@3sixty/core",
			"IPatchOperation"
		);

		expect(resolvedDeclaration).toBeDefined();
		expect(resolvedDeclaration?.declaration.name.text).toBe("IPatchOperation");
	});

	test("returns undefined for unknown types", async () => {
		const resolvedDeclaration = Resolver.resolveTypeDeclarationAst("@3sixty/core", "IDoesNotExist");

		expect(resolvedDeclaration).toBeUndefined();
	});

	test("uses cache for repeated type lookups", async () => {
		const firstResolution = Resolver.resolveTypeDeclarationAst("@3sixty/core", "IPatchOperation");
		const secondResolution = Resolver.resolveTypeDeclarationAst("@3sixty/core", "IPatchOperation");

		expect(firstResolution).toBeDefined();
		expect(secondResolution).toBe(firstResolution);
	});
});
