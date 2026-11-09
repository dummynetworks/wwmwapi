# WWMWAPI Roadmap

This roadmap is provisional and may change as the protocol is designed.

## 0. Repository foundation

- [x] Establish the project identity and protocol boundaries.
- [x] Add a minimal Node.js HTTP service.
- [x] Add service metadata and health routes.
- [x] Add automated tests for the initial routes.

## 1. HTTP-native protocol definition

- [ ] Define the WWMWAPI JSON exchange envelope.
- [ ] Define the RFC 5322/MIME payload representation and transport encoding.
- [ ] Define WWMWAPI extension metadata and namespacing.
- [ ] Define payload preservation and signature-safe transformation rules.
- [ ] Define request and response semantics for a peer exchange.
- [ ] Define addressing and recipient representation.
- [ ] Define peer identity and endpoint representation.
- [ ] Define address-to-peer discovery and routing.
- [ ] Define message identifiers and schema versioning.
- [ ] Define authentication, authorization, and trust requirements.
- [ ] Define acknowledgement, rejection, and delivery-state semantics.

## 2. First native peer exchange implementation

- [ ] Implement validation against the agreed message schema.
- [ ] Implement inbound HTTP Request handling for peer exchange.
- [ ] Implement outbound peer communication using fetch().
- [ ] Enforce the native WWMWAPI recipient boundary.
- [ ] Add protocol-level tests and examples.

## 3. Serverless and cost-efficient operation

- [ ] Define the request-driven lifecycle for WWMWAPI nodes.
- [ ] Avoid designs that require an always-running process for native exchange.
- [ ] Define durable-storage requirements separately from transient request handling.
- [ ] Document platform quotas, execution limits, and cost-sensitive deployment profiles.
- [ ] Test low-volume and intermittent traffic behavior.

## 4. Cloudflare Workers runtime

- [ ] Add a Cloudflare Workers entrypoint/adapter.
- [ ] Implement the WWMWAPI fetch(request) handler.
- [ ] Implement outbound peer exchange using the Workers Fetch API.
- [ ] Define use of Service Bindings versus public peer HTTP endpoints.
- [ ] Document Cloudflare-specific request, subrequest, and payload limits.
- [ ] Add Worker runtime tests.

## 5. Reliable native delivery

- [ ] Define durable message acceptance and delivery states.
- [ ] Add persistent storage and queue processing.
- [ ] Define retry, timeout, and duplicate handling.
- [ ] Define attachment storage and transfer limits.

## 6. Translator extension and interoperability

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

## 7. Optional traditional MX listener

- [ ] Specify the Node.js-only `webportrender` behavior.
- [ ] Define the three-attempt bind behavior and restart reset semantics.
- [ ] Keep the TCP 25 listener isolated from native HTTP exchange.
- [ ] Document external reachability checks separately from local port binding.

## 8. Operational readiness

- [ ] Add security hardening and abuse controls.
- [ ] Add observability and operational documentation.
- [ ] Evaluate deployment requirements.

The Official Translator is recommended but optional. Custom translators are supported when they implement the published Translator API and compatibility requirements.
