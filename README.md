# WWMWAPI

**World Wide Mail Web Application Programming Interface**

WWMWAPI is an experimental, JavaScript-based structured mail exchange system.

WWMWAPI is an independent mail exchange network. Native WWMWAPI delivery is intended for recipient addresses served by the WWMWAPI system.

## Translator extension

A translator is an optional extension that strengthens WWMWAPI's **receiving and sending capabilities** by enabling communication with other mail systems.

A translator can support both directions:

- **Inbound:** receive mail from another system, such as traditional MX/SMTP, translate it into the WWMWAPI message model, and deliver it to the corresponding WWMWAPI recipient.
- **Outbound:** take a WWMWAPI message addressed to another system, translate it into that system's message and addressing model, and send it through the target system's exchange mechanism.

With a compatible translator installed and configured, WWMWAPI users can exchange mail with supported external systems, including traditional MX/SMTP. Inbound delivery requires the translator to accept the external message and map its recipient to a valid WWMWAPI destination. Outbound delivery requires the translator to support the destination system.

### Official and custom translators

The WWMWAPI project recommends its **Official Translator** as the default option for users who want a ready-made integration.

Using the Official Translator is not mandatory. Developers and service operators may build and operate their own translators, provided those implementations follow the published WWMWAPI Translator API and compatibility requirements.

The Translator API documentation is intended to describe the integration contract in enough detail for independent implementations, including inbound and outbound behavior, message conversion boundaries, authentication, acknowledgements, errors, retries, and compatibility expectations. The exact API contract is still being designed; draft documentation must not be treated as a stable protocol specification.

WWMWAPI does not natively speak the protocols or message models of other mail systems. Translation is an explicit extension capability, not an implicit behavior of the WWMWAPI core. Without a suitable translator, native WWMWAPI delivery remains limited to addresses served by WWMWAPI.

## Project status

The repository is at the initial foundation stage. The HTTP service currently exposes only basic service and health information. The WWMWAPI message format, addressing model, network/server discovery, routing rules, authentication model, delivery semantics, and Translator API contract have not yet been finalized.

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
- A translator is an optional extension for inbound and outbound interoperability.
- The Official Translator is recommended, but custom translators are allowed.
- Custom translators must implement the published Translator API and compatibility requirements.
- Translator capabilities, supported systems, and address mappings must be explicit.
- Translation is not built implicitly into the WWMWAPI core.
- The current implementation is an early development scaffold, not a production mail service.
