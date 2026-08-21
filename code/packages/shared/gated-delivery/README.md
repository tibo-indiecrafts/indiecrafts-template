# @indiecrafts/packages-shared-gated-delivery

A stateless, signed-token gated-delivery brick. It hands out a one-time-ish download
link that only a verified request can open. It knows nothing about Sanity, newsletters,
or subscribers — the consumer injects the secret and the asset lookup.

Pure **Web Crypto** (`crypto.subtle`, HMAC-SHA256) — zero dependencies, no `node:`
imports, runs on Node 22 **and** the Workers runtime. Every function is async. The
secret is always injected by the caller (no keys in the brick).

Token format: `<base64url(json payload)>.<base64url(hmac signature)>`.

## API

| Import                                                       | What it does                                                                                                                                                      |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `signDownloadToken({ assetId, exp }, secret)`                | Sign a token. `exp` is a unix **ms** timestamp. Returns the token string.                                                                                         |
| `verifyDownloadToken(token, secret, now?)`                   | Recompute + constant-time compare the HMAC, check `exp > now`. Returns `{ assetId }` or `null`. Never throws — any malformed input is `null`. `now` is for tests. |
| `resolveGatedDownload(token, secret, resolveAssetUrl, now?)` | Verify, then call `resolveAssetUrl(assetId)`. `{ ok: true, url }` on success; `{ ok: false, status: 403 }` on a bad token or a falsy resolved URL.                |

## Ceilings (`ponytail:`)

- **Signed + expiring, NOT single-use.** The same token opens the link until `exp`. Add
  a consumed-token store (KV/DB) for single-use only if abuse appears.
- **Gates link _discovery_, not the asset object.** A public CDN URL is still public once
  known — serve private assets behind signed CDN/R2 URLs.

**Consumed by:** `modules/newsletter` (lead-magnet delivery).
