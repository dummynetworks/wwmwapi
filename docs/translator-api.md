# WWMWAPI Translator API — Developer Guide (Draft)

**Status: Design draft — not a stable API specification.**

This document describes the intended purpose and documentation requirements of the WWMWAPI Translator API. It is not yet sufficient to implement a compatible translator: concrete endpoints, payload schemas, authentication, and delivery semantics must be specified and versioned before the API is declared stable.

## 1. Purpose

The Translator API is the integration contract between the WWMWAPI system and an optional translator implementation.

The WWMWAPI project recommends its Official Translator. This is a recommendation, not a requirement. Developers and service operators may create independent translators.

A custom translator must implement the published Translator API and pass the applicable compatibility requirements to be considered compatible.

## 2. System boundary

WWMWAPI and external mail systems have different address spaces, message models, and exchange protocols. The translator is responsible for bridging those differences.

The translator is an extension, not part of the WWMWAPI native exchange core. Native WWMWAPI exchange must remain usable without any translator installed.

## 3. Message representation boundary

The selected WWMWAPI message-format direction is hybrid:

- a WWMWAPI JSON exchange envelope;
- an RFC 5322 / MIME message payload;
- explicitly identified WWMWAPI extension metadata.

The Translator API must define how these layers are presented to a translator and how external message formats are mapped into and out of them. The concrete JSON schema, payload encoding, and extension namespace rules are not finalized.

A translator must not assume that the WWMWAPI exchange envelope is the same as an SMTP envelope, or that DNS MX records are a message format. It must map addressing, message content, and transport semantics explicitly.

## 4. Directional capabilities

A translator may declare one or both capabilities.

### 3.1 Inbound

Inbound means external mail system → translator → WWMWAPI.

An inbound-capable translator is responsible for receiving mail from a supported external system, mapping its recipient to a WWMWAPI destination, converting the message into the WWMWAPI message representation, and submitting it through the agreed WWMWAPI integration interface.

### 3.2 Outbound

Outbound means WWMWAPI → translator → external mail system.

An outbound-capable translator is responsible for accepting an eligible WWMWAPI message, resolving or mapping the external destination, converting the message into the target system's representation, and delivering it through that system.

Inbound and outbound support must be declared separately. A translator that supports one direction must not be assumed to support the other.

## 5. Requirements for the published API contract

The stable API specification must define all of the following.

| Area | What the specification must define |
| --- | --- |
| Registration and discovery | How a translator is registered, identified, and discovered |
| Capability declaration | How inbound/outbound support and supported external systems are advertised |
| Message envelope | The canonical WWMWAPI JSON exchange envelope and its relationship to the payload |
| Address mapping | How source and destination addresses are represented and mapped |
| Submission and acceptance | How messages are handed off and how acceptance is acknowledged |
| Delivery status | How pending, accepted, delivered, rejected, and failed states are represented |
| Errors | Machine-readable error codes and recoverability |
| Retries and duplicates | Retry ownership, idempotency, and duplicate detection |
| Security | Authentication, authorization, trust, and secret handling |
| Attachments | Attachment references, transfer, limits, and integrity checks |
| Versioning | API versions, compatibility policy, and deprecation rules |
| Conformance | Test cases and required behavior for compatible implementations |

## 6. Reliability and safety expectations

The final contract should make it possible to distinguish message acceptance by the translator from final delivery by the external system. It should also define how temporary failures, permanent failures, retries, and duplicate submissions are handled.

Translator implementations must validate external input, enforce configured destination mappings, protect credentials, and avoid claiming delivery when only local acceptance has occurred.

## 7. Compatibility

A custom translator is not compatible merely because it can parse a sample message. It must follow the versioned API contract, declare its actual capabilities, and satisfy the published conformance tests.

The Official Translator should use the same public contract available to third-party developers; it should not depend on undocumented privileged behavior.

## 8. Items not yet specified

The following are deliberately left open until the WWMWAPI protocol and integration boundary are designed:

- API base paths and endpoint names
- HTTP methods and request/response schemas
- canonical WWMWAPI JSON envelope schema
- RFC 5322/MIME payload encoding and attachment representation
- WWMWAPI extension metadata schema and namespacing
- authentication and authorization scheme
- translator registration mechanism
- synchronous or asynchronous handoff behavior
- acknowledgement and delivery-state transitions
- retry policy and idempotency mechanism
- exact conformance test suite

Do not treat guessed values for these items as part of the WWMWAPI API.
