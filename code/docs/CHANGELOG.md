---
title: "Changelog — docs site"
description: "Changes to the documentation site itself (code/docs/): pages added, removed, or moved; structure and sidebar; the docs build."
status: stable
---

# Changelog — docs site

Changes to the **documentation site itself** (`code/docs/`): pages added, removed, or moved;
structure and sidebar; the docs build. **Not** product features — those are the app's
history ([app changelog](/projects/web/website/changelog)); the repo-wide
roll-up is the root `CHANGELOG.md`.

Format follows [Keep a Changelog](https://keepachangelog.com).

## [Unreleased]

### Changed

- **Restructured the whole site to mirror the code spine + made it enforce itself.** Docs folders
  now match `code/`: `apps/web/**` → `projects/web/website/**`, packages nested by scope
  (`packages/{shared,web,mobile}/<name>.md`, dropping the `-shared` suffix), modules under
  `modules/web/<name>/`, the shared service tier grouped under `shared/{api,cron,workers,db,infra,scripts}`,
  and `storybook` moved to `projects/web/tools/`. Added a **Quick start** page (nav #1, install-first,
  fast-command inner loop) and a **Contributing** group (`how-we-document` governance page + `adr/`
  template). Filled every coverage gap — admin · app · mobile surfaces, `packages/{shared,web}/auth`,
  `packages/shared/security-events`, `shared/{api,cron}`, and a `shared/scripts` toolchain-registries
  page. **`ignoreDeadLinks` is now an allow-list (not `true`)** so genuine broken links fail the build;
  every page gained `title`/`description`/`status` frontmatter; `pnpm check:doc-coverage` asserts every
  code unit has a page (wired into `verify`); `sync:changelog` moved to `scripts/sync-changelog.mjs`
  (strips the generated pages' source-relative links, guards <code v-pre>{{…}}</code> interpolation, self-tested via `test:scripts`).

- **Dropped stray "Vercel" references** — synced `projects/web/website/seo/security-headers.md` to the CSP change
  (no more `*.vercel.app` in the dev/test `connect-src`), made the VitePress build comment host-agnostic
  (`.vitepress/config.mts`: "deploy to any static host"), and reworded the robots "Vercel preview" example
  to "a preview deploy" (`projects/web/website/seo/robots-and-environments.md`). This repo deploys to Cloudflare, never
  Vercel.

- **Local dev docs now describe the all-remote model — no miniflare tier.** Rewrote
  `local-development.md` and updated the DB-tier tables in `platform-deploy.md`, `deployment.md`, and
  `backups.md`: `pnpm dev` binds the real remote `dev` D1/KV/R2 (`wrangler dev --env dev --remote`),
  local setup is `pnpm db:migrate:all:dev` (not `:local`), and every env — dev included — takes a
  pre-migration R2 snapshot. Notes the trade-off: local dev needs wrangler auth + network, and the
  `dev` D1 is shared across developers.
- **`cloudflare-iac.md`: all-surface Terraform coverage + the zone-collision constraint.** Replaced the
  "Add app #2" section with a table of the seven stacks (account · api · agent · website · app · admin ·
  storybook) now shipped, and rewrote the zone warning to be accurate: the rate-limit + firewall rulesets
  are single-per-zone and always created, so shared-apex-zone surfaces collide until a `manage_zone_resources`
  gate exists (a documented TODO) — one zone per surface is the supported model.
- **Runbook + scripts: the website hosts its Sanity Studio separately (`first-deployment.md`,
  `scripts.md`).** Documented that `build:cf` drops the embedded `/studio` (it would blow the 10 MiB
  Worker limit), the `studio:deploy` (`sanity deploy`) script, `NEXT_PUBLIC_SANITY_STUDIO_URL`, and the
  real dev-run result (all 8 deployables live; website at ~9.8/10 MiB even without the Studio).
- **Runbook: the next-cf blocker is RESOLVED via a version pin (`first-deployment.md`).** The
  "⚠ Blocker" callout became "✓ Resolved" — Next `16.3.4` + `@opennextjs/cloudflare` `1.20.6` (exact)
  ship website/admin/app, since OpenNext 1.20.6 adds experimental Node-middleware support. Noted the
  repo-wide `next` pin (a duplicate Next fails the build) and the expected "experimental … use at your
  own risk" build warning; the issue-tag footer went from `@bug` to `@debt MIGRATION` (an owned ceiling).

### Added

- **Per-file reference docs for the whole codebase (~830 pages) + JSDoc headers.** Every source file
  now has its own page under `reference/` (mirroring the code tree) and — where editable — a JSDoc/TSDoc
  file header with a `@see` back to its page; generated files and the CLI-managed shadcn `ui/` primitives
  get a page but no header. A new **auto-generated "Source reference"** sidebar group walks `reference/`
  and nests it (collapsed) below the curated guides, so the 800+ pages need no hand-maintained sidebar.
  `pnpm check:doc-coverage` now enforces per-file coverage (fails if any source file lacks a page), wired
  into `verify`. Authored by a sub-agent workflow in four waves (packages · modules+services · surfaces ·
  config cleanup); the docs build stays green with dead-link enforcement on.

- **`scripts.md`: `resources:<env>` + `resources:teardown:<env>` rows, and the post-deploy secrets
  sync.** Documented the resource manifest (list every Cloudflare resource an instance owns) and the
  dry-run-by-default teardown (delete them before shipping the template clean), next to the pre-handoff
  placeholder scan. The website deploy row now notes it syncs secrets after `wrangler deploy`
  (`--skip-secrets` opts out).
- **Runbook: worker `secrets:sync` in the secrets step (`first-deployment.md`).** Phase 1 step 2 now
  points at `pnpm secrets:sync:shared:api:dev` / `…:agent:dev` (fill `.dev.vars` → bulk push) instead of
  N × `wrangler secret put`.
- **Runbook: the next-cf blocker is upstream + the paths (`first-deployment.md`).** Tied the
  Next-16-proxy / OpenNext incompatibility to the tracking issue `cloudflare/workers-sdk#13755`
  (known, unresolved) and listed the three real paths (wait / pin Next 15 / rework the proxy).
- **Runbook: real dev-run findings + the next-cf blocker (`first-deployment.md`).** Added a "Real-run
  findings" callout to Phase 1 — D1 `--location weur` (immutable), the first-migration `--no-backup`
  chicken-and-egg, the per-app ISR R2 buckets, OpenNext build memory — and a **⚠ Blocker** note: Next 16's
  Node-only `proxy.ts` vs OpenNext's edge-only middleware means website/admin/app can't deploy to
  Cloudflare yet (workers + storybook do). Tagged `@bug`.
- **Runbook: native distribution is now wired (`first-deployment.md`).** Rewrote the Mobile/Hybrid
  sections from "follow-ups" to the shipped config — EAS profiles, Electron signing/notarize/R2-publish,
  electron-updater, and the `deploy-native.yml` CI matrix — with the exact secrets to supply. Added the
  `downloads.<root>` subdomain + the D1/KV/R2 backing-resource names to the URL/resource lists.
- **Runbook: Storybook is a scripted Worker deploy on a subdomain (`first-deployment.md`).** Updated the
  Storybook section + URL table — `pnpm deploy:web:storybook:<env>` builds then `wrangler deploy`s a
  static-assets **Worker** (registry peer), prod at `storybook.<root>` (a Worker route in `domains.mjs`).
- **First-deployment runbook + sidebar (`shared/architecture/first-deployment.md`).** The step-by-step
  plan to take one instance live across `dev`/`staging`/`prod`: the per-env URL table (derived from
  `resourceName` — `<prefix>-<env>-<tail>`), the template-vs-instance model, Phase 0 → dev → staging →
  prod (infra → secrets → migrate → deploy → verify), the manual Storybook Pages deploy, and a complete
  native track — Expo/EAS plus the full **Electron desktop distribution** plan (per-OS CI matrix,
  code-signing, macOS notarization, a `publish`/hosting provider, and electron-updater auto-update),
  with the `electron-builder.yml` config gaps called out. Companion to `platform-deploy.md` (the model).
- **Share is a shared Sanity setting (`editing-seo-in-sanity.md` + blog `editor-guide.md`).** Documents
  the new **Paramètres du site → Partage** group (master toggle + per-network checkboxes) that drives the
  share row in the site footer and under blog posts; removes the stale blog `Boutons de partage` display
  toggle row (share is now shared, not blog-owned).
- **ui-icons — brand marks are generated (`ui-icons.md`).** Notes that `brands.ts` is built from
  `brands.json` + `simple-icons` via `pnpm brands:build` (`brands:check` in CI), not hand-edited.
- **Blog editor guide — category navigation & sub-categories (§6.2).** Documents the new
  `Barre de navigation par catégorie` display toggle and the category `Catégorie parente` field
  that turns a category into a sub-category (nav dropdown), plus the post-page author-bio card and
  "More on {topic}" sidebar block (`modules/web/blog/editor-guide.md`).
- **Local development page + sidebar.** New `shared/architecture/local-development.md` — the one-page
  local flow: `pnpm db:migrate:all:local` → `pnpm dev` (D1 + KV in miniflare, no real IDs), the four
  data stores' local behaviour (Sanity stays remote), the `API_URL=http://localhost:8787` website↔api
  wiring, and the caveats (api/cron keep separate local D1s; real IDs only for deploy). A cross-cutting
  platform concern (spans api/cron + the website), so linked under "Shared · Architecture", beside
  workspace + platform-deploy.

- **Admin settings + backups page + sidebar.** New `projects/web/website/config/settings.md` — the
  admin **Settings** card (retention/ops/TTL knobs, bounded, audited via `admin_audit`), the
  **match-by-reader** table (worker-read → D1 `site_settings`; website/edge + editor-facing
  → Sanity Studio; infra/security → version-controlled Terraform/config), the settings
  registry + guardrail model (reject-not-clamp, default-safe), and the read-only **Backups**
  card + `backup_runs` history. Linked under "Web app · Configuration & architecture", after
  "Data retention + audit (GDPR)". `projects/web/website/config/data-retention.md` gains a "Retention
  windows are now admin-overridable" section (the defaults/floors are unchanged; links to
  the new page) and a privacy-policy-drift caution on the three disclosed retention keys.
  **Why:** retention windows, the SLA warning lead time, and link TTLs moved from hard-coded
  constants to an admin-editable, audited runtime setting — the docs needed to say where
  each kind of setting lives and what changing a disclosed retention window requires.
- **`security-guidance` + `claude-mem` plugins in `setup/environment.md`** — two new "AI coding
  tooling" subsections: the official `security-guidance` plugin (secure-coding review of
  Claude-generated diffs — install from `claude-plugins-official`) and the community `claude-mem`
  persistent-memory plugin (`marketplace add thedotmack/claude-mem`). Both per-developer, global
  (`~/.claude`), never committed — matching the existing Cloudflare/LSP/Expo plugin entries.
