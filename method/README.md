# method — the dev framework (in-repo)

_How we work_ + the reusable engineering brain, colocated with the code. This is
the `claude-tasks` framework, merged into the repo so you dev with full context at
once. **Reference, not scratch** — read it, build to it; refresh from canon, don't
hand-edit per project (that's what `work/` is for).

## The repo — three root folders that mirror each other

| Folder        | Concern   | Holds                                                                                                                  |
| ------------- | --------- | ---------------------------------------------------------------------------------------------------------------------- |
| **`code/`**   | EXECUTION | the monorepo: `apps/web · packages · modules · db · infra · docs`                                                      |
| **`method/`** | HOW       | this framework, **foldered like the code** (below)                                                                     |
| **`work/`**   | DOING     | the lab: `apps/<app>/features/YYYY-MM-DD_<name>/` sprints (`00_BRIEF … 09_OUTPUTS`) · `MEMORY` · `backlog` · `archive` |

## method mirrors the code

| method/     | ↔ code                               | Holds                                                                                              |
| ----------- | ------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `shared/`   | (cross-cutting)                      | `process/` (7-phase sprint) · `engineering/` (brain) · `templates/` · `context/` · `writing-style` |
| `apps/web/` | `code/projects/web/surfaces/website` | `rules/` (frontend) · `workflows/` (repeatable tasks)                                              |
| `modules/`  | `code/modules`                       | `architecture` (vertical-slice features)                                                           |
| `packages/` | `code/packages`                      | `api-and-data`                                                                                     |
| `db/`       | `code/shared/db`                     | `database` (migrations, schema)                                                                    |
| `infra/`    | `code/infra`                         | `infrastructure-and-ops` · `observability`                                                         |

Within `method/`, the split is knowledge vs doing:

| Zone                 | Question                                    | Where                     |
| -------------------- | ------------------------------------------- | ------------------------- |
| **`method/`** (this) | _how we work_ + eng canon                   | here                      |
| **`docs/`**          | _what this product is + why_                | VitePress product canon   |
| **`work/`**          | _the lab_: think · plan · develop · reflect | per project + per feature |

Flow: **think in `work/` → build in `code/` → promote what sticks to `docs/`.**

## What's inside

| Folder         | Holds                                                                                                                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `process/`     | the 7-phase sprint — `setup.md`, `workflow.md`, `decision-matrix.md`, `my-skills-and-agents.md`, `adding-skills.md`, `end-to-end.md`, `project-bootstrap.md`, `system-rules.md`, `command.md` |
| `engineering/` | the brain — `principles` · `testing` · `git-and-pr` · `engineering-standards` · `tech-debt` (per-concern engineering lives in `modules/ packages/ db/ infra/`)                                |
| `context/`     | `HOW-I-WORK.md` · `voice-guide.md` · `audience.md` · `references/`                                                                                                                            |
| `templates/`   | sprint templates — `app/` (set-once) + `feature/` (per branch → PR); stamped into `work/`                                                                                                     |

## Start here

1. `process/workflow.md` — the 7 phases × gstack commands × skills.
2. `engineering/README.md` — the playbook index (read the doc your change touches before planning).
3. `process/project-bootstrap.md` — what to install per repo.

The 7-phase sprint (gstack): `/office-hours → /autoplan → build → /review → /qa → /ship → /retro`, at project and feature altitude.

## Links

- **Live:** `<production URL>` · **Repo:** `<git URL>` · **Deploy:** `<Netlify/Vercel dashboard>`
- **Internal dev site:** `http://localhost:3003` — private, **not publicly deployed**.

<!-- Template placeholders — fill per project; canonical URLs live in the root README. -->
