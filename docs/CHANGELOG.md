# Changelog — docs site

Changes to the **documentation site itself** (`docs/`): pages added, removed, or moved;
structure and sidebar; the docs build. **Not** product features — those are the app's
history ([`code/apps/web/CHANGELOG.md`](../code/apps/web/CHANGELOG.md)); the repo-wide
roll-up is the [root changelog](../CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com).

## [Unreleased]

### Changed

- **i18n "Adding a locale" expanded.** `apps/web/config/i18n-and-routing.md` gains the
  **don't-pre-fill-locales** rule (an empty `messages/<code>.json` ships English under a foreign URL),
  a **content-home table** (editorial/UI copy + SEO → Sanity + `messages/`; technical number/money/date/
  grammar rules → `config` + `@indiecrafts/format`, **not** Sanity), and an **RTL** note (`dir` drives
  `<html dir>`; audit logical spacing utilities). Reinforces "as much content as possible editable in
  Sanity."
- **`db/README.md` → Cloudflare D1.** The data-layer page now specifies **Cloudflare D1**
  (relational app data, Worker-bound — not a connection string) + **KV** (cache/sessions), with
  the split that content stays in **Sanity** and D1 is opt-in for data that isn't content. Adds
  forward-only `wrangler d1 migrations`, Time Travel + `wrangler d1 export` backups, and the
  data-brick access pattern. Was a generic-SQL stub.

### Added

- **On-the-fly quality checks doc + a11y hook.** New `apps/web/setup/on-the-fly-checks.md` (+ sidebar)
  maps the tiered feedback model — **edit-tier cards** (design + **new `jsx-a11y` accessibility** cards),
  **stop-tier** deep passes, the **commit** hard gate, on-demand **scans**. It documents the repo's new
  `.claude/hooks/a11y-check.mjs` hook, which cards structural accessibility findings as UI is written
  (the design hook's twin), running the app's exact `jsx-a11y` rules via eslint `--stdin` so files in
  packages/modules are covered too (bypasses `eslint-config-next`'s base-path skip). Non-blocking —
  commit stays the gate. Cross-linked from the `accessibility` rule.
- **CI docs.** `apps/web/setup/scripts.md` gains a **CI workflows** table + an accurate "CI mirrors
  verify + build" tip (it previously claimed CI ran verify + build when `test.yml` ran neither);
  `apps/web/setup/deployment.md` documents the per-PR **preview deploys** (`preview.yml`).
- **`apps/web/setup/backups.md`** (+ sidebar) — the Sanity + D1 backup runbook: the gitignored
  `backups/` folder layout, manual local vs `--remote` (R2), the per-env backup buckets, the nightly
  GitHub Action, R2 lifecycle rotation, and restore (Sanity `content:import` · D1 Time Travel).
  `scripts.md` swaps `content:export` for `backup:web:sanity` + `backup:web:d1:<env>`; the db docs
  point their backup bullets at the scripts.
- **Moved `newsletter` + `cookie-consent` docs to their new homes.** `apps/web/config/newsletter.md`
  → `modules/newsletter/index.md` (the `@indiecrafts/newsletter` module) and
  `apps/web/config/cookie-consent.md` → `packages/consent.md` (the `@indiecrafts/consent` brick);
  sidebar updated (Modules · Newsletter, Packages · consent; dropped the two config entries).
- **`apps/web/setup/testing.md`** (+ sidebar, after Scripts) — the testing system: the layer
  table (unit · component · integration · i18n parity · e2e · visual · a11y · contrast · perf),
  where tests live (colocated, matching `*.stories.tsx`; e2e in `code/apps/web/e2e/`; visual via
  Storybook), how to run (`pnpm test` folded into `verify`, `pnpm e2e`), the platform-specific
  visual-baseline caveat, and a what-to-test-vs-skip heuristic for a Sanity marketing/blog site.
- **`apps/web/config/newsletter.md`** (+ sidebar) — the newsletter capture feature: `features.
  newsletter`, the `destination` modes (sanity / provider / both), the submit flow + response
  codes, the Abonnés desk, provider setup, and GDPR. A `feature-flags.md` row was added; block
  counts were bumped across the blog + ui-components docs (14 modules, 10 inline, 11 generic
  renderers, new `form/` domain).

### Changed

- **`design/responsive-design.md` → `design/adaptive-responsive.md`.** Retitled + expanded (sidebar +
  inbound refs updated): leads with the responsive-vs-adaptive decision ("name the mechanism"), adds
  container-query / input-method / safe-area / adaptive-swap guidance with code, keeps the existing
  mobile-first + container-variable + imagery + reduced-motion sections. Also: `docs/packages/ui-components.md`
  + `docs/packages/storybook.md` reflect the renderer `web/<domain>/` reorg.

### Added

- **`modules/blog/comments.md` — Blog comments.** New page (+ sidebar line): how the moderated
  comment feature works, Studio moderation, editing the per-locale copy, spam/privacy, the
  `blogComments` flag, and the write-token-is-runtime deploy note. Also: `packages/sanity`
  gained the `./write` export; `feature-flags` lists `blogComments`.

### Changed

- **Hid the internal `method/` + `work/` folders from the client-facing docs.** The Pillars
  nav (Method/Lab links) is now **dev-only** (`NODE_ENV=production` drops it); the home hero
  "How we work (method)" feature became "Workspace & deployment"; `getting-started` reframes
  around the two client folders (`code/`, `docs/`) with method/work as a brief "private" note.
  Swept the `method/`/`work/` pointer links + "four-folder mirror" boilerplate out of the
  README/overview/packages pages. Removed the stray `apps/web/setup/git-worktrees.md` (+ its
  sidebar line) — finishing the earlier worktree removal.

### Added

- **`apps/web/setup/workspace.md` — Workspace & deployment.** New page: the monorepo layout,
  run commands, and the **deploy-app+docs-only** rule, with a "Private folders" section on
  keeping `method/` + `work/` from clients (undeploy or auth-gate; hand over `code/`+`docs/`
  only). Wired into the Setup sidebar + the home features grid.
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
