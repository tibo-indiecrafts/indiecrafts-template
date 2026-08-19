# Backups (Sanity + D1)

Two data stores, one backup story. **Sanity** holds content; **D1** (opt-in) holds relational app
data. Each has a backup script that writes a **local** dump by default and can also push a copy to
**R2** (`--remote`). A scheduled GitHub Action runs them nightly.

## Folder layout (gitignored)

```
code/projects/web/surfaces/website/backups/
├── sanity/       <dataset>-<timestamp>.tar.gz
├── d1/           <db>-<env>-<timestamp>.sql
└── subscribers/  subscribers-<timestamp>.csv
```

The whole `backups/` tree is gitignored (dumps + subscriber emails are data, not code). Remote copies
live in the per-env R2 bucket `<slug>-web-backups-<env>` (the bucket name follows your project slug from
`pnpm project:rename` — the template default is `indiecrafts-web-backups-<env>`), keyed `sanity/…` and
`d1/<env>/…`.

## Manual backup

Backups are **registry-driven** — `code/shared/scripts/data/backup.mjs` reads `code/shared/scripts/lib/databases.mjs` and
dispatches on each db's `kind`, running from the db's **owner** dir. The only active db today is the
`sanity` `content` dataset (owner `website`).

```bash
pnpm backup:content:prod                         # the Sanity content dataset → website/backups/sanity/
pnpm backup:content:prod:remote                  # + upload to <slug>-web-backups-prod
node code/shared/scripts/data/backup.mjs content prod --remote # (same, direct)
pnpm backup:all:prod                             # every registered db (dispatches per kind)
node code/shared/scripts/data/backup.mjs <name> <env> --dry-run  # show the plan, run nothing
```

Sanity backup is read-only and needs `SANITY_API_READ_TOKEN`; a `d1` db needs the Wrangler login /
`CLOUDFLARE_API_TOKEN`. Each keeps the **last 10** local dumps per source and prunes the rest. To add a
db (e.g. a D1), add a row to `code/shared/scripts/lib/databases.mjs` — `backup:all` + `db:migrate` pick it up.

## One-time setup (for `--remote`)

Create the per-env R2 backups buckets (`<slug>-web` = your `project:rename` slug):

```bash
wrangler r2 bucket create <slug>-web-backups-dev
wrangler r2 bucket create <slug>-web-backups-staging
wrangler r2 bucket create <slug>-web-backups-prod
```

## Automated backups

`.github/workflows/backup.yml` runs **nightly (03:00 UTC, prod)** and on manual dispatch (pick the
env). It exports Sanity + D1 and uploads to that env's R2 bucket. It reuses the deploy workflow's
GitHub **Environment** secrets/vars — `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`,
`SANITY_API_READ_TOKEN`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`.

## Rotation / retention

- **Local** — the scripts keep the newest 10 per source. In CI the runner is ephemeral, so local
  copies don't accumulate.
- **R2** — set a **bucket lifecycle rule** so remote copies rotate (else they grow forever):
  ```bash
  wrangler r2 bucket lifecycle add <slug>-web-backups-prod \
    --name expire-backups --prefix "" --expire-days 30
  ```
  (or set it in the Cloudflare dashboard → R2 → the bucket → Settings → Object lifecycle rules).

## Restore

- **Sanity** — `pnpm content:import -- backups/sanity/<file>.tar.gz` (destructive `--replace`;
  prefer a scratch dataset first). Pull a remote copy with `wrangler r2 object get …` if needed.
- **D1** — prefer **Time Travel** (`wrangler d1 time-travel restore <db> --timestamp <ts> --env <env>`,
  up to 30 days). From a dump: `wrangler d1 execute <db> --file backups/d1/<file>.sql --env <env> --remote`.
