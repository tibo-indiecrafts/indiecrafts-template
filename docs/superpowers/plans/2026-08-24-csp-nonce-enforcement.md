# CSP Nonce Enforcement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce a strict, nonce-based CSP on the web surfaces — remove `script-src 'unsafe-inline'` for modern browsers via a per-request nonce + `'strict-dynamic'` — rolled out through SP1's Report-Only pipeline with a per-surface `CSP_MODE` kill switch.

**Architecture:** CSP moves from the static `next.config.ts headers()` into `proxy.ts`, which is the only place a per-request nonce exists. The proxy emits the strict nonce CSP on the routes it matches; a static `headers()` rule keeps the permissive CSP scoped to `/studio` (Sanity can't take nonces). Pure policy/string logic lives in the framework-agnostic security brick; each proxy carries a thin Next-coupled glue.

**Tech Stack:** TypeScript (strict) · Next.js 16 (App Router, proxy.ts) · next-intl v4 · @clerk/nextjs · Cloudflare Workers (OpenNext) · Vitest · Playwright.

**Spec:** `docs/superpowers/specs/2026-08-24-csp-nonce-enforcement-design.md`

## Global Constraints

- TypeScript strict; no `as any`.
- The security brick (`code/packages/shared/security`) is PURE / framework-agnostic — NO React/Next imports. The Next-coupled glue (`NextRequest`/`NextResponse`) lives in each surface's `proxy.ts`, not the brick.
- Scope: `script-src` only. `style-src 'unsafe-inline'` STAYS. Do not touch it.
- The strict `script-src` is exactly: `'self' 'nonce-<n>' 'strict-dynamic' https: 'unsafe-inline'` (the `https: 'unsafe-inline'` is the CSP-Level-2 fallback modern browsers ignore).
- `CSP_MODE` env var, default `report-only`. `report-only` must NOT break the site (enforce the current permissive policy, report-only the strict one). `enforce` emits the strict policy as `Content-Security-Policy`.
- One CSP header per response: proxy CSP on app routes, static permissive CSP on `/studio` only. `securityHeaders({ cspMode: 'proxy' })` must stop emitting CSP/`Reporting-Endpoints`/Report-Only on `/:path*`.
- Reporting directives (`report-to csp-endpoint; report-uri /api/csp-report`) + the `csp_reports` sink from SP1 carry over — both modes report.
- `nonce` generation must work on the Cloudflare Worker runtime (`crypto.getRandomValues` / `btoa` are globals — already used in the brick's `crypto.ts`).
- Commit messages end with: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- Docs change in lockstep (`code/docs/**` + `code/docs/.vitepress/config.mts` sidebar). Changelogs at home altitude (`code/packages/CHANGELOG.md`, each surface's `CHANGELOG.md`).
- Work on the existing `worktree-csp-report-only` branch (this builds on SP1).

---

### Task 1: Security brick — nonce policy + primitives (pure)

Everything the proxies need, framework-free and unit-tested. No app changes yet.

**Files:**

- Modify: `code/packages/shared/security/src/csp.ts`
- Create: `code/packages/shared/security/src/csp-nonce.ts`
- Modify: `code/packages/shared/security/src/headers.ts`
- Modify: `code/packages/shared/security/src/index.ts`
- Test: `code/packages/shared/security/src/csp.test.ts` (append) + `code/packages/shared/security/src/csp-nonce.test.ts` (create)

**Interfaces:**

- Produces: `buildCsp(env, csp?, reporting?, nonce?): string` — with `nonce`, `script-src` is the strict form.
- Produces: `type CspMode = "report-only" | "enforce"`
- Produces: `generateNonce(): string` (`./csp-nonce`)
- Produces: `cspHeadersForMode(env, csp, reporting, nonce, mode): { enforced: string; reportOnly: string | null }` (`./csp-nonce`)
- Produces: `securityHeaders(opts)` gains `cspMode?: "static" | "proxy"` (default `"static"`); `"proxy"` omits CSP + `Reporting-Endpoints` + Report-Only headers.
- Produces: `studioCspRule(env, csp?, reporting?): HeaderRule` (`./headers`) — the `/studio/:path*` permissive rule.

- [ ] **Step 1: Write the failing tests**

Append to `code/packages/shared/security/src/csp.test.ts`:

```ts
describe("buildCsp nonce (strict script-src)", () => {
  it("uses nonce + strict-dynamic + the level-2 fallback when a nonce is given", () => {
    const csp = buildCsp("production", {}, undefined, "abc123");
    expect(csp).toContain(
      "script-src 'self' 'nonce-abc123' 'strict-dynamic' https: 'unsafe-inline'",
    );
    // style-src is untouched
    expect(csp).toContain("style-src 'self' 'unsafe-inline'");
  });

  it("is the current policy when no nonce is given", () => {
    const csp = buildCsp("production", {});
    expect(csp).toContain("script-src 'self' 'unsafe-inline'");
    expect(csp).not.toContain("strict-dynamic");
  });
});
```

Create `code/packages/shared/security/src/csp-nonce.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { generateNonce, cspHeadersForMode } from "./csp-nonce";

describe("generateNonce", () => {
  it("returns a non-empty base64 nonce, unique per call", () => {
    const a = generateNonce();
    const b = generateNonce();
    expect(a).toMatch(/^[A-Za-z0-9+/]+=*$/);
    expect(a.length).toBeGreaterThanOrEqual(16);
    expect(a).not.toBe(b);
  });
});

describe("cspHeadersForMode", () => {
  const reporting = { endpoint: "/api/csp-report" };
  it("enforce → strict enforced, no report-only", () => {
    const { enforced, reportOnly } = cspHeadersForMode(
      "production",
      {},
      reporting,
      "n0nce",
      "enforce",
    );
    expect(enforced).toContain("'nonce-n0nce' 'strict-dynamic'");
    expect(enforced).toContain("report-uri /api/csp-report");
    expect(reportOnly).toBeNull();
  });

  it("report-only → permissive enforced + strict report-only", () => {
    const { enforced, reportOnly } = cspHeadersForMode(
      "production",
      {},
      reporting,
      "n0nce",
      "report-only",
    );
    expect(enforced).toContain("script-src 'self' 'unsafe-inline'"); // permissive, site works
    expect(enforced).not.toContain("strict-dynamic");
    expect(reportOnly).toContain("'nonce-n0nce' 'strict-dynamic'"); // strict, observed
    expect(reportOnly).toContain("report-uri /api/csp-report");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter @indiecrafts/packages-shared-security test`
Expected: FAIL — `nonce` param and `./csp-nonce` do not exist yet.

- [ ] **Step 3: Add the nonce to `buildCsp`**

In `code/packages/shared/security/src/csp.ts`, thread a `nonce` through `cspDirectives` and `buildCsp`. Change the `cspDirectives` signature and the `script-src` line:

```ts
function cspDirectives(
  env: Environment,
  csp: CspHosts,
  opts: { dropSources?: string[]; dropUnsafeEval?: boolean } = {},
  nonce?: string,
): string[] {
  // ... existing dev/embed/ga/allowEval/drop/keep/clerk setup unchanged ...

  const scriptSrc = nonce
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: 'unsafe-inline'`
    : keep(
        `script-src ${src(["'self'", "'unsafe-inline'"], allowEval ? ["'unsafe-eval'"] : undefined, ga ? GA_SCRIPT : undefined, TURNSTILE, clerk.script, csp.scriptSrc, embed)}`,
      );

  const directives = [
    `default-src 'self'`,
    scriptSrc,
    `style-src 'self' 'unsafe-inline'`,
    // ... the rest of the directives unchanged ...
  ];
  // ... clerk worker-src + upgrade-insecure-requests unchanged ...
  return directives;
}
```

Update `buildCsp` to accept + forward `nonce`:

```ts
export function buildCsp(
  env: Environment,
  csp: CspHosts = {},
  reporting?: CspReporting,
  nonce?: string,
): string {
  const directives = cspDirectives(env, csp, {}, nonce);
  return (reporting ? withReporting(directives, reporting) : directives).join(
    "; ",
  );
}
```

(`buildReportOnlyCsp` is unchanged — SP3 uses `cspHeadersForMode` for the proxy path, not `buildReportOnlyCsp`.)

- [ ] **Step 4: Create `csp-nonce.ts`**

```ts
import { buildCsp, type CspHosts, type CspReporting } from "./csp";
import type { Environment } from "@indiecrafts/packages-shared-config";

export type CspMode = "report-only" | "enforce";

/** A per-request script nonce: base64 of 16 random bytes. crypto + btoa are globals
 *  on Node 22 and the Cloudflare Worker runtime (the brick already relies on this). */
export function generateNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
}

/**
 * The CSP header value(s) the proxy sets for a given mode.
 * - enforce: the strict nonce policy as the enforced CSP; no Report-Only.
 * - report-only: the CURRENT permissive policy stays enforced (site keeps working) and the
 *   strict nonce policy is Report-Only — so violations are observed without blocking.
 */
export function cspHeadersForMode(
  env: Environment,
  csp: CspHosts,
  reporting: CspReporting,
  nonce: string,
  mode: CspMode,
): { enforced: string; reportOnly: string | null } {
  const strict = buildCsp(env, csp, reporting, nonce);
  if (mode === "enforce") return { enforced: strict, reportOnly: null };
  return { enforced: buildCsp(env, csp, reporting), reportOnly: strict };
}
```

- [ ] **Step 5: Add `cspMode` to `securityHeaders` + `studioCspRule`**

In `code/packages/shared/security/src/headers.ts`:

Add `cspMode?: "static" | "proxy";` to `SecurityHeadersOptions` (default `"static"`). When `"proxy"`, build the `headers` array WITHOUT the `Content-Security-Policy` entry and WITHOUT the `Reporting-Endpoints`/Report-Only entries (the proxy owns them). Keep every other header. Concretely, guard the CSP push:

```ts
const headers: { key: string; value: string }[] = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: permissionsPolicy },
];
if (cspMode !== "proxy") {
  headers.push({
    key: "Content-Security-Policy",
    value: buildCsp(env, csp, reporting),
  });
  if (reporting) {
    headers.push({
      key: "Reporting-Endpoints",
      value: `csp-endpoint="${reporting.endpoint}"`,
    });
    const reportOnly = buildReportOnlyCsp(env, csp, reporting);
    if (reportOnly)
      headers.push({
        key: "Content-Security-Policy-Report-Only",
        value: reportOnly,
      });
  }
}
```

Add the exported `studioCspRule`:

```ts
/** The permissive CSP rule for the Sanity Studio route — it needs 'unsafe-inline'
 *  (+ dev 'unsafe-eval') and cannot take a nonce. Scoped to /studio only. Reproduces
 *  today's policy exactly (the current buildCsp output). */
