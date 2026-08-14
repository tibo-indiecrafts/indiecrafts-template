# code/modules — product features (gated)

Auto-loads when you work under `code/modules/**`. Vertical product slices (blog · shop ·
events · …) composed from `code/packages/` bricks and mounted by an app. `blog` is live;
`_registry.md` lists the rest. **How we build modules** →
the internal dev framework. **What they are** → `docs/modules/`.

**Stack:** TypeScript · React 19 · Sanity v5, consumed by an app via transpilePackages. Feature-flagged product slices.

## The pattern

- A module is a **vertical slice, feature-flagged**: its routes/UI/data live together and every public surface 404s + drops from sitemap/nav when its flag is off.
- **Live reference:** the blog — `code/modules/blog/` (`@indiecrafts/blog`; self-contained `user-interface/ sanity/ lib/` + a route-gate, consumed as source via the app's `transpilePackages`). Read it before extracting a module here.
- Compose from `packages/` bricks; a module may depend on packages + db, **never on an app** or another module directly.
- **Category · platform** (`content`/`growth`/…, web UI + server engine): a module declares its category in [`_registry.md`](../_registry.md); a native app adds `src/user-interface/native/` beside the web tree. Full convention → [`code/packages/.claude/CLAUDE.md` → Categorisation & platform](../packages/.claude/CLAUDE.md). Flat until the same fold-trigger as the bricks.

## When to extract a feature → `code/modules/<name>`

Extract at a **genuine vertical slice or ≥2 consumers** (the blog earned it). On extraction,
do all of these in the same change:

1. **Code** — `git mv` the slice; add `package.json` (`@indiecrafts/<name>`, `exports`) + the app's `transpilePackages` + a `tsconfig` `paths` entry (mixed `.ts`/`.tsx`) + a `@source` line in `ui-tokens/globals.css`; if it has Sanity content, export a **`SanityModule` barrel** at `src/sanity/index.ts` (schema + its desk section + create templates + i18n types) and add it to the `composeSanity([...])` array in `sanity.config.ts` — one line, not four hand-wired lists (see `@indiecrafts/sanity/module`).
2. **Registry** — a row in [`_registry.md`](../_registry.md).
3. **Its own `CLAUDE.md`** at the module root (module-level agent conventions).
4. **Docs** — a folder `docs/modules/<name>/` + its sidebar lines in `docs/.vitepress/config.mts`.
5. **Changelog** — log it in the **area** log [`code/modules/CHANGELOG.md`](../CHANGELOG.md) (the home altitude — modules do **not** get their own per-module changelog); rolls up to root at release.
