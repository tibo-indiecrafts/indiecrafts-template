# `@indiecrafts/packages-shared-security` — CSP · headers · request guard · crypto

**Stack:** TypeScript. Pure, framework-agnostic (no React/Next imports). Two sides: **response** —
header **strings + arrays** an app's `next.config.ts` consumes; **request** — a route wrapper the
public form routes consume. Domain · server. Dep: `@indiecrafts/packages-shared-config`.

Auto-loads under `code/packages/shared/security/**`. Subpath-only (explicit-extension `exports` → no
tsconfig `paths`).

- **`buildCsp(env, csp?, reporting?, nonce?)`** (`./csp`) — the CSP string. Hardened defaults baked
  in; `connect-src` base comes from the existing config helper **`getCSPConnectSources(env)`**
  (Sanity + npm + dev). App passes extras via `CspHosts` (`frameSrc`, `mediaSrc`, `embedHosts`,
  `googleAnalytics`, …). Pass `nonce` and `script-src` becomes the strict, nonce-gated policy
  (`'nonce-<value>' 'strict-dynamic'`) instead of the permissive `'unsafe-inline'` one.
- **`generateNonce()` / `cspHeadersForMode(env, csp, reporting, nonce, mode)`** (`./csp-nonce`) — the
  per-request nonce pair for a proxy/middleware: `generateNonce()` is a base64 16-byte nonce (Web
  Crypto); `cspHeadersForMode` returns `{ enforced, reportOnly }` for a `CspMode` of `"enforce"`
  (strict nonce policy enforced, no Report-Only) or `"report-only"` (permissive policy stays
  enforced — site keeps working — strict nonce policy ships Report-Only). The rollout knob apps read
  as `CSP_MODE` (env, default `report-only`).
- **`securityHeaders(opts)`** (`./headers`) — the full Next `headers()` array: `nosniff` · `X-Frame
DENY` · `Referrer-Policy` · `Permissions-Policy` · `CSP` · **HSTS** (prod only) · **COOP** + immutable
  `Cache-Control` on `immutablePaths`. `opts.cspMode: "proxy"` (default `"static"`) drops
  `Content-Security-Policy`/`Reporting-Endpoints`/Report-Only from the array — a proxy sets them
  per-request instead; every other header is unchanged.
- **`studioCspRule(env, csp?, reporting?)`** (`./headers`) — one static `HeaderRule` scoped to
  `/studio/:path*`, reproducing the pre-nonce permissive CSP exactly — for a route (the embedded
  Sanity Studio) that a proxy doesn't cover and can't take a nonce.
- **`imageDefaults` / `imageRemotePatterns`** (`./images`) — the Next image allowlist (unsplash +
  `cdn.sanity.io`) + formats + TTL. Spread into `images`.

**Request side — the public form routes.**

- **`withGuard(handler, opts)`** (`./guard`) — the route wrapper for the newsletter/waitlist/comment
  POST routes: same-site **origin** check + **body-cap** + KV **rate-limit** + optional **Turnstile**
  verify, then the handler. Runs the trusted client IP through `./ip` before it keys the limiter.
- **`isSameSiteRequest`** (`./origin`), **`verifyTurnstile`** (`./turnstile`), IP validators
  (`./ip` — `sanitizeIpAddress` etc.) — the guard's parts, exported for direct use.
- **`./rate-limit`** — fixed-window limiter on Workers **KV**. **Fails open when `RATE_LIMIT_KV`
  is unbound** — the Cloudflare WAF rule is the primary limiter; KV is defence-in-depth.
- **`crypto`** (`./crypto`) — AES-256-GCM (with integrity tag) + salted SHA-256 on Web Crypto
  (Node 22 **and** Workers, all async). For at-rest PII + GDPR IP-hashing. The secret/salt is
  **caller-injected** — no keys in the brick.

**Hardening + Sanity Studio.** HSTS is production-only, `includeSubDomains`, **no `preload`** (sticky).
COOP defaults to `same-origin-allow-popups` **so the Studio OAuth login popup works**; COEP/CORP are
**not** added (they'd break Studio workers + cross-origin Sanity CDN). `script-src`/`connect-src` are
unchanged from the app's prior policy, so the Studio keeps working.

Integrates with, doesn't replace, `@indiecrafts/packages-shared-config` — `getCurrentEnvironment`/`getCSPConnectSources`
stay in config; this brick imports and composes them. Not Sanity (build config, config-first).

Full reference → [`code/docs/packages/security.md`](../../../../docs/packages/security.md).
