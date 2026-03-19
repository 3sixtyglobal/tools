# Class: JsonSchemaBuilder

Builder for composing JSON schema fragments from TypeScript AST nodes.

## Constructors

### Constructor

> **new JsonSchemaBuilder**(): `JsonSchemaBuilder`

#### Returns

`JsonSchemaBuilder`

## Properties

### SCHEMA\_VERSION {#schema_version}

> `readonly` `static` **SCHEMA\_VERSION**: `"https://json-schema.org/draft/2020-12/schema"` = `"https://json-schema.org/draft/2020-12/schema"`

The JSON Schema version used.

***

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

Runtime name for the class.

## Methods

### parseAllObjectSchemas() {#parseallobjectschemas}

> `static` **parseAllObjectSchemas**(`context`, `sourceFilePath`, `source`, `visitedFiles`): `string`[]

Parse all object declarations from a source file.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### sourceFilePath

`string`

The source file path.

##### source

`string`

The TypeScript source.

##### visitedFiles

`string`[]

The list of visited source files.

#### Returns

`string`[]

The generated schema titles.

***

### applyJsonSchemaTags() {#applyjsonschematags}

> `static` **applyJsonSchemaTags**(`schema`, `node`): `void`

Apply

#### Parameters

##### schema

`Partial`\<`IJsonSchema`\>

The schema to expand.

##### node

`Node`

The node to inspect for tags.

#### Returns

`void`

#### Throws

GeneralError Thrown when a tag key is not supported by IJsonSchema.

***

### isAllowedJsonSchemaTagKey() {#isallowedjsonschematagkey}

> `static` **isAllowedJsonSchemaTagKey**(`key`): `boolean`

Determine whether a mapped

#### Parameters

##### key

`string`

The mapped schema key.

#### Returns

`boolean`

True if the key is supported.

***

### buildBaseSchema() {#buildbaseschema}

> `static` **buildBaseSchema**(`namespace`, `title`, `statement`): `Partial`\<`IJsonSchema`\>

Build the base schema with common properties.

#### Parameters

##### namespace

`string`

The namespace for generated schema id.

##### title

`string`

The schema title.

##### statement

`Node`

The type statement node.

#### Returns

`Partial`\<`IJsonSchema`\>

The base schema to be expanded.

***

### buildEnumSchema() {#buildenumschema}

> `static` **buildEnumSchema**(`schema`, `entries`): `void`

Add enum information to a schema.

#### Parameters

##### schema

`Partial`\<`IJsonSchema`\>

The schema to expand.

##### entries

`object`[]

The enum entries.

#### Returns

`void`

***

### buildObjectSchema() {#buildobjectschema}

> `static` **buildObjectSchema**(`context`, `schema`, `members`): `void`

Build an object schema from interface or type literal members.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### schema

`Partial`\<`IJsonSchema`\>

The schema to expand.

##### members

`NodeArray`\<`TypeElement`\>

The members to process.

#### Returns

`void`

***

### buildObjectMembersSchema() {#buildobjectmembersschema}

> `static` **buildObjectMembersSchema**(`context`, `members`): `object`

Build property schemas and required list from type members.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### members

`NodeArray`\<`TypeElement`\>

The members to process.

#### Returns

`object`

The object property schema map and required list.

##### properties

> **properties**: `object`

###### Index Signature

\[`key`: `string`\]: `IJsonSchema`

##### required

> **required**: `string`[]

##### patternProperties?

> `optional` **patternProperties?**: `object`

###### Index Signature

\[`pattern`: `string`\]: `IJsonSchema`

##### additionalProperties?

> `optional` **additionalProperties?**: `IJsonSchema`

##### propertyNames?

> `optional` **propertyNames?**: `IJsonSchema`

***

### buildTypeLiteralSchema() {#buildtypeliteralschema}

> `static` **buildTypeLiteralSchema**(`context`, `typeNode`): `IJsonSchema`

Build an object schema from a type literal node.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeLiteralNode`

The type literal node.

#### Returns

`IJsonSchema`

The object schema.

***

### mergePatternPropertySchemas() {#mergepatternpropertyschemas}

> `static` **mergePatternPropertySchemas**(`patternPropertySchemas`): \{\[`pattern`: `string`\]: `IJsonSchema`; \} \| `undefined`

Merge pattern property schemas by pattern, deduplicating equivalent branches.

#### Parameters

##### patternPropertySchemas

`object`[]

Pattern and schema entries to merge.

#### Returns

\{\[`pattern`: `string`\]: `IJsonSchema`; \} \| `undefined`

Merged patternProperties map.

***

### mapMemberTypeToSchema() {#mapmembertypetoschema}

> `static` **mapMemberTypeToSchema**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map a property type node to schema.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeNode`

The member type node.

#### Returns

`IJsonSchema` \| `undefined`

The mapped member schema.

***

### mapTypeNodeToSchema() {#maptypenodetoschema}

