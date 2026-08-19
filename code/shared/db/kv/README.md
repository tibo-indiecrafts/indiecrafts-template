# Reserved — `kv` db (global)

**Not built — a reserved slot.** A Cloudflare KV namespace (key-value cache/ephemeral) at the **global** altitude, for every project (all platforms).

**To activate:**

1. Add a row to `scripts/lib/databases.mjs`:
   `{ name, kind: "kv", owner: "shared", altitude: "global", dir: "code/shared/db/kv/<name>", backup: "kv", order }`.
2. Fill `<name>/` here (migrations/seed; for `d1`/`kv` also add the binding to the owner's `wrangler.toml`).
3. Migrate: `node scripts/db-migrate.mjs <name> <env>` · Back up: `node scripts/backup-db.mjs <name> <env>`.

One owner per db — consumers reach it through the owner's API, never a second binding. Reserved, not
empty — delete if never needed. Scoping table → `code/projects/_registry.md`.
