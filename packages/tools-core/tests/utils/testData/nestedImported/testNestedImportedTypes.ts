// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Imported profile type.
 */
export interface IImportedProfile {
	/**
	 * Profile email.
	 */
	email: string;

	/**
	 * Optional imported settings.
	 */
	settings?: IImportedSettings;
}

/**
 * Imported settings type.
 */
export interface IImportedSettings {
	/**
	 * Theme value.
	 */
	theme: string;
}
