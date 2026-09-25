# code/projects — the deployable surfaces

Auto-loads when you work under `code/projects/**`. Deployables nest **by platform → kind**:
`code/projects/<platform>/<kind>/<name>` (`kind` = `surfaces` · `services` · `tools`). Each project is
**self-contained**: it owns its `CLAUDE.md` (how to code), `README.md`, and `CHANGELOG.md`.

- **`web/`** — `next-cf` apps (`surfaces/website` — live + the hub Studio — · `surfaces/admin`) + `tools/storybook`.
- **`mobile/`** — `expo` (`surfaces/main`). It carries a
  reserved `tools/` marker (like `web/tools/storybook`) — every platform has the same `surfaces · tools`
  kind skeleton; activate a tool when the platform needs one.
- **The cross-platform `shared/` tier moved up** — the `worker-cf` services (`api` · `cron` · `workers`)
  - the ops layer (`db · infra` folders + the `scripts` toolchain + registries; `domains` is toolchain-only) now live at **`code/shared/`**
    (top-level, a sibling of `projects/`), **not here**. `projects/` is per-platform only.
- **Product docs** live one level up at `code/docs/` (a sibling of `projects/`), **not here** — VitePress, npm-isolated; documents the whole product, not one platform.
- **Service scoping** — the same `api`/`cron`/`workers` trio is reserved at two lower altitudes as
  README markers: `<platform>/shared/{api,cron,workers}` (a platform's own backend) and
  `<platform>/surfaces/<leaf>/{api,cron,workers}` (a leaf's own). Reach for the highest that fits; the
  full table + activation steps → [`_registry.md`](../_registry.md). `<platform>/shared/` also holds
  code shared across that platform's surfaces.

Human roster → `_registry.md`; machine source of truth → [`code/shared/scripts/lib/apps.mjs`](../../shared/scripts/lib/apps.mjs)
(carries each app's `dir` — every path resolver reads it, never a hard-coded `code/projects/<slug>`).

**Stack:** per-app, by platform class. `next-cf` (`website`): Next.js 16 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Sanity v6. `worker-cf`: bare Cloudflare Worker. `expo`: React Native / Expo.

## Rules

- **Run from the repo root** — `pnpm dev/build/verify` (turbo → the app). Don't `cd` into an app to run scripts.
- **No cross-app imports.** Apps share code only through `code/packages/` bricks (global) or a
  `<platform>/shared/` layer (platform-scoped), never by reaching into a sibling app.
- **Adding a project** — drop it under its platform + kind (`code/projects/<platform>/<kind>/<name>/`)
  with its own `CLAUDE.md` + `README.md`; add a row to `code/shared/scripts/lib/apps.mjs` (`slug · pkg · class ·
platform · kind · dir · order`) + `_registry.md`. The `pnpm-workspace.yaml` globs
  (`code/projects/*/{surfaces,services,tools}/*`) pick it up; CI fans out from the registry — no workflow edit.

App conventions live in each app's own brief — e.g. [`web/surfaces/website/CLAUDE.md`](../web/surfaces/website/.claude/CLAUDE.md).
