# Homepage (page-builder)

The homepage is **editor-composed in Sanity**, not hard-coded. Its editorial sections live in a
per-locale singleton and render through the same page-builder blocks the blog body uses.

## Where the content lives

- **Studio → Accueil** — one document per language (`homePage.en`, `homePage.fr`), each an ordered
  **`pageModules[]`** of `module.*` blocks. Add, reorder, or hide a block from the Studio; the page
  follows, no code change.
- Read at request time by `getHomePage(locale)` (`src/lib/home.ts` → `home-queries.ts`), painted by
  the shared `renderBlock` registry (`@indiecrafts/ui-components/web/registry`) in
  `src/app/[locale]/(home)/page.tsx`.

## Blocks a homepage can use

Marketing/page blocks: **hero** (eyebrow + title + subtitle + CTA), **feature-grid** (icon cards),
**pricing** (tiers). Plus the shared content blocks — **accordion-list** (FAQ), **quote-list**
(testimonials), **newsletter** (email-capture CTA), stat/step/card lists, gallery, callout, prose,
custom-html. The three blog-context blocks (`blog-index`, `blog-post-*`) are excluded from the
homepage.

- **Title accents:** wrap a word in `[[ ]]` in any block title to colour it in the brand accent —
  e.g. `Ship [[client websites]] in a weekend` (see [design/typography](../design/typography#title-highlights-richtitle)).
- **Anchors + hide:** every block has an optional **anchor** (in-page link id, e.g. a hero CTA →
  `#pricing`) and a **hidden** toggle (soft-disable without deleting).

## What stays in code (not the CMS)

- **`FeaturedArticles`** — live blog posts (dynamic data, not editorial copy).
- The template **icon / motion / blocks showcases** — their content is code (glyph sets), and a real
  client deletes them. Their few chrome strings still live in `messages/`.

## SEO

Page `<title>`/description/OG come from `siteMeta.<locale>.pageSeo` (Sanity, unchanged). The **FAQPage**
rich result is derived from the homepage's first **accordion-list** block (`src/lib/faq.ts`) — one
source for the visible FAQ and the JSON-LD.

## Seeding

`pnpm seed` authors `homePage.en` / `homePage.fr` from `buildHomePage()` in `scripts/seed-demo.mjs` —
the reference content you can edit or replace per client.
