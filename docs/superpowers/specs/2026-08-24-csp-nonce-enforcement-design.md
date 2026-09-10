# CSP nonce enforcement (sub-project 3)

**Date:** 2026-08-24
**Status:** Design approved, ready for implementation plan
**Builds on:** SP1 (the CSP Report-Only pipeline — `csp_reports`, `securityHeaders({ reporting })`, `buildCsp`) and the Clerk-CSP fix, all on branch `worktree-csp-report-only`.

## Goal

Enforce a strict, nonce-based Content-Security-Policy on the web surfaces: remove
`script-src 'unsafe-inline'` for modern browsers by moving to a per-request nonce +
`'strict-dynamic'`. Roll it out through SP1's Report-Only pipeline, with a fast switch
back to Report-Only if production breaks.

## Decisions (settled during brainstorming)

- **Scope:** `script-src` only — nonce + `'strict-dynamic'`. `style-src 'unsafe-inline'` STAYS (Tailwind/Next/Sanity inject inline styles with no clean nonce path; low XSS value).
- **Architecture:** Approach A — the proxy emits the strict nonce CSP on the routes it matches; a static `headers()` rule keeps the permissive CSP scoped to `/studio`.
- **Rollout control:** a per-surface `CSP_MODE` env var (`report-only` | `enforce`), read in `proxy.ts`, default `report-only`. Flip + redeploy to roll back.
- **Fallback form:** the strict `script-src` keeps `https: 'unsafe-inline'` as a CSP-Level-2 fallback that `'strict-dynamic'`-aware browsers ignore — modern browsers get the nonce protection, old browsers keep working.

## Why CSP must move to the proxy

