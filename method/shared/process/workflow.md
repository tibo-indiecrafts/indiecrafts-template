# gstack workflow — phases × commands × your skills

One sprint per feature/branch. Copy `method/shared/templates/feature/` — a fully
numbered, self-contained folder: `00_BRIEF/` (the brief) · `01_REFERENCE/` (inputs) ·
`02_THINK … 08_REFLECT/` (the 7 phases below) · `09_OUTPUTS/` (curated deliverables).
Inputs and outputs live **inside the sprint**, so its git history tells the whole story.
gstack state auto-persists to `~/.gstack/projects/<app>/`; symlink it in.

| #   | Phase       | gstack                                                                                  | + your skills                                                                                                                                                           | Output →                                     |
| --- | ----------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| 02  | **Think**   | `/office-hours` `/spec`                                                                 | `brainstorming`, `grill-me` (adversarial gate — stress-test the approach before PLAN), `pm-product-discovery:*`, `layers-orient`                                        | `~/.gstack/projects/<app>/`                  |
| 03  | **Plan**    | `/autoplan` (ceo·design·eng·devex)                                                      | `writing-plans`, `design-system-check`                                                                                                                                  | plans + test matrix                          |
| 04  | **Build**   | implement · `/design-consultation` `/design-shotgun` `/design-html`                     | `test-driven-development`, `frontend-design`, `ui-ux-pro-max` (greenfield only), `designer-skills:ui-design`+`design-systems`, `method/apps/web/rules/*`                | code repo + `DESIGN.md`                      |
| 05  | **Review**  | `/review` `/codex` `/cso` `/design-review`                                              | `design-system-reviewer`, `accessibility-reviewer`, `ux-reviewer`, `page-builder-reviewer`, `config-consistency-reviewer`, `web-design-guidelines`, `visual-critique:*` | `<repo>/.gstack/design-reports/`             |
| 06  | **Test**    | `/qa` `/qa-only` `/benchmark` `/health`                                                 | `accessibility-pass`, `webapp-testing`, `react-doctor`                                                                                                                  | `<repo>/.gstack/qa-reports/`                 |
| 07  | **Ship**    | `/setup-deploy` (first time) · `/ship` `/land-and-deploy` `/canary` `/document-release` | `avoid-ai-writing`                                                                                                                                                      | PR + deploy                                  |
| 08  | **Reflect** | `/retro` `/learn`                                                                       | `pm-execution:retro`                                                                                                                                                    | `<repo>/.context/retros/`, `learnings.jsonl` |

## Guardrail — ui-ux-pro-max vs DESIGN.md

`ui-ux-pro-max` (67 styles / 96 palettes / 57 fonts) is an **idea generator, not
the law**. Use it only for a **greenfield client brand** (BUILD-project): prompt
with real context ("SaaS", "medical"), get a style/palette/font direction, then
**hand-distill into that client's `DESIGN.md` as OKLCH tokens** and lock it.
Never let it write/overwrite `DESIGN.md` or `globals.css`; its palettes are hex →
translate + `pnpm verify:contrast`. On a repo whose `DESIGN.md` is already set,
tokens win — use uipro only to `review/fix` UX anti-patterns.

## Two altitudes, same 7 phases

The phases repeat at both levels — different scope:

- **App** (`work/apps/<app>/02_THINK … 08_REFLECT`) = **strategy / system /
  infra**, set once and evolved: vision, roadmap, `DESIGN.md`, security baseline,
  test strategy, deploy pipeline, portfolio retro.
- **Feature** (`work/apps/<app>/features/YYYY-MM-DD_<name>/02_THINK … 08_REFLECT`) = **one
  branch sprint** → one PR, inheriting the project-level system.

## Business & ops layer (marketing · legal · data)

Cross-cutting plugins that plug into phases + `method/shared/context/`. Full power needs
their MCP connectors (figma/hubspot/notion, docusign/box, snowflake/bigquery);
without them you still get templates + guidance.

| Plugin        | Skills                                                                                                                                  | Where it plugs in                                                                                                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **marketing** | `brand-review` `seo-audit` `content-creation` `campaign-plan` `email-sequence` `competitive-brief` `performance-report` `draft-content` | Project `04_BUILD` (brand voice ← `method/shared/context/voice-guide.md`), feature `07_SHIP` (launch content), `08_REFLECT` (`performance-report`). `seo-audit` on every client site. |
| **legal**     | `triage-nda` `review-contract` `compliance-check` `legal-risk-assessment` `vendor-check` `brief`                                        | Project onboarding (`00_BRIEF/` + `method/shared/context/`): client NDA/contract. `compliance-check` for the site's `/legal` + privacy pages.                                         |
| **data**      | `analyze` `sql-queries` `build-dashboard` `create-viz` `explore-data` `statistical-analysis` `validate-data`                            | `08_REFLECT` (metrics, retro dashboards), pairs with `dataviz` skill.                                                                                                                 |

## Autonomy

Two autonomous-execution modes in **BUILD** — pick by task shape:

- **`ralph-loop`** `[plugin]` — a **PRD-driven, stop-hook burn-down**: write a crisp PRD,
  kick the loop, Claude takes one task at a time (implement → commit → fresh context, zero
  pollution). Best for **grunt work with a crystal-clear spec**: CRUD, migrations, test
  coverage. Vague spec = thrashing.
- **gstack `/loop`** — an **interval / dynamic single-task** loop (`ScheduleWakeup`): repeats
  one task on a cadence or until a condition, holding context. Best for **watch-and-react**
  work (poll CI, iterate on one target).

Rule: **many clear tasks → `ralph-loop`; one task, repeated or watched → `/loop`.** Neither
skips the gates — REVIEW + TEST still run on the result.

## Levels

- **Startup/portfolio** → `~/.gstack/builder-journey.md` (global)
- **App** = `<slug>` → `work/apps/<app>/` + `~/.gstack/projects/<app>/`
- **Feature** = branch → `work/apps/<app>/features/YYYY-MM-DD_<name>/` (the 7 folders) → one PR

## New work

**Launch chain:** [1 · Machine setup](./setup.md) → [2 · Project bootstrap](./project-bootstrap.md)
→ **stamp the sprint** ([0 · Intake](./intake.md), below) → fill `00_BRIEF/` → run the phases
(02–08) → land deliverables in `09_OUTPUTS/` (index them in `work/DELIVERABLES.md`). Read
[`system-rules.md`](./system-rules.md) first, every session.

```bash
# new feature — the canonical intake (see 0 · Intake)
node method/scripts/new-sprint.mjs "<name>" --title "<card title>" --desc "<card body>"
# new project (app-altitude)
node method/scripts/new-sprint.mjs "<app>" --kind app --app "<app>"
ln -s ~/.gstack/projects/<app> "work/apps/<app>/_gstack"
```

Parallel sprints (10–15) via Conductor — each branch its own feature folder. Use
`context-save` / `context-restore` to checkpoint and swap between concurrent sprints
without losing thread.
