# db — the data layer (registry-driven, altitude-scoped, multi-kind)

> Relational + content data. **No longer a single D1 here** — databases are declared in a registry and
> live at the altitude that owns them, of whatever kind fits. This folder is the **index**.

## The model

A database is a **registry row** (`kind` · `owner` · `altitude` · `dir` · `backup`) — mirrors the app
registry `scripts/lib/apps.mjs`. Runners read it and dispatch on `kind`.

- **Registry:** [`scripts/lib/databases.mjs`](../../../../scripts/lib/databases.mjs) — the source of truth.
- **Kinds:** `d1` · `kv` (Cloudflare) · `postgres` · `supabase` · `sanity` (content).
- **Altitudes (where a db lives — mirrors the projects tree):**
  - global → `code/shared/db/<kind>/<name>`
  - platform → `code/projects/<platform>/shared/db/<kind>/<name>`
  - surface → `code/projects/<platform>/surfaces/db/<kind>/<name>`
  - leaf → `code/projects/<platform>/surfaces/<leaf>/db/<kind>/<name>`
  - (a single-owner db may co-locate in its owner, e.g. `shared/api/db/…` — the `dir` decides.)
- **Definition vs instance:** the shared **schema/types/queries** are the reserved `code/packages/data`
  brick (activate at ≥2 consumers; Drizzle is portable across d1/postgres). The **migrations + binding +
  backup** co-locate with the owner.

## Commands (registry-driven)

```bash
pnpm db:migrate:<name>:<env>                     # per-entity, e.g. db:migrate:audit:prod (pre-migration R2 snapshot on staging/prod)
node scripts/backup-db.mjs <name> <env> [--remote]   # one db
pnpm db:backup:all:<env>                          # every registered db
pnpm db:backup:content:prod                       # the Sanity content dataset (the one active db)
```

## One rule

**One owner per database** — the service/app that binds + migrates it. Everyone else reaches it through
the owner's API; never bind one D1 to two workers. Full scoping table → [`code/projects/_registry.md`](../../_registry.md).
