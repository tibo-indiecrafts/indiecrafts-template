# indiecrafts.dev — platform CLAUDE.md

Config-first, modular monorepo for client sites. This root file is **platform-level**:
the folder map, the always-true non-negotiables, and pointers. The web app's full
_how to code_ lives in **[`code/projects/web/surfaces/website/.claude/CLAUDE.md`](code/projects/web/surfaces/website/.claude/CLAUDE.md)** (auto-loads when you
touch files under `code/projects/web/surfaces/website/**`); design tokens in **[`code/packages/web/ui-tokens/DESIGN.md`](code/packages/web/ui-tokens/DESIGN.md)**.

**Stack:** Next.js 16 · React 19 · TypeScript strict · Tailwind v4 · shadcn/ui · Sanity v6 · next-intl v4 · pnpm 10 + Turborepo (Node 22). Config-first monorepo for marketing sites + a blog/page-builder.

**Top non-negotiables** (the app brief has the full list):

- Never commit `.env*` (only `.env.example`); never expose a non-public token under `NEXT_PUBLIC_`.
- Read from `@/config` — never hard-code brand strings, URLs, colors, or nav.
- Route via `@/i18n/routing` — never `next/link` / `next-intl/navigation`.
- User-facing strings live in `messages/<locale>.json` — never inline.
- Don't edit `src/user-interface/ui/**` (shadcn CLI) or depend on the library at runtime.
- The gate is the **commit hook** (`lint-staged` + `tsc`) + **CI** — not a manual step. Live **lint cards** (the `a11y-check` hook, full eslint config) + the **`typescript-lsp` plugin** give continuous feedback as you edit, so there's no need to manually run `verify:quick` before a PR.

## Repo layout — the in-repo folders

`code/` (execution — including the `docs/` product-docs canon + the `storybook` gallery, all
projects under `code/projects/`) is the whole tree. Conventions live **in-repo**: this root
`CLAUDE.md`, the app briefs (`code/projects/**/.claude/CLAUDE.md`), the app-scoped rules
(`code/projects/web/surfaces/website/.claude/rules/`), and the product docs (`code/docs/`).