export function studioCspRule(
  env: Environment,
  csp: CspHosts = {},
  reporting?: CspReporting,
): HeaderRule {
  const rule: HeaderRule = {
    source: "/studio/:path*",
    headers: [
      { key: "Content-Security-Policy", value: buildCsp(env, csp, reporting) },
    ],
  };
  if (reporting)
    rule.headers.push({
      key: "Reporting-Endpoints",
      value: `csp-endpoint="${reporting.endpoint}"`,
    });
  return rule;
}
```

Import `CspReporting` where needed. Add `cspMode = "static"` to the destructured params.

- [ ] **Step 6: Export the new symbols**

In `code/packages/shared/security/src/index.ts`, export `studioCspRule` (from `./headers`) and `generateNonce`, `cspHeadersForMode`, `type CspMode` (from `./csp-nonce`).

- [ ] **Step 7: Run tests — expect green**

Run: `pnpm --filter @indiecrafts/packages-shared-security test`
Expected: PASS (new nonce/mode/studio tests + the SP1 header-set regression lock still green — note the lock asserts the `static` default still emits CSP, unchanged).

- [ ] **Step 8: Commit**

```bash
git add code/packages/shared/security/src/csp.ts code/packages/shared/security/src/csp-nonce.ts code/packages/shared/security/src/csp-nonce.test.ts code/packages/shared/security/src/headers.ts code/packages/shared/security/src/index.ts code/packages/shared/security/src/csp.test.ts
git commit -m "feat(security): nonce-based strict CSP policy + proxy-mode header primitives

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: App surface — validate the next-intl nonce pattern + wire end-to-end

