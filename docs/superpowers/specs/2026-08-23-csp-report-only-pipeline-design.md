# CSP violation reporting — Report-Only pipeline (sub-project 1)

**Date:** 2026-08-23
**Status:** Design approved, ready for implementation plan
**Branch context:** builds on `feat/auth-security-events` (the `/v1/events` + D1 compliance pipeline)

## Goal

Collect Content-Security-Policy violation reports from every activated web
surface, sanitize them, and store them grouped for analysis. Do this without
enforcing any new policy, so no existing flow can break. This is the
foundation that later makes a strict, enforced CSP safe to ship.

## Decomposition

The user asked for "the whole thing": pipeline + admin dashboard + enforcement.
CSP forces a strict order — you cannot enforce safely before you analyze, and
you cannot analyze before you collect. So the work splits into three sequential
sub-projects, each with its own spec, plan, and build cycle:

1. **Report-Only pipeline** — this spec. Produces the data.
2. **Admin dashboard** — reads the data. Needs sub-project 1 shipped first.
3. **Enforcement + rollout controls** — needs nonces and the analysis from
   sub-project 2. Out of scope here.

## Decisions (settled during brainstorming)

- **Surfaces:** all activated surfaces — `website`, `admin`, `app`.
- **Retention:** 30 days. CSP reports are operational signal, not legal records.
- **Report mode:** attach reporting to the current enforced policy AND emit a
  stricter `Content-Security-Policy-Report-Only` candidate now.
- **Storage:** aggregate-on-write. One row per distinct violation group, with a
  count. Bounds table size by distinct violations, not request volume.
- **Code home:** a new `code/packages/web/security-reports/` brick for the Next
  route glue and forwarder. Pure parsing lives in the existing
  `code/packages/shared/security/` brick.

## What we take from wahio

wahio (`/Users/home/Code/sass-prod/wahio`) has CSP headers but **no reporting
pipeline** — no receiving endpoint, no `report-to`, no storage, no dashboard.
The reporting half is built fresh here. Two things are worth taking:

- **The structured-allowlist idea** — derive allowed origins from typed config,
  not a magic string. This repo already does it: `getCSPConnectSources(env)` in
  `code/packages/shared/config/src/web/env.ts`.
- **The header checklist** — COOP, HSTS, `Permissions-Policy`, `nosniff`,
  `frame-ancestors 'none'`. Already present in `code/packages/shared/security`.

Do **not** copy wahio's `'unsafe-inline'` script policy or its duplicated,
drifting CSP between apps.

## Architecture and data flow

```
Browser (website | admin | app)
  │  CSP violation → browser auto-POSTs (report-to / legacy report-uri)
  ▼
/api/csp-report            ← same-origin route, one thin file per surface
  │  1. accept  application/reports+json  AND  application/csp-report
  │  2. normalize   two formats → one shape          [shared/security, pure]
  │  3. sanitize    strip query+tokens, collapse routes, redact snippet
  │  4. drop noise  chrome-extension:// etc.
  │  5. forward     survivors + Bearer token           [web brick, server-only]
  ▼
POST /v1/events { kind:"csp-report", reports:[…≤10] }  ← existing api worker
  │  reuse bearer gate + rate limit + body cap; add ts
  │  UPSERT on group_key → count++, last_seen           (aggregate-on-write)
  ▼
D1 audit DB · csp_reports              ← one row per distinct violation group
  ▲ daily
cron worker: DELETE FROM csp_reports WHERE last_seen < now-30d
```

The three-hop shape is forced, not chosen. The browser sends CSP reports with
no bearer token, so it cannot reach the worker directly. The same-origin route
is the trust boundary. Sanitizing there strips PII before any data crosses to
the worker. This mirrors the existing consent pipeline exactly (`consent-log`
route → `logConsent` forwarder → `/v1/events`).

## Header changes

Extend `securityHeaders()` and `buildCsp()` in
`code/packages/shared/security/src/{headers.ts,csp.ts}` with additive options.
No existing behavior changes unless a surface opts in.

Each opted-in surface emits three header changes:

