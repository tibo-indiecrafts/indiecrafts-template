# End to end — idea → production

The complete flow. **Project lane** = business + system, set once. **Feature lane**
= per-branch sprint, repeated. Each stage → its skill → its output folder.

**Track it:** the project lane runs in the **`PROJECTS`** Reminders list (one reminder per product,
these 13 stages as its checklist); the feature lane in **`FEATURES`** (one per capability, the 7
sprint phases). Per-stage tasks + tools → [`launch-playbook.md`](./launch-playbook); per-phase tools
→ [`my-skills-and-agents.md`](./my-skills-and-agents).

## Project lane (idea → launched product)

_Tasks + tools per stage → [`launch-playbook.md`](./launch-playbook)._

| #   | Stage                        | Tools                                                                  | Output                 |
| --- | ---------------------------- | ---------------------------------------------------------------------- | ---------------------- |
| 1   | **Idea / reframe**           | `/office-hours` (startup), `brainstorming`, `deep-research`, `storm`   | `by-skill/research/`   |
| 2   | **Discovery**                | `pm-product-discovery:*`, `layers-orient`                              | research               |
| 3   | **Validate market**          | `pm-market-research:*` (sizing, ICP, competitor), `firecrawl`          | research               |
| 4   | **Business model**           | `00_BRIEF/BUSINESS.md` → lean-canvas, business-model, value-prop       | `00_BRIEF/BUSINESS.md` |
| 5   | **Pricing + unit economics** | `pm:pricing-strategy`, `00_BRIEF/UNIT-ECONOMICS.md`, `data:*`          | data/                  |
| 6   | **GTM plan**                 | `pm-go-to-market:*`, `marketing:campaign-plan`                         | marketing/             |
| 7   | **Legal**                    | `legal:review-contract` `triage-nda` `compliance-check`                | legal/                 |
| 8   | **Design system**            | `/design-consultation`, `ui-ux-pro-max`→`DESIGN.md`, `frontend-design` | `DESIGN.md`            |
| 9   | **Deploy pipeline**          | `/setup-deploy`, netlify skills                                        | `CLAUDE.md`            |
| 10  | **Build features**           | ↓ the feature lane, one branch each                                    | PRs                    |
| 11  | **Launch**                   | `marketing:seo-audit`+`content`, `/land-and-deploy`, `/canary`         | content/               |
| 12  | **Grow / measure**           | `data:*` (cohorts, A/B, dashboards), `marketing:performance-report`    | data/, reports/        |
| 13  | **Reflect / iterate**        | `/retro global`, `/learn`, next features                               | retros/                |

## Feature lane (one branch → one PR)

`02_THINK` → `03_PLAN` → `04_BUILD` → `05_REVIEW` → `06_TEST` → `07_SHIP` → `08_REFLECT`
(see `workflow.md`). Inherits the project's business model + design system + pipeline.

## The loop

Project lane runs once (revisit at `/retro`). Feature lane runs N times. Business
(4–7) precedes build (10); measurement (12) feeds the next features (10) and the
model (4–5). From IDE to production, nothing is skipped because each stage names
its tool and its output home.
