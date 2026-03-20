# Class: Resolver

Resolve TypeScript type declarations from package names.

## Constructors

### Constructor

> **new Resolver**(): `Resolver`

#### Returns

`Resolver`

## Methods

### resolveTypeDeclarationAst() {#resolvetypedeclarationast}

> `static` **resolveTypeDeclarationAst**(`packageName`, `typeName`, `containingFilePath?`): \{ `sourceFile`: `SourceFile`; `declaration`: `InterfaceDeclaration` \| `TypeAliasDeclaration`; \} \| `undefined`

Resolve a type declaration AST from a package and type name.

#### Parameters

##### packageName

`string`

The package to inspect.

##### typeName

`string`

The type to resolve.

##### containingFilePath?

`string`

An optional source file path to use as the starting point for
package resolution. When provided, TypeScript module resolution walks up from that file's
directory, which allows transitive dependencies installed alongside the source file (e.g.
in a sub-directory node_modules) to be found even when they are not reachable from the
current working directory. The path is normalised to absolute before use;
falls back to process.cwd() when omitted.

#### Returns

\{ `sourceFile`: `SourceFile`; `declaration`: `InterfaceDeclaration` \| `TypeAliasDeclaration`; \} \| `undefined`

The resolved declaration AST.
