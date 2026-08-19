# Reserved — `supabase` db (surface)

**Not built — a reserved slot.** A Supabase database (hosted Postgres + auth/storage) at the **surface** altitude, for the mobile platform's surfaces (surface-group).

**To activate:**

1. Add a row to `scripts/lib/databases.mjs`:
   `{ name, kind: "supabase", owner: "mobile", altitude: "surface", dir: "code/projects/mobile/surfaces/db/supabase/<name>", backup: "supabase", order }`.
2. Fill `<name>/` here (migrations/seed; for `d1`/`kv` also add the binding to the owner's `wrangler.toml`).
3. Migrate: `node scripts/db-migrate.mjs <name> <env>` · Back up: `node scripts/backup-db.mjs <name> <env>`.

One owner per db — consumers reach it through the owner's API, never a second binding. Reserved, not
empty — delete if never needed. Scoping table → `code/projects/_registry.md`.
