---
title: "No-login preference token"
description: "Signs and verifies the HMAC token that opens the preference centre from an email link without a session."
status: stable
---

# No-login preference token

> A signed, expiring token that stands in for a Clerk session on email-preference links.

## Purpose

Lets an email link open the preference centre for a user with no active session. Built on `signHmac`/`verifyHmac` from `@indiecrafts/packages-shared-gated-delivery`. Low-sensitivity, marketing-prefs scope only: the payload carries no PII beyond the user id.

## Exports

- `PREF_TOKEN_TTL_MS` — the token lifetime constant (1 year in milliseconds).
- `signPrefToken(secret, uid, cat?, now?)` — mints a token whose payload carries `uid`, an optional category `cat`, and a 1-year `exp`.
- `verifyPrefToken(secret, token, now?)` — verifies a token; enforces `exp` when present, treats a legacy token without `exp` as valid, and returns `{ uid, cat? }` or `null`.

## Usage

```ts
import {
  signPrefToken,
  verifyPrefToken,
} from "@indiecrafts/api/consent/pref-token";

const token = await signPrefToken(env.EMAIL_PREF_SECRET, userId, "news");
const claims = await verifyPrefToken(env.EMAIL_PREF_SECRET, token);
// claims === { uid: userId, cat: "news" } or null
```

## Source

`code/shared/api/src/consent/pref-token.ts`
