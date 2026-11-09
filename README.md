# WWMWAPI

**World Wide Mail Web Application Programming Interface**

WWMWAPI is an experimental, JavaScript-based structured mail exchange system.

It is designed as an independent exchange system. It is **not an SMTP implementation**, and it does not share the protocol or message model of traditional Internet Mail Exchange (MX). Interoperability with a different mail system would require a separate translator.

## Project status

The repository is at the initial foundation stage. The HTTP service currently exposes only basic service and health information. The WWMWAPI message format, addressing model, routing rules, authentication model, and delivery semantics have not yet been finalized.

Protocol decisions will be documented before they are treated as stable.

## Development

Requirements: Node.js 22 or newer.

```sh
npm test
npm start
```

The server listens on `127.0.0.1:3000` by default. Configure `HOST` and `PORT` through environment variables when needed.

## Current endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/` | Service metadata |
| GET | `/health` | Health check |

No message submission or delivery endpoint is implemented yet.

## Design boundaries

- WWMWAPI defines its own structured mail exchange model.
- Traditional MX/SMTP remains a separate system.
- Any cross-system translation belongs in a separate component, not implicitly inside the WWMWAPI core.
- The current implementation is an early development scaffold, not a production mail service.
