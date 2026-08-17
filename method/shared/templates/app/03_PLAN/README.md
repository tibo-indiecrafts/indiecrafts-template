# 03 · PLAN — project

Project altitude: roadmap + architecture spine the features inherit.

**gstack:** `/plan-ceo-review` (vision/scope) · `/plan-eng-review` (system architecture)
**Your skills:** `writing-plans`, `pm-execution:outcome-roadmap`, `pm-product-strategy:strategy`
**gstack writes:** plans → `~/.gstack/projects/<slug>/`

Save here: roadmap, feature list, system architecture, cross-cutting decisions.

**Read first:** `method/shared/engineering/` — `infrastructure-and-ops`, `testing`,
`database`, `observability` — before designing the spine. Per-repo install list →
`method/shared/process/project-bootstrap.md`.

**Infrastructure design** (part of PLAN, provisioned in `07_SHIP`): data stores
(`netlify-database` / Postgres), env + secrets strategy, third-party services,
auth, caching/CDN, and **observability topology** (error tracking, logs, metrics).
Diagram it with `/plan-eng-review` — decide it before build, stand it up at ship.

**Business lane:** finish `00_BRIEF/BUSINESS.md` (business-model → pricing → GTM → legal)

- `00_BRIEF/UNIT-ECONOMICS.md` (LTV:CAC ≥ 3, payback < 12mo). Model must hold before build.
