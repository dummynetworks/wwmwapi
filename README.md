# WWMWAPI

**World Wide Mail Web Application Programming Interface**

WWMWAPI is an experimental, JavaScript-based structured mail exchange system.

## Why WWMWAPI exists

WWMWAPI was designed around an important constraint: some serverless platforms, including Cloudflare Workers, do not let an application open an arbitrary public TCP listener on port 25.

Instead of requiring SMTP sockets, WWMWAPI makes HTTP requests the native server-to-server exchange mechanism. A WWMWAPI node receives an HTTP `Request`, interprets it as a WWMWAPI exchange operation, and uses `fetch()` to send messages to other WWMWAPI nodes. In a Cloudflare Worker, this maps naturally to the Worker's incoming `fetch(request)` handler and outbound Fetch API.

This creates a peer-to-peer style network of WWMWAPI servers that exchange structured mail over HTTP. WWMWAPI is not SMTP running on a different port: its message model, addressing, routing, and exchange rules are its own.

## Native exchange

Native WWMWAPI delivery is intended for recipient addresses served by the WWMWAPI system.

A sender's WWMWAPI node resolves the recipient's WWMWAPI destination and sends an exchange request to the receiving node. The receiving node validates and processes the request according to the WWMWAPI protocol.

The exact address syntax, peer discovery, routing, message schema, authentication, and delivery acknowledgements remain under design.

## Translator extension

A translator is an optional extension that strengthens WWMWAPI's receiving and sending capabilities by enabling communication with other mail systems.

A translator can support both directions:

- **Inbound:** receive mail from another system, such as traditional MX/SMTP, translate it into the WWMWAPI message model, and submit it to a WWMWAPI node.
- **Outbound:** accept a WWMWAPI message addressed to another system, translate it into that system's message and addressing model, and send it through the target system's exchange mechanism.

With a compatible translator installed and configured, WWMWAPI users can exchange mail with supported external systems, including traditional MX/SMTP.

### Official and custom translators

The WWMWAPI project recommends its **Official Translator** as the default option. This is a recommendation, not a requirement.

Developers and service operators may build and operate their own translators, provided those implementations follow the published WWMWAPI Translator API and compatibility requirements.

The Translator API documentation is intended to describe the integration contract in enough detail for independent implementations. Its exact API contract is still being designed; draft documentation must not be treated as a stable protocol specification.

## Cloudflare Workers

Cloudflare Workers are a first-class deployment target for the WWMWAPI HTTP exchange model. Native WWMWAPI communication uses HTTPS requests and does not require the Worker to listen on TCP port 25.

- Incoming peer exchange requests are delivered to the Worker's `fetch(request)` handler.
- The Worker uses `fetch()` to send exchange requests to other WWMWAPI peers.
- The Worker returns an HTTP `Response` according to the WWMWAPI acknowledgement rules.

The existing Node.js server scaffold is not yet a Cloudflare Worker adapter. See the [Cloudflare Deployment Guide](docs/cloudflare-deployment.md) for the intended runtime model and current implementation gap.

## Optional traditional MX compatibility

The proposed `webportrender` option is a separate, optional compatibility path for a Node.js deployment that attempts to bind local TCP port 25. It is not required for native WWMWAPI operation and is not how Cloudflare Workers exchange WWMWAPI messages.

Communication with traditional MX/SMTP systems is handled through a translator extension, not by making WWMWAPI itself speak SMTP.

## Project status

The repository is at the initial foundation stage. The current Node.js HTTP service exposes only basic service and health information. The WWMWAPI message format, addressing model, peer discovery, routing rules, authentication model, delivery semantics, Cloudflare Worker adapter, and Translator API contract have not yet been finalized.

## Development

Requirements: Node.js 22 or newer.

```sh
npm test
npm start
```

The current Node.js scaffold listens on `127.0.0.1:3000` by default. Configure `HOST` and `PORT` through environment variables when needed.

## Current Node.js scaffold endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/` | Service metadata |
| GET | `/health` | Health check |

No message exchange endpoint is implemented yet.

## Design boundaries

- WWMWAPI is an independent structured mail exchange network.
- HTTP `Request` and `fetch()` are the intended native server-to-server transport.
- Native WWMWAPI delivery is for recipient addresses served by WWMWAPI.
- Traditional MX/SMTP remains a separate system.
- A translator is an optional extension for inbound and outbound interoperability.
- The Official Translator is recommended, but custom translators are allowed.
- The current implementation is an early development scaffold, not a production mail service.
