# WWMWAPI

**World Wide Mail Web Application Programming Interface**

WWMWAPI is an experimental, JavaScript-based structured mail exchange system.

WWMWAPI is an independent mail exchange network. Native WWMWAPI delivery is intended for recipient addresses served by the WWMWAPI system.

WWMWAPI does not natively speak the protocols or message models of other mail systems. However, a separately installed and configured translator can convert and forward messages between WWMWAPI and another supported mail system. With an appropriate translator available for the destination system, a WWMWAPI user can send beyond the native WWMWAPI network. The translator's supported systems and capabilities determine which external destinations are reachable.

Without a suitable translator, an ordinary address belonging to another mail system is not a native WWMWAPI destination. There is no implicit protocol conversion or automatic SMTP fallback in the WWMWAPI core.

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
- Other mail systems remain separate and use their own address and message models.
- Interoperability is possible through a separately installed and configured translator that supports the destination system.
- Translation is not built implicitly into the WWMWAPI core.
- The current implementation is an early development scaffold, not a production mail service.
