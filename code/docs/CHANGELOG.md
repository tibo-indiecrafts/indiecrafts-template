# Changelog — docs site

Changes to the **documentation site itself** (`code/projects/docs/`): pages added, removed, or moved;
structure and sidebar; the docs build. **Not** product features — those are the app's
history ([`code/projects/web/CHANGELOG.md`](../web/CHANGELOG.md)); the repo-wide
roll-up is the [root changelog](../../../CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com).

## [Unreleased]

### Added

- **Design critique (ordered) reference page.** New `apps/web/design/design-critique.md` under "Web app ·
  Design & content" — the four-lens ordered critique (accessibility → visual hierarchy → content →
  interaction-states), why the order matters, ready prompts, and ordered-vs-parallel guidance. Also added
  the **API security limits** config page (`apps/web/config/security-limits.md`) and refreshed
  `packages/ui-tokens.md` (DTCG source + colocated sidecars) and `packages/security.md` (request-side
  guard + `verify:api-guards`).

### Fixed

- **Sidebar + cross-link drift.** Three sidebar links pointed at pages that had moved
  (`workspace`/`multi-app` → `shared/architecture/`, `cloudflare-iac` → `infra/`) and eight in-page
  links referenced renamed pages (`packages/consent` → `packages/compliance`, `packages/security-headers`
  → `packages/security`). Repointed all; a repo-wide check now reports **0 broken sidebar links, 0 broken
  in-page links, 0 orphan pages**. The docs already mirror the code at the right altitude
  (`apps/ · packages/ · modules/ · shared/ · infra/`) — a full URL re-folder to the code's new
  platform→kind nesting was assessed as high-churn / low-reader-value and deliberately not done.

### Changed

- **The docs site moved to `code/projects/docs` (was a root sibling).** Deployables now all live
  under `code/projects/` — the docs (this site) + `storybook` joined the runtime apps there. Docs
  stays **npm-isolated** (excluded from the pnpm workspace via `!code/projects/docs`, its own
  lockfile); `pnpm docs` / `docs:build` / `docs:install` are unchanged (they repoint via the root
  scripts). `sync:changelog` cp paths were rebased. The architecture pages (`shared/architecture/workspace`,
  `getting-started`, `apps/web/setup/scripts`) + the folder-map narrative were reframed from the
  four-root layout (`code/ · docs/ · method/ · work/`) to three roots + docs-as-project. _Why:_
  everything deployable belongs under `code/projects/`.

### Added

- **`shared/architecture/platform-deploy.md` — the platform deploy model.** New canonical page (+ a new
  **Shared · Architecture** sidebar group that also surfaces the previously-unlinked `multi-app` +
  `workspace` pages): the app registry (`scripts/lib/apps.mjs`), the four platform classes
  (`next-cf`/`worker-cf`/`expo`/`electron`), the `deploy:<slug>:<env>` contract + shared runners,
  `deploy-all --only cloudflare|all`, and the registry-driven CI fan-out. Also updated `multi-app.md`'s
  infra + "where it stands" sections to reference it. _Why:_ the platform now spans 8 apps across 4
  classes — the deploy model needed one canonical page.

- **`setup/environment.md` — Browser verification prerequisites.** New subsection (under **AI coding
  tooling**) documenting what a dev needs to render→connect-tab→screenshot a change: the
  `claude-in-chrome` extension + MCP, a running `pnpm dev` tab, `/connect-chrome` (attach the real
  localhost tab, not a blank one) + `/setup-browser-cookies`, and `pnpm exec playwright install`. Also
  added the new **visual-verify** Stop hook to the `setup/on-the-fly-checks.md` stop-tier table + the
  local-hooks list. **Why:** the visual-verification loop had prerequisites nobody had written down,
  and the enforcing hook wasn't in the checks doc.

- **`setup/on-the-fly-checks.md` — new "pre" tier (the guard hook).** Documented the `guard.mjs`
  PreToolUse hook that denies destructive ops (force-push · `rm -rf` · `wrangler … delete` ·
  prod-dataset Sanity write) before a `Bash` call runs, plus added it to the local-hooks list.
  **Why:** the checks doc now covers all four tiers (pre · edit · stop · commit).

