# @indiecrafts/gated-delivery — signed, expiring download links

**Stack:** TypeScript. Pure **Web Crypto** (`crypto.subtle`, HMAC-SHA256), framework-agnostic
(no React/Next imports), zero deps, runs on Node 22 + Workers. All async. Domain · agnostic.
The secret is injected by the caller — no keys in the brick.

Auto-loads under `code/packages/shared/gated-delivery/**`. Single `.` export (`./src/index.ts`).

- **`signDownloadToken({ assetId, exp }, secret)`** — sign a token; `exp` is unix **ms**.
  Returns `<base64url(payload)>.<base64url(sig)>`.
- **`verifyDownloadToken(token, secret, now?)`** — recompute + constant-time compare the HMAC,
  check `exp > now`. Returns `{ assetId }` or `null`. **Never throws** — any malformed input
  (missing dot, bad base64, non-JSON, wrong shape, bad signature, expired) is `null`. `now` is for tests.
- **`resolveGatedDownload(token, secret, resolveAssetUrl, now?)`** — verify, then resolve the
  asset URL via the injected lookup. `{ ok: true, url }` or `{ ok: false, status: 403 }`.

**Ceilings** (`ponytail:` in `token.ts`):

- Signed + expiring, **NOT single-use** — add a consumed-token store for single-use if abuse appears.
- Gates link **discovery**, not the asset object — a public CDN URL is still public; private assets
  need signed CDN/R2 URLs.

**Consumed by** `newsletter` for lead-magnet delivery.
