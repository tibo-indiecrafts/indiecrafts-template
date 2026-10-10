---
title: "Sanity setup & test guide"
description: "End-to-end reference for the Sanity-backed blog module (@indiecrafts/modules-web-blog): configuration, schemas, routes, seeding, and the full QA matrix."
status: stable
---

# Sanity setup & test guide

End-to-end reference for the Sanity-backed blog module (`@indiecrafts/modules-web-blog`): configuration, schemas, routes, seeding, and the full QA matrix. The public surface stays gated by `features.blog` — flip it in the app's `features` (`code/projects/web/surfaces/website/src/config/features.ts`, imported via `@/config`) to activate; the app injects the blog's flags at boot (`configureBlog`), so the module never reads a central registry. The editing surface (Studio + draft preview) is a separate flag, `features.studio`.

---

## 1. What's wired

| Surface                    | Where                                      | Notes                                                                                                                                                                                                                                       |
| -------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Embedded Studio            | `/studio`                                  | Catch-all at `src/app/studio/[[...tool]]/page.tsx` (own root layout `studio/layout.tsx`, outside `[locale]/`). Gated by **`features.studio`** — independent of `features.blog`.                                                             |
| Public blog                | `/<locale>/blog` + `/<locale>/blog/<slug>` | `/blog` renders the `blog` singleton's `frontpageModules` when non-empty, else the code default `DefaultBlogFrontpage`. Each `/blog/<slug>` renders via `DefaultPostLayout` when `postModules` is empty; otherwise `postModules` drives it. |
| Markdown export            | `/<locale>/blog/<slug>/md`                 | YAML frontmatter + PortableText serialized to Markdown. Honors `metadata.noIndex` (hidden posts 404).                                                                                                                                       |
| RSS feed                   | `/<locale>/blog/rss.xml`                   | RSS 2.0, locale-filtered. Requires `features.blog` **and** `features.rss` (`isRssEnabled()`).                                                                                                                                               |
| Atom feed                  | `/<locale>/blog/atom.xml`                  | Atom 1.0 sibling of RSS — same data, same `isRssEnabled()` gate, ISO-8601 dates.                                                                                                                                                            |
| Draft preview              | `/api/draft-mode/enable` + `/disable`      | Gated by **`features.studio`** (404 when off). `/enable` also 503s with an actionable message when `SANITY_API_READ_TOKEN` is missing.                                                                                                      |
| Live content subscriptions | `<SanityLive />` in `[locale]/layout.tsx`  | Only mounted when `features.blog === true`.                                                                                                                                                                                                 |
| Header nav link            | `/blog` link                               | Only shown when `features.blog === true`.                                                                                                                                                                                                   |
| Sitemap + llms.txt entries | `/sitemap.xml` + `/<locale>/llms.txt`      | Auto-included via `pages.blog.enabled = features.blog`.                                                                                                                                                                                     |

---

## 2. Configuration

### Env vars (`.env.local`)

Template is `code/projects/web/surfaces/website/.env.example`.

```bash
# ── Public (safe to expose) ──
NEXT_PUBLIC_SANITY_PROJECT_ID=          # your Sanity project ID
NEXT_PUBLIC_SANITY_DATASET=production   # default; the embedded Studio reads from here
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01  # query-stability pin; bump intentionally

# ── Server-only (NOT NEXT_PUBLIC_) ──
SANITY_API_READ_TOKEN=                  # Viewer role. Required for draft preview.
SANITY_API_WRITE_TOKEN=                 # Editor role. Runtime forms (contact, waitlist, comments) + `pnpm seed`.
```

`projectId` and `dataset` are asserted at import (`code/packages/web/sanity/src/env.ts` throws `Missing NEXT_PUBLIC_SANITY_…` if unset); `apiVersion` falls back to `"2025-01-01"`. Issue tokens at <https://www.sanity.io/manage> → your project → **API** → **Tokens** → **Add API token**. Full token reference (roles, CORS, security) in [`sanity-tokens.md`](/modules/web/blog/sanity-tokens).

### Whitelist your dev origin (CORS)

Required once per origin — without it the Studio at `http://localhost:3000/studio` throws `CorsOriginError` on every request.

```bash
pnpm dlx sanity@latest cors add http://localhost:3000 \
  --credentials --project-id <project-id>
```

`--credentials` lets the Studio's session cookie ride along. Repeat for every domain (staging, prod, preview branches) that talks to the project.

### Feature flags (`@indiecrafts/packages-shared-config`)

Two **independent** flags govern the blog, in `code/packages/shared/config/src/index.ts`. `features.blog` is the public surface; `features.studio` is the editing surface. Keep the Studio on with `blog: false` so editors keep working while the public site is hidden, or turn `studio` off to freeze editing on a live site.

```ts
features: {
  // …
  blog: true,     // ← the public surface — lights up every public Sanity-driven route
  rss: true,      // ← RSS + Atom feeds (also requires blog)
  blogTaxonomy: { authors: true, categories: true, tags: true },  // each also requires blog
  studio: true,   // ← the editing surface — /studio + /api/draft-mode/{enable,disable}
}
```

