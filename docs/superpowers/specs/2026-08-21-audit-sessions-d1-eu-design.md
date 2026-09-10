# EU audit + session log (Cloudflare D1) — design

> **Update (2026-08-21, at build):** consolidated to **ONE EU D1** (binding `DB`, `--location weur`) with
> **three** tables — `admin_audit` · `session_events` · `security_events` — instead of the separate
> `AUDIT_DB` + `SECURITY_DB` this draft describes. One database keeps the free-plan D1 count low (3 per env,
> not 6); the tables stay isolated. Migrations live under `db/d1/migrations/` (not `db/d1/audit/…`). The
> current record-of-processing is [`code/docs/apps/web/config/data-retention.md`](../../../code/docs/apps/web/config/data-retention.md);
> the security posture is [`security-hardening.md`](../../../code/docs/apps/web/config/security-hardening.md).

- **Date:** 2026-08-21
- **Status:** Draft for review — builds on the Clerk auth specs
- **Scope:** move admin audit off the console/Logpush sink into a **Cloudflare D1
  database in the EU**, add a **per-surface session/sign-in activity log** in the same
  DB, enforce **90-day GDPR retention** via the cron worker, and add **domain config**
  for the remaining web surfaces.

## 1. Goal

An EU-resident, queryable record of privileged admin actions and per-surface
sign-in activity, minimized and time-limited under GDPR.

## 2. Decisions (resolved with the requester)

| Question    | Decision                                                                      |
| ----------- | ----------------------------------------------------------------------------- |
| Audit store | **Cloudflare D1, EU** (`--location weur`) — replaces the console/Logpush sink |
| Session log | **Same D1 EU** — KV was asked, but KV has **no EU residency**, so D1          |
| Owner       | the shared **`api`** worker (the one write path all surfaces can reach)       |
| Retention   | **90 days**, purged by the **cron** worker (D1 has no TTL)                    |
| Extra field | **country** (`cf-ipcountry`) + **hashed IP** (`crypto.hashIpAddress`)         |
| Domains     | add **admin + app** as subdomain placeholders                                 |

## 3. Verification (the requester's two asks)

- **No collision.** `audit` (D1 name) is unused. Bindings today: `ASSETS`,
  `NEXT_INC_CACHE_R2_BUCKET`, `RATE_LIMIT_KV` (commented). Use distinct binding names —
  **`AUDIT_DB`** — never the generic `DB`/`KV` or `RATE_LIMIT_KV`.
- **No version bump.** Versioning is a git-sha build-stamp + manual changelog roll-up;
  no `version:bump` tooling. Adding a db/infra requires a **changelog entry only**. This
  work does not touch the version mechanism.

## 4. Why KV was dropped

Workers KV is globally replicated — **no data-residency / jurisdiction option**. The
session records carry personal data (userId, IP, country), so "KV in Europe" is not
achievable. D1 (`--location weur/eeur`, create-time, immutable) keeps it EU-resident.
Trade-off accepted: KV auto-expires; D1 needs the cron purge (§7).

## 5. The D1 database — `audit` (EU), owner `api`

- Registry row in `databases.mjs`: `{ name: "audit", kind: "d1", owner: "api",
altitude: "global", dir: "code/shared/api/db/d1/audit", backup: "wrangler", order: 10 }`.
- Created EU: `wrangler d1 create indiecrafts-<env>-shared-api-audit --location weur`
  (operator step; paste `database_id`). Binding **`AUDIT_DB`** in `code/shared/api/wrangler.toml`, per `[env.*]`.
- **Two tables** (migrations under `db/d1/audit/migrations/`):

```sql
-- admin_audit: one row per privileged admin action (the crown-jewel path).
CREATE TABLE admin_audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,               -- ISO8601
  event TEXT NOT NULL,            -- admin.grant | admin.revoke
  actor_user_id TEXT NOT NULL,    -- who did it
  target_user_id TEXT NOT NULL,   -- to whom
  country TEXT,                   -- cf-ipcountry (2-letter)
  ip_hash TEXT                    -- salted SHA-256, never raw IP
);
CREATE INDEX idx_admin_audit_ts ON admin_audit(ts);

-- session_events: one row per sign-in, per surface.
CREATE TABLE session_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,
  surface TEXT NOT NULL,          -- website | admin | app | mobile | hybrid
  user_id TEXT NOT NULL,
  country TEXT,
  ip_hash TEXT
);
CREATE INDEX idx_session_events_ts ON session_events(ts);
```

