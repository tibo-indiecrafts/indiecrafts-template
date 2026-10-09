---
title: "Gated delivery (signed download links)"
description: "A pure, framework-agnostic brick that hands out gated file links — a URL that only a verified request can open."
status: stable
---

# Gated delivery (signed download links)

A pure, framework-agnostic brick that hands out **gated file links** — a URL that only a
verified request can open. Used to deliver a **lead magnet** after a subscriber confirms
their e-mail. Lives in **`@indiecrafts/packages-shared-gated-delivery`** (`code/packages/shared/gated-delivery`),
consumed as source. Pure TypeScript on **Web Crypto** — zero dependencies, no React/Next,
runs on Node 22 **and** the Workers runtime.

The package holds no keys and knows nothing about Sanity, subscribers, or e-mail — the
consumer injects the secret and the asset resolver.

## Exports

| Import                                                       | What it is                                                                                                                           |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `signDownloadToken({ assetId, exp }, secret)`                | Sign an expiring token (HMAC-SHA256). `exp` is a unix-ms timestamp. Returns `<base64url(payload)>.<base64url(sig)>`.                 |
| `verifyDownloadToken(token, secret, now?)`                   | Verify the signature (constant-time) + `exp`. Returns `{ assetId }` or `null` — never throws on malformed input. `now` is for tests. |
| `resolveGatedDownload(token, secret, resolveAssetUrl, now?)` | Route helper: verify, then call `resolveAssetUrl(assetId)`. Returns `{ ok: true, url }` or `{ ok: false, status: 403 }`.             |

## Using it

```ts
import {
  signDownloadToken,
  resolveGatedDownload,
} from "@indiecrafts/packages-shared-gated-delivery";

// 1. On confirm — sign a 7-day link and e-mail it.
const token = await signDownloadToken(
  { assetId: magnet._id, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 },
  process.env.NEWSLETTER_SECRET!,
);
const url = `${site.url}/api/download?token=${encodeURIComponent(token)}`;

// 2. In the /download route — verify, then resolve the file URL.
const result = await resolveGatedDownload(token, secret, (id) =>
  getAssetUrl(id),
);
if (!result.ok) return new Response("forbidden", { status: 403 });
// Stream, don't redirect: a redirect hands out the permanent file URL, so the
// token's expiry would no longer protect anything.
return new Response((await fetch(result.url)).body);
```

The lead-magnet wiring lives in the newsletter module
(`code/modules/web/newsletter/src/lib/deliver-magnet.ts`); the app route is
`code/projects/web/surfaces/website/src/app/api/download/route.ts`.

## Ceilings (deliberate)

- **Signed + expiring, not single-use.** A valid token works until `exp`. Add a consumed-token
  store if link-sharing abuse appears.
- **Gates link _discovery_, not the object.** The resolved URL is a public Sanity CDN URL —
  the token stops an unconfirmed visitor from _finding_ the link, it does not make the file
  itself private. For a truly private asset, back it with a signed CDN / R2 URL.

## Config

The consumer picks the HMAC key; the newsletter module uses `NEWSLETTER_SECRET` (server-only, never `NEXT_PUBLIC_`), the same key as its confirm link. Unset → no token can
be signed or verified, so delivery is off. Generate with `openssl rand -hex 32`; keep it stable
(rotating invalidates live links).
