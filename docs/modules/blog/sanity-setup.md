# Sanity setup & test guide

End-to-end reference for the Sanity-backed blog module (`@indiecrafts/blog`): configuration, schemas, routes, seeding, and the full QA matrix. The public surface stays gated by `features.blog` — flip it in `@indiecrafts/config` (`code/packages/config/src/index.ts`) to activate. The editing surface (Studio + draft preview) is a separate flag, `features.studio`.

---

## 1. What's wired

| Surface                    | Where                                          | Notes                                                                                                                                                                                     |
| -------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Embedded Studio            | `/studio`                                      | Catch-all at `src/app/studio/[[...tool]]/page.tsx` (own root layout `studio/layout.tsx`, outside `[locale]/`). Gated by **`features.studio`** — independent of `features.blog`.          |
| Public blog                | `/<locale>/blog` + `/<locale>/blog/<slug>`     | The frontpage is never module-driven (chrome stays uniform). Each `/blog/<slug>` renders via `DefaultPostLayout` when the `blog` singleton's `postModules` is empty; otherwise `postModules` drives it. |
| Markdown export            | `/<locale>/blog/<slug>/md`                     | YAML frontmatter + PortableText serialized to Markdown. Honors `metadata.noIndex` (hidden posts 404).                                                                                    |
| RSS feed                   | `/<locale>/blog/rss.xml`                       | RSS 2.0, locale-filtered. Requires `features.blog` **and** `features.rss` (`isRssEnabled()`).                                                                                            |
| Atom feed                  | `/<locale>/blog/atom.xml`                      | Atom 1.0 sibling of RSS — same data, same `isRssEnabled()` gate, ISO-8601 dates.                                                                                                          |
| Draft preview              | `/api/draft-mode/enable` + `/disable`          | Gated by **`features.studio`** (404 when off). `/enable` also 503s with an actionable message when `SANITY_API_READ_TOKEN` is missing.                                                   |
| Live content subscriptions | `<SanityLive />` in `[locale]/layout.tsx`      | Only mounted when `features.blog === true`.                                                                                                                                              |
| Header nav link            | `/blog` link                                   | Only shown when `features.blog === true`.                                                                                                                                                |
| Sitemap + llms.txt entries | `/sitemap.xml` + `/<locale>/llms.txt`          | Auto-included via `pages.blog.enabled = features.blog`.                                                                                                                                  |

---

## 2. Configuration

### Env vars (`.env.local`)

Template is `code/apps/web/.env.example`.

```bash
# ── Public (safe to expose) ──
NEXT_PUBLIC_SANITY_PROJECT_ID=          # your Sanity project ID
NEXT_PUBLIC_SANITY_DATASET=production   # default; the embedded Studio reads from here
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01  # query-stability pin; bump intentionally

# ── Server-only (NOT NEXT_PUBLIC_) ──
SANITY_API_READ_TOKEN=                  # Viewer role. Required for draft preview.
SANITY_API_WRITE_TOKEN=                 # Editor role. Only `pnpm seed` uses this.
```

`projectId` and `dataset` are asserted at import (`code/packages/sanity/src/env.ts` throws `Missing NEXT_PUBLIC_SANITY_…` if unset); `apiVersion` falls back to `"2025-01-01"`. Issue tokens at <https://www.sanity.io/manage> → your project → **API** → **Tokens** → **Add API token**. Full token reference (roles, CORS, security) in [`sanity-tokens.md`](./sanity-tokens.md).

### Whitelist your dev origin (CORS)

Required once per origin — without it the Studio at `http://localhost:3000/studio` throws `CorsOriginError` on every request.

```bash
pnpm dlx sanity@latest cors add http://localhost:3000 \
  --credentials --project-id <project-id>
```

`--credentials` lets the Studio's session cookie ride along. Repeat for every domain (staging, prod, preview branches) that talks to the project.

### Feature flags (`@indiecrafts/config`)

Two **independent** flags govern the blog, in `code/packages/config/src/index.ts`. `features.blog` is the public surface; `features.studio` is the editing surface. Keep the Studio on with `blog: false` so editors keep working while the public site is hidden, or turn `studio` off to freeze editing on a live site.

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

- `/blog`, `/blog/<slug>`, `/blog/<slug>/md`, `/blog/category` + `/<slug>`, `/blog/tag` + `/<slug>`, `/author` + `/<slug>`, `/blog/rss.xml`, `/blog/atom.xml` all 404 (gated via `@indiecrafts/blog/lib/route-gate`).
- `<SanityLive />` is not mounted in the layout.
- The header `/blog` link disappears.
- `pages.{blog,author,category,tag}.enabled` mirror the flag → sitemap + llms.txt drop the entries.
- `generateStaticParams` for every dynamic blog route returns `[]`, so the build skips Sanity calls.