```
Reporting-Endpoints: csp-endpoint="/api/csp-report"

Content-Security-Policy: <existing enforced policy>;
    report-to csp-endpoint; report-uri /api/csp-report

Content-Security-Policy-Report-Only: <stricter candidate>;
    report-to csp-endpoint; report-uri /api/csp-report
```

- The endpoint is a same-origin **relative** URL. No new environment variable.
- `report-to` is the modern directive; `report-uri` is the legacy fallback.
  Browsers that support `report-to` ignore `report-uri`. Both point at the same
  route.
- The **enforced** policy stays exactly as it is today. Adding the reporting
  directives turns it into a live tripwire. A blocked resource — an injected
  script, a new un-allowlisted CDN — now reports instead of failing silently.
- The **Report-Only candidate** is the enforced policy with `'unsafe-eval'`
  removed by default, plus an optional per-surface list of third-party sources
  to drop. It cannot remove `'unsafe-inline'` yet — that needs nonces, which
  arrive in sub-project 3. The candidate is the main tuning knob during rollout.

### `buildCsp` shape

`buildCsp(env, csp)` today returns one policy string. It gains the ability to
return the enforced string and a candidate string from the same per-surface
`csp` config. A new `reportOnly` option controls the candidate:

```ts
type ReportOnlyOptions = {
  dropUnsafeEval?: boolean; // default true
  dropSources?: string[]; // extra origins to remove from the candidate
};
```

`securityHeaders()` gains a `reporting` flag. When set, it appends the reporting
directives to both policies and emits the `Reporting-Endpoints` header.

## Ingest: normalize and sanitize

Pure, framework-free functions in a new file
`code/packages/shared/security/src/csp-report.ts`. Unit-tested like the existing
`security-headers.test.ts`. No environment access, no `server-only`.

### Normalize

The two report formats carry the same facts under different names. Collapse both
into one internal shape.

| Internal field | `report-to` (`application/reports+json`) | legacy (`application/csp-report`) |
| -------------- | ---------------------------------------- | --------------------------------- |
| `directive`    | `body.effectiveDirective`                | `csp-report.effective-directive`  |
| `documentUrl`  | `body.documentURL`                       | `csp-report.document-uri`         |
| `blockedUrl`   | `body.blockedURL`                        | `csp-report.blocked-uri`          |
| `sourceFile`   | `body.sourceFile`                        | `csp-report.source-file`          |
| `line`         | `body.lineNumber`                        | `csp-report.line-number`          |
| `snippet`      | `body.sample`                            | `csp-report.script-sample`        |
| `disposition`  | `body.disposition`                       | `csp-report.disposition`          |

`report-to` sends an array; legacy sends a single object under `csp-report`.
`normalizeCspReport(raw, contentType)` returns an array of internal shapes.

### Sanitize

`sanitizeCspReport(normalized, surface)` cleans each record. Rules:

- **`document_path`** — take `documentUrl`, drop origin, query, and hash. Collapse
  path segments that are numeric (`^\d+$`), a UUID, or long hex (`^[0-9a-f]{16,}$`)
  to `:id`. Example: `/orders/93847?mode=edit` → `/orders/:id`.
- **`blocked_source`** — keep literals `inline`, `eval`, `data`, `blob`. Otherwise
  reduce to the origin (`new URL(blockedUrl).origin`). Drop path and query, which
  can carry tokens. Unparseable → `unknown`.
- **`sample_source_file`** — origin plus pathname. Drop query, which can carry
  signatures.
- **`sample_snippet`** — truncate to 60 characters. Redact emails
  (`[\w.+-]+@[\w.-]+` → `[email]`) and long token-like runs. This field is the
  highest PII risk; keep it short and redacted.

### Drop noise

`isExtensionNoise(blocked_source)` returns true for `chrome-extension://`,
`moz-extension://`, and `safari-web-extension://` sources. The route drops these
before forwarding. Browser extensions are the largest noise source.

### Group key

The worker builds the aggregation key from the sanitized fields:

```
group_key = `${surface}|${disposition}|${directive}|${document_path}|${blocked_source}`
```

