# Blog architecture

For developers extending or debugging the blog. One map of how a request lands on a rendered page — URL → GROQ → JSX.

The blog is the `@indiecrafts/blog` module (`code/modules/web/blog`), consumed as source by the app via `transpilePackages`. Routes live in the app (`code/projects/web/surfaces/website/src/app`); data, schema, and renderers live in the module.

Companion docs:

- Editor workflow → [`editor-guide.md`](./editor-guide.md)
- Body-editor primitives → [`body-editor.md`](./body-editor.md)
- Gallery module → [`gallery.md`](./gallery.md)
- Setup + Sanity + QA → [`sanity-setup.md`](./sanity-setup.md)

---

## 1. Routes

Every blog route file lives under `code/projects/web/surfaces/website/src/app/[locale]/` (except the Studio + draft-mode API, which sit outside `[locale]/`).

| URL                              | File                            | What it does                                                                                                                                             |
| -------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/<locale>/blog`                 | `blog/page.tsx`                 | Frontpage. Hero grid + ExploreCategories + ExploreTags + TopAuthors. **Never module-driven** — chrome stays uniform.                                     |
| `/<locale>/blog/<slug>`          | `blog/[slug]/page.tsx`          | Post detail. Module-driven when the `blog` singleton's `postModules` is non-empty; otherwise `DefaultPostLayout`.                                        |
| `/<locale>/blog/<slug>/md`       | `blog/[slug]/md/route.ts`       | Markdown export — YAML frontmatter + body serialised by `sanity/portable-to-markdown.ts` (§9).                                                           |
| `/<locale>/blog/search`          | `blog/search/page.tsx`          | Search results (`?q=`). No-JS GET form → `searchPostsQuery` (GROQ `match` on title/excerpt/description/body). `noindex`. Gated by `features.blogSearch`. |
| `/<locale>/blog/series/<slug>`   | `blog/series/[slug]/page.tsx`   | Series landing — posts in reading order (`seriesOrder`), paginated. Gated by `features.blogSeries`.                                                      |
| `/<locale>/blog/rss.xml`         | `blog/rss.xml/route.ts`         | RSS 2.0, locale-filtered. One feed per locale.                                                                                                           |
| `/<locale>/blog/atom.xml`        | `blog/atom.xml/route.ts`        | Atom 1.0 — same data (`rssPostsQuery`), same `isRssEnabled()` gate; ISO-8601 dates, `<feed>`/`<entry>` shape.                                            |
| `/<locale>/blog/category`        | `blog/category/page.tsx`        | Category listing (topics with ≥1 post in the locale).                                                                                                    |
| `/<locale>/blog/category/<slug>` | `blog/category/[slug]/page.tsx` | Single category — posts filtered by category slug. **Paginated** (`?page=N`).                                                                            |
| `/<locale>/blog/tag`             | `blog/tag/page.tsx`             | Tag listing.                                                                                                                                             |
| `/<locale>/blog/tag/<slug>`      | `blog/tag/[slug]/page.tsx`      | Single tag. **Paginated** (`?page=N`).                                                                                                                   |
| `/<locale>/author`               | `author/page.tsx`               | Author listing (top-level, not under `blog/`).                                                                                                           |
| `/<locale>/author/<slug>`        | `author/[slug]/page.tsx`        | Author profile + their posts. Authors are translated — the doc is locale-filtered. **Paginated** (`?page=N`).                                            |

**Pagination.** The three taxonomy detail routes page their post lists at `POSTS_PER_PAGE = 12` (`lib/pagination.ts`). Each route reads `?page=N`, fetches a `[$start...$end]` slice **plus** a matching `count(...)` query (`postsBy{Category,Tag,Author}CountQuery`), and renders a shared `<Pager>` (prev/next, page X of Y). Page 1 is the bare URL (one canonical); deeper pages are crawlable `<a>` links. The `/blog` frontpage is **not** paginated — it is curated (hero + explore), sized by design.

**Scheduling.** Every public _listing/discovery_ query filters `coalesce(publishedAt, _createdAt) <= now()`, so a future **Publié le** keeps a post out of listings, feeds, related, sitemap, and llms until its date. The direct URL (`postBySlugQuery`) is intentionally not filtered, so a scheduled post stays shareable/previewable.
| `/api/draft-mode/{enable,disable}` | `app/api/draft-mode/.../route.ts` | Preview toggles. Gated by `features.studio` (404 when off); `/enable` 503s when `SANITY_API_READ_TOKEN` is unset. |
| `/studio/[[...tool]]` | `app/studio/[[...tool]]/page.tsx` | Embedded Sanity Studio. Gated by `features.studio`. Own root layout (`app/studio/layout.tsx`) — sits outside `[locale]/` because Studio owns its HTML shell. |

**Gating** is centralized in `code/modules/web/blog/src/lib/route-gate.ts`:

- `isBlogRouteEnabled(page)` = `features.blog && isPageVisible(page)` — folds the flag **and** the page's `enabled` so a route can't drift by checking one half.
- `requireBlogRoute(page)` — 404s in Server Components (`notFound()`).
- `isRssEnabled()` = `isBlogRouteEnabled(pages.blog) && features.rss` — gates both feeds and their `<link rel="alternate">` discovery tags.
- `isTaxonomyRouteEnabled(kind, page)` / `requireTaxonomyRoute(kind, page)` (async) — `isBlogRouteEnabled(page)` **and** the editor's `blog.display.taxonomy[kind]` toggle. Used by every taxonomy route + its `generateStaticParams`, the sitemap, and llms.

All `/<locale>/blog/*` and `/<locale>/author/*` routes 404 when `features.blog === false`. The Studio + draft-mode surface is gated **independently** by `features.studio`.

**Two-tier taxonomy gating.** A taxonomy surface is visible only when **both** are true: the code capability `features.blogTaxonomy.{authors,categories,tags}` (compiled in) **and** the editor toggle `blog.display.taxonomy.*` (Sanity, flippable without a deploy). `lib/settings.ts` — `getBlogSettings()` (React-`cache`d, build-safe `client.fetch`) — folds both into one resolved `BlogDisplay`; every consumer reads that, so a taxonomy toggled off in Studio is **truly gone**: chips hidden, routes 404, entries dropped from the sitemap + `/llms.txt`. The same `blog.display` object also carries render-only toggles (`post.{date,readingTime,tableOfContents,relatedPosts}`, `frontpage.featuredHero`, `cards.excerpt`) that hide elements without touching routes.

---

## 2. GROQ queries

Defined in `code/modules/web/blog/src/sanity/queries.ts`, each wrapped in `defineQuery` (typegen-ready). Every read that touches localized content filters by `$locale`.

### Fragments (composed into queries)

| Fragment                         | Purpose                                                                                                                                                                                                              |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST_LIST_FRAGMENT`             | Card shape for every "list of posts" query.                                                                                                                                                                          |
| `SEO_FRAGMENT`                   | Slug-less `seo` override on taxonomy docs (`noIndex`, `hideFromDiscovery`, `unpublished`, title/description/image).                                                                                                  |
| `AUTHOR_FRAGMENT`                | Author detail + listing (`pt::text(bio)` flattens the rich-text bio).                                                                                                                                                |
| `TAG_FRAGMENT`                   | Tag detail + listing, with a locale-filtered `postCount`.                                                                                                                                                            |
| `LINK_FRAGMENT` · `CTA_FRAGMENT` | In `@indiecrafts/page-builder` (`sanity/queries.ts`) — collapse the `internal`/`external` link union into one `href` (a page → `/<slug>`, a post → `/blog/<slug>`).                                                  |
| `MODULES_FRAGMENT`               | The blog's fragment = the **generic** `MODULES_FRAGMENT` (imported from `@indiecrafts/page-builder`) **+** the blog-specific `module.blog-post-list` projection. Used by `postBySlugQuery` and `blogSingletonQuery`. |

`MODULES_FRAGMENT` is what lets an inline module resolve its references without a second round-trip:

```groq
body[]{ ${MODULES_FRAGMENT} }
```

Inside it, each `_type == "module.X" => { ... }` branch dereferences only what that module needs — the **generic** branches (callout/card CTAs, gallery image assets, person refs, quote refs, standalone inline images) live in the page-builder fragment; the blog appends only `module.blog-post-list` (category ids). Modules with no references pass through unchanged via the leading `...`.

### Top-level queries

| Query                      | Locale-filtered?  | Consumed by                                                                                |
| -------------------------- | ----------------- | ------------------------------------------------------------------------------------------ |
| `allPostsQuery`            | yes               | `/blog`, category fallback                                                                 |
| `featuredPostsQuery`       | yes               | `BlogHero` on `/blog`                                                                      |
| `postBySlugQuery`          | yes               | `/blog/[slug]` (also derives `readTime` + `headings`)                                      |
| `relatedPostsQuery`        | yes               | "Keep reading" grid (category overlap, limit 3)                                            |
| `allPostSlugsQuery`        | no (multi-locale) | `generateStaticParams` for `/blog/[slug]`                                                  |
| `rssPostsQuery`            | yes               | `/blog/rss.xml` + `/blog/atom.xml`                                                         |
| `blogSingletonQuery`       | n/a               | `/blog/[slug]` — pulls the `postModules` shell                                             |
| `categoriesForLocaleQuery` | yes               | `/blog`, `/blog/category`                                                                  |
| `categoryBySlugQuery`      | yes               | `/blog/category/[slug]`                                                                    |
| `postsByCategorySlugQuery` | yes               | `/blog/category/[slug]`                                                                    |
| `allCategorySlugsQuery`    | no                | `generateStaticParams` for `/blog/category/[slug]`                                         |
| `tagsForLocaleQuery`       | yes               | `/blog`, `/blog/tag`                                                                       |
| `tagBySlugQuery`           | yes               | `/blog/tag/[slug]`                                                                         |
| `postsByTagSlugQuery`      | yes               | `/blog/tag/[slug]`                                                                         |
| `allTagSlugsQuery`         | no                | `generateStaticParams` for `/blog/tag/[slug]`                                              |
| `authorsForLocaleQuery`    | yes               | `/blog`, `/author`                                                                         |
| `authorBySlugQuery`        | yes               | `/author/[slug]` — authors are translated                                                  |
| `postsByAuthorSlugQuery`   | yes               | `/author/[slug]` — their posts in the active locale                                        |
| `allAuthorSlugsQuery`      | no                | `generateStaticParams` for `/author/[slug]`                                                |
| `taxonomyForLlmsQuery`     | yes               | LLM endpoints — category/tag/author, one locale                                            |
| `moduleBlogPostListQuery`  | yes               | `module.blog-post-list` runtime fetch (`categoryIds`, `limit` default 100, `featuredOnly`) |

Every locale-filtered read uses `coalesce(language, "en") == $locale`, so legacy un-tagged docs default to EN and stay visible after a schema migration adds `language`. Cross-locale 404 protection falls out of the same filter: an EN slug requested under `/fr/blog/<slug>` returns null and the route 404s.

---

## 3. Fetch + draft mode

Every route reads through the single `sanityFetchLive` helper from `@indiecrafts/sanity/live` (built on `next-sanity`'s `defineLive`):

```ts
const posts = await sanityFetchLive<PostListItem[]>({
  query: allPostsQuery,
  params: { locale },
});
```

- **Live content** — `<SanityLive />` is mounted in `app/[locale]/layout.tsx` (gated by `features.blog`). It subscribes to GROQ websocket updates, so Studio edits reflect on the page within seconds, no redeploy.
- **Draft awareness** — when `draftMode().isEnabled === true`, `sanityFetchLive` switches the Sanity perspective to drafts and surfaces unpublished documents.

**Build-time reads cannot call `sanityFetchLive`** — it reads `draftMode()`, which isn't allowed inside `generateStaticParams` or `app/sitemap.ts`. Those use the plain `client.fetch(query)` from `@indiecrafts/sanity/client` instead. Everywhere else — pages **and** route handlers — uses `sanityFetchLive`. Copy `blog/[slug]/page.tsx` when adding a new dynamic route.

---

## 4. Schemas (`code/modules/web/blog/src/sanity/schema/`)

`schema/index.ts` exports `schemaTypes`, registered in `code/projects/web/surfaces/website/sanity.config.ts` alongside the app's `coreSchemaTypes`.

| Kind      | Files                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------- |
| Documents | `post.ts`, `author.ts`, `category.ts`, `tag.ts`, `series.ts`, `documents/blog.ts` (singleton), `documents/comment.ts` |
| Objects   | `objects/metadata.ts` (per-post SEO override)                                                                         |
| Modules   | `modules/` — **3** blog-specific `module.*` schemas + `modules/index.ts`                                              |

The generic page-builder schemas — the **16** generic `module.*` blocks, the `blockContent` / `link` / `cta` objects, `define-module` (which pulls `seoMeta` + `localeString` from `@indiecrafts/schema`), and the `quote` / `person` entity docs — now live in **`@indiecrafts/page-builder`**; the blog references them by type name.

| Document           | Localized (`language`)? | Notes                                                                     |
| ------------------ | ----------------------- | ------------------------------------------------------------------------- |
| `blog` (singleton) | shared                  | One per dataset. Owns `postModules[]`.                                    |
| `post`             | **yes**                 | Body via `blockContent`; `metadata` object for per-post SEO override.     |
| `author`           | **yes**                 | Translated — one doc per locale, EN/FR linked via `translation.metadata`. |
| `category`         | **yes**                 | EN and FR categories are separate documents.                              |
| `tag`              | **yes**                 | Same as category.                                                         |

### The page-builder catalog — 16 generic + 3 blog-specific

The **16 generic** blocks are the single source in **`@indiecrafts/page-builder`** (`sanity/schema/modules/index.ts` → `MODULE_TYPES` + `moduleSchemas`, both in catalog order); their renderers live in `@indiecrafts/ui-components`. The blog adds **3** blog-specific blocks in its own `modules/index.ts` (`BLOG_MODULE_TYPES` + `blogModuleSchemas`):

```ts
// @indiecrafts/page-builder — sanity/schema/modules/index.ts
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
] as const;

// @indiecrafts/blog — sanity/schema/modules/index.ts
export const BLOG_MODULE_TYPES = [
  "module.blog-index",
  "module.blog-post-content",
  "module.blog-post-list",
] as const;
```

`documents/blog.ts` composes `[...MODULE_TYPES, ...BLOG_MODULE_TYPES]` (19 `module.*` types) to build its `postModules` array `of: [...]`, so every generic **and** blog-specific block is pickable in the singleton. Order here controls the Studio picker order.

Every module schema is declared via `defineModule` (`@indiecrafts/page-builder`), which auto-injects two fields on top of the module's own: `anchor` (optional id for in-page links) and `hidden` (soft-disable without deleting).

**Inline-embeddable subset (12 generic blocks)** — the blocks editors can drop directly inside a post body. This allowlist lives in `@indiecrafts/page-builder`'s `blockContent.ts` (`INLINE_MODULES`) and must stay in lockstep with `INLINE_TYPES` in the PortableText renderer: `accordion-list`, `callout`, `card-list`, `custom-html`, `gallery`, `lead-magnet`, `newsletter`, `person-list`, `quote-list`, `stat-list`, `step-list`, `waitlist`. Everything else — `prose`, the page-level generics (`hero`, `feature-grid`, `pricing`), and the 3 blog-specific blocks — is `postModules`-only.

---

## 5. Renderer

The **generic** block renderers + registry live in `@indiecrafts/ui-components/web/`; the blog's own
renderers + the composition live under `code/modules/web/blog/src/user-interface/renderers/`. All pivot on one map:

- **`registry.tsx`** (`@indiecrafts/ui-components/web/`) — `BLOCK_RENDERERS` (`_type` → component), declared `satisfies { [K in BlockModule["_type"]]: BlockRenderer<K> }` so a missing entry or a drifted `_type` is a **compile error**. Holds the **16 generic** blocks. Exports `BLOCK_RENDERERS` + `renderBlock(module, components)`.
- **`ModuleRenderer.tsx`** (blog) — the async `<Modules>` component + `ModuleSwitch`. Skips `hidden` modules, special-cases the **3 blog-specific** types (`module.blog-post-list` needs the locale, `module.blog-post-content` needs the active `Post`, `module.blog-index`), and delegates every generic block to `renderBlock` — composing `{ ...BLOCK_RENDERERS, ...blog dispatchers }`. Drives the singleton's `postModules` slot. Returns `null` on an empty array so routes fall back to their default layout.
- **`portable-text-components.tsx`** (`@indiecrafts/ui-components/web/`) — `portableComponents`, passed to `<PortableText>`. Overrides only what the `prose` plugin can't infer: h2/h3/h4 (slug `id` + `scroll-mt-24` for the TOC), the external-link mark, standalone inline images, the `codeBlock` type, and the inline modules (via `INLINE_TYPES`). Everything else falls through to `@portabletext/react` defaults, styled by the `.prose` wrapper.
- **`CodeBlock.tsx`** (`@indiecrafts/ui-components`) — renders the body's `codeBlock` object (`language` / optional `filename` / `code`) with **Shiki**, server-side + async, light+dark theme pair (`defaultColor: "light"`). The dark colours swap under `[data-theme="dark"]` via `.shiki` rules in `@indiecrafts/ui-tokens/globals.css`. An unsupported language degrades to a plain `<pre>`.

Because inline modules and `postModules` pull from the same registry, a `Callout` in a post body renders identically to a `Callout` in `postModules`.

> The renderer's function-call convention (`Component({ ...module, components })`) requires **server** components. A module that needs client state (see the gallery) splits into a server wrapper + a `"use client"` child.

---

## 6. Locale strategy

Every route mounts under `[locale]/`; the app's typed `routing.ts` defines the supported locales (`en`, `fr`). Server components call `setRequestLocale(locale)` at the top. Blog links inside the module use `Link` from `@indiecrafts/i18n` (the shared, untyped module navigation); the app's own pages use the typed `@/i18n/routing`.

For content: every localized read filters by `$locale`. Shared docs (`person`, `blog` singleton) are visible to both locales.

Static generation returns one `(locale, slug)` entry per document — an EN-only post yields `{ locale: "en", slug }`, an FR-only post yields `{ locale: "fr", slug }`. A post that should appear in both locales needs **two documents** (one per `language`); the seed does exactly this for the showcase post.

---

## 7. Post detail layout — `DefaultPostLayout`

When `blog.postModules` is empty (the seed default), each post renders through `user-interface/post/layout/DefaultPostLayout.tsx`. An editorial two-column layout adapted from the component library's `customer-story-04`:

- **Breadcrumb trail** at the top.
- **Title + lead** in a `max-w-2xl` block above the columns.
- **Main column** — cover image (or `HeroVideo` when `metadata.videoUrl` is set) → body (`PortableText` with `portableComponents`) → an "about the author" block.
- **Sticky right sidebar** — `Toc` (mounted only when `post.headings.length > 0`) + meta (published date, read time, author, category, tags). A `MobileToc` covers small screens.
- **Footer back-link**, then the **"Keep reading"** related-posts grid.

The TOC is fed by `postBySlugQuery`'s derived `headings` (`body[style in ["h2","h3","h4"]]` via `pt::text`); `readTime` is derived in the same query (≈200 wpm). Author/category/tag chips, the date, reading time, TOC, and related grid each read a toggle from `getBlogSettings()` (`blog.display.*`) — see §1 (two-tier taxonomy gating).

**Post extras.** A `ShareButtons` row (X / LinkedIn / Facebook + copy-link; a client component for the clipboard) sits in the footer, and a `ReadingProgress` bar (client, direct-DOM `scaleX` on scroll, `aria-hidden`) pins to the top — each gated by `blog.display.post.{share,readingProgress}`. Social brand glyphs are inlined in `shared/components/BrandIcons.tsx` (lucide dropped brand logos). Authors carry an optional `social[]` (`{ platform, url }`) rendered as icon links on `/author/[slug]`.

**Structured data.** The post route emits `Article` JSON-LD (`buildArticleSchema`) — `datePublished` from `publishedAt`, `dateModified` from the projected `_updatedAt` (`post.updatedAt`, a real freshness signal) — **plus** a `BreadcrumbList` (`buildBreadcrumbSchema`): Blog → category → post, with the category crumb dropped when categories are toggled off so the schema never links a 404'd route. The category / tag / author detail routes emit their own `BreadcrumbList` the same way (author keeps its existing `Person` too). The visual `<Breadcrumbs>` and the JSON-LD are built separately — trail in the body, machine trail in the head.

To swap in a module-driven shell, populate `blog.postModules` from the Studio — typically `module.blog-post-content` (header + body), then `module.quote-list`, then `module.blog-post-list` ("keep reading"). Anything in `postModules` runs through `ModuleRenderer`, so you can re-order, hide, or theme per dataset without touching code.

---

## 8. Adding / removing a module

Follow `method/apps/web/workflows/add-page-builder-block.md` — don't reconstruct the steps. **Where the block lives depends on what it is:**

- A **generic** block (reusable across apps) lands in **`@indiecrafts/page-builder`** — schema in its `sanity/schema/modules/<name>.ts` via `defineModule`, added to `moduleSchemas` **and** `MODULE_TYPES` in that package's `modules/index.ts`; renderer in `@indiecrafts/ui-components`; GROQ branch (only if it has refs) in the package's `MODULES_FRAGMENT`; inline allowlist via `INLINE_MODULES` (`blockContent.ts`).
- A **blog-specific** block (`postModules`-only, needs the active `Post`/locale) stays in the **blog** — schema in `sanity/schema/modules/<name>.ts`, added to `blogModuleSchemas` **and** `BLOG_MODULE_TYPES` in the blog's `modules/index.ts`; renderer in `user-interface/renderers/` + special-cased in `ModuleRenderer.tsx`; the blog appends its projection to the composed `MODULES_FRAGMENT` (`sanity/queries.ts`).

Both add a `<Name>Module` type + a member in `AnyModule` (in their own `sanity/types.ts`), which makes a missing renderer entry a compile error.

Removal is the reverse order plus **dataset hygiene** — existing instances survive a code delete. Strip them by adding the `_type` to `LEGACY_TYPES` in `scripts/seed-demo.mjs`'s `cleanupLegacy()` and re-seeding (see §9).

---

## 9. Markdown export

`sanity/portable-to-markdown.ts` (`portableTextToMarkdown`) serialises a post body for the `/md` endpoint. It handles blocks (paragraph, `h1`–`h6`, blockquote), bullet/number lists, the `strong`/`em`/`code` marks, `link` annotations, and standalone images (`![alt](url)`).

It **does not** serialise inline modules — an unknown block type is skipped and logged (`logger.warn`), never thrown, so the route always returns something. If you add a first-class module that should appear in the export, extend this serialiser too.

---

## 10. Dataset hygiene

Two scripts in `code/projects/web/surfaces/website/scripts/` (run from repo root: `pnpm seed`):

- **`seed-demo.mjs`** — populates the demo dataset. Idempotent — re-run anytime. Starts with `cleanupLegacy()`, which strips legacy blocks (`LEGACY_TYPES = ["module.hero-split", "module.logo-list"]`) from every `post.body[]` **and** `blog.postModules[]`, then deletes orphan `logo` docs (by id + `_type`). Add a newly-removed module's `_type` here.
- **`unset-legacy-fields.mjs`** — one-shot removal of a schema field after it's dropped from a document type. Edit the `TARGETS` array, run once. See [`sanity-setup.md`](./sanity-setup.md).

For ad-hoc GROQ, the Vision plugin is embedded in the Studio: `/studio` → **Vision** tab.

---

## 11. CSP allowlist

The embedded Studio and `<SanityLive />` need Sanity's REST + websocket hosts in the CSP `connect-src`. `getCSPConnectSources(env)` (in `@indiecrafts/config`, `code/packages/shared/config/src/types.ts`) returns `https://*.sanity.io` (REST) and `wss://*.api.sanity.io` (live subscriptions), consumed by `next.config.ts`. Removing them breaks live content + Studio in staging/production.
