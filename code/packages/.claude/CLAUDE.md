# code/packages — shared bricks

Auto-loads when you work under `code/packages/**`. Internal TypeScript packages shared
by apps + modules. Seven live — `config · utils · sanity · ui · ui-tokens · i18n · ui-components`;
`_registry.md` lists the reserved bricks (schema · auth · billing · data · …).
**How we build packages** → `method/packages/api-and-data.md`. **What they are** →
`docs/packages/`.

## When to extract a brick

- Only at **≥2 consumers** — one consumer means it stays where it lives (YAGNI). The `_registry.md` names the reserved bricks; don't pre-create empty ones.

## Conventions

- Name `@indiecrafts/<brick>`; ship a typed `exports` map; source stays TS (apps consume via Next `transpilePackages` — no build step per brick until needed).
- **A package NEVER imports an app** — dependencies point down (app → module → package → db), never up or sideways between apps.
- Keep each brick single-purpose; a brick that needs another brick is fine, a brick that needs an app is a design error.

## Adding a brick (the repeatable shape)

A new brick lands in known places — do all five in the same change:

1. **Code** — `code/packages/<name>/` (`package.json` `@indiecrafts/<name>` + `exports`; declare its own deps). Mixed `.ts`/`.tsx` also needs an app `tsconfig` `paths` entry; anything rendering classes needs a `@source` line in `ui-tokens/globals.css`.
2. **Registry** — a row in [`_registry.md`](../_registry.md).
3. **Doc** — one page `docs/packages/<name>.md` (exports · deps · consumers · gotchas), split from the shape of the others.
4. **Sidebar** — one line under the Packages group in `docs/.vitepress/config.mts`.
5. **Changelog** — log it in this area's `CHANGELOG.md` (the `code/packages/` home altitude); rolls up to root at release.
