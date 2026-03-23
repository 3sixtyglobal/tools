// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type {
	JsonLdObjectWithContext,
	JsonLdObjectWithAtType,
	JsonLdObjectWithAtId,
	JsonLdObjectWithId,
	JsonLdObjectWithNoContext,
	JsonLdObjectWithNoAtType,
	JsonLdObjectWithNoAtId,
	JsonLdObjectWithNoId,
	JsonLdObjectWithOptionalContext,
	JsonLdObjectWithNoType,
	JsonLdObjectWithOptionalAtType,
	JsonLdObjectWithOptionalAtId,
	JsonLdObjectWithOptionalId,
	JsonLdObjectWithOptionalType,
	JsonLdObjectWithType
} from "./jsonLdUtilities.js";
import type { Person } from "../utilityType/testUtilityPerson.js";

/**
 * JSON-LD utility type wrapper using JsonLdObject utilities.
 */
export interface TestJsonLdUtilityType {
	/**
	 * Uses existing id property from Person.
	 */
	withExistingId: JsonLdObjectWithId<Person>;

	/**
	 * Uses at-id from inline object and normalises to id.
	 */
	withAtId: JsonLdObjectWithId<{ "@id": string; value: number }>;

	/**
	 * Uses default string id when source has no id fields.
	 */
	withoutId: JsonLdObjectWithId<{ name: string }>;

	/**
	 * Uses explicit custom id type.
	 */
	withCustomId: JsonLdObjectWithId<Person, number>;

	/**
	 * Uses existing id property and normalises to at-id.
	 */
	withAtIdFromId: JsonLdObjectWithAtId<Person>;

	/**
	 * Uses optional at-id inferred from existing id.
	 */
	withOptionalAtId: JsonLdObjectWithOptionalAtId<Person>;

	/**
	 * Removes at-id while keeping other fields.
	 */
	withNoAtId: JsonLdObjectWithNoAtId<{ "@id": string; label: string }>;

	/**
	 * Uses optional id inferred from existing id.
	 */
	withOptionalId: JsonLdObjectWithOptionalId<Person>;

	/**
	 * Uses optional id default when no id fields exist.
	 */
	withOptionalIdNoSource: JsonLdObjectWithOptionalId<{ name: string }>;

	/**
	 * Removes id while keeping other fields.
	 */
	withNoId: JsonLdObjectWithNoId<Person>;

	/**
	 * Uses existing type property from inline object.
	 */
	withExistingType: JsonLdObjectWithType<{ type: "Person"; value: number }>;

	/**
	 * Uses at-type from inline object and normalises to type.
	 */
	withAtType: JsonLdObjectWithType<{ "@type": "Event"; value: number }>;

	/**
	 * Uses default type when source has no type fields.
	 */
	withoutType: JsonLdObjectWithType<{ name: string }>;

	/**
	 * Uses explicit custom type.
	 */
	withCustomType: JsonLdObjectWithType<{ name: string }, "CustomType">;

	/**
	 * Uses existing type property and normalises to at-type.
	 */
	withAtTypeFromType: JsonLdObjectWithAtType<{ type: "Thing"; label: string }>;

	/**
	 * Uses optional at-type inferred from existing type.
	 */
	withOptionalAtType: JsonLdObjectWithOptionalAtType<{ type: string; label: string }>;

	/**
	 * Removes at-type while keeping other fields.
	 */
	withNoAtType: JsonLdObjectWithNoAtType<{ "@type": string; label: string }>;

	/**
	 * Uses optional type inferred from existing type.
	 */
	withOptionalType: JsonLdObjectWithOptionalType<{ type: string; label: string }>;

	/**
	 * Uses optional type default when no type fields exist.
	 */
	withOptionalTypeNoSource: JsonLdObjectWithOptionalType<{ name: string }>;

	/**
	 * Removes type while keeping other fields.
	 */
	withNoType: JsonLdObjectWithNoType<{ type: string; label: string }>;

	/**
	 * Uses existing context from inline object.
	 */
	withExistingContext: JsonLdObjectWithContext<{ "@context": string[]; value: number }>;

	/**
	 * Uses default context when source has no context field.
	 */
	withoutContext: JsonLdObjectWithContext<{ name: string }>;

	/**
	 * Uses explicit custom context type.
	 */
	withCustomContext: JsonLdObjectWithContext<{ name: string }, { schema: string }>;

	/**
	 * Uses optional context inferred from existing context.
	 */
	withOptionalContext: JsonLdObjectWithOptionalContext<{ "@context": string[]; label: string }>;

	/**
	 * Uses optional context default when no context field exists.
	 */
	withOptionalContextNoSource: JsonLdObjectWithOptionalContext<{ name: string }>;

	/**
	 * Removes context while keeping other fields.
	 */
	withNoContext: JsonLdObjectWithNoContext<{ "@context": string[]; label: string }>;
}
