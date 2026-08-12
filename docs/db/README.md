# Db — data-layer docs

The **data layer**: schema, migrations, seed, and backups. Empty today — a stub
until the first schema lands. This page is _what it is_; the full pattern lives in
`method/db/database.md`.

## Key conventions

- **Migrations are forward-only and reviewed.** Never edit a shipped migration —
  add a new one, ordered and dated. Additive changes are safe; renames and drops
  are two-step across releases (expand → migrate → contract).
- **The app never talks raw SQL.** Access goes through a `code/packages/` data
  brick (typed queries), so the schema has one owner and one gateway.
- **Seed is idempotent.** Re-running `seed` converges — it never duplicates.
- **Constraints live in the DB**, not just app code — FKs, `NOT NULL`, unique.

## Secrets

Connection strings come from **env** — `.env.example` documents the variables.
Never commit real data or credentials; backups live outside git. Never log or
URL-expose PII.

## Where it sits (the four-folder mirror)

`code/db/` (build) ↔ `method/db/` (how) ↔ `docs/db/` (what — this page). Each
folder mirrors the others; a `<change>` to the data layer touches its matching
doc in lockstep.

## Getting started — when the schema lands

1. Read `method/db/database.md` for the full pattern (plan → migrate → back up).
2. Add the data brick under `code/packages/` — the single typed gateway.
3. Write the first migration + an idempotent seed; start this area's `CHANGELOG.md`.

## Pointers

- **How we do data** → `method/db/database.md`
- **Agent conventions for this slot** → `code/db/CLAUDE.md`
