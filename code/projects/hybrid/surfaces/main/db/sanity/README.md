# Reserved — `sanity` db (leaf)

**Not built — a reserved slot.** A Sanity content dataset at the **leaf** altitude, for the hybrid surface only.

> **Sanity is global/content-only** — one dataset per client, one hub Studio (`composeStudio`). A `sanity` db at platform/surface/leaf is rarely right; use the global content store.

**To activate:**

1. Add a row to `scripts/lib/databases.mjs`:
   `{ name, kind: "sanity", owner: "hybrid", altitude: "leaf", dir: "code/projects/hybrid/surfaces/main/db/sanity/<name>", backup: "sanity", order }`.
2. Fill `<name>/` here (migrations/seed; for `d1`/`kv` also add the binding to the owner's `wrangler.toml`).
3. Migrate: `node scripts/db-migrate.mjs <name> <env>` · Back up: `node scripts/backup-db.mjs <name> <env>`.

One owner per db — consumers reach it through the owner's API, never a second binding. Reserved, not
empty — delete if never needed. Scoping table → `code/projects/_registry.md`.
