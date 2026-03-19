# Interface: IPackageJson

Configuration for each individual package.

## See

 - https://docs.npmjs.com/creating-a-package-json-file
 - https://docs.npmjs.com/cli/v11/configuring-npm/package-json

## Properties

### name {#name}

> **name**: `string`

The name of the package.

#### See

 - https://docs.npmjs.com/creating-a-package-json-file#required-name-and-version-fields
 - https://docs.npmjs.com/cli/v11/configuring-npm/package-json#name

***

### version? {#version}

> `optional` **version**: `string`

The semantic version for the package.

#### See

 - https://docs.npmjs.com/creating-a-package-json-file#required-name-and-version-fields
 - https://docs.npmjs.com/cli/v11/configuring-npm/package-json#version

***

### description? {#description}

> `optional` **description**: `string`

The short description for the package.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#description

***

### keywords? {#keywords}

> `optional` **keywords**: `string`[]

Search keywords for the package.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#keywords

***

### author? {#author}

> `optional` **author**: [`IPackageJsonPerson`](../type-aliases/IPackageJsonPerson.md)

The package author.

#### See

 - https://docs.npmjs.com/creating-a-package-json-file#author-field
 - https://docs.npmjs.com/cli/v11/configuring-npm/package-json#people-fields-author-contributors

***

### contributors? {#contributors}

> `optional` **contributors**: [`IPackageJsonPerson`](../type-aliases/IPackageJsonPerson.md)[]

The contributors for the package.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#people-fields-author-contributors

***

### homepage? {#homepage}

> `optional` **homepage**: `string`

The project homepage.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#homepage

***

### repository? {#repository}

> `optional` **repository**: [`IPackageJsonRepository`](../type-aliases/IPackageJsonRepository.md)

The source repository for the package.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#repository

***

### bugs? {#bugs}

> `optional` **bugs**: [`IPackageJsonBugs`](../type-aliases/IPackageJsonBugs.md)

The issue tracker for the package.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#bugs

***

### license? {#license}

> `optional` **license**: `string`

The SPDX license expression for the package.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#license

***

### private? {#private}

> `optional` **private**: `boolean`

Whether the package is private and should not be published.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#private

***

### type? {#type}

> `optional` **type**: `"commonjs"` \| `"module"`

The module system for .js files in the package.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#type

***

### main? {#main}

> `optional` **main**: `string`

The primary package entry point.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#main

***

### types? {#types}

> `optional` **types**: `string`

The TypeScript declaration entry point.

***

### bin? {#bin}

> `optional` **bin**: `string` \| [`IPackageJsonStringMap`](IPackageJsonStringMap.md)

The executable entry points for the package.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#bin

***

### files? {#files}

> `optional` **files**: `string`[]

The files to include when the package is packed or published.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#files

***

### scripts? {#scripts}

> `optional` **scripts**: [`IPackageJsonStringMap`](IPackageJsonStringMap.md)

The lifecycle scripts for the package.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#scripts

***

### dependencies? {#dependencies}

> `optional` **dependencies**: [`IPackageJsonStringMap`](IPackageJsonStringMap.md)

The dependencies for the package.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#dependencies

***

### devDependencies? {#devdependencies}

> `optional` **devDependencies**: [`IPackageJsonStringMap`](IPackageJsonStringMap.md)

The development-only dependencies for the package.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devdependencies

***

### peerDependencies? {#peerdependencies}

> `optional` **peerDependencies**: [`IPackageJsonStringMap`](IPackageJsonStringMap.md)

The peer dependencies for the package.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#peerdependencies

***

### optionalDependencies? {#optionaldependencies}

> `optional` **optionalDependencies**: [`IPackageJsonStringMap`](IPackageJsonStringMap.md)

The optional dependencies for the package.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#optionaldependencies

***

### engines? {#engines}

> `optional` **engines**: [`IPackageJsonStringMap`](IPackageJsonStringMap.md)

Runtime engine constraints for the package.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#engines

***

### publishConfig? {#publishconfig}

> `optional` **publishConfig**: [`IPackageJsonPublishConfig`](IPackageJsonPublishConfig.md)

Publish-time npm configuration.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#publishconfig

***

### workspaces? {#workspaces}

> `optional` **workspaces**: `string`[]

Workspace globs for a monorepo root package.

#### See

https://docs.npmjs.com/cli/v11/configuring-npm/package-json#workspaces
