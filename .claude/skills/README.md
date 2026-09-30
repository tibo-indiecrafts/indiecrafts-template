# `.claude/skills/` — index (which skill for which surface)

Project skills live here, at the repo root, so `/name` works from any starting folder. Claude sees each
skill's name + description every session and loads the body only when invoked or relevant — so keep a
description short, trigger words first, and a `SKILL.md` under 500 lines (move reference to a sibling
file, as `schema-markup/types.md` does). Placement rules → [`../README.md`](../README.md).

## Repo workflow

`brief` (review / create the nearest `.claude/CLAUDE.md`, route overflow) · `grill-plan` (stress-test a
plan before approval; also nudged by `hooks/grill-plan.sh`).

## Cross-cutting — any unit

`api-and-interface-design` · `ci-cd-and-automation` · `context-engineering` · `spec-driven-development` ·
`incremental-implementation` · `documentation-and-adrs` · `changelog-generator` · `continuous-learning`
(capture new patterns into the nearest brief) · `debug-discipline` · `security-hardening`.

## Web — `code/projects/web/surfaces/{website,admin,app}` + `tools/storybook` + `code/packages/web/ui*`

Design & build: `impeccable` (broad UX/redesign/polish) · `design-critique` · `design-system-check` ·
`visual-polish` · `better-colors` · `accessibility-pass`. Product UI: `data-tables` · `dashboard-layout` ·
`settings-pages` · `billing-and-pricing`. Health & test: `react-doctor` · `test-pass` · `webapp-testing`.

## SEO & discoverability — `code/projects/web/surfaces/website`

`seo-audit` · `schema-markup` (JSON-LD; this repo's factories live in `@/lib/seo/jsonld-factories`) ·
`programmatic-seo` (pages at scale).

## Mobile — `code/projects/mobile/surfaces/main`

The Capacitor shell has no UI of its own — it wraps the `app` surface, so the Web skills apply.

## Backend services — `code/shared/{api,cron,workers}`

`observability-and-instrumentation` · `security-hardening`.

> Source: the engineering + SEO/design skills were harvested from the `indie-brain` skill library.
> Marketing / sales / content-ops skills there are intentionally **not** adopted (out of scope for this codebase).
