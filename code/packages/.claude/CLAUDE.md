# code/packages — shared bricks

Auto-loads when you work under `code/packages/**`. Internal TypeScript packages shared
by apps + modules, **foldered by platform-scope** — `code/packages/<scope>/<brick>/`
(scope = `shared · web · mobile · hybrid`). 19 live: 12 in `shared/`, 7 in `web/`;
`mobile/`/`hybrid/` are reserved README markers. `_registry.md` lists the roster + the
reserved bricks (auth · billing · data · …).
**How we build packages** → the internal dev framework. **What they are** →
`code/docs/packages/`.

**Stack:** TypeScript source packages (no per-brick build; consumed via transpilePackages), shared by apps + modules.

## When to extract a brick

- Only at **≥2 consumers** — one consumer means it stays where it lives (YAGNI). The `_registry.md` names the reserved bricks; don't pre-create empty ones.

## Conventions

- Name `@indiecrafts/<brick>`; ship a typed `exports` map; source stays TS (apps consume via Next `transpilePackages` — no build step per brick until needed).
- **A package NEVER imports an app** — dependencies point down (app → module → package → db), never up or sideways between apps.
- Keep each brick single-purpose; a brick that needs another brick is fine, a brick that needs an app is a design error.

## Categorisation & platform

Two axes govern where a brick lives. **Scope is the folder; category is a tag.**

**Scope** — which platforms a brick runs on — **is the top-level folder**, the same
`shared · web · mobile · hybrid` set as `code/shared` ↔ `code/projects/<platform>`:

- **`shared/`** — cross-platform: `agnostic` (pure TS/data), `server-side` (used by every backend),
  or a cross-platform contract. A brick that runs on ≥2 platforms lives here.
- **`web/`** — web-client-only (DOM + Tailwind + Next).
- **`mobile/`** · **`hybrid/`** — reserved README markers (Expo / Electron bricks).

**A brick lives at the highest scope it runs on** — `shared/` if it works on ≥2 platforms, else its
single client platform. `sanity`/`email`/`security` are server-side but serve every platform's
backend, so they are `shared/`, **not** a `server/` folder (server-only is a tag, never a folder).

**Category** — what a brick _is_ (a tag, not a folder). Recorded in
[`_registry.md`](../_registry.md); a new brick declares one on extraction.

- **foundation** — the base every layer builds on: `config · utils · i18n · schema · sanity`.
- **design-system** — the presentation layer: `ui · ui-tokens · ui-components · storybook`.
- **domain** — cross-cutting product capabilities: `compliance · email · system-pages` (+ reserved
  `auth · billing · notifications · media · …`).

**Multi-platform inside a brick.** A design brick with per-platform implementations (web shadcn vs
native RN) splits _inside_ itself — `src/web/<domain>/` beside `src/native/` (a README, **reserved,
not an empty scaffold**) + a `src/shared/` for the platform-agnostic contract. `ui`/`ui-components`
are `web/` today (shadcn is DOM); when the native design system is real, either activate their
`src/native/` and promote the brick to `packages/shared/`, or spawn a sibling (`ui-native`) once the
dependency graphs diverge. The token _values_ (`ui-tokens`) already live in `shared/`; only the
components fork per platform.

**Moving a brick between scopes** (e.g. `web/ui` → `shared/ui`) is mechanical and low-risk: a
package's **name** is path-independent (pnpm resolves by name, `transpilePackages` matches by name),
so only `pnpm-workspace.yaml` globs, tsconfig `paths` (relative), the `@source` lines in
`shared/ui-tokens/globals.css`, and doc links change — **no import specifier moves.** `code/modules/`
follows the identical rule (`modules/<scope>/<module>/`).

## Adding a brick (the repeatable shape)

A new brick lands in known places — do all five in the same change:

1. **Code** — `code/packages/<scope>/<name>/` (scope = the highest platform it runs on: `shared` if ≥2 platforms, else `web`/`mobile`/`hybrid`) — `package.json` `@indiecrafts/<name>` + `exports`; declare its own deps. **To consume it in an app, five wires** (only the applicable ones): (a) add it to `transpilePackages` in the app `next.config.ts` — **always** (consumed as TS source); (b) a `workspace:*` dep in the app `package.json` — **always**; (c) a `tsconfig` `paths` entry **iff it has a wildcard subpath export** (`"./*"` / `"./web/*"`, which tsc + the Sanity schema-extract can't map to a 1:1 extension) — packages with explicit per-file exports (e.g. `version`) skip it; (d) a `@source` line in `ui-tokens/globals.css` **iff it renders Tailwind classes**; (e) its `SanityModule` barrel into a `composeStudio` group in `sanity.config.ts` **iff it ships Sanity content**. A pure-logic brick needs only (a)+(b); a UI+Sanity brick needs all five.
2. **Registry** — a row in [`_registry.md`](../_registry.md).
3. **Doc** — one page `code/docs/packages/<name>.md` (exports · deps · consumers · gotchas), split from the shape of the others.
4. **Sidebar** — one line under the Packages group in `code/docs/.vitepress/config.mts`.
5. **Changelog** — log it in this area's `CHANGELOG.md` (the `code/packages/` home altitude); rolls up to root at release.