**`features.blogTaxonomy.{authors,categories,tags}`** — each gates its own listing/detail routes (folded with `features.blog` in `pages.{author,category,tag}.enabled`).

**`features.studio` (editing surface)** — when `false`: `/studio` and `/api/draft-mode/{enable,disable}` return 404.

> The feeds honor `features.rss`: `/blog/rss.xml`, `/blog/atom.xml`, and their `<link rel="alternate">` tags require `features.blog` **and** `features.rss` (see `isRssEnabled()`).

### CSP allowlist (already configured)

`getCSPConnectSources()` in `code/packages/config/src/types.ts` returns `https://*.sanity.io` + `wss://*.api.sanity.io` so the Studio can reach the API in every environment. `next.config.ts` composes the CSP from this.

### Sanity infra files

Core Sanity infra is the shared package `@indiecrafts/sanity` (`code/packages/sanity/src/`); everything blog-specific lives inside the module at `code/modules/blog/src/sanity/`. The `"use client"` Studio wrapper stays in the app.

```text
code/apps/web/sanity.config.ts                          # schema list + structure + plugins
code/packages/sanity/src/env.ts                         # projectId, dataset, apiVersion, studioBasePath
code/packages/sanity/src/client.ts                      # read client (useCdn: false, stega.studioUrl)
code/packages/sanity/src/live.ts                        # defineLive — sanityFetch/sanityFetchLive + <SanityLive />
code/packages/sanity/src/token.ts                       # server-only SANITY_API_READ_TOKEN
code/packages/sanity/src/structure.ts                   # core desk builders (SEO/nav/cookie/legal)
code/apps/web/src/sanity/Studio.tsx                     # "use client" wrapper around <NextStudio>
code/modules/blog/src/sanity/structure.ts               # blog Studio sidebar groups
code/modules/blog/src/sanity/queries.ts                 # GROQ — every query filters by $locale
code/modules/blog/src/sanity/portable-to-markdown.ts    # PortableText → Markdown serializer
code/modules/blog/src/sanity/types.ts                   # TypeScript shapes for query results
```

---

## 3. Schemas

Blog schemas register via `code/modules/blog/src/sanity/schema/index.ts` (exported as `schemaTypes`), merged in `sanity.config.ts` as `schema.types: [...coreSchemaTypes, ...schemaTypes]`. Modules register via `code/modules/blog/src/sanity/schema/modules/index.ts`, which also exports `MODULE_TYPES` — the single `_type` source of truth used by both query fragments and the runtime renderer switch. Paths below are relative to `code/modules/blog/src/sanity/schema/`.

### Documents

| Schema             | File                  | Localized?           | Purpose                                                                              |
| ------------------ | --------------------- | -------------------- | ----------------------------------------------------------------------------------- |
| `blog` (singleton) | `documents/blog.ts`   | shared               | Owns `postModules[]` (per-post chrome). One per dataset; sidebar enforces.           |
| `post`             | `post.ts`             | **yes** (`language`) | Title, body (PortableText), **authors** (one or several refs), categories, featured flag, `metadata` object |
| `author`           | `author.ts`           | **yes** (`language`) | Name, position, slug, image, bio                                                    |
| `category`         | `category.ts`         | **yes** (`language`) | Title, description                                                                  |
| `tag`              | `tag.ts`              | **yes** (`language`) | Cross-cutting tags (title, slug)                                                    |
| `quote`            | `documents/quote.ts`  | **yes** (`language`) | Testimonial content + attribution                                                   |
| `person`           | `documents/person.ts` | **yes** (`language`) | Team-member docs for the Person List module                                         |

All seven content types are registered with `@sanity/document-internationalization` in `sanity.config.ts` (`languageField: "language"`, `supportedLanguages` derived from `@indiecrafts/config` `locales`) — plus core `legalPage`.

### Objects

| Object         | File                  | Used by                                            |
| -------------- | --------------------- | -------------------------------------------------- |
| `metadata`     | `objects/metadata.ts` | post (title/description/image/slug/noIndex)        |
| `seoMeta`      | `objects/seo-meta.ts` | shared SEO override shape                           |
| `blockContent` | `blockContent.ts`     | post body, accordion items, callout content, cards |
| `link`         | `objects/link.ts`     | inside `cta`. Internal refs target `post` only.    |
| `cta`          | `objects/cta.ts`      | callout, card-list, etc.                            |

### Modules — 13 `object` types (`schema/modules/`)

