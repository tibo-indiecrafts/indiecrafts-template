# Changelog — method / framework

Changes to **how we work** (`method/`): the rules, workflows, process phases, templates, and
the engineering brain. Log here when you change the *method*, not the product. Product/app
history → [`code/apps/web/CHANGELOG.md`](../code/apps/web/CHANGELOG.md); repo-wide roll-up →
[root changelog](../CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com).

## [Unreleased]

### Added

- **`shared/tooling/index.md` — one unified toolchain index (the single entry point).** Two layers:
  Layer 1 (run the app — Node/pnpm/env/gate, in the shipped `docs/`) and Layer 2 (the studio
  per-developer agent toolchain — codegraph · mcp · on-the-fly hooks · behavior plugins · LSP ·
  headroom · CLAUDE.md system), each with a verify step. Wired first in the "Shared — tooling"
  sidebar group. Bridges the two doc homes that can't live-link (docs :3002 vs method :3003).
- **`shared/tooling/hooks/` — canonical source + one-command installer for the local hooks.** The
  gitignored hook scripts had no reproducible source, so a fresh clone couldn't get them. Now
  `change-hygiene.sh` + `a11y-check.mjs` + `settings.local.example.json` live here, and `install.sh`
  copies them into `.claude/hooks/` + seeds `.claude/settings.local.json` (both stay gitignored —
  local-by-design preserved; the shipped template stays clean).

### Changed

- **Relocated the stray root planning doc.** `temp-sanity.md` (a tracked 1006-line future-Sanity plan
  that would have shipped to a client) is untracked and its content consolidated into
  `apps/web/page-builder-roadmap.md` (framework, gitignored — not shipped).
- **`shared/tooling/codegraph.md` — documents the `prompt-hook` (the auto-context mechanism).** The
  doc covered `codegraph install` + the MCP tool but not the global `UserPromptSubmit` hook
  (`codegraph prompt-hook`) that injects the `<codegraph_context>` block every prompt. Added a "How
  Claude Code uses it — two paths" section (prompt-hook + MCP/CLI) with a verify checklist (status,
  live daemon, context block appears, query a just-written symbol).
- **`client-handoff.md` — names the on-the-fly hooks explicitly.** The "what ships" table row now
  spells out that `.claude/hooks/*` **and** `settings.local.json` (scripts + wiring) are gitignored,
  local-by-design, and never reach a client — so the studio's dev-quality gates never run on a
  client's machine. Matches the new `on-the-fly-checks` "hooks are local" section.
- **`docs-drift.sh` → `change-hygiene.sh` — the Stop gate now nudges docs AND tests.** The docs-drift
  hook only reminded about `docs/`; generalized it so a `code/**` change that lands without **either**
  a matching `docs/` page **or** a test (`*.test.*` / `e2e/journeys/`) blocks turn-end with a combined
  reason naming the missing halves. Same `stop_hook_active` one-shot escape + an explicit "no doc/test
  warranted" out (config · types · generated · presentational-only). One gate, not two (two blocking
  Stop hooks would fight over the single escape valve). Wired **locally** in `settings.local.json`
  (the script file stays tracked). Mirrored in `shared/engineering/testing.md` + the app's
  `on-the-fly-checks` doc + a new `self-review` "Test" line.
- **`shared/engineering/testing.md` — E2E is now app journeys, not just visual.** The canon mirrors
  the app doc: the `app`/`visual` target split, journeys in `e2e/journeys/`, the seeded throwaway
  dataset, and the "app can't SSR without a real dataset, so `page.route` can't stand in" rule.

### Added

- **`grill-me` skill — adversarial gate in THINK (02).** A calibrated interrogation of the approach
  before you write the plan: `/office-hours` advises, `grill-me` interrogates. Pairs with `/office-hours`
  to close the Think phase — survive the grilling before graduating to PLAN. Not PLAN (`/autoplan` already
  reviews the written plan) and not BRIEF (client-given). Global skill, register-don't-vendor: install
  `npx skills@latest add JuliusBrussee/skills --skill grill-me --global`. Wired into `setup.md` (machine
  prereq), `workflow.md` (row 02), and the registry (THINK skills). Source: JuliusBrussee/skills.
