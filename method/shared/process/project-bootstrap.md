# Project bootstrap — install per repo

`setup.md` sets up the **machine** (gstack, bun, caveman, ponytail, headroom). This
is what you stand up **inside each new project repo** so the workflow's gates have
teeth. Run once per project — designed at `03_PLAN`, provisioned at `07_SHIP`.

**Skills & agents:** only project-specific, self-contained ones are `[local]` in
`.claude/{skills,agents}` (travel with the clone). The `[gstack]` + `[plugin]` ones
the workflow uses are **global prerequisites** — install gstack (`setup.md`) + the
plugins listed in [`my-skills-and-agents.md`](./my-skills-and-agents.md), the phase × concern × source registry.

| #   | Install                                                                         | Why                                                               | Reference                                       |
| --- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------- |
| 1   | **Git hooks** — husky + lint-staged + `tsc` (pre-commit)                        | machine-enforce the compulsory debt/verify gate; not honor-system | `method/infra/infrastructure-and-ops.md`  |
| 2   | **CI** — GitHub Actions: `tsc · lint · format · build` (+ tests)                | the backstop; catches what the commit hook can't                  | `method/shared/engineering/engineering-standards.md`          |
| 3   | **Test framework** — Vitest + Testing Library (unit), Playwright (e2e + visual) | `06_TEST` needs a target                                          | `method/shared/engineering/testing.md` (the `../wahio` stack) |
| 4   | **Error tracking + logs** — Sentry (or equiv) + structured logger               | `/canary` + `/retro` need signal                                  | `method/infra/observability.md`                  |
| 5   | **Env + secrets** — `.env.example` committed, real `.env` gitignored            | infra design provisioned safely                                   | `method/infra/infrastructure-and-ops.md`         |
| 6   | **`.claude/` + `method/` toolkit** — `.claude/{agents,skills,settings}` (runtime) + root `CLAUDE.md` (thin) + `code/apps/web/{CLAUDE,DESIGN}.md` + `method/apps/web/rules/*`            | project conventions auto-load                                     | `indiecrafts-template`                          |
| 7   | **Behavior plugins** — caveman + ponytail (per-repo); headroom via `headroom wrap claude` (CLI) | output discipline, every phase                                    | `my-skills-and-agents.md`                                  |
| 8   | **gstack state symlink** — `_gstack/` → `~/.gstack/projects/<slug>/`            | phase state lives in the workspace                                | `setup.md`                                      |
| 9   | **UI audit script** — `pnpm shadscan` (`pnpm dlx @shadscan/cli`)                | shadcn UX fundamentals 0–100 (62 rules); manual, run in `06_TEST` | `indiecrafts-template`                          |
| 10  | **`grill-me` skill** (global) — `npx skills@latest add JuliusBrussee/skills --skill grill-me --global` | `02_THINK` adversarial gate — interrogate the approach before PLAN | `setup.md`, `my-skills-and-agents.md`           |

## Fastest path

Fork `indiecrafts-template` (Next.js) — it already ships 1, 2, 5, 6 and the docs.
Add 3, 4, 7, 8, 10. For a non-web project, stand up each row to fit the stack.

## Done when

A bad commit is blocked locally (hook) **and** in CI, secrets never land in git,
tests run, and errors surface in a dashboard.

**Next → [0 · Intake](./intake.md)** — stamp the first sprint
(`node method/scripts/new-sprint.mjs "<name>"`), then run the 7 phases (see
[WORKFLOW § New work](./workflow.md)). (Machine not set up yet? Do [`setup.md`](./setup.md) first.)
