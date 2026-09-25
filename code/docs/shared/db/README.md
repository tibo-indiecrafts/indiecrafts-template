---
title: "Db — data layer (Cloudflare D1)"
description: "The data layer for relational/transactional data — Cloudflare D1 (serverless SQLite, bound to the Worker)."
status: stable
---

# Db — data layer (Cloudflare D1)

The **data layer** for relational/transactional data — **Cloudflare D1** (serverless SQLite,
bound to the Worker). Empty today: the template's content lives in **Sanity**, so most sites
never need D1. Reach for it only when the data isn't content — orders, accounts, event logs,
rate-limit counters.

## The stores

- **Sanity** — editable content (pages, blog, settings). GROQ via `@indiecrafts/packages-web-sanity`.
- **D1** — relational app data. A Worker **binding** (`env.AUDIT_DB`), not a connection string.
- **KV** — ephemeral / cache (sessions, rate-limit, feature flags). Binding `env.KV`.
- **R2** — objects (already the ISR cache).

Don't duplicate Sanity content into D1 — one source of truth per kind of data.

## Key conventions

- **Migrations are forward-only** — `wrangler d1 migrations create/apply`, files committed +
  ordered under `code/shared/db/migrations/`. Never a manual dashboard edit. Renames/drops are
  two-step across releases (expand → migrate → contract).
- **D1 is a binding.** No secret URL — bound per env in `code/projects/web/surfaces/website/wrangler.toml`
  (`[[d1_databases]]`, like the R2 ISR bucket); reached via `getCloudflareContext().env.AUDIT_DB`.
  Local dev (`preview:cf`) uses a local SQLite.
- **The app never scatters raw SQL** — access goes through a `code/packages/` data brick
  (Drizzle `drizzle-orm/d1`, or prepared statements). One owner, one gateway.
- **Seed is idempotent** — `wrangler d1 execute <db> --file seed.sql`; re-running converges.
- **Constraints live in the DB** — FKs, `NOT NULL`, unique.

## Backups

Backups are **registry-driven** (`code/shared/scripts/data/backup.mjs`, dispatching on each db's `kind`).
D1 **Time Travel** gives point-in-time restore (30 days); for offsite dumps run
`node code/shared/scripts/data/backup.mjs <name> <env> --remote` → the R2 backups bucket, and `pnpm db:backup:all:<env>`
covers every registered db (a nightly GitHub Action runs it). Databases live at three altitudes
(global · platform · leaf) of any kind (`d1 · kv · postgres · supabase · sanity`) — see the
scoping table in the repo's `code/projects/_registry.md`. Full story → [Backups](/projects/web/website/setup/backups).
Never commit real data; never log or URL-expose PII.

## Getting started — when the first schema lands

1. `wrangler d1 create <name>` → copy the `database_id` into the `[[d1_databases]]` block in
   `wrangler.toml` (one per env).
2. Add the data brick under `code/packages/` — the single typed gateway (Drizzle or prepared
   statements).
3. `wrangler d1 migrations create` the first migration + an idempotent seed; start this area's
   `CHANGELOG.md`.
4. Bindings + secrets recap → [Deployment (Cloudflare)](/projects/web/website/setup/deployment).

## Pointers

- **Agent conventions for this slot** → `code/shared/db/.claude/CLAUDE.md`

## Links

- **Live:** `<production URL>` · **Repo:** `<git URL>` · **Deploy:** `<Cloudflare dashboard>`

<!-- Template placeholders — fill per project; canonical URLs live in the root README. -->
