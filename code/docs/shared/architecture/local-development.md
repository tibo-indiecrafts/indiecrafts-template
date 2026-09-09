# Local development

Run the whole stack on your machine, wired to the **real remote Cloudflare `dev`
resources**. D1, KV and R2 bind to the live `dev` databases (`wrangler dev --env dev
--remote`); Sanity is remote too. There is no miniflare tier — local dev and the deployed
`dev` worker share the one `dev` database, so your test data is real and visible everywhere.

This needs **wrangler auth + a network connection**, and the `dev` D1 is **shared across
developers** (no per-machine isolation). That trade is deliberate: one `dev` database is far
more workable for this template than an offline store that never sees real users.

## TL;DR

```bash
pnpm install
wrangler login             # once — local dev binds the real dev resources
pnpm db:migrate:all:dev    # apply the D1 schema to the dev database (once + after new migrations)
pnpm dev                   # website + all four workers (api :8787, agent, cron, workers), each `--env dev --remote`
```

Then set two values in the website's `.env.local` (copy `.env.example`) — see [Databases](#the-four-data-stores) and [Sanity](#sanity-content).

## The four data stores

The registry declares four data stores. The D1s, KV and R2 bind to the real `dev` resources; Sanity is remote too.

| Store                | Kind   | Local behaviour                                          |
| -------------------- | ------ | -------------------------------------------------------- |
| `main` (`MAIN_DB`)   | D1     | **remote dev** — `db:migrate:all:dev` creates its schema |
| `audit` (`AUDIT_DB`) | D1     | **remote dev** — same                                    |
| `security-counters`  | KV     | **remote dev** — no schema; works empty, automatically   |
| `content`            | Sanity | **remote** — see [Sanity](#sanity-content)               |

`dev` is a real remote tier, the same one `staging`/`prod` are (all real remote Cloudflare D1s).
Full model → the `code/shared/db` brief and [Deployment](../../apps/web/setup/deployment).

- **First run, and after adding any migration:** `pnpm db:migrate:all:dev`. This is a real remote
  D1 — the migrate runner takes a pre-migration R2 snapshot first (aborts on failure).
- `pnpm dev` binds the same remote `dev` D1, so migrate, then `pnpm dev`; the two always agree.

## Point the website at the local api

The website has no D1 of its own — its DB-backed features (session log, DSAR intake, self-erasure)
call the api over HTTP. In the website's `.env.local`:

```bash
API_URL=http://localhost:8787
NEXT_PUBLIC_API_URL=http://localhost:8787
```

Without these the site still runs; those features just can't reach the api.

## Sanity (`content`)

Content is Sanity, not a D1 — `db:migrate:all:dev` never touches it. For the blog and
Studio locally, set a real Sanity project in `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=…
NEXT_PUBLIC_SANITY_DATASET=production
```

Leave them unset and the `blog` / `studio` feature flags stay off — the marketing site runs without content.

## Caveats

- **The `dev` D1 is shared.** Every developer's `pnpm dev` reads and writes the same remote `dev`
  database. Your local rows are everyone's; don't put anything there you would not put in a shared env.
- **`api` and `cron` bind the same remote `dev` D1s** — so a row the api writes, the cron job sees
  (no separate local state to keep in sync).
- **Deploying still needs the real IDs.** `dev`/`staging`/`prod` D1 IDs live in `wrangler.toml`;
  local dev reuses the `dev` ones → [Deployment](../../apps/web/setup/deployment).

## Migrating the real environments

`db:migrate:<db>|all:<tier>` picks the tier: `dev` / `staging` / `prod` — all real remote D1s, each
taking a pre-migration R2 snapshot that **aborts on failure**; a prod run **confirms first**. Full
script list → [Scripts](../../apps/web/setup/scripts); the R2 snapshots → [Backups](../../apps/web/setup/backups).
