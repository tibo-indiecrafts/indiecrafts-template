# @indiecrafts/security — CSP · headers · image allowlist

**Stack:** TypeScript. Pure, framework-agnostic (no React/Next imports) — builds header **strings +
arrays** an app's `next.config.ts` consumes. Foundation/domain · server. Dep: `@indiecrafts/config`.

Auto-loads under `code/packages/security/**`. Subpath-only (explicit-extension `exports` → no
tsconfig `paths`).

- **`buildCsp(env, csp?)`** (`./csp`) — the CSP string. Hardened defaults baked in; `connect-src`
  base comes from the existing config helper **`getCSPConnectSources(env)`** (Sanity + npm + dev). App
  passes extras via `CspHosts` (`frameSrc`, `mediaSrc`, `embedHosts`, `googleAnalytics`, …).
- **`securityHeaders(opts)`** (`./headers`) — the full Next `headers()` array: `nosniff` · `X-Frame
  DENY` · `Referrer-Policy` · `Permissions-Policy` · `CSP` · **HSTS** (prod only) · **COOP** + immutable
  `Cache-Control` on `immutablePaths`.
- **`imageDefaults` / `imageRemotePatterns`** (`./images`) — the Next image allowlist (unsplash +
  `cdn.sanity.io`) + formats + TTL. Spread into `images`.

**Hardening + Sanity Studio.** HSTS is production-only, `includeSubDomains`, **no `preload`** (sticky).
COOP defaults to `same-origin-allow-popups` **so the Studio OAuth login popup works**; COEP/CORP are
**not** added (they'd break Studio workers + cross-origin Sanity CDN). `script-src`/`connect-src` are
unchanged from the app's prior policy, so the Studio keeps working.

Integrates with, doesn't replace, `@indiecrafts/config` — `getCurrentEnvironment`/`getCSPConnectSources`
stay in config; this brick imports and composes them. Not Sanity (build config, config-first).