- **CSP Report-Only rollback runbook** — `seo/security-headers.md` § "Rollback: flip a surface back to
  Report-Only" now gives the concrete steps: `CSP_MODE=report-only` via the Cloudflare dashboard var
  (fast, no redeploy — `keep_vars = true`) or the version-controlled `wrangler.toml` `[env.<env>.vars]`
  - `pnpm deploy:<surface>:<env>`, per surface, with the verify + `/csp`-dashboard step. `operations.md`
    § Troubleshooting gains a "scripts blocked after a deploy (CSP)" row pointing to it. **Why:** enforce is
    the live default, so on-call needs a copy-pasteable way to fall back to observe-only when the nonce CSP
    blocks something (the switch already exists — this makes it fast to use, instead of a KV kill-switch).
- **`check:tasks` documented in `scripts.md`** (both the Quality-gates and repo-root-scripts tables) —
- **DPIA template + per-regime notices + scope-boundary pages + sidebar.** New
  `projects/web/website/config/dpia-template.md` — DPIA trigger criteria (large-scale processing,
  special-category data, systematic monitoring, new high-risk tech) and a fill-in
  template (description, necessity, risks, mitigations, residual risk, sign-off). New
  `projects/web/website/config/privacy-by-regime.md` — per-regime notice guidance for what the
  operator adds to the Sanity-authored policy (GDPR/UK GDPR, CCPA/CPRA, LGPD, PIPEDA,
  POPIA, Australia Privacy Act; PIPL/China explicitly out of scope), the minors/age-gate
  scope decision (the `features.compliance` extension point, no flag shipped), and the
  special-category-data boundary (name/email/locale/country only). Also fixed a stale
  cross-reference in `breach-response.md` ("planned, not yet written" → live links to
  ROPA and sub-processors). Both new pages linked under "Web app · Configuration &
  architecture", after "Sub-processors & transfers".