> `static` **mapTypeNodeToSchema**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map TypeScript type nodes to JSON schema.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeNode`

The node to process.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### isDisjointPrimitiveKeywordUnion() {#isdisjointprimitivekeywordunion}

> `static` **isDisjointPrimitiveKeywordUnion**(`unionTypeNode`, `unionTypeNodes`, `unionSchemas`): `boolean`

Determine whether a union of primitive keyword branches is pairwise disjoint.

#### Parameters

##### unionTypeNode

`UnionTypeNode`

The union node being mapped.

##### unionTypeNodes

`NodeArray`\<`TypeNode`\>

The original union branch type nodes.

##### unionSchemas

`IJsonSchema`[]

The mapped union branch schemas.

#### Returns

`boolean`

True if every branch is a primitive keyword schema and no branches overlap.

***

### isNeverDiscriminatedObjectUnion() {#isneverdiscriminatedobjectunion}

> `static` **isNeverDiscriminatedObjectUnion**(`context`, `unionTypeNodes`, `unionSchemas`): `boolean`

Determine whether a union of schemas represents mutually exclusive object branches.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### unionTypeNodes

`NodeArray`\<`TypeNode`\>

The union branch type nodes for cross-checking with the mapped schemas.

##### unionSchemas

`IJsonSchema`[]

The mapped union branch schemas.

#### Returns

`boolean`

True if each branch is an object schema with a unique required key set.

***

### isLiteralTagDiscriminatedObjectUnion() {#isliteraltagdiscriminatedobjectunion}

> `static` **isLiteralTagDiscriminatedObjectUnion**(`context`, `unionSchemas`): `boolean`

Determine whether object union branches are discriminated by a shared required literal tag.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### unionSchemas

`IJsonSchema`[]

The mapped union branch schemas.

#### Returns

`boolean`

True if the union can be safely represented as oneOf.

***

### resolveNeverDiscriminatorMembers() {#resolveneverdiscriminatormembers}

> `static` **resolveNeverDiscriminatorMembers**(`context`, `unionTypeNode`): `NodeArray`\<`TypeElement`\> \| `undefined`

Resolve branch members that can encode never-based discriminators.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### unionTypeNode

`TypeNode`

The union branch type node.

#### Returns

`NodeArray`\<`TypeElement`\> \| `undefined`

Type members for the branch when resolvable.

***

### resolveLocalSchemaReference() {#resolvelocalschemareference}

> `static` **resolveLocalSchemaReference**(`context`, `schema`): `IJsonSchema` \| `undefined`

Resolve a local $ref schema to its stored schema definition.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### schema

`IJsonSchema`

The schema that may contain a local reference.

#### Returns

`IJsonSchema` \| `undefined`

The resolved schema when available.

***

### resolveConstObjectProperty() {#resolveconstobjectproperty}

> `static` **resolveConstObjectProperty**(`context`, `objectName`, `propertyName`): `string` \| `number` \| `undefined`

Resolve a property value from a const object declaration in an imported source file.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### objectName

`string`

The name of the const object.

##### propertyName

`string`

The name of the property to resolve.

#### Returns

`string` \| `number` \| `undefined`

The resolved string or number value, or undefined if unresolvable.

***

### findVariableDeclarationInModuleGraph() {#findvariabledeclarationinmodulegraph}

> `static` **findVariableDeclarationInModuleGraph**(`sourceFilePath`, `variableName`, `visitedFiles`): `VariableDeclaration` \| `undefined`

Find a variable declaration by traversing import and export chains.

#### Parameters

##### sourceFilePath

`string`

The source file path to start from.

##### variableName

`string`

The variable declaration name to find.

##### visitedFiles

`Set`\<`string`\>

The file set already visited.

#### Returns

`VariableDeclaration` \| `undefined`

The variable declaration when found.

***

### findImportedValueReference() {#findimportedvaluereference}

> `static` **findImportedValueReference**(`sourceFile`, `localName`): \{ `moduleSpecifier`: `string`; `importedName`: `string`; \} \| `undefined`

Find an imported symbol reference by local identifier name.

#### Parameters

##### sourceFile

`SourceFile`

The source file to inspect.

##### localName

`string`

The local identifier name.

#### Returns

\{ `moduleSpecifier`: `string`; `importedName`: `string`; \} \| `undefined`

The module specifier and imported symbol name.

***

### resolveImportDeclarationSourceFile() {#resolveimportdeclarationsourcefile}

> `static` **resolveImportDeclarationSourceFile**(`containingSourceFilePath`, `moduleSpecifier`): `string` \| `undefined`

Resolve an import declaration module specifier to a source file.

#### Parameters

##### containingSourceFilePath

`string`

The containing source file path.

##### moduleSpecifier

`string`

The module specifier text.

#### Returns

`string` \| `undefined`

The resolved source file path.

***

### extractConstObjectPropertyFromDeclarationInitializer() {#extractconstobjectpropertyfromdeclarationinitializer}

> `static` **extractConstObjectPropertyFromDeclarationInitializer**(`objectDeclaration`, `propertyName`): `string` \| `number` \| `undefined`

Extract a const-object property value from a declaration initializer.

#### Parameters

##### objectDeclaration

`VariableDeclaration`

The variable declaration.

##### propertyName

`string`

The property to resolve.

#### Returns

`string` \| `number` \| `undefined`

The resolved value.

***

### extractConstObjectPropertyFromDeclarationType() {#extractconstobjectpropertyfromdeclarationtype}

> `static` **extractConstObjectPropertyFromDeclarationType**(`declarationTypeNode`, `propertyName`): `string` \| `number` \| `undefined`

Extract a const-object property value from a declaration type annotation.

#### Parameters

##### declarationTypeNode

`TypeNode`

The declaration type annotation.

##### propertyName

`string`

The property to resolve.

#### Returns

`string` \| `number` \| `undefined`

The resolved value.

***

### extractLiteralValueFromTypeNode() {#extractliteralvaluefromtypenode}

> `static` **extractLiteralValueFromTypeNode**(`typeNode`): `string` \| `number` \| `undefined`

Extract a literal value from a type node when possible.

#### Parameters

##### typeNode

`TypeNode`

The type node.

#### Returns

`string` \| `number` \| `undefined`

The literal value.

***

### extractImportTypeName() {#extractimporttypename}

> `static` **extractImportTypeName**(`qualifier`): `string` \| `undefined`

Extract a referenced type name from an import type qualifier.

#### Parameters

##### qualifier

`EntityName` \| `undefined`

The import type qualifier.

#### Returns

`string` \| `undefined`

The resolved type name.

***

### resolveImportTypeReferenceSchemaId() {#resolveimporttypereferenceschemaid}

> `static` **resolveImportTypeReferenceSchemaId**(`context`, `moduleSpecifier`, `typeName`, `title`): `string` \| `undefined`

Resolve import-type references to local or external schema ids.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### moduleSpecifier

`string`

The import module specifier.

##### typeName

`string`

The imported type name.

##### title

`string`

The derived schema title.

#### Returns

`string` \| `undefined`

The resolved schema id.

***

### inferSchemaFromExpression() {#inferschemafromexpression}

> `static` **inferSchemaFromExpression**(`context`, `expr`, `asConst?`): `IJsonSchema`

Infer a primitive JSON schema from a literal expression.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### expr

`Expression`

The expression to inspect.

##### asConst?

`boolean` = `false`

Whether to produce exact const schemas matching an as-const assertion.

#### Returns

`IJsonSchema`

The inferred schema.

***

### inferObjectLiteralSchema() {#inferobjectliteralschema}

> `static` **inferObjectLiteralSchema**(`context`, `expr`, `asConst`): `IJsonSchema`

Infer an object schema from an object literal expression, using const or widened types.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### expr

`ObjectLiteralExpression`

The object literal expression.

##### asConst

`boolean`

Whether property value schemas should be exact const types.

#### Returns

`IJsonSchema`

The inferred object schema.

***

### inferArrayLiteralSchema() {#inferarrayliteralschema}

> `static` **inferArrayLiteralSchema**(`context`, `expr`, `asConst`): `IJsonSchema`

Infer an array schema from an array literal expression.
For as-const arrays a fixed-length tuple schema is produced; otherwise a plain array schema.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### expr

`ArrayLiteralExpression`

The array literal expression.

##### asConst

`boolean`

Whether to produce a const-exact tuple schema.

#### Returns

`IJsonSchema`

The inferred array schema.

***

### mapConditionalTypeToSchema() {#mapconditionaltypetoschema}

> `static` **mapConditionalTypeToSchema**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map conditional type nodes (e.g. T extends U ? X : Y) to schema.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`ConditionalTypeNode`

The conditional type node.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapIndexedAccessTypeToSchema() {#mapindexedaccesstypetoschema}

> `static` **mapIndexedAccessTypeToSchema**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map indexed access type nodes (e.g. T["id"]) to schema.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`IndexedAccessTypeNode`

The indexed access type node.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapTemplateLiteralTypeToSchema() {#maptemplateliteraltypetoschema}

> `static` **mapTemplateLiteralTypeToSchema**(`context`, `typeNode`): `IJsonSchema`

Map template literal type nodes to string schemas.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TemplateLiteralTypeNode`

