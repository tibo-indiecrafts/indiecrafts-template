# Reserved — `supabase` db (leaf)

**Not built — a reserved slot.** A Supabase database (hosted Postgres + auth/storage) at the **leaf** altitude, for the mobile surface only.

> A leaf usually **consumes** a shared/platform db; owning one couples data to this surface. Prefer a higher altitude unless the data is truly leaf-bound.

**To activate:**

1. Add a row to `scripts/lib/databases.mjs`:
   `{ name, kind: "supabase", owner: "mobile", altitude: "leaf", dir: "code/projects/mobile/surfaces/main/db/supabase/<name>", backup: "supabase", order }`.
2. Fill `<name>/` here (migrations/seed; for `d1`/`kv` also add the binding to the owner's `wrangler.toml`).
3. Migrate: `node scripts/db-migrate.mjs <name> <env>` · Back up: `node scripts/backup-db.mjs <name> <env>`.

One owner per db — consumers reach it through the owner's API, never a second binding. Reserved, not
empty — delete if never needed. Scoping table → `code/projects/_registry.md`.
