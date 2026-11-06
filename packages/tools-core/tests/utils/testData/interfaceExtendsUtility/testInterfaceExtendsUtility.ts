// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Derived interface extending multiple base interfaces using utility methods.
 */
export interface ITestInterfaceUtility
	extends Omit<ITestInterfaceUtilityBaseA, "baseA2">, Pick<ITestInterfaceUtilityBaseB, "baseB"> {
	/**
	 * Derived interface identifier.
	 */
	id: string;
}

/**
 * Base interface A.
 */
export interface ITestInterfaceUtilityBaseA {
	/**
	 * Base A field.
	 */
	baseA: string;

	/**
	 * Base A field 2.
	 */
	baseA2: number;
}

/**
 * Base interface B.
 */
export interface ITestInterfaceUtilityBaseB {
	/**
	 * Base B field.
	 */
	baseB: number;

	/**
	 * Base B field 2.
	 */
	baseB2: number;
}

/**
 * Base interface for redefinition test.
 */
export interface IOmitRedefinitionBaseA {
	/**
	 * Required field from base.
	 */
	prop1: string;

	/**
	 * Optional field in base that will be redefined as required.
	 */
	prop2?: boolean;
}

/**
 * Derived interface that omits prop2 from base and redefines it as required.
 */
export interface IOmitRedefinitionFaceB extends Omit<IOmitRedefinitionBaseA, "prop2"> {
	/**
	 * Redefined prop2 as required boolean instead of optional.
	 */
	prop2: boolean;
}

/**
 * Base interface for required-to-optional redefinition test.
 */
export interface IOmitOptionalityReverseBaseA {
	/**
	 * Required field that remains inherited.
	 */
	prop1: string;

	/**
	 * Required field that will be redefined as optional.
	 */
	prop2: boolean;
}

/**
 * Derived interface that omits prop2 from base and redefines it as optional.
 */
export interface IOmitOptionalityReverseFaceB extends Omit<IOmitOptionalityReverseBaseA, "prop2"> {
	/**
	 * Redefined prop2 as optional boolean instead of required.
	 */
	prop2?: boolean;
}

/**
 * Base interface for double inheritance test.
 */
export interface IDoubleInheritanceA {
	/**
	 * The context for the policy.
	 */
	"@context": string;

	/**
	 * The type of policy.
	 */
	"@type": string;

	/**
	 * The unique identifier for the policy.
	 */
	uid: string;

	/**
	 * The profile(s) this policy conforms to.
	 */
	profile?: string | string[];

	/**
	 * The assigner of the policy.
	 */
	assigner?: string | string[];
}

/**
 * Intermediate interface extending A.
 */
export interface IDoubleInheritanceB extends IDoubleInheritanceA {
	/**
	 * The type must be "Offer".
	 */
	"@type": "Offer";

	/**
	 * The assigner of the offer.
	 */
	assigner: string | string[];
}

/**
 * Derived interface that omits prop1 from B (which extends A).
 */
export interface IDoubleInheritanceC extends Omit<IDoubleInheritanceB, "uid" | "@context"> {
	/**
	 * Unique identifier for the offer.
	 */
	"@id": string;
}

/**
 * Base interface for three-level inheritance test.
 */
export interface ITripleBaseA {
	/**
	 * A top-level required field.
	 */
	a1: string;

	/**
	 * An optional numeric field.
	 */
	a2?: number;
}

/**
 * Middle interface extending TripleBaseA.
 */
export interface ITripleMidB extends ITripleBaseA {
	/**
	 * Mid-level required field.
	 */
	b1: string;
}

/**
 * Top interface extending TripleMidB.
 */
export interface ITripleTopC extends ITripleMidB {
	/**
	 * Top-level required field.
	 */
	c1: string;
}

/**
 * Interface extending Omit of a triply-inherited type, testing deep comment propagation.
 */
export interface IOmitFromTripleInheritance extends Omit<ITripleTopC, "a2"> {
	/**
	 * Own required field.
	 */
	own: boolean;
}

/**
 * Interface extending Pick from a doubly-inherited type, testing the Pick utility path with inherited comments.
 */
export interface IExtendPickFromInherited extends Pick<IDoubleInheritanceB, "@type" | "profile"> {
	/**
	 * Own required field.
	 */
	own: boolean;
}

/**
 * Interface extending Partial of the doubly-inherited interface, testing that all inherited properties are optional.
 */
export interface IExtendPartialInherited extends Partial<IDoubleInheritanceB> {
	/**
	 * Own required field.
	 */
	own: string;
}

/**
 * Interface extending Required of the doubly-inherited interface, testing that all properties become required including those that were optional in the ancestry chain.
 */
export interface IExtendRequiredInherited extends Required<IDoubleInheritanceB> {
	/**
	 * Own required field.
	 */
	own: string;
}
