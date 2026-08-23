# Security headers (CSP · headers · image allowlist)

The hardened HTTP-header baseline every app shares — the **CSP builder**, the security header set
(HSTS, COOP, X-Frame, Referrer, Permissions), immutable cache-control, and the Next **image
allowlist**. Lives in the **`@indiecrafts/packages-shared-security`** brick (`code/packages/shared/security`),
consumed as source. Pure TS (no React/Next imports); dep: `@indiecrafts/packages-shared-config`.

Extracted from `next.config.ts` so a second app reuses the hardening and passes only its own hosts.
**It composes `@indiecrafts/packages-shared-config`, it doesn't replace it** — `getCurrentEnvironment` +
`getCSPConnectSources` stay in config; the brick imports them.

## Exports

| Import                                                                                                                        | What it is                                                                                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `buildCsp(env, csp?, reporting?)` / `buildReportOnlyCsp(env, csp?, reporting)` (`./csp`)                                      | The CSP string. Hardened defaults + `connect-src` from `getCSPConnectSources(env)`. Clerk hosts are auto-added from `getClerkCspHosts()` (derived from `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, empty when unset). App extras via `CspHosts` (`frameSrc`, `mediaSrc`, `embedHosts`, `googleAnalytics`, …). `reporting` (`CspReporting`) appends `report-to`/`report-uri`; `buildReportOnlyCsp` builds the stricter `Content-Security-Policy-Report-Only` candidate, `null` if `reporting.reportOnly` is unset — see [CSP violation reporting](#csp-violation-reporting).                                                                                                    |
| `securityHeaders(opts)` (`./headers`)                                                                                         | The full Next `headers()` array — the security set + CSP (+ HSTS/COOP in prod) + immutable `Cache-Control` on `immutablePaths`. `opts.reporting` adds the `Reporting-Endpoints` header + the Report-Only candidate.                                                             |
| `imageDefaults` / `imageRemotePatterns` (`./images`)                                                                          | The Next image allowlist (`images.unsplash.com` + `cdn.sanity.io`) + formats + 1-year TTL. Spread into `images`.                                                                                                                                                                 |
| `normalizeCspReports` / `sanitizeCspReport` / `collapseRoute` / `isExtensionNoise` (`./csp-report`)                           | Pure, framework-free CSP report parsing — collapses the two browser report shapes, drops browser-extension noise, collapses dynamic route segments (`/orders/:id`), redacts snippets. Consumed by the route glue in [`security-reports`](./security-reports); see there for the full pipeline. |
| `isValidIpAddress` / `sanitizeIpAddress` / `extractIpFromHeadersList` (`./ip`)                                                | Validate + sanitize a client IP (thorough IPv4/IPv6) before it is trusted. `withGuard`'s `clientIp` now runs the trusted `cf-connecting-ip` / first `x-forwarded-for` hop through `sanitizeIpAddress`, so a spoofed header can't poison the rate-limit key. Zero-dep, Edge-safe. |
| `encrypt` / `decrypt` / `encryptObject` / `decryptObject` / `hashIpAddress` / `verifyIpHash` / `isEncryptedData` (`./crypto`) | AES-256-GCM (with integrity tag) + salted SHA-256, on **Web Crypto** (`crypto.subtle`) — zero-dep, runs on Node 22 **and** Workers, all async. The secret/salt is injected by the caller (no keys in the brick). For at-rest PII + GDPR IP-hashing.                              |

## Using it (`next.config.ts`)

```ts
import { getCurrentEnvironment } from "@indiecrafts/packages-shared-config";
import { imageDefaults, securityHeaders } from "@indiecrafts/packages-shared-security";

const EMBED_HOSTS: string[] = []; // app knob — external embed origins (newsletter provider)

const nextConfig = {
  images: { ...imageDefaults, loaderFile: "./src/lib/sanity-image-loader.ts" },
  async headers() {
    return securityHeaders({
      env: getCurrentEnvironment(),
      csp: {
        frameSrc: [
          "https://www.youtube-nocookie.com",
          "https://player.vimeo.com",
          "https://www.dailymotion.com",
        ],
        mediaSrc: ["https://cdn.sanity.io"],
        googleAnalytics: true,
        embedHosts: EMBED_HOSTS,
      },
      immutablePaths: ["/brand/:path*", "/logo.svg"],
    });
  },
};
```

## What ships on every response

`X-Content-Type-Options: nosniff` · `X-Frame-Options: DENY` · `Referrer-Policy:
strict-origin-when-cross-origin` · `Permissions-Policy: camera=(), microphone=(), geolocation=()` ·
`Content-Security-Policy` · `Cross-Origin-Opener-Policy` · **`Strict-Transport-Security`
(production only)**.

## CSP violation reporting

Pass `reporting: { endpoint, reportOnly? }` (`CspReporting`, `./csp`) to `securityHeaders` to turn on
browser CSP reporting. It adds a `Reporting-Endpoints` header plus `report-to`/`report-uri` to the
enforced CSP. Add `reportOnly: { dropSources?, dropUnsafeEval? }` and `securityHeaders` also emits a
`Content-Security-Policy-Report-Only` header — the enforced policy minus `dropSources` (and
`unsafe-eval`, dropped by default) — so a stricter candidate can be tried without blocking anything.
`buildCsp` alone (without `securityHeaders`) only appends `report-to`/`report-uri` to the CSP string —
it never emits `Reporting-Endpoints`. See [Security headers](../apps/web/seo/security-headers) for the
full `next.config.ts` example and the rollout story.

The route side — parsing what the browser POSTs, sanitizing it, and forwarding it on — is the
sibling [`security-reports`](./security-reports) brick; the pure parsing it calls
(`normalizeCspReports`, `sanitizeCspReport`, `collapseRoute`, `isExtensionNoise`) lives here, in
`./csp-report`.

## Hardening — and why it's Sanity-Studio-safe

- **HSTS** — production only (never localhost). `max-age=1y; includeSubDomains`, **no `preload`** by
  default (preload is near-irreversible; opt in with `hsts: { preload: true }`). Sticky: browsers cache
  it, so a bad value is hard to undo — only ships in prod over HTTPS.
- **COOP** — `same-origin-allow-popups` by default. `allow-popups` is deliberate: the embedded Sanity
  **Studio login opens an OAuth popup**, and `same-origin` (no popups) would break it. Override to
  `same-origin` / `false` if you have no popups.
- **`upgrade-insecure-requests`** — added to the production CSP.
- **Skipped:** COEP + CORP — they break the Studio's web workers + cross-origin Sanity CDN resources.
  `img-src` stays `https:`-permissive for editor-embedded images (tighten to specific hosts if you
  don't allow arbitrary embeds).

## Request-side guard (public POSTs)

Beyond the response headers, the brick ships the **request-boundary** hardening every public form POST
adopts:

| Import | What it is |
| --- | --- |
| `withGuard(handler, opts)` (`./guard`) | Wraps a POST handler: same-site **origin** check (fail-closed) → **body cap** → optional KV **rate-limit** → optional **Turnstile** → single JSON parse. `opts` = `{ origin?, bodyMax?, rateLimit?: {limit, windowSec}, turnstile? }`. Also exports `clientIp(req)` — the trusted `cf-connecting-ip` / `x-forwarded-for` derivation — for a route that can't adopt `withGuard` but still wants to key `rateLimit`. |
| `rateLimit(key, limit, windowSec)` (`./rate-limit`) | Fixed-window limiter on the `RATE_LIMIT_KV` binding. **Fails open** when the binding is unbound (the CF WAF `/api/*` rule is primary). |
| `verifyTurnstile(token, ip?)` (`./turnstile`) | Cloudflare siteverify. **No-ops (passes)** until `TURNSTILE_SECRET` is set; fails closed once it is. |

The per-route limits (`rateLimit`, `bodyMax`, `turnstile`) are **not** inline in each route — they live
in one app-owned config, [`src/config/security.ts`](../apps/web/config/security-limits), passed in as
`withGuard(handler, security.<name>)`.

### Enforcing adoption — `verify:api-guards`

`pnpm verify:api-guards` (in `pnpm verify` + CI — see [Scripts](../apps/web/setup/scripts)) scans every
`src/app/**/route.ts` and **fails** if a mutating handler (POST/PUT/PATCH/DELETE) neither wraps
`withGuard` nor is allowlisted with its reason (a capability token, a Bearer session) in
`code/shared/scripts/checks/api-guards.mjs`. So a new public POST can't ship unguarded by accident.
GET handlers are exempt (`withGuard` is form-POST hardening).

## Not Sanity

This is **build config** — no editor/Sanity fields (config-first). The GA measurement ID is edited in
Sanity, but its CSP hosts are allowed at build time (`googleAnalytics: true`) since the build can't
read a runtime value.
