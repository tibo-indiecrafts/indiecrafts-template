# indiecrafts.dev — platform CLAUDE.md

Config-first, modular monorepo for client sites. This root file is **platform-level**:
the folder map, the always-true non-negotiables, and pointers. The web app's full
_how to code_ lives in **[`code/projects/web/CLAUDE.md`](code/projects/web/CLAUDE.md)** (auto-loads when you
touch files under `code/projects/web/**`); design tokens in **[`code/packages/ui-tokens/DESIGN.md`](code/packages/ui-tokens/DESIGN.md)**.

**Stack:** Next.js 16 · React 19 · TypeScript strict · Tailwind v4 · shadcn/ui · Sanity v5 · next-intl v4 · pnpm 10 + Turborepo (Node 22). Config-first monorepo for marketing sites + a blog/page-builder.

**Top non-negotiables** (the app brief has the full list):

- Never commit `.env*` (only `.env.example`); never expose a non-public token under `NEXT_PUBLIC_`.
- Read from `@/config` — never hard-code brand strings, URLs, colors, or nav.
- Route via `@/i18n/routing` — never `next/link` / `next-intl/navigation`.
- User-facing strings live in `messages/<locale>.json` — never inline.
- Don't edit `src/user-interface/ui/**` (shadcn CLI) or depend on the library at runtime.
- `pnpm verify:quick` before opening a PR (no pre-push hook — the commit hook runs `tsc` + staged lint).

## Repo layout — the in-repo folders

`code/` (execution) · `docs/` (canon) · `method/` (dev framework) · `work/` (sprint lab).
`method/` + `work/` are **tracked here but delivery-excluded**: `.gitattributes`
`export-ignore` keeps them out of every `git archive`, the a-la-carte CLI ships only
registry bricks, and `scripts/delivery-canary.mjs` (in `verify` + CI) fails if `work/`
ever reaches an export. **`work/` is private (real sprints/notes) — never deliver by
handing over a repo clone; deliver only by allowlist** (see
[`docs/apps/web/setup/workspace.md`](docs/apps/web/setup/workspace.md)).

- **`code/`** — EXECUTION: the pnpm + Turbo workspace. `apps/web` (the Next app `@indiecrafts/web`; scaffolded slots for marketing · admin · mobile · hybrid · api · workers — see `code/projects/_registry.md`), `packages/` (shared bricks), `modules/` (product features: blog/shop/events…), `db/`, `infra/`. Workspace root is the **repo root** (`package.json`, `pnpm-workspace.yaml`, `turbo.json`).
- **`docs/`** — CANON (product docs): a standalone VitePress site, **foldered like the code**: `shared/`, `apps/web/` (`setup/ config/ design/ seo/ features/blog/`), and `modules/ packages/ db/ infra/` stubs. Root sibling; npm-isolated from the pnpm workspace.

Run scripts from the repo root (`pnpm dev/build/…` → turbo → `@indiecrafts/web`).

> **Config split.** `.claude/` holds Claude Code **runtime** only — `agents/`, `skills/`, `settings.json` (must sit at the repo root; Claude Code magic-loads them). **App conventions are app-scoped:** [`code/projects/web/CLAUDE.md`](code/projects/web/CLAUDE.md) + [`code/packages/ui-tokens/DESIGN.md`](code/packages/ui-tokens/DESIGN.md) auto-load when you work under `code/projects/web/**`. A 2nd app lands as `code/projects/<app>/` with its own brief; this root stays the thin platform router.

## Working principles

Guardrails against common LLM coding mistakes — bias to caution over speed (use judgment on trivial tasks).

**1. Think before coding.** State assumptions; if uncertain, ask. Multiple interpretations → present them, don't pick silently. Simpler approach exists → say so, push back when warranted. Unclear → stop, name it, ask.

**2. Simplicity first.** Minimum code that solves the problem, nothing speculative — no unrequested features, abstractions, flexibility, or error handling for impossible cases. If 200 lines could be 50, rewrite.

**3. Surgical changes.** Touch only what the request needs; match existing style; don't "improve" adjacent code, comments, or formatting. Notice unrelated dead code → mention it, don't delete. Every changed line traces directly to the request.

**4. Goal-driven execution.** Turn tasks into verifiable goals (bug → failing repro, then fix; "add validation" → tests for bad input, then pass). Multi-step → brief plan + per-step verify, then loop until green.

## Commands

```bash
pnpm dev / build / tsc / lint / format    # standard (turbo → @indiecrafts/web)
pnpm verify                               # CI gate (tsc + lint + format + contrast + react-doctor + issue-tag check)
pnpm verify:quick                         # tsc + lint (manual pre-PR check)
pnpm shadscan                             # shadcn/ui fundamentals audit — scores UX 0–100 (62 rules); --prompt for an AI fix-plan
pnpm docs                                 # the product-docs VitePress site (port 3002)
```

Pre-commit hook: `lint-staged` (eslint --fix + prettier on staged files) then `tsc`. No pre-push hook — CI is the backstop. Don't pre-run `tsc`/`lint` after every edit; the commit is the gate.

## Where things are

- **App — how to code** → [`code/projects/web/CLAUDE.md`](code/projects/web/CLAUDE.md) (architecture, i18n, SEO, blog, the full NEVERs, verification).
- **App — how to design** → [`code/packages/ui-tokens/DESIGN.md`](code/packages/ui-tokens/DESIGN.md) (token contract).
- **Product docs** → [`docs/`](docs/) (VitePress, `pnpm docs`).
- **History** → [root `CHANGELOG.md`](CHANGELOG.md) is the everything-view (release roll-up + links). Each area owns one log — app [`code/projects/web/CHANGELOG.md`](code/projects/web/CHANGELOG.md), packages [`code/packages/CHANGELOG.md`](code/packages/CHANGELOG.md), modules [`code/modules/CHANGELOG.md`](code/modules/CHANGELOG.md), [`docs/CHANGELOG.md`](docs/CHANGELOG.md). Log a change in **exactly one** area log (its home altitude), never copied; roll it up to root at release time.
