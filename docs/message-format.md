# WWMWAPI Message Format (Draft)

**Status: Architectural decision recorded; wire format not finalized.**

## 1. Selected direction

WWMWAPI will use a hybrid message representation:

1. a WWMWAPI-defined JSON exchange envelope;
2. an RFC 5322 / MIME message payload;
3. WWMWAPI-defined extension metadata.

This combines an HTTP-native, WWMWAPI-controlled exchange protocol with an established Internet message representation.

This document records the chosen direction only. It does not define a stable JSON schema or a finalized wire format.

## 2. Keep the layers distinct

### 2.1 HTTP transport

HTTP is the native peer-to-peer transport. A sender uses `fetch()` to submit an exchange request, and a receiving server processes the incoming `Request` and returns a `Response`.

HTTP method, path, status code, headers, and request body rules will be specified by the WWMWAPI protocol.

### 2.2 WWMWAPI JSON exchange envelope

The envelope belongs to WWMWAPI. It is responsible for protocol-level information such as:

- exchange operation and protocol version;
- sender and recipient routing context;
- peer identity and relevant authentication context;
- message payload identification or encapsulation;
- WWMWAPI-specific extension metadata;
- exchange acknowledgement and control information.

This is a list of responsibilities, not a field-level schema. No JSON property names or mandatory field layout have been finalized.

### 2.3 RFC 5322 / MIME message payload

The payload uses the established Internet message representation:

- RFC 5322 Internet Message Format for message headers and body framing;
- MIME for structured body content, media types, multipart messages, and attachments.

The use of this payload format does not mean WWMWAPI uses SMTP. The transport and exchange protocol remain HTTP-native and WWMWAPI-defined.

### 2.4 WWMWAPI extension metadata

WWMWAPI may define extension metadata for features that do not naturally belong in standard Internet message fields.

Extension metadata must be explicitly identified and namespaced. It must not silently change the meaning of standard RFC 5322 or MIME fields.

## 3. Terminology

- **MX** refers to the DNS Mail Exchange record and associated mail-routing concept.
- **SMTP** is a mail transfer protocol.
- **RFC 5322** defines Internet Message Format.
- **MIME** extends Internet message formatting for structured content and attachments.
- **WWMWAPI Envelope** is the protocol-level JSON structure used by WWMWAPI.
- **Payload** is the RFC 5322/MIME message carried by a WWMWAPI exchange.

MX is not itself a message format.

## 4. Translator responsibilities

The Translator extension bridges WWMWAPI and other mail systems.

For traditional SMTP/MX interoperability, the translator must map between:
- the WWMWAPI HTTP exchange and JSON envelope;
- the RFC 5322/MIME payload;
- the SMTP transaction envelope and remote mail-routing behavior.

These are separate concepts. In particular, SMTP envelope sender/recipient information is not identical to the visible RFC 5322 `From:` and `To:` message headers. A correct translator must preserve and map both where applicable.

The translator may support inbound, outbound, or bidirectional operation. The Official Translator is recommended, but independent translators remain allowed if they implement the published Translator API.

## 5. Preservation and compatibility considerations

The design should preserve the conventional message payload wherever possible. Rewriting headers or body content can affect DKIM signatures and other message-level security mechanisms. Any transformation rules must state when signatures remain valid, when they may be invalidated, and how that is reported.

The WWMWAPI envelope must not be confused with or substituted for the SMTP transaction envelope.

## 6. Decisions still open

The following must be specified before the wire format is stable:

- exact JSON envelope schema and required fields;
- message and envelope versioning;
- whether the MIME payload is carried as raw bytes, encoded data, or another defined representation;
- maximum message and attachment sizes;
- treatment of binary data and streaming;
- extension namespace and collision rules;
- relationship between WWMWAPI routing addresses and RFC 5322 headers;
- signature preservation and transformation rules;
- acknowledgement and error semantics;
- compatibility and conformance tests.

Until these are resolved and published in a versioned specification, implementations must treat the hybrid model as a draft architectural direction.
