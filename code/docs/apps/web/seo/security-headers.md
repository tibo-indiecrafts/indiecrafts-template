# Security headers & CSP

Security headers are built by the shared **[`@indiecrafts/packages-shared-security`](/packages/security)**
brick. Most of the set — `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy`, COOP, HSTS — still comes from one `securityHeaders({...})` call in
`next.config.ts`'s `headers()` hook, every route (`source: "/:path*"`), no per-page wiring. The
**Content-Security-Policy is different**: `src/proxy.ts` sets it per request, with a nonce (see
[Per-request nonce CSP](#per-request-nonce-csp) below) — `next.config.ts` passes
`cspMode: "proxy"` so `securityHeaders` skips the CSP headers, and adds separate, static
`permissiveCspRule` entries for the two routes the proxy never sees — `/studio` (the embedded
Sanity Studio) and `/maintenance` (the standalone outage page) — so neither is left with no CSP.

`websiteCspHosts` (`src/lib/csp-hosts.ts`) is the **one** `CspHosts` const — `next.config.ts` and
`src/proxy.ts` both import it, so the static `/studio` rule and the per-request proxy policy always
carry the same extra hosts (video embeds, Sanity media, GA):

```ts
// src/lib/csp-hosts.ts
import type { CspHosts } from "@indiecrafts/packages-shared-security";

export const websiteCspHosts: CspHosts = {
  frameSrc: [
    "https://www.youtube-nocookie.com",
    "https://player.vimeo.com",
    "https://www.dailymotion.com",
  ],
  mediaSrc: ["https://cdn.sanity.io"],
  googleAnalytics: true,
  embedHosts: [], // external embed origins (newsletter provider)
};
```

```ts
// next.config.ts
import { getCurrentEnvironment } from "@indiecrafts/packages-shared-config";
import {
  imageDefaults,
  securityHeaders,
  studioCspRule,
  permissiveCspRule,
} from "@indiecrafts/packages-shared-security";
import { websiteCspHosts } from "./src/lib/csp-hosts";

async headers() {
  return [
    ...securityHeaders({
      env: getCurrentEnvironment(),
      csp: websiteCspHosts,
      cspMode: "proxy", // the proxy sets Content-Security-Policy per request instead
      immutablePaths: ["/brand/:path*", "/logo.svg"],
    }),
    // /studio isn't matched by the proxy and can't take a nonce — its own static rule.
    studioCspRule(getCurrentEnvironment(), websiteCspHosts, { endpoint: "/api/csp-report" }),
    // /maintenance is likewise proxy-excluded — without this it would ship NO CSP.
    permissiveCspRule("/maintenance", getCurrentEnvironment(), websiteCspHosts, { endpoint: "/api/csp-report" }),
  ];
}
```

```ts
// src/proxy.ts
import { getCurrentEnvironment } from "@indiecrafts/packages-shared-config";
import {
  generateNonce,
  cspHeadersForMode,
  type CspMode,
} from "@indiecrafts/packages-shared-security";
import { websiteCspHosts } from "./lib/csp-hosts";

const CSP_MODE: CspMode =
  process.env.CSP_MODE === "report-only" ? "report-only" : "enforce";

// per request, inside the middleware pipeline:
const nonce = generateNonce();
const { enforced, reportOnly } = cspHeadersForMode(
  getCurrentEnvironment(),
  websiteCspHosts,
  reporting,
  nonce,
  CSP_MODE,
);
response.headers.set("Content-Security-Policy", enforced);
if (reportOnly)
  response.headers.set("Content-Security-Policy-Report-Only", reportOnly);
```

## The headers

| Header                       | Value                                                                                                                                                                                                                                         | Purpose                                                                                                                                                                                                             |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `X-Content-Type-Options`     | `nosniff`                                                                                                                                                                                                                                     | Stops MIME-type sniffing.                                                                                                                                                                                           |
| `X-Frame-Options`            | `DENY`                                                                                                                                                                                                                                        | Blocks framing (clickjacking) — belt-and-suspenders with CSP `frame-ancestors`.                                                                                                                                     |
| `Referrer-Policy`            | `strict-origin-when-cross-origin`                                                                                                                                                                                                             | Full referrer same-origin, origin-only cross-origin.                                                                                                                                                                |
| `Permissions-Policy`         | `accelerometer=(), bluetooth=(), browsing-topics=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), hid=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), payment=(), serial=(), usb=(), xr-spatial-tracking=()` | Denies every sensor/hardware/payment/privacy feature a marketing+blog site never uses. **Not** locked: `autoplay`/`fullscreen`/`encrypted-media`/`picture-in-picture` — the video embeds (YouTube/Vimeo) need them. |
| `Cross-Origin-Opener-Policy` | `same-origin-allow-popups`                                                                                                                                                                                                                    | Isolates the browsing context; **`allow-popups`** keeps OAuth/share popups (the Sanity Studio login) working.                                                                                                       |
| `Strict-Transport-Security`  | `max-age=31536000; includeSubDomains`                                                                                                                                                                                                         | **Production only.** Forces HTTPS. No `preload` by default (sticky — hard to undo).                                                                                                                                 |
| `Content-Security-Policy`    | see below                                                                                                                                                                                                                                     | The main defense.                                                                                                                                                                                                   |

Plus: `poweredByHeader: false` strips `X-Powered-By`; immutable one-year `Cache-Control` on
`/brand/:path*` + `/logo.svg` (via `immutablePaths`).

## The Content-Security-Policy

`buildCsp(env, csp, reporting, nonce)` composes the directives — hardened defaults baked in, the
app's extras merged per directive. Passing a `nonce` swaps `script-src` to the strict, nonce-gated
policy (see below); without one it's the permissive policy, unchanged from before SP3.

| Directive                   | Value                                                             | Why                                                                                                                                                                               |
| --------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default-src`               | `'self'`                                                          | Same-origin baseline.                                                                                                                                                             |
| `script-src` (no nonce)     | `'self' 'unsafe-inline'` (+ `'unsafe-eval'` dev only) (+ GA host) | The permissive policy — `/studio`'s only policy, and the whole site's while `CSP_MODE=report-only`.                                                                               |
| `script-src` (nonce)        | `'self' 'nonce-<value>' 'strict-dynamic' https: 'unsafe-inline'`  | The strict policy — only the nonced script (and anything it loads) runs. `https: 'unsafe-inline'` is a CSP-L2 fallback modern browsers ignore once `'strict-dynamic'` is present. |
| `style-src`                 | `'self' 'unsafe-inline'`                                          | Tailwind / inline styles.                                                                                                                                                         |
| `img-src`                   | `'self' data: blob: https:`                                       | `next/image`, data/blob URIs, remote HTTPS images.                                                                                                                                |
| `media-src`                 | `'self' blob:` (+ `cdn.sanity.io`)                                | Uploaded featured videos (Sanity file assets).                                                                                                                                    |
| `font-src`                  | `'self' data:`                                                    | Self-hosted `next/font` + data-URI fonts.                                                                                                                                         |
| `connect-src`               | `getCSPConnectSources(env)` (+ GA beacons + embeds)               | XHR/fetch/WebSocket targets.                                                                                                                                                      |
| `frame-src`                 | `'self'` (+ the video hosts + embeds)                             | Validated video embeds only.                                                                                                                                                      |
| `frame-ancestors`           | `'none'`                                                          | Nobody may frame this site.                                                                                                                                                       |
| `base-uri`                  | `'self'`                                                          | Blocks `<base>` hijacking.                                                                                                                                                        |
| `form-action`               | `'self'` (+ embeds)                                               | Forms submit same-origin (or a whitelisted embed host).                                                                                                                           |
| `upgrade-insecure-requests` | (production)                                                      | Auto-upgrades any `http:` subresource.                                                                                                                                            |

### `connect-src` is environment-aware (still in `@indiecrafts/packages-shared-config`)

The `connect-src` base is `getCSPConnectSources(env)` in `@indiecrafts/packages-shared-config` — the brick imports it,
it did **not** move:

```ts
export function getCSPConnectSources(env: Environment): readonly string[] {
  const sanity = ["https://*.sanity.io", "wss://*.api.sanity.io"];
  const npm = ["https://registry.npmjs.org"];
  const common = ["'self'", ...sanity, ...npm];
  if (env === "development" || env === "test") {
    return [...common, "ws://localhost:*", "http://localhost:*"];
  }
  return common;
}
```

- **`*.sanity.io` + `wss://*.api.sanity.io`** — the embedded Studio + live preview reach the project
  API + CDN (the WebSocket carries realtime). Locked to `*.sanity.io` → safe in prod.
- **`registry.npmjs.org`** — the Studio's own version check.
- **Dev/test extras** — localhost (HMR), outside production only.

`env` comes from `getCurrentEnvironment()` (the same helper that gates `robots.txt`). See
[Robots & environments](./robots-and-environments.md).

## CSP violation reporting

Reporting is on: `reporting.endpoint: "/api/csp-report"` adds a `Reporting-Endpoints:
csp-endpoint="/api/csp-report"` header and a `report-to`/`report-uri` clause on every
`Content-Security-Policy` (proxy-set and the `/studio` static rule alike). The browser POSTs
violations to that same-origin route.

The route (`src/app/api/csp-report/route.ts`) is thin — it delegates to
**[`handleCspReport`](/packages/security-reports)** (`@indiecrafts/packages-web-security-reports/handle`),
which accepts only the CSP content-types, caps the body, **rate-limits per client IP** (30/min,
defence-in-depth on the anonymous sink — no-ops without `RATE_LIMIT_KV`, the CF WAF rule on `/api/*`
is primary), sanitizes each report, and forwards survivors to the api's `POST /v1/events`
(`kind: "csp-report"`). No auth on the route itself — the handler is the trust boundary, and it
always answers `204` (or `429` when the IP is over the limit).

## Per-request nonce CSP

`src/proxy.ts` generates a fresh nonce **per request** (`generateNonce()`) and stamps the response
with `cspHeadersForMode(env, csp, reporting, nonce, CSP_MODE)` — the enforced/Report-Only pair for
the mode set by the `CSP_MODE` env var:

| `CSP_MODE`          | Enforced `Content-Security-Policy`                         | `Content-Security-Policy-Report-Only`                                 |
| ------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------- |
| `enforce` (default) | the strict nonce policy                                    | none                                                                  |
| `report-only`       | the permissive policy (unchanged — the site keeps working) | the strict nonce policy — violations are observed, nothing is blocked |

The nonce reaches every inline script that needs it via the `x-nonce` request header, set on the
request before it's handed to next-intl/the route so a server component can read it with
`(await headers()).get("x-nonce")`: the root layout passes it to `AppClerkProvider`, and (website
only) the `[locale]` layout passes it to the Google Analytics `<Script>` tags. Next.js also
auto-nonces its own inline bootstrap scripts once it sees a nonce in the CSP header — no extra
wiring needed for those.

**`/studio` and `/maintenance` stay permissive.** The proxy matcher excludes both. The embedded
Sanity Studio can't take a per-request nonce (it needs `'unsafe-inline'`, always); `/maintenance` is
a standalone static page with no nonce. `next.config.ts` gives each its own `permissiveCspRule`
(`studioCspRule` is the `/studio` shorthand), reproducing the pre-nonce policy exactly — so
neither route ships without a CSP. (When maintenance mode is _on_, the proxy still stamps the nonce
CSP on the internal rewrite to `/maintenance`; the static rule only covers a direct hit.)

**Default: `CSP_MODE` unset → `enforce`.** The strict nonce policy is the enforced
`Content-Security-Policy` out of the box — no separate Report-Only rollout step needed for a new
surface.

**Also in the proxy: bfcache repair.** On the same responses it stamps the CSP, `src/proxy.ts`
swaps Next's dynamic `Cache-Control: no-store` for `no-cache` on **top-level HTML navigations**
(`Sec-Fetch-Dest: document`) — `no-store` disables the browser back/forward cache entirely, while
`no-cache` still revalidates every request but lets bfcache restore instantly. It's scoped by
`Sec-Fetch-Dest`, so RSC prefetches and the feed/`llms.txt` route handlers (which stay CDN-cacheable)
keep Next's own caching. Purely a navigation-perf win; no security effect.

### Rollback: flip a surface back to Report-Only

`CSP_MODE` is a **runtime** Worker var (read by `src/proxy.ts` at request time, not baked at build),
set per environment under `[env.<env>.vars]` in each surface's `wrangler.toml`. It's unset by
default, so the surface enforces. To roll a surface back to observe-only — the site keeps working on
the permissive policy while the strict policy drops to `Content-Security-Policy-Report-Only`, so a
script missing the nonce, an inline handler, or a third-party tag lands at `/api/csp-report` instead
of being blocked — set `CSP_MODE=report-only` for that surface. Two ways:

**Fast (during an incident) — Cloudflare dashboard, no redeploy.** Workers & Pages → the env's
worker (e.g. `indiecrafts-prod-web-surfaces-website`) → **Settings → Variables and Secrets** → add
`CSP_MODE` = `report-only` → **Save**. It applies to new requests within seconds. `keep_vars = true`
in the toml means a later deploy won't wipe it. Repeat per affected surface (`…-web-surfaces-admin`,
`…-web-surfaces-app`).

**Durable (the version-controlled record) — commit + redeploy.** Add the var under the right env
block in that surface's `wrangler.toml`, then deploy:

```toml
# code/projects/web/surfaces/website/wrangler.toml
[env.prod.vars]
NEXT_PUBLIC_ENVIRONMENT = "production"
CSP_MODE = "report-only"   # roll back to observe-only; remove (or "enforce") to re-enforce
```

```bash
pnpm deploy:web:website:prod     # or :admin / :app · or let CI deploy from main
```

Do this even after a dashboard hotfix, so the repo matches what's live. **To re-enforce**, remove
`CSP_MODE` (or set `enforce`) the same way and redeploy.

**Verify either way:** reload the surface with the DevTools console open — no CSP-block errors — and
watch the admin **`/csp`** dashboard: `disposition: report` rows are the (now non-blocking)
violations to fix before flipping back to `enforce`.

Proven end-to-end by `e2e/journeys/csp-nonce.spec.ts` (website, the default `enforce` mode the
server actually runs in CI/local): the enforced header carries `'strict-dynamic'` and a `nonce-…`
token, that same nonce is on a `<script>` in the served HTML, no CSP violation fires on the home
page, no `Content-Security-Policy-Report-Only` header is present, and `/studio` still carries the
permissive, non-`'strict-dynamic'` policy. That spec is a **blocking** CI gate (the `csp` job in
`.github/workflows/test.yml`) — since enforce is the live default, a broken nonce pipeline fails the
PR rather than silently shipping. It runs on its own (a real browser + built app), split from the
advisory `browser` job so the untrusted visual baselines don't gate on it.

## Trusted Types (opt-in Report-Only trial)

DOM-based XSS lands through unsafe sink assignments (`element.innerHTML = …`, `eval`, …). A
`require-trusted-types-for 'script'` CSP directive forces those sinks to receive a `TrustedScript`
built by a registered policy — a strong, structural anti-DOM-XSS layer the nonce policy can't provide.

It's **off by default** and offered as a **Report-Only trial**, because React/Next and third-party
libs (Clerk, GA) don't all use Trusted Types yet — enforcing would break them today. Set
`CSP_TRUSTED_TYPES=report` on a surface and, in **enforce** mode, the proxy fills the otherwise-unused
Report-Only slot with `require-trusted-types-for 'script'` pointed at `/api/csp-report`. It **reports,
never blocks** — so you learn which sinks/libraries would violate it before ever enforcing. Chrome/Edge
only (Firefox/Safari ignore the directive). Reports arrive under a distinct directive, so they stay
separable from the nonce-CSP violations in the `/csp` dashboard.

Mechanically it's `buildTrustedTypesReportOnly(reporting)` in `@indiecrafts/packages-shared-security`,
gated by `reporting.trustedTypesReportOnly` and wired into `cspHeadersForMode`'s enforce branch. The
trial is enforce-mode only — in `report-only` mode that slot already carries the strict nonce policy.

## Hardening — and why it's Sanity-Studio-safe

- **HSTS** ships **production only** (never localhost). No `preload` by default — preload is
  near-irreversible; opt in with `hsts: { preload: true }`.
- **COOP** = `same-origin-allow-popups` **on purpose**: the Studio login opens an OAuth popup, and
  plain `same-origin` would break it.
- **COEP + CORP are deliberately skipped** — they break the Studio's web workers + cross-origin Sanity
  CDN resources.
- After a headers change, smoke-test `/studio` — login (popup), content load, and save.

## Extending the CSP for a new external service

- **API / analytics / fetch target:** add the host to `getCSPConnectSources()` in `@indiecrafts/packages-shared-config`
  (keeps the dev/prod split), or pass `csp.connectSrc: [...]` for an app-only host.
- **Embedded iframe (video, widget):** add the origin to `csp.frameSrc` in the `securityHeaders({...})`
  call. Update `parseVideoEmbed`/`HeroVideo` too if it's a video host.
- **Editor-pasted embed (custom-html provider form):** add the origin to `EMBED_HOSTS` — it lands in
  `script-src` + `connect-src` + `frame-src` + `form-action`. See [Newsletter](/modules/newsletter/).
- **Remote images:** add the host to `imageDefaults.remotePatterns` (in the brick) — `img-src` already
  allows any `https:`.

::: tip Google Analytics hosts are always allowed
`csp.googleAnalytics: true` adds Google's script + beacon hosts to `script-src` + `connect-src`
unconditionally — the measurement id lives in Sanity (a runtime value the build-time CSP can't read),
so no manual edit per GA change. Harmless when GA is off. See [Analytics](./analytics.md).
:::
