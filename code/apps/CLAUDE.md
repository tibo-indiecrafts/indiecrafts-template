# code/apps — the deployable apps

Auto-loads when you work under `code/apps/**`. Each app is **self-contained**: it owns
its `CLAUDE.md` (how to code), `DESIGN.md` (tokens), `README.md`, and `CHANGELOG.md`.
Today there's one — `web/` (`@indiecrafts/web`). See `_registry.md` for the app roster.

## Rules

- **Run from the repo root** — `pnpm dev/build/verify` (turbo → the app). Don't `cd` into an app to run scripts.
- **No cross-app imports.** Apps share code only through `code/packages/` bricks, never by reaching into a sibling app.
- **Adding app #2** — create `code/apps/<name>/` with its own `CLAUDE.md` + `DESIGN.md` + `README.md`; add it to `pnpm-workspace.yaml` (already globs `code/apps/*`) and `_registry.md`. The root `CLAUDE.md` stays the thin platform router.

App conventions live in each app's own brief — e.g. [`web/CLAUDE.md`](web/CLAUDE.md).
