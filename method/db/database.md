# Database & migrations (Cloudflare D1)

**Principle:** relational/transactional app data lives in **Cloudflare D1** (serverless
SQLite, bound to the Worker). Content stays in **Sanity** — D1 is for data that is _not_
content: orders, accounts, events, counters. Schema changes are versioned, forward-only,
and applied in a safe order.

## The data stores

| Store      | For                                             | Access                         |
| ---------- | ----------------------------------------------- | ------------------------------ |
| **Sanity** | Editable content (pages, blog, settings)        | GROQ via `@indiecrafts/sanity` |
| **D1**     | Relational app data (orders, users, logs)       | Worker binding `env.DB`        |
| **KV**     | Ephemeral / cache (sessions, rate-limit, flags) | Worker binding `env.KV`        |
| **R2**     | Objects (already the ISR cache; user uploads)   | Worker binding                 |

Don't copy Sanity content into D1 — that's two sources of truth. Reach for D1 only when the
data isn't editorial.

## D1 is a binding, not a connection string

No secret URL. The DB is bound per env in `wrangler.toml` (`[[d1_databases]]`, like the R2
ISR bucket) and reached in server code via `getCloudflareContext().env.DB`
(`@opennextjs/cloudflare`). Locally, `wrangler dev` / `preview:cf` use a local SQLite.

## Best practice

- **Every schema change is a migration file** — `wrangler d1 migrations create <db> <name>`,
  committed + ordered under `code/shared/db/migrations/`. Never a manual dashboard edit.
- **Forward-only.** Apply with `wrangler d1 migrations apply <db> --local` (dev) then
  `--env <env>` (remote). D1 has no down-migrations — roll forward.
- **Expand → migrate → contract** for renames/drops: add the new column/table, backfill,
  switch reads/writes, then drop the old — never drop-then-add in one release.
- **Back up before a destructive migration** — `node code/shared/scripts/data/backup.mjs <name> <env>` (dumps to `backups/d1/`;
  `--remote` → the R2 backups bucket). D1 **Time Travel** also restores up to 30 days. A nightly
  GitHub Action backs up prod. Full story → `docs/apps/web/setup/backups.md`.
- **The app never scatters raw SQL** — access goes through a `code/packages/` data brick
  (Drizzle `drizzle-orm/d1` for typed queries, or prepared statements). One owner, one gateway.
- **Seed is idempotent** — `wrangler d1 execute <db> --file seed.sql`, or a Drizzle seed
  script; re-running converges, never duplicates.
- **Constraints in the DB** — FKs, `NOT NULL`, unique. **PII**: encrypt sensitive columns,
  never log or URL-expose.
- **One D1 per env** (dev / staging / prod), bound in `wrangler.toml [env.*]`.

## Plan first

What changes · is it reversible (or expand→contract) · does it need a backfill · what's the
rollback (Time Travel? a re-apply?) · tested on a local/staging DB?

## Anti-patterns

Manual prod schema edits · drop-then-add in one deploy · no export before a destructive change
· PII in plaintext · duplicating Sanity content into D1.