- **ROPA + sub-processors pages + sidebar.** New `projects/web/website/config/ropa.md` — the Art. 30
  record of processing activities, one table over every activity (auth, admin audit, security
  events, consent, DSAR, erasure/export, newsletter, comments, waitlist, contact, Sanity
  authorship, orders). New `projects/web/website/config/sub-processors.md` — the sub-processor table
  (Cloudflare, Clerk, Resend, Sanity) and the cross-border-transfer section. Both linked under
  "Web app · Configuration & architecture", after "Breach response (GDPR)".
- **`tasks:check` documented in `scripts.md`** (both the Quality-gates and repo-root-scripts tables) —
  the new guard that keeps `.vscode/tasks.json` in sync with the root `package.json` scripts (per-app
  tasks use an `<app>: ` label). It runs in `verify` + CI and is nudged by the change-hygiene hook.
- **Three agent hooks — CLAUDE.md hygiene · security scan · grill-plan** (`on-the-fly-checks.md` tiers
  table + new sections). **`claude-hygiene.mjs`** (`Stop`, committed) proposes a brief review when a code
  unit's public surface grew (a new source file) but its `.claude/CLAUDE.md` didn't, or a unit has no
  brief — never edits, just proposes concise. **`security-scan.sh`** (`Stop`, committed) is the local
  Snyk/SonarQube-lite: report-first tiers — a sensitive-file agent nudge (no install), **semgrep** over the
  repo ruleset `.semgrep.yml`, **gitleaks** secrets, and **`pnpm audit`** on lockfile change (each guarded,
  the real SAST gate stays in CI). **`grill-plan.sh`** (`PreToolUse ExitPlanMode`, personal) fires an
  imperative nudge to hard-grill a plan with the `grill-me` skill before it's presented; `/grill-plan` +
  `/brief` are the companion commands, and `.claude/README.md` documents the whole extension contract.
  **Why:** keep briefs current, shift security feedback left, and pressure-test plans — all advisory, so
  the blocking gates stay `guard` + `change-hygiene`.
