# code/db — schema · migrations · seed · backups

Auto-loads when you work under `code/db/**`. The data layer. Empty today (a `.gitkeep` +
one-line README). **How we do data** → the internal dev framework. **What it is** →
`docs/db/`.

**Stack:** **Cloudflare D1** (serverless SQLite, a Worker binding) + **KV** for cache/ephemeral. Reserved — no schema yet. Content is Sanity; D1 is for relational app data that isn't content. Reached only through a `code/packages/` data brick.

## Conventions (when the schema lands)

- **D1 is bound, not connected** — the DB is a Worker binding (`env.DB` via `getCloudflareContext()`), declared per env in `code/projects/web/wrangler.toml` (`[[d1_databases]]`). No connection string, no secret URL.
- **Migrations are forward-only** — `wrangler d1 migrations create/apply` under `code/db/migrations/`; never edit a shipped migration. Apply `--local` (dev) then `--env <env>`. Renames/drops are two-step (expand → migrate → contract) — D1 has no down-migrations.
- **The app never scatters raw SQL** — one `code/packages/` data brick (Drizzle `drizzle-orm/d1` or prepared statements) owns the schema + queries.
- **Seed is idempotent** — `wrangler d1 execute <db> --file seed.sql` (or a Drizzle seed); mirror `code/projects/web/scripts/seed-*`.
- **Back up before destructive migrations** — `wrangler d1 export`; D1 Time Travel restores up to 30 days. Never commit real data; never log or URL-expose PII.
- **Don't duplicate Sanity content into D1** — one source of truth per kind of data.
- Log schema changes in this area's own `CHANGELOG.md` (create with the first migration); roll up to root at release.
