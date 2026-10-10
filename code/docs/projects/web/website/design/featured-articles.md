---
title: "Featured posts (editorial layout)"
description: "The editorial layout of the blog-featured block: one lead post beside a short list of runners-up. The home page's « Articles à la une » strip uses it."
status: stable
---

# Featured posts (editorial layout)

The `editorial` layout of the `module.blog-featured` block shows one lead post beside a
short list of runners-up. The lead outranks the rest, so the strip reads differently from
the uniform `/blog` grid. The home page's « Articles à la une » strip is this block.

## Where it comes from

The home page has no hard-coded featured strip. The strip is a `module.blog-featured` block
at the end of the home `page`'s `sections[]`:

| Field     | Seeded value                                                   |
| --------- | -------------------------------------------------------------- |
| `layout`  | `editorial`                                                    |
| `source`  | `flag` (the posts marked « Mis en avant »)                     |
| `limit`   | `4`                                                            |
| `anchor`  | `home-featured`                                                |
| `eyebrow` | « Featured » / « À la une »                                    |
| `title`   | « Notes from the studio » / « Notes de l'atelier »             |
| `intro`   | One sentence under the title.                                  |
| `viewAll` | « All articles » / « Tous les articles » (the link to `/blog`) |

The seed writes it in both locales (`homeFeaturedBlock` in `scripts/lib/blocks-sidebar.mjs`).
An editor changes it in **Studio → Accueil**. Its copy lives in Sanity, not in
`messages/<locale>.json`. For an existing dataset, `scripts/sidebar-migrate.mjs` adds the
block to each home page that has none.

Any `page` can hold the same block: `page.sections[]` accepts the blog blocks
(`BLOG_SECTION_TYPES`). With `features.blog` off, the website drops every blog block.

## The block's fields

| Studio label                   | Field      | Effect                                                                             |
| ------------------------------ | ---------- | ---------------------------------------------------------------------------------- |
| **Présentation**               | `layout`   | `grid` (default): a lead card over a grid. `editorial`: a lead card beside a list. |
| **Surtitre**                   | `eyebrow`  | Small text above the title. Empty = hidden.                                        |
| **Titre**                      | `title`    | The section heading (`<h2>`).                                                      |
| **Introduction**               | `intro`    | One sentence under the title. Empty = hidden.                                      |
| **Lien « Tous les articles »** | `viewAll`  | The text of the link to the blog. Empty = no link.                                 |
| **Articles affichés**          | `source`   | `flag`: the latest posts marked « Mis en avant ». `pinned`: a fixed list.          |
| **Articles choisis**           | `pinned`   | The pinned posts, in display order. Shown only with `pinned`.                      |
| **Limite**                     | `limit`    | The most posts shown (1–20, default 4).                                            |
| **Premier article en grand**   | `leadCard` | `grid` only. The `editorial` layout always leads with its first post.              |

## Render path

1. The blog's `Modules` dispatcher sends the block to `BlogFeatured`
   (`code/modules/web/blog/src/user-interface/renderers/BlogFeatured.tsx`).
2. `BlogFeatured` fetches the posts with `blogFeaturedQuery` (`sanityFetchLive`). It keeps the
   editor's pin order and maps each post to a `PostCardItem`.
3. It renders `FeaturedPosts` (`@indiecrafts/packages-web-ui-components`,
   `src/web/collection/FeaturedPosts.tsx`) with `layout`, the header copy and the cards.
4. With `layout: "editorial"`, `FeaturedPosts` renders `FeaturedEditorial`
   (`src/web/collection/FeaturedEditorial.tsx`) under its header.

The block renders nothing when no post matches. In a sidebar card, `BlogFeatured` renders a
compact list of links (`PostLinks`) instead.

`BlogFeatured` reads through `sanityFetchLive`, so the strip updates live through
`<SanityLive>` when an editor publishes, and shows drafts in draft preview.

## Layout

`FeaturedEditorial` is container-query driven. It sizes itself from the width of its
container, not the viewport, so it fits a full-width section, a narrow column and a page with
a sidebar.

- **From a `@4xl` container:** a 12-column grid. The lead card takes 7 columns and the list
  takes 5. With no runners-up, the lead card takes all 12.
- **Below `@4xl`:** the lead card and the list stack.
- **Lead card:** the post's image, or its video, which plays in place (`FeaturedMedia`). Then
  the category chip, the title, the excerpt and the meta line.
- **List:** the next 3 posts at most, each a thumbnail, a title and the meta line.
- The lead title is a stretched link (`after:absolute after:inset-0`), so a click anywhere on
  the card opens the post. The video play button sits above it. See
  [Video embeds](/projects/web/website/design/video-embeds). Each list row is one link.

`FeaturedPosts` owns the header: the eyebrow, the `<h2>` (id `<anchor>-title`), the intro and
the "view all" link. It wraps everything in `ModuleSection`, which applies the page gutter
and the vertical rhythm. See [section conventions](/projects/web/website/design/sections).

`FeaturedPosts` and `FeaturedEditorial` stay pure: they take resolved `href`s, formatted dates
and a `playLabel`. They read no translations and no routing.
