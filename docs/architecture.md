# WWMWAPI Architecture (Draft)

**Status:** Draft. This document records system boundaries and intended architecture; it does not freeze the protocol.

## 1. System identity

WWMWAPI is an independent, JavaScript-based structured mail exchange system.

It is not traditional Mail Exchange (MX), and it is not an SMTP-compatible façade. WWMWAPI has its own message model, addressing, routing, and exchange rules.

## 2. Reason for the HTTP-native design

WWMWAPI is designed to operate in environments where an application cannot open an arbitrary public TCP port 25 listener, including serverless environments such as Cloudflare Workers.

Rather than requiring SMTP sockets, WWMWAPI uses the HTTP request/response model as its native server-to-server transport:

- A receiving WWMWAPI server exposes an HTTP endpoint.
- The platform delivers an incoming HTTP `Request` to the server's request handler.
- A sending WWMWAPI server uses `fetch()` to issue an exchange request to the receiving peer.
- The receiving server processes the request and returns an HTTP `Response` under the WWMWAPI acknowledgement rules.

On Cloudflare Workers, this design maps to the Worker's `fetch(request, env, ctx)` handler for inbound requests and the Fetch API for outbound HTTP requests.

This is not SMTP tunneled through HTTP. The WWMWAPI exchange protocol is native to WWMWAPI.

## 3. Serverless-first execution model

WWMWAPI is intended to operate without requiring every node operator to maintain an application server process 24 hours a day.

In an event-driven serverless runtime:
- the platform exposes the node's HTTP endpoint;
- an incoming peer request invokes the node's handler;
- the handler processes the exchange and returns a response;
- the operator does not need to keep an application process idling just to hold open a TCP listening socket.

This is an execution and deployment model, not a guarantee that every platform component sleeps or that every deployment has zero idle cost. Storage, queues, databases, networking, scheduled work, and other supporting services may have separate quotas and charges.

The project aims to keep routine exchange work lightweight and request-driven so that small or intermittent deployments do not require a permanently running mail-server machine.

## 4. Peer-to-peer server model

WWMWAPI is intended to operate as a peer-to-peer style network of mail servers. A WWMWAPI node can receive exchange requests from peers and send requests to other peers. It does not require every native message to pass through a traditional centralized SMTP relay.

A sender's node must determine the WWMWAPI server responsible for the recipient and then address an exchange request to that peer.

The precise peer discovery, address-to-server resolution, trust model, and routing algorithm are still open design decisions. The term peer-to-peer describes the intended server-to-server relationship; it does not imply that discovery, identity, or coordination requirements have already been solved.

## 5. Hybrid message representation

The selected architectural direction is a hybrid representation that combines a WWMWAPI-native exchange envelope with an established Internet message payload format.

The conceptual layers are:

1. **HTTP transport** — carries the exchange request between WWMWAPI peers using `Request`, `fetch()`, and `Response`.
2. **WWMWAPI JSON Envelope** — carries WWMWAPI protocol-level information such as exchange control, routing context, peer-level metadata, and references to the message payload.
3. **RFC 5322 / MIME Payload** — carries the conventional Internet message representation, including message headers, body structure, and attachments.
4. **WWMWAPI Extension Metadata** — carries explicitly defined WWMWAPI-specific capabilities or metadata that do not belong in the conventional message payload.

This direction aims to preserve compatibility with established email message content while allowing WWMWAPI to retain its own HTTP-native exchange behavior and add protocol-specific capabilities.

### Important terminology

DNS MX records are a mail-routing mechanism; they are not the message format. RFC 5322 defines Internet Message Format, and MIME extends that format for structured content and attachments. WWMWAPI's use of RFC 5322/MIME payloads does not make its native transport SMTP or make WWMWAPI itself a traditional MX server.

### Design constraints

- The WWMWAPI exchange envelope and the RFC 5322/MIME payload are distinct layers.
- Routing and peer exchange semantics belong to the WWMWAPI envelope and protocol, not to assumptions about SMTP.
- The conventional message payload should remain intact where possible. Any transformation that changes signed message content or headers must account for signature validity.
- WWMWAPI-specific metadata must be explicitly identified and must not silently redefine standard message fields.
- A translator maps between the WWMWAPI envelope, payload, and the target mail system's own exchange model.