Data-minimized (Art. 5(1)(c)): surface, event, ids, country code, **hashed** IP,
timestamp. No raw IP, no user-agent.

## 6. The write path — `api` `POST /v1/events`

- One bearer-gated endpoint on the `api` worker (the existing `APP_API_TOKEN` gate +
  `withGuard`): `POST /v1/events` with
  `{ kind: "admin"|"session", surface, event, actorUserId?, targetUserId?, userId? }`.
  The api derives `country` (`cf-ipcountry`) + `ipHash` (`crypto.hashIpAddress`,
  caller-injected salt) server-side — never from the client — and inserts into the
  matching table.
- **admin_audit:** `admin/src/lib/audit.ts` is rewritten to POST here (fire-and-forget;
  on failure, fall back to the current `console.log` so nothing is lost).
- **session_events:** each surface logs its own sign-in with its `surface` tag.
  - Web (website/admin/app): a **Clerk `session.created` webhook** → `api`
    `/v1/clerk-webhook` (Svix-verified) → insert. Central, server-side, reliable;
    surface = the app that owns the session. _(Alternative: a client fire-and-forget
    ping; the webhook is preferred — decide at build.)_
  - Mobile / hybrid: a fire-and-forget `POST /v1/events` after `setActive`, passing
    their surface (they already call the api for the agent).

## 7. Retention — cron purge (90 days)

Activate the `code/shared/cron` worker: bind `AUDIT_DB`, add a daily scheduled handler
that runs `DELETE FROM admin_audit WHERE ts < :cutoff` and the same for
`session_events`, `cutoff = now − 90 days`. Idempotent, logged. This is the first
retention mechanism in the repo (Art. 5(1)(e) storage limitation, enforced).

## 8. GDPR

- **Lawful basis:** legitimate interest (security/audit) — recorded in an Art. 30
  processing note in the docs.
- **Minimization + pseudonymization:** hashed IP (the unused `crypto.hashIpAddress`
  primitive, now wired), country code, no free-text.
- **Storage limitation:** 90-day cron purge (§7).
- **Erasure (Art. 17):** on a `dataRequest` erasure, purge the subject's rows
  (`DELETE … WHERE user_id = ?`); note that security audit rows may be retained under
  legitimate interest where law allows — document the operator's call.
- **Residency:** EU D1. (KV would have moved it worldwide — §4.)

## 9. Domains

Add rows to `domains.mjs` for **admin** (`admin.<root>`) and **app** (`app.<root>`) —
placeholders keyed off the same root as website, so subdomain session-sharing works
once the operator sets the real host. Mobile/hybrid are not web domains → excluded.

## 10. What else we could store here (noted, not built)

Same EU store, low-PII: **security events** (failed/blocked sign-ins, complementing the
rate-limiter), a **consent-proof mirror** (today only in Sanity). Avoid raw IP,
user-agent, anything unneeded.

## 11. Risks

- **EU flag is create-time + immutable** — verify `wrangler d1 create --location`
  against the current CLI before running; recreate to change region.
- **Unverifiable here** — needs a Cloudflare account to create the EU D1 + run
  migrations; this delivers schema + registry + bindings + code, operator activates.
- **api as single writer** — a failed audit POST falls back to `console.log` so the
  event is never silently lost.

## 12. Plan (phased)

1. Domains: admin + app subdomain rows in `domains.mjs`.
2. D1 registry + schema: `audit` row in `databases.mjs`; migrations SQL; `AUDIT_DB`
   binding in `api/wrangler.toml` (EU note).
3. api: `POST /v1/events` + `/v1/clerk-webhook` (Svix) — validate, hash IP, insert.
4. Rewire admin `lib/audit.ts` → api (console fallback); mobile/hybrid sign-in ping.
5. cron: activate the worker + the 90-day purge; bind `AUDIT_DB`.
6. GDPR: erasure hook in the `dataRequest` flow; Art. 30 doc note.
7. Docs + changelogs (api · cron · db · docs); **no version bump**.

## Issue tags

- `@debt SECURITY` — EU residency is D1 create-time only; KV cannot satisfy it, so
  session records are D1, not KV.
- `@debt E2E` — the D1 write path + cron purge need a Cloudflare account to verify.
