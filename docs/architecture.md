# WWMWAPI Architecture (Draft)

**Status:** Draft. This document records system boundaries and planned responsibilities; it does not freeze the protocol.

## System identity

WWMWAPI is an independent, JavaScript-based structured mail exchange system.

It is a separate mail network, not another name for traditional Mail Exchange (MX) and not an SMTP-compatible façade. WWMWAPI and traditional mail systems have different exchange models, address spaces, and message representations.

## Native exchange boundary

Native WWMWAPI delivery is for recipient addresses served by the WWMWAPI system.

- A sender submits a message through a WWMWAPI-compatible mail service.
- For native delivery, the recipient must have an address served by WWMWAPI.
- WWMWAPI routes the message to the server responsible for that WWMWAPI recipient.
- An address belonging to another mail system is not automatically a native WWMWAPI destination.
- The WWMWAPI core does not silently convert messages or fall back to another mail protocol.

The exact address syntax, rules for identifying WWMWAPI addresses, and the mechanism for discovering the recipient's WWMWAPI server are still open protocol decisions.

## Translator-based interoperability

A separately installed and configured translator can connect WWMWAPI to another mail system.

Conceptually, the translator:
1. Receives or is given a WWMWAPI message intended for an external address.
2. Converts the message and relevant addressing information into the target system's representation.
3. Transfers the converted message using that target system's exchange mechanism.
4. Reports the outcome back through an agreed integration boundary.

A translator can enable delivery beyond the native WWMWAPI network, including to traditional MX/SMTP addresses, provided that a translator supporting the destination system is available and configured.

The translator is optional and separate from the WWMWAPI core. Its supported destinations, conversion rules, failure behavior, and deployment location must be explicit. "Anywhere" therefore means any destination system for which a compatible translator and a working delivery path exist; it does not imply universal compatibility by default.

## Planned logical responsibilities

These are architectural areas, not implemented features:

1. **API surface** — accepts and exposes WWMWAPI operations.
2. **Message model** — defines the structured representation of a WWMWAPI message.
3. **Identity and authorization** — establishes who may submit, route, or access messages.
4. **Address resolution and server discovery** — determines whether a recipient is on the WWMWAPI network and identifies the responsible server.
5. **Exchange and delivery** — manages transfer, acceptance, rejection, and delivery state between WWMWAPI participants.
6. **Persistence** — stores messages and the state needed to process them reliably.

## Separation rules

- The WWMWAPI core owns WWMWAPI-native messages, addresses, routing, and exchange behavior.
- Traditional MX/SMTP behavior does not belong in the WWMWAPI core.
- A translator is a separate component that may be attached to a WWMWAPI deployment or gateway.
- A translator must explicitly map differences between address spaces, message models, and delivery semantics.
- Translation is optional interoperability, not a prerequisite for native WWMWAPI operation.
- No external protocol conversion should be assumed unless a compatible translator is configured.

## Open protocol decisions

The following remain intentionally undecided:

- canonical message envelope and schema versioning
- sender and recipient addressing syntax
- how an address is identified as belonging to WWMWAPI or another mail system
- WWMWAPI server discovery and routing
- how WWMWAPI hands an external-destination message to a translator
- translator registration, capability discovery, and trust
- message identifiers and duplicate detection
- submission and delivery operation semantics
- synchronous versus asynchronous exchange behavior
- acknowledgement, rejection, and retry rules
- authentication and authorization
- attachment representation and size limits
- error format and compatibility policy