- **`apps/workers/` — Background Workers page + a scalable per-worker script/test structure.** New
  `docs/apps/workers/index.md` (+ sidebar group) explains how a Worker runs (handlers · `env` bindings ·
  per-env `wrangler.toml` · thin-shell-logic-in-bricks) and documents the tooling now scaffolded across the
  three bare slots (`api` · `cron` · `workers`): a **shared** `scripts/deploy-worker.mjs <app> <env>`
  (collapsing the per-slot copies), `scripts/setup-bindings.mjs <app> <env> <kv|d1|queue> <BINDING>` (provision
  - print the `wrangler.toml` block), uniform per-worker `package.json` scripts (`dev` · `cf-typegen` · `test`
    · `deploy:<app>:<env>` · `tail:<env>`), and root delegators (`deploy:<app>:<env>`, `test:workers`). Each
    slot gains a colocated `vitest.config.ts` + `src/index.test.ts` (health + scheduled) that run **inside
    workerd** via `@cloudflare/vitest-pool-workers` (`cloudflare:test` `SELF`/`env`), folded into `pnpm test` /
    `pnpm test:workers` / CI. **Why:** the slots were divergent (`workers` inlined its deploy; none had
    connectivity or tests) — now they mirror the web app's per-app × per-env pattern and scale uniformly.
    **The pool needed no Vitest bump:** it is pinned to the `0.8.x` line (peer `vitest 2.0.x–3.2.x`), so it
    runs on the repo's existing Vitest 3.2.7 with the full 16-task suite still green (switch to the
    `cloudflareTest()` plugin + `0.21.x` on the next Vitest-4 bump).

- **`apps/web/setup/environment.md` — Cloudflare agent-setup steps.** The "AI coding tooling" section now
  documents the official one-time setup (`claude plugin marketplace add cloudflare/skills` +
  `claude plugin install cloudflare@cloudflare` → `/reload-plugins`), the skills + 5 MCP servers it
  installs (`cloudflare-docs` public; `-api`/`-bindings`/`-builds`/`-observability` OAuth-on-first-use), and
  that wrangler `^4` is already an in-repo devDep (`pnpm exec wrangler`, no global). **Why:** the repo
  deploys to Cloudflare, so a new dev/agent should wire the Cloudflare tooling in one step.

- **Issue tags are now tracked in docs, not just code (wahio-style).** `scripts/tags-report.mjs` now
  scans `.md` (added `.md` to its extension set), and a doc may carry an `## Issue tags` footer listing
  the tags for a real, owned gap it describes — so `pnpm tags:report` / `tags:check` count doc references
  too. The vocabulary/meta docs (`.claude/rules/issue-tags.md`, `apps/web/setup/scripts.md`) are excluded
  (and any `CHANGELOG.md`) so example/historical tokens don't pollute counts. Convention documented in `.claude/rules/issue-tags.md`;
  seeded on both wiring guides (`@debt COUPLING` on the manual brick/module activation); guarded by
  `scripts/tags-report.test.mjs`. **Why:** make architectural coupling/debt visible + trackable from the
  docs that describe it, not only inline in code.

- **Two generic wiring guides — how to link a package · how to link a module.**
  `packages/linking-a-package.md` (the five wires + the Sanity one-line mount + why a package can't
  own a route — the app adds a thin `app/**` shell) and `modules/linking-a-module.md` (the same five
  wires **plus** the feature flag, the `configure*` injection, and the route-gate). **Why:** the
  package/module → app wiring was scattered across `CLAUDE.md` files; these give it one canonical,
  cross-linked home. Both added to the Packages / Modules sidebar groups.

### Fixed

- **Workspace install was broken; now installs clean (`pnpm-workspace.yaml` + root config).** A fresh
  `pnpm install --frozen-lockfile` (CI + client path) failed — a stale lockfile, plus the 7-day
  `minimumReleaseAge` + `no-downgrade` trust gates blocking legitimate transitives across the now
  9-app multi-platform tree (Cloudflare/Workers, electron, expo/react-native, AWS-SDK, flow-_, …).
  Fixes: (1) **age window 7d → 3d** + a `minimumReleaseAgeExclude` for fast-moving trusted toolchains;
  (2) a `trustPolicyExclude` for provenance-gap false positives (undici-types · `@aws-sdk/*` ·
  `@smithy/*` · flow-_ · …); (3) **`onlyBuiltDependencies`** (esbuild · workerd · @swc/core · electron ·
  @parcel/watcher) — pnpm 10 blocks all build scripts by default, so these native runtimes were
  silently unbuilt; (4) **`.nvmrc` (`22`) + `engines`** on the root; (5) re-synced the lockfile.
  `--frozen-lockfile` now passes. Documented in `apps/web/setup/environment.md`. **Root cause of the
  recurring staleness: package.json edits without a follow-up `pnpm install` — sync the lockfile in the
  same change.** _(Note: `react-native 0.76.5` warns on React 19 — a real mobile-app version gap, not
  an install blocker.)_
