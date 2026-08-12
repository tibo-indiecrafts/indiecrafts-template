# Packages — shared bricks

Internal `@indiecrafts/<name>` TypeScript **bricks** shared by the app and the modules.
Single-purpose, **consumed as source** (no per-brick build) through pnpm workspace
symlinks + Next `transpilePackages`. Dependencies point **down** and never up:
`app → module → package`. A brick that imports an app is a design error.

**Seven bricks are live** — one page each below (exports · deps · consumers · gotchas). All
ship `version: 0.0.0`, `private: true`, `type: module`. The roster and reserved names live in
[`code/packages/_registry.md`](../../code/packages/_registry.md).

| Brick | What it holds | Consumers |
| --- | --- | --- |
| [`@indiecrafts/config`](./config.md) | site config DATA + types/helpers (`isLocale`, env, CSP, `localizedPathname`) | app + blog |
| [`@indiecrafts/utils`](./utils.md) | `cn` · logger · slugify · video-embed · consent-signals · format-date | app + blog |
| [`@indiecrafts/sanity`](./sanity.md) | Sanity infra — `client · live · env · token · structure` builders | app + blog |
| [`@indiecrafts/ui`](./ui.md) | 61 shadcn primitives + `use-mobile` (CLI-managed, docs colocated) | app + blog |
| [`@indiecrafts/ui-components`](./ui-components.md) | generic page-builder block renderers + `BLOCK_RENDERERS` registry | app + blog |
| [`@indiecrafts/ui-tokens`](./ui-tokens.md) | `globals.css` (OKLCH) · `typeset.css` · `DESIGN.md` — the design system | app |
| [`@indiecrafts/i18n`](./i18n.md) | shared next-intl navigation (`Link`) — modules use it (app keeps typed routing) | blog |

## How a brick is wired

1. **`package.json`** — `name` `@indiecrafts/<x>`, an `exports` map pointing at `./src/*`,
   and it declares its own npm deps (pnpm is strict — each brick lists what it imports).
2. **`next.config` `transpilePackages`** lists every `@indiecrafts/*` — Next compiles the
   TS/TSX source directly, no build step.
3. **Resolution — `exports` vs. tsconfig `paths`.** Single-extension packages resolve via
   their `exports` map + workspace symlinks. A **mixed `.ts`/`.tsx`** package needs a tsconfig
   `paths` entry to resolve — the app declares three: `@/*`, `@indiecrafts/blog/*`, and
   `@indiecrafts/ui-components/*`.
4. **Tailwind v4** scans code outside `node_modules` only via `@source` in
   `ui-tokens/globals.css` — one line per package that renders classes (`ui`, `ui-components`,
   the blog module, the app).
5. **Supply-chain hardening.** `pnpm-workspace.yaml` sets `minimumReleaseAge` +
   `trustPolicy`; a `pnpm add`/re-resolve needs the temp-relax dance (comment the guards,
   install, restore) — documented in `work/`.

## The ≥2-consumer rule

Extract a brick only at **≥2 consumers** (YAGNI). Today's bricks all clear it — the app and
the blog module both consume `config`/`utils`/`sanity`/`ui`/`i18n`/`ui-components`; `ui-tokens`
is app-only but is the design-system root. A brick depending on another brick is fine
(`utils`→`config`, `ui`→`utils`, `sanity`/`i18n`→`config`); a brick depending on an app is
the one thing that is not.

Reserved (names only — extract on ≥2 consumers): `schema · presets · auth · billing · data ·
notifications · media · search · ai · realtime · analytics · flags · moderation`. See
[`code/packages/_registry.md`](../../code/packages/_registry.md).

## Adding a brick (the repeatable shape)

A new brick lands in known places — see the checklist in
[`code/packages/CLAUDE.md`](../../code/packages/CLAUDE.md): a `code/packages/<name>/` dir, a
row in `_registry.md`, a `docs/packages/<name>.md` page (+ its sidebar line), and a line in
the [packages changelog](./changelog.md).

## Where this sits (the four-folder mirror)

`code/packages/<name>/` (build) ↔ `method/packages/` (how) ↔ `docs/packages/` (what — these
pages).

## Pointers

- [`method/packages/api-and-data.md`](../../method/packages/api-and-data.md) — how we build packages
- [`code/packages/CLAUDE.md`](../../code/packages/CLAUDE.md) — agent conventions
- [`code/packages/_registry.md`](../../code/packages/_registry.md) — the brick roster + rule
- [`DESIGN.md`](../../code/packages/ui-tokens/DESIGN.md) — the `ui-tokens` design contract
- [Packages changelog](./changelog.md) — the `code/packages/` area log
