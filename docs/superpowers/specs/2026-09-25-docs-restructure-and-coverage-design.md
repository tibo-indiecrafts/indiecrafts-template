# Docs restructure, coverage & best-practices — design spec

- **Date:** 2026-09-25
- **Author:** thibault (+ Claude)
- **Status:** Draft — awaiting review
- **Area:** `code/docs/` (VitePress product-docs site)
- **Path:** repo-relative paths throughout; docs paths are relative to `code/docs/`.

## Summary

Restructure the `code/docs/` VitePress site to mirror the code tree, document
every code unit and file, adopt the best documentation practices from the wahio
reference project, and leave the site clean, current, easy to install, and easy
to deploy. Onboarding leads with Quick Start and Installation. The developer
inner loop leads with the fast harness commands.

## Goals

1. Docs folders mirror the code spine: `projects/ · packages/ · modules/ · shared/`.
2. Quick Start and Installation are the first thing a reader sees.
3. Every code unit has a doc page. Every source file is tracked to documented.
4. Adopt wahio's best practices; fix the thin spots wahio never fixed.
5. Best practices are themselves documented in the docs.
6. The site is up to date and clean: no broken links, no stale counts, no orphans.
7. The dev docs push the fast commands (`tsc:fast`, `oxlint`, `eslint --cache`).
8. The docs site is easy to install, run, build, and deploy.

## Non-goals

- No change to the cp-synced changelog page bodies (`*/changelog.md` are generated).
- No change to the `[placeholder]` intake / ROPA / DPIA fill-ins (by design).
- No rename to fully verbose code paths (`projects/web/surfaces/website`). We use
  the readable short form (`projects/web/website`) and document the mapping.
- No hand-authoring of every file's doc in one pass. File-level coverage is
  seeded now and driven to completion in tracked batches (see §4).

## Current state (audit findings, 2026-09-25)

- VitePress `^1.6.4`, 116 pages, hand-written sidebar in `.vitepress/config.mts`,
  dev port 3002. npm-isolated (own lockfile; not a pnpm-workspace member).
- Onboarding is front-loaded but not explicit: no page named "Quick Start" or
  "Installation". `getting-started.md` is the de-facto entry.
- Structure does **not** mirror code. Docs use an older `apps/` taxonomy.
  Packages are flat with a `-shared` suffix; the code `shared/` service tier
  (api · cron · workers · db · infra) is scattered under `apps/workers/`, `db/`,
  `infra/`.
- `ignoreDeadLinks: true` masks breakage. Three links are genuinely broken:
  - `apps/web/setup/operations.md` → `../config/newsletter.md` (missing)
  - `packages/compliance.md` → `../seo/analytics.md` (wrong depth)
  - `packages/README.md` → `./consent.md` (no such page)
- Stale: `packages/README.md` says "Fifteen bricks are live"; code has 30 packages.
- Orphans: `shared/README.md` (near-empty, unlinked), `apps/README.md` (home-only).
- Cosmetic: `&amp;` literals in some design/SEO H1s.
- Coverage gaps (no page): `admin`, `app`, `mobile/main` surfaces;
  `packages/{shared,web}/auth`; `packages/shared/security-events`; the 8
  `shared/scripts/lib/*` registries. `storybook.md` is misfiled under `packages/`.

## Target structure (pragmatic mirror of `code/`)

```
code/docs/
  index.md                          home — hero button → Quick Start
  quick-start.md                    NEW — nav #1: prereqs → install → run in 5 steps
  getting-started.md                kept — "Platform overview" (concepts), linked next
  contributing/
    how-we-document.md              NEW — the governance / best-practices page
    adr/
      README.md                     NEW — ADR index + how to write one
      0000-template.md              NEW — Context / Decision / Consequences / Status
  projects/
    README.md                       (was apps/README.md, retitled)
    web/
      website/**                    (was apps/web/** — setup·config·design·seo·features)
        changelog.md                (cp-synced; path updated in sync:changelog)
      admin/index.md                NEW
      app/index.md                  NEW
      tools/storybook.md            (moved out of packages/)
    mobile/
      main/index.md                 NEW
  packages/
    README.md · linking-a-package.md · changelog.md
    shared/<name>.md                (16: announcement, auth NEW, compliance, config,
                                     format, gated-delivery, logger, query, security,
                                     security-events NEW, system-pages, ui-fonts,
                                     ui-icons, ui-tokens, utils, version)
    web/<name>.md                   (13: announcement, auth NEW, compliance, email,
                                     i18n, locale-suggest, page-builder, sanity, schema,
                                     security-reports, ui-components, ui, version)
    mobile/<name>.md                (1: ui-native)
  modules/
    README.md · linking-a-module.md · changelog.md
    web/{blog,contact,newsletter,waitlist}/**   (add the web/ scope layer)
  shared/
    README.md                       shared-tier landing (fix orphan)
    api/index.md · cron/index.md · workers/index.md   (split from apps/workers/index.md)
    db/README.md                    (moved from top-level db/)
    infra/{README.md,cloudflare-iac.md}             (moved from top-level infra/)
    scripts/index.md                NEW — toolchain-registries reference
    architecture/**                 kept (cross-cutting)
    client-intake/**                kept (cross-cutting)
  CHANGELOG.md                      logs this whole move
```

