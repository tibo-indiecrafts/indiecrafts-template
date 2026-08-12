# Changelog — docs site

Changes to the **documentation site itself** (`docs/`): pages added, removed, or moved;
structure and sidebar; the docs build. **Not** product features — those are the app's
history ([`code/apps/web/CHANGELOG.md`](../code/apps/web/CHANGELOG.md)); the repo-wide
roll-up is the [root changelog](../CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com).

## [Unreleased]

### Added

- **Code-intelligence (LSP) tooling documented.** New `shared/tooling/code-intelligence.md`
  (what LSP plugins do · install · safety · language coverage · the monorepo note) + a Tier 2
  row and install block in `apps/web/setup/environment.md` + a "Working with an AI agent"
  pointer in `getting-started.md` + sidebar line. Covers `typescript-lsp@claude-plugins-official`
  for this TS/React repo and the per-language plugins for other stacks.
- **One doc page per package** (`docs/packages/<name>.md` for all 7 bricks incl. the new
  `ui-components`); `packages/README.md` became a linking index. New **Packages** sidebar group
  (Overview + 7 bricks + Changelog); the blog group became a **Modules** group (Overview +
  Changelog + blog pages).
- **Area changelogs surfaced in the site** — `sync:changelog` now also copies
  `code/packages/CHANGELOG.md` → `packages/changelog.md` and `code/modules/CHANGELOG.md` →
  `modules/changelog.md` (generated, git-ignored, like the app one).

### Changed

- **Full rewrite of the web/app + modules + packages docs** against the post-extraction code
  (39 pages): all `apps/web/{setup,config,design,seo}` prose guides, `modules/blog/**` (7),
  and `packages/`/`modules/` READMEs regenerated from current source — package/module
  architecture, `@indiecrafts/*` specifiers, blog-as-module wiring, and moved paths
  (config/ui/sanity/tokens, `DESIGN.md`) now consistent across the site.
- **Component docs colocated into the `@indiecrafts/ui` package.** The 61 per-primitive
  reference pages moved `apps/web/design/components/*.md` → `code/packages/ui/src/<name>.md`
  (beside each `.tsx`); they leave the VitePress site and are now indexed from a
  `### Component catalog` in [`DESIGN.md`](../code/packages/ui-tokens/DESIGN.md).
- **Blog docs relocated** `apps/web/features/blog/` → `modules/blog/` (6 guides + index),
  matching the code move to `code/modules/blog/`; inbound links, sidebar, top-nav repointed.
- Docs site moved from `code/docs/` to the repo-root `docs/`, mirroring the code spine.

### Added

- `modules/blog/index.md` — the blog module landing (what it is as a module + guide index).
- `apps/web/config/navigation.md` — editing the header + footer menus in Sanity.
