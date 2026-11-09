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

## 3. Peer-to-peer server model

WWMWAPI is intended to operate as a peer-to-peer style network of mail servers. A WWMWAPI node can receive exchange requests from peers and send requests to other peers. It does not require every native message to pass through a traditional centralized SMTP relay.

A sender's node must determine the WWMWAPI server responsible for the recipient and then address an exchange request to that peer.

The precise peer discovery, address-to-server resolution, trust model, and routing algorithm are still open design decisions. The term peer-to-peer describes the intended server-to-server relationship; it does not imply that discovery, identity, or coordination requirements have already been solved.

## 4. Native exchange boundary

Native WWMWAPI delivery is for recipient addresses served by the WWMWAPI system.

- A sender submits a message through a WWMWAPI-compatible mail service.
- For native delivery, the recipient must have an address served by WWMWAPI.
- The sending node resolves the responsible WWMWAPI peer.
- The sending node uses HTTP `fetch()` to send the exchange request.
- The receiving node obtains the request through its HTTP request handler and processes it according to the WWMWAPI protocol.
- An address belonging to another mail system is not automatically a native WWMWAPI destination.

The exact address syntax, message envelope, routing behavior, response semantics, and delivery acknowledgements remain open protocol decisions.

## 5. Cloudflare Workers as a native runtime

Cloudflare Workers are a first-class target for the HTTP-native WWMWAPI model:

- Inbound WWMWAPI operations arrive as HTTP requests and are handled by the Worker's `fetch()` handler.
- Outbound WWMWAPI peer operations use the Fetch API.
- Requests between Workers can use Cloudflare Service Bindings where the services are intentionally connected, or normal HTTP fetch to a peer's reachable endpoint.
- Each peer still needs a well-defined identity, address, endpoint, authentication policy, and message validation rules.

A Cloudflare Worker does not need to bind TCP port 25 to participate in native WWMWAPI exchange. The optional `webportrender` feature is a separate legacy/traditional-MX compatibility experiment for a Node.js runtime; it is not the WWMWAPI transport and cannot be assumed available in the Workers runtime.

The current repository's Node.js HTTP server is only an initial scaffold. A Cloudflare Worker entrypoint/adapter and the WWMWAPI exchange handlers have not yet been implemented.

## 6. Translator extension: bidirectional interoperability

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

## 7. Separation rules

- WWMWAPI's native transport is HTTP request/response, not SMTP.
- WWMWAPI owns its native message model, address space, peer routing, and exchange semantics.
- Traditional MX/SMTP behavior does not belong in the WWMWAPI core.
- A translator is a separate optional extension.
- The Official Translator is recommended, not required.
- Custom translators are allowed when they comply with the published Translator API.
- No external protocol conversion should be assumed unless a compatible translator is configured.

## 8. Open protocol decisions

The following remain intentionally undecided:

- canonical message envelope and schema versioning
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
