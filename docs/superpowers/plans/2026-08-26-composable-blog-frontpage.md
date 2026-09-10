# Composable Blog Frontpage — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the `/blog` frontpage a module-driven, editor-composable homepage (big hero + featured + curated custom sections), reusing the existing page-builder; a code default renders when unconfigured.

**Architecture:** Add `frontpageModules[]` to the `blog` singleton (mirrors `postModules[]`). The `/blog` route renders it through the blog's existing `Modules` dispatcher (extended with new blog-frontpage renderers); empty ⇒ a `DefaultBlogFrontpage` component holding today's fixed chain. Each new block is a `defineModule` schema + a self-fetching server renderer that maps posts onto a new **`ui-components`** presentational primitive (which ships a Storybook story). Dynamic blocks share an "auto rule + optional pin" shape, resolved in GROQ.

**Tech Stack:** Next.js 16 · React 19 · TypeScript strict · Tailwind v4 · Sanity v5 (GROQ, `defineModule`) · next-intl v4 · Storybook (`@storybook/nextjs-vite`, `test:stories`).

**Spec:** `docs/superpowers/specs/2026-08-26-composable-blog-frontpage-design.md`

## Global Constraints

- **Config-first NEVERs:** no hard-coded brand/URL/color/nav; every user-facing string in `messages/<locale>.json`; internal links via `@/i18n/routing` (`Link` from `@indiecrafts/packages-web-i18n` inside the module); no server token under `NEXT_PUBLIC_`.
- **Boundaries:** presentational primitives live in `@indiecrafts/packages-web-ui-components` (a package — Storybook globs it); post-fetching glue lives in `@indiecrafts/modules-web-blog` (a module — NOT globbed). A package never imports an app or the module.
- **Design system:** semantic tokens only (`bg-card`, `text-muted-foreground`, the spacing scale) — no raw hex/px; follow `DESIGN.md`. Any block that can render in the ~768px column uses container queries (`@container` on its own wrapper), not viewport media queries.
- **Stories are mandatory + are the visual test:** every new `ui-components` component ships a colocated `<Name>.stories.tsx` (`title: "UI Components/<Name>"`, `tags: ["autodocs"]`, description from `./<Name>.md?raw`) + a `<Name>.md`. `pnpm --filter @indiecrafts/web-tools-storybook test:stories` runs them as component + axe tests.
- **Auto + pin:** every dynamic block has a rule default and an optional `pinned` reference array; pins take precedence, the rule fills the rest, resolved in GROQ. Unset toggle = shown (`?? true`).
- **Page-builder sync (do in the SAME task that adds a block):** schema file + `blogModuleSchemas` array + `BLOG_MODULE_TYPES` + `types.ts` module type + `AnyModule` union + `ModuleSwitch` dispatch + query + copy. The `page-builder-reviewer` agent checks this.
- **Verify:** `pnpm verify` green; `pnpm --filter @indiecrafts/web-tools-storybook test:stories` green; visual check at 375 / 768 / 1280.
- **Field legends** (Sanity `title`/`description`) are French, plain, for non-technical editors (`.claude/rules/sanity-legends.md`). Agent-authored prose/commits follow `.claude/rules/writing-style.md`.

## Sequencing

- **Phase 1 (Tasks 1–5):** mechanism + Big Hero + Featured + Latest + Explore. Ships a working composable frontpage; Newsletter is the existing generic `module.newsletter` (no work).
- **Phase 2 (Tasks 6–9):** Category Spotlight + Collection/Carousel + Topic Cards + Trending (most-recent fallback).
- **Phase 3 (Task 10):** copy, docs, changelog, final verify + page-builder-reviewer.

## File Structure

**New — `ui-components` primitives (each + `.stories.tsx` + `.md`):**

