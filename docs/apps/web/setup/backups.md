# Backups (Sanity + D1)

Two data stores, one backup story. **Sanity** holds content; **D1** (opt-in) holds relational app
data. Each has a backup script that writes a **local** dump by default and can also push a copy to
**R2** (`--remote`). A scheduled GitHub Action runs them nightly.

## Folder layout (gitignored)

```
code/apps/web/backups/
├── sanity/       <dataset>-<timestamp>.tar.gz
├── d1/           <db>-<env>-<timestamp>.sql
└── subscribers/  subscribers-<timestamp>.csv
```

The whole `backups/` tree is gitignored (dumps + subscriber emails are data, not code). Remote copies
live in the per-env R2 bucket `<slug>-web-backups-<env>` (the bucket name follows your project slug from
`pnpm project:rename` — the template default is `indiecrafts-web-backups-<env>`), keyed `sanity/…` and
`d1/<env>/…`.

## Manual backup

```bash
pnpm backup:web:sanity                       # → backups/sanity/  (local)
pnpm backup:web:sanity -- --remote           # + upload to <slug>-web-backups-prod
pnpm backup:web:sanity -- --remote --env staging
pnpm backup:web:d1:prod                      # → backups/d1/  (no-op until D1 is configured)
pnpm backup:web:d1:prod -- --remote          # + upload to R2
```

Sanity backup is read-only and needs `SANITY_API_READ_TOKEN`; D1 backup needs the Wrangler login /
`CLOUDFLARE_API_TOKEN`. Each keeps the **last 10** local dumps per source and prunes the rest.

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