Embedded inside `blog.postModules` and (for the inline set) directly in a post body. `defineModule` (`objects/define-module.ts`) auto-injects an `anchor` + `hidden` field on every one.

| Module                     | File                           | Notes                                                 |
| -------------------------- | ------------------------------ | ----------------------------------------------------- |
| `module.accordion-list`    | `modules/accordion-list.ts`    | title + intro + items[{title, content}]               |
| `module.callout`           | `modules/callout.ts`           | variant (info/success/warning/danger) + content + cta |
| `module.card-list`         | `modules/card-list.ts`         | title + intro + columns + cards[]                     |
| `module.gallery`           | `modules/gallery.ts`           | image carousel + thumbnails + zoom lightbox (embla)   |
| `module.person-list`       | `modules/person-list.ts`       | title + intro + refs to `person`                      |
| `module.prose`             | `modules/prose.ts`             | content + width (narrow/wide)                         |
| `module.stat-list`         | `modules/stat-list.ts`         | title + intro + stats[{value, label}]                 |
| `module.step-list`         | `modules/step-list.ts`         | title + intro + steps[{title, content}]               |
| `module.quote-list`        | `modules/quote-list.ts`        | refs to `quote` (locale-filtered)                     |
| `module.custom-html`       | `modules/custom-html.ts`       | raw HTML — `dangerouslySetInnerHTML`                  |
| `module.blog-index`        | `modules/blog-index.ts`        | frontpage hero                                        |
| `module.blog-post-content` | `modules/blog-post-content.ts` | renders the active post (slot)                        |
| `module.blog-post-list`    | `modules/blog-post-list.ts`    | filtered post grid (limit, categories, featuredOnly)  |

**9 are inline-embeddable** in a post body (`INLINE_MODULES` in `blockContent.ts`): accordion-list, callout, card-list, custom-html, gallery, person-list, quote-list, stat-list, step-list. The other **4 are `postModules`-only**: prose, blog-index, blog-post-content, blog-post-list.

### Renderer

`code/modules/blog/src/user-interface/renderers/registry.tsx` holds the `SIMPLE_MODULES` map (`_type` → component), constrained with `satisfies` so a missing entry is a **compile error** — that's where TS exhaustiveness lives. `ModuleRenderer.tsx` (`<Modules>` + `ModuleSwitch`) consumes that registry, special-casing the two context-aware modules. Each module has a matching component in the same directory.

### Studio sidebar (`code/modules/blog/src/sanity/structure.ts`)

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

Each localized type expands to `English` / `Français` leaves plus a `Toutes les langues` view; each leaf pre-seeds `language` via the per-`(type, locale)` create templates defined in `sanity.config.ts`. The core SEO/nav/cookie/legal sections come from `@indiecrafts/sanity/structure` (feature-independent). Modules are object types, so editors only meet them via the picker inside `postModules` or inline in a post body.

---

## 4. Routes

| Route                                  | Type    | Gated                                       | Reads from                                         |
| -------------------------------------- | ------- | ------------------------------------------- | -------------------------------------------------- |
| `/<locale>`                            | static  | —                                           | `messages/<locale>.json`                           |
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

Every GROQ query filters `coalesce(language, "en") == $locale`, so a post whose language doesn't match the requested locale 404s — and legacy un-tagged docs default to `en`. `proxy.ts` matcher excludes `/studio` and `/api`; it explicitly includes `/llms.txt`, `/llms-full.txt`, `/llms/:path*`, `/blog/rss.xml`, `/blog/:slug/md`.

---

## 5. Initial setup (one-time)

```bash
# 1. Install deps
pnpm install

# 2. Copy env template; fill in project ID + dataset
cp code/apps/web/.env.example code/apps/web/.env.local
# Edit .env.local — at minimum NEXT_PUBLIC_SANITY_PROJECT_ID + _DATASET

# 3. features.blog is on by default in code/packages/config/src/index.ts
#    (set it false to hide the public surface)

# 4. (Optional) Issue tokens at https://www.sanity.io/manage
#    SANITY_API_READ_TOKEN  → draft preview
#    SANITY_API_WRITE_TOKEN → `pnpm seed`

# 5. Boot dev — Studio is at /studio
pnpm dev
```

---

## 6. Seed demo content

`code/apps/web/scripts/seed-demo.mjs` populates a complete bilingual demo dataset in a single transaction. Every content document is translated (plugin-managed `language`) — each entity has an EN + FR version linked by a `translation.metadata` doc:

- **3 authors / locale** (Lovelace, Hopper, Berners-Lee) with Unsplash portraits
- **3 categories / locale**
- **10 tags / locale**
- **5 posts / locale**, each with a `metadata.image`, including a long-form "fast prototyping with Next.js" showcase per locale (see below)
- **2 quotes / locale** (testimonials, real Unsplash portraits)
- **3 people / locale** for the Person List module
- **1 `blog` singleton** — `postModules` empty, so posts fall back to `DefaultPostLayout`
- Plus the site singletons the app needs: `siteMeta.<locale>` (per-language SEO), `siteSettings`, `legalPage`s, `navigation`, `cookieConsent`

The script prints the exact document total (`allDocs.length`) at commit time — it grows if you add content, so trust the console, not a fixed number.

The "fast prototyping" showcase post exercises **every body-editor primitive** (H1–H6, numbered + bulleted lists, code / strong / em / strike-through marks, inline image, link, blockquote) plus **11 inline module instances across 8 module types** (callout ×4 variants, stat-list, card-list, step-list, accordion-list, quote-list, person-list, custom-html). The gallery, prose, and `blog-*` modules are excluded — gallery needs uploaded images; the rest are `postModules`-only.

Before the transaction commits, `cleanupLegacy()` scrubs any leftover `module.hero-split` / `module.logo-list` blocks from post bodies and deletes orphan `logo` docs in the correct reference order — so re-running the seed is safe even against an older dataset that predates this template.

### Run

```bash
SANITY_API_WRITE_TOKEN=<your-editor-token> pnpm seed
```

Or set `SANITY_API_WRITE_TOKEN` in `.env.local` and just run `pnpm seed` — the npm script loads `.env.local` via `node --env-file=.env.local`.

**Idempotent**: re-running upserts the same `_id`s via `createOrReplace`. Tweak the script and re-run to update content in place.

### Expected output

```text
Seeding into <projectId>/<dataset>…

✓ Cleanup: cleaned N post(s) + 0 blog singleton(s), removed orphan logos

Uploading <n> images to Sanity…
  <n>/<n> uploaded

Committing <total> documents…
✓ Committed transaction <uuid>

What you should see:
  /blog                                 → minimal card grid
  /blog/fast-prototyping-with-nextjs    → ALL 17 modules
  /blog/prototypage-rapide-avec-nextjs  → ALL 17 modules (FR)
  any other post                         → default article layout
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
- Open Mise en page (singleton): one `Modules par article` array, empty by default → posts fall back to `DefaultPostLayout`.
- Add a module from the picker — all 13 catalog types are selectable.

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

Visit `/en/blog/fast-prototyping-with-nextjs`, scroll top to bottom, verify each inline module renders (8 module types, 11 instances — Callout appears 4× with different variants; gallery/prose/`blog-*` are not seeded):

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

Also verify the default `blockContent` primitives in the same post: heading hierarchy (H2–H6), numbered + bulleted lists, inline marks (`pnpm dev` as code, strong, strike-through), inline image, and the closing indiecrafts.dev link.

### 7.6 Per-post layout

With `postModules` empty, every `/blog/<slug>` renders via `DefaultPostLayout` (`code/modules/blog/src/user-interface/post/layout/DefaultPostLayout.tsx`): full-width hero card, breadcrumbs in a backdrop-blur pill, a sticky TOC sidebar (`top-24`, mounted only when the body has an h2/h3/h4), a rounded body panel, and a "Keep reading" grid. To swap in a module-driven shell for all posts, populate `postModules` from the Studio (e.g. `blog-post-content` → `quote-list` → `blog-post-list`). The fallback fires only when the array is empty.

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

Sanity keeps every previously-set field on a document forever — removing the schema entry hides it from the editor, but the data persists in JSON. Use `code/apps/web/scripts/unset-legacy-fields.mjs` to unset a named field across every document in one transaction:

```bash
node --env-file=.env.local code/apps/web/scripts/unset-legacy-fields.mjs
```

Edit the `TARGETS` array at the top (`[GROQ returning _ids, field-path to unset]`), run once, done. Idempotent — no matches reports `nothing to unset`. It currently ships pointing at `post.modules` + `blog.frontpageModules` (fields removed in earlier releases); adapt or comment out before running against a fresh dataset.

### CSP blocks Studio API calls

Already allowed via `getCSPConnectSources()` in `code/packages/config/src/types.ts`. If you customized it, keep `https://*.sanity.io` + `wss://*.api.sanity.io`.

### `/blog` 200s but is blank

The frontpage is driven entirely by published posts (never module-driven), so a blank `/blog` means no posts in the requested locale. Run `pnpm seed`, or publish a post whose `language` matches the route.

### `/studio` shows "Configuration error"

