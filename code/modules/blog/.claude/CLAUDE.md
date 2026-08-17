# @indiecrafts/blog — self-contained blog + page-builder

Auto-loads under `code/modules/blog/**`. Self-contained Sanity-backed blog + page-builder, gated by `features.blog` (public surface) and `features.studio` (editing) — both app-owned, injected into the module via `configureBlog` (`lib/config.ts`). Builds on the shared Sanity infra `@indiecrafts/sanity` (`docs/packages/sanity.md`). Human docs → `docs/apps/web/features/blog/`.

**Stack:** Sanity v5 (GROQ · PortableText) · Next.js 16 · React 19 · TypeScript · Tailwind v4. Self-contained blog + page-builder.

## Layout

- `user-interface/` — the blog's UI, organized by route like `src/user-interface/`: `blog/` (frontpage), `post/` (single post), `author/`, `category/`, `tag/` — each split into `sections/` (big views + blocks), `components/` (small: cards, TOC, badges), `layout/` (page shells, e.g. `post/layout/DefaultPostLayout`) as needed. Multi-page pieces live in `shared/` (`sections/PageHero`, `components/{BlogCard,Breadcrumbs}`); the shared **`FeaturedMedia`** in `@indiecrafts/ui-components` (`renderers/`) renders a cover **image or inline-playable video** in one structure (no dialog — plays in place), used by the post hero, blog frontpage, and every card — `parseVideoEmbed` (from `@indiecrafts/utils`) resolves `metadata.videoUrl` inside it. `renderers/` holds the 3 blog-specific module renderers (`blog-index · blog-post-list · blog-post-content`) + `ModuleRenderer` (composes `BLOCK_RENDERERS` from `@indiecrafts/ui-components` with the 3 blog dispatchers); the 16 generic renderers live in `@indiecrafts/ui-components`.
- `sanity/` — `schema/` + `queries.ts` + `types.ts` + `structure.ts` (Studio desk) + `portable-to-markdown.ts`
- `lib/route-gate.ts` — `requireBlogRoute(page)` (page components) / `isBlogRouteEnabled(page)` (route handlers) / `isRssEnabled()`. Each folds in the flag **and** `page.enabled`, so a new route can't drift by checking only one.

## Schemas (`sanity/schema/`)

The generic page-builder (16 blocks + `blockContent`/`link`/`cta` + `quote`/`person`) now lives in
**`@indiecrafts/page-builder`**. The blog owns only its own docs + its 3 blog-specific blocks.

| Surface      | Documents                                                         | Objects      |
| ------------ | ----------------------------------------------------------------- | ------------ |
| Blog         | `blog` (singleton), `post`, `author`, `category`, `tag`, `series` | `metadata`   |
| Page-builder | 3 blog-specific `module.*` (see `schema/modules/`)                | —            |

## Page-builder modules

- **The 16 generic blocks** (hero · feature-grid · pricing · callout · card-list · gallery ·
  person-list · prose · stat-list · step-list · quote-list · accordion-list · custom-html ·
  newsletter · waitlist · lead-magnet) — schemas in `@indiecrafts/page-builder`, renderers in
  `@indiecrafts/ui-components`. Adding one → `method/apps/web/workflows/add-page-builder-block.md`.
- **3 blog-specific** (`postModules`-only): `blog-index`, `blog-post-content`, `blog-post-list` —
  schema + renderer here, composed by `user-interface/renderers/ModuleRenderer.tsx` on top of the
  generic `BLOCK_RENDERERS`.

The blog composes the generic `MODULES_FRAGMENT` (`@indiecrafts/page-builder`) + its own
`blog-post-list` projection in `sanity/queries.ts`.

Field **legends** (every `title` + `description` an editor sees) are written for non-technical editors — plain words, no jargon. Follow [`.claude/rules/sanity-legends.md`](../../../apps/web/.claude/rules/sanity-legends.md).

## Per-post layout + extras

- The `blog` singleton owns per-post chrome via `postModules[]`; empty ⇒ `DefaultPostLayout` (full-width hero, sticky TOC sidebar, "Keep reading" grid). The frontpage `/blog` is **never** module-driven — chrome stays uniform by design.
- `metadata.{title,description,image,slug,noIndex}` override the page `<head>`; `body` PortableText drives the TOC (`<Toc>`, h2/h3/h4 via GROQ `pt::text()`); `readTime` derived in GROQ; Article JSON-LD via `buildArticleSchema(...)`.
- `.md` export at `/<locale>/blog/<slug>/md`; RSS at `/blog/rss.xml` — both advertised via `<link rel="alternate">`.
- Queries use `defineQuery` (typegen-ready); `MODULES_FRAGMENT` expands every reference per module type.

## Studio

Embedded catch-all at `src/app/studio/[[...tool]]/page.tsx` with its own root layout (sits outside `[locale]/`, so needs its own `<html>`/`<body>`). The desk (`sanity/structure.ts`) groups Blog (singleton + posts/authors/categories/tags/series), two top-level reference domains **Témoignages** (`quote`) + **Équipe** (`person`) — now owned by `@indiecrafts/page-builder` (the generic entities its blocks reference; a future release generalizes them to `testimonial`/`team`), Commentaires, and the core **SEO & métadonnées** section (`seoStructureItem` from `@/sanity/structure` — `siteSettings` + `siteMeta.<locale>`).

## Gating

**`features.blog`** (public): all routes via `route-gate` (`/blog`, `/blog/[slug]`, `/blog/category` + `/[slug]`, `/blog/tag` + `/[slug]`, `/author` + `/[slug]`, `/md`, `/rss.xml`, `/search`) 404 when off; `pages.{blog,author,category,tag}.enabled` mirror it (sitemap + llms.txt drop entries); header `/blog` link; `<SanityLive>` mount; `generateStaticParams` → `[]` when off.

**Sub-flags** (all require `blog`): `blogTaxonomy.{authors,categories,tags}` (per-taxonomy, + editor `blog.display.taxonomy.*`), `blogComments` (`isCommentsEnabled`), `rss` (`isRssEnabled`), `blogSearch` (`isSearchEnabled` — the `/blog/search` route + the frontpage search box), `blogSeries` (`isSeriesEnabled` — the `/blog/series/<slug>` route + the on-post "Part N of M" nav).

**`features.studio`** (editing): `/studio` and `/api/draft-mode/{enable,disable}` 404 when off.