- **`code/`** — EXECUTION: the pnpm + Turbo workspace. **`projects/`** holds the **per-platform** deployables, nested **platform → kind → leaf** (`code/projects/<platform>/<kind>/<name>`): `web/surfaces/{website,admin,app}` · `web/tools/storybook` · `mobile/surfaces/main` (`website` is live + the hub Studio; the rest are activated scaffolds). **`shared/`** is the **top-level cross-cutting tier** (a sibling of `projects/`) — everything shared across platforms: the `worker-cf` services (`api · cron · workers`) **and** the ops layer `db · infra` (`domains` is toolchain-only, no folder) + the concern-grouped **toolchain** with its four machine registries at `code/shared/scripts/lib/{apps,databases,infra-registry,domains}.mjs` (each carries its entity's `dir`; runners in `code/shared/scripts/{deploy,data,infra,checks,dev}/`). Per-platform sharing stays under its platform (`code/projects/<platform>/shared/…`). Then `packages/` (shared bricks), `modules/` (product features: blog/shop/events…), and the npm-isolated `docs/`. Roster → `code/projects/_registry.md`. **Infra co-locates** per stack (`<app.dir>/infra/<provider>/`); deploy + CI read the registries. Workspace root is the **repo root** (`package.json`, `pnpm-workspace.yaml`, `turbo.json`).
- **`code/docs/`** — CANON (product docs): a VitePress site at the top of `code/` (sibling of `projects/ packages/ modules/ shared/`), **foldered to mirror the code spine**: `projects/web/{website,admin,app,tools}` + `projects/mobile/main` · `packages/{shared,web,mobile}/<name>.md` · `modules/web/<name>/` · `shared/{api,cron,workers,db,infra,scripts,architecture,client-intake}` · `contributing/` (the `how-we-document` governance page + ADRs). `quick-start.md` leads; `pnpm check:doc-coverage` asserts every code unit has a page; dead links fail the build. **npm-isolated** — matches no pnpm-workspace glob, so it stays out (own lockfile). Run via `pnpm docs` / `pnpm docs:build`.
- **`code/projects/web/tools/storybook/`** — the component gallery (Storybook), documenting the design-system bricks (`ui` · `ui-components` · `ui-tokens` + `announcement`/`locale-suggest` stories). A workspace member; static build. Run via `pnpm --filter @indiecrafts/web-tools-storybook storybook`.

Run scripts from the repo root. `pnpm build/tsc/lint/…` fan out via turbo; `pnpm dev` runs the local stack — the `website` (Next, :3000) + the three backend workers `api`/`cron`/`workers` (`wrangler dev` on distinct `--port`/`--inspector-port`s so they don't collide). The other surfaces (`admin`/`app`) are run individually (`pnpm --filter <pkg> dev`).

> **Config split.** `.claude/` holds Claude Code **runtime** only — `agents/`, `skills/`, `settings.json` (must sit at the repo root; Claude Code magic-loads them). **App conventions are app-scoped:** [`code/projects/web/surfaces/website/.claude/CLAUDE.md`](code/projects/web/surfaces/website/.claude/CLAUDE.md) + [`code/packages/web/ui-tokens/DESIGN.md`](code/packages/web/ui-tokens/DESIGN.md) auto-load when you work under `code/projects/web/surfaces/website/**`. A new app lands under its platform + kind (`code/projects/<platform>/<kind>/<name>/`) with its own brief; this root stays the thin platform router.

## Working principles

Guardrails against common LLM coding mistakes — bias to caution over speed (use judgment on trivial tasks).

**1. Think before coding.** State assumptions; if uncertain, ask. Multiple interpretations → present them, don't pick silently. Simpler approach exists → say so, push back when warranted. Unclear → stop, name it, ask.

**2. Simplicity first.** Minimum code that solves the problem, nothing speculative — no unrequested features, abstractions, flexibility, or error handling for impossible cases. If 200 lines could be 50, rewrite.

**3. Surgical changes.** Touch only what the request needs; match existing style; don't "improve" adjacent code, comments, or formatting. Notice unrelated dead code → mention it, don't delete. Every changed line traces directly to the request.

**4. Goal-driven execution.** Turn tasks into verifiable goals (bug → failing repro, then fix; "add validation" → tests for bad input, then pass). Multi-step → brief plan + per-step verify, then loop until green.

## Commands

```bash
pnpm dev                                  # local stack: website (:3000) + api/cron/workers (wrangler dev, ports 8787/8789/8790 / inspectors 9229/9231/9232)
pnpm build / tsc / lint / format          # standard (turbo → @indiecrafts/web-surfaces-website)
pnpm tsc:fast                             # FAST typecheck via tsgo (TS 7 Go port, ~10× faster) — the local inner loop; CI keeps real `tsc`
pnpm oxlint                               # FAST repo-wide AST lint (~3s, Rust) — advisory; covers admin/app/storybook too
pnpm verify                               # CI gate — `turbo run verify` fans out to EVERY app (website: tsc+lint+format+contrast+react-doctor+test · workers: tsc+test · admin/mobile: tsc) + issue-tag/scripts/canary checks
pnpm verify:quick                         # tsc + lint — the commit hook + CI run this; rarely needed by hand
pnpm --filter @indiecrafts/web-surfaces-website shadscan   # shadcn/ui fundamentals audit — scores UX 0–100 (62 rules); --prompt for an AI fix-plan (a website script, not a root one)
pnpm docs                                 # the product-docs VitePress site (port 3002)
```

Pre-commit hook: `lint-staged` (eslint --fix + prettier on staged files) then `tsc`. No pre-push hook — CI is the backstop. Don't pre-run `tsc`/`lint` after every edit; the commit + CI are the gate, and the live **lint cards** + **`typescript-lsp` plugin** give the feedback continuously.

## Where things are

- **App — how to code** → [`code/projects/web/surfaces/website/.claude/CLAUDE.md`](code/projects/web/surfaces/website/.claude/CLAUDE.md) (architecture, i18n, SEO, blog, the full NEVERs, verification).
- **App — how to design** → [`code/packages/web/ui-tokens/DESIGN.md`](code/packages/web/ui-tokens/DESIGN.md) (token contract).
- **Product docs** → [`code/docs/`](code/docs/) (VitePress, `pnpm docs`).
- **History** → [root `CHANGELOG.md`](CHANGELOG.md) is the everything-view (release roll-up + links). Each area owns **one** log at its home altitude: the layers [`code/packages`](code/packages/CHANGELOG.md) · [`code/modules`](code/modules/CHANGELOG.md) · [`code/docs`](code/docs/CHANGELOG.md), **and every deployable/service** — each `code/projects/**` app (website · admin · app · storybook · mobile) + `code/shared/{api,cron,workers}` owns its own `CHANGELOG.md`. Log a change in **exactly one** area log (its home altitude), never copied; roll it up to root at release time.