CSP is built statically in `code/packages/shared/security/src/csp.ts` and applied via each
surface's `next.config.ts` `async headers()` on `source: "/:path*"`. A static header cannot
carry a per-request nonce. The only place a fresh nonce exists per request is `proxy.ts`
(Next 16's renamed middleware). So the nonce CSP header must be emitted there. There is zero
existing nonce plumbing in the repo today.

## Architecture — the CSP emission split (Approach A)

```
Request
  ├─ /studio/*  (NOT matched by the proxy)
  │     next.config headers(): non-CSP headers (/:path*)  +  static PERMISSIVE CSP (/studio/:path*)
  │     → Sanity Studio keeps 'unsafe-inline'/'unsafe-eval'; no nonce
  │
  └─ every app route  (matched by the proxy)
        next.config headers(): non-CSP headers only (/:path*, cspMode:'proxy' drops CSP here)
        proxy.ts: generate nonce → inject x-nonce request header → set the CSP response header
        → CSP_MODE=report-only: enforced = current permissive policy; Report-Only = strict nonce policy
        → CSP_MODE=enforce:     enforced = strict nonce policy
```

Exactly one `Content-Security-Policy` per response: the proxy's on app routes, the static
permissive one on `/studio`. The other security headers (nosniff, X-Frame-Options,
Referrer-Policy, Permissions-Policy, COOP, HSTS) stay in `securityHeaders()` on `/:path*` for
every route, unchanged.

admin and app have no `/studio`, so they get no static CSP rule — the proxy owns all their CSP.

## The nonce plumbing

A shared helper in `@indiecrafts/packages-shared-security` (new file `src/csp-nonce.ts`),
used by all three proxies so the logic lives in one place:

- **`generateNonce(): string`** — base64 of 16 random bytes from `crypto.getRandomValues`
  (a global on the Cloudflare Worker runtime; the brick already relies on Web Crypto in
  `crypto.ts`).
- **`cspNonceHeaders(env, csp, nonce, mode): { csp: string; reportOnly: string | null }`** —
  composes the CSP header value(s) for the given mode (see below).
- **`applyCsp(request, opts, run): Promise<Response>`** — the proxy integration helper the three
  proxies wrap their pipeline through. Intended shape: it generates the nonce, calls
  `run(requestWithNonce)` (the proxy's existing logic, given a request carrying the `x-nonce`
  header so the RSC layout reads it), then stamps the CSP header(s) on the returned response per
  `opts.mode`. The exact next-intl request-header injection inside it is validated by the spike
  (see Open Questions) — but the helper's signature and the three call sites are fixed here.

### The three proxies (from the blast-radius map)

All three are `createMiddleware(routing)` (next-intl) optionally wrapped by `clerkMiddleware`.
Each returns `intlMiddleware(request)` (or a redirect/rewrite). The nonce helper wraps each
return point:

- **website** (`src/proxy.ts`): three return points — the maintenance rewrite
  (`NextResponse.rewrite(..., {status:503})`), `intlMiddleware(request)`, and the Clerk-wrapped
  response. Matcher excludes `api|_next|_vercel|studio|maintenance|manifest|robots|sitemap` +
  dotted assets.
- **admin** (`src/proxy.ts`): `intlMiddleware` (sign-in + gated-through) and the
  `NextResponse.redirect` to `/sign-in`. Matcher excludes `api|_next|_vercel|manifest|robots|sitemap` + dotted (no `/studio`).
- **app** (`src/proxy.ts`): single return point, `intlMiddleware`. Matcher same as admin.

### Reading the nonce in the app

The website root layout (`src/app/[locale]/layout.tsx`) already reads request headers
server-side (`(await headers()).get("cf-ipcountry")` at ~line 139). Add
`(await headers()).get("x-nonce")` beside it and thread the nonce to:

1. The two GA `<Script>` tags (`layout.tsx:184` loader + `:188` inline `gtag-init`) — `next/script`
   forwards a `nonce` prop. The inline `gtag-init` is the one real first-party break; the loader
   is host-allowlisted but gets the nonce too under `'strict-dynamic'`.
2. `ClerkProvider` (`code/packages/web/auth/src/provider.tsx`) — `@clerk/nextjs`'s `ClerkProvider`
   accepts a `nonce` prop; pass it so ClerkJS's injected inline scripts carry the nonce. Gated on
   the Clerk key like the provider itself.

Not touched (already safe): JSON-LD (`jsonld.tsx` — `type="application/ld+json"` is
non-executable, CSP does not enforce it), Turnstile (host-allowlisted external src, created from
the nonce-able bundle), inline `<style>` / style attributes (`style-src 'unsafe-inline'` stays).

## The strict policy (`buildCsp` gains a nonce)

`buildCsp(env, csp, reporting?)` gains an optional `nonce`. When present, `script-src` becomes:

```
script-src 'self' 'nonce-<n>' 'strict-dynamic' https: 'unsafe-inline'
```

- `'nonce-<n>' 'strict-dynamic'` — modern browsers trust the nonce'd bootstrap and any script it
  loads; they IGNORE `https:` and `'unsafe-inline'`.
- `https: 'unsafe-inline'` — a CSP-Level-2 fallback for pre-`strict-dynamic` browsers.

Under `'strict-dynamic'` the script host allowlists (GA, Turnstile, Clerk FAPI) are redundant in
`script-src` (they load via nonce propagation), but they stay in `connect-src`/`img-src`/`frame-src`,
which `'strict-dynamic'` does not affect. `style-src`, `img-src`, `connect-src`, `frame-src`,
`object-src`, `frame-ancestors`, `base-uri`, `form-action`, `worker-src`, and
`upgrade-insecure-requests` are unchanged from today.

## `CSP_MODE` — the dual-policy rollout

The proxy reads `process.env.CSP_MODE` (default `report-only`) and emits:

- **`report-only`:**
  - `Content-Security-Policy: <current permissive policy>` (today's `buildCsp` output, no nonce needed but the nonce is still generated + threaded) + reporting directives — the site keeps working exactly as today.
  - `Content-Security-Policy-Report-Only: <strict nonce policy>` + reporting directives — observe what the strict policy would block.
- **`enforce`:**
  - `Content-Security-Policy: <strict nonce policy>` + reporting directives only.

Both modes carry the SP1 reporting directives (`report-to csp-endpoint; report-uri /api/csp-report`)
and feed `csp_reports` — `disposition: "report"` in report-only mode, `"enforce"` once flipped.

### Integration with SP1

SP1 emitted the reporting directives + a Report-Only candidate (`dropSources: ["https:"]`) from
`securityHeaders({ reporting })` in the STATIC `headers()`. SP3 moves CSP emission (including the
reporting directives and the Report-Only header) into the proxy for app routes. So:

- `securityHeaders({ cspMode: 'proxy' })` stops emitting the CSP + `Reporting-Endpoints` +
  Report-Only headers on `/:path*` (the proxy owns them now).
- The proxy emits `Reporting-Endpoints: csp-endpoint="/api/csp-report"` + the CSP/Report-Only per mode.
- The `/studio` static rule emits the permissive CSP + the reporting directives (so Studio
  violations also report).
- The SP1 `dropSources: ["https:"]` candidate is superseded by the SP3 strict policy — the strict
  nonce policy is the real Report-Only target now.

## The `/studio` static rule

website's `next.config.ts` adds one `headers()` rule scoped to `/studio/:path*` carrying the
CURRENT permissive policy — `buildCsp(env, studioHosts)` with no nonce, identical to what
`/studio` gets today (the same `'unsafe-inline'`, `connect-src` Sanity hosts, dev-only
`'unsafe-eval'`). This preserves Studio behavior exactly; SP3 introduces no change there. A brick
helper `studioCspRule(env, csp)` returns the `HeaderRule` so the logic stays in the security brick.

Note: today's prod policy has `'unsafe-inline'` but not `'unsafe-eval'` (`allowEval = dev && …`).
Whether Sanity Studio needs `'unsafe-eval'` in prod is a PRE-EXISTING question, not introduced by
this work — the `/studio` rule reproduces today's exact policy. If Studio breaks in prod for lack
of `'unsafe-eval'`, that is a separate fix.

## Rollout sequence

1. Ship the nonce infra on all three surfaces with `CSP_MODE=report-only` (default). The strict
   policy runs as Report-Only; violations land in `csp_reports` with `disposition: "report"`.
2. Read `csp_reports` (SQL / Cloudflare dashboard). Fix any missed inline script.
3. Flip **admin and app** to `CSP_MODE=enforce` first — the cleanest surfaces (only Clerk).
   Observe.
4. Flip **website** to `enforce` last, after the GA + Clerk nonces are confirmed clean.
5. Rollback anytime: set `CSP_MODE=report-only` and redeploy (minutes, no code change).

## Code layout

- `code/packages/shared/security/src/csp-nonce.ts` (new) — `generateNonce`, `cspNonceHeaders`, the proxy integration helper.
- `code/packages/shared/security/src/csp.ts` (edit) — `buildCsp` gains the optional `nonce` (strict `script-src`).
- `code/packages/shared/security/src/headers.ts` (edit) — `securityHeaders` gains `cspMode: 'static' | 'proxy'` (default `static`); `'proxy'` omits CSP + reporting headers. Export `studioCspRule`.
- `code/packages/shared/security/src/index.ts` (edit) — export the new symbols.
- `code/projects/web/surfaces/{website,admin,app}/src/proxy.ts` (edit) — wrap responses through the nonce helper; read `CSP_MODE`.
- `code/projects/web/surfaces/website/src/app/[locale]/layout.tsx` (edit) — read `x-nonce`, pass to the two GA `<Script>` tags.
- `code/packages/web/auth/src/provider.tsx` (edit) — accept + pass `nonce` to `ClerkProvider` (all surfaces use it).
- `code/projects/web/surfaces/{website,admin,app}/next.config.ts` (edit) — `securityHeaders({ cspMode: 'proxy' })`; website adds the `/studio` rule.
- `.env.example` in each surface (edit) — document `CSP_MODE`.
- Tests + docs (see below).

## Security considerations

- The nonce is per-request, unguessable (16 random bytes, base64), and never reused — the whole point.
- `'strict-dynamic'` + nonce is the OWASP/Google-recommended strict CSP; the `https: 'unsafe-inline'` fallback does not weaken it for modern browsers (they ignore it).
- `/studio` remains permissive by necessity (Sanity), but it is gated by `features.studio` and behind the Studio's own auth — the permissive policy is scoped to that route only.
- Report-Only default means shipping this cannot break production; enforcement is a deliberate, reversible flip per surface.

## Testing

- **Unit (security brick):** `buildCsp` with a nonce → `script-src` contains `'nonce-<n>' 'strict-dynamic'`; without a nonce → today's output (regression via the SP1 header-set lock). `cspNonceHeaders` returns both headers in report-only mode, one in enforce. `generateNonce` format/length/uniqueness. `studioCspRule` scoped to `/studio/:path*` with the permissive policy.
- **E2e (Playwright — the real proof):** on the website, a page response carries a `Content-Security-Policy` header with a `nonce-…`; the SAME nonce appears on the `gtag` `<Script>` in the HTML; ZERO CSP console violations on home, a Turnstile form, a Clerk sign-in, and a GA-enabled page; `/studio` still loads. Run with `CSP_MODE=enforce`.
- **Manual:** run website locally with `CSP_MODE=enforce`, eyeball the console on those flows and `/studio`.

## Open questions / risks

- **The next-intl + nonce request-header injection is the main technical risk.** next-intl's
  `intlMiddleware(request)` builds its own `NextResponse`; injecting an `x-nonce` request header
  that reaches the RSC layout requires the right Next pattern (`NextResponse.next({ request: { headers } })`
  vs a cloned request passed to `intlMiddleware`). The plan should start with a short spike to nail
  this exact pattern before wiring all three proxies.
- **Whether Sanity Studio needs `'unsafe-eval'` in prod** — pre-existing, out of scope; the `/studio`
  rule reproduces today's policy.

## Out of scope

- `style-src` hardening (stays `'unsafe-inline'`).
- The inbound rate-limit / table-inflation hardening on `/api/csp-report` (SP1's deferred Issue 4).
- `X-Robots-Tag` and other non-CSP header additions.
- Native surfaces (mobile/Expo, hybrid/Electron) — not Next HTTP responses.
