# WWMWAPI Architecture (Draft)

**Status:** Draft. This document records boundaries and planned responsibilities; it does not freeze the protocol.

## System identity

WWMWAPI is an independent, JavaScript-based structured mail exchange system.

It is not another name for traditional Mail Exchange (MX), and it is not an SMTP-compatible façade. The two systems have different exchange models. Communication between them, if implemented, requires a separately designed translator.

## Planned logical responsibilities

These are architectural areas, not implemented features:

1. **API surface** — accepts and exposes WWMWAPI operations.
2. **Message model** — defines the structured representation of a mail message.
3. **Identity and authorization** — establishes who may submit, route, or access messages.
4. **Address resolution and routing** — determines where a WWMWAPI message should go.
5. **Exchange and delivery** — manages transfer, acceptance, rejection, and delivery state.
6. **Persistence** — stores messages and the state needed to process them reliably.

## Separation rules

- The WWMWAPI core owns WWMWAPI-native messages and exchange behavior.
- Traditional MX/SMTP behavior does not belong in the core.
- A future MX-to-WWMWAPI or WWMWAPI-to-MX translator must be a separately deployable or separately maintained component.
- The translator must explicitly map differences between the systems; it must not silently pretend their message models are identical.

## Open protocol decisions

The following remain intentionally undecided:

- canonical message envelope and schema versioning
- sender and recipient addressing syntax
- message identifiers and duplicate detection
- submission and delivery operation semantics
- synchronous versus asynchronous exchange behavior
- acknowledgement, rejection, and retry rules
- authentication and authorization
- attachment representation and size limits
- error format and compatibility policy