The `app` surface is the simplest proxy (next-intl only, optional Clerk, no maintenance/gate/GA/Studio). Prove the whole nonce mechanism here, then Tasks 3-4 copy the validated glue.

**Files:**

- Modify: `code/projects/web/surfaces/app/src/proxy.ts`
- Modify: `code/projects/web/surfaces/app/next.config.ts`
- Modify: `code/projects/web/surfaces/app/src/app/[locale]/layout.tsx` (thread `x-nonce` → `ClerkProvider`)
- Modify: `code/packages/web/auth/src/provider.tsx` (accept + pass `nonce` to `ClerkProvider`)
- Modify: `code/projects/web/surfaces/app/.env.example` (document `CSP_MODE`)

**Interfaces:**

- Consumes (Task 1): `generateNonce`, `cspHeadersForMode`, `type CspMode` from `@indiecrafts/packages-shared-security`.
- Produces: the confirmed proxy glue pattern (nonce gen → `x-nonce` request header → CSP response header) that Tasks 3-4 reuse.

- [ ] **Step 1: Thread `nonce` into the shared Clerk provider**

In `code/packages/web/auth/src/provider.tsx`, accept an optional `nonce` and pass it to `ClerkProvider`:

```tsx
export function AppClerkProvider({
  children,
  nonce,
}: {
  children: ReactNode;
  nonce?: string;
}) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <>{children}</>;
  return (
    <ClerkProvider appearance={authAppearance()} nonce={nonce}>
      {children}
    </ClerkProvider>
  );
}
```

