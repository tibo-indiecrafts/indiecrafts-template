# Blog architecture

For developers extending or debugging the blog. One map of how a request lands on a rendered page — URL → GROQ → JSX.

The blog is the `@indiecrafts/blog` module (`code/modules/blog`), consumed as source by the app via `transpilePackages`. Routes live in the app (`code/apps/web/src/app`); data, schema, and renderers live in the module.

Companion docs:

- Editor workflow → [`editor-guide.md`](./editor-guide.md)
- Body-editor primitives → [`body-editor.md`](./body-editor.md)
- Gallery module → [`gallery.md`](./gallery.md)
- Setup + Sanity + QA → [`sanity-setup.md`](./sanity-setup.md)

---

## 1. Routes

Every blog route file lives under `code/apps/web/src/app/[locale]/` (except the Studio + draft-mode API, which sit outside `[locale]/`).

| URL | File | What it does |
| --- | --- | --- |
| `/<locale>/blog` | `blog/page.tsx` | Frontpage. Hero grid + ExploreCategories + ExploreTags + TopAuthors. **Never module-driven** — chrome stays uniform. |
| `/<locale>/blog/<slug>` | `blog/[slug]/page.tsx` | Post detail. Module-driven when the `blog` singleton's `postModules` is non-empty; otherwise `DefaultPostLayout`. |
| `/<locale>/blog/<slug>/md` | `blog/[slug]/md/route.ts` | Markdown export — YAML frontmatter + body serialised by `sanity/portable-to-markdown.ts` (§9). |
| `/<locale>/blog/rss.xml` | `blog/rss.xml/route.ts` | RSS 2.0, locale-filtered. One feed per locale. |
| `/<locale>/blog/atom.xml` | `blog/atom.xml/route.ts` | Atom 1.0 — same data (`rssPostsQuery`), same `isRssEnabled()` gate; ISO-8601 dates, `<feed>`/`<entry>` shape. |
| `/<locale>/blog/category` | `blog/category/page.tsx` | Category listing (topics with ≥1 post in the locale). |
| `/<locale>/blog/category/<slug>` | `blog/category/[slug]/page.tsx` | Single category — posts filtered by category slug. |
| `/<locale>/blog/tag` | `blog/tag/page.tsx` | Tag listing. |
| `/<locale>/blog/tag/<slug>` | `blog/tag/[slug]/page.tsx` | Single tag. |
| `/<locale>/author` | `author/page.tsx` | Author listing (top-level, not under `blog/`). |
| `/<locale>/author/<slug>` | `author/[slug]/page.tsx` | Author profile + their posts. Authors are translated — the doc is locale-filtered. |
| `/api/draft-mode/{enable,disable}` | `app/api/draft-mode/.../route.ts` | Preview toggles. Gated by `features.studio` (404 when off); `/enable` 503s when `SANITY_API_READ_TOKEN` is unset. |
| `/studio/[[...tool]]` | `app/studio/[[...tool]]/page.tsx` | Embedded Sanity Studio. Gated by `features.studio`. Own root layout (`app/studio/layout.tsx`) — sits outside `[locale]/` because Studio owns its HTML shell. |

**Gating** is centralized in `code/modules/blog/src/lib/route-gate.ts`:

- `isBlogRouteEnabled(page)` = `features.blog && isPageVisible(page)` — folds the flag **and** the page's `enabled` so a route can't drift by checking one half.
- `requireBlogRoute(page)` — 404s in Server Components (`notFound()`).
- `isRssEnabled()` = `isBlogRouteEnabled(pages.blog) && features.rss` — gates both feeds and their `<link rel="alternate">` discovery tags.

All `/<locale>/blog/*` and `/<locale>/author/*` routes 404 when `features.blog === false`. The Studio + draft-mode surface is gated **independently** by `features.studio`. Taxonomy sub-routes additionally read `features.blogTaxonomy.{authors,categories,tags}`.

---

## 2. GROQ queries

Defined in `code/modules/blog/src/sanity/queries.ts`, each wrapped in `defineQuery` (typegen-ready). Every read that touches localized content filters by `$locale`.

### Fragments (composed into queries)

