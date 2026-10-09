# 3Sixty Tools

This repository provides a focused set of tooling modules and command line apps that help teams define interfaces once and generate reliable outputs for documentation, integration, and data exchange. The projects are designed to reduce repetition across services by turning source models and route definitions into reusable artefacts.

Together, these modules support a consistent workflow for producing OpenAPI specifications, JSON Schemas, and JSON-LD contexts, while keeping shared validation and utility logic in one place for maintainability.

## Packages

- [tools-models](packages/tools-models/README.md) - Shared models for tooling packages.
- [tools-core](packages/tools-core/README.md) - Shared utilities and models for tooling packages.

## Apps

- [ts-to-openapi](apps/ts-to-openapi/README.md) - Generate OpenAPI specifications from REST route definitions.
- [ts-to-schema](apps/ts-to-schema/README.md) - Generate JSON Schemas from source model definitions.
- [ts-to-jsonld-context](apps/ts-to-jsonld-context/README.md) - Generate JSON-LD contexts from source model definitions.

## Contributing

To contribute to this package see the guidelines for building and publishing in [CONTRIBUTING](./CONTRIBUTING.md)

## Origin

This repository is derived from the original [iotaledger/twin-tools](https://github.com/iotaledger/twin-tools) repository.
