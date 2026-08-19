# Reserved — `d1` db (surface)

**Not built — a reserved slot.** A Cloudflare D1 database (SQLite, a Worker binding) at the **surface** altitude, for the hybrid platform's surfaces (surface-group).

**To activate:**

1. Add a row to `scripts/lib/databases.mjs`:
   `{ name, kind: "d1", owner: "hybrid", altitude: "surface", dir: "code/projects/hybrid/surfaces/db/d1/<name>", backup: "wrangler", order }`.
2. Fill `<name>/` here (migrations/seed; for `d1`/`kv` also add the binding to the owner's `wrangler.toml`).
3. Migrate: `node scripts/db-migrate.mjs <name> <env>` · Back up: `node scripts/backup-db.mjs <name> <env>`.

One owner per db — consumers reach it through the owner's API, never a second binding. Reserved, not
empty — delete if never needed. Scoping table → `code/projects/_registry.md`.