| Fragment | Purpose |
| --- | --- |
| `POST_LIST_FRAGMENT` | Card shape for every "list of posts" query. |
| `SEO_FRAGMENT` | Slug-less `seo` override on taxonomy docs (`noIndex`, `hideFromDiscovery`, `unpublished`, title/description/image). |
| `AUTHOR_FRAGMENT` | Author detail + listing (`pt::text(bio)` flattens the rich-text bio). |
| `TAG_FRAGMENT` | Tag detail + listing, with a locale-filtered `postCount`. |
| `LINK_FRAGMENT` | Collapses the `internal`/`external` CTA link union into one `href` string (`/blog/<slug>` for internal). |
| `CTA_FRAGMENT` | Wraps `LINK_FRAGMENT` for CTA-bearing modules. |
| `MODULES_FRAGMENT` | Projects each module's cross-references inline. Used by `postBySlugQuery` and `blogSingletonQuery`. |

`MODULES_FRAGMENT` is what lets an inline module resolve its references without a second round-trip:

```groq
body[]{ ${MODULES_FRAGMENT} }
```

Inside it, each `_type == "module.X" => { ... }` branch dereferences only what that module needs (callout/card CTAs, gallery image assets, person refs, quote refs, blog-post-list category ids, standalone inline images). Modules with no references pass through unchanged via the leading `...`.

### Top-level queries

| Query | Locale-filtered? | Consumed by |
| --- | --- | --- |
| `allPostsQuery` | yes | `/blog`, category fallback |
| `featuredPostsQuery` | yes | `BlogHero` on `/blog` |
| `postBySlugQuery` | yes | `/blog/[slug]` (also derives `readTime` + `headings`) |
| `relatedPostsQuery` | yes | "Keep reading" grid (category overlap, limit 3) |
| `allPostSlugsQuery` | no (multi-locale) | `generateStaticParams` for `/blog/[slug]` |
| `rssPostsQuery` | yes | `/blog/rss.xml` + `/blog/atom.xml` |
| `blogSingletonQuery` | n/a | `/blog/[slug]` — pulls the `postModules` shell |
| `categoriesForLocaleQuery` | yes | `/blog`, `/blog/category` |
| `categoryBySlugQuery` | yes | `/blog/category/[slug]` |
| `postsByCategorySlugQuery` | yes | `/blog/category/[slug]` |
| `allCategorySlugsQuery` | no | `generateStaticParams` for `/blog/category/[slug]` |
| `tagsForLocaleQuery` | yes | `/blog`, `/blog/tag` |
| `tagBySlugQuery` | yes | `/blog/tag/[slug]` |
| `postsByTagSlugQuery` | yes | `/blog/tag/[slug]` |
| `allTagSlugsQuery` | no | `generateStaticParams` for `/blog/tag/[slug]` |
| `authorsForLocaleQuery` | yes | `/blog`, `/author` |
| `authorBySlugQuery` | yes | `/author/[slug]` — authors are translated |
| `postsByAuthorSlugQuery` | yes | `/author/[slug]` — their posts in the active locale |
| `allAuthorSlugsQuery` | no | `generateStaticParams` for `/author/[slug]` |
| `taxonomyForLlmsQuery` | yes | LLM endpoints — category/tag/author, one locale |
| `moduleBlogPostListQuery` | yes | `module.blog-post-list` runtime fetch (`categoryIds`, `limit` default 100, `featuredOnly`) |

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

## 4. Schemas (`code/modules/blog/src/sanity/schema/`)

`schema/index.ts` exports `schemaTypes`, registered in `code/apps/web/sanity.config.ts` alongside the app's `coreSchemaTypes`.

| Kind | Files |
| --- | --- |
| Documents | `post.ts`, `author.ts`, `category.ts`, `tag.ts`, `documents/blog.ts` (singleton), `documents/quote.ts`, `documents/person.ts` |
| Objects | `blockContent.ts`, `objects/metadata.ts`, `objects/seo-meta.ts`, `objects/link.ts`, `objects/cta.ts`, `objects/define-module.ts` |
| Modules | `modules/` — 13 `module.*` schemas + `modules/index.ts` |