- **Two authentication pages + sidebar.** `shared/architecture/auth.md` (the cross-app Clerk model —
  bricks, role, per-platform SDK, suspicious-login stance) and `projects/web/website/config/auth.md` (the Next
  provider + middleware wiring), each linked in `.vitepress/config.mts` under "Shared · Architecture" and
  "Web app · Configuration & architecture". `projects/web/website/config/auth.md` later gained **Sign-in UI +
  redirects** (the shared `<SignInView>`, the redirect precedence + open-redirect guard) and **Session
  sharing** (subdomains, free; satellite as the paid alternative).

- **Security hardening (Cloudflare) page + sidebar.** New `projects/web/website/config/security-hardening.md` — the
  Cloudflare-native security posture (WAF · Bot Fight Mode · Block AI Bots · Free Managed Ruleset ·
  leaked-credentials · rate-limit · Turnstile, free-vs-paid), the Terraform mapping, and the app-level
  `security_events` EU D1 for what the edge can't see. Linked under "Web app · Configuration & architecture".
- **Data retention + audit (GDPR) page + sidebar.** New `projects/web/website/config/data-retention.md` — the
  record-of-processing (EU D1 audit + session log, 90-day retention, hashed IP, legitimate interest), the
  operator's **privacy-policy disclosure checklist**, and the erasure procedure. Linked under "Web app ·
  Configuration & architecture".

### Changed

- **Root script names are now platform-inclusive, Cloudflare-style (breaking).** Every
  entity-targeting root `package.json` script names its platform like a CF worker
  (`<verb>:<platform>:<name>:<env>`): `deploy:web:website:<env>` · `deploy:shared:api:<env>` ·
  `deploy:mobile:main:<env>` · `infra:web:website:*` · `secrets:sync:web:website:*` ·
  `preview:web:website:cf`. DB-registry ops unified under `db:` (`db:backup:content`, `db:backup:all`,
  `db:restore:content`, `db:migrate:audit:<env>`); website utils gained their app
  (`setup:web:website:kv`, `doctor:web:website:env`, `export:web:website:subscribers`); the checks
  unified under `check:*` (`check:api-guards`/`check:tasks`/`check:placeholders`/`check:tags`).
  `.vscode/tasks.json`, CI (`deploy.yml` now builds `deploy:<platform>:<slug>`), the `verify` composite,
  and ~40 docs updated in lockstep; `check:tasks` parity holds. App-level scripts stay as the delegation
  targets. **Why:** script names now read off the workspace structure + registry entity names, matching
  the CF resource naming.
- **Pruned the vendored agent pack; docs updated in lockstep.** `.claude/agents/` dropped the
  unused `contains-studio` suite (79 → 12 agents), keeping the 10 `project/` reviewers — now incl.
  new `architecture-reviewer`, `compliance-reviewer`, `performance-reviewer` — plus `build/`
  (`electron-pro`, `mobile-app-builder`). The `sync-agents.sh` script + `agents:sync` package script
  were removed (they re-vendored the pack), so `scripts.md` drops that row and `on-the-fly-checks.md`
  repoints the review-agent mentions (`security-auditor`/`code-reviewer` → `/cso` + `compliance-reviewer`;
  `accessibility-tester` → the new reviewer set). _Why:_ the pack was unreferenced and redundant with
  the plugin agents + gstack review skills; a lean, repo-aware roster beats vendored bloat.

- **Dropped every `method/` + `work/` reference** (those folders were removed from the repo). The
  `page-builder.md` "Adding a block" section is now a self-contained checklist (was a pointer to the
  deleted method workflow); the workspace / getting-started / project-organization pages no longer
  mention the private folders; `on-the-fly-checks.md` reflects that the hooks live only as the local
  gitignored `.claude/hooks/*` (the method installer is gone). Blog docs repoint the add-block how-to to
  `packages/web/page-builder`.

### Added