Likely an unset `NEXT_PUBLIC_SANITY_PROJECT_ID` — `env.ts` asserts it. Check `.env.local`, restart dev.

---

## 9. Customization

### Add or remove a module

Touches ~8 code locations plus doc count-refs — follow the checklist rather than reconstructing it: `method/apps/web/workflows/add-blog-module.md` / `remove-blog-module.md`. The shape:

1. **Schema** — `code/modules/blog/src/sanity/schema/modules/<name>.ts` via `defineModule`.
2. **Register** — add to `moduleSchemas` + `MODULE_TYPES` in `schema/modules/index.ts`.
3. **Type** — add a `<Name>Module` discriminant to the `AnyModule` union in `sanity/types.ts`.
4. **GROQ** — only if the module has cross-references: add a `_type == "module.<name>" => { … }` branch to `MODULES_FRAGMENT` in `sanity/queries.ts`.
5. **Component** — `user-interface/renderers/<Name>.tsx`.
6. **Registry** — add the `_type` → component entry to `SIMPLE_MODULES` in `renderers/registry.tsx` (the `satisfies` check flags a missing one). Context-aware modules are special-cased in `ModuleRenderer.tsx` instead.

### Rename `/blog`

Two places in `code/packages/config/src/`: `index.ts` → `pages.blog.slug` + `pages.blog.key`; `types.ts` → the `StaticAppPathname` + `DynamicAppPathname` unions. Routes, sitemap, and Studio sidebar follow automatically.

### Change locale set

Edit `locales` in `code/packages/config/src/index.ts`, then drop `messages/<code>.json`. The Sanity side reads the same array — `documentInternationalization` `supportedLanguages`, the per-locale create templates, and the desk's language split (`languageSplit` in `structure.ts`) all derive from it. Every content type is translated with a plugin-managed (`readOnly` + `hidden`) `language` field, so there's no `options.list` to extend.

### Disable a module without deleting it

Every module has a `hidden` boolean (auto-injected by `defineModule`). Toggle it in the Studio — the renderer skips hidden modules.

---

## 10. File map

```text
code/apps/web/sanity.config.ts                     Studio config (schema, plugins, structure, i18n)
code/apps/web/scripts/seed-demo.mjs                pnpm seed — populates the demo dataset
code/apps/web/scripts/unset-legacy-fields.mjs      one-shot field unset after a schema removal

code/packages/sanity/src/                          SHARED core infra
├── env.ts        projectId, dataset, apiVersion, studioBasePath
├── client.ts     read client (useCdn: false, stega.studioUrl)
├── token.ts      server-only SANITY_API_READ_TOKEN
├── live.ts       defineLive — sanityFetch / sanityFetchLive + <SanityLive />
└── structure.ts  core desk builders (SEO / nav / cookie / legal)

code/apps/web/src/sanity/Studio.tsx                "use client" wrapper around <NextStudio>

code/modules/blog/src/                             THE BLOG MODULE (gated by features.blog)
├── lib/route-gate.ts    requireBlogRoute / isBlogRouteEnabled / isRssEnabled
├── sanity/
│   ├── queries.ts               every GROQ query (locale-filtered, defineQuery)
│   ├── types.ts                 TypeScript shapes for query results
│   ├── structure.ts             Studio sidebar layout
│   ├── portable-to-markdown.ts  PortableText → Markdown serializer
│   └── schema/
│       ├── index.ts             schemaTypes registry
│       ├── post.ts, author.ts, category.ts, tag.ts, blockContent.ts
│       ├── documents/           blog (singleton), quote, person
│       ├── objects/             metadata, seo-meta, link, cta, define-module
│       └── modules/             13 module schemas + index.ts (moduleSchemas, MODULE_TYPES)
└── user-interface/
    ├── blog/  post/  author/  category/  tag/  shared/   route-grouped UI
    └── renderers/               registry.tsx (SIMPLE_MODULES) + ModuleRenderer.tsx + module components

code/apps/web/src/app/
├── studio/layout.tsx                              Studio root layout (own <html>/<body>)
├── studio/[[...tool]]/page.tsx                    embedded Studio (features.studio)
├── api/draft-mode/{enable,disable}/route.ts       draft preview toggles (features.studio)
└── [locale]/blog/
    ├── page.tsx                                   frontpage (post grid; never module-driven)
    ├── [slug]/page.tsx                            detail (postModules → DefaultPostLayout fallback)
    ├── [slug]/md/route.ts                         Markdown export
    ├── rss.xml/route.ts  atom.xml/route.ts        feeds (features.blog + features.rss)
    ├── category/…  tag/…                          taxonomy listing + detail
    └── ../author/…                                author listing + detail
```