| Document | Localized (`language`)? | Notes |
| --- | --- | --- |
| `blog` (singleton) | shared | One per dataset. Owns `postModules[]`. |
| `post` | **yes** | Body via `blockContent`; `metadata` object for per-post SEO override. |
| `author` | **yes** | Translated — one doc per locale, EN/FR linked via `translation.metadata`. |
| `category` | **yes** | EN and FR categories are separate documents. |
| `tag` | **yes** | Same as category. |
| `quote` | **yes** | Quotes are language-tagged. |
| `person` | shared | People are universal. |

### The 13 page-builder modules

The catalog is the single source in `modules/index.ts` (`MODULE_TYPES` + `moduleSchemas`, both in catalog order):

```ts
export const MODULE_TYPES = [
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
  "module.blog-index",
  "module.blog-post-content",
  "module.blog-post-list",
] as const;
```

`documents/blog.ts` reads `MODULE_TYPES` to build its `postModules` array `of: [...]`, so a new catalog entry is instantly pickable in the singleton. Order here controls the Studio picker order.

Every module schema is declared via `defineModule` (`objects/define-module.ts`), which auto-injects two fields on top of the module's own: `anchor` (optional id for in-page links) and `hidden` (soft-disable without deleting).

**Inline-embeddable subset (9 of 13)** — the modules editors can drop directly inside a post body. This allowlist lives in `blockContent.ts` (`INLINE_MODULES`) and must stay in lockstep with `INLINE_TYPES` in `portable-text-components.tsx`: `accordion-list`, `callout`, `card-list`, `gallery`, `person-list`, `stat-list`, `step-list`, `quote-list`, `custom-html`. The other four (`blog-index`, `blog-post-content`, `blog-post-list`, `prose`) are `postModules`-only page chrome.

---

## 5. Renderer

Runtime lives under `code/modules/blog/src/user-interface/renderers/`, all pivoting on one map:

- **`registry.tsx`** — `SIMPLE_MODULES` (`_type` → component), declared `satisfies { [K in SimpleModuleType]: SimpleRenderer<K> }` so a missing entry or a drifted `_type` is a **compile error**. It holds the **11 simple modules** (everything except the two context-aware ones). Exports `SIMPLE_MODULES` + `renderSimpleModule(module, components)`.
- **`ModuleRenderer.tsx`** — the async `<Modules>` component + `ModuleSwitch`. Skips `hidden` modules, special-cases the two context-aware types (`module.blog-post-list` needs the locale, `module.blog-post-content` needs the active `Post`), and delegates the rest to `renderSimpleModule`. Drives the singleton's `postModules` slot. Returns `null` on an empty array so routes fall back to their default layout.
- **`portable-text-components.tsx`** — `portableComponents`, passed to `<PortableText>`. Overrides only what the `prose` plugin can't infer: h2/h3/h4 (slug `id` + `scroll-mt-24` for the TOC), the external-link mark, standalone inline images, and the 9 inline modules (derived from `SIMPLE_MODULES` via `INLINE_TYPES`). Everything else falls through to `@portabletext/react` defaults, styled by the `.prose` wrapper.

Because inline modules and `postModules` pull from the same registry, a `Callout` in a post body renders identically to a `Callout` in `postModules`.

> The renderer's function-call convention (`Component({ ...module, components })`) requires **server** components. A module that needs client state (see the gallery) splits into a server wrapper + a `"use client"` child.

---

## 6. Locale strategy

Every route mounts under `[locale]/`; the app's typed `routing.ts` defines the supported locales (`en`, `fr`). Server components call `setRequestLocale(locale)` at the top. Blog links inside the module use `Link` from `@indiecrafts/i18n` (the shared, untyped module navigation); the app's own pages use the typed `@/i18n/routing`.

For content: every localized read filters by `$locale`. Shared docs (`person`, `blog` singleton) are visible to both locales.

Static generation returns one `(locale, slug)` entry per document — an EN-only post yields `{ locale: "en", slug }`, an FR-only post yields `{ locale: "fr", slug }`. A post that should appear in both locales needs **two documents** (one per `language`); the seed does exactly this for the showcase post.

---

## 7. Post detail layout — `DefaultPostLayout`

When `blog.postModules` is empty (the seed default), each post renders through `user-interface/post/layout/DefaultPostLayout.tsx`. An editorial two-column layout adapted from `indiecrafts-library`'s `customer-story-04`:

