# WWMWAPI Roadmap

This roadmap is provisional and may change as the protocol is designed.

## 0. Repository foundation

- [x] Establish the project identity and protocol boundaries.
- [x] Add a minimal Node.js HTTP service.
- [x] Add service metadata and health routes.
- [x] Add automated tests for the initial routes.

## 1. Protocol definition

- [ ] Define the WWMWAPI message envelope.
- [ ] Define addressing and recipient representation.
- [ ] Define how WWMWAPI addresses are distinguished from addresses in other mail systems.
- [ ] Define WWMWAPI server discovery and recipient routing.
- [ ] Define message identifiers and schema versioning.
- [ ] Define exchange acknowledgement and failure semantics.
- [ ] Define authentication and authorization requirements.

## 2. First native exchange implementation

- [ ] Implement validation against the agreed message schema.
- [ ] Implement the first native WWMWAPI exchange operation.
- [ ] Enforce the native WWMWAPI recipient boundary.
- [ ] Add protocol-level tests and examples.

## 3. Reliable native delivery

- [ ] Define routing behavior between WWMWAPI servers.
- [ ] Add durable storage and queue processing.
- [ ] Define retry, duplicate handling, and delivery status.

## 4. Translator extension and interoperability

- [ ] Define the WWMWAPI integration boundary for translators.
- [ ] Define inbound translator capabilities and external-to-WWMWAPI recipient mapping.
- [ ] Define outbound translator capabilities and WWMWAPI-to-external destination mapping.
- [ ] Define translator registration, capability discovery, and trust boundaries.
- [ ] Define message conversion rules for each supported external mail system.
- [ ] Define acknowledgements, failures, retries, and delivery status across both directions.
- [ ] Publish the complete Translator API developer documentation.
- [ ] Define translator API versioning and compatibility requirements.
- [ ] Provide conformance tests and example custom translator implementations.
- [ ] Implement an Official Translator with inbound and outbound support.
- [ ] Add tests for inbound and outbound interoperability.

## 5. Operational readiness

- [ ] Add security hardening and abuse controls.
- [ ] Add observability and operational documentation.
- [ ] Evaluate deployment requirements.

The Official Translator is recommended but optional. Custom translators are supported when they implement the published Translator API and compatibility requirements.
