---
title: method — the dev framework
---

# method — the dev framework

_How we work_, **foldered like the code**. The `claude-tasks` framework, in-repo
beside the code so you dev with full context at once.

The repo has **four root folders that mirror each other**: `code/` (execution) ·
`method/` (how) · `work/` (doing) · `docs/` (canon). Think in `work/` → build in `code/`
→ promote what sticks to `docs/`.

## Start here — launch a new project

1. **[Machine setup](/shared/process/setup)** — gstack + behavior plugins (once per machine).
2. **[Project bootstrap](/shared/process/project-bootstrap)** — hooks · CI · tests · env (once per repo).
3. **[Workflow § New work](/shared/process/workflow#new-work)** — stamp the sprint, then run the 7 phases → `09_OUTPUTS/`.

New feature? Same chain — stamp `templates/feature/` and follow its `00_BRIEF/`.

## method mirrors the code — different methods per concern

- **[Shared](/shared/process/workflow)** — cross-cutting: the 7-phase
  [process](/shared/process/workflow), the [engineering brain](/shared/engineering/README)
  (principles · testing · tech-debt · git-and-pr · standards), templates, context.
- **[Web app](/apps/web/README)** ↔ `code/projects/web/surfaces/website` — frontend
  [rules](/apps/web/rules/naming) + task [workflows](/apps/web/workflows/add-page).
- **[Modules](/modules/README)** ↔ `code/modules` — [feature-slice architecture](/modules/architecture).
- **[Packages](/packages/README)** ↔ `code/packages` — [api & data](/packages/api-and-data).
- **[Db](/db/README)** ↔ `code/shared/db` — [database](/db/database) (migrations, schema).
- **[Infra](/infra/README)** ↔ `code/infra` — [infrastructure & ops](/infra/infrastructure-and-ops), observability.

## Not rendered here

The **sprint templates** (`method/shared/templates/`) are scaffolds stamped into `work/`,
not reference pages. Sibling sites: the **[lab](http://localhost:3004)** (`work/` — live
sprints, deliverables, `MEMORY`) and **[product docs](http://localhost:3002)** (`docs/`).
