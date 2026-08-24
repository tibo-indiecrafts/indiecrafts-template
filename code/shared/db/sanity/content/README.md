# `content` — the Sanity content dataset (active)

**The one real database today.** Kind `sanity`, altitude `global`, owner `website` (the hub Studio).
This is the tenant's **content** store — one dataset per client, edited through the single hub Studio
(`composeStudio` in `website/sanity.config.ts`). It has **no migrations** (schema is code, composed from
`SanityModule` bricks; the dataset itself is Sanity-cloud).

- **Registered** in `scripts/lib/databases.mjs` as `{ name: "content", kind: "sanity", owner: "website",
altitude: "global", backup: "sanity" }`.
- **Back up:** `node scripts/backup-db.mjs content prod [--remote]` (was `backup:website:sanity`) →
  `sanity dataset export`; `--remote` also copies to the per-env R2 backups bucket. Needs
  `SANITY_API_READ_TOKEN` + `NEXT_PUBLIC_SANITY_*`.
- **Restore:** `pnpm db:restore:content`.

Not a D1/SQL database — no `db-migrate`. See the scoping table in `code/projects/_registry.md`.
