# 07 · SHIP — project

Project altitude: the deploy pipeline every feature ships through (set once).

**gstack:** `/setup-deploy` (one-time: platform, prod URL, deploy cmds → `CLAUDE.md`)
· `/land-and-deploy` config · `/canary` baselines
**Repo:** deploy config in `CLAUDE.md`, GitHub Actions

**Provision** (from `03_PLAN`'s infra design): `.env` + secrets, DB
(`netlify-database`), and **observability** — error tracking + logs so `/canary`
and `/retro` have signal.

**Launch checklist:** run the template's `docs/apps/web/setup/launch-checklist.md` (SEO,
robots, sitemap, analytics + consent, security headers) before go-live.

**Changelog roll-up:** at release/tag, cut a rolled-up entry in the root `/CHANGELOG.md`
linking down to the area logs — never copy detail up.

Save here: platform, prod URL, deploy/rollback runbook, environments, launch-checklist status.
