# `@indiecrafts/modules-web-blog` — self-contained blog + page-builder

Auto-loads under `code/modules/web/blog/**`. Self-contained Sanity-backed blog + page-builder, gated by `features.blog` (public surface) and `features.studio` (editing) — both app-owned, injected into the module via `configureBlog` (`lib/config.ts`). Builds on the shared Sanity infra `@indiecrafts/packages-web-sanity` (`code/docs/packages/sanity.md`). Human docs → `code/docs/modules/web/blog/`.

**Host message contract** — the module renders chrome copy from the **app's** `messages/<locale>.json`, so a host app MUST provide the `pages.blog.*` namespace (~24 keys incl. `series.*`, `minRead`, `onThisPage`, `related`, `by`, …), the shared `common.share.*` (the post's share row — share is a shared setting, not blog-owned), and `nav.blog` (the breadcrumb root). The post share row is **gated + configured by a `share` prop** the host injects from its shared `siteSettings.share` (Sanity), not a blog display toggle. A missing key throws at render — declare these when mounting the blog island in a second app.

**Stack:** Sanity v6 (GROQ · PortableText) · Next.js 16 · React 19 · TypeScript · Tailwind v4. Self-contained blog + page-builder.

## Layout

- `user-interface/` — the blog's UI, organized by route like `src/user-interface/`: `blog/` (frontpage), `post/` (single post), `author/`, `category/`, `tag/` — each split into `sections/` (big views + blocks), `components/` (small: cards, TOC, badges), `layout/` (page shells, e.g. `post/layout/DefaultPostLayout`) as needed. Multi-page pieces live in `shared/` (`sections/PageHero`, `components/{BlogCard,Breadcrumbs}`); `lib/category-nav.ts` `getCategoryNav(locale)` is the server helper that fetches the categories and returns the ui-components `CategoryNav` (top-level categories + sub-category dropdowns) for the app layout's `subnav` slot on every blog page; the shared **`FeaturedMedia`** in `@indiecrafts/packages-web-ui-components` (`renderers/`) renders a cover **image or inline-playable video** in one structure (no dialog — plays in place), used by the post hero, blog frontpage, and every card — `parseVideoEmbed` (from `@indiecrafts/packages-shared-utils`) resolves `metadata.videoUrl` inside it. `renderers/` holds the 12 blog-specific module renderers (`blog-category-spotlight · blog-collection · blog-explore · blog-featured · blog-hero · blog-index · blog-post-content · blog-post-list · blog-related · blog-toc · blog-topic-cards · blog-trending`) + `ModuleRenderer` (`Modules`: the blog blocks, then `renderBlock` for the 17 generic ones from `@indiecrafts/packages-web-ui-components`) — the one dispatcher for the blog's layouts, site pages, the home page and the sidebar (`context.sidebar` → each block in a `SidebarCard`, post lists as compact `PostLinks`).
- `sanity/` — `schema/` + `queries.ts` + `types.ts` + `structure.ts` (Studio desk) + `portable-to-markdown.ts`
- `lib/route-gate.ts` — `requireBlogRoute(page)` (page components) / `isBlogRouteEnabled(page)` (route handlers) / `isRssEnabled()`. Each folds in the flag **and** `page.enabled`, so a new route can't drift by checking only one.
- `emails/` — the blog's transactional templates (`comment-notification`), rendering via `@indiecrafts/packages-web-email`'s `renderEmail`. The blog owns its email end-to-end (group in `sanity/`, template here, send in `lib/notify-comment.ts`).

## Schemas (`sanity/schema/`)

The generic page-builder (17 blocks + `blockContent`/`link`/`cta` + `quote`/`person`) now lives in
**`@indiecrafts/packages-web-page-builder`**. The blog owns only its own docs + its 12 blog-specific blocks.

| Surface      | Documents                                                         | Objects     |
| ------------ | ----------------------------------------------------------------- | ----------- |
| Blog         | `blog` (singleton), `post`, `author`, `category`, `tag`, `series` | `postMedia` |
| Page-builder | 12 blog-specific `module.*` (see `schema/modules/`)               | —           |

## Page-builder modules

- **The 17 generic blocks** (hero · feature-grid · pricing · callout · card-list · gallery ·
  person-list · prose · stat-list · step-list · quote-list · accordion-list · custom-html ·
  newsletter · waitlist · lead-magnet · contact) — schemas in `@indiecrafts/packages-web-page-builder`, renderers in
  `@indiecrafts/packages-web-ui-components`. Adding one → `code/docs/packages/web/page-builder.md` §"Adding a block".
