// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Is } from "@twin.org/core";
import * as ts from "typescript";
import { Utility } from "./utility.js";

/**
 * Utility methods for extracting enum values from TypeScript AST nodes.
 *
 * Handles three distinct patterns used to define enumerable sets of values:
 * - Native enum declarations: `enum Color { Red = "red" }`
 * - Const-object-with-matching-type patterns: `const Foo = { A: "a" } as const` paired with a type alias named identically to the const
 */
export class Enum {
	/**
	 * Extract enum values from a const-and-type pair where a const object and a type alias share the
	 * same name.  The const object is located first because its members may carry JSDoc descriptions
	 * that would be lost if the type alias were processed in isolation.
	 * @param name The name to search for.
	 * @param sourceFile The source file to search.
	 * @returns The extracted enum entries or undefined when the pattern is not present.
	 */
	public static extractEnumValuesFromConstAndType(
		name: string,
		sourceFile: ts.SourceFile
	): { value: string | number; description?: string }[] | undefined {
		// const Foo = { A: "a", B: "b" } as const
		const varStmt = sourceFile.statements.find(stmt => {
			// const Foo = ...
			if (!ts.isVariableStatement(stmt)) {
				return false;
			}

			const decl = stmt.declarationList.declarations[0];
			// Foo (the identifier that names the const)
			return decl?.name && ts.isIdentifier(decl.name) && decl.name.text === name;
		}) as ts.VariableStatement | undefined;

		if (!varStmt) {
			return undefined;
		}

		const decl = varStmt.declarationList.declarations[0];
		if (!decl?.initializer) {
			return undefined;
		}

		let objLiteral: ts.ObjectLiteralExpression | undefined;

		// { A: "a", B: "b" }
		if (ts.isObjectLiteralExpression(decl.initializer)) {
			objLiteral = decl.initializer;
		} else if (
			// { A: "a", B: "b" } as const
			ts.isAsExpression(decl.initializer) &&
			ts.isObjectLiteralExpression(decl.initializer.expression)
		) {
			objLiteral = decl.initializer.expression;
		}

		if (!objLiteral) {
			return undefined;
		}

		const entries = Enum.extractEnumEntriesFromConstObject(objLiteral);
		return entries.length > 0 ? entries : undefined;
	}

	/**
	 * Extract enum entries from a const object literal.
	 * Only properties whose initializer is a string or numeric literal are included.
	 * @param objLiteral The object literal expression.
	 * @returns The extracted enum entries.
	 */
	public static extractEnumEntriesFromConstObject(
		objLiteral: ts.ObjectLiteralExpression
	): { value: string | number; description?: string }[] {
		return (
			objLiteral.properties
				// A: "a"  (property assignment with an initializer)
				.filter(prop => ts.isPropertyAssignment(prop) && prop.initializer)
				.map<{ value: string | number; description?: string } | null>(prop => {
					const assignment = prop as ts.PropertyAssignment;
					const initializer = assignment.initializer;
					const description = Utility.getNodeJsDocDescription(assignment);

					// "a"  (string literal initializer)
					if (ts.isStringLiteral(initializer)) {
						return {
							value: initializer.text as string | number,
							description: description ?? undefined
						};
					}

					// 42  (numeric literal initializer)
					if (ts.isNumericLiteral(initializer)) {
						return {
							value: Number(initializer.text),
							description: description ?? undefined
						};
					}

					return null;
				})
				.filter(
					(entry): entry is { value: string | number; description?: string } => entry !== null
				)
		);
	}

	/**
	 * Extract enum values from a native TypeScript enum declaration.
	 * Numeric members without an explicit initializer are auto-incremented from the previous value.
	 * @param declaration The enum declaration.
	 * @returns The extracted enum entries.
	 */
	public static extractEnumValuesFromEnumDeclaration(
		declaration: ts.EnumDeclaration
	): { value: string | number; description?: string }[] {
		const entries: { value: string | number; description?: string }[] = [];
		let nextNumericValue = 0;

		// enum Color { Red = "red", Count = 1 }
		for (const member of declaration.members) {
			const resolvedValue = Enum.resolveEnumMemberValue(member, nextNumericValue);
			if (resolvedValue !== undefined) {
				entries.push({
					value: resolvedValue,
					description: Utility.getNodeJsDocDescription(member)
				});

				if (Is.number(resolvedValue)) {
					nextNumericValue = resolvedValue + 1;
				}
			}
		}

		return entries;
	}

	/**
	 * Resolve the literal value of an enum member when possible.
	 * Members without an initializer inherit the current auto-increment counter.
	 * Negative numeric members expressed as unary minus (e.g. -1) are also resolved.
	 * @param member The enum member node.
	 * @param defaultNumericValue The default numeric value for auto-incremented members.
	 * @returns The resolved enum value, or undefined when the initializer cannot be evaluated statically.
	 * @internal
	 */
	private static resolveEnumMemberValue(
		member: ts.EnumMember,
		defaultNumericValue: number
	): string | number | undefined {
		// Red  (member with no explicit initializer inherits the auto-increment counter)
		if (!member.initializer) {
			return defaultNumericValue;
		}

		// Red = "red"  (string literal enum member)
		if (ts.isStringLiteral(member.initializer)) {
			return member.initializer.text;
		}

		// Count = 42  (positive numeric literal enum member)
		if (ts.isNumericLiteral(member.initializer)) {
			return Number(member.initializer.text);
		}

		if (
			// Negative = -1  (prefix unary minus applied to a numeric literal)
			ts.isPrefixUnaryExpression(member.initializer) &&
			member.initializer.operator === ts.SyntaxKind.MinusToken &&
			ts.isNumericLiteral(member.initializer.operand)
		) {
			return -Number(member.initializer.operand.text);
		}

		if (
			// Explicit = +1  (prefix unary plus applied to a numeric literal)
			ts.isPrefixUnaryExpression(member.initializer) &&
			member.initializer.operator === ts.SyntaxKind.PlusToken &&
			ts.isNumericLiteral(member.initializer.operand)
		) {
			return Number(member.initializer.operand.text);
		}

		return undefined;
	}
}
