// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Is } from "@twin.org/core";
import * as ts from "typescript";

/**
 * General-purpose utility methods for working with JsDoc.
 */
export class JsDoc {
	/**
	 * Extract the JSDoc description comment for an AST node.
	 * Only top-level JSDoc block comments are considered; inline tags are ignored.
	 * @param node The node to inspect.
	 * @returns The trimmed description text, or undefined when absent.
	 */
	public static getNodeJsDocDescription(node: ts.Node): string | undefined {
		// /** Description text */ (JSDoc block attached to a declaration)
		const jsDocNodes = ts
			.getJSDocCommentsAndTags(node)
			.filter(commentOrTag => ts.isJSDoc(commentOrTag));
		const description = jsDocNodes
			.map(jsDocNode => ts.getTextOfJSDocComment(jsDocNode.comment)?.trim())
			.find((value): value is string => Boolean(value));

		if (description) {
			return description;
		}

		return undefined;
	}

	/**
	 * Convert a JSDoc tag's comment portion to a plain text string.
	 * JSDoc tag comments may be plain strings or arrays of link/text parts.
	 * @param jsDocTag The JSDoc tag.
	 * @returns The comment text, or undefined when absent.
	 */
	public static getJSDocTagCommentText(jsDocTag: ts.JSDocTag): string | undefined {
		if (Is.string(jsDocTag.comment)) {
			return jsDocTag.comment;
		}

		if (Array.isArray(jsDocTag.comment)) {
			return jsDocTag.comment
				.map(part => part.text)
				.join("")
				.trim();
		}

		return undefined;
	}

	/**
	 * Read all custom JSDoc tags matching a tag name from a node and convert them to key/value pairs.
	 * Each matching tag's comment must be in the form "key: value"; entries that do not follow this
	 * convention are silently skipped.
	 * @param node The node to inspect.
	 * @param tagName The tag name to filter by (e.g., 'json-schema').
	 * @returns The extracted key/value pairs.
	 */
	public static getNodeTags(node: ts.Node, tagName: string): { [id: string]: string } {
		const output: { [id: string]: string } = {};
		for (const jsDocTag of ts.getJSDocTags(node)) {
			if (jsDocTag.tagName.text === tagName) {
				const commentText = JsDoc.getJSDocTagCommentText(jsDocTag);
				if (commentText) {
					const separatorIndex = commentText.indexOf(":");
					if (separatorIndex > 0) {
						const key = commentText.slice(0, separatorIndex).trim();
						const value = commentText.slice(separatorIndex + 1).trim();
						if (key.length > 0) {
							output[key] = value;
						}
					}
				}
			}
		}

		return output;
	}

	/**
	 * Read the plain comment text for the first matching JSDoc tag on a node.
	 * @param node The node to inspect.
	 * @param tagName The tag name to filter by (e.g., 'default').
	 * @returns The trimmed comment text, or undefined when absent.
	 */
	public static getNodeTagComment(node: ts.Node, tagName: string): string | undefined {
		for (const jsDocTag of ts.getJSDocTags(node)) {
			if (jsDocTag.tagName.text === tagName) {
				const commentText = JsDoc.getJSDocTagCommentText(jsDocTag)?.trim();
				if (commentText) {
					return commentText;
				}
			}
		}

		return undefined;
	}

	/**
	 * Parse a custom JSDoc tag value into JSON-compatible data.
	 * Values that begin with a JSON token character ({, [, ", true, false, null) or look like a
	 * number are parsed with JSON.parse.  All other values are returned as plain strings.
	 * @param value The raw value text.
	 * @returns The parsed value.
	 */
	public static parseTagValue(value: string): unknown {
		const trimmedValue = value.trim();
		if (trimmedValue.length === 0) {
			return "";
		}

		const startsWithJsonToken =
			trimmedValue.startsWith("{") ||
			trimmedValue.startsWith("[") ||
			trimmedValue.startsWith('"') ||
			trimmedValue === "true" ||
			trimmedValue === "false" ||
			trimmedValue === "null" ||
			/^-?\d+(\.\d+)?$/u.test(trimmedValue);

		if (!startsWithJsonToken) {
			return trimmedValue;
		}

		try {
			return JSON.parse(trimmedValue);
		} catch {
			return trimmedValue;
		}
	}
}