- **Breadcrumb trail** at the top.
- **Title + lead** in a `max-w-2xl` block above the columns.
- **Main column** — cover image (or `HeroVideo` when `metadata.videoUrl` is set) → body (`PortableText` with `portableComponents`) → an "about the author" block.
- **Sticky right sidebar** — `Toc` (mounted only when `post.headings.length > 0`) + meta (published date, read time, author, category, tags). A `MobileToc` covers small screens.
- **Footer back-link**, then the **"Keep reading"** related-posts grid.

The TOC is fed by `postBySlugQuery`'s derived `headings` (`body[style in ["h2","h3","h4"]]` via `pt::text`); `readTime` is derived in the same query (≈200 wpm). Author/category/tag links are gated per-type by `features.blogTaxonomy`.

To swap in a module-driven shell, populate `blog.postModules` from the Studio — typically `module.blog-post-content` (header + body), then `module.quote-list`, then `module.blog-post-list` ("keep reading"). Anything in `postModules` runs through `ModuleRenderer`, so you can re-order, hide, or theme per dataset without touching code.

---

## 8. Adding / removing a module

A module touches ~8 code locations. Don't reconstruct the steps — follow the canonical checklists at `method/apps/web/workflows/add-blog-module.md` and `remove-blog-module.md`. The touch-points, in dependency order:

1. **Schema** — `sanity/schema/modules/<name>.ts` via `defineModule`.
2. **Catalog** — import into `modules/index.ts`; add to `moduleSchemas` **and** `MODULE_TYPES`.
3. **Types** — a `<Name>Module` type + a member in `AnyModule` (`sanity/types.ts`). This is what makes the missing renderer entry a compile error.
4. **GROQ (only if it has refs)** — a `_type == "module.<name>" => { ... }` branch in `MODULES_FRAGMENT`.
5. **Component** — `user-interface/renderers/<Name>.tsx` (server; add a `"use client"` child if it needs state).
6. **Registry** — add to `SIMPLE_MODULES` in `registry.tsx`, **or** special-case in `ModuleRenderer.tsx` if it needs the active `Post`/locale.
7. **Inline-embeddable?** — if editors should drop it into a post body, add the `_type` to `INLINE_MODULES` (`blockContent.ts`) **and** `INLINE_TYPES` (`portable-text-components.tsx`).

Removal is the reverse order (inline allowlists first, schema/component files last) plus **dataset hygiene** — existing instances survive a code delete. Strip them by adding the `_type` to `LEGACY_TYPES` in `scripts/seed-demo.mjs`'s `cleanupLegacy()` and re-seeding (see §9).

---

## 9. Markdown export

`sanity/portable-to-markdown.ts` (`portableTextToMarkdown`) serialises a post body for the `/md` endpoint. It handles blocks (paragraph, `h1`–`h6`, blockquote), bullet/number lists, the `strong`/`em`/`code` marks, `link` annotations, and standalone images (`![alt](url)`).

It **does not** serialise inline modules — an unknown block type is skipped and logged (`logger.warn`), never thrown, so the route always returns something. If you add a first-class module that should appear in the export, extend this serialiser too.

---

## 10. Dataset hygiene

Two scripts in `code/apps/web/scripts/` (run from repo root: `pnpm seed`):

- **`seed-demo.mjs`** — populates the demo dataset. Idempotent — re-run anytime. Starts with `cleanupLegacy()`, which strips legacy blocks (`LEGACY_TYPES = ["module.hero-split", "module.logo-list"]`) from every `post.body[]` **and** `blog.postModules[]`, then deletes orphan `logo` docs (by id + `_type`). Add a newly-removed module's `_type` here.
- **`unset-legacy-fields.mjs`** — one-shot removal of a schema field after it's dropped from a document type. Edit the `TARGETS` array, run once. See [`sanity-setup.md`](./sanity-setup.md).

For ad-hoc GROQ, the Vision plugin is embedded in the Studio: `/studio` → **Vision** tab.

---

## 11. CSP allowlist

The embedded Studio and `<SanityLive />` need Sanity's REST + websocket hosts in the CSP `connect-src`. `getCSPConnectSources(env)` (in `@indiecrafts/config`, `code/packages/config/src/types.ts`) returns `https://*.sanity.io` (REST) and `wss://*.api.sanity.io` (live subscriptions), consumed by `next.config.ts`. Removing them breaks live content + Studio in staging/production.