The template literal type node.

#### Returns

`IJsonSchema`

The mapped schema.

***

### mapMappedTypeToSchema() {#mapmappedtypetoschema}

> `static` **mapMappedTypeToSchema**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map mapped type nodes to object schemas.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`MappedTypeNode`

The mapped type node.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### isMappedTypeIndexedValueByTypeParameter() {#ismappedtypeindexedvaluebytypeparameter}

> `static` **isMappedTypeIndexedValueByTypeParameter**(`typeNode`, `mappedTypeParameterName`): `boolean`

Determine whether a mapped type value uses indexed access with the mapped key parameter.

#### Parameters

##### typeNode

`MappedTypeNode`

The mapped type node.

##### mappedTypeParameterName

`string`

The mapped type parameter name.

#### Returns

`boolean`

True if the value shape is based on source indexed access.

***

### checkTypeNodeAllowed() {#checktypenodeallowed}

> `static` **checkTypeNodeAllowed**(`context`, `typeNode`, `propertyName?`, `enclosingObjectName?`): `boolean`

Check whether a type node is allowed for schema generation.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeNode`

The type node to inspect.

##### propertyName?

`string`

The optional property name when the type is a property type.

##### enclosingObjectName?

`string`

The optional enclosing object name when the type is a property type.

#### Returns

`boolean`

True when the type is allowed.

***

### isFunctionPropertyType() {#isfunctionpropertytype}

> `static` **isFunctionPropertyType**(`typeNode`): `boolean`

Determine whether a property type should be treated as a function and skipped.

#### Parameters

##### typeNode

`TypeNode`

The property type node.

#### Returns

`boolean`

True if the property type is function-like.

***

### isSymbolTypeNode() {#issymboltypenode}

> `static` **isSymbolTypeNode**(`typeNode`): `boolean`

Determine whether a type node represents symbol or unique symbol.

#### Parameters

##### typeNode

`TypeNode`

The type node to inspect.

#### Returns

`boolean`

True when the type is symbol or unique symbol.

***

### isSymbolKeyedComputedExpression() {#issymbolkeyedcomputedexpression}

> `static` **isSymbolKeyedComputedExpression**(`context`, `expression`): `boolean`

Determine whether a computed property expression references a symbol.
Covers well-known symbols (Symbol.iterator, etc.) and const variables
declared with a unique symbol type annotation.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### expression

`Expression`

The computed property expression.

#### Returns

`boolean`

True when the key is symbol-based.

***

### extractPropertyName() {#extractpropertyname}

> `static` **extractPropertyName**(`context`, `propertyName`): `string` \| `undefined`

Extract a property name from TypeScript property syntax.
Computed names are resolved when they evaluate to concrete literals.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### propertyName

`PropertyName`

The property name node.

#### Returns

`string` \| `undefined`

The normalized property name.

***

### findVariableDeclaration() {#findvariabledeclaration}

> `static` **findVariableDeclaration**(`sourceFile`, `variableName`): `VariableDeclaration` \| `undefined`

Find a variable declaration by name in a source file.

#### Parameters

##### sourceFile

`SourceFile` \| `undefined`

The source file to search.

##### variableName

`string`

The variable name.

#### Returns

`VariableDeclaration` \| `undefined`

The declaration if found.

***

### resolveImportedTypeQuerySchema() {#resolveimportedtypequeryschema}

> `static` **resolveImportedTypeQuerySchema**(`context`, `localName`): `IJsonSchema` \| `undefined`

Resolve a schema for an imported identifier used in a type query.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### localName

`string`

The local imported symbol name.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema if resolvable.

***

### resolveComputedPropertyNameExpression() {#resolvecomputedpropertynameexpression}

> `static` **resolveComputedPropertyNameExpression**(`context`, `expression`, `resolvingIdentifiers`): `string` \| `undefined`

Resolve computed property name expressions when they can be evaluated to concrete keys.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### expression

`Expression`

The computed property expression.

##### resolvingIdentifiers

`Set`\<`string`\>

Identifier names currently being resolved.

#### Returns

`string` \| `undefined`

The resolved property key.

***

### findConstVariableDeclaration() {#findconstvariabledeclaration}

> `static` **findConstVariableDeclaration**(`context`, `variableName`): `VariableDeclaration` \| `undefined`

Find a local const variable declaration in the active source file.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### variableName

`string`

The variable name.

#### Returns

`VariableDeclaration` \| `undefined`

The declaration when found.

***

### resolveLocalConstObjectProperty() {#resolvelocalconstobjectproperty}

> `static` **resolveLocalConstObjectProperty**(`context`, `objectName`, `propertyName`): `string` \| `number` \| `undefined`

Resolve a property value from a local const object declaration.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### objectName

`string`

The const object name.

##### propertyName

`string`

The property to resolve.

#### Returns

`string` \| `number` \| `undefined`

The resolved value when available.

***

### mapTupleTypeToSchema() {#maptupletypetoschema}

> `static` **mapTupleTypeToSchema**(`context`, `tupleTypeNode`): `IJsonSchema` \| `undefined`

Map a tuple type node to schema.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### tupleTypeNode

`TupleTypeNode`

The tuple type node.

#### Returns

`IJsonSchema` \| `undefined`

The mapped tuple schema.

***

### extractRestElementSchema() {#extractrestelementschema}

> `static` **extractRestElementSchema**(`context`, `restElementType`): `IJsonSchema` \| `undefined`

Extract schema for a tuple rest element.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### restElementType

`TypeNode`

The rest element type.

#### Returns

`IJsonSchema` \| `undefined`

The mapped rest element schema.

***

### findExistingSchemaIdByTitle() {#findexistingschemaidbytitle}

> `static` **findExistingSchemaIdByTitle**(`context`, `schemaTitle`): `string` \| `undefined`

Find an existing schema id by title in known package schemas.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### schemaTitle

`string`

The schema title to find.

#### Returns

`string` \| `undefined`

The existing schema id if found.

***

### applyInterfaceExtendsSchema() {#applyinterfaceextendsschema}

> `static` **applyInterfaceExtendsSchema**(`context`, `schema`, `declaration`): `void`

Apply interface inheritance (`extends`) as `allOf` references.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### schema

`Partial`\<`IJsonSchema`\>

The schema to expand.

##### declaration

`InterfaceDeclaration`

The interface declaration.

#### Returns

`void`

***

### mapPartialUtilityType() {#mappartialutilitytype}

> `static` **mapPartialUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map Partial<T> to an object schema with no required properties.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The Partial type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapRequiredUtilityType() {#maprequiredutilitytype}

> `static` **mapRequiredUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map Required<T> to an object schema with all properties required.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The Required type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapPickUtilityType() {#mappickutilitytype}

> `static` **mapPickUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map Pick<T, K> to an object schema with selected keys preserved.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The Pick type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapOmitUtilityType() {#mapomitutilitytype}

> `static` **mapOmitUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map Omit<T, K> to an object schema with selected keys removed.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The Omit type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapExcludeUtilityType() {#mapexcludeutilitytype}

> `static` **mapExcludeUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map Exclude<T, U> to a schema that removes U members from T.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The Exclude type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapExtractUtilityType() {#mapextractutilitytype}

> `static` **mapExtractUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map Extract<T, U> to a schema that keeps U members from T.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The Extract type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapNonNullableUtilityType() {#mapnonnullableutilitytype}

> `static` **mapNonNullableUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map NonNullable<T> by removing null and undefined branches from T.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The NonNullable type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapRecordUtilityType() {#maprecordutilitytype}

> `static` **mapRecordUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map Record<K, V> to an object schema with key constraints where possible.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The Record type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### isNullOrUndefinedTypeNode() {#isnullorundefinedtypenode}

> `static` **isNullOrUndefinedTypeNode**(`typeNode`): `boolean`

Determine whether a type node represents null or undefined.

#### Parameters

##### typeNode

`TypeNode`

The type node.

#### Returns

`boolean`

True if the node is null or undefined.

***

### extractRecordLiteralKeys() {#extractrecordliteralkeys}

> `static` **extractRecordLiteralKeys**(`keyTypeNode`): `string`[]

Extract literal keys from a Record key type argument.

#### Parameters

##### keyTypeNode

`TypeNode`

The key type argument node.

#### Returns

`string`[]

The extracted literal keys.

***

### mapJsonLdObjectUtilityType() {#mapjsonldobjectutilitytype}

> `static` **mapJsonLdObjectUtilityType**(`context`, `typeNode`, `options`): `IJsonSchema` \| `undefined`

Map JsonLdObject utility types using key-removal and optional key-addition rules.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The JsonLdObject utility type reference.

##### options

Mapping options.

###### keysToRemove

`string`[]

Keys to remove from the base schema.

###### keyToAdd?

`"type"` \| `"id"` \| `"@id"` \| `"@type"` \| `"@context"`

Optional key to add to the base schema.

###### isAddedKeyRequired?

`boolean`

Whether the added key should be required.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapJsonLdObjectDefaultSchemaByKey() {#mapjsonldobjectdefaultschemabykey}

> `static` **mapJsonLdObjectDefaultSchemaByKey**(`baseSchema`, `keyToAdd`): `IJsonSchema`

Resolve a default schema for JsonLdObject utility key additions when the type argument is omitted.

#### Parameters

##### baseSchema

`IJsonSchema`

The base object schema.

##### keyToAdd

`"type"` \| `"id"` \| `"@id"` \| `"@type"` \| `"@context"`

The key being added by the utility.

#### Returns

`IJsonSchema`

The resolved schema.

***

### mapJsonLdObjectWithIdDefaultIdSchema() {#mapjsonldobjectwithiddefaultidschema}

> `static` **mapJsonLdObjectWithIdDefaultIdSchema**(`baseSchema`): `IJsonSchema`

Resolve default id schema for JsonLdObjectWithId when Id type argument is omitted.

#### Parameters

##### baseSchema

`IJsonSchema`

The base object schema.

#### Returns

`IJsonSchema`

The resolved id schema.

***

### mapJsonLdObjectWithTypeDefaultTypeSchema() {#mapjsonldobjectwithtypedefaulttypeschema}

> `static` **mapJsonLdObjectWithTypeDefaultTypeSchema**(`baseSchema`): `IJsonSchema`

Resolve default type schema for JsonLdObjectWithType when Type argument is omitted.

#### Parameters

##### baseSchema

`IJsonSchema`

The base object schema.

#### Returns

`IJsonSchema`

The resolved type schema.

***

### mapJsonLdObjectWithContextDefaultContextSchema() {#mapjsonldobjectwithcontextdefaultcontextschema}

> `static` **mapJsonLdObjectWithContextDefaultContextSchema**(`baseSchema`): `IJsonSchema`

Resolve default context schema for JsonLdObjectWithContext when Context argument is omitted.

#### Parameters

##### baseSchema

`IJsonSchema`

The base object schema.

#### Returns

`IJsonSchema`

The resolved context schema.

***

### mapJsonLdObjectDefaultEitherSchema() {#mapjsonldobjectdefaulteitherschema}

> `static` **mapJsonLdObjectDefaultEitherSchema**(`baseSchema`, `firstKey`, `secondKey`, `fallbackSchema`): `IJsonSchema`

Resolve default schema from either of two source keys, with fallback when both are absent.

#### Parameters

##### baseSchema

`IJsonSchema`

The base object schema.

##### firstKey

`string`

The primary key to resolve.

##### secondKey

`string`

The secondary key to resolve.

##### fallbackSchema

`IJsonSchema`

The fallback schema.

#### Returns

`IJsonSchema`

The resolved schema.

***

### mapObjectOrArrayUtilityType() {#mapobjectorarrayutilitytype}

> `static` **mapObjectOrArrayUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map ObjectOrArray<T> to a schema accepting T or T[].

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The ObjectOrArray type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### mapSingleOccurrenceArrayUtilityType() {#mapsingleoccurrencearrayutilitytype}

> `static` **mapSingleOccurrenceArrayUtilityType**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Map SingleOccurrenceArray<T, U> to a non-empty array containing exactly one U.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The SingleOccurrenceArray type reference.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### annotateUtilityInlineSchema() {#annotateutilityinlineschema}

> `static` **annotateUtilityInlineSchema**(`schema`, `baseTypeDescription`): `IJsonSchema`

Add a comment to schemas inlined for utility type transformations.

#### Parameters

##### schema

`IJsonSchema`

The schema to annotate.

##### baseTypeDescription

`string`

The utility base type description.

#### Returns

`IJsonSchema`

The annotated schema.

***

### resolveUtilityBaseObjectSchema() {#resolveutilitybaseobjectschema}

> `static` **resolveUtilityBaseObjectSchema**(`context`, `baseTypeNode`): `IJsonSchema` \| `undefined`

Resolve a utility base type node to an object schema.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### baseTypeNode

`TypeNode`

The utility base type node.

#### Returns

`IJsonSchema` \| `undefined`

The resolved object schema.

#### Throws

GeneralError when a named type reference cannot be resolved to a schema.

***

### resolveMappedUtilityBaseObjectSchema() {#resolvemappedutilitybaseobjectschema}

> `static` **resolveMappedUtilityBaseObjectSchema**(`context`, `mappedSchema`): `IJsonSchema` \| `undefined`

Resolve a mapped utility schema to an object schema when possible.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### mappedSchema

`IJsonSchema`

The mapped schema.

#### Returns

`IJsonSchema` \| `undefined`

The resolved object schema.

***

### expandAllOfReferences() {#expandallofreferences}

> `static` **expandAllOfReferences**(`context`, `schema`, `currentSchemaTitle?`): `IJsonSchema`

Expand allOf references in a schema by inlining referenced schemas.
This handles inheritance cases where a type extends another type.
When applying utility operations (Omit, Pick) to types with allOf inheritance,
the referenced schemas must be expanded so properties are available for omit/pick.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### schema

`IJsonSchema`

The schema potentially containing allOf with references.

##### currentSchemaTitle?

`string`

The title of the current schema being processed, used for $comment annotations.

#### Returns

`IJsonSchema`

The schema with expanded references merged into properties.

***

### tryLoadExternalSchemaByTitle() {#tryloadexternalschemabytitle}

> `static` **tryLoadExternalSchemaByTitle**(`context`, `schemaTitle`): `IJsonSchema` \| `undefined`

Attempt to load an external schema by title from imported module declarations.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### schemaTitle

`string`

The schema title.

#### Returns

`IJsonSchema` \| `undefined`

The loaded schema.

***

### resolveObjectTypeSchemaForUtility() {#resolveobjecttypeschemaforutility}

> `static` **resolveObjectTypeSchemaForUtility**(`context`, `typeName`): `IJsonSchema` \| `undefined`

Resolve an object schema for utility type application.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeName

`string`

The referenced type name.

#### Returns

`IJsonSchema` \| `undefined`

The resolved object schema.

***

### findImportedTypeReference() {#findimportedtypereference}

> `static` **findImportedTypeReference**(`context`, `typeName`): \{ `moduleSpecifier`: `string`; `candidateTypeName`: `string`; \} \| `undefined`

Find an imported type reference from the active source file by local or exported symbol name.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeName

`string`

The local or exported type name to find.

#### Returns

\{ `moduleSpecifier`: `string`; `candidateTypeName`: `string`; \} \| `undefined`

The module specifier and exported candidate type name when found.

***

### resolveImportedObjectTypeSchemaForUtility() {#resolveimportedobjecttypeschemaforutility}

> `static` **resolveImportedObjectTypeSchemaForUtility**(`context`, `moduleSpecifier`, `candidateTypeName`, `title`): `IJsonSchema` \| `undefined`

Resolve an imported object schema for utility type application.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### moduleSpecifier

`string`

The module where the type is imported from.

##### candidateTypeName

`string`

The exported candidate type name.

##### title

`string`

The stripped title of the requested type.

#### Returns

`IJsonSchema` \| `undefined`

The resolved object schema.

***

### mapObjectTypeFromLocalDeclaration() {#mapobjecttypefromlocaldeclaration}

> `static` **mapObjectTypeFromLocalDeclaration**(`context`, `typeName`): `IJsonSchema` \| `undefined`

Map a local interface or type alias declaration to an object schema.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeName

`string`

The referenced type name.

#### Returns

`IJsonSchema` \| `undefined`

The mapped schema.

***

### extractUtilityTypeKeys() {#extractutilitytypekeys}

> `static` **extractUtilityTypeKeys**(`context`, `keysTypeNode`): `string`[]

Extract string literal keys from a utility type key argument (e.g. Pick or Omit).

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### keysTypeNode

`TypeNode` \| `undefined`

The keys type node.

#### Returns

`string`[]

The extracted keys.

***

### extractIndexedAccessKeys() {#extractindexedaccesskeys}

> `static` **extractIndexedAccessKeys**(`context`, `indexTypeNode`): `string`[]

Extract property keys from an indexed access index type.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### indexTypeNode

`TypeNode`

The index type node.

#### Returns

`string`[]

The extracted keys.

***

### extractMappedTypeKeys() {#extractmappedtypekeys}

> `static` **extractMappedTypeKeys**(`context`, `constraintTypeNode`): `string`[]

Extract keys for a mapped type constraint.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### constraintTypeNode

`TypeNode` \| `undefined`

The mapped type constraint.

#### Returns

`string`[]

The extracted keys.

***

### resolveReferencedTypeNodeFromLocalDeclaration() {#resolvereferencedtypenodefromlocaldeclaration}

> `static` **resolveReferencedTypeNodeFromLocalDeclaration**(`context`, `typeNode`): `TypeNode` \| `undefined`

Resolve a referenced type node from a local type alias declaration.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The type reference node.

#### Returns

`TypeNode` \| `undefined`

The referenced type node, if found locally.

***

### withTypeParameterBindings() {#withtypeparameterbindings}

> `static` **withTypeParameterBindings**(`context`, `typeParameters`, `typeArguments?`): [`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