Plain concatenated string, not a hash — it is not sensitive and stays readable
for debugging. `disposition` is in the key so enforced-policy violations
(`enforce`) and candidate violations (`report`) group separately.

## Storage: `csp_reports`

New migration `code/shared/api/db/d1/migrations/0004_csp_reports.sql` in the
existing audit D1. No new database, no `databases.mjs` row, no wrangler change.

```sql
CREATE TABLE csp_reports (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  group_key      TEXT NOT NULL UNIQUE,   -- surface|disposition|directive|path|source
  first_seen     TEXT NOT NULL,          -- ISO8601
  last_seen      TEXT NOT NULL,          -- drives the 30-day purge
  count          INTEGER NOT NULL DEFAULT 1,
  surface        TEXT NOT NULL,          -- website | admin | app
  disposition    TEXT NOT NULL,          -- report | enforce
  directive      TEXT NOT NULL,          -- effectiveDirective, e.g. script-src-elem
  document_path  TEXT NOT NULL,          -- /orders/:id
  blocked_source TEXT NOT NULL,          -- origin | inline | eval
  sample_source_file TEXT,               -- last-seen, query stripped
  sample_line    INTEGER,
  sample_snippet TEXT                    -- last-seen, redacted
);
CREATE INDEX idx_csp_reports_last_seen ON csp_reports (last_seen);
CREATE INDEX idx_csp_reports_group     ON csp_reports (surface, directive);
```

Write path:

```sql
INSERT INTO csp_reports
  (group_key, first_seen, last_seen, count, surface, disposition, directive,
   document_path, blocked_source, sample_source_file, sample_line, sample_snippet)
VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT(group_key) DO UPDATE SET
  count = count + 1,
  last_seen = excluded.last_seen,
  sample_source_file = excluded.sample_source_file,
  sample_line = excluded.sample_line,
  sample_snippet = excluded.sample_snippet;
```

This is the one deliberate departure from the `consent_events` schema and from
the source article, which log every report. Aggregate-on-write bounds table size
by distinct violations — a few dozen — instead of request volume, which is
unbounded. A noisy page cannot flood D1. The sub-project 2 dashboard reads
pre-grouped rows.

`country` and `ip_hash` are dropped on purpose. CSP violations are about
resources, not people. There is no per-subject analysis case, and dropping the
fields is cleaner data-minimization.

## Worker branch

Add an `else if (body.kind === "csp-report")` branch in
`code/shared/api/src/index.ts`, mirroring the `consent` branch:

- Validate each report field with the existing `str(v, max)` helper.
- Cap the `reports` array at 10. The surface route already truncates, so this is
  defense in depth.
- Build `group_key`, set `first_seen`/`last_seen` to the current ISO timestamp,
  and run the UPSERT.
- Return `201 { ok: true }`. DB unbound → 503. Write throw → 502.

Reuse the existing bearer gate (`safeEqual` against `APP_API_TOKEN`),
`AGENT_RATELIMIT`, and `BODY_MAX = 4000`. Ten sanitized records are roughly
2.5 KB, which stays under the cap. No `BODY_MAX` change.

## Cron purge

In `code/shared/cron/src/index.ts`, add one retention constant and one delete:

```ts
const CSP_RETENTION_DAYS = 30;
// inside the `if (env.DB)` block:
DELETE FROM csp_reports WHERE last_seen < ?   // retentionCutoff(scheduledTime, 30)
```

Add the row count to the existing log payload. Extend the `Env.DB` comment. The
schedule itself in `code/shared/cron/wrangler.toml` needs no change.

## Code layout

### `code/packages/shared/security/` (extend)

- `src/csp-report.ts` (new) — `normalizeCspReport`, `sanitizeCspReport`,
  `collapseRoute`, `isExtensionNoise`. Pure functions.
- `src/csp.ts` (edit) — `buildCsp` gains the Report-Only candidate.
- `src/headers.ts` (edit) — `securityHeaders` gains the `reporting` flag and the
  reporting headers.
- `src/index.ts` (edit) — export the new functions.
- `src/csp-report.test.ts` (new) — unit tests for the four functions.

### `code/packages/web/security-reports/` (new brick)