- **`koboyo` MCP — diagrams · slides · icons.** A per-developer MCP (like `codegraph`/`headroom`,
  token-gated, out of `.mcp.json`) that draws diagrams and slide decks onto an editable canvas and
  searches a 70k hand-drawn SVG icon library. Setup guide in `shared/tooling/mcp-servers.md`
  (placeholder token — the secret lives in `~/.claude.json`, never the repo). Mapped per phase in the
  registry + playbook: **PLAN** (architecture/ERD/sequence diagrams) · **BUILD** + stage 8 Design
  system (UI icons + wireframes) · stage 6 GTM + stage 11 Launch (pitch / explainer / launch decks).
- **Project lane is now first-class — the launch playbook + a per-stage tool registry.** The framework
  mapped the **feature lane** (7-phase sprint) richly but left the **project lane** (idea → launch →
  grow) thin. New **`shared/process/launch-playbook.md`** turns the old flat launch checklist into all
  **13 `end-to-end.md` stages** (Idea · Discovery · Validate · Business · Pricing · GTM · Legal · Design
  system · Deploy pipeline · Build → feature lane · Launch · Grow · Reflect), each with its tasks +
  gstack cmd + skills + agents + MCP. `my-skills-and-agents.md` gains a **Project-lane registry** (all
  13 stages) symmetric with the 7 build-phase sections; `bench-map.md` § C becomes the **Growth/GTM
  lane** (agents tagged to stages — `growth-hacker` + channels at 6, `project-shipper`/`uat-coordinator`
  at 11, `experiment-tracker` at 12; `content-creator`/`app-store-optimizer`/`studio-producer` stay
  benched, gated); `end-to-end.md` cross-links the playbook + the two Reminders trackers. **GTM MCPs**
  (opt-in plugin servers — `ahrefs`·`similarweb`·`hubspot`·`klaviyo`·`notion`·`canva`·`amplitude`·
  `apollo`… per stage) documented in `tooling/mcp-servers.md`. **Tracking:** two macOS Reminders lists
  — **`PROJECTS`** (project lane) + **`FEATURES`** (feature lane) — each seeded with a template sample;
  the existing `LAUNCH LIST` stays the master template. _Why:_ one end-to-end workflow across both
  lanes — the framework now covers go-to-market, not just build.
- **Bench = only the "Skip" agents now.** An agent a method step *names* belongs in a topic folder,
  not bench. The 10 **Optional** agents (`bench-map.md` § A — `tool-evaluator` · `ui-designer` ·
  `interface-designer` · `modular-systems-architect` · `design-reviewer` · `config-expert` ·
  `code-commentator` · `build-engineer` · `dx-optimizer` · `compliance-auditor`) carry a use-case
  reference, so they're now **wired** (added to `scripts/sync-agents.sh` `WIRED=`, moved out of
  `bench/` on `--split-only`). Bench drops from ~26 → ~16 = only § D "Skip" (redundant twins +
  off-stack). `bench-map.md`, the registry, and `.claude/agents/README.md` re-worded to match.
  Growth/GTM agents stay in `marketing/` (folder name kept — re-vendors by upstream category).

### Changed

- **DB method → Cloudflare D1.** `db/database.md`, `db/README.md`, `code/db/.claude/CLAUDE.md`,
  and the engineering index now describe **Cloudflare D1** (bound `env.DB` not a connection string;
  `wrangler d1 migrations` forward-only, `--local` then `--env`; Time Travel + `wrangler d1 export`
  backups; a `code/packages/` data brick via Drizzle/prepared statements) + **KV** for cache. Sanity
  stays the content store; D1 is for non-content relational data. A commented `[[d1_databases]]` +
  `[[kv_namespaces]]` scaffold was added to `code/apps/web/wrangler.toml`. Replaces the generic-SQL
  + `../wahio` backup references.

