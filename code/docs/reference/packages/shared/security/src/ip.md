---
title: "IP validation"
description: "Validate and sanitise a client IP from attacker-controlled proxy headers before it is trusted."
status: stable
---

# IP validation

> Validate and sanitise a client IP before it keys a limiter, log, or store.

## Purpose

Client-IP helpers. Proxy headers such as `x-forwarded-for` are attacker-controlled, so a value read from them must be validated before it keys a rate-limiter, a log line, or a store. Zero-dependency and safe in the Edge/Workers runtime. Validates both IPv4 and IPv6, including compressed and embedded-IPv4 forms.

## Exports

- `isValidIpAddress(ip)` — true when `ip` is a syntactically valid IPv4 or IPv6 address.
- `sanitizeIpAddress(ip)` — trim and validate; returns the address or `null`.
- `extractIpFromHeadersList(headersList)` — the first client IP from proxy headers, or `"unknown"` (not validated; pass through `sanitizeIpAddress`).

## Usage

```ts
import { sanitizeIpAddress } from "@indiecrafts/packages-shared-security/ip";

const ip = sanitizeIpAddress(req.headers.get("cf-connecting-ip")) ?? "unknown";
```

## Source

`code/packages/shared/security/src/ip.ts`