**`features.blog` (public surface)** — when `false`:

- `/blog`, `/blog/<slug>`, `/blog/<slug>/md`, `/blog/category` + `/<slug>`, `/blog/tag` + `/<slug>`, `/author` + `/<slug>`, `/blog/rss.xml`, `/blog/atom.xml` all 404 (gated via `@indiecrafts/modules-web-blog/lib/route-gate`).
- `<SanityLive />` is not mounted in the layout.
- The header `/blog` link disappears.
- `pages.{blog,author,category,tag}.enabled` mirror the flag → sitemap + llms.txt drop the entries.
- `generateStaticParams` for every dynamic blog route returns `[]`, so the build skips Sanity calls.

**`features.blogTaxonomy.{authors,categories,tags}`** — each gates its own listing/detail routes (folded with `features.blog` in `pages.{author,category,tag}.enabled`).

**`features.studio` (editing surface)** — when `false`: `/studio` and `/api/draft-mode/{enable,disable}` return 404.

> The feeds honor `features.rss`: `/blog/rss.xml`, `/blog/atom.xml`, and their `<link rel="alternate">` tags require `features.blog` **and** `features.rss` (see `isRssEnabled()`).

### CSP allowlist (already configured)

`getCSPConnectSources()` in `code/packages/shared/config/src/types.ts` returns `https://*.sanity.io` + `wss://*.api.sanity.io` so the Studio can reach the API in every environment. `next.config.ts` composes the CSP from this.

### Sanity infra files

Core Sanity infra is the shared package `@indiecrafts/packages-web-sanity` (`code/packages/web/sanity/src/`); everything blog-specific lives inside the module at `code/modules/web/blog/src/sanity/`. The `"use client"` Studio wrapper stays in the app.

```text
code/projects/web/surfaces/website/sanity.config.ts                          # schema list + structure + plugins
code/packages/web/sanity/src/env.ts                         # projectId, dataset, apiVersion, studioBasePath
code/packages/web/sanity/src/client.ts                      # read client (useCdn: false, stega.studioUrl)
code/packages/web/sanity/src/live.ts                        # defineLive — sanityFetch/sanityFetchLive + <SanityLive />
code/packages/web/sanity/src/token.ts                       # server-only SANITY_API_READ_TOKEN
code/packages/web/sanity/src/structure.ts                   # core desk builders (SEO/nav/cookie/legal)
code/projects/web/surfaces/website/src/sanity/Studio.tsx                     # "use client" wrapper around <NextStudio>
code/modules/web/blog/src/sanity/structure.ts               # blog Studio sidebar groups
code/modules/web/blog/src/sanity/queries.ts                 # GROQ — every query filters by $locale
code/modules/web/blog/src/sanity/portable-to-markdown.ts    # PortableText → Markdown serializer
code/modules/web/blog/src/sanity/types.ts                   # TypeScript shapes for query results
```

---

## 3. Schemas

Blog schemas register via `code/modules/web/blog/src/sanity/schema/index.ts` (exported as `schemaTypes`), merged in `sanity.config.ts` as `schema.types: [...coreSchemaTypes, ...schemaTypes]`. The **17 generic** `module.*` blocks register via **`@indiecrafts/packages-web-page-builder`** (`sanity/schema/modules/index.ts` → `MODULE_TYPES` + `moduleSchemas`); the blog's own `code/modules/web/blog/src/sanity/schema/modules/index.ts` exports `BLOG_MODULE_TYPES` + `blogModuleSchemas` — the **12** blog-specific blocks (10 layout blocks + 2 sidebar-only cards). Paths below are relative to `code/modules/web/blog/src/sanity/schema/`.

### Documents

| Schema             | File                | Localized?           | Purpose                                                                                                     |
| ------------------ | ------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------- |
| `blog` (singleton) | `documents/blog.ts` | shared               | Owns `postModules[]` (per-post chrome) + `frontpageModules[]` (`/blog`). One per dataset; sidebar enforces. |
| `post`             | `post.ts`           | **yes** (`language`) | Title, body (PortableText), **authors** (one or several refs), categories, featured flag, `metadata` object |
| `author`           | `author.ts`         | **yes** (`language`) | Name, position, slug, image, bio                                                                            |
| `category`         | `category.ts`       | **yes** (`language`) | Title, description                                                                                          |
| `tag`              | `tag.ts`            | **yes** (`language`) | Cross-cutting tags (title, slug)                                                                            |

The blog's translated content types (`post`, `author`, `category`, `tag`) are registered with `@sanity/document-internationalization` in `sanity.config.ts` (`languageField: "language"`, `supportedLanguages` derived from `@indiecrafts/packages-shared-config` `locales`) — plus core `legalPage`. The `quote` / `person` entities are now registered by `@indiecrafts/packages-web-page-builder`.

### Objects

