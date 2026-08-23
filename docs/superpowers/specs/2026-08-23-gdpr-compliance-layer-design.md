# GDPR / worldwide compliance layer — design

Date: 2026-08-23 · Status: draft for review · Branch: feat/auth-security-events

A cross-surface compliance layer for the indiecrafts monorepo: consent capture (incl. at login),
a server-side consent log, a user profile created on login, automated erasure + pseudonymisation,
data export, a content take-down (DSA/DMCA) module, all compliance forms, Sanity-editable emails,
salt management, retention, accountability records, and ported legal pages. Pattern source: the
wahio SaaS (`~/Code/sass-prod/wahio`, Supabase). Target stack: **Clerk + Cloudflare D1 (EU) + Sanity**.

---

## 1. Decisions (locked with the user)

- **Target:** all surfaces — website, app, admin, mobile, hybrid.
- **Data stack:** all data on **Cloudflare D1** (no Postgres/Supabase) + Clerk (identity) + Sanity
  (content). At scale, split into several D1 databases by concern (§6.3). Erasure engine is
  store-agnostic (adapters), so splitting is a config change, not a rewrite.
- **User profile:** a small D1 `user_profiles` row **created on login**, and pseudonymised on erasure.
- **Erasure:** automated, user-token-confirmed, plus a standalone anonymisation/pseudonymisation feature.
- **Cookie consent:** keep GA + Consent Mode v2. Log consent server-side for authenticated users,
  marketing opt-ins, and legal re-acceptance; anonymous cookie clicks stay client-side by default
  (`logAnonymousConsent` flag, off).
- **Email change:** self-service, Clerk-verified, synced to the profile.
- **Take-down + DSAR records → D1**, not Sanity.
- **Legal content:** port wahio's reviewed text into Sanity; add a content-guidelines page; a
  human/legal review gate before publish.
- **Selling:** yes, future — transactional branch designed-in, config-activatable (§5).

## 2. Current state — reuse vs gaps

**Reuse (do not rebuild):** geo→regulation→consent-mode resolver + consent math
(`packages/shared/compliance`); 5 legal pages, cookie runtime (Consent Mode + GPC), re-acceptance
banner, DSAR intake for 7 rights → Sanity ticket + DPO email (no auto-delete) (`packages/web/compliance`);
`DataRequestForm` (`packages/web/ui-components`); EU D1 (`code/shared/api/db/d1/migrations/0001_init.sql`:
`admin_audit`/`session_events`/`security_events`, salted IP hash, 90-day purge, unused erasure
indexes); api worker (`/v1/events`, `/v1/clerk-webhook`, inline bearer + rate-limit guard); Clerk
auth all surfaces + `SessionLogger`; blog comment **one-click token-email moderation**
(`modules-web-blog/lib/moderate`, `/api/comments/moderate` — POST-only, single-use, prefetch-safe);
Sanity-editable email system (`packages/web/email` + `emailStrings` + `renderEmailLayout`); Turnstile
(edge config) + per-route `security.ts` rate limits; `data-retention.md` disclosure checklist.

**Gaps this plan fills:**
- **Salt:** `IP_HASH_SALT` is wired but operator-set — **assume not configured**; `GDPR_FINGERPRINT_SALT`
  does not exist yet.
- **Anonymisation:** none — only a *manual* Art. 17 SQL is documented; no engine.
- No server-side consent log, no user profile store, no automated erasure/export, no take-down module,
  and no accountability records (ROPA, sub-processors, breach, transfers).

## 3. What is required worldwide (comply where your users are)

| Mechanism | Required in | Applies if |
|---|---|---|
| Cookie/tracker consent (opt-in) | EU/EEA/UK/CH (ePrivacy) | non-essential cookies (GA) — **yes** |
| DSAR (access/erasure/rectify/portability/object/restrict) | EU/UK (GDPR), US-CA (CCPA), BR (LGPD), CA (PIPEDA) | process personal data — **yes** |
| "Do Not Sell/Share" opt-out + GPC honouring | US-CA/CO/VA (CPRA+) | sell/share PII for ads — **future** |
| Notice-and-action + statement of reasons + appeal | EU (DSA) | host user content (blog comments, app UGC) — **yes** |
| Copyright takedown + counter-notice + repeat-infringer + agent | US (DMCA safe harbor) | US-facing UGC — if US |
| Illegal-content timelines | DE (NetzDG), UK (OSA) | large platforms — likely no |
| Legal imprint (Impressum) | DE/AT/CH | sell to German markets — if |
| Age assurance / parental consent | EU (Art. 8), US (COPPA <13), UK Children's Code | knowingly process minors — if |
| Terms / Privacy / Cookie policies | ~everywhere | **yes** |
| Breach notification (72h) · ROPA · SCCs for transfers | EU (GDPR) | always — **yes** (§15) |

