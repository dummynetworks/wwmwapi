# Cloudflare Deployment Guide

**Status:** Deployment guide for the current WWMWAPI Node.js foundation. Cloudflare product capabilities and plan requirements can change; verify the linked official documentation before deployment.

This guide is separate from the WWMWAPI protocol specification. It explains how to use Cloudflare alongside a self-hosted WWMWAPI server, especially when the optional `webportrender` feature attempts to bind a local TCP port 25 listener.

## 1. Choose the deployment model first

### Recommended: Node.js origin + Cloudflare DNS

Run WWMWAPI as a normal Node.js process on a VPS, dedicated server, or machine with a publicly reachable network address. Use Cloudflare for DNS management and, optionally, proxy HTTP/HTTPS web/API hostnames.

This is the appropriate model for the current `webportrender` concept because the Node.js process can request a local TCP listening socket from the host operating system.

### Not equivalent: Cloudflare Workers

Workers are not a drop-in host for the current Node.js TCP listener. Workers handle inbound HTTP through `fetch()`; their TCP socket API is for outbound connections, with limited service-binding-based inbound TCP support. Workers cannot open a public arbitrary TCP listener on port 25 like `server.listen(25)` on a Node.js host. Workers also cannot create outbound SMTP connections to port 25 by default.

If the goal is to run the WWMWAPI HTTP API on Workers, that requires a Workers-compatible implementation. It does not provide the current Node.js `webportrender` listener.

