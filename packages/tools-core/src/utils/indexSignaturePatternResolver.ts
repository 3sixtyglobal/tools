// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import * as ts from "typescript";
import { TemplateLiteralPatternBuilder } from "./templateLiteralPatternBuilder.js";
import type { ITypeScriptToSchemaContext } from "../models/ITypeScriptToSchemaContext.js";

/**
 * Resolves regex patterns for index signature key types.
 */
export class IndexSignaturePatternResolver {
	/**
	 * Determine whether an index signature can be represented as JSON object additionalProperties.
	 * @param member The index signature declaration.
	 * @returns True if supported.
	 */
	public static isSupportedIndexSignature(member: ts.IndexSignatureDeclaration): boolean {
		// [key: string]: Value  (index signature, first parameter is the key)
		const indexParameter = member.parameters[0];
		if (!indexParameter?.type) {
			return false;
		}

		// [key: string]: Value  or  [key: number]: Value  (string or numeric key)
		return (
			indexParameter.type.kind === ts.SyntaxKind.StringKeyword ||
			indexParameter.type.kind === ts.SyntaxKind.NumberKeyword
		);
	}

	/**
	 * Extract a regex pattern for an index signature key type when representable.
	 * @param context The generation context.
	 * @param member The index signature declaration.
	 * @param getTypeParameterBinding Callback for resolving generic bindings.
	 * @returns The property-name pattern, if derivable.
	 */
	public static extractIndexSignaturePattern(
		context: ITypeScriptToSchemaContext,
		member: ts.IndexSignatureDeclaration,
		getTypeParameterBinding: (
			context: ITypeScriptToSchemaContext,
			typeName: string
		) => ts.TypeNode | null | undefined
	): string | undefined {
		const indexParameterType = member.parameters[0]?.type;
		if (!indexParameterType) {
			return undefined;
		}

		const resolvedTemplateType = IndexSignaturePatternResolver.resolveTemplateLiteralTypeNode(
			context,
			indexParameterType,
			new Set<string>(),
			getTypeParameterBinding
		);

		return resolvedTemplateType
			? TemplateLiteralPatternBuilder.buildTemplateLiteralPattern(resolvedTemplateType)
			: undefined;
	}

	/**
	 * Resolve a template literal type node from a key-type expression.
	 * Handles parenthesised, readonly-wrapped, and type-aliased variants by recursing.
	 * A cycle guard via resolvingTypeNames prevents unbounded recursion on self-referential types.
	 * @param context The generation context.
	 * @param typeNode The key type node.
	 * @param resolvingTypeNames Type names currently being resolved.
	 * @param getTypeParameterBinding Callback for resolving generic bindings.
	 * @returns A template literal type node when resolvable.
	 * @internal
	 */
	private static resolveTemplateLiteralTypeNode(
		context: ITypeScriptToSchemaContext,
		typeNode: ts.TypeNode,
		resolvingTypeNames: Set<string>,
		getTypeParameterBinding: (
			context: ITypeScriptToSchemaContext,
			typeName: string
		) => ts.TypeNode | null | undefined
	): ts.TemplateLiteralTypeNode | undefined {
		// `prefix-${T}` or `${K}`  (already a template literal type)
		if (ts.isTemplateLiteralTypeNode(typeNode)) {
			return typeNode;
		}

		// (KeyType)  (parenthesised type, unwrap and recurse)
		if (ts.isParenthesizedTypeNode(typeNode)) {
			return IndexSignaturePatternResolver.resolveTemplateLiteralTypeNode(
				context,
				typeNode.type,
				resolvingTypeNames,
				getTypeParameterBinding
			);
		}

		// readonly KeyType  (readonly-wrapped type operator, strip modifier and recurse)
		if (ts.isTypeOperatorNode(typeNode) && typeNode.operator === ts.SyntaxKind.ReadonlyKeyword) {
			return IndexSignaturePatternResolver.resolveTemplateLiteralTypeNode(
				context,
				typeNode.type,
				resolvingTypeNames,
				getTypeParameterBinding
			);
		}

		// MyKeyType  (named type reference, resolve via binding or type alias in source file)
		if (ts.isTypeReferenceNode(typeNode)) {
			// Namespace.TypeName  (qualified name) or TypeName  (plain identifier)
			const typeName = ts.isIdentifier(typeNode.typeName)
				? typeNode.typeName.text
				: typeNode.typeName.right.text;

			if (resolvingTypeNames.has(typeName)) {
				return undefined;
			}

			const typeParameterBinding = getTypeParameterBinding(context, typeName);
			if (typeParameterBinding) {
				return IndexSignaturePatternResolver.resolveTemplateLiteralTypeNode(
					context,
					typeParameterBinding,
					resolvingTypeNames,
					getTypeParameterBinding
				);
			}

			const sourceFile = context.activeSourceFile;
			if (!sourceFile) {
				return undefined;
			}

			// type MyKeyType = `prefix-${string}`  (look up a type alias in the active source file)
			const typeAlias = sourceFile.statements.find(
				(statement): statement is ts.TypeAliasDeclaration =>
					ts.isTypeAliasDeclaration(statement) && statement.name.text === typeName
			);

			if (typeAlias) {
				resolvingTypeNames.add(typeName);
				const resolvedTemplateType = IndexSignaturePatternResolver.resolveTemplateLiteralTypeNode(
					context,
					typeAlias.type,
					resolvingTypeNames,
					getTypeParameterBinding
				);
				resolvingTypeNames.delete(typeName);
				return resolvedTemplateType;
			}
		}

		return undefined;
	}
}