| Object         | File                                     | Used by                                                      |
| -------------- | ---------------------------------------- | ------------------------------------------------------------ |
| `metadata`     | `objects/metadata.ts`                    | post (title/description/image/slug/noIndex)                  |
| `seoMeta`      | `@indiecrafts/packages-web-schema`       | shared SEO override shape (moved out of the blog)            |
| `blockContent` | `@indiecrafts/packages-web-page-builder` | post body, accordion items, callout content, cards           |
| `link`         | `@indiecrafts/packages-web-page-builder` | inside `cta`. Internal refs target a `page` **or** a `post`. |
| `cta`          | `@indiecrafts/packages-web-page-builder` | callout, card-list, etc.                                     |

### Modules — 29 `module.*` types (17 generic + 12 blog-specific)

Embedded inside `blog.postModules` **and** `blog.frontpageModules` (same `of` list feeds both: the 17 generic + the 10 layout blog blocks), in `page.sections[]` and the home page (the generic blocks + `BLOG_SECTION_TYPES`), in sidebar cards (`GENERIC_SIDEBAR_TYPES` + `BLOG_SIDEBAR_TYPES`), and — for the inline set — directly in rich text. The **17 generic** blocks live in **`@indiecrafts/packages-web-page-builder`** (`sanity/schema/modules/` → `moduleSchemas` + `MODULE_TYPES`); their renderers are in `@indiecrafts/packages-web-ui-components`. The blog's `schema/modules/` holds only the **12 blog-specific** blocks. `defineModule` (`@indiecrafts/packages-web-page-builder`) auto-injects an `anchor` + `hidden` field on every one.

**Generic (`@indiecrafts/packages-web-page-builder`)** — `hero`, `feature-grid`, `pricing`, `accordion-list`, `callout`, `card-list`, `gallery`, `person-list`, `prose`, `stat-list`, `step-list`, `quote-list`, `custom-html`, `newsletter`, `waitlist`, `lead-magnet`, `contact`.

**Blog-specific (`code/modules/web/blog/src/sanity/schema/modules/`):**

| Module                           | File                                 | Notes                                                                                                                                                                                 |
| -------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `module.blog-index`              | `modules/blog-index.ts`              | title + intro band                                                                                                                                                                    |
| `module.blog-post-content`       | `modules/blog-post-content.ts`       | renders the active post (slot)                                                                                                                                                        |
| `module.blog-post-list`          | `modules/blog-post-list.ts`          | filtered post grid (limit, categories, featuredOnly) — also `/blog`'s "Latest" block                                                                                                  |
| `module.blog-hero`               | `modules/blog-hero.ts`               | `/blog` — one lead post, latest or pinned                                                                                                                                             |
| `module.blog-featured`           | `modules/blog-featured.ts`           | any page — `layout`: `grid` (lead + grid) or `editorial` (lead beside a short list); eyebrow, title, intro, `viewAll` link; flagged or pinned. The home's « Articles à la une » strip |
| `module.blog-explore`            | `modules/blog-explore.ts`            | `/blog` — categories/tags/authors variant                                                                                                                                             |
| `module.blog-category-spotlight` | `modules/blog-category-spotlight.ts` | `/blog` — one category's picks + "view all"                                                                                                                                           |
| `module.blog-collection`         | `modules/blog-collection.ts`         | `/blog` — a pinned-only carousel                                                                                                                                                      |
| `module.blog-topic-cards`        | `modules/blog-topic-cards.ts`        | `/blog` — 1-3 clickable category/tag cards                                                                                                                                            |
| `module.blog-trending`           | `modules/blog-trending.ts`           | `/blog` — popularity (seam) or most-recent fallback                                                                                                                                   |
| `module.blog-toc`                | `modules/blog-toc.ts`                | sidebar only — « Sommaire de l'article », the headings of the post being read                                                                                                         |
| `module.blog-related`            | `modules/blog-related.ts`            | sidebar only — « Articles sur le même sujet », same-category posts                                                                                                                    |