- **Three convention hooks + Figma MCP.** New `PostToolUse` hooks that enforce documented rules eslint
  can't: **`config-first.mjs`** (cards raw color literals + hardcoded URLs on components — the config-first
  NEVERs), **`i18n-parity.mjs`** (message-key parity vs `en` on every surface, not just the website's
  test), and **`tokens-fresh.mjs`** now **wired** (auto-`pnpm tokens:build` when `tokens.json` changes;
  also fixed its stale package filter). MCP: added the remote **Figma** Dev-Mode MCP (`mcp.figma.com/mcp`)
  for the figma-handoff workflow and **removed `vercel`** (this repo deploys to Cloudflare, not Vercel).
  **Why:** make the config-first / i18n / token-freshness disciplines live + deterministic instead of
  agent-remembered, and align the MCP set with the actual stack. Docs: `on-the-fly-checks.md` +
  `environment.md`.
- **Expo / React Native tooling** for the `mobile` surface (`environment.md` + the mobile brief). The
  official **Expo plugin** (`claude plugin install expo@claude-plugins-official`) brings the Expo Skills
  (`expo-router` · `expo-native-ui` · `expo-design-system` · `expo-tailwind-setup` · `expo-upgrade` ·
  `eas-*`) + the Expo MCP for version-correct SDK-52 docs. RN hooks: the on-the-fly lint hook now **skips
  React Native** files (`ui-native` + the `.../src/native/` forks) — the Next + jsx-a11y config is wrong
  for RN, which lints with **`npx expo lint`** instead — and the Stop **review-nudge** prompts
  `expo lint` + `expo-doctor` (+ the Expo skills) when `mobile/**` changes. **Why:** give the RN surface
  real, RN-appropriate on-the-fly feedback + current-SDK knowledge, instead of misapplying the website's
  web-only rules.
- **Build-phase feedback ladder filled** (`projects/web/website/setup/on-the-fly-checks.md` + `environment.md`).
  The `a11y-check` hook now surfaces the **full eslint config** as edit-tier cards (a11y is one subset;
  also next core-web-vitals, typescript-eslint, the `next/link` import ban) — "lint on the fly." Added
  the **`typescript-lsp` plugin** as the "types on the fly" tier (per-file `tsc` is impossible in a
  whole-program monorepo, so live type diagnostics come from the LSP plugin). Added
  **`@total-typescript/ts-reset`** as the type floor across all 9 projects (`Response.json()` →
  `unknown`, `.filter(Boolean)` strips falsy — it caught two real latent `possibly-undefined` bugs).
  **Why:** shift correctness feedback left to the moment of editing, on a foundation that makes the
  trust-boundary parsing safe by default.
- **Gate docs slimmed** (root `CLAUDE.md`, website brief + `rules/{self-review,figma-handoff}`). Dropped
  the "run `pnpm verify:quick` before every PR" manual nag — the **commit hook + CI** still enforce
  `tsc` + lint (unchanged), and the live lint cards + LSP plugin give that feedback continuously.
  **Why:** stop telling humans to run by hand what the hooks + commit + CI already cover.
- **Marketing bundle-size budget** — `scripts/check-bundle-size.mjs` (`pnpm size`) budgets the landing
  route's **First-Load JS excluding the embedded Sanity Studio** (whose 4.7 MB bundle would make an
  all-chunks budget meaningless), read from the production build manifest and wired into the CI `build`
  job after `build:cf`. Ships a **coherent default budget (220 kB gz** — the recognized ~170 kB
  First-Load-JS target + framework headroom); **report-first** (prints the live number, never blocks)
  until you tighten to `measured + ~15%` and add `--enforce` to make it a hard gate. The Core Web Vitals half stays the
  gstack `/benchmark` nudge (needs a live URL). **Why:** catch JS-weight regressions on the marketing
  site without a browser, with a metric that isn't polluted by the Studio.
- **Auto-review-trigger hooks documented** in `projects/web/website/setup/on-the-fly-checks.md` — two new advisory
  hooks that nudge the matching gstack review skill: `review-nudge.sh` (a `Stop` diff scan → `/review` ·
  `/codex` · `/cso` · `/qa`, wired in committed `settings.json`, gstack-aware so it degrades to a generic
  nudge without gstack) and `plan-review-nudge.sh` (a `PreToolUse ExitPlanMode` nudge → `/autoplan` ·
  `/plan-eng-review`, wired in gitignored `settings.local.json`). **Why:** surface the right review at
  the right moment (large/sensitive diff, plan finalize) without another blocking gate — a hook can only
  advise, the skill still runs in the main thread. Added the **plan** tier + the review-nudge to the stop
  tier in the tiers table.
- **Design critique (ordered) reference page.** New `projects/web/website/design/design-critique.md` under "Web app ·
  Design & content" — the four-lens ordered critique (accessibility → visual hierarchy → content →
  interaction-states), why the order matters, ready prompts, and ordered-vs-parallel guidance. Also added
  the **API security limits** config page (`projects/web/website/config/security-limits.md`) and refreshed
  `packages/shared/ui-tokens.md` (DTCG source + colocated sidecars) and `packages/shared/security.md` (request-side
  guard + `check:api-guards`).

