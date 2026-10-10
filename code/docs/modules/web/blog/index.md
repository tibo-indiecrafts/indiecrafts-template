---
title: "Blog module (@indiecrafts/modules-web-blog)"
description: "The template's live reference module — a self-contained, feature-flagged vertical slice at code/modules/web/blog/, consumed by the app as source via Next tra…"
status: stable
---

# Blog module (`@indiecrafts/modules-web-blog`)

The template's **live reference module** — a self-contained, feature-flagged vertical slice at `code/modules/web/blog/`, consumed by the app **as source** via Next `transpilePackages`. Everything the feature owns — UI, GROQ queries, Sanity schema, route-gating, `llms.txt` lines — lives under one folder. Flip `features.blog` off and every public surface 404s and drops from sitemap/nav.

## What it is

- **Package:** `@indiecrafts/modules-web-blog` → `code/modules/web/blog/`. Source under `src/{sanity, user-interface, lib}`.
- **Exports:** `"./*": "./src/*"` — subpath wildcard, no extension in the map (Next + TS resolution fill in `.ts`/`.tsx`/dir index).
- **Deps point down:** it imports all five shared bricks (`@indiecrafts/packages-shared-config` · `utils` · `sanity` · `ui`) and uses `@indiecrafts/packages-web-i18n` for navigation — the app keeps its own typed `@/i18n/routing`. The module **never** imports the app.

See [`docs/modules/`](/modules/README) for the general module contract and [`docs/packages/`](/packages/README) for the bricks it composes.

## How it's wired into the app

Six mechanisms, all in `code/projects/web/surfaces/website/`:

| #   | Mechanism                                                                                                                   | Where                                                                         |
| --- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1   | tsconfig path `"@indiecrafts/modules-web-blog/*": ["../../modules/web/blog/src/*"]` (mixed `.ts`/`.tsx`)                    | `tsconfig.json`                                                               |
| 2   | `transpilePackages` lists `@indiecrafts/modules-web-blog` (with every other brick)                                          | `next.config.ts`                                                              |
| 3   | `@source "../../../modules/web/blog/src"` so Tailwind scans blog UI                                                         | `@indiecrafts/packages-web-ui-tokens/globals.css`                             |
| 4   | Studio registers `schemaTypes` + `structure` from `@indiecrafts/modules-web-blog/sanity/*`                                  | `sanity.config.ts`                                                            |
| 5   | Route-gate `isBlogRouteEnabled` / `requireBlogRoute` / `isRssEnabled`                                                       | `@indiecrafts/modules-web-blog/lib/route-gate`                                |
| 6   | Feature flags `features.blog` + `features.blogTaxonomy.{authors,categories,tags}`; draft preview gates on `features.studio` | app-owned `features` (`@/config`), injected into the blog via `configureBlog` |

## Guides

| Guide                                                    | For        | Covers                                                                                    |
| -------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------- |
| [Sanity setup](/modules/web/blog/sanity-setup)           | developer  | project/dataset bring-up, schemas, routes, feature flag, QA matrix, troubleshooting       |
| [Sanity tokens](/modules/web/blog/sanity-tokens)         | developer  | issuing/storing/rotating Viewer + Editor tokens, CORS, roles, security                    |
| [Editor guide](/modules/web/blog/editor-guide)           | editor     | writing a post in the Studio — the form, draft preview, publishing, the sidebar           |
| [Body editor](/modules/web/blog/body-editor)             | editor     | the Portable Text body — inline modules and how they render                               |
| [Image gallery](/modules/web/blog/gallery)               | editor/dev | the `module.gallery` page-builder block (Embla carousel)                                  |
| [Blog architecture](/modules/web/blog/blog-architecture) | developer  | routes, GROQ queries, renderer registry, component layout, the module system, the sidebar |

## Where the code lives

- **Feature source** → `code/modules/web/blog/src/` — `sanity/` (schema + queries + structure), `user-interface/` (renderers + per-surface sections), `lib/` (`route-gate.ts`, `llms.ts`). Start with the module's own `CLAUDE.md`.
- **App integration** → `code/projects/web/surfaces/website/src/app/[locale]/{blog,author}/**` routes (including `blog/rss.xml`, `blog/atom.xml`, `blog/[slug]/md`), `sitemap.ts`, `llms*.txt`, and `sanity.config.ts`. The home page and every `page` can hold the blog blocks that promote the blog (`BLOG_SECTION_TYPES`); the home's « Articles à la une » strip is a `module.blog-featured` block. Every page type can show blog cards in its sidebar (`BLOG_SIDEBAR_TYPES`).
