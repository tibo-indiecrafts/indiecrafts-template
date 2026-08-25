# Local development

Run the whole stack on your machine with **no Cloudflare account and no real database IDs** —
D1 and KV are simulated by miniflare (`wrangler dev`); Sanity is the one store that stays remote.

## TL;DR

```bash
pnpm install
pnpm db:migrate:all:local   # create the D1 schema in the local miniflare store (once + after new migrations)
pnpm dev                    # website + api (localhost:8787) + cron, all local
```

Then set two values in the website's `.env.local` (copy `.env.example`) — see [Databases](#the-four-databases-locally) and [Sanity](#sanity-content).

## The four databases, locally

The registry declares four data stores; the D1s and KV run in miniflare, Sanity does not.

| Store | Kind | Local behaviour |
| --- | --- | --- |
| `core` (`CORE_DB`) | D1 | miniflare — `db:migrate:all:local` creates its schema |
| `audit` (`DB`) | D1 | miniflare — same |
| `security-counters` | KV | miniflare — no schema; works empty, automatically |
| `content` | Sanity | **remote** — see [Sanity](#sanity-content) |

`local` is a real tier, distinct from `dev`/`staging`/`prod` (which are real remote Cloudflare D1s).
Full model → the `code/shared/db` brief and [Deployment](./deployment).

- **First run, and after adding any migration:** `pnpm db:migrate:all:local`. Offline; no IDs.
- The local D1 lives in `code/shared/api/.wrangler/state`, which `wrangler dev` reads too — so migrate, then `pnpm dev`.

## Point the website at the local api

The website has no D1 of its own — its DB-backed features (session log, DSAR intake, self-erasure)
call the api over HTTP. In the website's `.env.local`:

```bash
API_URL=http://localhost:8787
NEXT_PUBLIC_API_URL=http://localhost:8787
```

Without these the site still runs; those features just can't reach the api.

## Sanity (`content`)

Content is a remote store, not a local D1 — `db:migrate:all:local` never touches it. For the blog and
Studio locally, set a real Sanity project in `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=…
NEXT_PUBLIC_SANITY_DATASET=production
```

Leave them unset and the `blog` / `studio` feature flags stay off — the marketing site runs without content.

## Caveats

- **`api` and `cron` keep separate local D1s** — different workers, different miniflare state. `db:migrate:all:local`
  migrates the api's (the owner). You rarely run `cron` locally; just know they don't share local data.
- **Local needs no real IDs; deploying does.** Creating the real `dev`/`staging`/`prod` D1s and pasting their
  IDs into `wrangler.toml` is a separate step → [Deployment](./deployment).

## Migrating the real environments

`db:migrate:<db>|all:<tier>` picks the tier: `local` (miniflare) · `dev` / `staging` / `prod` (real remote D1s,
each taking a pre-migration R2 snapshot that **aborts on failure**; a prod run **confirms first**). Full script
list → [Scripts](./scripts); the R2 snapshots → [Backups](./backups).