### Fixed

- **Sidebar + cross-link drift.** Three sidebar links pointed at pages that had moved
  (`workspace`/`multi-app` → `shared/architecture/`, `cloudflare-iac` → `infra/`) and eight in-page
  links referenced renamed pages (`packages/consent` → `packages/web/compliance`, `packages/security-headers`
  → `packages/shared/security`). Repointed all; a repo-wide check now reports **0 broken sidebar links, 0 broken
  in-page links, 0 orphan pages**. The docs already mirror the code at the right altitude
  (`apps/ · packages/ · modules/ · shared/ · infra/`) — a full URL re-folder to the code's new
  platform→kind nesting was assessed as high-churn / low-reader-value and deliberately not done.

### Changed

- **The docs site moved to `code/projects/docs` (was a root sibling).** Deployables now all live
  under `code/projects/` — the docs (this site) + `storybook` joined the runtime apps there. Docs
  stays **npm-isolated** (excluded from the pnpm workspace via `!code/projects/docs`, its own
  lockfile); `pnpm docs` / `docs:build` / `docs:install` are unchanged (they repoint via the root
  scripts). `sync:changelog` cp paths were rebased. The architecture pages (`shared/architecture/workspace`,
  `getting-started`, `projects/web/website/setup/scripts`) + the folder-map narrative were reframed from the
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

