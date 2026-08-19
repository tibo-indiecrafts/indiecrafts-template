# indiecrafts.dev — platform CLAUDE.md

Config-first, modular monorepo for client sites. This root file is **platform-level**:
the folder map, the always-true non-negotiables, and pointers. The web app's full
_how to code_ lives in **[`code/projects/web/surfaces/website/CLAUDE.md`](code/projects/web/surfaces/website/CLAUDE.md)** (auto-loads when you
touch files under `code/projects/web/surfaces/website/**`); design tokens in **[`code/packages/ui-tokens/DESIGN.md`](code/packages/ui-tokens/DESIGN.md)**.

**Stack:** Next.js 16 · React 19 · TypeScript strict · Tailwind v4 · shadcn/ui · Sanity v5 · next-intl v4 · pnpm 10 + Turborepo (Node 22). Config-first monorepo for marketing sites + a blog/page-builder.

**Top non-negotiables** (the app brief has the full list):

- Never commit `.env*` (only `.env.example`); never expose a non-public token under `NEXT_PUBLIC_`.
- Read from `@/config` — never hard-code brand strings, URLs, colors, or nav.
- Route via `@/i18n/routing` — never `next/link` / `next-intl/navigation`.
- User-facing strings live in `messages/<locale>.json` — never inline.
- Don't edit `src/user-interface/ui/**` (shadcn CLI) or depend on the library at runtime.
- `pnpm verify:quick` before opening a PR (no pre-push hook — the commit hook runs `tsc` + staged lint).

## Repo layout — the in-repo folders

`code/` (execution — including the `docs/` product-docs canon + the `storybook` gallery, now
projects under `code/projects/`) · `method/` (dev framework) · `work/` (sprint lab).
`method/` + `work/` are **tracked here but delivery-excluded**: `.gitattributes`
`export-ignore` keeps them out of every `git archive`, the a-la-carte CLI ships only
registry bricks, and `scripts/delivery-canary.mjs` (in `verify` + CI) fails if `work/`
ever reaches an export. **`work/` is private (real sprints/notes) — never deliver by
handing over a repo clone; deliver only by allowlist** (see
[`code/docs/shared/architecture/workspace.md`](code/docs/shared/architecture/workspace.md)).

