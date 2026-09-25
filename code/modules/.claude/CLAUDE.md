# code/modules — product features (gated)

Auto-loads when you work under `code/modules/**`. Vertical product slices (blog · shop ·
events · …) composed from `code/packages/` bricks and mounted by an app, **foldered by
platform-scope** — `code/modules/<scope>/<module>/` (scope = `shared · web · mobile`,
= where the feature renders). The 4 live modules are in `web/` (blog · contact · newsletter · waitlist); `shared/`/`mobile/`
are reserved README markers. `_registry.md` lists the roster + the rest. **How we build
modules** → the internal dev framework. **What they are** → `code/docs/modules/`.

**Stack:** TypeScript · React 19 · Sanity v6, consumed by an app via transpilePackages. Feature-flagged product slices.

## The pattern

- A module is a **vertical slice, feature-flagged**: its routes/UI/data live together and every public surface 404s + drops from sitemap/nav when its flag is off.
- **Live reference:** the blog — `code/modules/web/blog/` (`@indiecrafts/modules-web-blog`; self-contained `user-interface/ sanity/ lib/` + a route-gate, consumed as source via the app's `transpilePackages`). Read it before extracting a module here.
- Compose from `packages/` bricks; a module may depend on packages + db, **never on an app** or another module directly.
- **Scope · category** — **scope is the folder** (`web` where it renders today; `shared` when the same feature ships on ≥2 platforms; `mobile` when that-platform-only), **category is a tag** (`content`/`growth`/…). A native app adds `src/user-interface/native/` beside the web tree and the module moves to `modules/shared/`. Full convention → [`code/packages/.claude/CLAUDE.md` → Categorisation & platform](../../packages/.claude/CLAUDE.md).

## When to extract a feature → `code/modules/<scope>/<name>`

Extract at a **genuine vertical slice or ≥2 consumers** (the blog earned it). On extraction,
do all of these in the same change:

1. **Code** — `git mv` the slice into `code/modules/<scope>/<name>/` (scope = where it renders: `web` today); add `package.json` (`@indiecrafts/modules-<scope>-<name>` — the folder tail, e.g. `modules-web-blog`, `exports`) + the app's `transpilePackages` + a `workspace:*` dep + a `tsconfig` `paths` entry (if it has a **wildcard subpath export** `"./*"`) + a `@source` line in `shared/ui-tokens/globals.css` (if it renders classes); if it has Sanity content, export a **`SanityModule` barrel** (or a `xSanity(enabled)` factory) at `src/sanity/index.ts` (schema + its desk section + create templates + i18n types) and add it to a `composeStudio([...])` group (`appModules`) in `sanity.config.ts` — one line, not four hand-wired lists (see `@indiecrafts/packages-web-sanity/module`).
2. **Registry** — a row in [`_registry.md`](../_registry.md).
3. **Its own `CLAUDE.md`** at the module root (module-level agent conventions).
4. **Docs** — a folder `code/docs/modules/<name>/` + its sidebar lines in `code/docs/.vitepress/config.mts`.
5. **Changelog** — log it in the **area** log [`code/modules/CHANGELOG.md`](../CHANGELOG.md) (the home altitude — modules do **not** get their own per-module changelog); rolls up to root at release.
