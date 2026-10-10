---
title: "Blog architecture"
description: "For developers extending or debugging the blog."
status: stable
---

# Blog architecture

For developers extending or debugging the blog. One map of how a request lands on a rendered page — URL → GROQ → JSX.

The blog is the `@indiecrafts/modules-web-blog` module (`code/modules/web/blog`), consumed as source by the app via `transpilePackages`. Routes live in the app (`code/projects/web/surfaces/website/src/app`); data, schema, and renderers live in the module.

Companion docs:

- Editor workflow → [`editor-guide.md`](/modules/web/blog/editor-guide)
- Body-editor primitives → [`body-editor.md`](/modules/web/blog/body-editor)
- Gallery module → [`gallery.md`](/modules/web/blog/gallery)
- Page-builder model + sidebar → [`packages/web/page-builder`](/packages/web/page-builder)
- Setup + Sanity + QA → [`sanity-setup.md`](/modules/web/blog/sanity-setup)

---

## 1. Routes

Every blog route file lives under `code/projects/web/surfaces/website/src/app/[locale]/` (except the Studio + draft-mode API, which sit outside `[locale]/`).

| URL                              | File                            | What it does                                                                                                                                                                                       |
| -------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/<locale>/blog`                 | `blog/page.tsx`                 | Frontpage. Renders the `blog` singleton's `frontpageModules[]` when non-empty; else the code default `DefaultBlogFrontpage` (hero grid → ExploreCategories → ExploreTags → TopAuthors) — see §1.1. |
| `/<locale>/blog/<slug>`          | `blog/[slug]/page.tsx`          | Post detail. Module-driven when the `blog` singleton's `postModules` is non-empty; otherwise `DefaultPostLayout`.                                                                                  |
| `/<locale>/blog/<slug>/md`       | `blog/[slug]/md/route.ts`       | Markdown export — YAML frontmatter + body serialised by `sanity/portable-to-markdown.ts` (§9).                                                                                                     |
| `/<locale>/blog/search`          | `blog/search/page.tsx`          | Search results (`?q=`). No-JS GET form → `searchPostsQuery` (GROQ `match` on title/excerpt/description/body). `noindex`. Gated by `features.blogSearch`.                                           |
| `/<locale>/blog/series/<slug>`   | `blog/series/[slug]/page.tsx`   | Series landing — posts in reading order (`seriesOrder`), paginated. Gated by `features.blogSeries`.                                                                                                |
| `/<locale>/blog/rss.xml`         | `blog/rss.xml/route.ts`         | RSS 2.0, locale-filtered. One feed per locale.                                                                                                                                                     |
| `/<locale>/blog/atom.xml`        | `blog/atom.xml/route.ts`        | Atom 1.0 — same data (`rssPostsQuery`), same `isRssEnabled()` gate; ISO-8601 dates, `<feed>`/`<entry>` shape.                                                                                      |
| `/<locale>/blog/category`        | `blog/category/page.tsx`        | Category listing (topics with ≥1 post in the locale).                                                                                                                                              |
| `/<locale>/blog/category/<slug>` | `blog/category/[slug]/page.tsx` | Single category — posts filtered by category slug. **Paginated** (`?page=N`).                                                                                                                      |
| `/<locale>/blog/tag`             | `blog/tag/page.tsx`             | Tag listing.                                                                                                                                                                                       |
| `/<locale>/blog/tag/<slug>`      | `blog/tag/[slug]/page.tsx`      | Single tag. **Paginated** (`?page=N`).                                                                                                                                                             |
| `/<locale>/author`               | `author/page.tsx`               | Author listing (top-level, not under `blog/`).                                                                                                                                                     |
| `/<locale>/author/<slug>`        | `author/[slug]/page.tsx`        | Author profile + their posts. Authors are translated — the doc is locale-filtered. **Paginated** (`?page=N`).                                                                                      |

**Pagination.** The three taxonomy detail routes page their post lists at `POSTS_PER_PAGE = 12` (`lib/pagination.ts`). Each route reads `?page=N`, fetches a `[$start...$end]` slice **plus** a matching `count(...)` query (`postsBy{Category,Tag,Author}CountQuery`), and renders a shared `<Pager>` (prev/next, page X of Y). Page 1 is the bare URL (one canonical); deeper pages are crawlable `<a>` links. The `/blog` frontpage is **not** paginated — each block caps its own post count (a `count`/`limit` field), sized by design.

**Scheduling.** Every public _listing/discovery_ query filters `coalesce(publishedAt, _createdAt) <= now()`, so a future **Publié le** keeps a post out of listings, feeds, related, sitemap, and llms until its date. The direct URL (`postBySlugQuery`) is intentionally not filtered, so a scheduled post stays shareable/previewable.

### 1.1 Frontpage composition

`code/projects/web/surfaces/website/src/app/[locale]/blog/page.tsx` picks between the editor's stack
and the code default via `pickFrontpage` (`frontpage-select.ts`, same route folder):
`modules && modules.length > 0 ? "modules" : "default"`. The `"modules"` branch renders
`blog.frontpageModules` through the same `<Modules>` component `postModules` uses (`context: {
locale }`, no `post`); the `"default"` branch renders `DefaultBlogFrontpage`
(`user-interface/blog/sections/DefaultBlogFrontpage.tsx`) — the hard-coded hero mosaic → explore →
newsletter chain that shipped before the frontpage became composable.

Seven blog-specific blocks are frontpage-capable: `blog-hero`, `blog-featured`, `blog-explore`,
`blog-category-spotlight`, `blog-collection`, `blog-topic-cards`, `blog-trending`; `blog-post-list`
(the per-post "Articles" block) doubles as the frontpage's "Latest" list. Each dynamic block (all but
`blog-topic-cards`) follows the same **auto + pin** shape: a rule default (`source: "latest"`/`"flag"`,
a category, or `getPopularPostIds`) plus an optional `pinned` array; pins take precedence in editor
order, the rule fills the rest up to a shared `count`/`limit` cap. `blog-collection` has no rule — its
`posts[]` is pin-only. `lib/popularity.ts` (`getPopularPostIds(locale, count)`) is the Trending
popularity source: the most-viewed posts of the last 30 days, read from the shared api's anonymous
per-post counter (`GET /v1/views/top`, EU D1). `PostViewBeacon` on the post page counts a view through
the website's `/api/views` route (`recordPostView` → `POST /v1/views`); no cookie, no identity. The
latest posts fill any gap (`popularThenLatest`), and an api failure falls back to them.
| `/api/draft-mode/{enable,disable}` | `app/api/draft-mode/.../route.ts` | Preview toggles. Gated by `features.studio` (404 when off); `/enable` 503s when `SANITY_API_READ_TOKEN` is unset. |
| `/studio/[[...tool]]` | `app/studio/[[...tool]]/page.tsx` | Embedded Sanity Studio. Gated by `features.studio`. Own root layout (`app/studio/layout.tsx`) — sits outside `[locale]/` because Studio owns its HTML shell. |

**Gating** is centralized in `code/modules/web/blog/src/lib/route-gate.ts`:

- `isBlogRouteEnabled(page)` = `features.blog && isPageVisible(page)` — folds the flag **and** the page's `enabled` so a route can't drift by checking one half.
- `requireBlogRoute(page)` — 404s in Server Components (`notFound()`).
- `isRssEnabled()` = `isBlogRouteEnabled(pages.blog) && features.rss` — gates both feeds and their `<link rel="alternate">` discovery tags.
- `isTaxonomyRouteEnabled(kind, page)` / `requireTaxonomyRoute(kind, page)` (async) — `isBlogRouteEnabled(page)` **and** the editor's `blog.display.taxonomy[kind]` toggle. Used by every taxonomy route + its `generateStaticParams`, the sitemap, and llms.

All `/<locale>/blog/*` and `/<locale>/author/*` routes 404 when `features.blog === false`. The Studio + draft-mode surface is gated **independently** by `features.studio`.

**Two-tier taxonomy gating.** A taxonomy surface is visible only when **both** are true: the code capability `features.blogTaxonomy.{authors,categories,tags}` (compiled in) **and** the editor toggle `blog.display.taxonomy.*` (Sanity, flippable without a deploy). `lib/settings.ts` — `getBlogSettings()` (React-`cache`d, build-safe `client.fetch`) — folds both into one resolved `BlogDisplay`; every consumer reads that, so a taxonomy toggled off in Studio is **truly gone**: chips hidden, routes 404, entries dropped from the sitemap + `/llms.txt`. The same `blog.display` object also carries render-only toggles (`post.{date,readingTime,relatedPosts,readingProgress}`, `frontpage.featuredHero`, `cards.excerpt`) that hide elements without touching routes. `post.relatedPosts` drives only the "Keep reading" grid under the article. `frontpage.featuredHero` drives the default `/blog` layout. The old `post.tableOfContents` toggle is gone: the TOC is the `blog-toc` sidebar card (§12).

---

## 2. GROQ queries

Defined in `code/modules/web/blog/src/sanity/queries.ts`, each wrapped in `defineQuery` (typegen-ready). Every read that touches localized content filters by `$locale`.

### Fragments (composed into queries)

| Fragment                         | Purpose                                                                                                                                                                                                                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `POST_LIST_FRAGMENT`             | Card shape for every "list of posts" query.                                                                                                                                                                                                                                                                  |
| `SEO_FRAGMENT`                   | Slug-less `seo` override on taxonomy docs (`noIndex`, `hideFromDiscovery`, `unpublished`, title/description/image).                                                                                                                                                                                          |
| `AUTHOR_FRAGMENT`                | Author detail + listing (`pt::text(bio)` flattens the rich-text bio).                                                                                                                                                                                                                                        |
| `TAG_FRAGMENT`                   | Tag detail + listing, with a locale-filtered `postCount`.                                                                                                                                                                                                                                                    |
| `LINK_FRAGMENT` · `CTA_FRAGMENT` | In `@indiecrafts/packages-web-page-builder` (`sanity/queries.ts`) — collapse the `internal`/`external` link union into one `href` (a page → `/<slug>`, a post → `/blog/<slug>`).                                                                                                                             |
| `POST_CARD_PROJECTION`           | The shared post-card shape every listing (all/featured/related/search, series/category/tag/author) **and** every frontpage block (`blog-post-list`, `blog-hero`, `blog-featured`, `blog-category-spotlight`, `blog-collection`, `blog-trending`) projects into.                                              |
| `MODULES_FRAGMENT`               | The blog's fragment = the **generic** `MODULES_FRAGMENT` (imported from `@indiecrafts/packages-web-page-builder`) **+** the blog-specific `module.blog-post-list` and `module.blog-topic-cards` projections. Used by `postBySlugQuery` and `blogSingletonQuery` (both `postModules` and `frontpageModules`). |

`MODULES_FRAGMENT` is what lets an inline module resolve its references without a second round-trip:

```groq
body[]{ ${MODULES_FRAGMENT} }
```

Inside it, each `_type == "module.X" => { ... }` branch dereferences only what that module needs — the **generic** branches (callout/card CTAs, gallery image assets, person refs, quote refs, standalone inline images) live in the page-builder fragment. They resolve at the top level **and** inside a container's rich text (a callout, card, accordion item, step or prose body), one level deep; the blog appends `module.blog-post-list` (category ids) and `module.blog-topic-cards` (each card's category/tag `target` + image). Modules with no references pass through unchanged via the leading `...`. The other five blog-specific blocks (`blog-hero`, `blog-featured`, `blog-category-spotlight`, `blog-collection`, `blog-trending`) fetch their own posts at render time via a dedicated top-level query instead — see below.

### Top-level queries

| Query                        | Locale-filtered?  | Consumed by                                                                                                                                      |
| ---------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `allPostsQuery`              | yes               | `DefaultBlogFrontpage`, category fallback                                                                                                        |
| `blogHeroQuery`              | yes               | `module.blog-hero` (`BlogHeroModule`) — latest or one pinned post                                                                                |
| `blogFeaturedQuery`          | yes               | `module.blog-featured` (`BlogFeatured`) — flagged or pinned posts                                                                                |
| `blogCategorySpotlightQuery` | yes               | `module.blog-category-spotlight` (`BlogCategorySpotlight`) — one category + its posts                                                            |
| `blogCollectionQuery`        | yes               | `module.blog-collection` (`BlogCollection`) — pinned posts by `_id`; also reused by `module.blog-trending`'s pinned/popular lookups              |
| `postBySlugQuery`            | yes               | `/blog/[slug]` (also derives `readTime` + `headings`)                                                                                            |
| `relatedPostsQuery`          | yes               | "Keep reading" grid (category overlap, limit 3)                                                                                                  |
| `allPostSlugsQuery`          | no (multi-locale) | `generateStaticParams` for `/blog/[slug]`                                                                                                        |
| `rssPostsQuery`              | yes               | `/blog/rss.xml` + `/blog/atom.xml`                                                                                                               |
| `blogSingletonQuery`         | n/a               | `/blog/[slug]` — pulls the `postModules` shell                                                                                                   |
| `categoriesForLocaleQuery`   | yes               | `/blog`, `/blog/category`                                                                                                                        |
| `categoryBySlugQuery`        | yes               | `/blog/category/[slug]`                                                                                                                          |
| `postsByCategorySlugQuery`   | yes               | `/blog/category/[slug]`                                                                                                                          |
| `allCategorySlugsQuery`      | no                | `generateStaticParams` for `/blog/category/[slug]`                                                                                               |
| `tagsForLocaleQuery`         | yes               | `/blog`, `/blog/tag`                                                                                                                             |
| `tagBySlugQuery`             | yes               | `/blog/tag/[slug]`                                                                                                                               |
| `postsByTagSlugQuery`        | yes               | `/blog/tag/[slug]`                                                                                                                               |
| `allTagSlugsQuery`           | no                | `generateStaticParams` for `/blog/tag/[slug]`                                                                                                    |
| `authorsForLocaleQuery`      | yes               | `/blog`, `/author`                                                                                                                               |
| `authorBySlugQuery`          | yes               | `/author/[slug]` — authors are translated                                                                                                        |
| `postsByAuthorSlugQuery`     | yes               | `/author/[slug]` — their posts in the active locale                                                                                              |
| `allAuthorSlugsQuery`        | no                | `generateStaticParams` for `/author/[slug]`                                                                                                      |
| `taxonomyForLlmsQuery`       | yes               | LLM endpoints — category/tag/author, one locale                                                                                                  |
| `moduleBlogPostListQuery`    | yes               | `module.blog-post-list` runtime fetch (`categoryIds`, `limit` default 100, `featuredOnly`); also `module.blog-trending`'s no-popularity fallback |

Every locale-filtered read uses `coalesce(language, "en") == $locale`, so legacy un-tagged docs default to EN and stay visible after a schema migration adds `language`. Cross-locale 404 protection falls out of the same filter: an EN slug requested under `/fr/blog/<slug>` returns null and the route 404s.

---

## 3. Fetch + draft mode

Every route reads through the single `sanityFetchLive` helper from `@indiecrafts/packages-web-sanity/live` (built on `next-sanity`'s `defineLive`):

```ts
const posts = await sanityFetchLive<PostListItem[]>({
  query: allPostsQuery,
  params: { locale },
});
```

- **Live content** — `<SanityLive />` is mounted in `app/[locale]/layout.tsx` (gated by `features.blog`). It subscribes to GROQ websocket updates, so Studio edits reflect on the page within seconds, no redeploy.
- **Draft awareness** — when `draftMode().isEnabled === true`, `sanityFetchLive` switches the Sanity perspective to drafts and surfaces unpublished documents.

**Build-time reads cannot call `sanityFetchLive`** — it reads `draftMode()`, which isn't allowed inside `generateStaticParams` or `app/sitemap.ts`. Those use the plain `client.fetch(query)` from `@indiecrafts/packages-web-sanity/client` instead. Everywhere else — pages **and** route handlers — uses `sanityFetchLive`. Copy `blog/[slug]/page.tsx` when adding a new dynamic route.

---

## 4. Schemas (`code/modules/web/blog/src/sanity/schema/`)

`schema/index.ts` exports `schemaTypes`, registered in `code/projects/web/surfaces/website/sanity.config.ts` alongside the app's `coreSchemaTypes`.

| Kind      | Files                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------- |
| Documents | `post.ts`, `author.ts`, `category.ts`, `tag.ts`, `series.ts`, `documents/blog.ts` (singleton), `documents/comment.ts` |
| Objects   | `objects/metadata.ts` (per-post SEO override)                                                                         |
| Modules   | `modules/` — **12** blog-specific `module.*` schemas (10 layout + 2 sidebar-only) + `modules/index.ts`                |

The generic page-builder schemas — the **17** generic `module.*` blocks, the `blockContent` / `link` / `cta` objects, `define-module` (which pulls `seoMeta` + `localeString` from `@indiecrafts/packages-web-schema`), and the `quote` / `person` entity docs — now live in **`@indiecrafts/packages-web-page-builder`**; the blog references them by type name.

| Document           | Localized (`language`)? | Notes                                                                                     |
| ------------------ | ----------------------- | ----------------------------------------------------------------------------------------- |
| `blog` (singleton) | shared                  | One per dataset. Owns `postModules[]` (per-post chrome) + `frontpageModules[]` (`/blog`). |
| `post`             | **yes**                 | Body via `blockContent`; `metadata` object for per-post SEO override.                     |
| `author`           | **yes**                 | Translated — one doc per locale, EN/FR linked via `translation.metadata`.                 |
| `category`         | **yes**                 | EN and FR categories are separate documents.                                              |
| `tag`              | **yes**                 | Same as category.                                                                         |

### The page-builder catalog — 17 generic + 12 blog-specific

The **17 generic** blocks are the single source in **`@indiecrafts/packages-web-page-builder`** (`sanity/schema/modules/index.ts` → `MODULE_TYPES` + `moduleSchemas`, both in catalog order); their renderers live in `@indiecrafts/packages-web-ui-components`. The blog adds **12** blog-specific blocks in its own `modules/index.ts` (`blogModuleSchemas`): the **10** layout blocks of `BLOG_MODULE_TYPES` below, plus **2** sidebar-only cards, `blog-toc` (« Sommaire de l'article ») and `blog-related` (« Articles sur le même sujet »):

```ts
// @indiecrafts/packages-web-page-builder — sanity/schema/modules/index.ts
export const MODULE_TYPES = [
  "module.hero",
  "module.feature-grid",
  "module.pricing",
  "module.accordion-list",
  "module.callout",
  "module.card-list",
  "module.gallery",
  "module.person-list",
  "module.prose",
  "module.stat-list",
  "module.step-list",
  "module.quote-list",
  "module.custom-html",
  "module.newsletter",
  "module.waitlist",
  "module.lead-magnet",
  "module.contact",
] as const;

// @indiecrafts/modules-web-blog — sanity/schema/modules/index.ts
export const BLOG_MODULE_TYPES = [
  "module.blog-category-spotlight",
  "module.blog-collection",
  "module.blog-explore",
  "module.blog-featured",
  "module.blog-hero",
  "module.blog-index",
  "module.blog-post-content",
  "module.blog-post-list",
  "module.blog-topic-cards",
  "module.blog-trending",
] as const;
```

`documents/blog.ts` composes `[...MODULE_TYPES, ...BLOG_MODULE_TYPES]` (27 `module.*` types) to build **both** its `postModules` and `frontpageModules` array `of: [...]` (the same list feeds both slots), so every generic **and** layout blog block is pickable in the singleton.

Two more lists place the blog blocks outside the blog:

- **`BLOG_SECTION_TYPES`** — the blocks a site page holds (`page.sections[]`, the home page), to promote the blog site-wide: `blog-featured`, `blog-trending`, `blog-post-list`, `blog-collection`, `blog-category-spotlight`, `blog-topic-cards`, `blog-hero`, `blog-explore`. The blog's page chrome (`blog-index`, `blog-post-content`) stays out.
- **`BLOG_SIDEBAR_TYPES`** — the blocks a sidebar card holds: `blog-toc`, `blog-related`, `blog-trending`, `blog-featured`, `blog-post-list`, `blog-collection` (§12).

The website passes both to `pageBuilderSanity({ sectionTypes, sidebarTypes })` in `sanity.config.ts`. With `features.blog` off, `siteBlocks` (`src/lib/sidebar.ts`) drops every `module.blog-*` block from pages and sidebars.

**Studio picker.** Every block array uses `blockInsertMenu`: grouped insert menus (Mise en page · Contenu · Médias · Formulaires · Blog · Autres) in a list view. Each block has an icon and a description.

**`blog-featured` fields.** Besides `source` / `pinned` / `limit` / `leadCard`, it has `layout` (`grid`, the default, or `editorial`: a lead card beside a short list), `eyebrow`, `title`, `intro` and `viewAll` (the link text to `/blog`; empty = no link). The home page's « Articles à la une » strip is this block with `layout: "editorial"` — see [Featured posts](/projects/web/website/design/featured-articles).

Every module schema is declared via `defineModule` (`@indiecrafts/packages-web-page-builder`), which auto-injects two fields on top of the module's own: `anchor` (optional id for in-page links) and `hidden` (soft-disable without deleting). A hidden block renders nothing, at the top level and inline in rich text.

**Inline-embeddable subset (13 generic blocks)** — the blocks editors can drop directly inside rich text (a post body, a page's prose). This allowlist lives in `@indiecrafts/packages-web-page-builder`'s `blockContent.ts` (`INLINE_MODULES`); a test keeps it equal to `INLINE_TYPES` in the PortableText renderer: `accordion-list`, `callout`, `card-list`, `contact`, `custom-html`, `gallery`, `lead-magnet`, `newsletter`, `person-list`, `quote-list`, `stat-list`, `step-list`, `waitlist`. Not inline: `hero`, `feature-grid`, `pricing`, `prose`, and every blog block.

---

## 5. Renderer

The **generic** block renderers + registry live in `@indiecrafts/packages-web-ui-components/web/`; the blog's own
renderers + the composition live under `code/modules/web/blog/src/user-interface/renderers/`. All pivot on one map:

- **`registry.tsx`** (`@indiecrafts/packages-web-ui-components/web/`) — `BLOCK_RENDERERS` (`_type` → component), declared `satisfies { [K in BlockModule["_type"]]: BlockRenderer<K> }` so a missing entry or a drifted `_type` is a **compile error**. Holds the **17 generic** blocks. Exports `BLOCK_RENDERERS` + `renderBlock(module, components)`.
- **`ModuleRenderer.tsx`** (blog) — the async `<Modules>` component + `ModuleSwitch`. Skips `hidden` modules, special-cases the **12 blog-specific** types (`blog-post-content`, `blog-toc` and `blog-related` need the active `Post` and render nothing without one; the others only need `locale`) and delegates every generic block to `renderBlock` — composing `{ ...BLOCK_RENDERERS, ...blog dispatchers }`. Drives every block list that can hold blog blocks: the singleton's `postModules` slot (via `blog/[slug]/page.tsx`), its `frontpageModules` slot (via `blog/page.tsx` + `pickFrontpage`), site pages, the home page, and the sidebar (`context.sidebar`). Returns `null` on an empty array so routes fall back to their default layout (`DefaultPostLayout` / `DefaultBlogFrontpage`). Seven of the ten blocks (`blog-hero`, `blog-featured`, `blog-explore`, `blog-category-spotlight`, `blog-collection`, `blog-topic-cards`, `blog-trending`) are the frontpage-capable set — see §1.1.
- **`portable-text-components.tsx`** (`@indiecrafts/packages-web-ui-components/web/`) — `portableComponents`, passed to `<PortableText>`. Overrides only what the `prose` plugin can't infer: h2/h3/h4 (slug `id` + `scroll-mt-24` for the TOC), the external-link mark, standalone inline images, the `codeBlock` type, and the inline modules (via `INLINE_TYPES`). A hidden inline module renders nothing. Everything else falls through to `@portabletext/react` defaults, styled by the `.prose` wrapper.
- **`CodeBlock.tsx`** (`@indiecrafts/packages-web-ui-components`) — renders the body's `codeBlock` object (`language` / optional `filename` / `code`) with **Shiki**, server-side + async, light+dark theme pair (`defaultColor: "light"`). The dark colours swap under `[data-theme="dark"]` via `.shiki` rules in `@indiecrafts/packages-web-ui-tokens/globals.css`. An unsupported language degrades to a plain `<pre>`.

Because inline modules and `postModules` pull from the same registry, a `Callout` in a post body renders identically to a `Callout` in `postModules`.

> The renderer's function-call convention (`Component({ ...module, components })`) requires **server** components. A module that needs client state (see the gallery) splits into a server wrapper + a `"use client"` child.

---

## 6. Locale strategy

Every route mounts under `[locale]/`; the app's typed `routing.ts` defines the supported locales (`en`, `fr`). Server components call `setRequestLocale(locale)` at the top. Blog links inside the module use `Link` from `@indiecrafts/packages-web-i18n` (the shared, untyped module navigation); the app's own pages use the typed `@/i18n/routing`.

For content: every localized read filters by `$locale`. Shared docs (`person`, `blog` singleton) are visible to both locales.

Static generation returns one `(locale, slug)` entry per document — an EN-only post yields `{ locale: "en", slug }`, an FR-only post yields `{ locale: "fr", slug }`. A post that should appear in both locales needs **two documents** (one per `language`); the seed does exactly this for the showcase post.

---

## 7. Post detail layout — `DefaultPostLayout`

When `blog.postModules` is empty (the seed default), each post renders through `user-interface/post/layout/DefaultPostLayout.tsx`, in this order:

- **Breadcrumb trail** at the top.
- **Hero** — the cover image or video (`FeaturedMedia`), then the tags, the title, the lead and the meta strip (authors, date, read time, category).
- **Body panel** — `PortableText` with `portableComponents`.
- **Sidebar cards** beside the body (`WithSidebar`) — from the post's own `sidebar`, else the « Articles » setting of Site web → Barre latérale (§12). No card: the body takes the full width. When the cards hold a `blog-toc` and the post has headings, `MobileToc` shows the TOC above the body below `lg`.
- **Author bio**, the footer (back-link + **share row**), then the **"Keep reading"** related-posts grid.

The TOC card is fed by `postBySlugQuery`'s derived `headings` (`body[style in ["h2","h3","h4"]]` via `pt::text`); `readTime` is derived in the same query (≈200 wpm). Author/category/tag chips, the date, reading time and the "Keep reading" grid each read a toggle from `getBlogSettings()` (`blog.display.*`) — see §1 (two-tier taxonomy gating).

**Post extras.** A `ShareButtons` row (X / LinkedIn / Facebook + copy-link; a client component for the clipboard) sits in the footer, and a `ReadingProgress` bar (client, direct-DOM `scaleX` on scroll, `aria-hidden`) pins to the top — each gated by `blog.display.post.{share,readingProgress}`. Social brand glyphs render via `BrandIcon` from the shared `@indiecrafts/packages-web-ui-icons` brick (one source for every mark). Authors carry an optional `social[]` (`{ platform, url }`) rendered as icon links on `/author/[slug]`.

**Structured data.** The post route emits `Article` JSON-LD (`buildArticleSchema`) — `datePublished` from `publishedAt`, `dateModified` from the projected `_updatedAt` (`post.updatedAt`, a real freshness signal) — **plus** a `BreadcrumbList` (`buildBreadcrumbSchema`): Blog → category → post, with the category crumb dropped when categories are toggled off so the schema never links a 404'd route. The category / tag / author detail routes emit their own `BreadcrumbList` the same way (author keeps its existing `Person` too). The visual `<Breadcrumbs>` and the JSON-LD are built separately — trail in the body, machine trail in the head.

To swap in a module-driven shell, populate `blog.postModules` from the Studio — typically `module.blog-post-content` (header + body), then `module.quote-list`, then `module.blog-post-list` ("keep reading"). Anything in `postModules` runs through `ModuleRenderer`, so you can re-order, hide, or theme per dataset without touching code. The composed layout puts the same sidebar beside the `blog-post-content` block (`context.postSidebar`).

---

## 8. Adding / removing a module

Follow [`packages/web/page-builder`](/packages/web/page-builder) § "Adding a block" — don't reconstruct the steps. **Where the block lives depends on what it is:**

- A **generic** block (reusable across apps) lands in **`@indiecrafts/packages-web-page-builder`** — schema in its `sanity/schema/modules/<name>.ts` via `defineModule`, added to `moduleSchemas` **and** `MODULE_TYPES` in that package's `modules/index.ts`; renderer in `@indiecrafts/packages-web-ui-components`; GROQ branch (only if it has refs) in the package's `MODULES_FRAGMENT`; inline allowlist via `INLINE_MODULES` (`blockContent.ts`).
- A **blog-specific** block (needs `locale` or the active `Post`) stays in the **blog** — schema in `sanity/schema/modules/<name>.ts`, added to `blogModuleSchemas` **and** `BLOG_MODULE_TYPES` in the blog's `modules/index.ts` (plus `BLOG_SECTION_TYPES` / `BLOG_SIDEBAR_TYPES` if it belongs on site pages or in a sidebar card); renderer in `user-interface/renderers/` + special-cased in `ModuleRenderer.tsx`. If it dereferences a ref inline (like `blog-topic-cards`), append its projection to the composed `MODULES_FRAGMENT` (`sanity/queries.ts`); if it fetches its own posts at render time (like `blog-hero`/`blog-featured`/`blog-category-spotlight`/`blog-collection`/`blog-trending`), add a dedicated top-level query instead, reusing `POST_CARD_PROJECTION`.

A generic block adds a `<Name>Module` type to the `BlockModule` union (`@indiecrafts/packages-web-ui-components` `src/shared/types.ts`); a blog block adds one to `AnyModule` (the blog's `sanity/types.ts`). Either way, a missing renderer entry is a compile error.

Removal is the reverse order plus **dataset hygiene** — existing instances survive a code delete. Strip them with a one-shot script that patches the documents out (§10) — the seed never touches existing content.

---

## 9. Markdown export

`sanity/portable-to-markdown.ts` (`portableTextToMarkdown`) serialises a post body for the `/md` endpoint. It handles blocks (paragraph, `h1`–`h6`, blockquote), bullet/number lists, the `strong`/`em`/`code` marks, `link` annotations, and standalone images (`![alt](url)`).

It **does not** serialise inline modules — an unknown block type is skipped and logged (`logger.warn`), never thrown, so the route always returns something. If you add a first-class module that should appear in the export, extend this serialiser too.

---

## 10. Dataset hygiene

Two scripts in `code/projects/web/surfaces/website/scripts/`:

- **`seed.mjs`** (`pnpm seed`) — writes the baseline (+ demo content with `--demo`) into an **empty** dataset; it refuses a dataset with content unless `--force`. It only writes, never cleans: to strip a removed module's blocks from existing posts, patch them out with a one-shot script (the shape of `unset-legacy-fields.mjs`).
- **`unset-legacy-fields.mjs`** — one-shot removal of a schema field after it's dropped from a document type. Edit the `TARGETS` array, run once. See [`sanity-setup.md`](/modules/web/blog/sanity-setup).

For ad-hoc GROQ, the Vision plugin is embedded in the Studio: `/studio` → **Vision** tab.

---

## 11. CSP allowlist

The embedded Studio and `<SanityLive />` need Sanity's REST + websocket hosts in the CSP `connect-src`. `getCSPConnectSources(env)` (in `@indiecrafts/packages-shared-config`, `code/packages/shared/config/src/types.ts`) returns `https://*.sanity.io` (REST) and `wss://*.api.sanity.io` (live subscriptions), consumed by `next.config.ts`. Removing them breaks live content + Studio in staging/production.

---

## 12. Sidebar

Any page type can show a column of **cards** beside its content. Each card is a page-builder block. The model lives in `@indiecrafts/packages-web-page-builder` — see [page builder § Sidebar](/packages/web/page-builder#sidebar).

**Which cards.** The most specific choice wins (`resolveSidebar`, `sanity/sidebar.ts`):

1. The document's own `sidebar` field (`page`, `post`): `inherit` · `custom` (its cards) · `none`. Empty = `inherit`.
2. Its page type in `sidebarSettings-<locale>.byType.<type>`, with the same three modes.
3. The default cards, `sidebarSettings-<locale>.default`.

`none` at any level stops there: no sidebar. A sidebar holds at most 6 cards (`SIDEBAR_MAX`).

**Page types.** The website lists them in `src/sanity/sidebar-pages.ts` (`SIDEBAR_PAGES`): `home` (Accueil), `page` (Pages), `blogIndex` (Accueil du blog), `post` (Articles), `blogListing` (Listes du blog: categories, tags, series, authors, search).

**Cards.** The generic `GENERIC_SIDEBAR_TYPES` (callout, card-list, prose, quote-list, stat-list, custom-html, newsletter, lead-magnet, waitlist) plus the blog's `BLOG_SIDEBAR_TYPES` (blog-toc, blog-related, blog-trending, blog-featured, blog-post-list, blog-collection). `blog-toc` and `blog-related` describe the post being read, so they render nothing on another page. In a card, the post lists render as a compact list of links (`PostLinks`).

**Render path.**

- Pages, the home and the blog lists — the route wraps its content in `PageSidebar` (`src/user-interface/shared/layout/PageSidebar.tsx`). It calls `getSidebar(locale, page, choice)` (`src/lib/sidebar.ts`), which reads `sidebarSettingsQuery`, applies `resolveSidebar`, then drops the blog blocks when `features.blog` is off (`siteBlocks`).
- Posts — `blog/[slug]/page.tsx` resolves the cards the same way, then `postSidebar` (`user-interface/post/layout/post-sidebar.tsx`) builds the `aside` and the `mobileToc` flag for `DefaultPostLayout` or `blog-post-content`.
- `Modules` with `context.sidebar` set wraps each block in a `SidebarCard` and renders generic blocks `inline`.

**Layout** (`WithSidebar`, `SidebarCard` in `@indiecrafts/packages-web-ui-components`):

- From `lg`: the content plus an 18rem column. The cards stick below the header.
- Below `lg`: the cards follow the content. The DOM order is the reading order: main content first.
- The `blog-toc` card shows from `lg` only (`max-lg:hidden`). On a phone, `MobileToc` opens the same list from « Sur cette page » above the article.
- A card that renders nothing leaves no gap.

**Seed and migration.** The seed writes `sidebarSettings-<locale>` with **Articles** = `custom`: `blog-toc` + `blog-related` (the sidebar posts had before). The other types inherit an empty default. For an existing dataset, run `node --env-file=.env.local scripts/sidebar-migrate.mjs` (a dry run) from `code/projects/web/surfaces/website/`, then again with `--apply`. It creates the settings, adds the home's « Articles à la une » block, and unsets `blog.display.post.tableOfContents`.
