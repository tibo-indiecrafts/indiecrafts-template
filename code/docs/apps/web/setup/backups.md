# Backups (Sanity + D1)

Two data stores, one backup story. **Sanity** holds content; **D1** (opt-in) holds relational app
data. Each has a backup script that writes a **local** dump by default and can also push a copy to
**R2** (`--remote`). A scheduled GitHub Action runs them nightly.

## Folder layout (gitignored)

```
code/projects/web/surfaces/website/backups/
├── content/      <dataset>-<timestamp>.tar.gz    (one folder per registry `name` — the `content` sanity db)
├── audit/        <db>-<env>-<timestamp>.sql       (the `audit` d1 db)
├── subscribers/  subscribers-<timestamp>.csv   (pnpm subscribers:export)
├── comments/     comments-<timestamp>.csv      (pnpm comments:export)
├── waitlist/     waitlist-<timestamp>.csv      (pnpm waitlist:export)
└── contact/      contact-<timestamp>.csv       (pnpm contact:export)
```

Every stored, editor-collected entity has the **same** CSV export escape hatch (read-only,
`SANITY_API_READ_TOKEN`) — see the script table in [scripts](./scripts.md).

The whole `backups/` tree is gitignored (dumps + subscriber emails are data, not code). Remote copies
go to **one project-wide bucket per env**, `<prefix>-<env>-db-backup` (the `<prefix>` is the project
slug — `indiecrafts` by default, swapped by `pnpm project:rename`), keyed **`<name>/…`** — one prefix
per registry db (`content/…`, `audit/…`). No per-app worker name in it, so no `-<platform>-<surface>-`;
the env is the bucket, so the key is just `<name>/<file>`.

## Manual backup

Backups are **registry-driven** — `code/shared/scripts/data/backup.mjs` reads `code/shared/scripts/lib/databases.mjs` and
dispatches on each db's `kind`, running from the db's **owner** dir. The only active db today is the
`sanity` `content` dataset (owner `website`).

```bash
pnpm backup:content:prod                         # the Sanity content dataset → website/backups/sanity/
pnpm backup:content:prod:remote                  # + upload to <prefix>-prod-db-backup (keyed content/…)
node code/shared/scripts/data/backup.mjs content prod --remote # (same, direct)
pnpm backup:all:prod                             # every registered db (dispatches per kind)
node code/shared/scripts/data/backup.mjs <name> <env> --dry-run  # show the plan, run nothing
```

Sanity backup is read-only and needs `SANITY_API_READ_TOKEN`; a `d1` db needs the Wrangler login /
`CLOUDFLARE_API_TOKEN`. Each keeps the **last 10** local dumps per source and prunes the rest. To add a
db (e.g. a D1), add a row to `code/shared/scripts/lib/databases.mjs` — `backup:all` + `db:migrate` pick it up.

## Pre-migration snapshots

`db:migrate` takes a **pre-migration R2 snapshot before every remote schema change** — a bad
migration is then recoverable. It's automatic and registry-driven (so a future postgres/supabase db
gets its own snapshot for free):

```bash
node code/shared/scripts/data/migrate.mjs audit prod          # snapshot audit → R2, THEN apply migrations
node code/shared/scripts/data/migrate.mjs audit prod --no-backup  # skip the snapshot (override)
node code/shared/scripts/data/migrate.mjs audit dev           # local miniflare D1 — no snapshot (disposable)
node code/shared/scripts/data/migrate.mjs audit prod --dry-run    # show the plan, run nothing
```

The snapshot runs `backup.mjs … --remote`; if it **fails, the migration is aborted** (fail-closed) —
so a missing R2 bucket (see One-time setup) blocks the migration until you fix it or pass `--no-backup`.
Dev is skipped because the local D1 is disposable. (Migrations are hand-run today, not part of deploy/CI.)

## Retention

Backups hold PII (`user_profiles` emails, `consent_events`, audit rows), so retention is a **GDPR**
decision, not a storage-cost one — the dumps are tiny.

- **Local** — the newest **10** dumps per source; older ones are pruned on each run (a dev convenience).
- **R2** — a **30-day** object-lifecycle expiry (default), so R2 never accumulates PII indefinitely.
  A pre-migration snapshot is a rollback net (a bad migration surfaces within days), and the nightly
  job (below) writes one dump/day — 30 days keeps ~a month of restore points, aligned with the live
  data windows (`audit`/`security_events` purge at 90 days; `consent_events` proof lives in the live
  3-year table, not a backup). Set it once per bucket:

  ```bash
  wrangler r2 bucket lifecycle add <bucket> --name expire-30d --expire-days 30
  ```

  Raise it for a client with a longer regulatory backup requirement. **GDPR posture:** backups are
  excluded from live erasure (you can't edit a dump) — the compliant stance is *bounded retention + a
  restore re-runs any pending erasures before the DB goes live again*. Keep this consistent with the
  [erasure story](/packages/compliance).

## One-time setup (for `--remote`)

The bucket is **provisioned by Terraform** — `cloudflare_r2_bucket.backups` in
`code/projects/web/surfaces/website/infra/cloudflare/main.tf` creates `<prefix>-<env>-db-backup`
(EU-resident, one per env) on `pnpm infra:website:apply:<env>`. Then set the retention lifecycle once
per bucket (the provider's lifecycle resource is version-sensitive, so it's a wrangler step for now):

```bash
wrangler r2 bucket lifecycle add indiecrafts-prod-db-backup --name expire --expire-days 30   # per env
```

To create a bucket by hand instead of Terraform: `wrangler r2 bucket create indiecrafts-<env>-db-backup`.

## Automated backups

`.github/workflows/backup.yml` runs **nightly (03:00 UTC, prod)** and on manual dispatch (pick the
env). It exports Sanity + D1 and uploads to that env's R2 bucket. It reuses the deploy workflow's
GitHub **Environment** secrets/vars — `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`,
`SANITY_API_READ_TOKEN`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`.

## Restore

- **Sanity** — `pnpm content:import -- backups/sanity/<file>.tar.gz` (destructive `--replace`;
  prefer a scratch dataset first). Pull a remote copy with `wrangler r2 object get …` if needed.
- **D1** — prefer **Time Travel** (`wrangler d1 time-travel restore <db> --timestamp <ts> --env <env>`,
  up to 30 days). From a dump: `wrangler d1 execute <db> --file backups/d1/<file>.sql --env <env> --remote`.
