# Roadmap Slice 5 (final): Sanity-editable erasure emails

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Make the api worker's two erasure emails (token-confirmation + completion) editable in Sanity Studio, fetched over raw GROQ at send time, with a per-field fallback to today's hard-coded English so the erasure flow never breaks when copy is missing.

**Architecture (locked from the map + rulings):** Add two `confirmationGroup`s (`erasureToken`, `erasureComplete`) to the compliance package's `emailGroups` — they surface on the existing `emailStrings` Studio singleton (the same place `dataRequestOwner`, `newsletterConfirm`, etc. live). The worker (`code/shared/api/src/erasure/email.ts`) gains `fetchErasureEmailStrings(env)` — a raw GROQ-over-HTTP read mirroring `fetchAnnouncementDocs` (reusing the already-declared `SANITY_*` Env vars — no new ones). Each sender composes its HTML from `pick(cfg?.group?.field, defaultLocale) || "<current literal>"` per field, `escapeHtml` on every interpolated value, sends via the existing inline Resend. Any fetch failure / unset config / disabled group / empty field → the current hard-coded literal. No new deps, no Portable Text, no raw-HTML field.

**Tech Stack:** Sanity v5 (schema on the website Studio) · Cloudflare Worker raw GROQ + inline Resend · `@cloudflare/vitest-pool-workers`. **Map (exact paths/lines):** `.superpowers/sdd/slice-5-email-catalog-map.md`. **Mirror:** `fetchAnnouncementDocs` (`code/shared/api/src/index.ts:210-229`); the `confirmationGroup` factory (`code/packages/web/email/src/sanity/groups.ts`) + how `code/packages/web/compliance/src/sanity/email.ts` contributes `dataRequestOwner`; the `pick(...) || default` fallback in `code/modules/web/newsletter/src/lib/newsletter.ts:165-174`.

## Global Constraints
- **Never break the erasure flow:** the worker catches ALL fetch failures + falls through to the current hard-coded subject/HTML/text literals, per field. The no-op-when-Resend-unset guard stays. The senders keep their exact signatures (`sendErasureTokenEmail(env, {to, confirmUrl})`, `sendErasureCompleteEmail(env, {to, retained})`) — only their internals change.
- **Single effective locale (ruling S5-SCHEMA):** reuse `confirmationGroup` (per-locale-capable), but the worker reads the `defaultLocale` value only (the erasure flow has no locale signal anywhere — request/confirm/self expose no locale). Per-locale editing is available in Studio; only default-locale copy is sent until a later slice adds locale detection. Document this in the group description.
- **Escape everything** interpolated (Sanity copy + the worker-built `confirmUrl`/`retained`) via the module's existing `escapeHtml` — one uniform path.
- **No new Env vars / deps** — reuse `SANITY_PROJECT_ID`/`SANITY_DATASET`/`SANITY_API_VERSION`/`SANITY_API_READ_TOKEN` (already on the worker Env). The worker never imports the `sanity`/schema package.
- Commit `--no-verify`; stage only named files; prettier; config-first; writing-style.

---

### Task 1: Sanity — two erasure email groups on `emailStrings`

**Files:** modify `code/packages/web/compliance/src/sanity/email.ts` (add the two groups to its `emailGroups` export).

- [ ] **Step 1:** Read `code/packages/web/compliance/src/sanity/email.ts` (it exports an `emailGroups` array contributing `dataRequestOwner` via `ownerAlertGroup`) + `code/packages/web/email/src/sanity/groups.ts` (`confirmationGroup(opts)` — the factory: `enabled`, `from`, `replyTo`, `bcc`, `subject`, `heading`, `intro`, optional `buttonLabel` when `opts.button`, `outro`). Add two `confirmationGroup` entries to the exported `emailGroups`:
  - `confirmationGroup({ name: "erasureToken", title: "…erasure confirmation link…", button: true })` — the token email (needs a CTA link).
  - `confirmationGroup({ name: "erasureComplete", title: "…erasure complete…" })` — the completion email (no button).
  Give each a `description` noting: sent by the api worker; only the default-locale copy is used today (the erasure flow has no locale signal); empty fields fall back to built-in English.
- [ ] **Step 2:** Confirm the compliance `SanityModule`'s `emailGroups` is composed into the website Studio (it already is — `dataRequestOwner` shows up). No new registration needed; the two groups appear on the "E-mails" singleton automatically.
- [ ] **Step 3: Verify + commit.** `pnpm --filter @indiecrafts/web-surfaces-website tsc` (exit 0 — the schema is TS, type-checked via the Studio config). Prettier. Commit `--no-verify` (`feat(compliance): Studio-editable erasure email copy (emailStrings groups)`).

