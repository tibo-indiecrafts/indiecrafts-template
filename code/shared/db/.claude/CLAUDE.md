# code/shared/db — the data-layer index (registry-driven)

Auto-loads when you work under `code/shared/db/**`. **Databases are no longer a single D1 here.** They are
declared in a registry and live at the altitude + kind that fits. This folder is the index +
conventions; the actual instances live at their altitude slots. **What it is** → `code/docs/db/`.

**Stack:** multi-kind — `d1` · `kv` (Cloudflare) · `postgres` · `supabase` · `sanity` (content). Registry:
`scripts/lib/databases.mjs`. Runners: `shared/scripts/data/migrate.mjs` + `shared/scripts/data/backup.mjs` (dispatch on `kind`).

## Conventions

- **A database = one registry row** (`name · kind · owner · altitude · dir · backup · order`) in
  `scripts/lib/databases.mjs`, plus its co-located instance under the owning altitude's `db/<kind>/<name>/`.
  Every path resolver reads the row's `dir` — never a hard-coded `code/shared/db/migrations`.
- **One owner per db.** The owner binds + migrates it; consumers reach it through the owner's API. Never
  bind one D1 to two workers.
- **Definition is a brick, instance co-locates.** Shared schema/types/queries → the reserved
  `code/packages/data` brick (activate at ≥2 consumers; Drizzle portable across d1/postgres). Migrations +
  binding + backup config → the owner's dir.
- **D1 is bound, not connected** — `env.DB` via `getCloudflareContext()`, declared per env in the owner's
  `wrangler.toml`. Migrations forward-only (`wrangler d1 migrations`), never edit a shipped one; expand →
  migrate → contract for renames/drops (D1 has no down-migrations).
- **Content is Sanity, not D1** — `kind: "sanity"`, one dataset per client, one hub Studio. Don't duplicate
  Sanity content into D1 — one source of truth per kind of data.
- **Back up before destructive migrations** (`data/backup.mjs`; D1 Time Travel restores 30 days). Never commit
  real data; never log or URL-expose PII.
- Log schema changes in this area's own `CHANGELOG.md` (create with the first migration); roll up to root.
