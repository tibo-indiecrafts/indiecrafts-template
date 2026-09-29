# docs — product canon (VitePress)

Auto-loads when you work under `code/docs/**`. The product documentation site — a top-level
project at `code/docs/` (sibling of `projects/ packages/ modules/ shared/`), **npm-isolated** from the
pnpm workspace (matches no workspace glob, so it stays out; its own lockfile). **Mirrors the code
spine exactly:** `projects/web/{website,admin,app,tools}` + `projects/mobile/main` ·
`packages/{shared,web}/<name>.md` · `modules/web/{blog,contact,newsletter,waitlist}` ·
`shared/{api,cron,workers,db,infra,scripts,architecture,client-intake}` · `contributing/` (governance

- ADRs). `index.md` is the home; `quick-start.md` leads. Conventions → `contributing/how-we-document`.

**Stack:** VitePress (npm-isolated from the pnpm workspace). Product-docs site (:3002).

## Commands

```bash
pnpm docs:install   # once (npm inside docs/)
pnpm docs           # dev → http://localhost:3002
pnpm docs:build     # static → .vitepress/dist
```

## Rules (VitePress gotchas)

- **Put a doc where its code lives** — mirror the spine (`packages/<scope>/<name>.md` ↔ `code/packages/<scope>/<name>`, `modules/web/<name>/` ↔ `code/modules/web/<name>`, platform-wide → `shared/`). `pnpm check:doc-coverage` fails if a code unit has no page.
- **Add a page = drop the `.md`, the sidebar line** (`.vitepress/config.mts`), and its frontmatter (`title`/`description`/`status`) — same change.
- **Dead links FAIL the build.** `ignoreDeadLinks` is an allow-list (code-tree pointers · localhost), not `true`. Run `pnpm docs:build` — a green build is the link check. Prefer absolute `/paths` over relative.
- **Bare `<placeholders>` go in backticks**; a `{{x.y}}` (Vue interpolation on a member) hard-fails the build even inside inline code — put it in a fenced block or `<code v-pre>`.
- **Deps stay in `docs/`** — npm-managed, never touch the app's pnpm tree. Changelogs are `cp`-synced via `scripts/sync-changelog.mjs` (`pnpm test:scripts` covers it) — never hand-edit `*/changelog.md`.
- Log doc changes in `docs/CHANGELOG.md`; roll up to root at release. Full conventions → [`contributing/how-we-document`](contributing/how-we-document.md).