Create a nested mapping context with generic parameters bound.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The current generation context.

##### typeParameters

`NodeArray`\<`TypeParameterDeclaration`\> \| `undefined`

The generic type parameters for the declaration.

##### typeArguments?

`NodeArray`\<`TypeNode`\>

Explicit type arguments, when provided.

#### Returns

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The scoped mapping context.

***

### getTypeParameterBinding() {#gettypeparameterbinding}

> `static` **getTypeParameterBinding**(`context`, `typeName`): `TypeNode` \| `null` \| `undefined`

Get a bound generic type parameter for the current mapping scope.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The current generation context.

##### typeName

`string`

The type name to resolve.

#### Returns

`TypeNode` \| `null` \| `undefined`

The bound type node, null for unresolved generic parameters, or undefined when not generic.

***

### isHomomorphicMappedType() {#ishomomorphicmappedtype}

> `static` **isHomomorphicMappedType**(`typeNode`): `boolean`

Determine whether a mapped type is a homomorphic source-preserving form.

#### Parameters

##### typeNode

`MappedTypeNode`

The mapped type node.

#### Returns

`boolean`

True if the mapped type mirrors an existing object shape.

***

### resolveMappedTypeSourceObjectSchema() {#resolvemappedtypesourceobjectschema}

> `static` **resolveMappedTypeSourceObjectSchema**(`context`, `typeNode`): `IJsonSchema` \| `undefined`