### Added

- **Issue-tag triage vocabulary + tooling.** New `shared/engineering/issue-tags.md` (the fixed
  `@complexity`/`@refactor`/`@debt`/`@bug`/`@optimisation` families + qualifiers), linked from the
  engineering index + `tech-debt.md` + the method sidebar. **Adapted to this repo's philosophy:**
  unlike a triage-later codebase, tags here are a *fix-now marker* or a *recorded decision* (paired
  with `ponytail:`), never a backlog — a rising tag count is a smell. Ships with a `.claude/rules/
  issue-tags.md` agent rule + `scripts/tags-report.mjs` (`pnpm tags:report` / `tags:check` — the
  check guards the vocabulary against typos). Ported the vocabulary from an internal reference system;
  reframed around `tech-debt.md`'s "pay it in the same diff" gate.

### Changed

- **Adaptive-aware design canon.** New `apps/web/rules/adaptive-design.md` (responsive-default,
  adaptive-where-earned, name-the-mechanism + container queries / input-method / safe-areas + the
  anti-patterns) + reworded `apps/web/rules/accessibility.md`; the `add-page` / `adapt-library-section`
  workflows now say "state the mechanism per section." Aligns the repo rules to the impeccable `adapt`
  skill (which already led).
- **Multi-platform component organization documented** in `packages/README.md` — organize
  `@indiecrafts/ui-components` **domain** now, add the **platform** axis (a native renderer set sharing
  types + tokens) only when an RN app exists; "share the contract, fork the renderers." The block
  add/remove workflows' renderer paths updated to `renderers/web/<domain>/`.
- **Colocated Storybook story is now part of building a component.** `add-page-builder-block.md`
  (step 4) + `remove-page-builder-block.md` (step 1) + `apps/web/rules/component-architecture.md`
  now require adding/removing a `<name>.stories.tsx` beside a `@indiecrafts/ui` primitive or
  `@indiecrafts/ui-components` renderer in the same change, so `@indiecrafts/storybook` stays complete.
- **Workflow docs updated for the package/module extraction.** `add-page-builder-block.md` +
  `remove-page-builder-block.md` now split generic block renderers/registry/types to
  `@indiecrafts/ui-components` (schemas stay in the blog), and point doc-refs at
  `docs/modules/blog/`; `adapt-library-section.md` reuses `@indiecrafts/ui` primitives.
  Module blocks log to `code/modules/CHANGELOG.md`.

### Removed

- **Worktree docs dropped.** Removed the `git worktree` / sparse-checkout guidance from
  `git-and-pr.md` (§ Parallel sprints) and the stray mentions in `engineering/README.md`,
  the 04_BUILD template, and `process/command.md`. Parallel work is plain branches; no
  worktree setup shipped.

### Added

- **Work-output traceability + timing.** Feature sprints are now **date-prefixed folders**
  (`features/YYYY-MM-DD_<name>/`) so they sort chronologically; `work/DELIVERABLES.md` gained
  **Kind** (research/design/qa/…, from the `09_OUTPUTS/` subfolder) + **Source** (commit/PR)
  columns. _Why:_ close the "which change produced this artifact?" gap **without** a parallel
  numbering scheme — git already carries order + type, so deliverables stay unnumbered/unlabeled.
- **Changelogs browsable.** `work/CHANGELOG.md` wired into the work site; the **app changelog**
  is build-copied into the docs site (`docs/apps/web/changelog.md`, gitignored) so product
  history is browsable where the app is documented. 07_SHIP templates now own the root roll-up step.

### Changed

- **Changelog routing rule.** History is now tracked per area (root roll-up + app /
  docs / method / work logs) instead of one shared `code/CHANGELOG.md`. A change is
  logged in exactly one area log (its home altitude), never copied; root aggregates at
  release time. Updated the "ALWAYS log" rule in the app brief + DESIGN.md + the blog
  workflows to point at the app log. _Why:_ single-homed history stops the same fact
  drifting across five copies.