- `code/packages/web/ui-components/src/web/layout/PostHero.tsx` — one large post.
- `code/packages/web/ui-components/src/web/collection/FeaturedPosts.tsx` — lead card + grid.
- `code/packages/web/ui-components/src/web/collection/SpotlightRow.tsx` — heading + card row + "view all".
- `code/packages/web/ui-components/src/web/collection/Carousel.tsx` — horizontal scroll-snap track + controls.
- `code/packages/web/ui-components/src/web/layout/TopicCards.tsx` — 1–3 image+blurb+link cards.

**New — blog module block schemas** (`code/modules/web/blog/src/sanity/schema/modules/`): `blog-hero.ts`, `blog-featured.ts`, `blog-latest.ts`, `blog-explore.ts`, `blog-category-spotlight.ts`, `blog-collection.ts`, `blog-topic-cards.ts`, `blog-trending.ts`.

**New — blog module renderers** (`code/modules/web/blog/src/user-interface/renderers/`): `BlogHero.tsx` (frontpage; NOTE the existing mosaic is `user-interface/blog/sections/BlogHero.tsx` — the new one is a renderer, name it `BlogHeroModule.tsx` to avoid collision), `BlogFeatured.tsx`, `BlogLatest.tsx`, `BlogExplore.tsx`, `BlogCategorySpotlight.tsx`, `BlogCollection.tsx`, `BlogTopicCards.tsx`, `BlogTrending.tsx`.

**New — blog module:** `code/modules/web/blog/src/user-interface/blog/sections/DefaultBlogFrontpage.tsx` (extracted default chain) · `code/modules/web/blog/src/lib/popularity.ts` (Trending interface + fallback).

**Modified:** `blog.ts` (add `frontpageModules`), `types.ts` (module types + `BlogSingleton.frontpageModules`), `sanity/schema/modules/index.ts` (register), `queries.ts` (project `frontpageModules` + per-block queries), `user-interface/renderers/ModuleRenderer.tsx` (dispatch + `ModuleContext`), `code/projects/web/surfaces/website/src/app/[locale]/blog/page.tsx` (render modules-or-default), `messages/{en,fr}.json` (`pages.blog.frontpage.*`), docs + changelog.

---

### Task 1: Composition mechanism (`frontpageModules` + route + default extraction)

**Files:**

- Modify: `code/modules/web/blog/src/sanity/schema/documents/blog.ts` (add the field)
- Modify: `code/modules/web/blog/src/sanity/types.ts` (`BlogSingleton.frontpageModules`)
- Modify: `code/modules/web/blog/src/sanity/queries.ts` (project `frontpageModules` in `blogSingletonQuery`)
- Modify: `code/modules/web/blog/src/user-interface/renderers/ModuleRenderer.tsx` (`ModuleContext` unchanged is fine — blocks self-fetch)
- Create: `code/modules/web/blog/src/user-interface/blog/sections/DefaultBlogFrontpage.tsx`
- Modify: `code/projects/web/surfaces/website/src/app/[locale]/blog/page.tsx`
- Test: `code/projects/web/surfaces/website/src/app/[locale]/blog/frontpage-select.test.ts`

**Interfaces:**

- Produces: `frontpageModules?: AnyModule[]` on `BlogSingleton`; `<DefaultBlogFrontpage posts locale t display categories tags authors searchAction searchLabels />` (the exact props the current default chain uses — copy them from the route).
- Consumes: existing `Modules` dispatcher (`{ modules, context: { locale } }`), `blogSingletonQuery`.

- [ ] **Step 1: Add the schema field.** In `blog.ts`, reuse `moduleFieldRefs` (already defined for `postModules`) and add, right after the `postModules` field:

```ts
defineField({
  name: "frontpageModules",
  title: "Sections de l'accueil du blog",
  description:
    "Compose la page /blog en empilant des sections (grande une, à la une, articles, pleins feux, carrousel, sujets, explorer, newsletter…). Vide = mise en page par défaut.",
  type: "array",
  of: moduleFieldRefs,
}),
```