Resolve a source object schema for a mapped type when one exists.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`MappedTypeNode`

The mapped type node.

#### Returns

`IJsonSchema` \| `undefined`

The resolved source object schema.

***

### mapMappedTypePropertySchema() {#mapmappedtypepropertyschema}

> `static` **mapMappedTypePropertySchema**(`context`, `typeNode`, `sourcePropertyKey`, `mappedTypeParameterName`, `sourceObjectSchema?`): `IJsonSchema` \| `undefined`

Map a single mapped-type property schema.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`MappedTypeNode`

The mapped type node.

##### sourcePropertyKey

`string`

The original property key from the source object, used for lookup when the mapped type is homomorphic.

##### mappedTypeParameterName

`string`

The mapped type parameter name.

##### sourceObjectSchema?

`IJsonSchema`

The optional source object schema.

#### Returns

`IJsonSchema` \| `undefined`

The mapped property schema.

***

### resolveIndexedPropertySchema() {#resolveindexedpropertyschema}

> `static` **resolveIndexedPropertySchema**(`context`, `objectTypeNode`, `propertyKey`, `sourceObjectSchema?`): `IJsonSchema` \| `undefined`

Resolve a concrete property schema for an indexed access object type and key.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### objectTypeNode

`TypeNode`

The source object type node.