- **`shared/workers/` — Background Workers page + a scalable per-worker script/test structure.** New
  `docs/shared/workers/index.md` (+ sidebar group) explains how a Worker runs (handlers · `env` bindings ·
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

- **`projects/web/website/setup/environment.md` — Cloudflare agent-setup steps.** The "AI coding tooling" section now
  documents the official one-time setup (`claude plugin marketplace add cloudflare/skills` +
  `claude plugin install cloudflare@cloudflare` → `/reload-plugins`), the skills + 5 MCP servers it
  installs (`cloudflare-docs` public; `-api`/`-bindings`/`-builds`/`-observability` OAuth-on-first-use), and
  that wrangler `^4` is already an in-repo devDep (`pnpm exec wrangler`, no global). **Why:** the repo
  deploys to Cloudflare, so a new dev/agent should wire the Cloudflare tooling in one step.

- **Issue tags are now tracked in docs, not just code (wahio-style).** `scripts/tags-report.mjs` now
  scans `.md` (added `.md` to its extension set), and a doc may carry an `## Issue tags` footer listing
  the tags for a real, owned gap it describes — so `pnpm tags:report` / `check:tags` count doc references
  too. The vocabulary/meta docs (`.claude/rules/issue-tags.md`, `projects/web/website/setup/scripts.md`) are excluded
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
  `--frozen-lockfile` now passes. Documented in `projects/web/website/setup/environment.md`. **Root cause of the
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
- **`projects/web/website/setup/scripts.md` — the `deploy:all` row was stale.** It said the dispatcher discovers
  apps by `package.json` and that "today that is just `web`" — but the script discovers by
  **`wrangler.toml`**, orders `api · cron · web` (then the rest), skips apps missing a
  `deploy:<app>:<env>`, and several apps are now deployable. Row corrected (+ `--dry-run` / `--yes`).
- **`projects/web/website/setup/on-the-fly-checks.md` — the hook reinstall now names a concrete source + command.**
  It previously said "copy the scripts… canonical copies live with the studio toolchain" with no path;
  now points to `method/shared/tooling/hooks/` and the `install.sh` one-liner.
- **`projects/web/website/setup/environment.md` — the `.env` bootstrap step was wrong.** It said
  `cp .env.example .env.local` from the repo root, but there is no root `.env.example` — the file is
  `code/projects/web/.env.example`. Corrected the copy command (the single most-hit setup step). Also
  added a **supply-chain-gate note** (`pnpm install` can trip `minimumReleaseAge` / `no-downgrade`
  trust) and corrected the "all env vars are optional" overclaim — the three Sanity vars are
  hard-required for any Sanity feature and `doctor:web:website:env` enforces them.

### Changed

- **`shared/README.md` — stop dangling studio tooling.** The shipped shared-docs index name-dropped
  CodeGraph / Headroom / plugins with no link (those pages live in the gitignored framework, not the
  shipped site). Reworded to state the agent tooling is per-developer, not part of the deliverable,
  and pointed to `environment › AI coding tooling`.
- **`projects/web/website/setup/on-the-fly-checks.md` — "The hooks are local by design (nothing ships)".** New
  section states precisely that the hook **scripts** (`.claude/hooks/*`) **and** their wiring
  (`settings.local.json`) are gitignored — only `agents/`/`skills/`/`settings.json` ship — why
  (studio gates never run on a client's machine), and how a fresh clone reinstates them (copy scripts
  - wire `settings.local.json`, approve on first run).
- **`projects/web/website/setup/on-the-fly-checks.md` — the Stop gate now covers docs AND tests.** The stop-tier
  row renames `docs-drift` → `change-hygiene` and notes it blocks when `code/**` changes without a
  matching doc **or** test; a new "Not on the fly" bullet clarifies the gate _reminds_ (it does not
  run the suite — `pnpm test` + CI do), with the config/types/generated/presentational escape.
- **`projects/web/website/setup/testing.md` — E2E journeys documented.** The e2e layer now covers real app
  journeys, not just Storybook visual regression: the two `E2E_TARGET`s (`app` vs `visual`), the
  seeded throwaway `e2e` dataset, the SSR-can't-be-`page.route`-mocked constraint, the Playwright
  best-practice principles (role locators · web-first assertions · mock-the-boundary), the journey
  list, and the `pnpm e2e` env. Table rows + run commands updated (`e2e` = journeys, `e2e:visual` =
  visual).

- **`projects/web/website/setup/scripts.md` — "Where a script lives (root vs app)".** New subsection documents the
  two-tier script convention: app-tier scripts (one app's dataset/infra/env) vs root-tier (repo-wide
  governance + the multi-app dispatcher), the `pnpm --filter` re-exposure, and the naming rule (`:web:`
  only where a second app would collide; short aliases stay short). Notes `docs:*` is root-only now.

- **i18n "Adding a locale" expanded.** `projects/web/website/config/i18n-and-routing.md` gains the
  **don't-pre-fill-locales** rule (an empty `messages/<code>.json` ships English under a foreign URL),
  a **content-home table** (editorial/UI copy + SEO → Sanity + `messages/`; technical number/money/date/
  grammar rules → `config` + `@indiecrafts/format`, **not** Sanity), and an **RTL** note (`dir` drives
  `<html dir>`; audit logical spacing utilities). Reinforces "as much content as possible editable in
  Sanity."
- **`shared/db/README.md` → Cloudflare D1.** The data-layer page now specifies **Cloudflare D1**
  (relational app data, Worker-bound — not a connection string) + **KV** (cache/sessions), with
  the split that content stays in **Sanity** and D1 is opt-in for data that isn't content. Adds
  forward-only `wrangler d1 migrations`, Time Travel + `wrangler d1 export` backups, and the
  data-brick access pattern. Was a generic-SQL stub.

### Added

- **Visual-verification section in `projects/web/website/design/adaptive-responsive.md`.** The adaptive/responsive
  guide gains a **"Visual verification — look at the pixels before 'done'"** section: the
  screenshot-at-375/768/1280 loop, review the _images_ not the DOM, verify the mechanism (reflow vs
  context-swap), stub dynamic data, record intentional asymmetry, and treat a screenshot as the first
  reviewer, not QA. Cross-links the engineering `visual-verification` rule + the `self-review`
  checklist. Documents why green tests do not prove a human can see the screen (jsdom has no layout;
  snapshots diff markup, not pixels).
- **On-the-fly quality checks doc + a11y hook.** New `projects/web/website/setup/on-the-fly-checks.md` (+ sidebar)
  maps the tiered feedback model — **edit-tier cards** (design + **new `jsx-a11y` accessibility** cards),
  **stop-tier** deep passes, the **commit** hard gate, on-demand **scans**. It documents the repo's new
  `.claude/hooks/a11y-check.mjs` hook, which cards structural accessibility findings as UI is written
  (the design hook's twin), running the app's exact `jsx-a11y` rules via eslint `--stdin` so files in
  packages/modules are covered too (bypasses `eslint-config-next`'s base-path skip). Non-blocking —
  commit stays the gate. Cross-linked from the `accessibility` rule.
- **CI docs.** `projects/web/website/setup/scripts.md` gains a **CI workflows** table + an accurate "CI mirrors
  verify + build" tip (it previously claimed CI ran verify + build when `test.yml` ran neither);
  `projects/web/website/setup/deployment.md` documents the per-PR **preview deploys** (`preview.yml`).
- **`projects/web/website/setup/backups.md`** (+ sidebar) — the Sanity + D1 backup runbook: the gitignored
  `backups/` folder layout, manual local vs `--remote` (R2), the per-env backup buckets, the nightly
  GitHub Action, R2 lifecycle rotation, and restore (Sanity `db:restore:content` · D1 Time Travel).
  `scripts.md` swaps `content:export` for `backup:web:sanity` + `backup:web:d1:<env>`; the db docs
  point their backup bullets at the scripts.
- **Moved `newsletter` + `cookie-consent` docs to their new homes.** `projects/web/website/config/newsletter.md`
  → `modules/web/newsletter/index.md` (the `@indiecrafts/newsletter` module) and
  `projects/web/website/config/cookie-consent.md` → `packages/consent.md` (the `@indiecrafts/consent` brick);
  sidebar updated (Modules · Newsletter, Packages · consent; dropped the two config entries).
- **`projects/web/website/setup/testing.md`** (+ sidebar, after Scripts) — the testing system: the layer
  table (unit · component · integration · i18n parity · e2e · visual · a11y · contrast · perf),
  where tests live (colocated, matching `*.stories.tsx`; e2e in `code/projects/web/e2e/`; visual via
  Storybook), how to run (`pnpm test` folded into `verify`, `pnpm e2e`), the platform-specific
  visual-baseline caveat, and a what-to-test-vs-skip heuristic for a Sanity marketing/blog site.
- **`projects/web/website/config/newsletter.md`** (+ sidebar) — the newsletter capture feature: `features.
newsletter`, the `destination` modes (sanity / provider / both), the submit flow + response
  codes, the Abonnés desk, provider setup, and GDPR. A `feature-flags.md` row was added; block
  counts were bumped across the blog + ui-components docs (14 modules, 10 inline, 11 generic
  renderers, new `form/` domain).

### Changed

- **`design/responsive-design.md` → `design/adaptive-responsive.md`.** Retitled + expanded (sidebar +
  inbound refs updated): leads with the responsive-vs-adaptive decision ("name the mechanism"), adds
  container-query / input-method / safe-area / adaptive-swap guidance with code, keeps the existing
  mobile-first + container-variable + imagery + reduced-motion sections. Also: `docs/packages/web/ui-components.md`
  - `docs/projects/web/tools/storybook.md` reflect the renderer `web/<domain>/` reorg.

### Added

- **`modules/web/blog/comments.md` — Blog comments.** New page (+ sidebar line): how the moderated
  comment feature works, Studio moderation, editing the per-locale copy, spam/privacy, the
  `blogComments` flag, and the write-token-is-runtime deploy note. Also: `packages/web/sanity`
  gained the `./write` export; `feature-flags` lists `blogComments`.

### Changed

- **Hid the internal `method/` + `work/` folders from the client-facing docs.** The Pillars
  nav (Method/Lab links) is now **dev-only** (`NODE_ENV=production` drops it); the home hero
  "How we work (method)" feature became "Workspace & deployment"; `getting-started` reframes
  around the two client folders (`code/`, `docs/`) with method/work as a brief "private" note.
  Swept the `method/`/`work/` pointer links + "four-folder mirror" boilerplate out of the
  README/overview/packages pages. Removed the stray `projects/web/website/setup/git-worktrees.md` (+ its
  sidebar line) — finishing the earlier worktree removal.

### Added

- **`projects/web/website/setup/workspace.md` — Workspace & deployment.** New page: the monorepo layout,
  run commands, and the **deploy-app+docs-only** rule, with a "Private folders" section on
  keeping `method/` + `work/` from clients (undeploy or auth-gate; hand over `code/`+`docs/`
  only). Wired into the Setup sidebar + the home features grid.
- **Code-intelligence (LSP) tooling documented.** New `shared/tooling/code-intelligence.md`
  (what LSP plugins do · install · safety · language coverage · the monorepo note) + a Tier 2
  row and install block in `projects/web/website/setup/environment.md` + a "Working with an AI agent"
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
  (39 pages): all `projects/web/website/{setup,config,design,seo}` prose guides, `modules/web/blog/**` (7),
  and `packages/`/`modules/` READMEs regenerated from current source — package/module
  architecture, `@indiecrafts/*` specifiers, blog-as-module wiring, and moved paths
  (config/ui/sanity/tokens, `DESIGN.md`) now consistent across the site.
- **Component docs colocated into the `@indiecrafts/ui` package.** The 61 per-primitive
  reference pages moved `projects/web/website/design/components/*.md` → `code/packages/ui/src/<name>.md`
  (beside each `.tsx`); they leave the VitePress site and are now indexed from a
  `### Component catalog` in [`DESIGN.md`](../packages/shared/ui-tokens/DESIGN.md).
- **Blog docs relocated** `projects/web/website/features/blog/` → `modules/web/blog/` (6 guides + index),
  matching the code move to `code/modules/web/blog/`; inbound links, sidebar, top-nav repointed.
- Docs site moved from `code/docs/` to the repo-root `docs/`, mirroring the code spine.

### Added

- `modules/web/blog/index.md` — the blog module landing (what it is as a module + guide index).
- `projects/web/website/config/navigation.md` — editing the header + footer menus in Sanity.