- [ ] **Step 2: Type it.** In `types.ts`, add to `BlogSingleton`: `frontpageModules?: AnyModule[];` (beside `postModules`).
- [ ] **Step 3: Project it.** In `queries.ts`, add `frontpageModules[]{ <the same MODULES_FRAGMENT expansion postModules uses> }` to `blogSingletonQuery` (mirror the `postModules` projection line exactly).
- [ ] **Step 4: Write the failing test** for the route's selection rule (pure helper). Create `frontpage-select.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { pickFrontpage } from "./frontpage-select";
describe("pickFrontpage", () => {
  it("uses modules when present", () => {
    expect(
      pickFrontpage([{ _type: "module.blog-hero", _key: "a" }] as never),
    ).toBe("modules");
  });
  it("falls back to default when empty/undefined", () => {
    expect(pickFrontpage([])).toBe("default");
    expect(pickFrontpage(undefined)).toBe("default");
  });
});
```

- [ ] **Step 5: Run it — expect FAIL** (`pickFrontpage` not defined). `pnpm --filter @indiecrafts/web-surfaces-website test -- frontpage-select`.
- [ ] **Step 6: Implement.** Create `frontpage-select.ts` next to the route:

```ts
import type { AnyModule } from "@indiecrafts/modules-web-blog/sanity/types";
/** The frontpage renders editor modules when any exist, else the code default. */
export function pickFrontpage(
  modules: AnyModule[] | undefined,
): "modules" | "default" {
  return modules && modules.length > 0 ? "modules" : "default";
}
```

- [ ] **Step 7: Extract `DefaultBlogFrontpage`.** Move the current default chain (the `posts.length===0 ? BlogListing : <>…hero…search…explore…</>` block, lines ~101–174 of `page.tsx`) verbatim into `DefaultBlogFrontpage.tsx` as a server component taking the props the route already computed (`posts, locale, display, categories, tags, authors, t`, plus the search action/labels). Keep behavior identical.
- [ ] **Step 8: Rewire the route.** In `page.tsx`, after fetching `blog`, branch:

```tsx
{
  pickFrontpage(blog?.frontpageModules) === "modules" ? (
    <Modules modules={blog!.frontpageModules!} context={{ locale }} />
  ) : (
    <DefaultBlogFrontpage
      posts={posts}
      locale={locale}
      display={display}
      categories={categories}
      tags={tags}
      authors={authors}
      t={t}
      searchAction={localizedPathname("/blog/search", locale)}
      searchEnabled={isSearchEnabled()}
    />
  );
}
```

Import `Modules` from `@indiecrafts/modules-web-blog/user-interface/renderers/ModuleRenderer`.

- [ ] **Step 9: Run tests + tsc.** `pnpm --filter @indiecrafts/web-surfaces-website test -- frontpage-select` (PASS) and `pnpm --filter @indiecrafts/web-surfaces-website tsc`.
- [ ] **Step 10: Commit.** `git add -A && git commit -m "feat(blog): composable /blog frontpage via frontpageModules[] with default fallback"`

---

### Task 2: Big Hero (`PostHero` primitive + `module.blog-hero`)

**Files:**

- Create: `.../ui-components/src/web/layout/PostHero.tsx` + `PostHero.stories.tsx` + `PostHero.md`
- Create: `.../blog/src/sanity/schema/modules/blog-hero.ts`
- Create: `.../blog/src/user-interface/renderers/BlogHeroModule.tsx`
- Modify: `.../blog/src/sanity/queries.ts` (`blogHeroQuery`), `.../schema/modules/index.ts`, `.../sanity/types.ts`, `.../renderers/ModuleRenderer.tsx`

**Interfaces:**

- Produces: `PostHero` props `{ href: string; title: string; image?: string; lqip?: string; alt?: string; video?: string; category?: { title: string; href?: string }; author?: string; date?: string; playLabel: string }`.
- Produces schema `module.blog-hero` fields: `source` (`"latest" | "pinned"`), `pinned` (single post ref), `showMeta` (bool). Type `BlogHeroModule = ModuleBase & { _type: "module.blog-hero"; source?: "latest" | "pinned"; pinned?: { _ref: string }; showMeta?: boolean }`.

- [ ] **Step 1: Build `PostHero.tsx`** — a presentational large hero: full-width `FeaturedMedia` (reuse `@indiecrafts/packages-web-ui-components` `renderers/FeaturedMedia`) or `next/image` with gradient overlay, category chip (top), title (`h1`/`h2` — accept a `headingLevel` prop, default `h2`), excerpt, author · date. Overlaid text on image, tokens only, container-query friendly. Anchor wraps the title with `after:absolute after:inset-0` (whole-card click), external nav via plain `<a>` (primitive is app-agnostic — href is resolved by the caller).
- [ ] **Step 2: Write `PostHero.md`** — one paragraph: what it is (the frontpage lead post), props, when to use.
- [ ] **Step 3: Write `PostHero.stories.tsx`** mirroring `MoreOnTopic.stories.tsx`: `title: "UI Components/PostHero"`, `tags:["autodocs"]`, docs from `./PostHero.md?raw`, `args` with a realistic post (image URL from an existing story fixture), plus a `WithVideo` and a `NoImage` story.
- [ ] **Step 4: Run the story test — expect it to render + pass axe.** `pnpm --filter @indiecrafts/web-tools-storybook test:stories -- PostHero`.
- [ ] **Step 5: Schema.** `blog-hero.ts` via `defineModule` (mirror `blog-post-list.ts`): fields `source` (string, list `latest`/`pinned`, initial `latest`), `pinned` (reference to `post`, hidden unless `source==="pinned"`), `showMeta` (boolean, initial true, legend "Afficher l'auteur·rice et la date. Vide = affiché.").
- [ ] **Step 6: Query.** In `queries.ts`, add `blogHeroQuery` (params `{ locale, pinnedId }`): resolve the pinned post when `$pinnedId` is set, else the latest published post, projecting the existing post-card fragment (reuse the projection used by `moduleBlogPostListQuery` — factor it to a shared `POST_CARD_PROJECTION` const if not already, and reuse it in every block query below):

```groq
*[_type == "post" && language == $locale && !(_id in path("drafts.**"))
  && (!defined(seo.unpublished) || seo.unpublished == false)
  && (!defined($pinnedId) || _id == $pinnedId)]
  | order(select(defined($pinnedId) => 0, 1) asc, publishedAt desc)[0]{ POST_CARD_PROJECTION }
