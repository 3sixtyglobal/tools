// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

const base = { a: 1 } as const;
const dynamicKey = "dynamicKey";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const inferredObject = { ...base, [dynamicKey]: "value", ok: true } as const;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const inferredTuple = [1, ...[2, 3]] as const;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const inferredFn = (x: string): number => x.length;

export interface TestDiagnosticsCoverage {
	(input: number): string;
	fnProp: (input: string) => number;
	inferredObj: typeof inferredObject;
	inferredTuple: typeof inferredTuple;
	inferredFnType: typeof inferredFn;
	unsupportedTemplate: `${Uppercase<string>}`;
	unsupportedUtility: ReturnType<() => string>;
	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	unsupportedImport: typeof import("./importTypeTarget.js");
	ok: string;
	method(input: string): number;
}
