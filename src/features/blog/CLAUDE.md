# Blog feature — CLAUDE.md

Self-contained Sanity-backed blog + page-builder, gated by `features.blog` (public surface) and `features.studio` (editing). The Sanity infra it builds on → `src/sanity/CLAUDE.md`. Human docs → `docs/features/blog/`.

## Layout

- `user-interface/` — the blog's UI, organized by route like `src/user-interface/`: `blog/` (frontpage), `post/` (single post), `author/`, `category/`, `tag/` — each split into `sections/` (big views + blocks), `components/` (small: cards, TOC, badges), `layout/` (page shells, e.g. `post/layout/DefaultPostLayout`) as needed. Multi-page pieces live in `shared/` (`sections/PageHero`, `components/{BlogCard,Breadcrumbs,PlayBadge}`); `renderers/` holds the 14 page-builder module renderers.
- `sanity/` — `schema/` + `queries.ts` + `types.ts` + `structure.ts` (Studio desk) + `portable-to-markdown.ts`
- `lib/route-gate.ts` — `requireBlogRoute(page)` (page components) / `isBlogRouteEnabled(page)` (route handlers) / `isRssEnabled()`. Each folds in the flag **and** `page.enabled`, so a new route can't drift by checking only one.

## Schemas (`sanity/schema/`)

| Surface      | Documents                                               | Objects                                     |
| ------------ | ------------------------------------------------------- | ------------------------------------------- |
| Blog         | `blog` (singleton), `post`, `author`, `category`, `tag` | `blockContent`, `metadata`                  |
| Module refs  | `quote`, `person`                                       | `link`, `cta`                               |
| Page-builder | —                                                       | 14 `module.*` types (see `schema/modules/`) |

## Page-builder modules (14 `object` types, all gated)

- **Inline-embeddable in body + `postModules`** (8): accordion-list, callout, card-list, custom-html, person-list, quote-list, stat-list, step-list
- **`postModules`-only** (6): breadcrumbs, blog-index, blog-post-content, blog-post-list, prose, search

Inline allowlist → `sanity/schema/blockContent.ts` (`INLINE_MODULES`). Renderer → `user-interface/renderers/ModuleRenderer.tsx` (switch on `_type`, TS exhaustiveness enforces). **Adding** a module = schema + component + switch case; **removing** = drop from `INLINE_MODULES` **and** the renderer's `types` map in `portable-text-components.tsx`.

## Per-post layout + extras

- The `blog` singleton owns per-post chrome via `postModules[]`; empty ⇒ `DefaultPostLayout` (full-width hero, sticky TOC sidebar, "Keep reading" grid). The frontpage `/blog` is **never** module-driven — chrome stays uniform by design.
- `metadata.{title,description,image,slug,noIndex}` override the page `<head>`; `body` PortableText drives the TOC (`<Toc>`, h2/h3/h4 via GROQ `pt::text()`); `readTime` derived in GROQ; Article JSON-LD via `buildArticleSchema(...)`.
- `.md` export at `/<locale>/blog/<slug>/md`; RSS at `/blog/rss.xml` — both advertised via `<link rel="alternate">`.
- Queries use `defineQuery` (typegen-ready); `MODULES_FRAGMENT` expands every reference per module type.

## Studio

Embedded catch-all at `src/app/studio/[[...tool]]/page.tsx` with its own root layout (sits outside `[locale]/`, so needs its own `<html>`/`<body>`). The desk (`sanity/structure.ts`) groups Blog (singleton + posts/authors/categories) and References (quotes/people).

## Gating

**`features.blog`** (public): all routes via `route-gate` (`/blog`, `/blog/[slug]`, `/blog/category` + `/[slug]`, `/blog/tag` + `/[slug]`, `/author` + `/[slug]`, `/md`, `/rss.xml`) 404 when off; `pages.{blog,author,category,tag}.enabled` mirror it (sitemap + llms.txt drop entries); header `/blog` link; `<SanityLive>` mount; `generateStaticParams` → `[]` when off.

**`features.studio`** (editing): `/studio` and `/api/draft-mode/{enable,disable}` 404 when off.
