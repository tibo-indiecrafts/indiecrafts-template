# Design — Split the `api` D1 into `core` + `audit`

**Date:** 2026-08-25 · **Status:** design, awaiting approval · **Owner service:** `@indiecrafts/shared-api`

## 1. Goal

Split the single EU D1 owned by the `api` worker into **two D1 databases** so that
identity/rights data and the high-volume audit firehose live in separate blast domains.
A schema change or write-load spike in the firehose can no longer threaten the
identity/consent/settings data. Both databases stay owned by `api`; every consumer keeps
calling the `api` HTTP surface, so nothing outside the worker changes.

This is option **(A) — bake isolation into the template**: new deployments provision two
D1s from day one. There is no live-data migration in the template (`wrangler.toml` still
carries `PASTE_D1_ID_HERE`); an appendix (§13) covers already-deployed instances.

## 2. Why this is safe (confirmed, not assumed)

- **Erasure already spans stores with no shared transaction.** `runErasure(adapters[], …)`
  (`packages/shared/compliance/src/shared/erasure.ts`) loops an array of adapters — today
  D1 + Clerk + Sanity + orders — each in its own `try/catch`, and returns a receipt that
  **enumerates every store** plus an `errors[]` list ("a store can never be silently
  skipped — spec §21"). A second D1 is one more adapter in that array. Completeness is
  measured by the receipt, not by a DB transaction, so the split changes nothing about the
  completeness guarantee.
- **Identity still resolves.** `resolve()` reads `user_profiles` → `user_id`, then that id
  is used against the audit tables. That is a lookup-then-use, not a cross-DB join.
- **No SQL `JOIN` crosses the two groups** (verified by grep). The only cross-group logic is
  the erasure adapter and the cron purge — both handled in §7 and §10.

## 3. The two databases + table assignment

**Dividing principle:** _must-not-lose / sensitive / low-write_ vs _high-volume / append-only
/ auto-expiring_.

| DB                                      | binding   | Tables                                                                                                     | Character                                                                |
| --------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **`core`** (new)                        | `CORE_DB` | `user_profiles`, `consent_events`, `data_requests`, `erasure_requests`, `export_requests`, `site_settings` | Identity, data-subject rights, admin config. Kept, sensitive, low-write. |
| **`audit`** (existing, renamed-in-role) | `DB`      | `session_events`, `security_events`, `admin_audit`, `csp_reports`, `backup_runs`                           | Append-only telemetry firehose. High-write, retention-purged.            |

Naming: the existing DB is already called `audit` and its name fits the firehose
(`session_events`, `security_events`, `admin_audit`, `csp_reports`). The **new** DB reuses
the `core` slot already reserved (commented) in `databases.mjs`. So: `audit` keeps binding
`DB`; `core` is new with binding `CORE_DB`. This minimises churn on the audit side.

## 4. Bindings

- `api` worker: **both** `DB` (audit) and `CORE_DB` (core).
- `cron` worker: **both** (purges audit; reads `site_settings`, SLA-flags `erasure_requests`,
  cleans `export_requests` — all `core`).
- No other worker touches these tables. Web/mobile/hybrid reach the data only through the
  `api` HTTP surface, so they need no binding and see no change.

## 5. Cross-DB consumers (the only real work)

Two places in code touch both groups. Both are solved by holding two bindings — no
cross-DB transaction is introduced (there is none today across D1+Clerk+Sanity either).

### 5.1 Erasure / export adapter (`api/src/erasure/d1.ts`)

Split `createD1ErasureAdapter(db, salt)` into two adapters:

- **`createCoreErasureAdapter(coreDb, salt)`** — owns `user_profiles` (pseudonymise) and
  `consent_events` (pseudonymise). Holds `resolve()` (reads `core.user_profiles`).
- **`createAuditErasureAdapter(auditDb, coreDb, salt)`** — owns `session_events` (delete)
  and `security_events` (pseudonymise high/critical, delete the rest). It needs `user_id`,
  which lives in `core.user_profiles`, so it takes a **read-only handle to `core`** to
  resolve, then writes `audit`. `admin_audit` remains retained (untouched by erasure, same
  as today).

Both are behaviour-identical to the current single adapter — the same SQL, split by which
DB the table now lives in. `preview()`/`export()`/`findByEmail()` split the same way.

**Composition** (`api/src/erasure/confirm.ts` `defaultAdapters` + `self.ts`): the array
becomes

```ts
[
  createCoreErasureAdapter(env.CORE_DB!, salt),
  createAuditErasureAdapter(env.DB!, env.CORE_DB!, salt),
  createClerkErasureAdapter(...),
  createSanityErasureAdapter(...),
  createOrdersErasureAdapter(),
]
```

The orchestrator already runs N adapters and reports per-store; five instead of four is a
no-op for it.

**Alternative considered (not chosen):** resolve `user_id`/fingerprint once in the route
and thread it to adapters via `opts` (the orchestrator already passes `fingerprint`).
Cleaner separation, but it changes the `ErasureAdapter` contract and every adapter. The
read-handle approach is a one-file reshape with no interface change — preferred.

### 5.2 Cron worker (`cron/src/index.ts`)

Add `CORE_DB` to `Env`. Route each pass to its binding: retention purge of
`session_events`/`security_events`/`csp_reports`/`admin_audit` → `DB`; `loadSettings`
(reads `site_settings`), the erasure-SLA flag (`erasure_requests`), and the export cleanup
(`export_requests`) → `CORE_DB`. The `consent_events` retention purge moves to `CORE_DB`.

## 6. Adapter is idempotent → partial failure is recoverable

Every scrub is `UPDATE/DELETE … WHERE user_id/fingerprint` — re-running re-scrubs harmlessly.
If the `audit` adapter fails after `core` succeeded, the receipt records the `audit` error;
the operation is retried and the already-scrubbed `core` rows are unaffected. This is the
**same** partial-failure model already relied on for Clerk/Sanity/orders — no new class of
risk. No cross-DB transaction is attempted (D1 cannot; neither can the current multi-store
flow).

## 7. Migrations restructure

Today all `CREATE TABLE`s live in `api/db/d1/migrations/` (0001–0009). Split into two
migration directories, each owned by its DB row:

- `api/db/audit/migrations/` — `session_events`, `security_events`, `admin_audit`,
  `csp_reports`, `backup_runs` (+ their indexes/alters).
- `api/db/core/migrations/` — `user_profiles`, `consent_events`, `data_requests`,
  `erasure_requests`, `export_requests`, `site_settings` (+ their indexes/alters).

Each directory renumbers from `0001` within itself. `db/d1/` is retired (or kept as the
`audit` dir — decide during implementation; renaming `d1/` → `audit/` is the smaller diff).
Cross-table statements (none found) would need care; there are none.

## 8. Registry + wrangler + runners

- **`scripts/lib/databases.mjs`** — add the `core` row (`{ name: "core", kind: "d1",
owner: "api", binding: "CORE_DB", altitude: "global", dir: "code/shared/api/db/core",
backup: "wrangler", order: 8 }`), and point the `audit` row's `dir` at
  `code/shared/api/db/audit`. Fix the stale "three tables" comment.
- **`api/wrangler.toml`** — add a second `[[env.<env>.d1_databases]]` block per env with
  `binding = "CORE_DB"`, `database_name = "indiecrafts-<env>-shared-api-core"`,
  `database_id = "PASTE_CORE_D1_ID_HERE"`.
- **Migrate / backup runners** read the registry, so they fan out to both DBs automatically
  once the `core` row exists — `db:migrate:core:<env>`, `db:backup:core`, etc. appear with
  no runner edit (registry-driven design).

## 9. api source binding sweep

Every query in `api/src` that touches a **core** table must switch `env.DB` → `env.CORE_DB`:
the clerk-webhook `user_profiles` sync, the consent sink, `data-request` read/write, the
erasure/export request rows, and the settings read/write. Audit-table queries keep `env.DB`.
This is the bulk of the mechanical work — bounded and greppable (search each core table name).

## 10. Template rollout (option A)

- **Setup**: the "create the D1" step becomes "create **two** D1s"; paste two IDs into
  `wrangler.toml`. Update `code/docs/apps/web/config/*` (data-retention, security-hardening,
  settings) + `setup` docs to describe the two-DB layout.
- **CI/deploy**: fan out from the registry — no workflow edit.
- **Free-plan D1 count**: two D1s per env × envs — `dev`/`staging`/`prod` × 2 = 6. This is
  the trade-off the current single-DB comment names ("keeps the free-plan D1 count low").
  Verify the count against Cloudflare's current D1 plan limits during setup and note it in
  the setup doc.

## 11. Error handling

- Erasure/export partial failure → visible in the receipt's `errors[]`; idempotent retry
  (§6). No behaviour change from today.
- A `CORE_DB` outage degrades identity/consent/DSAR features only; the audit sink keeps
  working, and vice versa — that isolation is the point.
- Clerk remains the source of truth for identity; `user_profiles` is a mirror, so a `core`
  loss is recoverable from Clerk + re-fingerprint.

## 12. Testing

- Split `erasure/d1.test.ts` into `core`- and `audit`-adapter tests, each with its own
  fixture DB; keep the existing pseudonymise/delete assertions.
- **New completeness test**: run `runErasure` with both D1 adapters (+ mocked Clerk/Sanity)
  and assert the receipt enumerates all five stores with empty `errors[]`.
- **Cross-DB resolve test**: audit adapter resolves `user_id` from a `core` fixture and
  scrubs an `audit` fixture — assert both.
- Split the cron purge tests per binding (`DB` vs `CORE_DB`).
- The registry `databases.test.mjs` gains the `core` row assertions.

## 13. Appendix — existing deployments (not needed for the template)

For an already-deployed instance with live data: create the `core` D1; `wrangler d1 export`
the six core tables from the old DB; import into `core`; deploy the two-binding worker; verify
row counts; then drop the moved tables from `audit` in a follow-up migration. A short cutover;
out of scope for the template (no live data), documented here for operators.

## 14. Non-goals

- Not changing **what** erasure scrubs (same tables, same policy).
- Not merging or renaming table columns.
- Not adding point-in-time recovery or a third DB.
- Not moving to Postgres/Hyperdrive (a separate, later decision if D1 limits bind).

## 15. Ordered rollout

1. Registry: add `core` row, repoint `audit` `dir`, fix stale comment.
2. Migrations: split `d1/migrations` → `audit/` + `core/`.
3. `wrangler.toml`: second `CORE_DB` binding block per env.
4. api source: binding sweep (`env.DB` → `env.CORE_DB` for core tables).
5. Erasure: split the D1 adapter into core + audit; update the adapter arrays.
6. Cron: add `CORE_DB`; route passes per binding.
7. Tests: split + completeness + cross-DB resolve.
8. Docs: setup (two D1s) + config pages + `api`/`cron`/`db` briefs + CHANGELOG.

## Issue tags

- `@debt COUPLING` — the erasure adapter + cron worker span both DBs; contained behind two
  bindings and the receipt model, but note the dependency.
