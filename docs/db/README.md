# Db — data layer (Cloudflare D1)

The **data layer** for relational/transactional data — **Cloudflare D1** (serverless SQLite,
bound to the Worker). Empty today: the template's content lives in **Sanity**, so most sites
never need D1. Reach for it only when the data isn't content — orders, accounts, event logs,
rate-limit counters.

## The stores

- **Sanity** — editable content (pages, blog, settings). GROQ via `@indiecrafts/sanity`.
- **D1** — relational app data. A Worker **binding** (`env.DB`), not a connection string.
- **KV** — ephemeral / cache (sessions, rate-limit, feature flags). Binding `env.KV`.
- **R2** — objects (already the ISR cache).

Don't duplicate Sanity content into D1 — one source of truth per kind of data.

## Key conventions

- **Migrations are forward-only** — `wrangler d1 migrations create/apply`, files committed +
  ordered under `code/db/migrations/`. Never a manual dashboard edit. Renames/drops are
  two-step across releases (expand → migrate → contract).
- **D1 is a binding.** No secret URL — bound per env in `code/apps/web/wrangler.toml`
  (`[[d1_databases]]`, like the R2 ISR bucket); reached via `getCloudflareContext().env.DB`.
  Local dev (`preview:cf`) uses a local SQLite.
- **The app never scatters raw SQL** — access goes through a `code/packages/` data brick
  (Drizzle `drizzle-orm/d1`, or prepared statements). One owner, one gateway.
- **Seed is idempotent** — `wrangler d1 execute <db> --file seed.sql`; re-running converges.
- **Constraints live in the DB** — FKs, `NOT NULL`, unique.

## Backups

D1 **Time Travel** gives automatic point-in-time restore (up to 30 days). For an offsite dump,
`pnpm backup:web:d1:<env>` (`--remote` → the R2 backups bucket); a nightly GitHub Action runs it.
Full story → [Backups](/apps/web/setup/backups). Never commit real data; never log or URL-expose PII.

## Getting started — when the first schema lands

1. `wrangler d1 create <name>` → copy the `database_id` into the `[[d1_databases]]` block in
   `wrangler.toml` (one per env).
2. Add the data brick under `code/packages/` — the single typed gateway (Drizzle or prepared
   statements).
3. `wrangler d1 migrations create` the first migration + an idempotent seed; start this area's
   `CHANGELOG.md`.
4. Bindings + secrets recap → [Deployment (Cloudflare)](/apps/web/setup/deployment).

## Pointers

- **Agent conventions for this slot** → `code/db/CLAUDE.md`

## Links

- **Live:** `<production URL>` · **Repo:** `<git URL>` · **Deploy:** `<Cloudflare dashboard>`

<!-- Template placeholders — fill per project; canonical URLs live in the root README. -->