```

- [ ] **Step 7: Renderer.** `BlogHeroModule.tsx` (mirror `BlogPostList.tsx`): fetch via `blogHeroQuery` with `pinnedId: m.source === "pinned" ? m.pinned?._ref : undefined`; map the post → `PostHero` props (resolve `href` with `localizedPathname('/blog/'+slug, locale)`, category href likewise, `playLabel` from `getTranslations("pages.blog")` `t("playVideo")`); gate meta on `m.showMeta ?? true` AND `getBlogSettings().taxonomy.authors`; render nothing if no post.
- [ ] **Step 8: Register + dispatch + type.** Add `blogHero` to `blogModuleSchemas` + `"module.blog-hero"` to `BLOG_MODULE_TYPES`; add `BlogHeroModule` type + to the `AnyModule` union in `types.ts`; add `if (m._type === "module.blog-hero") return <BlogHeroModule module={m} locale={context.locale} />;` to `ModuleSwitch`.
- [ ] **Step 9: Verify.** `pnpm --filter @indiecrafts/web-surfaces-website tsc` + `test:stories -- PostHero`.
- [ ] **Step 10: Commit.** `git commit -m "feat(blog): Big Hero frontpage block (PostHero primitive + module.blog-hero)"`

---

### Task 3: Featured (`FeaturedPosts` primitive + `module.blog-featured`)

**Files:** `FeaturedPosts.{tsx,stories.tsx,md}` (ui-components/collection); `blog-featured.ts`; `BlogFeatured.tsx`; queries/index/types/dispatch as Task 2.

**Interfaces:** `FeaturedPosts` props `{ heading?: string; lead?: PostCardItem; items: PostCardItem[] }` where `PostCardItem = { _key: string; href: string; title: string; image?: string; lqip?: string; category?: string; author?: string; date?: string }`. Schema `module.blog-featured` fields: `title`, `source` (`"flag" | "pinned"`, initial `flag`), `pinned` (array of post refs, ordered), `limit` (number, initial 4), `leadCard` (bool, initial true). Type mirrors.

- [ ] **Step 1:** Build `FeaturedPosts.tsx` — when `lead` set, render it large (span 2) + the rest in a grid; else a plain grid. Reuse card visuals consistent with the site (compose the same overlay/style as `PostHero` at card size, or a compact card). Tokens only, container queries.
- [ ] **Step 2–4:** `.md` + `.stories.tsx` (`UI Components/FeaturedPosts`, `Default`, `NoLead`, `TwoItems`); run `test:stories -- FeaturedPosts`.
- [ ] **Step 5:** `blog-featured.ts` schema (mirror Task 2 Step 5; `pinned` is an array of post refs with the same locale-filter as `blog-post-list`'s `categories`).
- [ ] **Step 6:** `blogFeaturedQuery` (params `{ locale, pinnedIds, limit, useFlag }`): pinned posts first (in array order), then `featured == true` (when `useFlag`) filling to `limit`, deduped:

```groq
*[_type=="post" && language==$locale && !(_id in path("drafts.**")) && (!defined(seo.unpublished)||seo.unpublished==false)
  && (_id in $pinnedIds || ($useFlag && featured == true))]
  | order(select(_id in $pinnedIds => 0, 1) asc, publishedAt desc)[0...$limit]{ POST_CARD_PROJECTION }
