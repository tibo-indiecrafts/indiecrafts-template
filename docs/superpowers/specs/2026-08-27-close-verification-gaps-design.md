# Close verification gaps — design spec

- **Date:** 2026-08-27
- **Branch:** `feat/close-verification-gaps` (worktree off `main`)
- **Source audit:** the "Green to Ship" review — coverage, pipeline, feature inventory, security.
- **Companion artifact:** the review page is the live progress board. Each closed gap is tagged `DONE` there.

## Goal

Close the main gaps the audit found. Make the pipeline gate what ships, close the
security holes, and cover the untested crown-jewel paths. Every change lands with a
colocated test and a green CI.

## Scope

Full program, three phases. Decisions taken with the user:

- **Deploy gate:** both — an in-repo `workflow_run` trigger AND a branch-protection doc.
- **Branch:** a fresh worktree off `main`, clear of the in-flight admin work.
- **Out-of-band Clerk delete:** run the full erasure engine via `ctx.waitUntil` (not a queue).
- **Account self-delete reverification:** all four surfaces in this pass.
- **Worker guard coverage:** a runtime auth-contract test, not a static grep.

Order: **P0 first** (fast, low-risk), then P1, then P2. The program spans more than one
work session.

## Non-goals

- No new abuse defense for the default install. Public POST fail-open is by design
  (rate-limit + Turnstile arm on config). The fix is a launch checklist, not code.
- No shop/orders feature. The orders erasure adapter stays a stub; we make it honest.
- No change to the Cloudflare edge/WAF posture (inert until a real zone — documented debt).

---

## Phase 0 — Pipeline integrity

Mechanical workflow + CI config. No app-code behavior change. Verified by triggering CI,
not by unit tests.

### 0.1 Gate deploy on CI

- **File:** `.github/workflows/deploy.yml`.
- **Change:** replace the `push: [main]` trigger with `workflow_run` on the `CI` workflow,
  `types: [completed]`, `branches: [main]`. Gate the `discover` job on
  `github.event_name == 'workflow_dispatch' || github.event.workflow_run.conclusion == 'success'`.
  Keep `workflow_dispatch` for manual dev/staging/prod.
- **Effect:** a prod deploy fires only after CI passes on `main`. A red CI blocks the deploy.
- **Note:** `workflow_run` carries no `inputs.environment`, so the existing
  `github.event.inputs.environment || 'prod'` default still resolves to `prod`.
- **Plus:** a branch-protection doc — the exact steps to add CI as a required status check —
  in `code/docs/apps/web/setup/deployment.md`. Belt and suspenders.

### 0.2 Run the secret gates on push, not PR-only

- **File:** `.github/workflows/test.yml`.
- **Change:** drop the `if: github.event_name == 'pull_request'` guard on `secrets-scan` and
  `dependency-review`, so both run on push to `main`.
- **Detail:** `gitleaks` scans a commit range and works on push as-is.
  `dependency-review-action` is PR-shaped; for the push case it needs explicit
  `base-ref`/`head-ref` (the push `before`/`after` SHAs). Confirm the action's push support
  during implementation; if it cannot run on push, keep it PR-only and rely on the
  now-CI-gated deploy plus gitleaks-on-push.

### 0.3 Fold the missing gates into CI

- **File:** `.github/workflows/test.yml`, the `verify` job.
- **Change:** add discrete steps — `pnpm check:api-guards`, `pnpm tokens:check`,
  `pnpm brands:check`, `pnpm check:tasks`.
- **Why discrete, not `pnpm verify`:** the CI `verify` job already runs the pieces; a blanket
  `pnpm verify` would re-run `turbo run verify` (a second test pass). Discrete steps keep CI
  granular and fast.

---

## Phase 1 — Security correctness

Behavior changes. Each lands test-first (a failing test, then the fix).

### 1.1 Make the orders erasure adapter honest

- **File:** `code/shared/api/src/erasure/orders.ts`.
- **Problem:** the no-op stub reports `orders: {}` as success. A real erasure/export would
  silently skip order data.
- **Change:** return an explicit `notApplicable` status (no orders store) that surfaces in the
  receipt — not an empty success. Keep the adapter in the live set.
- **Test:** assert the receipt marks orders `notApplicable`, never a silent `{}`.

### 1.2 Out-of-band Clerk delete runs the full engine

- **File:** `code/shared/api/src/index.ts` — the `user.deleted` webhook branch.
- **Problem:** it pseudonymises only the `user_profiles` row. Session, security, Sanity, and
  consent data survive a dashboard-initiated delete.
- **Change:** run `runErasure` for the subject inside the webhook, dispatched via
  `ctx.waitUntil` so the webhook returns fast and the erasure completes in the background.
