# 07 · SHIP

**gstack:** `/ship` (tests + coverage + PR) · `/land-and-deploy` (merge → CI →
deploy → verify) · `/canary` (post-deploy watch) · `/document-release`
**Your skills:** `avoid-ai-writing` (release notes / PR body)
**Repo:** PR on GitHub; deploy config in `CLAUDE.md`

## Before land — instrument + approve

- **Instrument:** add the analytics/tracking events this feature needs, so
  `08_REFLECT` and `/canary` have real signal. No events = you fly blind after ship.
- **Approval gate:** `/ship` opens the PR; a human (or `/codex` + Greptile) reviews
  and approves **before** `/land-and-deploy`. Don't self-merge non-trivial changes.

**Changelog roll-up:** at release/tag, cut a rolled-up entry in the root `/CHANGELOG.md`
linking down to the area logs (`code/projects/web/surfaces/website/CHANGELOG.md` etc.) — never copy detail up.

Save here: PR link, release notes, deploy result, canary outcome.
