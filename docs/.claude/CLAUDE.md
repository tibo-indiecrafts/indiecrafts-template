# docs — product canon (VitePress)

Auto-loads when you work under `docs/**`. The product documentation site — a repo-root
sibling, **npm-isolated** from the pnpm workspace. Foldered like the code:
`shared/` + `apps/web/` (`setup/ config/ design/ seo/`) +
`modules/` (`blog/`) + `packages/ db/ infra/`. `index.md` is the home (no README).

**Stack:** VitePress (npm-isolated from the pnpm workspace). Product-docs site (:3002).

## Commands

```bash
pnpm docs:install   # once (npm inside docs/)
pnpm docs           # dev → http://localhost:3002
pnpm docs:build     # static → .vitepress/dist
```

## Rules (VitePress gotchas)

- **Put a doc where its code lives** — mirror the spine (`apps/web/…`, `features/<name>/` ↔ `src/features/<name>/`).
- **Add a page = drop the `.md` AND the sidebar line** in `.vitepress/config.mts`, same change. `ignoreDeadLinks` is on — broken links won't fail the build, so check by hand.
- **Backtick bare `<placeholders>`** and JSX **`{{…}}`** inside inline code — the Vue parser treats them as markup/interpolation and the build hard-fails.
- **Deps stay in `docs/`** — npm-managed, never touch the app's pnpm tree.
- Log doc changes in `docs/CHANGELOG.md`; roll up to root at release.