- **`code/`** — EXECUTION: the pnpm + Turbo workspace. **`projects/`** holds the **per-platform** deployables, nested **platform → kind → leaf** (`code/projects/<platform>/<kind>/<name>`): `web/surfaces/{website,admin}` · `web/tools/storybook` · `mobile/surfaces/main` · `hybrid/surfaces/main` (`website` is live + the hub Studio; the rest are activated scaffolds). **`shared/`** is the **top-level cross-cutting tier** (a sibling of `projects/`) — everything shared across platforms: the `worker-cf` services (`api · cron · workers`) **and** the ops layer `db · infra · domains` + the concern-grouped **toolchain** with its five machine registries at `code/shared/scripts/lib/{apps,databases,infra-registry,domains}.mjs` (each carries its entity's `dir`; runners in `code/shared/scripts/{deploy,data,infra,checks,dev}/`). Per-platform sharing stays under its platform (`code/projects/<platform>/shared/…`). Then `packages/` (shared bricks), `modules/` (product features: blog/shop/events…), and the npm-isolated `docs/`. Roster → `code/projects/_registry.md`. **Infra co-locates** per stack (`<app.dir>/infra/<provider>/`); deploy + CI read the registries. Workspace root is the **repo root** (`package.json`, `pnpm-workspace.yaml`, `turbo.json`).
- **`code/docs/`** — CANON (product docs): a VitePress site at the top of `code/` (sibling of `projects/ packages/ modules/`), **foldered like the code**: `shared/`, `apps/web/` (`setup/ config/ design/ seo/ features/blog/`), and `modules/ packages/ db/ infra/` stubs. **npm-isolated** — matches no pnpm-workspace glob, so it stays out (own lockfile). Run via `pnpm docs` / `pnpm docs:build`.
- **`code/projects/web/tools/storybook/`** — the component gallery (Storybook), documenting the design-system bricks (`ui` · `ui-components` · `ui-tokens` + `announcement`/`locale-suggest` stories). A workspace member; static build. Run via `pnpm --filter @indiecrafts/storybook storybook`.

Run scripts from the repo root (`pnpm dev/build/…` → turbo → `@indiecrafts/website`).

> **Config split.** `.claude/` holds Claude Code **runtime** only — `agents/`, `skills/`, `settings.json` (must sit at the repo root; Claude Code magic-loads them). **App conventions are app-scoped:** [`code/projects/web/surfaces/website/CLAUDE.md`](code/projects/web/surfaces/website/CLAUDE.md) + [`code/packages/ui-tokens/DESIGN.md`](code/packages/ui-tokens/DESIGN.md) auto-load when you work under `code/projects/web/surfaces/website/**`. A new app lands under its platform + kind (`code/projects/<platform>/<kind>/<name>/`) with its own brief; this root stays the thin platform router.

## Working principles

Guardrails against common LLM coding mistakes — bias to caution over speed (use judgment on trivial tasks).

**1. Think before coding.** State assumptions; if uncertain, ask. Multiple interpretations → present them, don't pick silently. Simpler approach exists → say so, push back when warranted. Unclear → stop, name it, ask.

**2. Simplicity first.** Minimum code that solves the problem, nothing speculative — no unrequested features, abstractions, flexibility, or error handling for impossible cases. If 200 lines could be 50, rewrite.

**3. Surgical changes.** Touch only what the request needs; match existing style; don't "improve" adjacent code, comments, or formatting. Notice unrelated dead code → mention it, don't delete. Every changed line traces directly to the request.

**4. Goal-driven execution.** Turn tasks into verifiable goals (bug → failing repro, then fix; "add validation" → tests for bad input, then pass). Multi-step → brief plan + per-step verify, then loop until green.

## Commands

```bash
pnpm dev / build / tsc / lint / format    # standard (turbo → @indiecrafts/website)
pnpm verify                               # CI gate — `turbo run verify` fans out to EVERY app (website: tsc+lint+format+contrast+react-doctor+test · workers: tsc+test · admin/mobile/hybrid: tsc) + issue-tag/scripts/canary checks
pnpm verify:quick                         # tsc + lint (manual pre-PR check)
pnpm shadscan                             # shadcn/ui fundamentals audit — scores UX 0–100 (62 rules); --prompt for an AI fix-plan
pnpm docs                                 # the product-docs VitePress site (port 3002)
```

Pre-commit hook: `lint-staged` (eslint --fix + prettier on staged files) then `tsc`. No pre-push hook — CI is the backstop. Don't pre-run `tsc`/`lint` after every edit; the commit is the gate.

## Where things are

- **App — how to code** → [`code/projects/web/surfaces/website/CLAUDE.md`](code/projects/web/surfaces/website/CLAUDE.md) (architecture, i18n, SEO, blog, the full NEVERs, verification).
- **App — how to design** → [`code/packages/ui-tokens/DESIGN.md`](code/packages/ui-tokens/DESIGN.md) (token contract).
- **Product docs** → [`code/docs/`](code/docs/) (VitePress, `pnpm docs`).
- **History** → [root `CHANGELOG.md`](CHANGELOG.md) is the everything-view (release roll-up + links). Each area owns one log — app [`code/projects/web/surfaces/website/CHANGELOG.md`](code/projects/web/surfaces/website/CHANGELOG.md), packages [`code/packages/CHANGELOG.md`](code/packages/CHANGELOG.md), modules [`code/modules/CHANGELOG.md`](code/modules/CHANGELOG.md), [`code/docs/CHANGELOG.md`](code/docs/CHANGELOG.md). Log a change in **exactly one** area log (its home altitude), never copied; roll it up to root at release time.
