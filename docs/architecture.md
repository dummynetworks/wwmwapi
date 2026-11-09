# WWMWAPI Architecture (Draft)

**Status:** Draft. This document records system boundaries and planned responsibilities; it does not freeze the protocol.

## System identity

WWMWAPI is an independent, JavaScript-based structured mail exchange system.

It is a separate mail network, not another name for traditional Mail Exchange (MX) and not an SMTP-compatible façade. The two systems have different exchange models and do not natively exchange messages with each other.

## Native exchange boundary

Native WWMWAPI delivery is limited to addresses served by the WWMWAPI system.

- A sender submits a message through a WWMWAPI-compatible mail service.
- The recipient must also have an address served by the WWMWAPI system.
- WWMWAPI routes the message to the server responsible for that WWMWAPI recipient.
- An ordinary MX/SMTP address is not automatically a valid WWMWAPI recipient.
- WWMWAPI does not silently fall back to SMTP or translate a message into the traditional mail format.

The exact address syntax, rules for determining whether an address belongs to WWMWAPI, and the mechanism for discovering the recipient's WWMWAPI server are still open protocol decisions.

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
- A future MX-to-WWMWAPI or WWMWAPI-to-MX translator must be a separate component.
- Translation is optional interoperability, not a requirement for native WWMWAPI operation.
- A translator must explicitly map differences between the systems; it must not silently pretend their address spaces or message models are identical.

## Open protocol decisions

The following remain intentionally undecided:

- canonical message envelope and schema versioning
- sender and recipient addressing syntax
- how an address is identified as belonging to WWMWAPI
- WWMWAPI server discovery and routing
- message identifiers and duplicate detection
- submission and delivery operation semantics
- synchronous versus asynchronous exchange behavior
- acknowledgement, rejection, and retry rules
- authentication and authorization
- attachment representation and size limits
- error format and compatibility policy
