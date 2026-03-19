// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IPackageJsonBugs } from "./IPackageJsonBugs.js";
import type { IPackageJsonPerson } from "./IPackageJsonPerson.js";
import type { IPackageJsonPublishConfig } from "./IPackageJsonPublishConfig.js";
import type { IPackageJsonRepository } from "./IPackageJsonRepository.js";
import type { IPackageJsonStringMap } from "./IPackageJsonStringMap.js";

/**
 * Configuration for each individual package.
 * @see https://docs.npmjs.com/creating-a-package-json-file
 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json
 */
export interface IPackageJson {
	/**
	 * The name of the package.
	 * @see https://docs.npmjs.com/creating-a-package-json-file#required-name-and-version-fields
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#name
	 */
	name: string;

	/**
	 * The semantic version for the package.
	 * @see https://docs.npmjs.com/creating-a-package-json-file#required-name-and-version-fields
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#version
	 */
	version?: string;

	/**
	 * The short description for the package.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#description
	 */
	description?: string;

	/**
	 * Search keywords for the package.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#keywords
	 */
	keywords?: string[];

	/**
	 * The package author.
	 * @see https://docs.npmjs.com/creating-a-package-json-file#author-field
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#people-fields-author-contributors
	 */
	author?: IPackageJsonPerson;

	/**
	 * The contributors for the package.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#people-fields-author-contributors
	 */
	contributors?: IPackageJsonPerson[];

	/**
	 * The project homepage.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#homepage
	 */
	homepage?: string;

	/**
	 * The source repository for the package.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#repository
	 */
	repository?: IPackageJsonRepository;

	/**
	 * The issue tracker for the package.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#bugs
	 */
	bugs?: IPackageJsonBugs;

	/**
	 * The SPDX license expression for the package.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#license
	 */
	license?: string;

	/**
	 * Whether the package is private and should not be published.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#private
	 */
	private?: boolean;

	/**
	 * The module system for .js files in the package.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#type
	 */
	type?: "commonjs" | "module";

	/**
	 * The primary package entry point.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#main
	 */
	main?: string;

	/**
	 * The TypeScript declaration entry point.
	 */
	types?: string;

	/**
	 * The executable entry points for the package.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#bin
	 */
	bin?: string | IPackageJsonStringMap;

	/**
	 * The files to include when the package is packed or published.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#files
	 */
	files?: string[];

	/**
	 * The lifecycle scripts for the package.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#scripts
	 */
	scripts?: IPackageJsonStringMap;

	/**
	 * The dependencies for the package.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#dependencies
	 */
	dependencies?: IPackageJsonStringMap;

	/**
	 * The development-only dependencies for the package.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devdependencies
	 */
	devDependencies?: IPackageJsonStringMap;

	/**
	 * The peer dependencies for the package.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#peerdependencies
	 */
	peerDependencies?: IPackageJsonStringMap;

	/**
	 * The optional dependencies for the package.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#optionaldependencies
	 */
	optionalDependencies?: IPackageJsonStringMap;

	/**
	 * Runtime engine constraints for the package.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#engines
	 */
	engines?: IPackageJsonStringMap;

	/**
	 * Publish-time npm configuration.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#publishconfig
	 */
	publishConfig?: IPackageJsonPublishConfig;

	/**
	 * Workspace globs for a monorepo root package.
	 * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#workspaces
	 */
	workspaces?: string[];
}
