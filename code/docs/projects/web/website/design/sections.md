---
title: "Marketing sections"
description: "The home page and every other page are page-builder pages: an ordered list of module.* blocks, edited in Sanity and rendered by @indiecrafts/packages-web-ui-components."
status: stable
---

# Marketing sections

A section of the home page (or any landing page) is a page-builder **block**. The home is a
`page` document in Sanity, with an ordered `sections[]` of `module.*` blocks. The app holds no
hand-copied section components: the old `src/user-interface/homepage/sections/` folder
(`Features`, `Pricing`, `Testimonials`, `Cta`, `Faq`, `FeaturedArticles`) is gone.

The page-builder blocks replace them. The home's featured strip, for example, is now a
`module.blog-featured` block — see [Featured posts](/projects/web/website/design/featured-articles).

## Where sections come from

Two packages own the blocks:

- **Schema + GROQ** — [`@indiecrafts/packages-web-page-builder`](/packages/web/page-builder): the
  17 generic `module.*` blocks, the `page` document and `MODULES_FRAGMENT`.
- **Renderers** — [`@indiecrafts/packages-web-ui-components`](/packages/web/ui-components):
  one component per block, listed in `BLOCK_RENDERERS` (`src/web/registry.tsx`).

The blog adds its own blocks (`module.blog-*`). A page can hold the ones that promote the blog
(`BLOG_SECTION_TYPES`), for example « Articles à la une ».

To add a section type, add a block: follow
[page builder § Adding a block](/packages/web/page-builder#adding-a-block). To add a section to
a page, an editor inserts the block in the Studio. No code changes.

## Anatomy of a section

A block has two halves:

- **A schema** (`defineModule`) — its own fields plus `anchor` (« Ancre », an in-page link id)
  and `hidden` (« Masqué »). A hidden block renders nothing.
- **A renderer** — a server component that takes the block's resolved data as props. It reads
  no `messages`; the copy comes from Sanity.

So a section carries **structure** and **content** in the same Sanity document. Structure is
the block's order and its items. Content is the text the editor types, per locale.

## Wiring content

The copy lives in Sanity, one `page` document per locale. The home page is
`page-home-en` / `page-home-fr`, edited in **Studio → Accueil**. Other pages live in
**Studio → Pages**. A block's copy never goes into `messages/<locale>.json`.

`pnpm seed` writes the reference home page (`buildHomePage()` in `scripts/seed.mjs`). See
[Homepage](/projects/web/website/features/homepage).

## Mounting in a route

`src/app/[locale]/(home)/page.tsx` is the live pattern:

1. `getHomePage(locale)` reads the home `page` and its sidebar choice.
2. The blog's `Modules` component paints the blocks: the blog blocks first, then the generic
   ones through `renderBlock`.
3. `PageSidebar` wraps the blocks and adds the sidebar cards, if any.

The `/[locale]/[...slug]` catch-all renders every other `page` the same way.

## Section conventions

Every renderer follows the same accessibility and layout rules:

- **Chrome.** Wrap the block in `ModuleSection` (`src/web/layout/ModuleSection.tsx`). As a
  section it is a `<section id={anchor}>` with `mx-auto max-w-6xl px-(--gutter)` and vertical
  rhythm. Inline in rich text it drops the gutter and adds `not-prose my-8`.
- **Heading level.** Sections open at `<h2>`; card titles inside step down to `<h3>`. On a
  page-builder page, the hero block (`module.hero`) renders the single `<h1>`.
- **Container queries.** Size the block with `@container`, never viewport breakpoints. The
  same block renders full width, inline in an article and beside a sidebar.
- **Gutter + width.** Horizontal padding is `px-(--gutter)`, from `theme.container.gutter`.
  Never hard-code page margins.
- **Decorative icons** are `aria-hidden="true"` unless the icon is the only label.
- **Motion** respects `prefers-reduced-motion` through `motion-reduce:*` utilities.

See also: [Typography](/projects/web/website/design/typography), [Icons](/projects/web/website/design/icons), [Featured posts](/projects/web/website/design/featured-articles).
