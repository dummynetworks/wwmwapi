# Cloudflare Deployment Guide

**Status:** Architecture and deployment guide for WWMWAPI's intended Cloudflare Workers model. This does not claim that the current Node.js scaffold is already Worker-compatible.

## 1. Why WWMWAPI fits Cloudflare Workers

WWMWAPI exists in part because some hosting environments do not let applications open a public TCP port 25 listener.

Instead of trying to run a traditional SMTP server inside Cloudflare Workers, WWMWAPI uses HTTP as its native server-to-server exchange transport.

Cloudflare Workers provide the two operations this design needs:

1. **Receive:** an incoming HTTP request is delivered to the Worker's `fetch(request, env, ctx)` handler as a `Request` object.
2. **Send:** code running inside a request handler can use the Fetch API to make an outbound HTTP request to another WWMWAPI peer.

The receiving peer returns a `Response`. WWMWAPI defines what the request means, how a message is represented, how peers authenticate each other, and what each response means.

This means a Cloudflare Worker can act as a native WWMWAPI mail-exchange node without listening on TCP port 25. It is an HTTP-native mail exchange system, not SMTP hidden behind an HTTP endpoint.

Official Cloudflare references:
- [Fetch Handler](https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/)
- [Request API](https://developers.cloudflare.com/workers/runtime-apis/request/)
- [Fetch API](https://developers.cloudflare.com/workers/runtime-apis/fetch/)

## 2. Conceptual peer exchange

The following diagram shows the intended model. It is conceptual; the WWMWAPI endpoint paths and payload schemas are not yet standardized.

```text
Sender's WWMWAPI Worker                  Recipient's WWMWAPI Worker
        |                                            |
        | 1. Resolve recipient's WWMWAPI peer        |
        |                                            |
        | 2. fetch(peerEndpoint, exchangeRequest)    |
        |------------------------------------------->|
        |                                            | 3. fetch(Request)
        |                                            |    validate message
        |                                            |    accept/process
        |                                            |
        | 4. Response(acknowledgement)                |
        |<-------------------------------------------|
        |                                            |
```

Each node can receive requests from peers and send requests to peers. The mechanism for discovering the recipient's server, establishing peer identity, and selecting a route remains part of the WWMWAPI protocol design.

## 3. Cloudflare Worker request shape

Cloudflare invokes a Worker for inbound HTTP requests through its fetch handler. A minimal Worker entrypoint looks like this:

```js
export default {
  async fetch(request, env, ctx) {
    // WWMWAPI will route and validate the incoming Request here.
    // Protocol paths, authentication, and message schemas are not finalized.
    return new Response("WWMWAPI Worker is online", {
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  }
};
```

This is only a runtime-shaped placeholder, not a working WWMWAPI message endpoint.

For outbound peer communication, the runtime provides the Fetch API:

```js
const response = await fetch(peerEndpoint, {
  method: "POST",
  headers: {
    "content-type": "application/json"
  },
  body: serializedExchangeMessage
});
```

The endpoint, headers, serialization, authentication, and response format above are illustrative placeholders. They must be replaced by the finalized WWMWAPI protocol contract.

## 4. Worker-to-Worker communication

Cloudflare documents Worker-to-Worker Fetch requests through:
- **Service Bindings**, when a Worker is intentionally connected to another Worker in the Cloudflare configuration; or
- regular HTTP `fetch()` to a peer endpoint that is publicly reachable, subject to the applicable runtime compatibility settings and platform rules.

Service Bindings are useful for explicitly connected services, but they are not a universal peer-discovery system for arbitrary WWMWAPI operators. A public peer network still needs a protocol for server identity, endpoint discovery, trust, and authentication.

Reference:
- [Cloudflare Fetch API — Worker to Worker](https://developers.cloudflare.com/workers/runtime-apis/fetch/)

## 5. What this architecture does not require

Native WWMWAPI exchange between Worker nodes does not require:

- opening TCP port 25;
- running an SMTP daemon inside a Worker;
- configuring traditional DNS MX records for native WWMWAPI message delivery;
- using Cloudflare Spectrum merely to exchange WWMWAPI messages.

WWMWAPI needs its own address-to-peer discovery and routing rules. Those rules are not the same thing as SMTP MX lookup and are still being designed.

## 6. Request, subrequest, and payload limits

HTTP-native exchange avoids the need for a raw SMTP listener, but it does not mean platform limits disappear.

Cloudflare Workers has plan-dependent limits for incoming request bodies, subrequests per invocation, CPU time, and other resources. For example, Cloudflare's published limits currently list different daily request and subrequest allowances for Free and Paid plans, and incoming request body limits depend on the zone plan.

This matters for message attachments, large messages, fan-out, and multi-hop routing. The WWMWAPI protocol should define message and attachment limits, and its implementation should avoid assuming that one Worker invocation can make an unlimited number of peer requests.

Always check the current limits before deployment:
- [Cloudflare Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)

## 7. Persistence and reliable delivery

A successful HTTP response only proves the remote endpoint returned that response. WWMWAPI must define what a particular acknowledgement means.

For example, the protocol must distinguish:
- request received;
- message structurally accepted;
- message durably stored;
- message delivered to the recipient's mailbox;
- message rejected or permanently failed.

The exact states and persistence guarantees are not finalized. A production implementation will need durable storage and a retry/duplicate-handling design that fits the selected Cloudflare storage and compute products.

## 8. Traditional MX compatibility is a separate path

The optional `webportrender` idea attempts to bind TCP port 25 in a normal Node.js runtime. That is a separate compatibility path for traditional MX/SMTP, not the native WWMWAPI protocol.

Cloudflare Workers cannot be treated as a normal Node.js process that calls `server.listen(25)` to create a public SMTP listener. If traditional MX/SMTP interoperability is required, use a compatible Translator deployment or another separately designed mail gateway.

Cloudflare's regular HTTP proxy also does not become an SMTP proxy simply because a hostname is proxied. TCP-based proxying requires a different product and configuration, such as an appropriate Spectrum setup.

References:
- [Cloudflare Workers Protocols](https://developers.cloudflare.com/workers/reference/protocols/)
- [Cloudflare Spectrum](https://developers.cloudflare.com/spectrum/)
- [Spectrum Protocols per Plan](https://developers.cloudflare.com/spectrum/protocols-per-plan/)

## 9. Current repository implementation gap

The current repository contains an initial Node.js HTTP server with service metadata and a health endpoint. It does not yet implement the WWMWAPI exchange protocol or a Cloudflare Worker entrypoint.

The next implementation stages are:

1. Define WWMWAPI message and peer-exchange schemas.
2. Define peer identity, server discovery, and routing.
3. Define request authentication and acknowledgement semantics.
4. Implement a Cloudflare Worker adapter using `fetch(request)`.
5. Implement outbound peer exchange using `fetch()`.
6. Add durable message storage, retries, duplicate handling, and conformance tests.

Until these steps are implemented, the Worker snippets above are explanatory scaffolding, not a deployable mail service.
