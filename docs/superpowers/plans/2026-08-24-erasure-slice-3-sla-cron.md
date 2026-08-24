# Roadmap Slice 3: SLA cron clock + export cleanup

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** The scheduled worker flags erasure requests that approach or breach the GDPR one-month SLA, and cleans up expired export bundles (the orphan cleanup deferred from Slice 2).

**Architecture:** Extend `code/shared/cron/src/index.ts`'s `scheduled()` (which already runs the retention purge) with two idempotent passes over the shared EU D1: (1) SLA — flag not-yet-completed `erasure_requests` whose `due_at` is within 7 days or past, writing a severity-tagged `security_events` row (visible in the admin `/v1/security` feed) and marking each request `due_flagged_at` so it flags once; (2) export cleanup — delete expired `export_requests` rows and their R2 objects. Pure helpers (like the existing `retentionCutoff`) keep it testable.

**Tech Stack:** Cloudflare Workers (scheduled) + D1 + R2 · `@cloudflare/vitest-pool-workers`. **Mirror:** the existing purge in `cron/src/index.ts`; the `security_events` insert shape in `code/shared/api/src/index.ts`; the erasure_requests columns in migration `0004`.

## Global Constraints
- Idempotent on every tick (the SLA flag is once-per-request via `due_flagged_at`; the export cleanup is delete-by-expiry). No-op until `DB`/`EXPORT_BUCKET` bound.
- A scheduled failure must `logger.error` + rethrow (the cron NEVER). Keep task logic as pure helpers in this file (matching the existing `retentionCutoff` + inline purge precedent — this worker keeps its purge inline).
- Commit `--no-verify`; stage only named files; prettier; writing-style.
- **Ruling S3-FLAG-HOME:** the SLA flag is a `security_events` row (event_type `erasure_sla_due`/`erasure_sla_breach`, severity `medium`/`high`) — it surfaces in the admin `/v1/security` feed the operator already reads, so it is the visible "flag." Owner-reminder EMAIL is deferred (the cron worker has no Resend; adding it is a separate enhancement — note it). Cost if wrong: add email later.

---

### Task 1: SLA flag + export cleanup in the cron worker

**Files:**
- Create: `code/shared/api/db/d1/migrations/0006_erasure_due_flagged.sql`
- Modify: `code/shared/cron/src/index.ts` (+ `src/index.test.ts`) + `code/shared/cron/wrangler.toml` (EXPORT_BUCKET binding) + `code/shared/cron/CHANGELOG.md` + `code/shared/cron/.claude/CLAUDE.md` + `code/docs/apps/web/config/data-retention.md`

- [ ] **Step 1: Migration.** `0006_erasure_due_flagged.sql`: `ALTER TABLE erasure_requests ADD COLUMN due_flagged_at TEXT;` (forward-only; the api owns the D1 so the migration lives in its dir; the cron shares the DB).
- [ ] **Step 2: Pure helpers + failing tests.** In `cron/src/index.ts` add (exported, testable like `retentionCutoff`):
  - `slaDueSoonCutoff(scheduledTime: number, days = 7): string` → ISO of `scheduledTime + days*86_400_000` (requests due within the next `days` count as "due soon").
  - `slaSeverity(dueAt: string, nowIso: string): "high" | "medium"` → `dueAt < nowIso ? "high"(breached) : "medium"(approaching)`.
  In `src/index.test.ts` (the cron already has a vitest-pool-workers test with `env.DB`; add `env.EXPORT_BUCKET` via the pool config `r2Buckets`): seed erasure_requests + export_requests rows, run `scheduled`, assert: (a) a request with `due_at` in 3 days, status `email_sent`, `due_flagged_at` null → a `security_events` row (event_type `erasure_sla_due`, severity `medium`) is written AND `due_flagged_at` set; (b) a breached request (`due_at` in the past) → severity `high`; (c) a completed/cancelled/expired request → NOT flagged; (d) an already-flagged request (`due_flagged_at` set) → NOT re-flagged (no duplicate row); (e) an expired export_requests row (`expires_at` past) → its R2 object deleted + the row deleted; a not-yet-expired export row → kept.
- [ ] **Step 3: Implement in `scheduled()`** (after the existing purge, same `if (env.DB)` block or a sibling; wrap in try/catch + rethrow like the purge):
  - SLA pass (needs `DB`): `const dueSoon = slaDueSoonCutoff(controller.scheduledTime); const nowIso = new Date(controller.scheduledTime).toISOString();` `SELECT id, user_id, email_fingerprint, due_at FROM erasure_requests WHERE due_flagged_at IS NULL AND status NOT IN ('completed','cancelled','expired') AND due_at < ?` bound to `dueSoon`. For each row: `INSERT INTO security_events (ts, event_type, severity, surface, user_id, country, ip_hash, description) VALUES (?, ?, ?, 'api', ?, NULL, NULL, ?)` with event_type `slaSeverity===high ? 'erasure_sla_breach' : 'erasure_sla_due'`, severity `slaSeverity(due_at, nowIso)`, user_id `row.user_id ?? row.email_fingerprint`, description `"erasure request ${id} due ${due_at}"`; then `UPDATE erasure_requests SET due_flagged_at = ? WHERE id = ?` bound `nowIso`. Log the count.
  - Export cleanup (needs `DB` + `EXPORT_BUCKET`): `SELECT id, r2_key FROM export_requests WHERE expires_at < ?` bound `nowIso`. For each: `await env.EXPORT_BUCKET.delete(r2_key)` (idempotent — no-op if already deleted on download); then `DELETE FROM export_requests WHERE id = ?`. Log the count. Guard on `env.EXPORT_BUCKET` (skip cleanup if unbound).
- [ ] **Step 4: Bindings + Env.** Add `EXPORT_BUCKET?: R2Bucket` to the cron `Env` interface (JSDoc: the api's export bucket, shared; `[[r2_buckets]]`, operator-provisioned; cleanup no-ops until bound). Add a commented `[[r2_buckets]] binding = "EXPORT_BUCKET"` block to `cron/wrangler.toml` (same bucket_name as the api's). Add `r2Buckets: ["EXPORT_BUCKET"]` to the cron vitest pool config so the test can bind it.
- [ ] **Step 5: Verify + docs + commit.** `pnpm --filter @indiecrafts/shared-cron test` (all green incl. new) + `tsc` 0. Docs: cron `CHANGELOG.md` (Added: SLA flag + export cleanup), cron `.claude/CLAUDE.md` (the scheduled() now also flags erasure SLA + purges expired exports), `data-retention.md` (the SLA-flag behavior + the export-bundle 1h expiry cleanup). Prettier. Commit `--no-verify` (`feat(compliance): cron SLA flag for erasure due dates + expired-export cleanup`).

---

## Self-review
- Coverage: SLA approaching + breached flag (once-per-request via `due_flagged_at`), export orphan cleanup (Slice-2 deferral), both idempotent, both tested. Owner-reminder email deferred (S3-FLAG-HOME ruling — no Resend in cron).
- Consistency: `security_events` insert matches the api's column shape; `erasure_requests`/`export_requests` columns match migrations 0004/0005; the migration lives in the api's D1 dir (api owns the DB, cron shares it).
- **Ruling S3-EXPORTBUCKET:** the cron binds the SAME R2 bucket as the api (`EXPORT_BUCKET`) to delete orphaned objects; operator-provisioned, no-op until bound. Cost if wrong: an R2 lifecycle rule can do the cleanup instead.
