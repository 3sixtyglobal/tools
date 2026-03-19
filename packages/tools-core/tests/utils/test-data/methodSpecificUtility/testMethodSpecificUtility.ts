// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

type FunctionLike = (input: string) => number;

/**
 * Coverage for method-specific utility and callable helper types.
 */
export interface TestMethodSpecificUtility {
	awaitedType: Awaited<Promise<string>>;
	returnType: ReturnType<FunctionLike>;
	parametersType: Parameters<FunctionLike>;
	constructorParametersType: ConstructorParameters<typeof Date>;
	instanceType: InstanceType<typeof Date>;
	thisParameterType: ThisParameterType<(this: Date, input: string) => void>;
	omitThisParameterType: OmitThisParameter<(this: Date, input: number) => string>;
	thisType: ThisType<{ id: string }>;
	callableFunction: CallableFunction;
	newableFunction: NewableFunction;
	ok: string;
}
