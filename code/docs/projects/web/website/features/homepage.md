---
title: "Homepage (page-builder)"
description: "The homepage is editor-composed in Sanity, not hard-coded."
status: stable
---

# Homepage (page-builder)

The homepage is **editor-composed in Sanity**, not hard-coded. It's the same `page` model as every
other page (there is **one page model everywhere**) — the home is a `page` with `isHome` on, rendering
through the shared page-builder blocks.

## Where the content lives

- **Studio → Accueil** — one home `page` per language (`isHome`, fixed id `page-home-en` /
  `page-home-fr`), an ordered **`sections[]`** of `module.*` blocks. Add, reorder, or hide a block from
  the Studio; the page follows, no code change. Every _other_ page lives in **Studio → Pages**.
- Read at request time by `getHomePage(locale)` (`src/lib/home.ts` → `home-queries.ts`), painted by
  the blog's `Modules` component in `src/app/[locale]/(home)/page.tsx`. `Modules` renders the blog
  blocks, then hands every generic block to the shared `renderBlock` registry
  (`@indiecrafts/packages-web-ui-components/web/registry`).
- The home can show a **sidebar** of cards beside its blocks. Set it in **Studio → Site web →
  Barre latérale → Accueil**, or in the home `page`'s own **Barre latérale** field. See
  [Page builder § Sidebar](/packages/web/page-builder#sidebar).
- A page in **Studio → Pages** marked **Dépublier** (SEO & visibilité) returns 404.

## Blocks a homepage can use

Marketing/page blocks: **hero** (eyebrow + title + subtitle + CTA), **feature-grid** (icon cards),
**pricing** (tiers). Plus the shared content blocks — **accordion-list** (FAQ), **quote-list**
(testimonials), **newsletter** (email-capture CTA), stat/step/card lists, gallery, callout, prose,
custom-html, and the waitlist, lead-magnet and contact forms. That is all 17 generic blocks.

The home (and every `page`) also accepts the blog blocks that promote the blog
(`BLOG_SECTION_TYPES`): `blog-featured`, `blog-trending`, `blog-post-list`, `blog-collection`,
`blog-category-spotlight`, `blog-topic-cards`, `blog-hero`, `blog-explore`. The blog's own page
chrome (`blog-index`, `blog-post-content`) stays out. With `features.blog` off, the website drops
every blog block.

- **Title accents:** wrap a word in `[[ ]]` in any block title to colour it in the brand accent —
  e.g. `Ship [[client websites]] in a weekend` (see [design/typography](/projects/web/website/design/typography#title-highlights-richtitle)).
- **Anchors + hide:** every block has an optional **Ancre** (in-page link id, e.g. a hero CTA →
  `#pricing`) and a **Masqué** toggle (soft-disable without deleting). A hidden block renders
  nothing.

## Featured posts strip

The home's « Articles à la une » strip is a `module.blog-featured` block at the end of the home
`page`'s sections: `layout: "editorial"`, `source: "flag"`, `limit: 4`, anchor `home-featured`.
Edit or remove it in **Studio → Accueil**, like any other block. Its copy (eyebrow, title, intro,
"view all" link) lives in the block, not in `messages/`. The lead card still plays a post's video
in place. See [Featured posts](/projects/web/website/design/featured-articles).

## What stays in code (not the CMS)

- The template **icon / motion / blocks showcases** — their content is code (glyph sets), and a real
  client deletes them. Their few chrome strings still live in `messages/`.

## SEO

Page `<title>`/description/OG come from the home `page` document's own **SEO & visibilité** section (the shared `seoMeta`, in Sanity), per locale. The **FAQPage**
rich result is derived from the homepage's first **accordion-list** block (`src/lib/faq.ts`) — one
source for the visible FAQ and the JSON-LD.

## Seeding

`pnpm seed` authors the home `page` per locale (`page-home-en` / `page-home-fr`, `isHome`) from
`buildHomePage()` in `scripts/seed.mjs` — the reference content you can edit or replace per client.
The testimonials section references the demo quotes, so only `pnpm seed -- --demo` adds it.
Both locales end with the « Articles à la une » block. For an existing dataset,
`node --env-file=.env.local scripts/sidebar-migrate.mjs` adds that block to each home page that has
none (a dry run; add `--apply` to write).