- `handleCspReport(request: Request): Promise<Response>` — reads the body,
  branches on content-type, normalizes, sanitizes, drops noise, forwards
  survivors. Always returns `204`, never reflects input.
- `forwardCspReports(records)` — `server-only`. Reads `process.env.API_URL` and
  `process.env.APP_API_TOKEN`. POSTs `{ kind:"csp-report", reports }` with the
  bearer header. Fire-and-forget. Mirrors `consent-log.ts`.
- Depends on `@indiecrafts/packages-shared-security` for the pure functions.

A future refactor could share one generic `/v1/events` forwarder between this
brick and `compliance`. Out of scope now — keep the diff surgical.

### Surface wiring

- `website` — already calls `securityHeaders({...})`. Add `reporting: true` and
  the `reportOnly` candidate config. Add `src/app/api/csp-report/route.ts`
  (`export const POST = handleCspReport`).
- `admin` — add an `async headers()` calling `securityHeaders({...})`. This is
  the first security header on admin. Add the same route.
- `app` — add `@indiecrafts/packages-shared-security` to `transpilePackages`,
  add `async headers()`, add the same route.

## Security considerations

The route accepts anonymous input by design, like `consent-log`. Harden it:

- **Method** — export `POST` only.
- **Content-type** — accept only `application/reports+json` and
  `application/csp-report`. Otherwise `415`.
- **Inbound size cap** — reject bodies over 64 KB with `413` before parsing.
- **Report cap** — process at most 50 inbound reports; forward at most 10. If the
  browser sends more, truncate and `console.warn`. No silent cap.
- **No reflection** — return `204` on every path, including parse failure. Log
  problems server-side only. Do not leak validation detail.
- **No raw storage** — sanitize before forward. Raw reports never persist.
- **Admin gate** — the admin surface gate must not block `/api/csp-report`. The
  browser posts without a session. Confirm the admin `proxy.ts` matcher and the
  `(dashboard)` group layout do not guard this route.

Residual risk: the browser → surface hop is not rate-limited (the worker hop is,
per client IP). Cloudflare in front of the Next app can rate-limit if abused. A
per-IP guard on the route is a later add, not built now.
`ponytail:` no inbound rate limit — add a per-IP guard if the endpoint is abused.

## Testing plan

- **Unit (security brick)** — `normalizeCspReport` for both formats;
  `sanitizeCspReport` route collapsing, origin reduction, snippet redaction;
  `isExtensionNoise`; `buildCsp` candidate omits `'unsafe-eval'` and named
  dropped sources.
- **Unit (worker)** — the `csp-report` branch: valid batch UPSERTs and increments
  `count`; oversized array is capped; missing fields rejected. Mirror the
  existing consent branch tests.
- **Unit (cron)** — `csp_reports` rows past 30 days are deleted, fresh rows kept.
  Mirror `retention.test.ts`.
- **Manual** — load a page with a deliberate inline violation, confirm a row lands
  with the right `document_path` and `disposition`.

## Docs and changelog

Update in lockstep with the code:

- `code/docs/apps/web/seo/security-headers.md` — document reporting and the
  Report-Only candidate.
- `code/docs/packages/security.md` — document the new `csp-report` functions and
  the `reporting`/`reportOnly` options.
- `code/shared/api/CHANGELOG.md` — the `kind:csp-report` branch and the migration.
- `code/shared/cron/CHANGELOG.md` — the 30-day purge.

## Out of scope (future sub-projects)

- **Sub-project 2 — admin dashboard.** A page under
  `code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/` that reads the
  aggregated `csp_reports` rows, grouped and filterable. It inherits the admin
  gate. Build it once the raw data proves worth a UI.
- **Sub-project 3 — enforcement.** Nonce or hash infrastructure in the surface
  `proxy.ts` files, removing `'unsafe-inline'`, a gradual rollout with a fast
  switch back to Report-Only, and production monitoring.

## Open questions

- The exact starting content of the Report-Only candidate per surface. Default is
  "enforced minus `'unsafe-eval'`". Which third-party sources, if any, to also
  drop in the first candidate is a tuning decision for the implementation, driven
  by what each surface actually loads.