##### propertyKey

`string`

The property key to resolve.

##### sourceObjectSchema?

`IJsonSchema`

The optional pre-resolved source object schema.

#### Returns

`IJsonSchema` \| `undefined`

The resolved property schema.

***

### isMappedTypeParameterReference() {#ismappedtypeparameterreference}

> `static` **isMappedTypeParameterReference**(`typeNode`, `mappedTypeParameterName`): `boolean`

Determine whether a type node is a reference to the mapped type parameter.

#### Parameters

##### typeNode

`TypeNode`

The type node.

##### mappedTypeParameterName

`string`

The mapped type parameter name.

#### Returns

`boolean`

True if the node references the mapped parameter.

***

### applyMappedTypeOptionality() {#applymappedtypeoptionality}

> `static` **applyMappedTypeOptionality**(`schema`, `optionalToken`): `void`

Apply mapped-type optionality to a schema cloned from a source object.

#### Parameters

##### schema

`IJsonSchema`

The mapped schema.

##### optionalToken

`QuestionToken` \| `PlusToken` \| `MinusToken` \| `undefined`

The mapped type optional token.

#### Returns

`void`

***

### applyMappedTypeRequiredKeys() {#applymappedtyperequiredkeys}

> `static` **applyMappedTypeRequiredKeys**(`schema`, `propertyKeys`, `optionalToken`): `void`

