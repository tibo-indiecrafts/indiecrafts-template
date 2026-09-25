# `.claude/skills/` — index (which skill for which surface)

Skills load from **this repo-root folder only** (Claude Code does not auto-discover per-folder skills).
This index maps them to where they help; invoke a skill by name when its trigger fits.

## Cross-cutting — any unit

`api-and-interface-design` · `ci-cd-and-automation` · `context-engineering` · `spec-driven-development` ·
`incremental-implementation` · `documentation-and-adrs` · `changelog-generator` · `continuous-learning`
(capture new patterns into the nearest brief) · `debug-discipline` · `security-hardening`.

## Web — `code/projects/web/{website,admin,app}` + `tools/storybook` + `packages/web/ui*`

Design & build: `impeccable` (broad UX/redesign/polish) · `design-critique` · `design-system-check` ·
`visual-polish` · `better-colors` · `accessibility-pass`. Product UI: `data-tables` · `dashboard-layout` ·
`settings-pages` · `billing-and-pricing`. Health & test: `react-doctor` · `test-pass` · `webapp-testing`.

## SEO & discoverability — `code/projects/web/surfaces/website`

`seo-audit` · `schema-markup` (JSON-LD) · `programmatic-seo` (pages at scale).

## Mobile — `code/projects/mobile/surfaces/main`

`animate-expo` · `accessibility-pass`.

## Backend services — `code/shared/{api,cron,workers}`

`observability-and-instrumentation` · `security-hardening`.

> Source: the engineering + SEO/design skills were harvested from the `indie-brain` skill library.
> Marketing / sales / content-ops skills there are intentionally **not** adopted (out of scope for this codebase).
