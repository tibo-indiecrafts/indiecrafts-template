---
title: "Download token signing"
description: "HMAC-SHA256 signed, expiring download tokens built on Web Crypto, with zero dependencies."
status: stable
---

# Download token signing

> Sign and verify short-lived tokens, never throwing on bad input.

## Purpose

Signs and verifies expiring "gated delivery" tokens using `crypto.subtle` HMAC-SHA256. Web Crypto is a global on both Node 22 and the Workers runtime, so this file has no dependencies and no `node:` import. The secret is always injected by the caller. Token format is `<base64url(payload)>.<base64url(signature)>`.

## Exports

- `signHmac(payload, secret)` — sign an arbitrary JSON-serializable payload.
- `verifyHmac(token, secret)` — verify and decode a `signHmac` token; returns the payload object or `null`. Never throws.
- `signDownloadToken({ assetId, exp }, secret)` — sign a download token; `exp` is a unix millisecond timestamp.
- `verifyDownloadToken(token, secret, now?)` — verify the HMAC and the expiry; returns `{ assetId }` or `null`.

## Usage

```ts
import {
  signDownloadToken,
  verifyDownloadToken,
} from "@indiecrafts/packages-shared-gated-delivery";

const token = await signDownloadToken(
  { assetId: "abc", exp: Date.now() + 3600_000 },
  secret,
);
const payload = await verifyDownloadToken(token, secret); // { assetId: "abc" } or null
```

## Source

`code/packages/shared/gated-delivery/src/token.ts`