Apply mapped-type required keys for generated property sets.

#### Parameters

##### schema

`IJsonSchema`

The mapped schema.

##### propertyKeys

`string`[]

The generated property keys.

##### optionalToken

`QuestionToken` \| `PlusToken` \| `MinusToken` \| `undefined`

The mapped type optional token.

#### Returns

`void`

***

### extractKeyofTypeKeys() {#extractkeyoftypekeys}

> `static` **extractKeyofTypeKeys**(`context`, `keysOperandNode`): `string`[]

Extract key names from a keyof operand where possible.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### keysOperandNode

`TypeNode`

The operand used with keyof.

#### Returns

`string`[]

The extracted keys.

***

### isGenericKeyofOperand() {#isgenerickeyofoperand}

> `static` **isGenericKeyofOperand**(`context`, `keysOperandNode`): `boolean`

Determine whether a keyof operand is a generic type parameter reference.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### keysOperandNode

`TypeNode`

The operand used with keyof.

#### Returns

`boolean`

True if the operand is a generic parameter.

***

### resolveExternalTypeReferenceSchemaId() {#resolveexternaltypereferenceschemaid}

> `static` **resolveExternalTypeReferenceSchemaId**(`context`, `typeNode`, `typeName`): `string` \| `undefined`

Resolve a schema id for an external imported type reference.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### typeNode

