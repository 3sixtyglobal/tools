// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Is } from "@3sixty/core";
import * as ts from "typescript";

/**
 * Builds regex patterns for TypeScript template literal types.
 */
export class TemplateLiteralPatternBuilder {
	/**
	 * Build a regular-expression pattern for a template literal type.
	 * @param typeNode The template literal type node.
	 * @returns The regex pattern, or undefined if a safe pattern cannot be derived.
	 */
	public static buildTemplateLiteralPattern(
		typeNode: ts.TemplateLiteralTypeNode
	): string | undefined {
		// The head is the fixed prefix text before the first interpolation, e.g. "prefix-" in
		// `prefix-${T}-suffix`
		let templatePattern = `^${TemplateLiteralPatternBuilder.escapeRegexPattern(typeNode.head.text)}`;

		// Each span is one ${T} interpolation plus the literal text that follows it
		for (const templateSpan of typeNode.templateSpans) {
			const spanPattern = TemplateLiteralPatternBuilder.buildTemplateLiteralSpanPattern(
				templateSpan.type
			);
			if (!spanPattern) {
				return undefined;
			}

			templatePattern += `${spanPattern}${TemplateLiteralPatternBuilder.escapeRegexPattern(templateSpan.literal.text)}`;
		}

		return `${templatePattern}$`;
	}

	/**
	 * Build a regex fragment for a template literal placeholder type.
	 * @param typeNode The placeholder type node.
	 * @returns The regex fragment, or undefined if unsupported.
	 * @internal
	 */
	private static buildTemplateLiteralSpanPattern(typeNode: ts.TypeNode): string | undefined {
		// string  (string keyword lets any content through)
		if (typeNode.kind === ts.SyntaxKind.StringKeyword) {
			return ".*";
		}

		// MyAlias  (plain type reference with no type arguments is treated as open string)
		if (
			ts.isTypeReferenceNode(typeNode) &&
			ts.isIdentifier(typeNode.typeName) &&
			(typeNode.typeArguments?.length ?? 0) === 0
		) {
			return ".*";
		}

		// number  (number keyword matches optional sign, digits, and optional decimal)
		if (typeNode.kind === ts.SyntaxKind.NumberKeyword) {
			return "-?(?:0|[1-9]\\d*)(?:\\.\\d+)?";
		}

		// boolean  (boolean keyword matches the two literal words)
		if (typeNode.kind === ts.SyntaxKind.BooleanKeyword) {
			return "(?:true|false)";
		}

		// "hello" or 42 or true or false  (literal type node)
		if (ts.isLiteralTypeNode(typeNode)) {
			// "hello" or 42  (string or numeric literal)
			if (ts.isStringLiteral(typeNode.literal) || ts.isNumericLiteral(typeNode.literal)) {
				return TemplateLiteralPatternBuilder.escapeRegexPattern(typeNode.literal.text);
			}

			// true  (true keyword literal)
			if (typeNode.literal.kind === ts.SyntaxKind.TrueKeyword) {
				return "true";
			}

			// false  (false keyword literal)
			if (typeNode.literal.kind === ts.SyntaxKind.FalseKeyword) {
				return "false";
			}
		}

		// "a" | "b" | "c"  (union of literal types)
		if (ts.isUnionTypeNode(typeNode)) {
			const unionPatterns = typeNode.types
				.map(unionType => TemplateLiteralPatternBuilder.buildTemplateLiteralSpanPattern(unionType))
				.filter((pattern): pattern is string => Is.stringValue(pattern));

			if (unionPatterns.length === typeNode.types.length) {
				return `(?:${unionPatterns.join("|")})`;
			}
		}

		// `prefix-${T}`  (nested template literal type, strip outer anchors)
		if (ts.isTemplateLiteralTypeNode(typeNode)) {
			const nestedPattern = TemplateLiteralPatternBuilder.buildTemplateLiteralPattern(typeNode);
			return nestedPattern ? nestedPattern.replace(/^\^/, "").replace(/\$$/, "") : undefined;
		}

		return undefined;
	}

	/**
	 * Escape regex metacharacters in a literal text fragment so it matches verbatim.
	 * @param value The text to escape.
	 * @returns The escaped regex text.
	 * @internal
	 */
	private static escapeRegexPattern(value: string): string {
		return value.replace(/[$()*+.?[\\\]^{|}-]/g, "\\$&");
	}
}
