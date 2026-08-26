# Composable Blog Frontpage — Design Spec

**Goal:** Turn the `/blog` frontpage from a fixed code layout into an editor-composable, module-driven
homepage (big hero + featured + curated custom sections), reusing the existing page-builder — with a
sensible default when unconfigured.

**Status:** design approved in chat (composability, sourcing, scope). Awaiting spec review → implementation plan.

**Date:** 2026-08-26

---

## Context

`/blog` today (`code/projects/web/surfaces/website/src/app/[locale]/blog/page.tsx`) renders a **fixed
chain**: `BlogHero` (5-card mosaic, or a simple grid when `display.frontpage.featuredHero` is off) →
`BlogSearchForm` → `ExploreCategories` → `ExploreTags` → `TopAuthors`. The blog singleton's own comment
states this is deliberately **not** editor-configurable ("chrome stays uniform across deployments").

Post pages (`/blog/[slug]`) are already module-driven: the blog singleton's `postModules[]` composes the
generic page-builder blocks + 3 blog-specific ones (`blog-index`, `blog-post-content`, `blog-post-list`)
through `ModuleRenderer`. This spec applies that same, proven pattern to the frontpage.

Reference analyzed: the Figma blog homepage — single big hero, a 3-col recent grid, a titled category
spotlight ("Insights on software"), a curated carousel ("Catch up on Config 2026"), featured topic cards
("News" / "Design systems"), a paginated latest list, and a newsletter signup.

## Decisions (locked in brainstorming)

1. **Fully composable.** A new `frontpageModules[]` array on the `blog` singleton drives the frontpage,
   mirroring `postModules[]`. **Empty ⇒ the current default chain** (hero → explore → newsletter), so the
   route works with zero setup and the "uniform chrome" safety net survives as the default.
2. **Auto rule + optional manual pin, per section.** Every dynamic block is rule-driven by default
   (latest / `featured` flag / by-category) and also accepts an optional `pinned` post list that takes
   precedence. Resolved server-side in GROQ.
3. **Full section catalog incl. Trending**, with Trending's data pipeline **decomposed into a separate
   sub-project** (§ Trending decomposition).

## Global Constraints (from the repo)

- **Config-first NEVERs:** no hard-coded brand/URL/color/nav; every user-facing string in
  `messages/<locale>.json`; route via `@/i18n/routing`; server tokens never `NEXT_PUBLIC_`.
- **Boundaries:** a package never imports an app; a module depends on packages + db, never an app or
  another module. New presentational primitives are `ui-components` (a package); blog data/glue is the
  blog module.
- **Design system:** tokens only (no raw hex/px), follow `DESIGN.md`; container queries for any block that
  renders in both the full-width slot and the ~768px column.
- **Stories are mandatory:** every rendered `ui-components` component ships a colocated `<Name>.stories.tsx`
  + `<Name>.md` (Storybook auto-discovers `ui-components/src/**/*.stories.tsx`; the `test:stories` CI job +
  the change-hygiene Stop hook enforce it). The blog **module is not** in the Storybook globs — this is
  why the reusable pieces live in `ui-components`.
- **Page-builder sync:** adding a `module.*` block touches schema + registry/types + renderer + inline
  lists + query + copy + doc counts in lockstep (the `page-builder-reviewer` checklist).

## Architecture

### The composition mechanism

- **Schema:** add `frontpageModules[]` to the `blog` singleton (`code/modules/web/blog/src/sanity/schema/documents/blog.ts`),
  of the generic `MODULE_TYPES` + the new blog-frontpage module types. New Studio field in the blog desk.
- **Route:** `/blog` `page.tsx` reads `blog.frontpageModules`. When non-empty it renders them through the
  blog's `ModuleRenderer` (extended dispatch). When empty it renders the **current default chain**,
  extracted verbatim into a `DefaultBlogFrontpage` component so both paths share one implementation.
- **Context:** the route prefetches the shared pool once (`allPostsQuery`, categories, tags, authors,
  `getBlogSettings`) and passes it as frontpage render context — analogous to the `{ locale, post }`
  context `postModules` already receives. Blocks select from the pool; blocks needing a distinct order
  (category spotlight, trending, pinned collections) resolve via their own GROQ fragment.
- **`ModuleRenderer` reuse:** the frontpage dispatch composes `BLOCK_RENDERERS`
  (`@indiecrafts/packages-web-ui-components`) + the new blog-frontpage dispatchers, exactly as the
  post-page renderer composes `BLOCK_RENDERERS` + the 3 existing blog dispatchers.

### Component placement (drives the stories requirement)

| Layer | Lives in | Storied? |
|---|---|---|
| Presentational primitives (visual layout over resolved data) | `ui-components/src/web/{layout,collection,media}/` | ✅ colocated `.stories.tsx` + `.md` |
| Blog-frontpage block **schemas** | blog module `sanity/schema/modules/` | n/a |
| Blog-frontpage **renderers** (fetch/select posts → map to primitives) | blog module `user-interface/renderers/` | n/a (glue) |

**New `ui-components` primitives (each gets a story + md):**
- `PostHero` (`layout/`) — one large post: cover/video, category, title, excerpt, author, date, tags.
  Reuses `FeaturedMedia` for the image/video.
