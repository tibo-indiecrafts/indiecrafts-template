# Skills & agents registry — per step

One place: which **skills and agents** to reach for, per phase. Claude Code discovers
both flat (`.claude/skills/<name>/SKILL.md`, `.claude/agents/<name>.md`) — so the
_structure_ lives here, by step + source.

**Source tag** — where each lives:

- `[vendored]` — the general **agent suite** committed to `.claude/agents/`: all agents categorised in **topic folders** (`<topic>/`), no bench (source: [contains-studio/agents](https://github.com/contains-studio/agents), MIT). The template is packaged — no `~/.claude` prerequisite. Re-pull with `pnpm agents:sync` (never touches `project/`).
- `[local]` — **project-specific** skills/agents that encode _this_ repo's conventions → `.claude/skills/` + `.claude/agents/project/`; hand-maintained.
- `[gstack]` — the gstack engine (global); a machine prerequisite (`setup.md`), can't vendor (runtime-dependent).
- `[plugin]` — a globally-installed plugin (its own lifecycle — not vendored).

**Superpowers** `[plugin]` (`superpowers@claude-plugins-official`) — obra's workflow-discipline skills
(brainstorm · plan · TDD · debug · review · verify). **The fallback: method-first — reach for it only when a
task isn't covered by `method/`** (no gstack sprint / no matching workflow). Rule + overlap map →
[`tooling/index.md`](../tooling/index.md#superpowers--the-method-fallback).

**Policy:** the general agent suite is **vendored** for packaging; **skills stay
register-don't-vendor** unless project-specific. Today `[local]` = **4 skills + 6 agents**
(`.claude/agents/project/`: design-system · accessibility · ux · copy reviewers + `page-builder-reviewer`

- `config-consistency-reviewer`). Adding one → [`adding-skills.md`](./adding-skills.md).

## Always on (every phase) — output discipline `[plugin]`

Cut token cost + bloat at every step:

- **caveman** — terse agent prose (~65% fewer output tokens). `/caveman full|off`.
- **ponytail** — least code that works, reuse first. `/ponytail full|off`.
- **security-guidance** `[plugin]` — edit-time guard: scans every file edit for 9 vulnerability patterns (command injection · XSS · `eval` · dangerous HTML · pickle · `os.system` …), blocks + explains, once per pattern per session. Runs **alongside** `safety-net` (both scan edits — bounded double-warn, accepted for defense in depth) + `@indiecrafts/security` + the `verify` gate — see [`../tooling/behavior-plugins.md`](../tooling/behavior-plugins.md#edit-time-safety-scan-security-guidance).
- **headroom** — opt-in context compression: fits more of the repo in the window on long sessions. A `headroom wrap claude` CLI wrapper (pipx), not a slash plugin. [`../tooling/headroom.md`](../tooling/headroom.md).
- **`writing-style`** (`method/shared/writing-style.md`, cross-cutting) — active voice, ≤20-word sentences, technical items exact. Holds even with plugins off.

## Run order per phase

The gstack command **drives** each phase (runs first); skills support it; then the **agents run
in batches** — parallel groups by concern (e.g. REVIEW = design + a11y + security in one batch),
never all at once. Order below reflects that: **gstack → skills → agents (batch)**.

## THINK (02)

- **gstack:** `/office-hours` `/spec`
- **Skills:** `grill-me` (adversarial gate — `/office-hours` advises, `grill-me` interrogates; survive it before you write the plan) · `adhd` (multi-thread divergent ideation — N independent angles, then a filter pass; use before the idea space narrows) · `deep-research` · `storm:storm` · `firecrawl-*` · `find-docs` (context7) · `layers-orient/*` · `pm-product-discovery:*` · `pm-market-research:*` `[plugin]`
- **Agents (batch):** `general-purpose` · `Explore` `[global]`

## PLAN (03)

- **gstack:** `/autoplan` (ceo·design·eng·devex) · `plan-tune` (refine the autoplan output)
- **Skills:** `writing-plans` · `adhd` (generate diverse plan options before `/autoplan` locks one) · `pm-execution:outcome-roadmap` · `pm-product-strategy:strategy` `[plugin]` · `design-system-check` `[local]` (apps/web)
- **Agents (batch):** `Plan` `[global]` · `system-architect` · `backend-architect` · `data-architect` · `security-architect` (app-level security baseline) · `project-planner` `[vendored]`
- **MCP:** `koboyo` `[local]` — draw the architecture/ERD/sequence diagram onto an editable canvas (`create_diagram`; `get_syntax` first). Live light/dark embed URLs drop straight into a plan or README. Setup → [`../tooling/mcp-servers.md`](../tooling/mcp-servers).
- **Stack options** (in topic folders — activate when the surface lands): `apps/api` → `api-designer` (contract) · `code/shared/db` → `database-schema-designer` · GraphQL → `graphql-architect`. See [bench-map § B](./bench-map.md).

## BUILD (04)

- **gstack:** `/design-consultation` `/design-shotgun` `/design-html`
- **Skills:** `frontend-design` · `find-docs` (context7 — live, version-accurate API docs for the fast-moving stack while coding, not training-data) · `web-design-guidelines` · `ui-ux-pro-max` (greenfield only — see WORKFLOW guardrail) · `ui-design:*`+`design-systems:*` · `shadcn` · `vercel-react-best-practices` · `vercel-composition-patterns` · `test-driven-development` · `ponytail-audit`/`ponytail-review` (the compulsory in-change debt pass — [`tech-debt.md`](../engineering/tech-debt.md) gate) `[plugin]` · `visual-polish` `[local]`
- **Autonomy:** `ralph-loop` `[plugin]` — PRD-driven, stop-hook multi-task burn-down for **grunt work** (CRUD, migrations, test coverage) where the spec is crystal-clear. Contrast gstack `/loop` (interval/dynamic, single-task) — see [`workflow.md`](./workflow.md#autonomy).
- **Agents (batch):** `frontend-developer` · `fullstack-developer` · `refactoring-specialist` · `rapid-prototyper` `[vendored]`
- **MCP:** `koboyo` `[local]` — need UI icons? `find_icons_for(['home','billing',…])` matches a whole set in one call; `get_icon_svg` returns `currentColor` SVG. Reach for Lucide/Reicon first (the wired sets); koboyo when they miss a subject. · `figma` `[plugin]` — direct read of real Figma frames/components/layout for design→code (supersedes the marketing-bundle figma); follow [`figma-handoff`](../../apps/web/rules/figma-handoff.md) to map into tokens/`@/config`.
- **Stack options** (topic folders): `apps/api` → `backend-developer` · `code/shared/db` → `database-schema-designer` · realtime → `websocket-engineer` · a CLI → `cli-developer` · an MCP server → `mcp-developer` · mobile → `mobile-developer`. See [bench-map § B](./bench-map.md).

## REVIEW (05)

- **gstack:** `/review` `/codex` `/cso` `/design-review`
- **Skills:** `visual-critique:*` · `web-design-guidelines` · `improve-codebase-architecture` (deletion-test refactor audit — flags 1000-line files + hot-churn modules from the commit log; complements the in-change `ponytail-audit`) `[plugin]`
- **Agents (batch)** — run as parallel groups, not serially:
  - _design batch:_ `design-system-reviewer` · `ux-reviewer` · `copy-reviewer` (brand voice / tone) `[local]`
  - _a11y batch:_ `accessibility-reviewer` `[local]` · `accessibility-tester` `[vendored]`
  - _correctness batch:_ `config-consistency-reviewer` · `page-builder-reviewer` `[local]` · `code-reviewer` · `architect-reviewer` `[vendored]`
  - _security batch (`/cso`):_ `security-analyzer` · `security-auditor` · `penetration-tester` `[vendored]` (the edit-time `security-guidance` scan already ran in BUILD; this batch is the deeper review)

## TEST (06)

- **gstack:** `/qa` `/qa-only` `/benchmark` · `/browse` · `/connect-chrome` (attach to the running dev tab — screenshot the real app, not a blank one) · `/health` (code-quality dashboard — catches debt regressions)
- **Skills:** `test-pass` (write→run→fix — Vitest + Playwright + Storybook) · `accessibility-pass` · `react-doctor` `[local]` · `accessible-content:*`/`inclusive-interaction:*` (inclusive-design-skills) `[plugin]` · `pnpm shadscan` (CLI — shadcn UX 0–100) · `webapp-testing` `[plugin]`
- **MCP:** `playwright` · `chrome-devtools` `[plugin]` — natural-language browser flows + live network/perf/console on an authenticated session. `claude-in-chrome` stays the default driver + the repo `e2e/` Playwright specs stay the CI gate; reach for these for cross-browser scripting + deep DevTools debugging.
- **Agents (batch):** `test-writer-fixer` · `qa-expert` · `test-automator` · `e2e-test-automator` · `integration-test-builder` · `unit-test-generator` · `test-architect` · `test-results-analyzer` · `accessibility-tester` · `performance-benchmarker` (behind `/benchmark`) `[vendored]`
- **Stack options** (topic folders): `apps/api` → `api-tester`. See [bench-map § B](./bench-map.md).

## SHIP (07)

- **gstack:** `/setup-deploy` (first time) · `/ship` `/land-and-deploy` `/canary` `/document-release`
- **Skills:** `marketing:seo-audit`/`brand-review`/`content-creation` · `avoid-ai-writing` `[plugin]`
- **Agents (batch):** `deployment-ops-manager` · `devops-automator` · `cicd-builder` · `release-compiler` · `project-shipper` · `uat-coordinator` (client go-live sign-off) · `git-manager` · `documentation-engineer` `[vendored]`

## REFLECT (08)

- **gstack:** `/retro` `/learn`
- **Skills:** `pm-execution:retro` · `teach` (turn a codebase area / retro lesson into a tracked, multi-session curriculum in a learning workspace — cross-cutting, any learning) · `data:analyze`/`build-dashboard` · `dataviz` `[plugin]`
- **Agents (batch):** `progress-tracker` · `experiment-tracker` `[vendored]`
- **Memory:** **feed** durable decisions to the auto-memory (`~/.claude/projects/<project>/memory/` — one fact per file, `MEMORY.md` index **< 200 lines**) **and prune** notes the code now contradicts (poisoning). Rhythm + why → [`system-rules.md`](./system-rules.md) § Context, memory & subagent hygiene.

## Project lane — per-project stages (run once) `[plugin]` `[vendored]`

The 7 phases above are the **feature lane** (per branch). The **project lane** wraps them —
idea → validate → business → GTM → build → launch → grow, once per product. Tracked in the
**`PROJECTS`** Reminders list. Full tasks + tools per stage → [`launch-playbook.md`](./launch-playbook);
MCP setup → [`../tooling/mcp-servers.md`](../tooling/mcp-servers).

| Stage                 | gstack · skills · agents · MCP                                                                                                                           |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1 Idea**            | `/office-hours` · `brainstorming` · `deep-research` · `storm`                                                                                            |
| **2 Discovery**       | `pm-product-discovery:*` · `layers-orient`                                                                                                               |
| **3 Validate market** | `pm-market-research:*` · `firecrawl-*` · MCP `ahrefs`·`similarweb`                                                                                       |
| **4 Business model**  | `pm-product-strategy:business-model`·`lean-canvas`·`value-proposition`                                                                                   |
| **5 Pricing**         | `pm-product-strategy:pricing` · `data:*`                                                                                                                 |
| **6 GTM plan**        | content + growth → the **studio content vault** (`~/Code/indie-brain/_content/`); code side keeps MCP `hubspot`·`klaviyo` for the inbound-capture bricks |
| **7 Legal**           | `legal:*` · MCP `docusign`·`atlassian`                                                                                                                   |
| **8 Design system**   | `/design-consultation` · `ui-ux-pro-max` · `frontend-design` · MCP `figma`·`canva`·`koboyo` (wireframes · UI icon set)                                   |
| **9 Deploy pipeline** | `/setup-deploy` · netlify skills                                                                                                                         |
| **10 Build features** | **→ the feature lane** (7-phase sprint, `FEATURES` list)                                                                                                 |
| **11 Launch**         | `/land-and-deploy`·`/canary` · `marketing:plan-launch` · `project-shipper`·`uat-coordinator` · MCP `koboyo` (launch-day deck)                            |
| **12 Grow / measure** | `data:*` · `pm-data-analytics:*` · `marketing:performance-report` · `experiment-tracker` · MCP `amplitude`·`pendo`·`supermetrics`                        |
| **13 Reflect**        | `/retro global` · `/learn` · `progress-tracker`                                                                                                          |

**Growth / content agents** — **moved to the studio content vault** (`~/Code/indie-brain/.claude/agents/`);
this code framework no longer vendors them. Launch/experiment orchestration stays here: `project-shipper` ·
`uat-coordinator` (11) · `experiment-tracker` (12). Full map → [`bench-map.md`](./bench-map.md).

## Business & ops (cross-cutting) `[plugin]`

- **marketing** — brand voice, campaigns, SEO · **legal** — NDA/contract, `compliance-check` · **data** — SQL, dashboards, stats.

## Cross-cutting agents (any phase) `[vendored]`

- **`debugger` · `error-detective`** — diagnose a failing test/build/runtime error, root-cause first. Pair with the `chrome-devtools` MCP `[plugin]` for a live browser bug (network/console/perf on the real session).
- **`dependency-manager`** — audit/upgrade deps (respect the `minimumReleaseAge` supply-chain hardening).
- **`code-refactoring-specialist` · `legacy-modernizer`** — structural cleanups outside a feature sprint; scope them with the `improve-codebase-architecture` skill `[plugin]` (deletion-test + hot-churn analysis).

## Situational agents (categorised — no bench)

**No bench folder** — every vendored agent lives in its **topic folder**, invokable by name. Some are
off the default hot path; reach for them as **options** when the use-case fits (full map →
[`bench-map.md`](./bench-map.md) § D): `electron-pro` (the `apps/hybrid` slot) · `mobile-app-builder`
(the `apps/mobile` slot) · `ai-engineer` (AI-heavy features) · `microservices-architect` /
`wordpress-master` / `chaos-engineer` (off-stack unless the surface lands) · `architecture-consultant` /
`performance-optimizer` / `tech-writer` / `git-workflow-manager` (each overlaps a default —
`system-architect` / `performance-benchmarker` / `documentation-engineer` / `git-manager`) ·
`project-template-manager` / `agent-coordinator` (routing beyond the phase batches) · `studio-producer` /
`training-change-manager` (team/org). `pnpm agents:sync` re-vendors the topic folders (never touches `project/`).

## Adding a skill or agent

Full how-to — authoring with `skill-creator`, where files live, wiring, verify →
[`adding-skills.md`](./adding-skills.md). Short version:

- **A project-specific reviewer** (encodes _this repo's_ conventions, like `page-builder-reviewer`)
  → author it in `.claude/agents/project/` and register it above `[local]`.
- **A general agent** → it's already in the vendored suite (`.claude/agents/<topic>/`); just
  reference it. Upgrade the whole suite with `pnpm agents:sync`.
- **A skill** → `.claude/skills/` only when project-specific; otherwise register, don't vendor.

`workflow.md` = the phase chain · `decision-matrix.md` = which review per change.
