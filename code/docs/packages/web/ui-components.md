---
title: "@indiecrafts/packages-web-ui-components — shared page-builder blocks"
description: "The generic renderers extracted down out of the blog so the app and the blog render the same page-builder blocks — one component, one look, no drift."
status: stable
---

# `@indiecrafts/packages-web-ui-components` — shared page-builder blocks

> **Browse it:** every renderer has a live story — `pnpm storybook` ([storybook package](/projects/web/tools/storybook)).

The generic renderers extracted **down** out of the blog so the app and the blog render the
**same** page-builder blocks — one component, one look, no drift. Pure presentational; takes
resolved Sanity data.

|               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exports**   | `./web/registry` — `BLOCK_RENDERERS` (the composable `_type`→component map, 17 generic `module.*`) + `renderBlock(module, components)`; `./web/portable-text-components` — the shared portable-text map; `./web/content/CodeBlock` — Shiki code renderer for the body `codeBlock`; `./web/RichTitle` — shared title primitive with `[[word]]` brand highlight (+ `./shared/rich-title` parser); `./web/<domain>/*` — individual renderers (`content`·`media`·`collection`·`layout`·`form`); `./shared/types` — `BlockModule` union + per-block types, incl. `PostCardItem` (platform-agnostic) |
| **Layout**    | **Platform → domain (`src/<platform>/<domain>/`).** `src/web/<domain>/` (`content`·`media`·`collection`·`layout`·`form`) holds the web renderers; `src/web/` holds the registry + portable-text map; `src/shared/types.ts` is the platform-agnostic contract.                                                                                                                                                                                                                                                                                                                                  |
| **Deps**      | `@indiecrafts/packages-shared-config`, `@indiecrafts/packages-web-ui`, `@indiecrafts/packages-shared-utils`, `@portabletext/react ^6`, `embla-carousel-react ^8`, `lucide-react ^1`, `next-intl ^4`, `shiki ^3` (server-side code highlighting). **Peer:** `next 16.3.1`, `react 19.2.8`                                                                                                                                                                                                                                                                                                       |
| **Consumers** | website + blog                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

- **One registry, one dispatcher.** `BLOCK_RENDERERS` maps the 17 generic `_type`s; `renderBlock`
  paints one (a `hidden` block renders nothing). The blog's `Modules` dispatcher paints any block
  list that can hold blog blocks — the blog's layouts, site pages, the home page and the sidebar:
  its 12 blog blocks first, then `renderBlock` for the rest.
- **Sidebar.** `web/layout/WithSidebar` lays out content + a labelled `<aside>` of cards (18rem
  from `lg`, after the content below it); `web/layout/SidebarCard` frames one block as a card unless
  the block draws its own. Blocks in a card render `inline` and size with `@container`. Model and
  resolution order → [page-builder § Sidebar](/packages/web/page-builder#sidebar).
- **Renderers here, schemas in `@indiecrafts/packages-web-page-builder`.** The 17 generic block renderers +
  types + `BLOCK_RENDERERS` registry live here; the matching `module.*` **schemas** (plus
  `blockContent`/`link`/`cta` and the `quote`/`person` entities `person-list`/`quote-list` reference)
  live in `@indiecrafts/packages-web-page-builder`. Both are consumed as source — the renderer takes resolved data,
  the schema owns the refs.
- **Blog frontpage primitives.** Six presentational primitives back the blog's composable `/blog`
  frontpage blocks — and, since those blocks also go on any page, the site's blog promotions (each
  renderer maps resolved post/category data onto one of these — see
  [modules/web/blog](/modules/web/blog/blog-architecture)): `web/layout/PostHero` (a full-width lead-post
  hero — image/video, category chip, author/date; `blog-hero`), `web/collection/FeaturedPosts` (a
  header + a lead card over a grid, or beside a short list via `FeaturedEditorial` — `blog-featured`,
  on any page), `web/collection/SpotlightRow` (a
  curated post-picks row + "view all" link; `blog-category-spotlight`, reused by `blog-trending`),
  `web/collection/Carousel` (client, an embla-driven scroller of pinned posts; `blog-collection`),
  `web/layout/TopicCards` (one to three large clickable category/tag cards; `blog-topic-cards`), and
  `web/collection/PostCard` — the shared single-post card `FeaturedPosts`/`SpotlightRow`/`Carousel`
  all render, extracted so the three don't each reimplement it. All six take a resolved
  `PostCardItem[]` (`shared/types.ts`) built by the blog's renderers — never Sanity refs directly.
- **`RichTitle` — the shared title primitive.** A thin heading (`web/RichTitle`) that colours any
  `[[word]]` span in the brand accent — used by app section titles (`messages/`) and Sanity titles
  alike. Owns no typography; pass classes via `className`. Details → [design/typography](/projects/web/website/design/typography#title-highlights-richtitle).
- **Marketing/page blocks — `Hero` · `FeatureGrid` · `Pricing`.** The three generic renderers that
  let a page-builder compose a landing page, not just blog chrome: `web/layout/Hero` (eyebrow +
  `RichTitle` title + subtitle + CTA), `web/collection/FeatureGrid` (icon cards), `web/collection/Pricing`
  (tiers with feature list + highlighted badge). Schemas live in `@indiecrafts/packages-web-page-builder`
  (`module.hero`/`module.feature-grid`/`module.pricing`); consumed by every page (incl. the home) + the blog body.
  `AccordionList`/`QuoteList` now also render their optional `title` via `RichTitle`.
- **`form` domain — shared inputs, not blocks.** Alongside the block renderers, `src/web/form/`
  holds reusable form controls: **`PhoneInput`** (`./web/form/PhoneInput`) — a country-aware
  phone field that pairs with `@indiecrafts/packages-shared-format`'s `/validate` (`isPhone`/`formatPhone`, see
  [format](/packages/shared/format)); and **`TurnstileWidget`** (`./web/form/TurnstileWidget`) — the client half of
  `@indiecrafts/packages-shared-security`'s `verifyTurnstile`: renders the Cloudflare Turnstile widget only when
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set, reports the token via `onToken` (the newsletter / waitlist /
  comment forms send it as `cf-turnstile-response` and gate submit on `turnstileActive()`), `siteKey`
  prop override for tests/Storybook.
- **One frame for every public form.** `useGuardedSubmit` (the POST with consent, language,
  honeypot, timing and the Turnstile token) · `FormFrame` (section, card, heading, success line) ·
  `GuardedFields` (honeypot, consent, Turnstile, error) + `FormInput` / `SubmitButton`, and
  `formBlock` for the server wrapper (code flag + Studio switch). The contact, waitlist,
  newsletter and lead-magnet forms keep only their own fields. A new form, multistep included,
  follows the recipe in Storybook → UI Components/FormFrame (`FormFrame.md`).
- **Mixed `.ts`/`.tsx`.** Like the blog module, `exports` is `"./*": "./src/*"` (no extension
  in the map; Next + TS resolve `.ts`/`.tsx`/dir-index), and Tailwind scans it via a `@source`
  line in `ui-tokens/globals.css`.

## Wiring & conventions

How every brick is consumed (exports · `transpilePackages` · resolution · Tailwind `@source`
· hardening), the ≥2-consumer rule → **[Packages overview](/packages/README)**.

- [`code/packages/web/ui-components/`](../../code/packages/web/ui-components/) — the source (`src/web/<domain>/` · `src/shared/types.ts`)
- [`code/packages/_registry.md`](../../code/packages/_registry.md) — roster + rule
