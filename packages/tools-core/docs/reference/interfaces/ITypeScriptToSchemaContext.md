# Interface: ITypeScriptToSchemaContext

Context for TypeScript to JSON schema generation.

## Properties

### namespace {#namespace}

> **namespace**: `string`

The namespace for generated schema ids.

***

### packageName {#packagename}

> **packageName**: `string`

The package name for generated schema ids.

***

### schemas {#schemas}

> **schemas**: `object`

The schema cache indexed by package and title.

#### Index Signature

\[`id`: `string`\]: `object`

***

### activeSourceFile? {#activesourcefile}

> `optional` **activeSourceFile**: `SourceFile`

The currently active source file being mapped.

***

### activeEnclosingObjectName? {#activeenclosingobjectname}

> `optional` **activeEnclosingObjectName**: `string`

The currently active enclosing object (interface/type) being mapped.

***

### activeDisallowedType? {#activedisallowedtype}

> `optional` **activeDisallowedType**: `object`

The first disallowed type encountered while mapping the active enclosing object.

#### disallowedTypeName

> **disallowedTypeName**: `string`

#### propertyName

> **propertyName**: `string`

#### enclosingObjectName

> **enclosingObjectName**: `string`

***

### resolvingTypeNames? {#resolvingtypenames}

> `optional` **resolvingTypeNames**: `Set`\<`string`\>

Type names currently being resolved to avoid recursive local-type expansion loops.

***

### typeParameterBindings? {#typeparameterbindings}

> `optional` **typeParameterBindings**: `object`

Generic type parameter bindings active for the current mapping scope.

#### Index Signature

\[`id`: `string`\]: `TypeNode` \| `null`

***

### options? {#options}

> `optional` **options**: [`ITypeScriptToSchemaOptions`](ITypeScriptToSchemaOptions.md)

Optional schema generation options.
