---
title: "Featured articles"
description: 'FeaturedArticles is the home page''s "editor''s desk" — a curated strip of blog posts laid out as one lead pick beside a compact list of runners-up.'
status: stable
---

# Featured articles

`FeaturedArticles` is the home page's "editor's desk" — a curated strip of blog
posts laid out as one lead pick beside a compact list of runners-up. The asymmetry
is deliberate: it reads differently from the uniform `/blog` grid because the lead
genuinely outranks the rest. Component:
`src/user-interface/homepage/sections/FeaturedArticles.tsx`.

## Pure display, fed by the route

The section is presentational — it takes already-fetched posts and pre-resolved
labels as props. The **fetch, gating, and copy resolution happen in the route**,
`src/app/[locale]/(home)/page.tsx`:

```tsx
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { featuredPostsQuery } from "@indiecrafts/modules-web-blog/sanity/queries";

const tf = await getTranslations("pages.home.blocks.featured");
const featured: PostListItem[] = features.blog
  ? (
      await sanityFetchLive<PostListItem[]>({
        query: featuredPostsQuery,
        params: { locale },
      })
    ).slice(0, 4)
  : [];

{
  featured.length > 0 ? (
    <FeaturedArticles
      id="home-featured"
      posts={featured}
      locale={locale}
      eyebrow={tf("eyebrow")}
      title={tf("title")}
      body={tf("body")}
      viewAllLabel={tf("viewAll")}
    />
  ) : null;
}
```

Three gates decide whether it renders:

1. **`features.blog`** — when the blog feature is off, `featured` is `[]` and nothing fetches.
2. **`featuredPostsQuery`** (`code/modules/web/blog/src/sanity/queries.ts`) returns only posts an editor marked featured; up to 4 are kept (`.slice(0, 4)`).
3. **At least one post** — the mount is wrapped in `featured.length > 0`, and the component itself returns `null` when handed no lead post.

::: warning Live fetch, dynamic render
The fetch uses `sanityFetchLive` (from `@indiecrafts/packages-web-sanity/live`), not the static
client, so the strip live-updates through the `<SanityLive>` mount when an editor
publishes. That opts the home page into **dynamic rendering** — the deliberate
trade for content freshness. If you need the home page prerendered, swap in the
static client and drop the live behavior.
:::

## Props

```tsx
FeaturedArticles({
  id: string;              // seeds the section's DOM ids (aria-labelledby)
  posts: PostListItem[];   // lead = posts[0], secondary = next 3
  locale: Locale;          // for Intl date formatting
  eyebrow: string;         // pre-resolved copy…
  title: string;
  body: string;
  viewAllLabel: string;    // label on the "→ /blog" link
});
```

`PostListItem` comes from `@indiecrafts/modules-web-blog/sanity/types`. Copy is passed in
already-translated (the route resolves `pages.home.blocks.featured.*`) — the
component reads no `useTranslations` of its own, it just places strings. Add the
block to every `messages/<locale>.json` under `pages.home.blocks.featured`
(`eyebrow`, `title`, `body`, `viewAll`).

## Layout

- `posts[0]` renders as the large **`LeadCard`** (cover image, category chip, title, description, author · date). It spans all 12 columns when there are no runners-up, otherwise **7 of 12**.
- The next up to 3 posts render as compact **`SecondaryRow`** items in a divided list (**5 of 12** columns).
- Each card links via the locale-aware `Link` from `@/i18n/routing`. Images use `next/image` with per-breakpoint `sizes` and a `motion-reduce`-safe hover zoom.
- If a post has a video (`metadata.videoUrl` parses via `parseVideoEmbed` from `@indiecrafts/packages-shared-utils`), a `<PlayBadge>` (from `@indiecrafts/modules-web-blog/user-interface/shared/components/PlayBadge`) overlays its thumbnail. See [Video embeds](/projects/web/website/design/video-embeds).
- Dates go through `formatPostDate` (`@indiecrafts/packages-shared-utils`).

The section follows the standard [section conventions](/projects/web/website/design/sections):
`<section aria-labelledby="{id}-title">`, `px-(--gutter)`, `<h2>` heading. It mirrors
`BlogListing` — same data shape, a different and deliberately asymmetric presentation.
