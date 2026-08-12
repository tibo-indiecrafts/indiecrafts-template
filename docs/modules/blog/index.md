# Blog module (`@indiecrafts/blog`)

The template's **live reference module** — a self-contained, feature-flagged vertical slice at `code/modules/blog/`, consumed by the app **as source** via Next `transpilePackages`. Everything the feature owns — UI, GROQ queries, Sanity schema, route-gating, `llms.txt` lines — lives under one folder. Flip `features.blog` off and every public surface 404s and drops from sitemap/nav.

## What it is

- **Package:** `@indiecrafts/blog` → `code/modules/blog/`. Source under `src/{sanity, user-interface, lib}`.
- **Exports:** `"./*": "./src/*"` — subpath wildcard, no extension in the map (Next + TS resolution fill in `.ts`/`.tsx`/dir index).
- **Deps point down:** it imports all five shared bricks (`@indiecrafts/config` · `utils` · `sanity` · `ui`) and uses `@indiecrafts/i18n` for navigation — the app keeps its own typed `@/i18n/routing`. The module **never** imports the app.

See [`docs/modules/`](../) for the general module contract and [`docs/packages/`](../../packages/) for the bricks it composes.

## How it's wired into the app

Six mechanisms, all in `code/apps/web/`:

| # | Mechanism | Where |
| --- | --- | --- |
| 1 | tsconfig path `"@indiecrafts/blog/*": ["../../modules/blog/src/*"]` (mixed `.ts`/`.tsx`) | `tsconfig.json` |
| 2 | `transpilePackages` lists `@indiecrafts/blog` (with every other brick) | `next.config.ts` |
| 3 | `@source "../../../modules/blog/src"` so Tailwind scans blog UI | `@indiecrafts/ui-tokens/globals.css` |
| 4 | Studio registers `schemaTypes` + `structure` from `@indiecrafts/blog/sanity/*` | `sanity.config.ts` |
| 5 | Route-gate `isBlogRouteEnabled` / `requireBlogRoute` / `isRssEnabled` | `@indiecrafts/blog/lib/route-gate` |
| 6 | Feature flags `features.blog` + `features.blogTaxonomy.{authors,categories,tags}`; draft preview gates on `features.studio` | `@indiecrafts/config` |

## Guides

| Guide | For | Covers |
| --- | --- | --- |
| [Sanity setup](./sanity-setup.md) | developer | project/dataset bring-up, schemas, routes, feature flag, QA matrix, troubleshooting |
| [Sanity tokens](./sanity-tokens.md) | developer | issuing/storing/rotating Viewer + Editor tokens, CORS, roles, security |
| [Editor guide](./editor-guide.md) | editor | writing a post in the Studio — the form, draft preview, publishing |
| [Body editor](./body-editor.md) | editor | the Portable Text body — inline modules and how they render |
| [Image gallery](./gallery.md) | editor/dev | the `module.gallery` page-builder block (Embla carousel) |
| [Blog architecture](./blog-architecture.md) | developer | routes, GROQ queries, renderer registry, component layout, the module system |

## Where the code lives

- **Feature source** → `code/modules/blog/src/` — `sanity/` (schema + queries + structure), `user-interface/` (renderers + per-surface sections), `lib/` (`route-gate.ts`, `llms.ts`). Start with the module's own `CLAUDE.md`.
- **App integration** → `code/apps/web/src/app/[locale]/{blog,author}/**` routes (including `blog/rss.xml`, `blog/atom.xml`, `blog/[slug]/md`), the home `FeaturedArticles`, `sitemap.ts`, `llms*.txt`, and `sanity.config.ts`.
