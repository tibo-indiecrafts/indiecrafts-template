# Worldwide W1: consent regimes + retention purges + global admin-BCC

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Extend the geo consent resolver to Brazil/Canada/South Africa/Australia (not China), close the two missing retention purges (`data_requests`, `erasure_requests`), and add a single global admin-BCC so every transactional email copies one address.

**Tech Stack:** TypeScript (pure resolver + Cloudflare Worker cron + the web/worker email layers). **Gap source:** `.superpowers/sdd/worldwide-compliance-inventory.md`. **Env note:** machine was overloaded (load ~120→recovering); allow extra time for tsc/tests, run in background if a command stalls.

## Global Constraints

- Config-first; pure/framework-agnostic where the code already is; commit `--no-verify`; stage only named files; prettier; writing-style. No China/PIPL.

---

### Task 1: Consent regimes — Brazil, Canada, South Africa, Australia

**Files:** `code/packages/shared/compliance/src/shared/regions.ts` (+ `regions.test.ts`); `code/docs/apps/web/config/cookie-consent-geo.md`.

- [ ] **Step 1: Update `regions.test.ts` first (failing).** Read the whole file. Add assertions: `resolveConsentMode("BR") === "opt-in"`, `"CA" === "opt-in"`, `"ZA" === "opt-in"`, `"AU" === "opt-out"`; `resolveRegulation("BR").name === "LGPD"`, `"CA"→"PIPEDA"`, `"ZA"→"POPIA"`, `"AU"→"Australia Privacy Act"`; and the inhabited AU territories `NF`/`CX`/`CC` → `"opt-out"`. Do NOT break existing assertions (`JP`/`GL` stay `"none"`; the existing territory/none lists don't include BR/CA/ZA/AU or NF/CX/CC — verify).
- [ ] **Step 2: Implement in `regions.ts`.** Add to `REGULATIONS`: `lgpd: { name: "LGPD", mode: "opt-in" }`, `pipeda: { name: "PIPEDA", mode: "opt-in" }`, `popia: { name: "POPIA", mode: "opt-in" }`, `privacyact: { name: "Australia Privacy Act", mode: "opt-out" }`. Add country arrays `const LGPD = ["BR"]; const PIPEDA = ["CA"]; const POPIA = ["ZA"]; const AUS = ["AU"];` and spread them into `CONSENT_REGIONS` (map each code → its key). In `TERRITORY_REGULATION`, add `NF: "privacyact", CX: "privacyact", CC: "privacyact"` (Australia's inhabited external territories; `HM` is uninhabited — skip). Update the module doc-comment's example line to mention the now-built-in LGPD/PIPEDA/POPIA/privacyact. Rationale to note in a comment: LGPD/PIPEDA/POPIA are consent-based → opt-in; Australia's APPs are notice-based with no cookie-consent-banner law → opt-out (a privacy-choices affordance, honors GPC). These are safe defaults; a deployment can still override via `ConsentConfig`.
- [ ] **Step 3:** Run `pnpm --filter @indiecrafts/packages-shared-compliance test regions` (green) + confirm the wider suite unaffected. Update `cookie-consent-geo.md` to list the newly built-in regimes + their modes.
- [ ] **Step 4: Commit** (`feat(compliance): built-in LGPD/PIPEDA/POPIA/Australia consent regimes`) — stage regions.ts, regions.test.ts, cookie-consent-geo.md only. `--no-verify`.

---

### Task 2: Retention purges — `data_requests` + `erasure_requests`

**Files:** `code/shared/cron/src/index.ts` (+ `src/index.test.ts`); `code/docs/apps/web/config/data-retention.md`.

- [ ] **Step 1:** Read `cron/src/index.ts` (it has `retentionCutoff` + the existing 4-table purge + the Slice-3 SLA/export passes). Add two retention constants: `const DATA_REQUEST_RETENTION_DAYS = 365;` (operational PII — a year to action + prove) and `const ERASURE_REQUEST_RETENTION_DAYS = 1095;` (proof-of-erasure, kept like consent proof).
- [ ] **Step 2: Failing tests** (`index.test.ts`): seed a `data_requests` row with `submitted_at` older than 365d and one newer → after `scheduled`, the old one is deleted, the new one kept; seed an `erasure_requests` row with `requested_at` older than 1095d and one newer → old deleted, new kept. (Reuse the test harness + migrations already wired in Slice 3.)
- [ ] **Step 3: Implement** in the existing `if (env.DB)` purge block (idempotent, try/catch + rethrow like the others): `DELETE FROM data_requests WHERE submitted_at < ?` bound `retentionCutoff(scheduledTime, DATA_REQUEST_RETENTION_DAYS)`; `DELETE FROM erasure_requests WHERE requested_at < ?` bound `retentionCutoff(scheduledTime, ERASURE_REQUEST_RETENTION_DAYS)`. Add both counts to the `logger.info("retention purge", {...})` payload.
- [ ] **Step 4:** `pnpm --filter @indiecrafts/shared-cron test` (green) + `tsc`. Update `data-retention.md`: `data_requests` (365d) + `erasure_requests` (1095d, proof) are now cron-purged — remove the "future follow-up" caveats. Commit (`feat(compliance): cron purges data_requests + erasure_requests`) — stage cron index.ts + test + data-retention.md.

---

### Task 3: Global admin-BCC (every transactional email copies one address)

**Files:** the website email send layer (`code/packages/web/email/src/resend.ts` or `send.ts` — investigate) + the worker `code/shared/api/src/erasure/email.ts` `resend()`; `.env.example` on the website + the api worker + the worker `Env`; docs.

- [ ] **Step 1: Investigate the two send layers.** Read `code/packages/web/email/src/` (the `sendEmail`/`resend` implementation — where the Resend POST is built) and `code/shared/api/src/erasure/email.ts`'s inline `resend()`. Both build a Resend `emails` POST body (`to`/`from`/`subject`/`html`…). The global admin-BCC is: read a single env var (`EMAIL_ADMIN_BCC`) and, when set, append it to the `bcc` array of EVERY send from both layers.
- [ ] **Step 2: Website layer.** In `packages/web/email`'s send function, read `process.env.EMAIL_ADMIN_BCC` and merge it into the outgoing `bcc` (union with any per-group bcc; dedupe). A test asserts: with `EMAIL_ADMIN_BCC` set, a send includes it in bcc; unset → unchanged.
- [ ] **Step 3: Worker layer.** In `erasure/email.ts`'s `resend()`, add `EMAIL_ADMIN_BCC?` to `MailEnv`, and when set include `bcc: [env.EMAIL_ADMIN_BCC]` in the Resend POST body. Extend `email.test.ts`: with `EMAIL_ADMIN_BCC` set → the POST body carries the bcc; unset → no bcc. (Keep the no-op-when-RESEND-unset guard first.)
- [ ] **Step 4: Wiring + docs.** Add `EMAIL_ADMIN_BCC=` (commented, with a note: every transactional email is BCC'd here — set your admin/DPO address) to the website `.env.example` AND the api worker `.env.example`/`wrangler.toml` `[vars]`-or-secret as appropriate (it's an address, `[vars]`-safe on the worker; website env). Doc it in `data-retention.md` or an email doc: the global admin-BCC + that per-group bcc still works alongside it.
- [ ] **Step 5:** `pnpm --filter @indiecrafts/packages-web-email test` (+ website tsc) and `pnpm --filter @indiecrafts/shared-api test email` green. Commit (`feat(compliance): global EMAIL_ADMIN_BCC copies every transactional email to the admin`) — stage only the send layers + tests + env/doc files.

---

## Self-review

- Coverage: 4 regimes (not China) + 2 retention purges + global admin-BCC. Matches the W1 scope.
- Consistency: regimes reuse the existing extensible resolver; purges reuse `retentionCutoff` + the cron pattern; admin-BCC reuses both existing Resend send paths (no new email infra).
- Ruling W1-AU-MODE: Australia → `opt-out` (notice-based APPs, no cookie-consent-banner law) vs LGPD/PIPEDA/POPIA → `opt-in` (consent-based). Overridable per deployment. Cost if wrong: a config override flips it.
- Ruling W1-BCC-ENV: the global admin-BCC is an env var (`EMAIL_ADMIN_BCC`) read by both send layers — one place to set, applies everywhere; per-group Studio bcc still composes. Cost if wrong: move to a Sanity site-settings field later (fetch shape already exists in the worker).
