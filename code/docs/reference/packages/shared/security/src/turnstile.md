---
title: "Turnstile verify"
description: "Verify a Cloudflare Turnstile token; opt-in, passing when unconfigured and failing closed once enabled."
status: stable
---

# Turnstile verify

> Opt-in Cloudflare Turnstile verification against the siteverify API.

## Purpose

Verify a Cloudflare Turnstile token against the siteverify API. It is opt-in: when `TURNSTILE_SECRET` is unset the verify passes, so the per-engine honeypot stays the bot defense. Once the secret is set, a verify error fails closed. The public site key is `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; the secret never leaves the server. Server-only.

## Exports

- `verifyTurnstile(token, ip?)` — verify a token; passes when unconfigured, fails closed on error when configured.
- `turnstileEnabled()` — whether a Turnstile widget should render (public site key present).

## Usage

```ts
import { verifyTurnstile } from "@indiecrafts/packages-shared-security/turnstile";

if (!(await verifyTurnstile(token, ip))) {
  return new Response("challenge", { status: 403 });
}
```

## Source

`code/packages/shared/security/src/turnstile.ts`
