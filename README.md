# WWMWAPI

**World Wide Mail Web Application Programming Interface**

WWMWAPI is an experimental, JavaScript-based structured mail exchange system.

WWMWAPI is an independent mail exchange network. A message sent through WWMWAPI is intended for a recipient address that is served by the WWMWAPI system. The sender and recipient must both participate in the WWMWAPI mail system for native WWMWAPI delivery to take place.

WWMWAPI does not natively deliver to ordinary traditional MX/SMTP mail addresses. It is **not an SMTP implementation**, and it does not share the protocol or message model of traditional Internet Mail Exchange (MX). Sending between the two systems would require an explicit, separately designed translator; automatic cross-system conversion or SMTP fallback is not part of native WWMWAPI behavior.

## Project status

The repository is at the initial foundation stage. The HTTP service currently exposes only basic service and health information. The WWMWAPI message format, addressing model, network/server discovery, routing rules, authentication model, and delivery semantics have not yet been finalized.

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

- WWMWAPI defines and operates its own structured mail exchange model and network.
- Native WWMWAPI delivery is for recipient addresses served by the WWMWAPI system.
- Traditional MX/SMTP remains a separate mail system and address space.
- No automatic SMTP fallback or implicit cross-system translation is provided.
- Any cross-system translation belongs in a separate component, not inside the WWMWAPI core.
- The current implementation is an early development scaffold, not a production mail service.
