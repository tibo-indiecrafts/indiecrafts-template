# code/db — schema · migrations · seed · backups

Auto-loads when you work under `code/db/**`. The data layer. Empty today (a `.gitkeep` +
one-line README). **How we do data** → `method/db/database.md`. **What it is** →
`docs/db/`.

## Conventions (when the schema lands)

- **Migrations are forward-only and reviewed** — never edit a shipped migration; add a new one. Name them ordered + dated.
- **The app never talks raw SQL** — access goes through a `code/packages/` data brick (typed queries), so the schema has one owner and one gateway.
- **Seed is idempotent** — re-running `seed` converges, never duplicates (mirror `code/apps/web/scripts/seed-*`).
- **Never commit real data or credentials** — connection strings come from env (`.env.example` documents them); backups live outside git.
- Log schema changes in this area's own `CHANGELOG.md` (create with the first migration); roll up to root at release.
