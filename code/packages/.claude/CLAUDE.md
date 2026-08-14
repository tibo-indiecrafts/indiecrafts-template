# code/packages — shared bricks

Auto-loads when you work under `code/packages/**`. Internal TypeScript packages shared
by apps + modules. Eight live — `config · utils · sanity · schema · ui · ui-tokens · i18n · ui-components`;
`_registry.md` lists the reserved bricks (schema · auth · billing · data · …).
**How we build packages** → the internal dev framework. **What they are** →
`docs/packages/`.

**Stack:** TypeScript source packages (no per-brick build; consumed via transpilePackages), shared by apps + modules.

## When to extract a brick

- Only at **≥2 consumers** — one consumer means it stays where it lives (YAGNI). The `_registry.md` names the reserved bricks; don't pre-create empty ones.

## Conventions

- Name `@indiecrafts/<brick>`; ship a typed `exports` map; source stays TS (apps consume via Next `transpilePackages` — no build step per brick until needed).
- **A package NEVER imports an app** — dependencies point down (app → module → package → db), never up or sideways between apps.
- Keep each brick single-purpose; a brick that needs another brick is fine, a brick that needs an app is a design error.

## Categorisation & platform

The repo will host more apps and platforms. Two axes govern where a brick lives — both are
**decided now, foldered later**, so the roster stays flat while it is still scannable.

**Category** — what a brick _is_. Recorded in [`_registry.md`](../_registry.md); a new brick
declares one on extraction.

- **foundation** — the base every layer builds on: `config · utils · i18n · schema · sanity`.
- **design-system** — the presentation layer: `ui · ui-tokens · ui-components · storybook`.
- **domain** — cross-cutting product capabilities: `consent · email · system-pages` (+ reserved
  `auth · billing · notifications · media · …`).

**Platform** — what runtime a brick's code _targets_: `agnostic` (pure TS/data), `web` (DOM +
Tailwind), `server`, or `tooling`. Most bricks are `agnostic` or `web`.

**Platform is never a top-level folder.** Splitting `packages/web` vs `packages/native` would
fracture the shared bricks (config/utils/schema/… target no platform). Instead:

- **Split _inside_ the package** that has per-platform implementations — the UI model:
  `src/web/<domain>/` beside `src/native/` (a README, **reserved, not an empty scaffold**) and a
  `src/shared/` for the platform-agnostic contract (types, variant maps). `ui`, `ui-components`, and
  `ui-tokens` all follow this; a module splits `src/user-interface/web|native/` the same way.
- **A new-platform design system stays _inside_ its brick** — `@indiecrafts/ui/native/*`,
  `@indiecrafts/ui-components/native/*` — not a separate `ui-native` package. The token _values_
  (`ui-tokens`) and the `shared/` contracts stay one home; only the components fork per platform.
  Spawn a sibling brick only if a platform needs a genuinely separate dependency graph.

**Fold the flat roster into `packages/<category>/<brick>/`** when — and only when — a trigger fires:

1. the roster passes **~18 bricks** (flat stops scanning), or
2. **app #2 targets a new platform** (native/api/workers) — the day the category + platform split
   earns its keep.

The fold is mechanical and low-risk: a package's **name** is path-independent (pnpm resolves by
name, `transpilePackages` matches by name), so only `pnpm-workspace.yaml` globs, tsconfig `paths`
(relative), the `@source` lines in `ui-tokens/globals.css`, and doc links change — **no import
specifier moves.** `code/modules/` follows the identical rule (`modules/<category>/<module>/`).

## Adding a brick (the repeatable shape)

A new brick lands in known places — do all five in the same change:

1. **Code** — `code/packages/<name>/` (`package.json` `@indiecrafts/<name>` + `exports`; declare its own deps). Mixed `.ts`/`.tsx` also needs an app `tsconfig` `paths` entry; anything rendering classes needs a `@source` line in `ui-tokens/globals.css`.
2. **Registry** — a row in [`_registry.md`](../_registry.md).
3. **Doc** — one page `docs/packages/<name>.md` (exports · deps · consumers · gotchas), split from the shape of the others.
4. **Sidebar** — one line under the Packages group in `docs/.vitepress/config.mts`.
5. **Changelog** — log it in this area's `CHANGELOG.md` (the `code/packages/` home altitude); rolls up to root at release.