The `-shared` suffix disappears: the scope folder (`packages/shared/` vs
`packages/web/`) now disambiguates the name collisions.

## §1 Quick Start and Installation first

- New `quick-start.md` — the shortest path to a running stack:
  1. Prerequisites: Node 22, pnpm 10, macOS.
  2. `pnpm install` at the repo root.
  3. `pnpm dev` — website :3000 + api/cron/workers.
  4. Open `http://localhost:3000`.
  5. Next steps: link to Installation, New client, Platform overview.
- `quick-start.md` is **nav item #1** and the hero's primary action button.
- Installation = `projects/web/website/setup/environment.md` — linked from Quick
  Start step 5 and nav item #2.
- `getting-started.md` stays as the conceptual "Platform overview".

## §2 Fast commands in dev (ties to the prior harness-speed work)

Quick Start, `setup/scripts.md`, and `setup/on-the-fly-checks.md` lead with the
fast inner-loop commands and the "do not pre-run" rule:

- `pnpm tsc:fast` — typecheck via `tsgo` (TS 7 Go port, ~10× faster). The local
  inner loop. CI keeps the real `tsc`.
- `pnpm oxlint` — repo-wide AST lint in ~3s (Rust). Advisory; covers all surfaces.
- `pnpm lint` / `lint:fix` use `eslint --cache`.
- `turbo run build/test/verify --concurrency=50%` for parallel fan-out.
- The rule, stated once and linked: **do not manually run `tsc`/`lint` after
  every edit.** The commit hook + live lint cards + `typescript-lsp` are the gate.
- Cross-link the fast-harness guidance so the speed rules live in one place.

## §3 Coverage — every unit, then every file

Two altitudes, both enforced:

1. **Unit docs (authored now).** One page per surface, package, module, and
   shared service. Fill every gap from the audit:
   - Surfaces: `projects/web/admin`, `projects/web/app`, `projects/mobile/main`.
   - Packages: `packages/shared/auth`, `packages/web/auth`,
     `packages/shared/security-events`.
   - Toolchain: `shared/scripts/index.md` documents the 8 `lib/*` registries
     (apps · databases · infra-registry · domains · resources · project ·
     backup-common · deploy-shared) in one reference page with a table per registry.
   - Move `storybook.md` to `projects/web/tools/storybook.md`.

2. **File-level coverage (tracked to done).** Adopt wahio's doc-per-file target,
   made verifiable so it never drifts:
   - A **coverage checker** `code/shared/scripts/checks/doc-coverage.mjs` walks
     the code tree and reports every source file with no documentation reference.
     It runs as `pnpm check:doc-coverage`. It fails on regressions, warns on the
     existing backlog (baseline file), so the count only goes down.
   - A per-area **coverage index** (a "graph" page) lists every file with a
     status box: `[ ]` todo, `✅` documented, `⚠️` documented-with-issues. The
     index doubles as the audit tracker.
   - The governance page defines "documented": a file is documented when it is
     covered by a unit page section **or** its own entry, and it carries a
     source↔doc `@see` link.
   - The long tail is authored in batches against the index, not in this pass.
     This pass seeds the indexes and drives the checker to a green baseline.

> Rationale: hand-authoring ~hundreds of file docs in one session is neither
> qualitative nor safe. The checker + index make "every file documented" a
> measurable, enforced target that reaches 100% in reviewable batches.

## §4 Best practices adopted (and documented)

`contributing/how-we-document.md` is the governance page. It states:

- **Numbered doc process** — read the file first; document every export, prop,
  and dependency; add the page to the sidebar (no orphans); ship docs in the same
  PR as the code; a stale guide is worse than no guide.
- **Per-page-type section contract** — the required sections per page type:
  - Surface page: Purpose · Stack · Wired baseline · Routes · Deploy · Registry row.
  - Package page: Purpose (tagline) · Exports · Usage example (import + call) ·
    Consumers · Flags.
  - Module page: Purpose · Feature flag · Schema/blocks · Routes · Editor guide.
  - Config page: Purpose · The one config object · Options table · Gating.
- **Newcomer-first ordering** — Quick Start → Installation → overview →
  architecture → reference. Reference-heavy sections collapse and sub-group
  past 15 items.
- **Source↔doc links** — every documented file carries a JSDoc
  `@see {@link ...}` to its doc; each doc links back to the source.
- **Issue-tag Flags** — the closed vocabulary (`@complexity`, `@refactor`,
  `@debt`, `@bug`, `@optimisation`) surfaces in a page "Flags" section; already
  enforced by `pnpm tags:check`.

Adopted mechanics:

- **Per-page frontmatter** on every page: `title`, `description`, `status`
  (`stable` | `draft` | `template`), `order`. Enables reasoning about the sidebar.
- **Dead links fail the build.** Set `ignoreDeadLinks` to an allow-list that
  ignores the cp-synced `*/changelog.md` pages and the cross-tree links into
  `code/`, and fail on every genuine in-site break. Fix the three broken links.
- **Diagrams-as-code.** Enable mermaid in VitePress. The governance page states
  the convention: mermaid for architecture and data flow; ASCII trees only for
  file layouts.
- **ADRs.** Add `contributing/adr/` with a one-page template
  (Context / Decision / Consequences / Status). Fold the existing
  `design/decisions.md` in as the design-ADR log. Link ADRs from architecture pages.

Wahio's thin spots we fix: no frontmatter → we add it; `ignoreDeadLinks: true`
→ we invert it with an allow-list; no doc CI → we add one (§7); no diagrams →
mermaid; no formal ADRs → the ADR folder.

## §5 Clean-up (up to date and clean)

- Fix the 3 broken links (§ current state).
- Update `packages/README.md`: "Fifteen bricks" → the real count; list the newly
  documented packages.
- Rewrite `shared/README.md` into a real shared-tier landing; add it to the sidebar.
- Retitle `apps/README.md` → `projects/README.md`; link it in the sidebar.
- Replace `&amp;` H1 entities with bare `&`.
- Update `sync:changelog` script paths in `code/docs/package.json` to the new tree.
- Update `code/docs/.claude/CLAUDE.md` and the root `CLAUDE.md` docs-layout
  description to the new structure.
- Log the move in `code/docs/CHANGELOG.md`.

## §6 Install & run the docs site (easy to install)

The docs are npm-isolated. Commands from the repo root:

```bash
pnpm docs:install     # npm --prefix code/docs install   (first run only)
pnpm docs             # dev server on :3002
pnpm docs:build       # static build → code/docs/.vitepress/dist
```

Add `pnpm docs:preview` at the root (proxy to the existing docs `docs:preview`)
so a built site can be checked locally. Quick Start documents these three lines
and the port. The npm-isolation and its reason are stated on the docs landing.

## §7 Deploy the docs site (easy to deploy)

Today the site is build-only — no deploy target exists. Add one, mirroring the
storybook gallery (Cloudflare Worker static assets):

- Add `code/docs/infra/cloudflare/` with a `wrangler` static-assets config
  (`[assets]`, no `main`).
- Add a registry row so deploy + CI pick it up, following the storybook peer.
- Add `pnpm deploy:docs:<dev|staging|prod>` → the shared `deploy/worker.mjs`
  after `docs:build` → `<prefix>-<env>-docs` (`*.workers.dev`, or the
  `docs.<root>` route once set in `domains.mjs`).
- Document the deploy in `shared/architecture/platform-deploy.md` and on the
  docs landing.

> This deploy wiring is Phase 5 — optional and gated on approval. It is infra,
> heavier than the docs content work. The content restructure ships without it.

## §8 Tooling & enforcement changes

- `.vitepress/config.mts`: full sidebar + nav rewrite to the new tree; enable
  mermaid; `ignoreDeadLinks` allow-list.