- **Test:** a `user.deleted` event triggers the full engine across every adapter; the webhook
  still returns 200 immediately.

### 1.3 Account self-delete step-up reverification

- **Files:** the `AccountDeletePanel` on `website` + `app`, and the delete flow on `mobile`
  (`sign-in.tsx`) + `hybrid` (`auth.tsx`). Four surfaces.
- **Problem:** `@debt SECURITY` — no reverification before self-erasure. A hijacked live
  session can delete the account. The typed-email gate is not a second factor.
- **Change:** require a fresh Clerk reverification (`__session` step-up / `reverify`) before the
  destructive call. Confirm the exact Clerk primitive per surface during implementation.
- **Test:** the destructive call is unreachable without a fresh reverification.

### 1.4 Worker auth-contract test (guard coverage for `/v1/*`)

- **File:** a new colocated test in `code/shared/api/src/`.
- **Problem:** `check:api-guards` scans `code/projects` route files only; the bare worker's
  `/v1/*` routes rely on convention.
- **Change:** enumerate every mutating `/v1/*` route; assert each rejects an unauthenticated
  request (401/403). A new route reachable without auth fails the test. This replaces
  extending the Next-shaped static grep onto the worker.

### 1.5 Pre-launch security checklist

- **File:** a new doc under `code/docs/apps/web/setup/` (or extend `security-hardening.md`).
- **Content:** the operator steps that arm the default-off defenses before a real launch —
  bind `RATE_LIMIT_KV`, set `TURNSTILE_SECRET`, apply the Cloudflare zone, configure Clerk so
  the admin gate is live, set `GDPR_FINGERPRINT_SALT`. States the default-install posture
  plainly.

---

## Phase 2 — Coverage & breadth

### 2.1 Crown-jewel tests (colocated, test-first)

- Admin `actions.ts` — `grantAdmin`/`revokeAdmin`/session actions reject a non-admin.
- Blog `code/modules/web/blog/src/sanity/queries.ts` — the public filter excludes noIndex,
  scheduled, and draft posts; pin-order holds.
- Website `src/proxy.ts` — CSP nonce + maintenance fail-open.
- Website `src/app/sitemap.ts` — gating (feature/noindex/editor toggle).
- Newsletter `deliver-magnet.ts` — signed token, 403 without secret, TTL.
- `code/packages/web/sanity/image.ts` — the CDN loader rewrite.

### 2.2 Surface e2e

- `app` — a boot + smoke journey.
- `admin` — an auth-gate journey (redirect when unauthenticated; render when admin).
- New per-surface Playwright wiring, following the website pattern.

### 2.3 Worker coverage

- `cron` — retention cutoffs and the SLA-flag idempotency.
- `agent` + `workers` — thicken the thin suites.

### 2.4 Page-builder renderer tests

- The merge/dedupe/re-sort logic in the `ui-components` frontpage renderers — unit, not just
  stories.

### 2.5 Visual baselines + promote gates

- Generate linux visual baselines on the CI platform; commit them.
- Drop `continue-on-error` on `browser-e2e` once baselines are trusted, promoting the
  deterministic journeys to blocking.

### 2.6 Bundle budget + optional pre-push

- Calibrate `BUDGET_KB` in `scripts/check-bundle-size.mjs` and add `--enforce`.
- Optional: a light pre-push hook running `turbo run tsc` across all workspaces, so
  non-website edits get a local type backstop.

---

## Testing approach

- TDD throughout — the repo's `test-pass` loop. A failing test first for every behavior fix.
- Tests are colocated (`*.test.ts` beside the source); e2e journeys under each surface's `e2e/`.
- Each change runs its review lens from the audit matrix (security-analyzer, compliance,
  page-builder, config-consistency, architecture).

## Risks & mitigations

- **`workflow_run` gate misconfig** could block all deploys. Mitigation: keep
  `workflow_dispatch` as a manual escape hatch; test on a dev target first.
- **`ctx.waitUntil` erasure** adds work to the webhook path. Mitigation: it runs after the
  200 response; a failure logs and does not block the webhook. Revisit a queue if volume grows.
- **Step-up reverification** changes the delete UX on four surfaces. Mitigation: land web
  first behind the test, then replicate; confirm the Clerk primitive before wiring each.
- **dependency-review on push** may be unsupported. Mitigation: fall back to PR-only + the
  CI-gated deploy; documented in 0.2.

## Sequencing & artifact updates

- Land P0 as one reviewable batch, then P1, then P2.
- After each item lands, tag it `DONE` in the review artifact (same URL), with the commit.
- Log each change in its area `CHANGELOG.md` at its home altitude.

## Issue tags

- `@debt SECURITY` — closed by 1.3 (account self-delete reverification, ×4 surfaces).
- `@debt TESTING` — closed incrementally by Phase 2.
