// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * User id template literal.
 */
export type UserId = `user-${string}`;

/**
 * Event key template literal.
 */
export type EventKey = `event-${"created" | "deleted"}`;

/**
 * Test template literal type handling.
 */
export interface TestTemplateLiteralType {
	/**
	 * Generic user id pattern.
	 */
	userId: UserId;

	/**
	 * Finite event key pattern.
	 */
	eventKey: EventKey;
}
