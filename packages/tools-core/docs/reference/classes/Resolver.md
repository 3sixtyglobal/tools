# Class: Resolver

Resolve TypeScript type declarations from package names.

## Constructors

### Constructor

> **new Resolver**(): `Resolver`

#### Returns

`Resolver`

## Methods

### resolveTypeDeclarationAst() {#resolvetypedeclarationast}

> `static` **resolveTypeDeclarationAst**(`packageName`, `typeName`): \{ `sourceFile`: `SourceFile`; `declaration`: `InterfaceDeclaration` \| `TypeAliasDeclaration`; \} \| `undefined`

Resolve a type declaration AST from a package and type name.

#### Parameters

##### packageName

`string`

The package to inspect.

##### typeName

`string`

The type to resolve.

#### Returns

\{ `sourceFile`: `SourceFile`; `declaration`: `InterfaceDeclaration` \| `TypeAliasDeclaration`; \} \| `undefined`

The resolved declaration AST.