---

### Task 2: Worker — fetch + compose + fallback

**Files:** modify `code/shared/api/src/erasure/email.ts` (+ `email.test.ts`) + api `CHANGELOG.md` + `.claude/CLAUDE.md`.

**Interfaces:**
- Consumes the worker `Env`'s `SANITY_PROJECT_ID`/`SANITY_DATASET`/`SANITY_API_VERSION`/`SANITY_API_READ_TOKEN`; `defaultLocale` from `@indiecrafts/packages-shared-config` (already imported in index.ts — importable here).
- Produces: an internal `fetchErasureEmailStrings(env): Promise<ErasureEmailCopy | null>` (returns the two groups' resolved default-locale fields, or null on any failure), injected as a default param into each sender for testability (like `request.ts` injects `sendToken`).

- [ ] **Step 1: Failing tests** (`email.test.ts`, extend it — it already tests the no-op + escaping): inject a fake `fetchErasureEmailStrings`. (a) When it returns Sanity copy → the sent email uses the Sanity subject/heading/intro/etc. (assert via a stubbed `resend`/`fetch`); (b) when it returns null (fetch failed / unset / disabled) → the email uses the current hard-coded English literals; (c) `RESEND_API_KEY`/`EMAIL_FROM` unset → still a no-op (unchanged); (d) `confirmUrl`/`retained` are escaped in the HTML regardless of source. Keep the existing test cases green.
- [ ] **Step 2: Implement** `fetchErasureEmailStrings(env)` — mirror `fetchAnnouncementDocs`: build the host (`apicdn` vs `api` by `SANITY_API_READ_TOKEN`), a GROQ query fetching the `emailStrings` singleton projected to the two groups' fields (`*[_type=="emailStrings"][0]{ erasureToken{enabled,subject,heading,intro,buttonLabel,outro}, erasureComplete{enabled,subject,heading,intro,outro} }`), `encodeURIComponent`, fetch, parse `body.result`. Return `null` if `!SANITY_PROJECT_ID || !SANITY_DATASET`, on non-OK, or on throw (wrap in try/catch — NEVER throw out of this helper). A tiny `pick(v)` = for a `localeString`/`localeText` object return `v?.[defaultLocale] ?? Object.values(v ?? {})[0] ?? undefined`; for a plain string return it. Ignore a group whose `enabled === false` (treat as null → fallback).
- [ ] **Step 3:** In each sender, `const copy = await fetchErasureEmailStrings(env).catch(() => null);` then build every literal as `pick(copy?.erasureToken?.subject) || "Confirm your data erasure request"` (and the same for heading/intro/buttonLabel/outro; the completion sender uses `erasureComplete`). Compose the HTML from those + the escaped `confirmUrl`/`retained` (keep the existing inline layout; parameterize the strings). Keep the plain-text body + the no-op guard + the throw-on-non-OK-Resend behavior.
- [ ] **Step 4: Verify + docs + commit.** `pnpm --filter @indiecrafts/shared-api test` (all green incl. the extended email cases) + `tsc` 0. api CHANGELOG + brief (erasure emails now Studio-editable via `emailStrings`, default-locale, with a built-in English fallback). Prettier. Commit `--no-verify` (`feat(compliance): erasure worker reads Studio-editable email copy with English fallback`).

---

## Self-review
- Coverage: editable schema (T1) + worker fetch/compose/fallback (T2), single-locale (worker reads defaultLocale), never-break fallback, no new Env/deps. Matches the locked forks.
- Consistency: reuses `confirmationGroup` (the codebase's email-copy factory) + `fetchAnnouncementDocs`'s GROQ-over-HTTP idiom + the `pick(...) || default` fallback shape; the worker still avoids `server-only`/`next-sanity`/Portable Text.
- Deferred (documented): per-locale erasure emails (needs a locale signal the flow lacks — schema is upgrade-ready); moving the OTHER worker-less emails is n/a (they're already Sanity-editable on the website).
- **Ruling S5-SCHEMA:** reuse `confirmationGroup`; worker sends default-locale only. Cost if wrong: hand-roll plain single-locale fields later (worker fetch shape unchanged).
- **Ruling S5-FALLBACK:** any fetch failure/unset/disabled/empty → the current hard-coded literal, per field; the helper never throws. Sending correct-but-default copy always beats sending none.