**Baseline:** GDPR + ePrivacy + FR/CNIL (+ DE Impressum if selling there) covers EU/EEA/UK. Add DSA
for UGC; DMCA only for US-facing UGC; CCPA/OSS on selling. LGPD/PIPEDA/etc.: add on launch.

## 4. Selling in the future — transactional branch (idle behind config)

Design in now, activate on first sale: CGV (terms of sale) page ships (invoice/refund clauses added
live); orders/invoices **7–10y** anonymised retention reserved; an **orders/product erasure adapter**
seam (anonymise financial rows by salted fingerprint — wahio's `anonymize_user_orders`); **CCPA "Do
Not Sell/Share"** on US launch; **OSS/VAT** on EU cross-border. Build the seams + config + retention
windows now; build the order pipeline only when there is a `product` D1 and a checkout (§6.3).

## 5. Pseudonymisation, salts & fingerprints (read this — it is a correctness point)

Hashing an email with a **retained salt** is *reversible with that salt* → under GDPR the result is
**pseudonymised data, still personal data**, not anonymised. Therefore:

- "Erasure by anonymisation" is really **pseudonymisation**: on erasure we scrub direct identifiers
  and keep a salted `email_fingerprint` only where a record is under a legal retention duty (invoices,
  security). Those rows **remain in scope** for retention limits.
- **True anonymisation happens only at final purge**, when the fingerprint is dropped too (end of the
  7–10y / retention window). The retention cron drops the fingerprint at that point.
- **Salts:** two `wrangler secret`s — `IP_HASH_SALT` (exists) + `GDPR_FINGERPRINT_SALT` (new). Add
  `fingerprintEmail(email, salt)` to `packages/shared/security` beside `hashIpAddress`. New
  `pnpm gdpr:salt:{generate,set,verify,status}` (mirrors wahio's `gdpr-salt.sh`) reusing the existing
  `secrets:sync` tooling. **Rule:** one salt per purpose, identical across all envs, never committed;
  the salt is the sensitive re-identification key — rotate only with a re-fingerprint migration.

## 6. Architecture & data stores

### 6.1 Store map
- **Clerk** — canonical identity + credentials (all surfaces). Source of truth for email.
- **Cloudflare D1 (EU, `weur`)** — relational compliance/product data (§6.2).
- **Sanity** — editorial content + marketing lists (legal pages, cookie copy/table, subscribers, waitlist).
- **Google Analytics** — behind Consent Mode v2. **Analytics Engine / R2** — any future high-rate
  telemetry firehose (NOT D1).

### 6.2 D1 tables — migration `0002_*.sql`
- **`user_profiles`** — the small user DB, **created/updated on login**. `user_id` (Clerk PK), `email`,
  `full_name?`, `locale?`, `email_fingerprint`, `created_at`, `last_login_at`, `deleted_at`, `anonymized`.
  Written by (a) the session-log path on each sign-in (upsert; creates if missing; stamps `last_login_at`)
  and (b) the Clerk webhook (`user.created/updated/deleted`; source of truth for email/deletes). Primary
  target of pseudonymisation (§9.3).
- **`consent_events`** — append-only proof. `ts`, `subject_type` (visitor|user), `subject_id`,
  `email_fingerprint?`, `consent_type` (cookie_analytics|cookie_marketing|marketing_email|terms|privacy|
  content_guidelines), `granted`, `policy_version`, `surface`, `source`, `country`, `ip_hash`,
  `idempotency_key`. ~3y retention (not the 90-day purge).
- **`data_requests`** — the 6 non-erasure DSAR rights. `ts`, `type`, `email`, `email_fingerprint`,
  `message`, `status`, `verified`, `policy_version`, `locale`, `source`, `due_at`, `resolution`, `resolved_at`.
- **`erasure_requests`** — erasure lifecycle + token. `status` (pending→email_sent→confirmed→completed|
  cancelled|expired), `token_hash`, `token_expires_at`, `attempts`, `user_id?`, `email_fingerprint`,
  `requested_at`, `confirmed_at`, `completed_at`, `due_at`, `result` (receipt JSON).
- **`content_reports`** — DSA/DMCA. `ts`, `target_ref`, `category` (illegal|copyright|privacy|other),
  `legal_ground`, `reporter_email?`, `description`, `sworn`, `status`, `decision`, `statement_of_reasons`,
  `appeal_grounds`, `appeal_status`, `due_at`, `resolved_at` + a transparency-metrics view.

D1 has no triggers/RLS/pg_cron — pseudonymisation, retention, access control, and idempotency are
explicit worker code (testable; wahio flags its trigger-ordering as fragile).

### 6.3 Topology at scale — all-D1, several databases
Each D1 is one SQLite instance with a ~10 GB cap and a single-writer throughput ceiling. At scale,
split by concern to isolate write hotspots, stay under the cap, and contain the PII blast radius:

- **`identity`** — `user_profiles` + `consent_events` + `data_requests`/`erasure_requests`/`content_reports`.
- **`audit`** — `session_events` + `security_events` + `admin_audit` (today's DB, 90-day purge).
- **`product`** — orders/catalog/commerce (future).

No cross-D1 JOINs — join by `user_id` in app code; the erasure engine treats each D1 as an adapter.
Enable **D1 read replication** (Sessions API) on read-heavy DBs. Start single-D1; split as size/
throughput demand. High-rate telemetry → Analytics Engine/R2, never D1.

## 7. Consent

### 7.1 Capture (all surfaces, keep GA)
The existing web banner/Consent Mode v2/GPC stays. Add: every consent decision POSTs `kind:"consent"`
to the api (anonymous `consent_id` cookie as subject, `user_id` when logged in). Native/hybrid
`shared/compliance` stores do the same via the shared client. Account-linked by default; anonymous
cookie logging only when `logAnonymousConsent` is on. A **cookie audit** enumerates real cookies/
trackers into `cookieEntry`; third-party embeds (YouTube/maps/fonts) are consent-gated via `ConsentGate`.

### 7.2 Login / signup consent
Clerk hosted UI + a post-signup `ConsentGate` (OAuth-safe via a metadata check on first authenticated
load). **Mandatory** legal acceptance (Terms + Privacy, + CGV/Content-Guidelines per surface) via
Clerk's native legal-consent requirement backed by the gate. Marketing opt-in separate + **unticked**
(pre-ticked consent is invalid — CJEU *Planet49*). Each decision → `consent_events` + Clerk
`publicMetadata` + the `user_profiles` row.

### 7.3 Email change (self-service, confirmed)
Clerk's built-in email management: add new address → Clerk verification (code/link) → set primary.
The `user.updated` webhook syncs the new email into `user_profiles` and re-computes `email_fingerprint`.
Never switch before Clerk confirms. Log an `admin_audit` line; send a Sanity-editable confirmation to
**both old and new** address (notifying the old address makes a hijack visible).

## 8. Data-subject rights

### 8.1 Forms catalog (config-gated per surface; ≈9 UI surfaces)
One DSAR form serves access/rectify/restrict/object/withdraw (reuses `DataRequestForm`). Erasure is its
own request + email-token confirm. Report/DMCA is one form with a category; appeal/counter-notice is one
form. Full set: DSAR · erasure request · erasure confirm · self-serve export/withdraw (settings) ·
cookie banner + preferences (exists) · login/signup `ConsentGate` (+ age gate, conditional) ·
re-acceptance banner (exists) · newsletter + waitlist (exist) · report-illegal-content/DMCA · appeal ·
DPO contact (exists) · admin console forms. All forms: **i18n in `messages/<locale>.json`**,
**WCAG-accessible**, **Turnstile + honeypot** protected.

### 8.2 Identity verification (prevents data leaks)
Access, portability, and rectification **disclose or change data** → verify the requester is the subject
before acting (GDPR Art. 12(6)): a logged-in session, or a verified-email token plus step-up where doubt
exists. The controller may refuse or request more proof. Erasure uses the token + typed-email + attempt
limit. No disclosure on an unverified request.

### 8.3 Erasure + pseudonymisation engine (store-agnostic)
Pure orchestrator in `shared/compliance`; `ErasureAdapter { name; findByEmail; export; anonymize; delete; preview }`.
Adapters (server-side):
- **Clerk** — delete user; email→user_id resolver.
- **D1** — pseudonymise `user_profiles` (email→`deleted_<id>@anonymized.local`, `full_name`→"Deleted User",
  set `email_fingerprint`/`deleted_at`/`anonymized`; wahio's `soft_delete_user_profile`); delete low/medium
  `session`/`security` events; pseudonymise high/critical + `consent_events` to fingerprint; retain
  `admin_audit`.
- **Sanity** — `subscriber`/`waitlistEntry`/legacy → pseudonymise email→fingerprint, mark erased.
- **orders/product** — seam only (future).

Flow: request → `erasure_requests` row + emailed single-use token → user confirms (typed email, TTL,
attempt-limited) → **dry-run preview** (what will be touched) → engine runs all adapters → receipt on
`erasure_requests.result` + `admin_audit` line + confirmation email. **Standalone anonymisation** = the
`anonymize()` half, exposed for the admin console + the retention cron. Rows are kept for integrity;
the cron hard-deletes (drops the fingerprint) at the retention limit (§13).

### 8.4 Export completeness
Export gathers the subject's data across **every** store — Clerk profile, all D1 tables, Sanity
subscriber/waitlist, consent history, future orders — into machine-readable JSON, delivered by a
secure, expiring link. A test asserts the export enumerates every registered store (no silent miss).

### 8.5 SLA clock
Every `data_requests`/`erasure_requests`/`content_reports` row stamps `due_at` (GDPR 1 month, DSA
timelines). The cron flags approaching/breached deadlines → owner reminder emails + an admin badge.

## 9. Content take-down (DSA / DMCA)
Config-gated (`features.compliance.takedown`; on for blog comments). Public report/DMCA forms →
`POST /v1/reports` → `content_reports`. Admin workflow: acknowledge → decide → **statement of reasons**
(emailed) → **appeal**. DSA transparency-metrics view feeds the annual report. Reviewer actions reuse
the token-email one-click pattern.

## 10. API (existing api worker, bearer-gated)
`POST /v1/events` (+`kind:"consent"`) · `/v1/erasure/request` · `/v1/erasure/confirm` ·
`GET /v1/erasure/status/:token` · `POST /v1/export` · `POST /v1/reports` (+`/appeal`) · extend
`/v1/clerk-webhook` (idempotent `user_profiles` upsert). Web `/api/*` routes proxy where the form is on
the website/app surface. All mutating routes: bearer + rate-limit + Turnstile where public.

## 11. Emails — Sanity-editable, owner alert + user confirmation
All via `packages/web/email` (`renderEmailLayout` + `emailStrings` singleton), Sanity-editable, gated on
`RESEND_API_KEY`, localised by the subject's `locale`:

| Event | Owner/DPO | User |
|---|---|---|
| DSAR filed | new-request alert | acknowledgement (≤1 month) |
| Erasure requested | alert | **token link** (the button click) |
| Erasure completed | receipt | deletion-complete + what was retained & why |
| Export ready | — | secure download link |
| Consent changed | — | opt-in/opt-out confirmation |
| Newsletter/waitlist | alert (exists) | double-opt-in (exists) |
| Report filed | reviewer alert | reporter acknowledgement |
| Report decided | — | statement of reasons + appeal steps |
| Appeal resolved | alert | outcome notice |
| Email change | — | Clerk verification + confirmation to **old + new** |
| SLA breach imminent | reminder | — |
| Breach notification (§15) | DPA + internal | affected-user notice |

## 12. Admin compliance console (existing Clerk-gated admin app)
Subscriber/waitlist CRUD stays in Sanity Studio. Add under `/admin/compliance/`: `requests` (DSAR +
erasure queue; anonymise/erase-now; dry-run) · `reports` (take-down + appeals + statement of reasons) ·
`subject` (search by email across Clerk+D1+Sanity → export/anonymise/erase) · `consent` (history lookup) ·
`transparency` (DSA export) · `breach` (log + notification workflow, §15). Every action → `admin_audit`.
**Least privilege:** a `compliance-officer` role gates erase/export beyond plain `admin`.

## 13. Retention (existing cron worker)
audit/session/security 90d (exists) · `consent_events` ~3y · request receipts 1–3y (tokens dropped on
completion) · `content_reports` per policy · Sanity `pending` subscribers >30d · **anonymised
`user_profiles` hard-deleted after 90d** · **orders/invoices 7–10y** anonymised (reserved) · **final
purge drops `email_fingerprint`** (true anonymisation). Periods in config, not code.

**Backups vs erasure:** D1 backups have their own retention; you cannot surgically delete from a backup.
Document that erasure propagates to backups on the **backup-cycle expiry**, and keep backup retention
short enough to bound that lag. State it in the privacy policy.

## 14. Accountability & governance (Art. 5(2), 30, 33/34, Ch. V)
- **ROPA (Art. 30):** a maintained records-of-processing register (doc + a generated summary from the
  config's processing map).
- **Sub-processors + DPAs:** a maintained sub-processor list (Cloudflare, Clerk, Resend, Sanity, Google)
  — a public page + signed DPAs on file.
- **Lawful-basis map + LIA:** a documented basis per processing (profile, marketing=consent, audit/
  security=legitimate interest, orders=contract) + a legitimate-interest assessment for the LI ones.
- **International transfers (Ch. V):** Clerk (US) + Resend (US) are US processors → SCCs + a transfer
  risk assessment, disclosed in the policy.
- **Breach notification (Art. 33/34):** a runbook — classify a `security_events` incident → notify the
  DPA within **72h** + affected users where required; templates in Sanity (§11); an admin `breach` view.
- **DPO / DPIA:** assess whether a DPO (Art. 37) is required (document the conclusion); run a DPIA
  (Art. 35) for profiling/large-scale processing if triggered.

## 15. Security & operations
- **Webhook idempotency + reconciliation:** Clerk retries webhooks → idempotency keys; a periodic
  Clerk↔D1 reconcile job catches missed events.
- **Backfill:** a one-time Clerk→D1 seed so existing users get a `user_profiles` row (else they are
  invisible to erasure until next login).
- **Abuse:** Turnstile + rate-limit + honeypot on public forms; token + attempt-limit on erasure to block
  malicious mass-erasure.
- **Observability (Cloudflare):** metrics/alerts on erasure success/failure, failed emails, SLA breaches.
- **Migrations:** D1 forward-only (expand→migrate→contract); `0002` ships with the backfill + a documented
  no-down-migration note.

## 16. Legal content port + page updates
Sources: wahio `front/src/app/[locale]/(public)/{privacy,terms}/content-{fr,en,de}.tsx` + `report/illegal`;
ProtonDrive `wahio_legal/` docx (privacy, CGV, Directives de Contenu, FR). Convert docx (`textutil`/
`pandoc` → PortableText import) + lift TSX into Sanity `legalPage` per (pageKey, locale) FR/EN/DE. Add a
6th page `contentGuidelines` to `LEGAL_PAGES` (update every consumer: `pages.ts`, `site-seo.ts`,
`legalPageQuery`, routing) + wire the illegal-content report form to it. Update all pages with the new
disclosures (D1 logging, consent, erasure, retention, processors + SCCs, cookie declaration, backups).
**Prose is ported, not invented — legal-review gate before publish.**

## 17. i18n & accessibility
Every new form + email string lives in `messages/<locale>.json` (repo NEVER: no inline strings), FR/EN
(+DE where wahio content exists). Every form meets the repo's a11y gates (labels, focus, error states,
keyboard).

## 18. Config & feature flags
One config declares: active regulations, retention windows, salt names, the processing/ROPA map, the
erasure-adapter registry (which stores hold PII), sub-processors, and `features.compliance.*` /
`features.legal.*` per surface (incl. `logAnonymousConsent`, `takedown`, `ageGate`, `selling`).

## 19. Sanity → D1 extraction
Move `dataRequest` records to D1 (`data_requests` + `erasure_requests`); deprecate the Sanity
`dataRequest` schema, keep the form. Keep in Sanity: legal content, cookie copy + `cookieCategory`/
`cookieEntry` table, re-acceptance copy, subscriber/waitlist. Rule: **content & copy → Sanity;
workflow, proof logs & legal records → D1.**

## 20. Packaging
Extend `shared/compliance` (erasure core, consent contract, fingerprint, ROPA/processing map) +
`web/compliance` (Sanity adapter, consent POST, confirm/export/report pages, DSAR→D1, email templates +
Sanity email groups) + `web/email` (reuse) + `shared/security` (`fingerprintEmail`) + api worker (routes,
idempotent webhook, migration `0002`, backfill) + cron (retention, SLA, reconcile) + admin (console) +
`web/ui-components` (report, appeal, ConsentGate, manage-consent, export forms) + config/docs/changelog/
registry rows. New bricks follow the "adding a brick" 5-wire rule.

## 21. Verification
Unit: erasure orchestrator with mocked adapters (every store visited, receipt complete, **export
enumerates every store**), pseudonymisation reversibility bounds, fingerprint determinism, token verify/
expiry/attempt-limit, SLA `due_at` math, retention selectors (incl. final fingerprint drop), webhook
idempotency, consent-event shape, DSA aggregation. Integration: `/v1/erasure/confirm` runs the full
engine against seeded D1 + mocked Sanity/Clerk. Follows the repo's one-runnable-check rule.

## 22. Phased roadmap
1. D1 `0002` (incl. `user_profiles`) + salt tooling + `fingerprintEmail` + profile upsert on login +
   idempotent Clerk-webhook sync + **backfill** existing users.
2. Consent logging (account-scoped) + banner/settings wiring + cookie audit.
3. Erasure + pseudonymisation engine + adapters + **dry-run** + tests.
4. Erasure/DSAR API + confirm page + **identity-verified** export; Sanity→D1; Sanity-editable emails
   (owner + user) + **SLA clock**.
5. Login/signup `ConsentGate` (mandatory legal + unticked marketing) + email-change flow + consent emails.
6. Take-down module + forms (report/DMCA/appeal) + `content_reports` + emails.
7. Admin console (all pages, incl. `breach`) + owner-notify wiring + DSA transparency + `compliance-officer` role.
8. Accountability records — ROPA, sub-processor page + DPAs, lawful-basis map/LIA, SCC disclosure, breach runbook.
9. Legal content port + `contentGuidelines` page + all-page disclosure updates (legal-review gate).
10. Retention cron (all classes + final fingerprint drop + backups note) + reconcile job + observability
    + docs/config/changelog. *(Transactional reserves — CGV, order-anonymisation seam, 7–10y retention,
    CCPA/OSS — land idle here.)*

## 23. Operator setup checklist (per client)
Set `IP_HASH_SALT` + `GDPR_FINGERPRINT_SALT`; sign processor DPAs + publish the sub-processor list; run
the cookie audit; author per-client legal prose in Studio (legal review); confirm SCCs for US processors;
appoint a DPO if required; verify the retention cron runs once `DB` + schedule are bound; enable Turnstile
on a real domain.

## 24. Open questions / out-of-code
- Which surfaces (beyond blog comments) host UGC → `features.compliance.takedown`.
- Age-gate only if minors are in scope (COPPA/Art. 8).
- DMCA designated-agent registration (manual/legal), DPO appointment, DPIA trigger, and all ported legal
  prose need human/legal sign-off before publish.
- `user_profiles` holds plaintext email + name in D1 (a deliberate change from the audit tables'
  minimisation) — required for profile-on-login + email-keyed erasure; mitigated: EU-resident,
  bearer-gated api-only writes, pseudonymised on erasure, hard-deleted at 90d, minimal fields.

## Issue tags
- `@debt SECURITY` — retention purges + reconcile must be verified running once `DB` + schedule are bound.
- `@debt TESTING` — erasure engine + export completeness need full adapter-mock coverage before first real erasure.
