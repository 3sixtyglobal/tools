// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import * as ts from "typescript";

/**
 * Validates whether a type node is allowed for schema generation.
 */
export class DisallowedTypeGuard {
	/**
	 * Type names that are not supported for JSON schema generation.
	 */
	private static readonly _DISALLOWED_TYPE_NAMES: string[] = [
		"Date",
		"RegExp",
		"Function",
		"Error",
		"TypeError",
		"RangeError",
		"EvalError",
		"ReferenceError",
		"SyntaxError",
		"URIError",
		"AggregateError",
		"bigint",
		"BigInt",
		"BigInt64Array",
		"BigUint64Array",
		"DataView",
		"Promise",
		"WeakRef",
		"URL",
		"URLSearchParams",
		"Blob",
		"File",
		"FormData",
		"ReadableStream",
		"WeakMap",
		"WeakSet",
		"Symbol"
	];

	/**
	 * Resolve a disallowed type name from a type node.
	 * @param typeNode The type node to inspect.
	 * @returns The disallowed type name, if found.
	 */
	public static getDisallowedTypeName(typeNode: ts.TypeNode): string | undefined {
		// (string | number)  (parenthesised type, unwrap and recurse)
		if (ts.isParenthesizedTypeNode(typeNode)) {
			return DisallowedTypeGuard.getDisallowedTypeName(typeNode.type);
		}

		// readonly T[] or keyof T or unique symbol  (type operator node)
		if (ts.isTypeOperatorNode(typeNode)) {
			if (
				typeNode.operator === ts.SyntaxKind.UniqueKeyword &&
				typeNode.type.kind === ts.SyntaxKind.SymbolKeyword
			) {
				return "symbol";
			}

			return DisallowedTypeGuard.getDisallowedTypeName(typeNode.type);
		}

		// bigint  (bigint keyword type, always disallowed)
		if (typeNode.kind === ts.SyntaxKind.BigIntKeyword) {
			return "bigint";
		}

		// symbol  (symbol keyword type, always disallowed)
		if (typeNode.kind === ts.SyntaxKind.SymbolKeyword) {
			return "symbol";
		}

		// 9007199254740991n  (bigint literal wrapped in a literal type node)
		if (ts.isLiteralTypeNode(typeNode) && ts.isBigIntLiteral(typeNode.literal)) {
			return "bigint";
		}

		// Date or RegExp or Promise<T>  (named type reference)
		if (ts.isTypeReferenceNode(typeNode)) {
			// Namespace.TypeName  (qualified name) or TypeName  (plain identifier)
			const rawTypeName = ts.isIdentifier(typeNode.typeName)
				? typeNode.typeName.text
				: typeNode.typeName.right.text;
			const normalizedTypeName = rawTypeName.toLowerCase();
			const matchedTypeName = DisallowedTypeGuard._DISALLOWED_TYPE_NAMES.find(
				typeName => typeName.toLowerCase() === normalizedTypeName
			);
			if (matchedTypeName) {
				return matchedTypeName;
			}
		}

		// string[]  (array type, check the element type)
		if (ts.isArrayTypeNode(typeNode)) {
			return DisallowedTypeGuard.getDisallowedTypeName(typeNode.elementType);
		}

		// [string, number]  (tuple type, check each element)
		if (ts.isTupleTypeNode(typeNode)) {
			return DisallowedTypeGuard.getDisallowedTypeNameFromTypeNodes(typeNode.elements);
		}

		// string | number  (union) or TypeA & TypeB  (intersection)
		if (ts.isUnionTypeNode(typeNode) || ts.isIntersectionTypeNode(typeNode)) {
			return DisallowedTypeGuard.getDisallowedTypeNameFromTypeNodes(typeNode.types);
		}

		// T["key"]  (indexed access type, check both object and index sides)
		if (ts.isIndexedAccessTypeNode(typeNode)) {
			return (
				DisallowedTypeGuard.getDisallowedTypeName(typeNode.objectType) ??
				DisallowedTypeGuard.getDisallowedTypeName(typeNode.indexType)
			);
		}

		// T extends U ? X : Y  (conditional type, check all four branches)
		if (ts.isConditionalTypeNode(typeNode)) {
			return (
				DisallowedTypeGuard.getDisallowedTypeName(typeNode.checkType) ??
				DisallowedTypeGuard.getDisallowedTypeName(typeNode.extendsType) ??
				DisallowedTypeGuard.getDisallowedTypeName(typeNode.trueType) ??
				DisallowedTypeGuard.getDisallowedTypeName(typeNode.falseType)
			);
		}

		// { [K in keyof T]: T[K] }  (mapped type, check constraint, name type, and value type)
		if (ts.isMappedTypeNode(typeNode)) {
			return (
				(typeNode.typeParameter.constraint
					? DisallowedTypeGuard.getDisallowedTypeName(typeNode.typeParameter.constraint)
					: undefined) ??
				(typeNode.nameType
					? DisallowedTypeGuard.getDisallowedTypeName(typeNode.nameType)
					: undefined) ??
				(typeNode.type ? DisallowedTypeGuard.getDisallowedTypeName(typeNode.type) : undefined)
			);
		}

		// { prop: string }  (inline object type literal, inspect each member)
		if (ts.isTypeLiteralNode(typeNode)) {
			for (const member of typeNode.members) {
				if (
					// prop: string  or  [key: string]: Value  (property or index signature)
					(ts.isPropertySignature(member) || ts.isIndexSignatureDeclaration(member)) &&
					member.type
				) {
					const memberDisallowedTypeName = DisallowedTypeGuard.getDisallowedTypeName(member.type);
					if (memberDisallowedTypeName) {
						return memberDisallowedTypeName;
					}
				}
			}
		}

		return undefined;
	}

	/**
	 * Resolve the first disallowed type name from a collection of type nodes.
	 * @param typeNodes The nodes to inspect.
	 * @returns The disallowed type name, if found.
	 * @internal
	 */
	private static getDisallowedTypeNameFromTypeNodes(
		typeNodes: readonly ts.TypeNode[] | ts.NodeArray<ts.TypeNode> | undefined
	): string | undefined {
		if (!typeNodes) {
			return undefined;
		}

		for (const typeNode of typeNodes) {
			const disallowedTypeName = DisallowedTypeGuard.getDisallowedTypeName(typeNode);
			if (disallowedTypeName) {
				return disallowedTypeName;
			}
		}

		return undefined;
	}
}