- `code/docs/package.json`: fixed `sync:changelog` paths; keep VitePress `^1.6.4`.
- New `code/shared/scripts/checks/doc-coverage.mjs` + `pnpm check:doc-coverage`
  - a baseline file; a colocated `doc-coverage.test.mjs`.
- New docs CI job (extend `.github/workflows/test.yml` or a new `docs.yml`):
  `pnpm docs:install && pnpm docs:build` + `check:doc-coverage`. The build now
  fails on dead links, so link-checking is free.
- Root `package.json`: add `docs:preview`; wire `check:doc-coverage` into `verify`.

## §9 Migration map (folder level)

| Old (docs)                  | New (docs)                                          |
| --------------------------- | --------------------------------------------------- |
| `apps/README.md`            | `projects/README.md`                                |
| `apps/web/**`               | `projects/web/website/**`                           |
| `apps/workers/index.md`     | `shared/workers/index.md` (+ split `api/`, `cron/`) |
| `db/README.md`              | `shared/db/README.md`                               |
| `infra/**`                  | `shared/infra/**`                                   |
| `packages/<name>.md` (web)  | `packages/web/<name>.md`                            |
| `packages/<name>-shared.md` | `packages/shared/<name>.md`                         |
| `packages/ui-native.md`     | `packages/mobile/ui-native.md`                      |
| `packages/storybook.md`     | `projects/web/tools/storybook.md`                   |
| `modules/<mod>/**`          | `modules/web/<mod>/**`                              |

Moves use `git mv` to preserve history. Every internal link updated in the same
phase; the build (with dead-links-fail) proves no link is left dangling.

## §10 Phase plan (each phase verifiable)

1. **Restructure.** `git mv` all folders; rewrite the sidebar + nav; fix
   `sync:changelog` paths. Verify: `pnpm docs:build` green (links still allow-listed).
2. **Coverage.** Author the gap pages (surfaces, auth, security-events, scripts
   registries); move storybook; add the per-area coverage indexes; add
   `check:doc-coverage` with a green baseline. Verify: build green;
   `pnpm check:doc-coverage` green.
3. **Best practices.** Governance page; ADR folder + template; enable mermaid;
   frontmatter pass on every page; invert `ignoreDeadLinks` to the allow-list and
   fix the 3 links. Verify: build fails on a seeded bad link, passes when fixed.
4. **Clean-up + propagation.** Stale counts, orphans, entities; update root +
   docs `CLAUDE.md`; docs `CHANGELOG.md` entry; add `docs:preview`; wire the docs
   CI job and `check:doc-coverage` into `verify`. Verify: `pnpm docs:build` +
   `pnpm tags:check` + `pnpm check:doc-coverage` green.
5. **Deploy (optional, gated).** Add the Cloudflare static-assets config,
   registry row, and `deploy:docs:*` script. Verify: `--dry-run` deploy.

## §11 Risks & rollback

- **Link churn.** Moving folders breaks relative links. Mitigation: inverting
  `ignoreDeadLinks` turns the build into the link checker; a green build is proof.
- **cp-synced changelogs.** They carry ~50 by-design dead links. Mitigation: the
  allow-list ignores those three pages.
- **Coverage scope creep.** File-level docs could balloon. Mitigation: the
  checker + baseline cap the effort; the long tail is batched, not blocking.
- **Rollback.** Each phase is its own set of commits. Revert the phase's commits;
  the `git mv` history makes reverts clean. No data is destroyed.

## §12 Definition of done

- Docs folders mirror `projects/ · packages/ · modules/ · shared/`.
- Quick Start is nav #1; Installation is nav #2; both link forward.
- Dev docs lead with `tsc:fast` / `oxlint` and the "do not pre-run" rule.
- Every code unit has a page; `pnpm check:doc-coverage` is green at baseline;
  the coverage indexes list every file with a status.
- `contributing/how-we-document.md` documents the process, the section contract,
  frontmatter, source↔doc links, tags, mermaid, and ADRs.
- `ignoreDeadLinks` is an allow-list; the 3 broken links are fixed; `pnpm
docs:build` fails on a new dead link.
- No stale counts, no orphans, no `&amp;` entities.
- `pnpm docs:install` → `pnpm docs` → `pnpm docs:build` all work; `docs:preview`
  exists; the deploy path is documented (wired in Phase 5).
- Root + docs `CLAUDE.md` and docs `CHANGELOG.md` reflect the new layout.

```

```
