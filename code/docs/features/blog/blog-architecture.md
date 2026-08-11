# Blog architecture

For developers extending or debugging the blog. Single map of how a request lands on a rendered page, from URL to JSX.

Companion docs:

- Editor workflow: [`editor-guide.md`](./editor-guide.md)
- Body editor primitives: [`body-editor.md`](./body-editor.md)
- Initial setup + QA matrix: [`sanity-setup.md`](./sanity-setup.md)

---

## 1. Routes

Every blog route lives under `src/app/[locale]/`:

| URL                                | File                              | What it does                                                                                                                                                                    |
| ---------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/<locale>/blog`                   | `blog/page.tsx`                   | Frontpage. Hero card grid + ExploreCategories + ExploreTags + TopAuthors. Empty-state falls back to `BlogListing`. Never module-driven (chrome stays uniform).                  |
| `/<locale>/blog/<slug>`            | `blog/[slug]/page.tsx`            | Post detail. Module-driven if `blog.postModules.length > 0`, otherwise falls back to `DefaultPostLayout`.                                                                       |
| `/<locale>/blog/<slug>/md`         | `blog/[slug]/md/route.ts`         | Markdown export (YAML frontmatter + PortableText → Markdown via `src/features/blog/sanity/portable-to-markdown.ts`).                                                            |
| `/<locale>/blog/rss.xml`           | `blog/rss.xml/route.ts`           | RSS 2.0, locale-filtered. One feed per locale (`[locale]` segment; locales from `@/config`).                                                                                    |
| `/<locale>/blog/atom.xml`          | `blog/atom.xml/route.ts`          | Atom 1.0, locale-filtered. Same data + `isRssEnabled()` gate as RSS; ISO-8601 dates, `<feed>`/`<entry>` shape.                                                                  |
| `/<locale>/blog/category`          | `blog/category/page.tsx`          | Category listing (all topics with at least one post in the locale).                                                                                                             |
| `/<locale>/blog/category/<slug>`   | `blog/category/[slug]/page.tsx`   | Single category — posts filtered by `categories[]->_ref`.                                                                                                                       |
| `/<locale>/blog/tag`               | `blog/tag/page.tsx`               | Tag listing.                                                                                                                                                                    |
| `/<locale>/blog/tag/<slug>`        | `blog/tag/[slug]/page.tsx`        | Single tag.                                                                                                                                                                     |
| `/<locale>/author`                 | `author/page.tsx`                 | Author listing.                                                                                                                                                                 |
| `/<locale>/author/<slug>`          | `author/[slug]/page.tsx`          | Author profile + their posts. Authors are translated — the document is locale-filtered (EN/FR versions linked via `translation.metadata`), and so are the posts on the profile. |
| `/api/draft-mode/{enable,disable}` | `api/draft-mode/.../route.ts`     | Preview toggles. Gated by **`features.studio`** (404 when off); `/enable` also 503s when `SANITY_API_READ_TOKEN` is unset.                                                      |
| `/studio/[[...tool]]`              | `app/studio/[[...tool]]/page.tsx` | Embedded Sanity Studio. Gated by **`features.studio`**. Sits **outside** `[locale]/` (its own root layout at `app/studio/layout.tsx`) because Studio owns its own HTML shell.   |

All `/<locale>/blog/*` routes 404 when `features.blog === false`; the Studio + draft-mode surface is gated **independently** by `features.studio` (see `src/config/index.ts`). Public-route gating is centralized in `src/features/blog/lib/route-gate.ts` (`requireBlogRoute` for page components, `isBlogRouteEnabled` for route handlers). The RSS **and** Atom feeds additionally require `features.rss` (`isRssEnabled()`).

---

## 2. GROQ queries

Defined in `src/features/blog/sanity/queries.ts` and wired through `defineQuery` (typegen-ready). Every query that touches localized content filters by `$locale`.

### Fragments (composed into queries)

| Fragment             | Used by                                                                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST_LIST_FRAGMENT` | Every "list of posts" query (frontpage, related, category, tag, author)                                                                                     |
| `AUTHOR_FRAGMENT`    | Author detail + listing                                                                                                                                     |
| `TAG_FRAGMENT`       | Tag detail + listing                                                                                                                                        |
| `LINK_FRAGMENT`      | Resolves the `internal/external` union on CTAs into a single `href` string                                                                                  |
| `CTA_FRAGMENT`       | Wraps `LINK_FRAGMENT` for CTA-bearing modules                                                                                                               |
| `MODULES_FRAGMENT`   | Project body inline references — quote refs, person refs, callout CTA, card CTAs, inline image asset URL. Used by `postBySlugQuery` + `blogSingletonQuery`. |

`MODULES_FRAGMENT` is the magic that lets a post body contain inline modules whose references are resolved without a second round-trip:

```groq
body[]{ ${MODULES_FRAGMENT} }
```

Inside that fragment, each `_type == "module.X" => { ... }` branch projects the specific cross-references that module needs. Modules without references (Accordion, Stat List, Step List, Custom HTML) pass through unmodified via the leading `...`.

### Top-level queries

| Query                      | Locale-filtered?  | Consumed by                                            |
| -------------------------- | ----------------- | ------------------------------------------------------ |
| `allPostsQuery`            | yes               | `/blog`, `/blog/category` fallback                     |
| `featuredPostsQuery`       | yes               | `BlogHero` on `/blog`                                  |
| `postBySlugQuery`          | yes               | `/blog/[slug]`                                         |
| `relatedPostsQuery`        | yes               | "Keep reading" grid on post detail                     |
| `allPostSlugsQuery`        | no (multi-locale) | `generateStaticParams` for `/blog/[slug]`              |
| `rssPostsQuery`            | yes               | `/blog/rss.xml` + `/blog/atom.xml`                     |
| `blogSingletonQuery`       | n/a               | `/blog/[slug]` — pulls `postModules` shell             |
| `categoriesForLocaleQuery` | yes               | `/blog`, `/blog/category`                              |
| `categoryBySlugQuery`      | yes               | `/blog/category/[slug]`                                |
| `postsByCategorySlugQuery` | yes               | `/blog/category/[slug]`                                |
| `allCategorySlugsQuery`    | no                | `generateStaticParams` for `/blog/category/[slug]`     |
| `tagsForLocaleQuery`       | yes               | `/blog`, `/blog/tag`                                   |
| `tagBySlugQuery`           | yes               | `/blog/tag/[slug]`                                     |
| `postsByTagSlugQuery`      | yes               | `/blog/tag/[slug]`                                     |
| `allTagSlugsQuery`         | no                | `generateStaticParams` for `/blog/tag/[slug]`          |
| `authorsForLocaleQuery`    | yes               | `/blog`, `/author`                                     |
| `authorBySlugQuery`        | **yes**           | `/author/[slug]` — authors are translated (per locale) |
| `postsByAuthorSlugQuery`   | yes               | `/author/[slug]` — their posts in the active locale    |
| `allAuthorSlugsQuery`      | no                | `generateStaticParams` for `/author/[slug]`            |
| `moduleBlogPostListQuery`  | yes               | `module.blog-post-list` runtime fetch                  |

All locale-filtered queries use `coalesce(language, "en") == $locale` so legacy un-tagged docs default to EN — this is what keeps existing content visible after a schema migration that adds the `language` field.

---

## 3. Fetch + draft mode

`src/sanity/live.ts` defines `sanityFetchLive` via `next-sanity`'s `defineLive`. Every route imports this single helper:

```ts
const posts = await sanityFetchLive<PostListItem[]>({
  query: allPostsQuery,
  params: { locale },
});
```

What this gives us:

- **Live content**: when `<SanityLive />` is mounted in the layout (it is, when `features.blog === true`), the client subscribes to GROQ websocket updates. Edits in the Studio reflect on the live page within seconds without a redeploy.
- **Draft mode awareness**: when `draftMode().isEnabled === true`, `sanityFetchLive` switches the Sanity perspective to `drafts` (from `published`) and surfaces unpublished documents. The toggle is at `/api/draft-mode/{enable,disable}` (gated by `features.studio`).

`generateStaticParams` **and `app/sitemap.ts`** **cannot** call `sanityFetchLive` (they run at build time, with no request, and `sanityFetchLive` reads `draftMode()`). Use the plain `client.fetch(query)` there. Everywhere else — pages **and** route handlers (home featured posts, RSS/Atom feeds, the translated-slug API) — uses `sanityFetchLive`, so live revalidation + draft preview work uniformly. The existing `/blog/[slug]/page.tsx` follows this pattern — copy it when adding new dynamic routes.

---

## 4. Schemas (`src/features/blog/sanity/schema/`)

```
schema/
├── index.ts                       ← Registers everything for sanity.config.ts
├── post.ts                        ← Top-level post document
├── author.ts                      ← Author profile
├── category.ts                    ← Topic taxonomy
├── tag.ts                         ← Cross-cutting tags
├── blockContent.ts                ← Rich-text array def (lists, marks, inline modules allowlist)
├── documents/
│   ├── blog.ts                    ← Singleton (postModules layout slot)
│   ├── quote.ts                   ← Reusable testimonial
│   └── person.ts                  ← Reusable team member
├── objects/
│   ├── metadata.ts                ← Per-post SEO override
│   ├── link.ts                    ← Internal/external union for CTAs
│   ├── cta.ts                     ← Label + link
│   └── define-module.ts           ← Helper that auto-injects anchor + hidden fields
└── modules/
    ├── index.ts                   ← Module registry + MODULE_TYPES catalog
    └── <13 module schema files>
```

### Document types

| Schema             | Localized?           | Notes                                                               |
| ------------------ | -------------------- | ------------------------------------------------------------------- |
| `blog` (singleton) | shared               | One per dataset. Owns `postModules[]`.                              |
| `post`             | **yes** (`language`) | Has a `metadata` object for SEO override + body via `blockContent`. |
| `author`           | shared               | One author can write in any locale.                                 |
| `category`         | **yes**              | EN and FR categories are separate documents.                        |
| `tag`              | **yes**              | Same as category.                                                   |
| `quote`            | **yes**              | Same — quotes are language-tagged.                                  |
| `person`           | shared               | People are universal (same as authors).                             |

### Modules

Object types embedded inside the singleton's `postModules` array or directly inside post body (`blockContent`'s `INLINE_MODULES` list).

The catalog is the single source of truth in `src/features/blog/sanity/schema/modules/index.ts`:

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

`blog.ts` reads `MODULE_TYPES` to build its `postModules` array's `of: [...]` spec, so adding a module entry there automatically makes it pickable in the singleton. The inline-allowlist is a separate subset in `blockContent.ts`'s `INLINE_MODULES` (9 of the 13).

---

## 5. Renderer

All runtime files live under `src/features/blog/user-interface/renderers/`. The runtime mirrors the schema split around a single map:

- `registry.tsx` — the `SIMPLE_MODULES` map (`_type` → component), declared `satisfies { [K in SimpleModuleType]: SimpleRenderer<K> }` so a missing entry or drifted `_type` is a **compile error** (this is where TS exhaustiveness lives now). Exports `renderSimpleModule(module)` plus the two context-aware components (`BlogPostList`, `BlogPostContent`) that need extra render context.
- `ModuleRenderer.tsx` — `<Modules>` + `ModuleSwitch`. Filters out `hidden` modules, special-cases the two context-aware types (`module.blog-post-list` needs the locale, `module.blog-post-content` needs the active `Post`), and delegates everything else to `renderSimpleModule`. Used by the singleton's `postModules` slot.
- `portable-text-components.tsx` — `portableComponents` object passed to `<PortableText>`. Overrides only h2/h3/h4 (adds slug `id` + `scroll-mt-24` for the TOC), the external-link mark, inline images, and the inline modules; all other block styles / lists / decorators fall through to `@portabletext/react` defaults, styled visually by the `.prose` (`@tailwindcss/typography`) wrapper. Its inline-module `types` map is derived from the same `SIMPLE_MODULES` registry (via the `INLINE_TYPES` allowlist), so post bodies and `postModules` render each module from one source. Used by post bodies + every other `blockContent` consumer (callout content, accordion items, etc.).

Because both consumers pull from the same registry, a `Callout` inside a post body looks identical to a `Callout` placed in `postModules`.

---

## 6. Locale strategy

The shape: every route is mounted under `[locale]/`. `next-intl`'s `routing.ts` defines the supported locales (`en`, `fr`). Every page calls `setRequestLocale(locale)` at the top to register the locale with the i18n runtime.

For Sanity content, every read filters by `$locale` (param shown in §2). Documents that aren't language-tagged (`author`, `person`, `blog`) are visible to both locales by design.

For static generation:

- `generateStaticParams` returns one entry per `(locale, slug)` pair — e.g. an EN-only post produces one `{ locale: "en", slug }` entry; an FR-only post produces one `{ locale: "fr", slug }`.
- Posts visible in both locales would need **two separate documents** (one per `language`) — the seed does exactly this for the showcase post.

Cross-locale 404 protection: `postBySlugQuery` filters on `coalesce(language, "en") == $locale`, so an EN post slug requested under `/fr/blog/<slug>` returns null and the route 404s.

---

## 7. Post detail layout — `DefaultPostLayout`

When `blog.postModules` is empty (the seed's default), every post renders through `src/features/blog/user-interface/post/layout/DefaultPostLayout.tsx`. The design:

```
┌─────────────────────────────────────────────────────────┐
│ Hero card — touches the nav at top, rounded-b-3xl       │
│                                                         │
│   [breadcrumbs in a backdrop-blur pill]                 │
│                                                         │
│                                                         │
│                                          (image fills   │
│                                           the hero)     │
│                                                         │
│   [tag chips]                                           │
│   ## TITLE (leading-[1.05] magazine-tight)              │
│   description                                           │
│   ──────────────────────────                            │
│   author │ date · read time · category                  │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────┬──────────────────────┐
│ Body panel (bg-card,         │  TOC sidebar         │
│  rounded-3xl, no border)     │  (sticky top-24,     │
│  ↳ prose at max-w-3xl        │   only mounted when  │
│   left-aligned               │   post.headings ≠ 0) │
│                              │                      │
│ … (h2/h3/h4 anchors          │  • Section 1         │
│    feed the TOC)             │  • Section 2         │
│                              │    ◦ Subsection      │
└──────────────────────────────┴──────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Keep reading — 3 related posts (same categories)        │
└─────────────────────────────────────────────────────────┘
```

Notable details:

- The outer container uses `max-w-(--max-container)` (= 1280px from `theme.container.maxWidth`) — same width as the main nav, so the hero edges line up with the header underneath.
- Hero meta strip stacks vertically on mobile, becomes a horizontal row from `sm:` upward with vertical dividers between date / read time / category.
- Cover image is theme-aware: a `bg-gradient-to-t from-black/90 via-black/55 to-black/15` overlay sits between the image and content so the title stays legible regardless of the photo. Without an image, the hero falls back to a clean `bg-card` panel with the same shape and identical content layout.
- Breadcrumbs sit in a pill styled through hero CSS variables (`bg-(--hero-pill-bg) text-(--hero-fg) ring-(--hero-pill-ring) backdrop-blur-md`), so it stays legible over the cover image in both themes without per-theme class overrides. The `Breadcrumbs` component accepts an arbitrary outer `className` merged via `cn()`.
- The TOC sidebar renders only when `post.headings.length > 0` — when the body has no h2/h3/h4 anchors, the body panel claims the full column width.

To swap in a module-driven shell instead, populate `blog.postModules` from the Studio. Typical order:

1. `module.blog-post-content` — renders the active post's header + body (this is where DefaultPostLayout's job goes)
2. `module.quote-list` — testimonials
3. `module.blog-post-list` — "Keep reading" grid

Anything you build into `postModules` runs through `ModuleRenderer`, which means you can re-arrange / hide / theme per dataset without touching code.

---

## 8. Adding a module

1. **Schema** — create `src/features/blog/sanity/schema/modules/<name>.ts` using the `defineModule` helper:

   ```ts
   import { defineField } from "sanity";
   import { defineModule } from "../objects/define-module";

   export default defineModule({
     name: "module.your-name",
     title: "Your name",
     fields: [
       defineField({ name: "title", title: "Titre", type: "string" }),
       // …
     ],
   });
   ```

   `defineModule` auto-injects `anchor` + `hidden` fields.

2. **Register** — import into `src/features/blog/sanity/schema/modules/index.ts` and add to both `moduleSchemas` and `MODULE_TYPES`. The order in `MODULE_TYPES` controls how the Studio picker presents the options.

3. **Type** — declare a `<Name>Module` discriminant in `src/features/blog/sanity/types.ts` and add it to the `AnyModule` union. The compiler will then force you to add the new `_type` to the renderer registry.

4. **GROQ (only if you have refs)** — if the module references other docs, add a branch in `MODULES_FRAGMENT` (`src/features/blog/sanity/queries.ts`):

   ```groq
   _type == "module.your-name" => {
     someRef->{ _id, name, … }
   }
   ```

5. **Component** — drop `src/features/blog/user-interface/renderers/<Name>.tsx`. Follow the existing pattern: `py-8 md:py-12` outer padding, content centred on `max-w-6xl` or `max-w-3xl` depending on whether it's wide or narrow.

6. **Registry** — add the `_type` → component entry to `SIMPLE_MODULES` in `src/features/blog/user-interface/renderers/registry.tsx` (or, if the module needs the active `Post`/`locale`, special-case it in `ModuleRenderer.tsx` like `blog-post-content`/`blog-post-list`). The `satisfies` constraint on `SIMPLE_MODULES` flags the missing entry at build time.

7. **Inline-embeddable?** — if editors should be able to drop this module directly inside a post body (not just inside `postModules`), add the `_type` string to `INLINE_MODULES` in `src/features/blog/sanity/schema/blockContent.ts` **and** to `INLINE_TYPES` in `portable-text-components.tsx`.

---

## 9. Removing a module

The opposite of §8 — in this exact order to keep the build green:

1. Remove the module's `_type` from `INLINE_MODULES` (`blockContent.ts`) **and** from `INLINE_TYPES` in `portable-text-components.tsx`.
2. Remove the entry from `SIMPLE_MODULES` in `registry.tsx` (and any special-case in `ModuleRenderer.tsx`).
3. Remove the `<Name>Module` type + the union member in `src/features/blog/sanity/types.ts`.
4. Remove any branch from `MODULES_FRAGMENT`.
5. Remove the import + array entry in `src/features/blog/sanity/schema/modules/index.ts` (both `moduleSchemas` and `MODULE_TYPES`).
6. Delete the schema file (`src/features/blog/sanity/schema/modules/<name>.ts`) and the component file (`src/features/blog/user-interface/renderers/<Name>.tsx`).

**Live data hygiene** — existing instances of the removed module type may still be in your Sanity dataset:

- In `post.body[]` (inline) — add the `_type` to the `cleanupLegacy()` LEGACY_TYPES in `scripts/seed-demo.mjs` and re-seed (it strips legacy block types from post bodies before anything else).
- In `blog.postModules[]` — same script, same step.
- As orphan reference documents (e.g. the `logo` doc was deleted when Logo List was removed) — the script also targets these explicitly by ID + by `_type`.
- Schema fields that disappeared from a doc type entirely — use `scripts/unset-legacy-fields.mjs` to unset them in one transaction (see [`sanity-setup.md`](./sanity-setup.md) § Troubleshooting).

---

## 10. Live preview + draft mode (recap)

`<SanityLive />` is mounted in `src/app/[locale]/layout.tsx`, gated by `features.blog`. It opens a websocket subscription that re-fetches every `sanityFetchLive`-backed page when content changes. No redeploy needed.

Draft mode (`draftMode().isEnabled === true`) switches the perspective to `drafts`, surfacing the latest draft version of any document. Both routes are gated by **`features.studio`** (the editing surface they belong to) — 404 when that flag is off. Routes:

- `/api/draft-mode/enable?sanity-preview-secret=<TOKEN>&sanity-preview-pathname=/en/blog/<slug>` — turns it on and redirects to the requested path
- `/api/draft-mode/disable` — turns it off

The `SANITY_API_READ_TOKEN` env var must be set for the enable route. Without it (but with `features.studio` on), it returns 503 with an actionable error message rather than 500 on every request.

---

## 11. Sanity dataset hygiene

Two helper scripts in `scripts/`:

- **`seed-demo.mjs`** — populates the demo dataset (47 docs). Starts with a `cleanupLegacy()` step that strips orphan `module.hero-split` / `module.logo-list` blocks from post bodies and deletes leftover `logo` docs. Idempotent — re-run anytime to refresh.
- **`unset-legacy-fields.mjs`** — one-shot field unsets after a schema field is removed from a document. Edit the `TARGETS` array at the top, run once. See [`sanity-setup.md`](./sanity-setup.md) § Troubleshooting for the canonical command.

For ad-hoc inspection, the Sanity Vision plugin is embedded in the Studio — open `/studio` → bottom-tab `Vision` → run any GROQ query against the live dataset.

---

## 12. CSP allowlist

`src/config/types.ts` → `getCSPConnectSources()` returns:

- `https://*.sanity.io` (REST API)
- `wss://*.api.sanity.io` (websocket subscriptions for `<SanityLive />`)
- Plus whatever else the staging/production CSP needs

Don't remove these or the embedded Studio + live content stop working in staging/production.