**13 generic blocks are inline-embeddable** in rich text (`INLINE_MODULES` in `@indiecrafts/packages-web-page-builder`'s `blockContent.ts`): accordion-list, callout, card-list, contact, custom-html, gallery, lead-magnet, newsletter, person-list, quote-list, stat-list, step-list, waitlist. Not inline: `hero`, `feature-grid`, `pricing`, `prose`, and every blog block.

**Blog blocks on any page.** `page.sections[]` and the home page also accept `BLOG_SECTION_TYPES` — `blog-featured`, `blog-trending`, `blog-post-list`, `blog-collection`, `blog-category-spotlight`, `blog-topic-cards`, `blog-hero`, `blog-explore` — to promote the blog site-wide. With `features.blog` off, the website drops every blog block.

**Sidebar.** Any page type can show up to 6 cards beside its content, set in Studio → Site web → Barre latérale (`sidebarSettings-<locale>`) and per document (`page.sidebar`, `post.sidebar`). See [Editor guide § Sidebar](/modules/web/blog/editor-guide#_7-sidebar-barre-laterale) and [Blog architecture § Sidebar](/modules/web/blog/blog-architecture#_12-sidebar).

### Renderer

`@indiecrafts/packages-web-ui-components/web/registry.tsx` holds the `BLOCK_RENDERERS` map (`_type` → component) for the 17 generic blocks, constrained with `satisfies` so a missing entry is a **compile error** — that's where TS exhaustiveness lives. The blog's `user-interface/renderers/ModuleRenderer.tsx` (`<Modules>` + `ModuleSwitch`) composes `BLOCK_RENDERERS` with its 12 blog-specific dispatchers, special-casing the context-aware blog modules; it drives `postModules`, `frontpageModules`, site pages, the home page and the sidebar. It skips hidden blocks.

### Studio sidebar (`code/modules/web/blog/src/sanity/structure.ts`)

```text
Contenu
├─ Blog
│  ├─ Mise en page (singleton)   ← always opens documentId="blog"
│  ├─ Articles (EN / FR)
│  ├─ Auteurs (EN / FR)
│  ├─ Catégories (EN / FR)
│  └─ Tags (EN / FR)
├─ Références
│  ├─ Citations (EN / FR)
│  └─ Personnes (EN / FR)
├─ SEO & métadonnées   ← core (seoStructureItem)
├─ Navigation          ← core (navStructureItem)
├─ Cookies & consentement  ← core (cookieStructureItem)
└─ Pages légales       ← core (legalStructureItem)
```

Each localized type expands to `English` / `Français` leaves plus a `Toutes les langues` view; each leaf pre-seeds `language` via the per-`(type, locale)` create templates defined in `sanity.config.ts`. The core SEO/nav/cookie/legal sections come from `@indiecrafts/packages-web-sanity/structure` (feature-independent). Modules are object types, so editors only meet them via the picker inside `postModules` or inline in a post body.

---

## 4. Routes

| Route                                  | Type    | Gated                                       | Reads from                                         |
| -------------------------------------- | ------- | ------------------------------------------- | -------------------------------------------------- |
| `/<locale>`                            | static  | —                                           | the home `page` (`getHomePage`) + sidebar settings |
| `/<locale>/blog`                       | SSG     | `features.blog`                             | `blogSingletonQuery` + `allPostsQuery` (fallback)  |
| `/<locale>/blog/<slug>`                | SSG     | `features.blog`                             | `postBySlugQuery` + `blogSingletonQuery`           |
| `/<locale>/blog/<slug>/md`             | dynamic | `features.blog`                             | `postBySlugQuery`                                  |
| `/<locale>/blog/rss.xml`               | dynamic | `features.blog` + `features.rss`            | `rssPostsQuery`                                    |
| `/<locale>/blog/atom.xml`              | dynamic | `features.blog` + `features.rss`            | `rssPostsQuery`                                    |
| `/<locale>/blog/category` + `/<slug>`  | SSG     | `features.blog` + `blogTaxonomy.categories` | `categoriesForLocaleQuery` / `categoryBySlugQuery` |
| `/<locale>/blog/tag` + `/<slug>`       | SSG     | `features.blog` + `blogTaxonomy.tags`       | `tagsForLocaleQuery` / `tagBySlugQuery`            |
| `/<locale>/author` + `/<slug>`         | SSG     | `features.blog` + `blogTaxonomy.authors`    | `authorsForLocaleQuery` / `authorBySlugQuery`      |
| `/<locale>/llms.txt`                   | dynamic | `features.llms.index`                       | messages tree + published posts                    |
| `/api/draft-mode/enable`               | dynamic | `features.studio` + `SANITY_API_READ_TOKEN` | —                                                  |
| `/api/draft-mode/disable`              | dynamic | `features.studio`                           | —                                                  |
| `/studio/[[...tool]]`                  | static  | `features.studio`                           | Sanity API                                         |
| `/sitemap.xml`                         | static  | —                                           | `pages` map                                        |
| `/robots.txt`, `/manifest.webmanifest` | static  | —                                           | `site` config + Sanity `siteSettings.icon`         |

Every GROQ query filters `coalesce(language, "en") == $locale`, so a post whose language doesn't match the requested locale 404s — and legacy un-tagged docs default to `en`. `proxy.ts` matcher excludes `/studio` and `/api`; it explicitly includes `/llms.txt`, `/llms-full.txt`, `/llms/:path*`, `/blog/rss.xml`, `/blog/atom.xml`, `/blog/:slug/md`.

---

## 5. Initial setup (one-time)

```bash
# 1. Install deps
pnpm install

# 2. Copy env template; fill in project ID + dataset
cp code/projects/web/surfaces/website/.env.example code/projects/web/surfaces/website/.env.local
# Edit .env.local — at minimum NEXT_PUBLIC_SANITY_PROJECT_ID + _DATASET

# 3. features.blog is on by default in code/packages/shared/config/src/index.ts
#    (set it false to hide the public surface)

# 4. (Optional) Issue tokens at https://www.sanity.io/manage
#    SANITY_API_READ_TOKEN  → draft preview
#    SANITY_API_WRITE_TOKEN → the forms at runtime + `pnpm seed`

# 5. Boot dev — Studio is at /studio
pnpm dev
```

---

## 6. Seed demo content

`code/projects/web/surfaces/website/scripts/seed.mjs` writes in a single transaction. `pnpm seed` writes only the **baseline** (the site singletons, legal pages, navigation, consent, the `blog` singleton with no pinned posts) — the blog stays empty. **`pnpm seed -- --demo`** adds the complete bilingual demo below. Every content document is translated (plugin-managed `language`) — each entity has an EN + FR version linked by a `translation.metadata` doc:

- **3 authors / locale** (Lovelace, Hopper, Berners-Lee) with Unsplash portraits
- **3 categories / locale**
- **10 tags / locale**
- **5 posts / locale**, each with a `metadata.image`, including a long-form "fast prototyping with Next.js" showcase per locale (see below)
- **2 quotes / locale** (testimonials, real Unsplash portraits)
- **3 people / locale** for the Person List module
- **`sidebarSettings-<locale>`** — **Articles** shows `blog-toc` + `blog-related` (the sidebar posts had before); the other page types inherit an empty default
- **The home `page` per locale** ends with an « Articles à la une » block (`blog-featured`, `layout: "editorial"`, `source: "flag"`, `limit: 4`, anchor `home-featured`)
- **1 `blog` singleton** — `postModules` empty (posts fall back to `DefaultPostLayout`); `frontpageModules` composed with `blog-hero` → `blog-featured` → `blog-category-spotlight` → `blog-collection` → `blog-post-list` → `blog-explore`, so `/blog` showcases the composable frontpage out of the box
- Plus the baseline the app needs: `siteMeta.<locale>` (per-language SEO), `siteSettings`, `legalPage`s, `navigation`, `cookieConsent`

Without `--demo`, the `blog` singleton drops the two blocks that pin demo documents (`blog-category-spotlight`, `blog-collection`).

The script prints the exact document total (`allDocs.length`) at commit time — it grows if you add content, so trust the console, not a fixed number.

The "fast prototyping" showcase post (`showcaseBody` in `seed.mjs`) exercises the body-editor primitives (H2–H4 headings, numbered + bulleted lists, code / strong / em / strike-through marks, inline image, link, blockquote) plus **12 inline module instances across 9 module types** (callout ×4 variants, stat-list, card-list, step-list, accordion-list, quote-list, person-list, custom-html, newsletter). Four inline types are not seeded: gallery (it needs uploaded images), lead-magnet, waitlist and contact. Prose and the `blog-*` blocks are not inline.

### Run

```bash
SANITY_API_WRITE_TOKEN=<your-editor-token> pnpm seed -- --demo
```

Or set `SANITY_API_WRITE_TOKEN` in `.env.local` and just run `pnpm seed -- --demo` — the npm script loads `.env.local` via `node --env-file=.env.local`.

**Guarded**: the seed refuses a dataset that already has content (a `siteSettings` document), because a re-seed replaces the editors' work. Add `--force` to re-seed a dataset you can lose: it upserts the same `_id`s via `createOrReplace`, so the content updates in place.

### Expected output

```text
Seeding into <projectId>/<dataset>…

✓ Cleanup: cleaned N post(s) + 0 blog singleton(s), removed orphan logos

Uploading <n> images to Sanity…
  <n>/<n> uploaded

Committing <total> documents…
✓ Committed transaction <uuid>

What you should see:
  /           → the home page; /contact, /waitlist, legal pages, cookie banner
  /blog       → composed frontpage (hero → featured → spotlight → collection → latest → explore)
  /blog/fast-prototyping-with-nextjs → every inline module (FR: /fr/blog/prototypage-rapide-avec-nextjs)
```

---

## 7. Full QA matrix

After seeding with `features.blog = true`.

### 7.1 Static checks

```bash
pnpm tsc             # → 0 errors
pnpm lint            # → 0 errors, 0 warnings
pnpm format:check    # → "All matched files use Prettier code style!"
pnpm verify:contrast # → "All pairs meet WCAG AA."
pnpm build           # → prerenders every static route × locale + the dynamic handlers
```

The build should list (among others): `/[locale]/blog`, `/[locale]/blog/[slug]` (10 static paths), `ƒ /[locale]/blog/[slug]/md`, `ƒ /[locale]/blog/rss.xml`, `ƒ /[locale]/blog/atom.xml`, `/[locale]/blog/category` + `/[slug]`, `/[locale]/blog/tag` + `/[slug]`, `/[locale]/author` + `/[slug]`, `ƒ /api/draft-mode/{enable,disable}`, `○ /studio/[[...tool]]`.

### 7.2 Public routes (curl)

`pnpm dev`, then in another shell:

```bash
# Home + blog frontpage
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/en/blog  # 200
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/fr/blog  # 200

# Fast-prototyping article, both locales
curl -sSL -o /dev/null -w "%{http_code}\n" \
  http://localhost:3000/en/blog/fast-prototyping-with-nextjs             # 200
curl -sSL -o /dev/null -w "%{http_code}\n" \
  http://localhost:3000/fr/blog/prototypage-rapide-avec-nextjs           # 200

# Cross-locale must 404 (post.language ≠ request locale)
curl -sSL -o /dev/null -w "%{http_code}\n" \
  http://localhost:3000/fr/blog/fast-prototyping-with-nextjs             # 404
curl -sSL -o /dev/null -w "%{http_code}\n" \
  http://localhost:3000/en/blog/prototypage-rapide-avec-nextjs           # 404

# Markdown export — YAML frontmatter (title, description, date, author, canonical)
curl -sS http://localhost:3000/en/blog/fast-prototyping-with-nextjs/md | head -8

# Feeds (5 EN / 5 FR posts each)
curl -sS http://localhost:3000/en/blog/rss.xml  | head -20   # <rss version="2.0" …>
curl -sS http://localhost:3000/en/blog/atom.xml | head -20   # <feed xmlns="…/Atom">

# Metadata routes (locale-agnostic)
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3000/sitemap.xml          # 200, lists /blog
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3000/robots.txt           # 200
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3000/manifest.webmanifest # 200

# llms.txt should now include the Blog section
curl -sS http://localhost:3000/en/llms.txt | grep -A 1 Blog
```

Favicon + OG image are `<link>`/`<meta>` to the Sanity CDN (`siteSettings.icon` / `siteMeta.ogImage`), not `/icon` or `/opengraph-image` routes.

### 7.3 Studio

Open <http://localhost:3000/studio> and log in with an account that owns the project.

- **Sidebar**: Blog (Mise en page + Articles/Auteurs/Catégories/Tags, each EN/FR) · Références (Citations/Personnes, EN/FR) · the core SEO & métadonnées / Navigation / Cookies / Pages légales sections.
- **Content** (after seeding): Articles list = 10 docs (5 EN, 5 FR); each preview shows `EN · <date>` or `FR · <date>`.
- Open Mise en page (singleton): a `Modules par article` array (empty by default → posts fall back to `DefaultPostLayout`) and a `Sections de l'accueil du blog` array (`frontpageModules`, composed by the seed → `/blog` renders it; empty → `DefaultBlogFrontpage`).
- Add a module from the picker — 27 types are selectable in either array (17 generic + the 10 layout blog blocks). The picker groups them (Mise en page · Contenu · Médias · Formulaires · Blog · Autres), each with an icon and a description. `blog-toc` and `blog-related` are sidebar cards only.
- Open **Site web → Barre latérale** → a language: **Cartes par défaut** + **Par type de page** (Accueil, Pages, Accueil du blog, Articles, Listes du blog). After seeding, **Articles** = « Cartes personnalisées » with Sommaire de l'article + Articles sur le même sujet.

### 7.4 Draft preview

Requires `SANITY_API_READ_TOKEN`.

1. Edit a post but only save (don't publish).
2. Visit:
   ```text
   http://localhost:3000/api/draft-mode/enable?sanity-preview-secret=<token>&sanity-preview-pathname=/en/blog/fast-prototyping-with-nextjs
   ```
3. You land on the post with **draft** content rendered.
4. Exit: `http://localhost:3000/api/draft-mode/disable`.

Without the token, `/enable` returns 503: `Draft preview unavailable — set SANITY_API_READ_TOKEN in your environment.`

### 7.5 Seeded inline modules

Visit `/en/blog/fast-prototyping-with-nextjs`, scroll top to bottom, verify each inline module renders (9 module types, 12 instances — Callout appears 4× with different variants; gallery, lead-magnet, waitlist and contact are not seeded):

1. **Callout (info)** — muted background, after the intro
2. **Stat list** — 4 stats (48h / 17 / 2 / AA) in a hairline grid
3. **Card list** — 3 cards, same hairline treatment
4. **Callout (warning)** — amber
5. **Step list** — 3 numbered steps with vertical connector
6. **Accordion list** — 3 expandable Q&As
7. **Quote list** — 2 testimonials (locale-filtered), portrait + role
8. **Person list** — 3 team members, centered avatars
9. **Callout (success)** — emerald
10. **Callout (danger)** — destructive red
11. **Custom HTML** — centered "raw HTML the editor controls" block
12. **Newsletter** — email capture form

Also verify the default `blockContent` primitives in the same post: heading hierarchy (H2–H4), numbered + bulleted lists, inline marks (`pnpm dev` as code, strong, strike-through), inline image, and the closing indiecrafts.dev link.

### 7.6 Per-post layout

With `postModules` empty, every `/blog/<slug>` renders via `DefaultPostLayout` (`code/modules/web/blog/src/user-interface/post/layout/DefaultPostLayout.tsx`): breadcrumbs, the hero, a rounded body panel with the sidebar cards beside it, the author bio, the share row, and a "Keep reading" grid. After seeding, the sidebar holds the table of contents and "More on {category}": from `lg` in an 18rem column that sticks below the header; below `lg` after the body, with the TOC opening from « Sur cette page » above the article. To swap in a module-driven shell for all posts, populate `postModules` from the Studio (e.g. `blog-post-content` → `quote-list` → `blog-post-list`). The fallback fires only when the array is empty.

### 7.7 Feature flag OFF (regression check)

Set `features.blog = false` (leave `studio: true`). After dev reload:

```bash
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/en/blog                                    # 404
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/en/blog/fast-prototyping-with-nextjs        # 404
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/en/blog/fast-prototyping-with-nextjs/md     # 404
curl -sS    -o /dev/null -w "%{http_code}\n" http://localhost:3000/en/blog/rss.xml                            # 404
curl -sS    -o /dev/null -w "%{http_code}\n" http://localhost:3000/en/blog/atom.xml                           # 404
curl -sS    -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/draft-mode/enable                      # 404
curl -sS    -o /dev/null -w "%{http_code}\n" http://localhost:3000/studio                                     # 200 (gated by features.studio)
```

No "Blog" link in the header; `/sitemap.xml` drops `/blog`; `/llms.txt` drops the Blog section. Set `features.studio = false` to 404 the Studio too.

---

## 8. Troubleshooting

### "Draft preview unavailable" (503)

`SANITY_API_READ_TOKEN` isn't set. Add it to `.env.local`. The 503 is intentional — the enable route returns it explicitly instead of the confusing 500 `defineEnableDraftMode` would throw at module load.

### Build fails: "Route used draftMode() inside generateStaticParams"

`generateStaticParams` can't call `sanityFetchLive` (it reads `draftMode()`). Use plain `client.fetch(query)` there — `blog/[slug]/page.tsx` already does. Note for any new route.

### Posts don't appear on `/en/blog` or `/fr/blog`

The post's language must equal the route locale. The `language` field is plugin-managed and hidden — switch it via the doc's **Translations** menu (top of the editor), not by editing a field. Queries use `coalesce(language, "en") == $locale`, so a missing language defaults to `en` (legacy docs).

### Studio shows "Schema migration needed"

Seeding against a dataset that predates the `language` field can flag legacy docs. The query fallback already handles them; opening each doc in the Studio auto-defaults the field to `en`.

### Seed script fails with 401/403

The write token is missing or lacks Editor permissions. Re-issue at <https://www.sanity.io/manage> → API → Tokens with role `Editor`. The script prints this hint on rejection.

### Removed a schema field, but old docs still expose it

Sanity keeps every previously-set field on a document forever — removing the schema entry hides it from the editor, but the data persists in JSON. Use `code/projects/web/surfaces/website/scripts/unset-legacy-fields.mjs` to unset a named field across every document in one transaction:

```bash
node --env-file=.env.local code/projects/web/surfaces/website/scripts/unset-legacy-fields.mjs
```

Edit the `TARGETS` array at the top (`[GROQ returning _ids, field-path to unset]`), run once, done. Idempotent — no matches reports `nothing to unset`. It currently ships pointing at `post.modules` (a field removed in an earlier release); adapt before running against a fresh dataset. **Never re-add `blog.frontpageModules`** — that name is live again (the composable blog frontpage, §6), and this script would delete it.

### Existing dataset: no sidebar, no featured strip on the home

A dataset seeded before the sidebar has no `sidebarSettings-<locale>`, and its home page has no « Articles à la une » block. Run the one-time migration from `code/projects/web/surfaces/website/`:

```bash
node --env-file=.env.local scripts/sidebar-migrate.mjs           # dry run: prints the plan
node --env-file=.env.local scripts/sidebar-migrate.mjs --apply   # writes it
```

It creates `sidebarSettings-<locale>` (Articles: `blog-toc` + `blog-related`), adds the featured block to each home page that has none, and unsets the removed `blog.display.post.tableOfContents`. It skips what is already done, so a re-run is safe.

### CSP blocks Studio API calls

Already allowed via `getCSPConnectSources()` in `code/packages/shared/config/src/types.ts`. If you customized it, keep `https://*.sanity.io` + `wss://*.api.sanity.io`.

### `/blog` 200s but is blank

With `frontpageModules` empty, the code-default `DefaultBlogFrontpage` is driven entirely by published posts, so a blank `/blog` means no posts in the requested locale — run `pnpm seed -- --demo` (on an empty dataset), or publish a post whose `language` matches the route. With `frontpageModules` composed, a blank page instead means every block resolved empty (e.g. `blog-collection`'s pins, or `blog-hero`/`blog-featured`'s source, don't match any post in that locale) — check the singleton's Sections de l'accueil du blog in the Studio.

### `/studio` shows "Configuration error"

Likely an unset `NEXT_PUBLIC_SANITY_PROJECT_ID` — `env.ts` asserts it. Check `.env.local`, restart dev.

---

## 9. Customization

### Add or remove a module

Follow [`packages/web/page-builder`](/packages/web/page-builder) § "Adding a block" rather than reconstructing it. **Where it lands depends on the block:**

- A **generic** block → **`@indiecrafts/packages-web-page-builder`**: schema in `sanity/schema/modules/<name>.ts` via `defineModule`, added to `moduleSchemas` + `MODULE_TYPES` in that package's `schema/modules/index.ts`; renderer in `@indiecrafts/packages-web-ui-components`; GROQ branch (only if it has refs) in the package's `MODULES_FRAGMENT`.
- A **blog-specific** block → the **blog**: schema in `sanity/schema/modules/<name>.ts`, added to `blogModuleSchemas` + `BLOG_MODULE_TYPES` in the blog's `schema/modules/index.ts`; renderer in `renderers/` + special-cased in `ModuleRenderer.tsx`.

A generic block adds a `<Name>Module` discriminant to the `BlockModule` union (`@indiecrafts/packages-web-ui-components` `src/shared/types.ts`); a blog block adds one to `AnyModule` (the blog's `sanity/types.ts`).

### Rename `/blog`

Two places in `code/packages/shared/config/src/`: `index.ts` → `pages.blog.slug` + `pages.blog.key`; `types.ts` → the `StaticAppPathname` + `DynamicAppPathname` unions. Routes, sitemap, and Studio sidebar follow automatically.

### Change locale set

Edit `locales` in `code/packages/shared/config/src/index.ts`, then drop `messages/<code>.json`. The Sanity side reads the same array — `documentInternationalization` `supportedLanguages`, the per-locale create templates, and the desk's language split (`languageSplit` in `structure.ts`) all derive from it. Every content type is translated with a plugin-managed (`readOnly` + `hidden`) `language` field, so there's no `options.list` to extend.

### Disable a module without deleting it

Every module has a `hidden` boolean (« Masqué », auto-injected by `defineModule`). Toggle it in the Studio — a hidden block renders nothing, at the top level and inline in rich text.

---

## 10. File map

```text
code/projects/web/surfaces/website/sanity.config.ts                     Studio config (schema, plugins, structure, i18n)
code/projects/web/surfaces/website/scripts/seed.mjs                pnpm seed — the baseline (+ demo with --demo)
code/projects/web/surfaces/website/scripts/unset-legacy-fields.mjs      one-shot field unset after a schema removal

code/packages/web/sanity/src/                          SHARED core infra
├── env.ts        projectId, dataset, apiVersion, studioBasePath
├── client.ts     read client (useCdn: false, stega.studioUrl)
├── token.ts      server-only SANITY_API_READ_TOKEN
├── live.ts       defineLive — sanityFetch / sanityFetchLive + <SanityLive />
└── structure.ts  core desk builders (SEO / nav / cookie / legal)

code/projects/web/surfaces/website/src/sanity/Studio.tsx                "use client" wrapper around <NextStudio>

code/modules/web/blog/src/                             THE BLOG MODULE (gated by features.blog)
├── lib/route-gate.ts    requireBlogRoute / isBlogRouteEnabled / isRssEnabled
├── sanity/
│   ├── queries.ts               every GROQ query (locale-filtered, defineQuery)
│   ├── types.ts                 TypeScript shapes for query results
│   ├── structure.ts             Studio sidebar layout
│   ├── portable-to-markdown.ts  PortableText → Markdown serializer
│   └── schema/                  (the 17 generic module schemas + blockContent/link/cta/define-module + quote/person live in @indiecrafts/packages-web-page-builder)
│       ├── index.ts             schemaTypes registry
│       ├── post.ts, author.ts, category.ts, tag.ts, series.ts
│       ├── documents/           blog (singleton), comment
│       ├── objects/             metadata
│       └── modules/             12 blog-specific schemas + index.ts (blogModuleSchemas, BLOG_MODULE_TYPES, BLOG_SECTION_TYPES, BLOG_SIDEBAR_TYPES)
└── user-interface/
    ├── blog/  post/  author/  category/  tag/  shared/   route-grouped UI
    └── renderers/               ModuleRenderer.tsx (composes BLOCK_RENDERERS) + 12 blog dispatchers
                                 (generic registry.tsx + renderers → @indiecrafts/packages-web-ui-components)

code/projects/web/surfaces/website/src/app/
├── studio/layout.tsx                              Studio root layout (own <html>/<body>)
├── studio/[[...tool]]/page.tsx                    embedded Studio (features.studio)
├── api/draft-mode/{enable,disable}/route.ts       draft preview toggles (features.studio)
└── [locale]/blog/
    ├── page.tsx                                   frontpage (frontpageModules → DefaultBlogFrontpage fallback)
    ├── frontpage-select.ts                        pickFrontpage(modules) → "modules" | "default"
    ├── [slug]/page.tsx                            detail (postModules → DefaultPostLayout fallback)
    ├── [slug]/md/route.ts                         Markdown export
    ├── rss.xml/route.ts  atom.xml/route.ts        feeds (features.blog + features.rss)
    ├── category/…  tag/…                          taxonomy listing + detail
    └── ../author/…                                author listing + detail
```