This is a selected architectural direction, not a finalized wire specification. Exact JSON fields, schema versioning, binary payload representation, MIME serialization, extension namespaces, and preservation requirements remain open.

## 6. Native exchange boundary

Native WWMWAPI delivery is for recipient addresses served by the WWMWAPI system.

- A sender submits a message through a WWMWAPI-compatible mail service.
- For native delivery, the recipient must have an address served by WWMWAPI.
- The sending node resolves the responsible WWMWAPI peer.
- The sending node uses HTTP `fetch()` to send the exchange request.
- The receiving node obtains the request through its HTTP request handler and processes it according to the WWMWAPI protocol.
- An address belonging to another mail system is not automatically a native WWMWAPI destination.

The exact address syntax, message envelope, routing behavior, response semantics, and delivery acknowledgements remain open protocol decisions.

## 7. Cloudflare Workers as a native runtime

Cloudflare Workers are a first-class target for the HTTP-native WWMWAPI model:

- Inbound WWMWAPI operations arrive as HTTP requests and are handled by the Worker's `fetch()` handler.
- Outbound WWMWAPI peer operations use the Fetch API.
- Requests between Workers can use Cloudflare Service Bindings where the services are intentionally connected, or normal HTTP fetch to a peer's reachable endpoint.
- Each peer still needs a well-defined identity, address, endpoint, authentication policy, and message validation rules.

A Cloudflare Worker does not need to bind TCP port 25 to participate in native WWMWAPI exchange. The optional `webportrender` feature is a separate legacy/traditional-MX compatibility experiment for a Node.js runtime; it is not the WWMWAPI transport and cannot be assumed available in the Workers runtime.

The current repository's Node.js HTTP server is only an initial scaffold. A Cloudflare Worker entrypoint/adapter and the WWMWAPI exchange handlers have not yet been implemented.

## 8. Translator extension: bidirectional interoperability

A translator is an optional extension that strengthens both the receiving and sending capabilities of a WWMWAPI deployment. It connects two otherwise independent mail systems by explicitly translating their addressing, message representations, and exchange behavior.

### Inbound: external mail system to WWMWAPI

For example, an MX/SMTP message can enter through a translator. The translator receives the external message, maps its recipient to a valid WWMWAPI destination, converts the message into the WWMWAPI message model, and submits it to a WWMWAPI node through the agreed integration interface.

### Outbound: WWMWAPI to external mail system

A WWMWAPI message addressed to an external system can be handed to a translator. The translator maps the destination, converts the WWMWAPI message into the target system's representation, and sends it through that system's exchange mechanism.

### Official and custom translators

The WWMWAPI project recommends an Official Translator, but does not require it. Independent developers and service operators may build their own translators when they follow the published Translator API and compatibility requirements.

The public Translator API documentation must define:
- inbound and outbound interaction boundaries;
- capability declarations and supported external systems;
- message and address representations;
- authentication, authorization, and trust;
- acceptance, rejection, acknowledgement, and delivery status;
- error formats, retries, and duplicate handling;
- versioning, compatibility, and conformance tests.

The Translator API contract is not yet finalized. No endpoint names, payload fields, or authentication scheme should be assumed stable.

## 9. Separation rules

- WWMWAPI's native transport is HTTP request/response, not SMTP.
- WWMWAPI owns its native message model, address space, peer routing, and exchange semantics.
- Traditional MX/SMTP behavior does not belong in the WWMWAPI core.
- A translator is a separate optional extension.
- The Official Translator is recommended, not required.
- Custom translators are allowed when they comply with the published Translator API.
- No external protocol conversion should be assumed unless a compatible translator is configured.

## 10. Open protocol decisions

The following remain intentionally undecided:

- canonical WWMWAPI JSON exchange envelope and schema versioning
- RFC 5322/MIME payload serialization and transport encoding
- WWMWAPI extension metadata structure and namespacing
- rules for preserving or transforming standard message content and signatures
- sender and recipient addressing syntax
- peer identity and endpoint representation
- address-to-peer discovery and routing
- request authentication, authorization, and peer trust
- exchange acknowledgement and delivery-state semantics
- synchronous versus asynchronous handoff
- durable storage, queues, retry, and duplicate handling
- attachment representation and size limits
- HTTP error mapping and protocol-level error format
- Cloudflare Worker adapter and runtime-specific persistence
- Translator API versioning and conformance requirements