References:
- [Workers protocols](https://developers.cloudflare.com/workers/reference/protocols/)
- [Workers TCP sockets](https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/)

## 2. Recommended topology

Use separate hostnames for web/API traffic and mail traffic.

```text
                         Cloudflare DNS
                               |
             +-----------------+-------------------+
             |                                     |
       api.example.com                       mail.example.com
       HTTP / HTTPS                          SMTP / TCP 25
       Proxied (optional)                    DNS only
             |                                     |
       Cloudflare proxy                     Public origin IP
             |                                     |
             v                                     v
       Node.js WWMWAPI API             Node.js WWMWAPI / MX listener
                                             TCP 25
```

The web/API hostname can use Cloudflare's regular HTTP proxy when appropriate. The mail hostname must not use the regular HTTP proxy for SMTP traffic.

## 3. DNS configuration for a self-hosted MX listener

The following values are examples. Replace `example.com` and `ORIGIN_PUBLIC_IP` with values for the actual deployment.

| Type | Name | Target / Content | Proxy status |
| --- | --- | --- | --- |
| A | `mail` | `ORIGIN_PUBLIC_IP` | DNS only |
| MX | `@` | `mail.example.com` (priority 10) | DNS records are DNS only |
| A | `api` | Origin web/API IPv4 address | Proxied, if using HTTP/HTTPS proxy |
| AAAA | `mail` | Origin IPv6 address, only if IPv6 is fully configured | DNS only |

Important:

- An MX record itself is DNS-only. Its target hostname must resolve directly to the mail server address.
- Set the mail hostname's A/AAAA record to **DNS only** (gray cloud).
- Do not point an MX record at a hostname whose only usable address is a Cloudflare HTTP-proxy address.
- Do not enable Cloudflare Email Routing for the same domain unless you intentionally want Cloudflare to manage inbound email routing. Its managed MX records can conflict with a separately operated mail server.
- Keep the mail hostname separate from the proxied website/API hostname.
- DNS-only exposes the origin IP address. Plan network isolation and host security accordingly.

Cloudflare references:
- [Email and DNS troubleshooting](https://developers.cloudflare.com/dns/troubleshooting/email-issues/)
- [Proxy status use cases](https://developers.cloudflare.com/dns/proxy-status/use-cases/)

## 4. What `webportrender` actually checks

When WWMWAPI starts with `webportrender` enabled, the proposed behavior is to ask the host operating system to bind TCP port 25, retry up to the configured attempt limit, and stop retrying after the final failure until the next server restart.

A successful local bind means only:

- the Node.js process obtained a local listening socket;
- the host is listening on the configured interface and port.

It does **not** prove that an external mail server can reach the service. External reachability also depends on:

- host firewall rules;
- router/NAT forwarding, if applicable;
- cloud-provider or ISP inbound TCP 25 policy;
- the DNS records pointing to the right public address;
- the listener binding to an externally reachable interface;
- the SMTP service being correctly implemented and responding.

Treat these as separate states in diagnostics: local bind success and externally verified reachability.

This guide does not change the proposed three-attempt behavior. The exact implementation and configuration remain part of the WWMWAPI server design.

## 5. Cloudflare's regular proxy is not an SMTP proxy

Cloudflare's standard HTTP/HTTPS proxy does not proxy SMTP port 25 by default. If a mail hostname is proxied, mail traffic can be sent to Cloudflare's HTTP proxy addresses instead of the origin mail server, causing delivery failures.

For a normal self-hosted SMTP listener, use DNS-only for the mail hostname.

### Optional advanced path: Cloudflare Spectrum

Cloudflare Spectrum can proxy TCP-based applications, including email traffic, when an appropriate Spectrum application is configured.

Do not assume this is available on every Cloudflare plan. Cloudflare's current plan documentation lists custom TCP/UDP proxying as an Enterprise paid add-on. Check the current plan and account eligibility before designing around Spectrum.

References:
- [Cloudflare Spectrum](https://developers.cloudflare.com/spectrum/)
- [Spectrum protocols per plan](https://developers.cloudflare.com/spectrum/protocols-per-plan/)
- [Spectrum configuration options](https://developers.cloudflare.com/spectrum/reference/configuration-options/)

## 6. Cloudflare Tunnel is not a drop-in public MX endpoint

Cloudflare Tunnel can publish TCP services, but its documented public-hostname TCP flow requires the connecting user/client to run `cloudflared access tcp`. Ordinary external mail servers do not run that client software when delivering mail to an MX record.

Therefore, do not treat a normal Cloudflare Tunnel TCP published-application route as a public SMTP MX endpoint. A different architecture, such as a suitable Spectrum configuration, would be needed for general external TCP mail-server connectivity.

Reference:
- [Cloudflare Tunnel routing](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/)

## 7. Workers and Cloudflare Email Service are different products

Cloudflare Workers can use TCP sockets for outbound connections, but they do not provide a general public inbound TCP server listener for arbitrary mail protocols. Cloudflare documents that outbound TCP port 25 is blocked by default in Workers.

Cloudflare Email Service is a separate managed email product:
- Email Routing can route incoming email to verified destinations or Workers.
- Email Sending provides managed sending options; its SMTP submission endpoint uses port 465 with implicit TLS, not outbound relay on port 25.

These features may be useful for a separately designed translator or integration, but they are not the same as running WWMWAPI's own public TCP 25 listener.

References:
- [Cloudflare Email Routing](https://developers.cloudflare.com/email-service/get-started/route-emails/)
- [Cloudflare Email Sending](https://developers.cloudflare.com/email-service/get-started/send-emails/)
- [Cloudflare SMTP sending](https://developers.cloudflare.com/email-service/api/send-emails/smtp/)

## 8. Deployment checklist

Before claiming that an MX listener is reachable:

- [ ] WWMWAPI runs on a Node.js host that supports TCP servers.
- [ ] `webportrender` is enabled intentionally.
- [ ] Local TCP 25 binding succeeds.
- [ ] The mail hostname is DNS-only.
- [ ] The MX record points to the intended mail hostname.
- [ ] The host firewall permits inbound TCP 25.
- [ ] Any required router/NAT forwarding is configured.
- [ ] The hosting provider or ISP permits inbound TCP 25.
- [ ] A connection test from a network outside the server's own LAN succeeds.
- [ ] The SMTP listener rejects unauthorized relay attempts; it must not be an open relay.
- [ ] TLS, authentication, abuse controls, logging, and mail-domain authentication records are configured before production use.

A local `LISTENING` status must not be reported as "Internet reachable" unless external connectivity has also been tested.

## 9. Scope

This guide covers Cloudflare DNS and network-fronting considerations for a self-hosted Node.js WWMWAPI service. It does not define the WWMWAPI message protocol, the Translator API, or a complete production SMTP implementation.