(Confirm the real component/prop names from the file; match them. `@clerk/nextjs` `ClerkProvider` accepts `nonce`.)

- [ ] **Step 2: Read `x-nonce` in the app layout and pass it down**

In `code/projects/web/surfaces/app/src/app/[locale]/layout.tsx`, read the nonce beside the existing header reads and pass it to `AppClerkProvider`:

```tsx
const nonce = (await headers()).get("x-nonce") ?? undefined;
// ...
<AppClerkProvider nonce={nonce}>{children}</AppClerkProvider>;
```

- [ ] **Step 3: Write the app proxy glue (the pattern to validate)**

In `code/projects/web/surfaces/app/src/proxy.ts`, generate a nonce, inject it as the `x-nonce` REQUEST header (so the layout reads it), run the existing intl pipeline against that request, and set the CSP response header per `CSP_MODE`. Starting pattern:

```ts
import {
  generateNonce,
  cspHeadersForMode,
  type CspMode,
} from "@indiecrafts/packages-shared-security";
import { getCurrentEnvironment } from "@indiecrafts/packages-shared-config";

const CSP_MODE: CspMode =
  process.env.CSP_MODE === "enforce" ? "enforce" : "report-only";
const REPORTING = {
  endpoint: "/api/csp-report",
  reportOnly: { dropSources: ["https:"] },
};

function withNonceRequest(request: NextRequest, nonce: string): NextRequest {
  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  return new NextRequest(request, { headers });
}

function setCsp(response: Response, nonce: string): Response {
  const { enforced, reportOnly } = cspHeadersForMode(
    getCurrentEnvironment(),
    {},
    REPORTING,
    nonce,
    CSP_MODE,
  );
  response.headers.set("Content-Security-Policy", enforced);
  response.headers.set("Reporting-Endpoints", `csp-endpoint="/api/csp-report"`);
  if (reportOnly)
    response.headers.set("Content-Security-Policy-Report-Only", reportOnly);
  return response;
}
```

Then wrap the existing return: generate `const nonce = generateNonce()`, call `intlMiddleware(withNonceRequest(request, nonce))`, and `return setCsp(response, nonce)`. Keep the Clerk wrapper.