- **All scaffold apps now typecheck; the Electron app lives in `hybrid`.** An audit found the scaffold
  apps mis-configured: **admin · marketing** (Next) lacked `@types/react`/`@types/react-dom`/`@types/node`;
  **api · cron** (Workers) lacked `@types/node` (+ `node` in tsconfig `types`, + `DOM` lib for the
  isomorphic `@indiecrafts/logger`'s `typeof window` guard). All eight apps now pass `tsc`. **Electron
  consolidation:** a duplicate `desktop` slot had appeared beside the reserved `hybrid` slot — the
  Electron app is now `@indiecrafts/hybrid` (the `desktop` slot removed). It **builds**: added
  `electron.vite.config.ts` + a minimal plain-DOM `src/renderer/`, bumped to **electron-vite 5** (the
  pinned v2 imported vite's removed `splitVendorChunk`, breaking against the workspace's vite 7) +
  `@types/node`, and set `package.json:main` → `out/main/index.js`. `pnpm --filter @indiecrafts/hybrid
build` compiles main/preload/renderer. **Mobile** needed no change — it correctly runs its own React
  18.3.1 island beside the web's React 19 (the earlier peer warning was a stale-lockfile artifact).
- **`apps/web/setup/scripts.md` — the `deploy:all` row was stale.** It said the dispatcher discovers
  apps by `package.json` and that "today that is just `web`" — but the script discovers by
  **`wrangler.toml`**, orders `api · cron · web` (then the rest), skips apps missing a
  `deploy:<app>:<env>`, and several apps are now deployable. Row corrected (+ `--dry-run` / `--yes`).
- **`apps/web/setup/on-the-fly-checks.md` — the hook reinstall now names a concrete source + command.**
  It previously said "copy the scripts… canonical copies live with the studio toolchain" with no path;
  now points to `method/shared/tooling/hooks/` and the `install.sh` one-liner.
- **`apps/web/setup/environment.md` — the `.env` bootstrap step was wrong.** It said
  `cp .env.example .env.local` from the repo root, but there is no root `.env.example` — the file is
  `code/projects/web/.env.example`. Corrected the copy command (the single most-hit setup step). Also
  added a **supply-chain-gate note** (`pnpm install` can trip `minimumReleaseAge` / `no-downgrade`
  trust) and corrected the "all env vars are optional" overclaim — the three Sanity vars are
  hard-required for any Sanity feature and `doctor:env` enforces them.

### Changed

- **`shared/README.md` — stop dangling studio tooling.** The shipped shared-docs index name-dropped
  CodeGraph / Headroom / plugins with no link (those pages live in the gitignored framework, not the
  shipped site). Reworded to state the agent tooling is per-developer, not part of the deliverable,
  and pointed to `environment › AI coding tooling`.
- **`apps/web/setup/on-the-fly-checks.md` — "The hooks are local by design (nothing ships)".** New
  section states precisely that the hook **scripts** (`.claude/hooks/*`) **and** their wiring
  (`settings.local.json`) are gitignored — only `agents/`/`skills/`/`settings.json` ship — why
  (studio gates never run on a client's machine), and how a fresh clone reinstates them (copy scripts
  - wire `settings.local.json`, approve on first run).
- **`apps/web/setup/on-the-fly-checks.md` — the Stop gate now covers docs AND tests.** The stop-tier
  row renames `docs-drift` → `change-hygiene` and notes it blocks when `code/**` changes without a
  matching doc **or** test; a new "Not on the fly" bullet clarifies the gate _reminds_ (it does not
  run the suite — `pnpm test` + CI do), with the config/types/generated/presentational escape.
- **`apps/web/setup/testing.md` — E2E journeys documented.** The e2e layer now covers real app
  journeys, not just Storybook visual regression: the two `E2E_TARGET`s (`app` vs `visual`), the
  seeded throwaway `e2e` dataset, the SSR-can't-be-`page.route`-mocked constraint, the Playwright
  best-practice principles (role locators · web-first assertions · mock-the-boundary), the journey
  list, and the `pnpm e2e` env. Table rows + run commands updated (`e2e` = journeys, `e2e:visual` =
  visual).

- **`apps/web/setup/scripts.md` — "Where a script lives (root vs app)".** New subsection documents the
  two-tier script convention: app-tier scripts (one app's dataset/infra/env) vs root-tier (repo-wide
  governance + the multi-app dispatcher), the `pnpm --filter` re-exposure, and the naming rule (`:web:`
  only where a second app would collide; short aliases stay short). Notes `docs:*` is root-only now.

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

- **Visual-verification section in `apps/web/design/adaptive-responsive.md`.** The adaptive/responsive
  guide gains a **"Visual verification — look at the pixels before 'done'"** section: the
  screenshot-at-375/768/1280 loop, review the _images_ not the DOM, verify the mechanism (reflow vs
  context-swap), stub dynamic data, record intentional asymmetry, and treat a screenshot as the first
  reviewer, not QA. Cross-links the engineering `visual-verification` rule + the `self-review`
  checklist. Documents why green tests do not prove a human can see the screen (jsdom has no layout;
  snapshots diff markup, not pixels).
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
  where tests live (colocated, matching `*.stories.tsx`; e2e in `code/projects/web/e2e/`; visual via
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
  - `docs/packages/storybook.md` reflect the renderer `web/<domain>/` reorg.

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
