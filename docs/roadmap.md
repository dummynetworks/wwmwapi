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

## 2. First exchange implementation

- [ ] Implement validation against the agreed message schema.
- [ ] Implement the first native WWMWAPI exchange operation.
- [ ] Enforce the native WWMWAPI recipient boundary.
- [ ] Add protocol-level tests and examples.

## 3. Reliable delivery

- [ ] Define routing behavior between WWMWAPI servers.
- [ ] Add durable storage and queue processing.
- [ ] Define retry, duplicate handling, and delivery status.

## 4. Operational readiness

- [ ] Add security hardening and abuse controls.
- [ ] Add observability and operational documentation.
- [ ] Evaluate deployment requirements.

## Separate interoperability project

- [ ] Specify a translator between WWMWAPI and traditional MX/SMTP, only if interoperability is required.

The translator is not a prerequisite for WWMWAPI to operate as its own exchange system.