**VALIDATION (this task's spike):** the risk is whether `x-nonce` on the request actually reaches the RSC layout through next-intl's rewrite. After wiring, run the manual check in Step 5. If the layout's `headers().get("x-nonce")` is null, apply the documented fallback: pass the request headers through via `NextResponse.next({ request: { headers } })` merged with next-intl (see next-intl middleware composition docs), or set the nonce header on next-intl's response and forward it. Record the working pattern in the task report — Tasks 3-4 copy exactly what works here.

- [ ] **Step 4: Wire `next.config.ts` + `.env.example`**

- In `code/projects/web/surfaces/app/next.config.ts`, change the `securityHeaders({...})` call to add `cspMode: "proxy"` (CSP now comes from the proxy). Remove the `reporting` field from that call if present (the proxy emits it now) — keep everything else.
- In `code/projects/web/surfaces/app/.env.example`, add: `CSP_MODE=report-only  # report-only | enforce — the strict nonce CSP; enforce only after reports are clean`.

- [ ] **Step 5: Verify (tsc + manual nonce proof)**

Run: `pnpm --filter @indiecrafts/web-surfaces-app tsc` — must pass.

Manual (the spike proof): start app (`pnpm --filter @indiecrafts/web-surfaces-app dev`) with `CSP_MODE=enforce`, then:

- `curl -sI http://localhost:3000/en | grep -i content-security-policy` → shows `script-src 'self' 'nonce-…' 'strict-dynamic' …`.
- Load a page in a browser, confirm ZERO CSP console errors, and (if Clerk configured) the Clerk components render. Confirm the nonce in the header matches a `nonce="…"` attribute in the page's script tags (view source).
- If `x-nonce` didn't reach the layout (scripts have no nonce / console shows blocked inline), iterate on the Step-3 pattern until it works, and document it.

- [ ] **Step 6: Commit**

```bash
git add code/projects/web/surfaces/app code/packages/web/auth/src/provider.tsx
git commit -m "feat(app): nonce-based CSP in the proxy (validates the next-intl nonce pattern)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Admin surface — wire the validated nonce glue

Copy Task 2's confirmed pattern into the admin proxy, which additionally has a fail-closed `/sign-in` redirect.

**Files:**

- Modify: `code/projects/web/surfaces/admin/src/proxy.ts`
- Modify: `code/projects/web/surfaces/admin/next.config.ts`
- Modify: `code/projects/web/surfaces/admin/src/app/[locale]/layout.tsx` (thread `x-nonce` → `AppClerkProvider`)
- Modify: `code/projects/web/surfaces/admin/.env.example`

**Interfaces:**

- Consumes: the confirmed glue from Task 2 (same `withNonceRequest`/`setCsp` shape); `AppClerkProvider` `nonce` prop (already added in Task 2).

- [ ] **Step 1: Copy the proxy glue**

Add the same `CSP_MODE`, `withNonceRequest`, `setCsp` (from Task 2's confirmed pattern) to `code/projects/web/surfaces/admin/src/proxy.ts`. Generate the nonce, run `intlMiddleware(withNonceRequest(request, nonce))` for the pass-through / sign-in cases, and `setCsp(response, nonce)` on the returned intl response. The `NextResponse.redirect(/sign-in)` gets the CSP header too (no nonce needed on a redirect, but set the enforced CSP for consistency): `setCsp(NextResponse.redirect(url), nonce)`.

- [ ] **Step 2: Thread `x-nonce` in the admin layout**

In `code/projects/web/surfaces/admin/src/app/[locale]/layout.tsx`, read `(await headers()).get("x-nonce")` and pass it to `AppClerkProvider` (same as Task 2 Step 2).

- [ ] **Step 3: `next.config.ts` + `.env.example`**

`cspMode: "proxy"` in the `securityHeaders({...})` call; add `CSP_MODE=report-only` to `.env.example` (same line as app).

- [ ] **Step 4: Verify**

Run: `pnpm --filter @indiecrafts/web-surfaces-admin tsc` — pass.
Manual: with `CSP_MODE=enforce`, confirm the `/en` response carries the strict CSP header, the admin sign-in page renders with no CSP console errors, and (if Clerk configured) sign-in works.

- [ ] **Step 5: Commit**

```bash
git add code/projects/web/surfaces/admin
git commit -m "feat(admin): nonce-based CSP in the proxy

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Website surface — the hard one (GA + maintenance + /studio)

website has three proxy return points (maintenance rewrite, intl, Clerk-wrapped), the inline `gtag-init` `<Script>`, and the `/studio` route that must stay permissive.

**Files:**

- Modify: `code/projects/web/surfaces/website/src/proxy.ts`
- Modify: `code/projects/web/surfaces/website/next.config.ts` (`cspMode: "proxy"` + the `/studio` rule)
- Modify: `code/projects/web/surfaces/website/src/app/[locale]/layout.tsx` (nonce → the two GA `<Script>` + `AppClerkProvider`)
- Modify: `code/projects/web/surfaces/website/.env.example`

**Interfaces:**

- Consumes: the confirmed glue (Task 2), `studioCspRule` (Task 1), `AppClerkProvider` `nonce` (Task 2).

- [ ] **Step 1: Proxy glue on all three return points**

In `code/projects/web/surfaces/website/src/proxy.ts`, generate one nonce at the top of `pipeline`, build the nonce request once, and wrap EACH return through `setCsp(_, nonce)`: the `maintenanceRewrite` response, the `intlMiddleware(withNonceRequest(request, nonce))` response, and (via the Clerk wrapper) both. website's `REPORTING` keeps `reportOnly: { dropSources: ["https:"] }` as before.

- [ ] **Step 2: Thread the nonce to the GA scripts + Clerk in the layout**

In `code/projects/web/surfaces/website/src/app/[locale]/layout.tsx`:

- Read `const nonce = (await headers()).get("x-nonce") ?? undefined;` beside the existing `cf-ipcountry` read (~line 139).
- Pass `nonce={nonce}` to BOTH GA `<Script>` tags (the loader at ~line 184 and the inline `gtag-init` at ~line 188).
- Pass `nonce={nonce}` to `AppClerkProvider`.
- Leave `<JsonLdScript>` (`application/ld+json`, non-executable) and the inline `<style>` (line ~261) untouched.

- [ ] **Step 3: `next.config.ts` — cspMode proxy + the /studio rule**

In `code/projects/web/surfaces/website/next.config.ts`, in the `async headers()`:

- Add `cspMode: "proxy"` to the `securityHeaders({...})` call (drops CSP from `/:path*`; keeps the video `frameSrc`/`mediaSrc`/`googleAnalytics`/`embedHosts` — those still feed the `/studio` rule + are otherwise moot on proxy routes).
- Import `studioCspRule` and spread it into the returned rules array so `/studio/:path*` gets the permissive CSP:

```ts
async headers() {
  return [
    ...securityHeaders({
      env: getCurrentEnvironment(),
      csp: { frameSrc: [...], mediaSrc: [...], googleAnalytics: true, embedHosts: EMBED_HOSTS },
      cspMode: "proxy",
      immutablePaths: ["/brand/:path*", "/logo.svg"],
    }),
    studioCspRule(
      getCurrentEnvironment(),
      { frameSrc: [...], mediaSrc: [...], googleAnalytics: true, embedHosts: EMBED_HOSTS },
      { endpoint: "/api/csp-report" }, // /studio violations report too (spec)
    ),
  ];
}
```

Reuse the same `csp` object (the current values from the existing config — copy them, don't invent) for both calls. Add `CSP_MODE=report-only` to `.env.example`.

- [ ] **Step 4: Verify**

Run: `pnpm --filter @indiecrafts/web-surfaces-website tsc` — pass. Try `build`; if it fails only on the pre-existing missing `NEXT_PUBLIC_SANITY_PROJECT_ID`, note it and rely on tsc.
Manual (with a GA id + `CSP_MODE=enforce` locally if possible):

- `/en` response carries the strict nonce CSP; the two `gtag` `<Script>` tags in the HTML carry the matching `nonce`.
- `/studio` response carries the PERMISSIVE CSP (`'unsafe-inline'`) and the Studio loads.
- Zero CSP console errors on home, a form page (Turnstile), and a GA page.

- [ ] **Step 5: Commit**

```bash
git add code/projects/web/surfaces/website
git commit -m "feat(website): nonce-based CSP in the proxy; permissive CSP scoped to /studio

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: E2e proof + docs + changelogs

Lock the behavior with an e2e test and update the docs the branch touched.

**Files:**

- Create: `code/projects/web/surfaces/website/e2e/journeys/csp-nonce.spec.ts` (mirror the existing e2e setup)
- Modify: `code/docs/apps/web/seo/security-headers.md`
- Modify: `code/docs/packages/security.md`
- Modify: `code/packages/CHANGELOG.md` + `code/projects/web/surfaces/{website,admin,app}/CHANGELOG.md`

- [ ] **Step 1: E2e test (the real proof)**

Create a Playwright spec under the website's `e2e/journeys/` (read an existing spec first to match the harness/config). Run the site with `CSP_MODE=enforce`. Assert:

- The `/en` response has a `content-security-policy` header containing `'strict-dynamic'` and a `nonce-` value.
- The same nonce string appears as a `nonce` attribute on a `<script>` in the served HTML.
- No CSP violation is reported to the console on the home page (listen for `console` events / `securitypolicyviolation`).
- `/studio` responds with a CSP containing `'unsafe-inline'` (permissive) and no `'strict-dynamic'`.

Run: `pnpm --filter @indiecrafts/web-surfaces-website e2e` (or the repo's e2e command) — pass.

- [ ] **Step 2: Docs**

- `code/docs/apps/web/seo/security-headers.md`: the CSP now comes from `proxy.ts` with a per-request nonce; `CSP_MODE` (report-only default → enforce); `/studio` stays permissive; the rollout sequence.
- `code/docs/packages/security.md`: `buildCsp(env, csp, reporting, nonce)`, `generateNonce`, `cspHeadersForMode`, `securityHeaders({ cspMode })`, `studioCspRule`.

- [ ] **Step 3: Changelogs**

- `code/packages/CHANGELOG.md`: the nonce policy + `cspMode`/`studioCspRule` primitives (brick change).
- Each surface's `CHANGELOG.md`: proxy nonce CSP + `CSP_MODE`, with the why.

- [ ] **Step 4: Build the docs**

Run: `pnpm docs:build` — pass. (Do NOT commit the regenerated `code/docs/**/changelog.md` mirror files — leave them uncommitted, as on this branch.)

- [ ] **Step 5: Commit**

```bash
git add code/projects/web/surfaces/website/e2e code/docs/apps/web/seo/security-headers.md code/docs/packages/security.md code/packages/CHANGELOG.md code/projects/web/surfaces/website/CHANGELOG.md code/projects/web/surfaces/admin/CHANGELOG.md code/projects/web/surfaces/app/CHANGELOG.md
git commit -m "test(csp): e2e nonce proof + docs for SP3 enforcement

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Final verification

- `pnpm --filter @indiecrafts/packages-shared-security test`
- `pnpm --filter @indiecrafts/web-surfaces-website --filter @indiecrafts/web-surfaces-admin --filter @indiecrafts/web-surfaces-app tsc`
- `pnpm --filter @indiecrafts/web-surfaces-website e2e` (the nonce spec)
- Manual: each surface at `CSP_MODE=enforce` — strict CSP header + matching script nonce + zero console violations; website `/studio` still permissive + loads.

## Spec coverage self-review

- CSP emission split (proxy strict + static `/studio` permissive) → Tasks 1 (studioCspRule, cspMode), 4 (website /studio rule), 2/3 (proxy CSP).
- Nonce plumbing (generateNonce, x-nonce, layout threading, ClerkProvider) → Tasks 1 (generateNonce), 2 (provider + app layout + the validated pattern), 3/4 (admin/website layouts).
- Strict `script-src` (nonce + strict-dynamic + fallback) → Task 1 (buildCsp nonce).
- `CSP_MODE` dual-policy → Task 1 (cspHeadersForMode), 2/3/4 (proxy reads CSP_MODE).
- SP1 integration (cspMode drops static CSP/reporting; proxy emits) → Tasks 1 (cspMode), 2/3/4.
- Rollout default report-only + kill switch → Task 2/3/4 (`.env.example`, CSP_MODE default), Task 5 docs.
- Testing (unit + e2e) → Tasks 1, 5.
- The next-intl injection risk → Task 2 (spike folded into the first wire).
- Out of scope (style-src, rate-limit, X-Robots, native) → not in any task.
