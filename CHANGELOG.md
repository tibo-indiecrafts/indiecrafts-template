# Changelog — the everything-view

The **repo-wide roll-up**: per release, a few plain-language bullets of what shipped across
every area, each linking to the area log for the detail. This is where you see the whole
template's history at a glance.

**One home per change** — the detail is logged in exactly one area log, never copied here:

| Area | Log | Covers |
| --- | --- | --- |
| App (`@indiecrafts/web`) | [`code/projects/web/CHANGELOG.md`](./code/projects/web/CHANGELOG.md) | behavior, config, routes, conventions, design tokens |
| Packages (`@indiecrafts/*` bricks) | [`code/packages/CHANGELOG.md`](./code/packages/CHANGELOG.md) | a brick's public surface — exports, deps, splits |
| Modules (product slices) | [`code/modules/CHANGELOG.md`](./code/modules/CHANGELOG.md) | a module's surface/wiring — extraction, blocks, gating |
| Docs site | [`docs/CHANGELOG.md`](./docs/CHANGELOG.md) | pages added/removed/moved, structure, sidebar |
| Method / framework | [`method/CHANGELOG.md`](./method/CHANGELOG.md) | rules, workflows, process, templates |
| Lab | [`work/CHANGELOG.md`](./work/CHANGELOG.md) | what graduated work/ → docs/, sprint outcomes |

This file stays **coarse**: cut a rolled-up entry at release/tag time, link down for specifics.
Format follows [Keep a Changelog](https://keepachangelog.com); versions are `[major.minor.patch]`.

## [Unreleased]

- **Navigation + footer menus moved into Sanity** (editable per client, no config fallback,
  header dropdowns with icon + description). Detail → [app log](./code/projects/web/CHANGELOG.md).
- **Per-area changelog system** — this roll-up plus four area logs; app/docs/method/work each
  own their own history.