```

(Pinned-order refinement — if array order must be exact, sort in the renderer by `pinnedIds.indexOf(_id)`.)

- [ ] **Step 7:** `BlogFeatured.tsx` — fetch, split `lead = m.leadCard ? posts[0] : undefined` + `items = m.leadCard ? posts.slice(1) : posts`, map → `FeaturedPosts`.
- [ ] **Step 8–10:** register/dispatch/type; verify; commit `feat(blog): Featured frontpage block`.

---

### Task 4: Latest (`module.blog-latest`, reuses `BlogListing`)

**Files:** `blog-latest.ts`; `BlogLatest.tsx`; queries/index/types/dispatch. **No new primitive** (reuse the module's `BlogListing`).

**Interfaces:** schema fields `title`, `intro`, `limit` (number, initial 12). Type `BlogLatestModule`.

- [ ] **Step 1:** `blog-latest.ts` (mirror `blog-post-list.ts` minus category/featured filters — or simply document that `module.blog-post-list` already exists and add `blog-latest` only if a distinct default+pagination is wanted; **decision: reuse `module.blog-post-list` for "latest" and SKIP a new block** — add a note in the editor guide that "Latest = Articles block with no filter". Cross it off if reuse is accepted).
- [ ] **Step 2:** If skipping (recommended): no code; verify `module.blog-post-list` is available in `frontpageModules` (it is — `moduleFieldRefs` includes all `BLOG_MODULE_TYPES`). Commit nothing.
- [ ] **Step 3 (only if a dedicated block is chosen):** implement mirroring Task 3 with `BlogListing` + `cols`. Commit `feat(blog): Latest frontpage block`.

---

### Task 5: Explore (`module.blog-explore`, variant wrapper)

**Files:** `blog-explore.ts`; `BlogExplore.tsx`; queries (reuse `categoriesForLocaleQuery`/`tagsForLocaleQuery`/`authorsForLocaleQuery`)/index/types/dispatch. **No new primitive** (wrap existing `ExploreCategories`/`ExploreTags`/`TopAuthors`).

**Interfaces:** schema fields `variant` (`"categories" | "tags" | "authors"`, required), `heading`, `subheading`, `viewAll`. Type `BlogExploreModule`.

- [ ] **Step 1:** `blog-explore.ts` schema (variant list + optional copy overrides; legends French).
- [ ] **Step 2:** `BlogExplore.tsx` — switch on `m.variant`, fetch the matching taxonomy (reuse existing queries), gate on `features.blogTaxonomy[variant]` (via injected `blogFlags`), render the existing section with copy = `m.heading ?? t("<variant>.heading")` etc. (`getTranslations("pages.blog")`).
- [ ] **Step 3:** register/dispatch/type.
- [ ] **Step 4:** verify tsc; commit `feat(blog): Explore frontpage block (categories/tags/authors variant)`.

**End of Phase 1** — run `pnpm verify` + `test:stories`; visually confirm a composed frontpage (hero + featured + articles + explore + newsletter) at 375/768/1280 before Phase 2.

---

### Task 6: Category Spotlight (`SpotlightRow` primitive + `module.blog-category-spotlight`)

**Files:** `SpotlightRow.{tsx,stories.tsx,md}` (ui-components/collection); `blog-category-spotlight.ts`; `BlogCategorySpotlight.tsx`; queries/index/types/dispatch.

**Interfaces:** `SpotlightRow` props `{ heading: string; subheading?: string; items: PostCardItem[]; viewAll?: { label: string; href: string } }`. Schema fields `category` (single ref, required), `count` (number, initial 4), `pinned` (post refs, optional), `subheading`. Heading defaults to the category title. Type `BlogCategorySpotlightModule`.

- [ ] **Step 1–4:** Build `SpotlightRow.tsx` (heading row + `viewAll` link + a horizontal or 3–4 col card row, container-query responsive) + `.md` + `.stories.tsx` (`UI Components/SpotlightRow`, `Default`, `NoViewAll`); `test:stories -- SpotlightRow`.
- [ ] **Step 5:** `blog-category-spotlight.ts` schema.
- [ ] **Step 6:** `blogCategorySpotlightQuery` (params `{ locale, categoryId, pinnedIds, count }`): pinned first, then latest in category, deduped, `[0...$count]`, plus resolve the category title/slug for the heading + `viewAll` href (`/blog/category/<slug>`).
- [ ] **Step 7:** `BlogCategorySpotlight.tsx` — fetch, map, heading = `m.heading ?? category.title`.
- [ ] **Step 8–10:** register/dispatch/type; verify; commit `feat(blog): Category Spotlight frontpage block`.

---

### Task 7: Collection / Carousel (`Carousel` primitive + `module.blog-collection`)

**Files:** `Carousel.{tsx,stories.tsx,md}` (ui-components/collection); `blog-collection.ts`; `BlogCollection.tsx`; queries/index/types/dispatch.

**Interfaces:** `Carousel` props `{ heading?: string; intro?: string; items: PostCardItem[]; labels: { prev: string; next: string; slide: string } }` — a CSS scroll-snap track (`overflow-x-auto snap-x`), prev/next buttons that scroll by one card (client component, `"use client"`), each slide labelled for a11y (`aria-roledescription="slide"`, `aria-label` via `labels.slide` with index). Schema `module.blog-collection` fields `title`, `intro`, `posts` (ordered post refs — pinned only, this block has no auto rule). Type `BlogCollectionModule`.

- [ ] **Step 1–4:** Build `Carousel.tsx` (client; keyboard-accessible buttons; `motion-reduce` respected; tokens) + `.md` + `.stories.tsx` (`UI Components/Carousel`, `Default`, `TwoSlides`); `test:stories -- Carousel`.
- [ ] **Step 5:** `blog-collection.ts` schema (`posts` array of post refs, required; `title`, `intro`).
- [ ] **Step 6:** `blogCollectionQuery` (params `{ locale, ids }`): fetch the referenced posts; renderer re-orders by `ids.indexOf(_id)`.
- [ ] **Step 7:** `BlogCollection.tsx` — fetch, order, labels from `getTranslations("pages.blog")` `frontpage.carousel.*`, map → `Carousel`.
- [ ] **Step 8–10:** register/dispatch/type; verify; commit `feat(blog): Collection/Carousel frontpage block`.

---

### Task 8: Topic Cards (`TopicCards` primitive + `module.blog-topic-cards`)

**Files:** `TopicCards.{tsx,stories.tsx,md}` (ui-components/layout); `blog-topic-cards.ts`; `BlogTopicCards.tsx`; index/types/dispatch (no post query — cards point at taxonomy).

**Interfaces:** `TopicCards` props `{ items: { _key: string; title: string; blurb?: string; image?: string; href: string }[] }` (1–3). Schema `module.blog-topic-cards` field `cards` (array, 1–3) each `{ target: reference(category|tag), image, title (override), blurb }`. Type `BlogTopicCardsModule`.

- [ ] **Step 1–4:** Build `TopicCards.tsx` (1–3 large image+overlayed title+blurb cards, responsive grid, whole-card link) + `.md` + `.stories.tsx` (`UI Components/TopicCards`, `Default`, `Single`, `Three`); `test:stories -- TopicCards`.
- [ ] **Step 5:** `blog-topic-cards.ts` schema (`cards` array with `validation: Rule.min(1).max(3)`; each card: `target` ref to `category`+`tag`, `image` with alt, `title` string, `blurb` text).
- [ ] **Step 6:** `blogTopicCardsQuery` OR resolve in-renderer: project each card's target `->{ title, slug, _type }` to build `href` (`/blog/category/<slug>` or `/blog/tag/<slug>`), `title = card.title ?? target.title`.
- [ ] **Step 7:** `BlogTopicCards.tsx` — map cards → `TopicCards` items.
- [ ] **Step 8–10:** register/dispatch/type; verify; commit `feat(blog): Topic Cards frontpage block`.

---

### Task 9: Trending (`module.blog-trending`, popularity interface + most-recent fallback)

**Files:** Create `code/modules/web/blog/src/lib/popularity.ts`; `blog-trending.ts`; `BlogTrending.tsx` (reuses `SpotlightRow` or `FeaturedPosts`); queries/index/types/dispatch. Test: `popularity.test.ts`.

**Interfaces:** `popularity.ts` exports `getPopularPostIds(locale: Locale, count: number): Promise<string[]>` — **Project-1 stub returns `[]`** (no data source yet) so the renderer falls back to most-recent. Schema fields `title`, `count` (initial 4), `pinned` (optional). Type `BlogTrendingModule`.

- [ ] **Step 1: Write the failing test** `popularity.test.ts`: `getPopularPostIds` returns `[]` in Project 1 (documents the seam), so callers must handle empty → fallback.

```ts
import { getPopularPostIds } from "./popularity";
it("returns empty until the read-count pipeline lands (Project 2)", async () => {
  expect(await getPopularPostIds("en", 4)).toEqual([]);
});
```

- [ ] **Step 2:** Run — FAIL (not defined).
- [ ] **Step 3:** Implement `popularity.ts`:

```ts
import type { Locale } from "@indiecrafts/packages-shared-config";
/**
 * Popularity signal for the Trending block. Project 1 has no read-count source,
 * so this returns [] and the renderer falls back to most-recent. Project 2
 * (read-count pipeline) replaces the body; the Trending block is unchanged.
 * @debt MIGRATION — wire to the read-count store (Analytics Engine / D1) in Project 2.
 */
