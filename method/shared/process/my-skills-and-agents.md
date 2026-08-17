# Skills & agents registry — per step

One place: which **skills and agents** to reach for, per phase. Claude Code discovers
both flat (`.claude/skills/<name>/SKILL.md`, `.claude/agents/<name>.md`) — so the
_structure_ lives here, by step + source.

**Source tag** — where each lives:

- `[vendored]` — the general **agent suite** committed to `.claude/agents/`: agents referenced by a method step in the topic folders (`<topic>/`), the rest in `bench/<topic>/` (source: [contains-studio/agents](https://github.com/contains-studio/agents), MIT). The template is packaged — no `~/.claude` prerequisite. Re-pull + re-split with `pnpm agents:sync` (never touches `project/`).
- `[local]` — **project-specific** skills/agents that encode _this_ repo's conventions → `.claude/skills/` + `.claude/agents/project/`; hand-maintained.
- `[gstack]` — the gstack engine (global); a machine prerequisite (`setup.md`), can't vendor (runtime-dependent).
- `[plugin]` — a globally-installed plugin (its own lifecycle — not vendored).

**Policy:** the general agent suite is **vendored** for packaging; **skills stay
register-don't-vendor** unless project-specific. Today `[local]` = **4 skills + 6 agents**
(`.claude/agents/project/`: design-system · accessibility · ux · copy reviewers + `page-builder-reviewer`
+ `config-consistency-reviewer`). Adding one → [`adding-skills.md`](./adding-skills.md).

## Always on (every phase) — output discipline `[plugin]`

Cut token cost + bloat at every step:

- **caveman** — terse agent prose (~65% fewer output tokens). `/caveman full|off`.
- **ponytail** — least code that works, reuse first. `/ponytail full|off`.
- **headroom** — opt-in context compression: fits more of the repo in the window on long sessions. A `headroom wrap claude` CLI wrapper (pipx), not a slash plugin. [`../tooling/headroom.md`](../tooling/headroom.md).
- **`writing-style`** (`method/shared/writing-style.md`, cross-cutting) — active voice, ≤20-word sentences, technical items exact. Holds even with plugins off.

## Run order per phase

The gstack command **drives** each phase (runs first); skills support it; then the **agents run
in batches** — parallel groups by concern (e.g. REVIEW = design + a11y + security in one batch),
never all at once. Order below reflects that: **gstack → skills → agents (batch)**.

## THINK (02)

- **gstack:** `/office-hours` `/spec`
- **Skills:** `grill-me` (adversarial gate — `/office-hours` advises, `grill-me` interrogates; survive it before you write the plan) · `deep-research` · `storm:storm` · `firecrawl-*` · `find-docs` (context7) · `layers-orient/*` · `pm-product-discovery:*` · `pm-market-research:*` `[plugin]`
- **Agents (batch):** `general-purpose` · `Explore` `[global]`

## PLAN (03)

- **gstack:** `/autoplan` (ceo·design·eng·devex) · `plan-tune` (refine the autoplan output)
- **Skills:** `writing-plans` · `pm-execution:outcome-roadmap` · `pm-product-strategy:strategy` `[plugin]` · `design-system-check` `[local]` (apps/web)
- **Agents (batch):** `Plan` `[global]` · `system-architect` · `backend-architect` · `data-architect` · `security-architect` (app-level security baseline) · `project-planner` `[vendored]`
- **MCP:** `koboyo` `[local]` — draw the architecture/ERD/sequence diagram onto an editable canvas (`create_diagram`; `get_syntax` first). Live light/dark embed URLs drop straight into a plan or README. Setup → [`../tooling/mcp-servers.md`](../tooling/mcp-servers).
- **Stack options** (in topic folders — activate when the surface lands): `apps/api` → `api-designer` (contract) · `code/db` → `database-schema-designer` · GraphQL → `graphql-architect`. See [bench-map § B](./bench-map.md).

## BUILD (04)

- **gstack:** `/design-consultation` `/design-shotgun` `/design-html`
- **Skills:** `frontend-design` · `web-design-guidelines` · `ui-ux-pro-max` (greenfield only — see WORKFLOW guardrail) · `ui-design:*`+`design-systems:*` · `shadcn` · `vercel-react-best-practices` · `vercel-composition-patterns` · `test-driven-development` · `ponytail-audit`/`ponytail-review` (the compulsory in-change debt pass — [`tech-debt.md`](../engineering/tech-debt.md) gate) `[plugin]` · `visual-polish` `[local]`
- **Agents (batch):** `frontend-developer` · `fullstack-developer` · `refactoring-specialist` · `rapid-prototyper` `[vendored]`
- **MCP:** `koboyo` `[local]` — need UI icons? `find_icons_for(['home','billing',…])` matches a whole set in one call; `get_icon_svg` returns `currentColor` SVG. Reach for Lucide/Reicon first (the wired sets); koboyo when they miss a subject.
- **Stack options** (topic folders): `apps/api` → `backend-developer` · `code/db` → `database-schema-designer` · realtime → `websocket-engineer` · a CLI → `cli-developer` · an MCP server → `mcp-developer` · mobile → `mobile-developer`. See [bench-map § B](./bench-map.md).

## REVIEW (05)

- **gstack:** `/review` `/codex` `/cso` `/design-review`
- **Skills:** `visual-critique:*` · `web-design-guidelines` `[plugin]`
- **Agents (batch)** — run as parallel groups, not serially:
  - _design batch:_ `design-system-reviewer` · `ux-reviewer` · `copy-reviewer` (brand voice / tone) `[local]`
  - _a11y batch:_ `accessibility-reviewer` `[local]` · `accessibility-tester` `[vendored]`
  - _correctness batch:_ `config-consistency-reviewer` · `page-builder-reviewer` `[local]` · `code-reviewer` · `architect-reviewer` `[vendored]`
  - _security batch (`/cso`):_ `security-analyzer` · `security-auditor` · `penetration-tester` `[vendored]`

## TEST (06)

- **gstack:** `/qa` `/qa-only` `/benchmark` · `/health` (code-quality dashboard — catches debt regressions)
- **Skills:** `test-pass` (write→run→fix — Vitest + Playwright + Storybook) · `accessibility-pass` · `react-doctor` `[local]` · `accessible-content:*`/`inclusive-interaction:*` (inclusive-design-skills) `[plugin]` · `pnpm shadscan` (CLI — shadcn UX 0–100) · `webapp-testing` `[plugin]`
- **Agents (batch):** `test-writer-fixer` · `qa-expert` · `test-automator` · `e2e-test-automator` · `integration-test-builder` · `unit-test-generator` · `test-architect` · `test-results-analyzer` · `accessibility-tester` · `performance-benchmarker` (behind `/benchmark`) `[vendored]`
- **Stack options** (topic folders): `apps/api` → `api-tester`. See [bench-map § B](./bench-map.md).

## SHIP (07)

- **gstack:** `/setup-deploy` (first time) · `/ship` `/land-and-deploy` `/canary` `/document-release`
- **Skills:** `marketing:seo-audit`/`brand-review`/`content-creation` · `avoid-ai-writing` `[plugin]`
- **Agents (batch):** `deployment-ops-manager` · `devops-automator` · `cicd-builder` · `release-compiler` · `project-shipper` · `uat-coordinator` (client go-live sign-off) · `git-manager` · `documentation-engineer` `[vendored]`

## REFLECT (08)

- **gstack:** `/retro` `/learn`
- **Skills:** `pm-execution:retro` · `data:analyze`/`build-dashboard` · `dataviz` `[plugin]`
- **Agents (batch):** `progress-tracker` · `experiment-tracker` `[vendored]`

## Project lane — per-project stages (run once) `[plugin]` `[vendored]`

The 7 phases above are the **feature lane** (per branch). The **project lane** wraps them —
idea → validate → business → GTM → build → launch → grow, once per product. Tracked in the
**`PROJECTS`** Reminders list. Full tasks + tools per stage → [`launch-playbook.md`](./launch-playbook);
MCP setup → [`../tooling/mcp-servers.md`](../tooling/mcp-servers).

| Stage | gstack · skills · agents · MCP |
| --- | --- |
| **1 Idea** | `/office-hours` · `brainstorming` · `deep-research` · `storm` |
| **2 Discovery** | `pm-product-discovery:*` · `layers-orient` |
| **3 Validate market** | `pm-market-research:*` · `firecrawl-*` · MCP `ahrefs`·`similarweb` |
| **4 Business model** | `pm-product-strategy:business-model`·`lean-canvas`·`value-proposition` |
| **5 Pricing** | `pm-product-strategy:pricing` · `data:*` |
| **6 GTM plan** | `pm-go-to-market:*` · `pm-marketing-growth:*` · `marketing:*` · `growth-hacker` + channels · MCP `hubspot`·`klaviyo`·`notion`·`canva`·`slack`·`apollo`·`koboyo` (pitch/explainer slide deck) |
| **7 Legal** | `legal:*` · MCP `docusign`·`atlassian` |
| **8 Design system** | `/design-consultation` · `ui-ux-pro-max` · `frontend-design` · MCP `figma`·`canva`·`koboyo` (wireframes · UI icon set) |
| **9 Deploy pipeline** | `/setup-deploy` · netlify skills |
| **10 Build features** | **→ the feature lane** (7-phase sprint, `FEATURES` list) |
| **11 Launch** | `/land-and-deploy`·`/canary` · `marketing:plan-launch` · `project-shipper`·`uat-coordinator` · MCP `koboyo` (launch-day deck) |
| **12 Grow / measure** | `data:*` · `pm-data-analytics:*` · `marketing:performance-report` · `experiment-tracker` · MCP `amplitude`·`pendo`·`supermetrics` |
| **13 Reflect** | `/retro global` · `/learn` · `progress-tracker` |

**Growth agents** `[vendored]` (stage 6/11/12, `marketing/` folder): `growth-hacker` (anchor — AARRR) +
channels `instagram-curator` · `reddit-community-builder` · `tiktok-strategist` · `twitter-engager`.
**Sales** (optional outbound): `sales:*` · MCP `apollo`·`close`·`outreach`·`fireflies`. Full map →
[`bench-map.md`](./bench-map.md).

## Business & ops (cross-cutting) `[plugin]`

- **marketing** — brand voice, campaigns, SEO · **legal** — NDA/contract, `compliance-check` · **data** — SQL, dashboards, stats.

## Cross-cutting agents (any phase) `[vendored]`

- **`debugger` · `error-detective`** — diagnose a failing test/build/runtime error, root-cause first.
- **`dependency-manager`** — audit/upgrade deps (respect the `minimumReleaseAge` supply-chain hardening).
- **`code-refactoring-specialist` · `legacy-modernizer`** — structural cleanups outside a feature sprint.

## Off-stack — the bench (`.claude/agents/bench/`)

Only the **`bench-map.md` § D "Skip"** agents live in `.claude/agents/bench/<topic>/` — still
discovered + invokable, just parked. **Kept whole, not pruned.** They're **off-stack** for this
Next.js/Sanity template (`electron-pro` · `wordpress-master` · `microservices-architect` ·
`ai-engineer` · `chaos-engineer` · `mobile-app-builder` · `app-store-optimizer`), **redundant** with
a wired agent (`architecture-consultant` · `performance-optimizer` · `tech-writer` ·
`git-workflow-manager` · `content-creator` · `project-template-manager` · `agent-coordinator`), or
**team/org** orchestration a solo flow skips (`studio-producer` · `training-change-manager`).
Everything a step names — the phase batches, the [Project-lane](#project-lane-per-project-stages-run-once)
Growth/GTM lane, the surface-gated stack-options, and the Optional use-case set — lives in a **topic
folder** (`bench-map.md` § A–C). `pnpm agents:sync` re-vendors + re-splits (never touches `project/`).

## Adding a skill or agent

Full how-to — authoring with `skill-creator`, where files live, wiring, verify →
[`adding-skills.md`](./adding-skills.md). Short version:

- **A project-specific reviewer** (encodes _this repo's_ conventions, like `page-builder-reviewer`)
  → author it in `.claude/agents/project/` and register it above `[local]`.
- **A general agent** → it's already in the vendored suite (`.claude/agents/<topic>/`); just
  reference it. Upgrade the whole suite with `pnpm agents:sync`.
- **A skill** → `.claude/skills/` only when project-specific; otherwise register, don't vendor.

`workflow.md` = the phase chain · `decision-matrix.md` = which review per change.