- `FeaturedPosts` (`collection/`) — a lead card + a grid of N over resolved post-card items.
- `SpotlightRow` (`collection/`) — heading + subheading + a row of cards + a "view all" link.
- `Carousel` (`collection/`) — a horizontal scroll-snap track + prev/next controls + accessible slide
  labels (generic; content passed in). Distinct from the existing gallery carousel (that's media lightbox).
- `TopicCards` (`layout/`) — 1–3 large image + blurb + link cards.

Where a piece is irreducibly post-shaped and already exists, reuse it from the module (`BlogCard`,
`ExploreCategories`/`ExploreTags`/`TopAuthors`, `BlogListing`) rather than duplicating into `ui-components`.

### The block catalog

Every block schema shares the **auto + pin** shape: a `source`/options group + an optional `pinned`
reference array. Legends written for non-technical editors (`sanity-legends`).

| `module.*` | Default rule | Options | Optional pin | Renders |
|---|---|---|---|---|
| `blog-hero` | latest post | show author/date/tags | pin one post | `PostHero` |
| `blog-featured` | posts with `featured` flag | count, lead-card on/off | pin ordered posts | `FeaturedPosts` |
| `blog-latest` | most-recent feed | count, pagination on/off | — | `BlogListing` (reused) |
| `blog-category-spotlight` | latest N in a chosen category | category ref, count | pin posts | `SpotlightRow` + `BlogCard` |
| `blog-collection` | — | title, intro | ordered pinned posts | `Carousel` + `BlogCard` |
| `blog-topic-cards` | — | 1–3 cards: category/tag ref + image + blurb | — | `TopicCards` |
| `blog-explore` | variant: categories \| tags \| authors | heading/subheading/viewAll | — | existing `Explore*`/`TopAuthors` |
| `blog-trending` | popularity signal → **fallback: most-recent** | count, window | pin posts | `SpotlightRow`/`FeaturedPosts` |
| generic blocks | — | (newsletter, cta, prose, stat-list, …) | — | existing `BLOCK_RENDERERS` |

Newsletter uses the existing generic `module.newsletter`; no new block.

### Content model

- **`featured` flag** already exists on posts (`PostListItem.featured`) — `blog-featured` consumes it; no
  schema change beyond ensuring it's surfaced in the post editor + GROQ.
- **No new `collection` document** (YAGNI): `blog-collection` = title + pinned ordered posts. Add a real
  `collection` doc only if collections must be reused across pages.
- **Message keys:** new `pages.blog.frontpage.*` (block-level headings/labels the schema doesn't own, e.g.
  carousel prev/next aria, "view all" defaults) in both locales; per-block editorial text stays in Sanity.
- **`display.frontpage.featuredHero`** toggle becomes redundant once modules drive the page — the default
  chain keeps its behavior; document the deprecation, remove only if clean.

## Trending decomposition (sub-project, separate spec)

- **This spec (Project 1):** ships the `blog-trending` block reading a **popularity source behind a small
  interface**, with a **graceful fallback to most-recent** so it is never broken or blocking.
- **Project 2 (next spec):** the read-count pipeline — per-view increment (Cloudflare Analytics Engine or a
  D1 counter via the `api` worker) → aggregate → expose a popularity signal the block consumes. Its own
  design doc + plan; `blog-trending` flips from fallback to the real signal with no frontpage change.

## Reuse (do not reinvent)

- `ModuleRenderer` + `BLOCK_RENDERERS` composition — extend the frontpage dispatch, don't rebuild.
- `SanityModule` barrel pattern (`blogSanity`) — the new blocks register through the same contribution.
- `FeaturedMedia` (image/video-in-place), `BlogCard`, `Explore*`/`TopAuthors`, `BlogListing`,
  `parseVideoEmbed`, `formatDate`, typed `@/i18n/routing` `Link`.
- The blog's existing GROQ fragments + `defineQuery` (typegen-ready) for the post pool.

## Testing

- **Unit:** the source-rule + pin resolution (pin precedence, rule fills the rest, empty-pool fallbacks);
  GROQ shape for the new fragments; the empty-`frontpageModules` → default path.
- **Stories (the gate):** every new `ui-components` primitive gets a `.stories.tsx` (autodocs, a11y green)
  + `.md`; `test:stories` runs them as component + axe tests.
- **i18n:** key parity for the new `pages.blog.frontpage.*` keys (en/fr).
- **Verify:** `pnpm verify` (tsc + lint + format + contrast + react-doctor + test) green; visual check at
  375 / 768 / 1280 per `visual-verification`.

## Non-goals / YAGNI

- No new `collection` document (pinned posts suffice for v1).
- No read-count pipeline here (Project 2).
- No per-locale different frontpage composition (one `frontpageModules` structure, localized content).
- No drag-reordering UI beyond Sanity's native array ordering.

## Open questions

- None blocking. Popularity-source choice (Analytics Engine vs D1 counter) is deferred to Project 2.

## Issue tags

- `@debt E2E` — a Playwright journey for an editor-composed frontpage is out of scope here; the default
  path + stories cover v1.