export async function getPopularPostIds(
  _locale: Locale,
  _count: number,
): Promise<string[]> {
  return [];
}
```

- [ ] **Step 4:** Run — PASS.
- [ ] **Step 5:** `blog-trending.ts` schema (`title`, `count`, `pinned`).
- [ ] **Step 6:** `BlogTrending.tsx` — `const ids = await getPopularPostIds(locale, count);` then: if `ids.length` fetch those posts (ordered) else fetch most-recent `[0...count]` (reuse the latest query); prepend pinned; render via `SpotlightRow` with heading `m.title ?? t("frontpage.trending.heading")`. The block always renders content (never blank).
- [ ] **Step 7:** register/dispatch/type.
- [ ] **Step 8:** verify tsc + test; commit `feat(blog): Trending frontpage block (most-recent fallback; popularity seam)`.

---

### Task 10: Copy, docs, changelog, final gate

**Files:** `code/projects/web/surfaces/website/messages/{en,fr}.json`; `code/docs/modules/blog/editor-guide.md`; `code/modules/web/blog/.claude/CLAUDE.md`; `code/modules/CHANGELOG.md`; `code/packages/CHANGELOG.md`; `code/projects/web/tools/storybook/CHANGELOG.md`.

- [ ] **Step 1: Copy.** Add `pages.blog.frontpage.*` to both locales: `carousel.{prev,next,slide}`, `trending.heading`, and any default headings the blocks read when the editor leaves them blank (e.g. `spotlight.viewAll`). Keep en/fr in parity (the `messages.test.ts` gate).
- [ ] **Step 2: Editor guide.** In `editor-guide.md`, add a "Blog homepage sections" section: the `frontpageModules` list, each block, and the auto+pin behavior; note "empty = default layout" and "Latest = the Articles block".
- [ ] **Step 3: Brief.** Update `modules/web/blog/.claude/CLAUDE.md`: the frontpage is now module-driven (`frontpageModules`); list the new blocks; note new `ui-components` primitives (`PostHero`, `FeaturedPosts`, `SpotlightRow`, `Carousel`, `TopicCards`) and that renderers are glue. Update the `code/packages/web/ui-components/.claude/CLAUDE.md` brief with the 5 new components. Edit, don't append.
- [ ] **Step 4: Changelogs.** `code/modules/CHANGELOG.md` (blog composable frontpage + blocks), `code/packages/CHANGELOG.md` (5 new ui-components primitives), `code/projects/web/tools/storybook/CHANGELOG.md` (new stories). Plain-language _why_.
- [ ] **Step 5: page-builder-reviewer.** Run the `page-builder-reviewer` agent over the diff to confirm every block touched schema+registry+types+dispatch+query+copy+doc counts.
- [ ] **Step 6: Full gate.** `pnpm verify` (green) + `pnpm --filter @indiecrafts/web-tools-storybook test:stories` (green). Visual check at 375/768/1280 with a seeded, module-composed frontpage.
- [ ] **Step 7: Commit.** `git commit -m "docs(blog): document the composable frontpage + blocks; changelogs; copy"`

---

## Self-Review (author checklist)

- **Spec coverage:** mechanism (T1) ✓ · Big Hero (T2) ✓ · Featured (T3) ✓ · Latest (T4, reuse) ✓ · Explore (T5) ✓ · Category Spotlight (T6) ✓ · Collection/Carousel (T7) ✓ · Topic Cards (T8) ✓ · Trending + seam (T9) ✓ · stories for every new ui-components primitive (T2,3,6,7,8) ✓ · auto+pin (each block query) ✓ · Trending decomposition/fallback (T9) ✓ · no `collection` doc (T7 uses pinned posts) ✓ · copy/docs/changelog (T10) ✓.
- **Naming consistency:** `PostCardItem` shape used by FeaturedPosts/SpotlightRow/Carousel is one type — define it once in `ui-components/src/shared/types.ts` (or a local `card-item.ts`) and import in each primitive; the blog renderers build it. `BlogHeroModule` renderer file is named to avoid the existing `blog/sections/BlogHero.tsx`. `getPopularPostIds(locale, count)` signature identical in T9 test + impl + BlogTrending.
- **Reuse:** `POST_CARD_PROJECTION` GROQ fragment factored once and reused by every block query. `BlogCard`, `BlogListing`, `Explore*`/`TopAuthors`, `FeaturedMedia` reused, not duplicated.

## Open decision (confirm at execution)

- **Task 4 (Latest):** recommend REUSING `module.blog-post-list` as the "latest/articles" block rather than adding `module.blog-latest`. If you want a distinct pagination default, implement the dedicated block (Task 4 Step 3).