- **12 blog-specific** — schema + renderer here, dispatched by `user-interface/renderers/ModuleRenderer.tsx`:
  - **Layout blocks** (`BLOG_MODULE_TYPES`, the blog singleton's arrays): `blog-hero` → `PostHero`,
    `blog-featured` → `FeaturedPosts` (`grid` or `editorial`), `blog-category-spotlight` / `blog-trending`
    → `SpotlightRow`, `blog-collection` → `Carousel`, `blog-topic-cards` → `TopicCards`, `blog-explore`
    (wraps `ExploreCategories`/`ExploreTags`/`TopAuthors`), `blog-post-list` → `BlogCard` grid,
    `blog-index`, `blog-post-content`. The renderers are glue — fetch, map with `toPostCard`
    (`lib/post-card.ts`), hand to the primitive.
  - **On any page** (`BLOG_SECTION_TYPES`): the layout blocks minus `blog-index` / `blog-post-content`,
    accepted by `page.sections[]` to promote the blog site-wide.
  - **Sidebar cards** (`BLOG_SIDEBAR_TYPES`): `blog-toc` + `blog-related` (sidebar-only, the post being
    read) and the post lists, which render as a compact `PostLinks` list in a card.

The blog composes the generic `MODULES_FRAGMENT` (`@indiecrafts/packages-web-page-builder`) + its own
post-card projection (`POST_CARD_PROJECTION`, shared by `blog-post-list`, `blog-hero`, `blog-featured`,
`blog-category-spotlight`, `blog-collection`, and `blog-trending`) in `sanity/queries.ts`.

Field **legends** (every `title` + `description` an editor sees) are written for non-technical editors — plain words, no jargon. Follow [`.claude/rules/web/sanity-legends.md`](../../../../../.claude/rules/web/sanity-legends.md).

## Frontpage (`/blog`)

The `blog` singleton's `frontpageModules[]` composes the `/blog` route — the app's `pickFrontpage`
(`code/projects/web/surfaces/website/src/app/[locale]/blog/frontpage-select.ts`) renders the editor's
stack when non-empty, else the code default `DefaultBlogFrontpage` (listing or hero → search → explore categories → tags → top authors).
The seven frontpage-capable blocks are `blog-hero`, `blog-featured`, `blog-explore`,
`blog-category-spotlight`, `blog-collection`, `blog-topic-cards`, and `blog-trending`; `blog-post-list`
also drops in here as the "Latest/Articles" block. Every generic block (newsletter, hero, etc.) is
pickable too — the array shares the same `of` list as `postModules`.

**Auto + pin.** Every dynamic block (all but `blog-topic-cards`, which is pure taxonomy) has a rule
default (`source: "latest"` / `"flag"`, or the category/popularity fill) plus an optional `pinned`
array; pins take precedence in editor order, the rule fills the rest **up to a shared `count`/`limit`
cap** — the shared reorder + merge/dedupe/cap helpers (`reorderByIds`, `mergePinnedWithFallback`) live in `lib/pin-order.ts`, used by the four frontpage renderers. `blog-collection` is pinned-only (no rule — `posts[]` is required). `blog-trending`'s rule is
`getPopularPostIds` (`lib/popularity.ts`) — the most-viewed posts of the last 30 days from the shared
api's anonymous counter (`/v1/views/top`, EU D1), the latest posts filling any gap. `PostViewBeacon`
(on the post page) counts a view via the host app's `/api/views` route → `recordPostView`.

## Per-post layout + extras

- The `blog` singleton owns per-post chrome via `postModules[]`; empty ⇒ `DefaultPostLayout` (full-width hero, the sidebar cards beside the body, "Keep reading" grid). The sidebar (`postSidebar(cards, post, locale, related)`) comes from the post's `sidebar` field, else Site web → Barre latérale (`page-builder` § Sidebar); the route fetches `related` once for the grid and the `blog-related` card, and cards that would render nothing are dropped. Its TOC card shows from `lg`, `MobileToc` above the body below. `sanity/block-types.ts` (`POST_ONLY_TYPES`, no schema code) names the post-only blocks a page drops. See "Frontpage" above for `frontpageModules[]`, the `/blog` equivalent.
- A post splits into `media` (`postMedia` — `slug` + cover image/video) + `seo` (the shared `seoMeta` — `title`/`description`/`noIndex`/… override the page `<head>`). GROQ re-projects both into the old `metadata`-shaped output + `slug`, so consumers are unchanged. `body` PortableText drives the TOC (`blog-toc` card → `<Toc>`, h2/h3/h4 via GROQ `pt::text()`); `readTime` derived in GROQ; Article JSON-LD via `buildArticleSchema(...)`.
- `.md` export at `/<locale>/blog/<slug>/md`; RSS at `/blog/rss.xml` — both advertised via `<link rel="alternate">`.
- Queries use `defineQuery` (typegen-ready); `MODULES_FRAGMENT` expands every reference per module type.

## Studio

Embedded catch-all at `src/app/studio/[[...tool]]/page.tsx` with its own root layout (sits outside `[locale]/`, so needs its own `<html>`/`<body>`). The desk (`sanity/structure.ts`) groups Blog (singleton + posts/authors/categories/tags/series), two top-level reference domains **Témoignages** (`quote`) + **Équipe** (`person`) — now owned by `@indiecrafts/packages-web-page-builder` (the generic entities its blocks reference; a future release generalizes them to `testimonial`/`team`), Commentaires, and the core **SEO & métadonnées** section (`seoStructureItem` from `@/sanity/structure` — `siteSettings` + `siteMeta.<locale>`).

## Gating

**`features.blog`** (public): all routes via `route-gate` (`/blog`, `/blog/[slug]`, `/blog/category` + `/[slug]`, `/blog/tag` + `/[slug]`, `/author` + `/[slug]`, `/md`, `/rss.xml`, `/search`) 404 when off; `pages.{blog,author,category,tag}.enabled` mirror it (sitemap + llms.txt drop entries); header `/blog` link; `<SanityLive>` mount; `generateStaticParams` → `[]` when off.

**Sub-flags** (all require `blog`): `blogTaxonomy.{authors,categories,tags}` (per-taxonomy, + editor `blog.display.taxonomy.*` — incl. `categoryNav`, the top category bar; a category `parent` ref makes a sub-category via `categoryNavQuery`), `blogComments` (`isCommentsEnabled`), `rss` (`isRssEnabled`), `blogSearch` (`isSearchEnabled` — the `/blog/search` route + the frontpage search box), `blogSeries` (`isSeriesEnabled` — the `/blog/series/<slug>` route + the on-post "Part N of M" nav).

**`features.studio`** (editing): `/studio` and `/api/draft-mode/{enable,disable}` 404 when off.