`TypeReferenceNode`

The type reference node.

##### typeName

`string`

The referenced type name.

#### Returns

`string` \| `undefined`

The resolved schema id.

***

### resolveReferenceMappingTarget() {#resolvereferencemappingtarget}

> `static` **resolveReferenceMappingTarget**(`context`, `packageName`, `typeName`): \{ `schemaId`: `string`; `namespace?`: `string`; \} \| `undefined`

Resolve a mapped schema target for an imported reference.

#### Parameters

##### context

[`ITypeScriptToSchemaContext`](../interfaces/ITypeScriptToSchemaContext.md)

The generation context.

##### packageName

`string`

The referenced package or module specifier.

##### typeName

`string`

The imported type name.

#### Returns

\{ `schemaId`: `string`; `namespace?`: `string`; \} \| `undefined`

The mapped schema id and optional namespace if one matches.

***

### findImportedModuleSpecifier() {#findimportedmodulespecifier}

> `static` **findImportedModuleSpecifier**(`sourceFile`, `typeNode`, `typeName`): `string` \| `undefined`

Find a module specifier for a referenced type in the active source file imports.

#### Parameters

##### sourceFile

`SourceFile`

The active source file.

##### typeNode

`TypeReferenceNode`

The referenced type node.

##### typeName

`string`

The referenced type name.

#### Returns

`string` \| `undefined`

The module specifier.

***

### mapJsonSchemaTagKey() {#mapjsonschematagkey}

> `static` **mapJsonSchemaTagKey**(`key`): `string`

Map custom tag key names to JSON schema property names.

#### Parameters

##### key

`string`

The raw tag key.

#### Returns

`string`

The schema key.

***

### extractTupleElementType() {#extracttupleelementtype}

> `static` **extractTupleElementType**(`element`): `TypeNode` \| `undefined`

Extract the inner type node from a named or rest tuple element.
Named tuple members and rest elements both wrap an inner type node; this unwraps them.
Plain type nodes are returned as-is.

#### Parameters

##### element

`TypeNode`

The tuple element.

#### Returns

`TypeNode` \| `undefined`

The inner type node.
