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

## Translator extension: bidirectional interoperability

A translator is an optional extension that strengthens both the receiving and sending capabilities of a WWMWAPI deployment. It connects two otherwise independent mail systems by explicitly translating their addressing, message representations, and exchange behavior.

### Inbound: external mail system to WWMWAPI

For example, an MX/SMTP message can enter through a translator. The translator receives the external message, maps its recipient to a valid WWMWAPI destination, converts the message into the WWMWAPI message model, and submits it for native WWMWAPI delivery.

Inbound delivery therefore requires:
- a translator that can receive from the external system;
- an explicit mapping from the external recipient address to a WWMWAPI destination;
- successful conversion and acceptance by the WWMWAPI side.

### Outbound: WWMWAPI to external mail system

A WWMWAPI message addressed to an external system can be handed to a translator. The translator maps the destination and converts the WWMWAPI message into the target system's message representation, then sends it through that system's exchange mechanism. For example, an MX/SMTP-capable translator can deliver to traditional Internet mail addresses.

Outbound delivery therefore requires a translator that supports the destination system and has a valid delivery path.

### Translator boundaries

- The translator is separate from the WWMWAPI core and is not required for native WWMWAPI exchange.
- A translator may implement inbound, outbound, or both directions; bidirectional support is an explicit capability.
- Supported external systems, address mappings, conversion behavior, and delivery guarantees must be declared.
- Translation must not silently treat different address spaces or message models as identical.
- External delivery is possible only where a compatible translator and a working destination path exist; this is not universal compatibility by default.

## Planned logical responsibilities

These are architectural areas, not implemented features:

1. **API surface** — accepts and exposes WWMWAPI operations.
2. **Message model** — defines the structured representation of a WWMWAPI message.
3. **Identity and authorization** — establishes who may submit, route, or access messages.
4. **Address resolution and server discovery** — determines whether a recipient is on the WWMWAPI network and identifies the responsible server.
5. **Exchange and delivery** — manages transfer, acceptance, rejection, and delivery state between WWMWAPI participants.
6. **Persistence** — stores messages and the state needed to process them reliably.
7. **Translator integration boundary** — provides a defined way for optional translators to exchange messages with the WWMWAPI core without merging the two systems.

## Separation rules

- The WWMWAPI core owns WWMWAPI-native messages, addresses, routing, and exchange behavior.
- Traditional MX/SMTP behavior does not belong in the WWMWAPI core.
- A translator is a separate extension that may be attached to a WWMWAPI deployment or gateway.
- Inbound and outbound translation are separate capabilities and must be handled explicitly.
- Translation is optional interoperability, not a prerequisite for native WWMWAPI operation.
- No external protocol conversion should be assumed unless a compatible translator is configured.

## Open protocol decisions

The following remain intentionally undecided:

- canonical message envelope and schema versioning
- sender and recipient addressing syntax
- how an address is identified as belonging to WWMWAPI or another mail system
- WWMWAPI server discovery and routing
- inbound translator interface and recipient mapping
- outbound translator interface and destination selection
- translator registration, capability discovery, and trust
- message identifiers and duplicate detection
- submission and delivery operation semantics
- synchronous versus asynchronous exchange behavior
- acknowledgement, rejection, and retry rules
- authentication and authorization
- attachment representation and size limits
- error format and compatibility policy
