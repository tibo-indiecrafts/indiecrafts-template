# Blog feature — CLAUDE.md

Self-contained Sanity-backed blog + page-builder, gated by `features.blog` (public surface) and `features.studio` (editing). The Sanity infra it builds on → `src/sanity/CLAUDE.md`. Human docs → `docs/apps/web/features/blog/`.

**Stack:** Sanity v5 (GROQ · PortableText) · Next.js 16 · React 19 · TypeScript · Tailwind v4. Self-contained blog + page-builder.

## Layout

- `user-interface/` — the blog's UI, organized by route like `src/user-interface/`: `blog/` (frontpage), `post/` (single post), `author/`, `category/`, `tag/` — each split into `sections/` (big views + blocks), `components/` (small: cards, TOC, badges), `layout/` (page shells, e.g. `post/layout/DefaultPostLayout`) as needed. Multi-page pieces live in `shared/` (`sections/PageHero`, `components/{BlogCard,Breadcrumbs}`); the shared **`FeaturedMedia`** in `@indiecrafts/ui-components` (`renderers/`) renders a cover **image or inline-playable video** in one structure (no dialog — plays in place), used by the post hero, blog frontpage, and every card — `parseVideoEmbed` (from `@indiecrafts/utils`) resolves `metadata.videoUrl` inside it. `renderers/` holds the 3 blog-specific module renderers (`blog-index · blog-post-list · blog-post-content`) + `ModuleRenderer` (composes `BLOCK_RENDERERS` from `@indiecrafts/ui-components` with the 3 blog dispatchers); the 14 generic renderers live in `@indiecrafts/ui-components`.
- `sanity/` — `schema/` + `queries.ts` + `types.ts` + `structure.ts` (Studio desk) + `portable-to-markdown.ts`
- `lib/route-gate.ts` — `requireBlogRoute(page)` (page components) / `isBlogRouteEnabled(page)` (route handlers) / `isRssEnabled()`. Each folds in the flag **and** `page.enabled`, so a new route can't drift by checking only one.

## Schemas (`sanity/schema/`)

| Surface      | Documents                                               | Objects                                     |
| ------------ | ------------------------------------------------------- | ------------------------------------------- |
| Blog         | `blog` (singleton), `post`, `author`, `category`, `tag`, `series` | `blockContent`, `metadata`         |
| Module refs  | `quote`, `person`                                       | `link`, `cta`                               |
| Page-builder | —                                                       | 17 `module.*` types (see `schema/modules/`) |

## Page-builder modules (14 `object` types, all gated)

- **Inline-embeddable in body + `postModules`** (10): accordion-list, callout, card-list, custom-html, gallery, newsletter, person-list, quote-list, stat-list, step-list
- **`postModules`-only** (4): blog-index, blog-post-content, blog-post-list, prose

Inline allowlist → `sanity/schema/blockContent.ts` (`INLINE_MODULES`). Renderer → `user-interface/renderers/ModuleRenderer.tsx` (switch on `_type`, TS exhaustiveness enforces). **Adding or removing a module touches ~8 code locations + 4 doc count-refs** — follow the internal add/remove-block workflow checklist, don't reconstruct it. The touch-points, in dependency order, are also listed in [`docs/modules/blog/blog-architecture.md`](../../../../docs/modules/blog/blog-architecture.md).

Field **legends** (every `title` + `description` an editor sees) are written for non-technical editors — plain words, no jargon. Follow [`.claude/rules/sanity-legends.md`](../../../apps/web/.claude/rules/sanity-legends.md).

## Per-post layout + extras

- The `blog` singleton owns per-post chrome via `postModules[]`; empty ⇒ `DefaultPostLayout` (full-width hero, sticky TOC sidebar, "Keep reading" grid). The frontpage `/blog` is **never** module-driven — chrome stays uniform by design.
- `metadata.{title,description,image,slug,noIndex}` override the page `<head>`; `body` PortableText drives the TOC (`<Toc>`, h2/h3/h4 via GROQ `pt::text()`); `readTime` derived in GROQ; Article JSON-LD via `buildArticleSchema(...)`.
- `.md` export at `/<locale>/blog/<slug>/md`; RSS at `/blog/rss.xml` — both advertised via `<link rel="alternate">`.
- Queries use `defineQuery` (typegen-ready); `MODULES_FRAGMENT` expands every reference per module type.

## Studio

Embedded catch-all at `src/app/studio/[[...tool]]/page.tsx` with its own root layout (sits outside `[locale]/`, so needs its own `<html>`/`<body>`). The desk (`sanity/structure.ts`) groups Blog (singleton + posts/authors/categories/tags/series), two top-level reference domains **Témoignages** (`quote`) + **Équipe** (`person`) — promoted from the old nested "Références" (temp-sanity §7; generalize to `testimonial`/`team` in Pack 1), Commentaires, and the core **SEO & métadonnées** section (`seoStructureItem` from `@/sanity/structure` — `siteSettings` + `siteMeta.<locale>`).

## Gating

**`features.blog`** (public): all routes via `route-gate` (`/blog`, `/blog/[slug]`, `/blog/category` + `/[slug]`, `/blog/tag` + `/[slug]`, `/author` + `/[slug]`, `/md`, `/rss.xml`, `/search`) 404 when off; `pages.{blog,author,category,tag}.enabled` mirror it (sitemap + llms.txt drop entries); header `/blog` link; `<SanityLive>` mount; `generateStaticParams` → `[]` when off.

**Sub-flags** (all require `blog`): `blogTaxonomy.{authors,categories,tags}` (per-taxonomy, + editor `blog.display.taxonomy.*`), `blogComments` (`isCommentsEnabled`), `rss` (`isRssEnabled`), `blogSearch` (`isSearchEnabled` — the `/blog/search` route + the frontpage search box), `blogSeries` (`isSeriesEnabled` — the `/blog/series/<slug>` route + the on-post "Part N of M" nav).

**`features.studio`** (editing): `/studio` and `/api/draft-mode/{enable,disable}` 404 when off.
