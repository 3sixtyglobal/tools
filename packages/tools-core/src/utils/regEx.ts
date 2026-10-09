// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Utility methods for pattern matching and regex construction.
 */
export class RegEx {
	/**
	 * Determine whether a reference mapping pattern matches an external reference.
	 * @param pattern The mapping pattern.
	 * @param packageName The external package name.
	 * @param typeName The imported type name.
	 * @param schemaTitle The derived schema title.
	 * @returns True if matched.
	 */
	public static isReferencePatternMatch(
		pattern: string,
		packageName: string,
		typeName: string,
		schemaTitle: string
	): boolean {
		const regex = RegEx.toRegexFromReferencePattern(pattern);
		return regex
			? regex.test(packageName) || regex.test(typeName) || regex.test(schemaTitle)
			: false;
	}

	/**
	 * Apply a reference mapping replacement to the first matching candidate.
	 * @param pattern The mapping pattern.
	 * @param replacement The replacement template.
	 * @param packageName The external package name.
	 * @param typeName The imported type name.
	 * @param schemaTitle The derived schema title.
	 * @returns The replaced value if a candidate matches.
	 */
	public static applyReferencePatternReplacement(
		pattern: string,
		replacement: string,
		packageName: string,
		typeName: string,
		schemaTitle: string
	): string | undefined {
		const regex = RegEx.toRegexFromReferencePattern(pattern);
		if (!regex) {
			return undefined;
		}

		for (const candidate of [packageName, typeName, schemaTitle]) {
			regex.lastIndex = 0;
			if (regex.test(candidate)) {
				regex.lastIndex = 0;
				return candidate.replace(regex, replacement);
			}
		}

		return undefined;
	}

	/**
	 * Determine if a mapping pattern is a regex literal surrounded by forward slashes.
	 * Example pattern: /^foo.*bar$/.
	 * @param pattern The mapping pattern.
	 * @returns True if the pattern looks like a regex literal.
	 * @internal
	 */
	private static isRegexLiteralPattern(pattern: string): boolean {
		return pattern.length > 2 && pattern.startsWith("/") && pattern.endsWith("/");
	}

	/**
	 * Determine if a mapping pattern should be treated as a raw regex expression.
	 * Any pattern that contains at least one regex meta character is treated as a raw expression.
	 * @param pattern The mapping pattern.
	 * @returns True if the pattern contains regex syntax.
	 * @internal
	 */
	private static isRegexExpressionPattern(pattern: string): boolean {
		return /[()[\]{}+?|^$\\]/u.test(pattern);
	}

	/**
	 * Convert a regex literal mapping pattern to a RegExp.
	 * The surrounding forward slashes are stripped before compiling.
	 * @param pattern The regex literal pattern, e.g. /^foo.*bar$/
	 * @returns The RegExp instance, or undefined when the inner expression is invalid.
	 * @internal
	 */
	private static toRegexFromLiteralPattern(pattern: string): RegExp | undefined {
		try {
			return new RegExp(pattern.slice(1, -1));
		} catch {
			return undefined;
		}
	}

	/**
	 * Convert a raw regex expression mapping pattern to a RegExp anchored to full-string match.
	 * The expression is wrapped with ^ and $ so that partial matches are not accepted.
	 * @param pattern The raw regex expression.
	 * @returns The RegExp instance, or undefined when the expression is invalid.
	 * @internal
	 */
	private static toRegexFromExpressionPattern(pattern: string): RegExp | undefined {
		try {
			return new RegExp(`^${pattern}$`);
		} catch {
			return undefined;
		}
	}

	/**
	 * Select and compile the appropriate RegExp for a reference mapping pattern.
	 * Evaluation order: regex literal -> raw regex expression -> wildcard glob.
	 * Plain strings with none of these characteristics return undefined.
	 * @param pattern The mapping pattern.
	 * @returns The RegExp instance, or undefined when the pattern is not pattern-based.
	 * @internal
	 */
	private static toRegexFromReferencePattern(pattern: string): RegExp | undefined {
		if (RegEx.isRegexLiteralPattern(pattern)) {
			return RegEx.toRegexFromLiteralPattern(pattern);
		}

		if (RegEx.isRegexExpressionPattern(pattern)) {
			return RegEx.toRegexFromExpressionPattern(pattern);
		}

		if (pattern.includes("*")) {
			return RegEx.toRegexFromWildcardPattern(pattern);
		}

		return undefined;
	}

	/**
	 * Convert a glob wildcard pattern to a RegExp.
	 * All regex metacharacters in the pattern are escaped first, then each * is replaced with .*.
	 * The resulting expression is anchored with ^ and $ for full-string matching.
	 * @param pattern The wildcard pattern, e.g. *Operation or @3sixty/*.
	 * @returns The compiled RegExp.
	 * @internal
	 */
	private static toRegexFromWildcardPattern(pattern: string): RegExp {
		const escapedPattern = pattern.replace(/[$()+./?[\\\]^{|}-]/g, "\\$&");
		const regexPattern = `^${escapedPattern.replace(/\*/g, ".*")}$`;
		return new RegExp(regexPattern);
	}
}
