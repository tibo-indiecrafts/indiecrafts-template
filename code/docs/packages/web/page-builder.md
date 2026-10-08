---
title: "Page builder (content model + blocks)"
description: "The site-wide page-builder content model — the generic page document, the 16 generic module."
status: stable
---

# Page builder (content model + blocks)

The site-wide **page-builder content model** — the generic `page` document, the 16 generic
`module.*` block **schemas**, the reusable `blockContent` / `link` / `cta` objects, the
`quote` / `person` entities the blocks reference, and the `MODULES_FRAGMENT` GROQ that resolves
them. Lives in **`@indiecrafts/packages-web-page-builder`** (`code/packages/web/page-builder`), consumed as
source. Pure Sanity schema + GROQ — no React (the **renderers** live in
`@indiecrafts/packages-web-ui-components`).

Extracted from `@indiecrafts/modules-web-blog` so the app, the blog, and future apps all compose pages
from the same blocks **without depending on the blog module**. The blog keeps only its 3
blog-specific blocks (`blog-index`, `blog-post-*`) and composes them on top.

## What it owns

| Surface      | Contents                                                                                                                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Documents    | `page` (slug · seo · `sections[]` · i18n), `quote`, `person`                                                                                                                                    |
| Objects      | `blockContent`, `link` (page **or** post internal target), `cta`                                                                                                                                |
| Modules (16) | `hero · feature-grid · pricing · accordion-list · callout · card-list · gallery · person-list · prose · stat-list · step-list · quote-list · custom-html · newsletter · waitlist · lead-magnet` |
| GROQ         | `MODULES_FRAGMENT` (+ `LINK_FRAGMENT` / `CTA_FRAGMENT`) — generic projections                                                                                                                   |
| Barrel       | `pageBuilderSanity` (`SanityModule`) — schema + desk (Pages · Témoignages · Équipe) + i18n templates                                                                                            |

## Consumers

- **App** — `sanity.config.ts` (`pageBuilderSanity`), `home-queries.ts` (the home `page` — the
  `page` with `isHome` — reuses `MODULE_TYPES` + `MODULES_FRAGMENT`), and the
  `/[locale]/[...slug]` route (`page-queries.ts` + `lib/page.ts`).
- **Blog** — imports `MODULES_FRAGMENT` (composes `blog-post-list` on top), `defineModule`, and
  references `blockContent` / `link` / `cta` by type name.
- **ui-components** — the renderers (`BLOCK_RENDERERS`) paint the resolved data.

## Adding a block

A `module.<name>` block is easy to half-wire — a miss breaks the Studio picker, the TS exhaustiveness
`satisfies` check, or leaves doc counts stale. Touch **every** file in the same change:

1. **Schema** — `code/packages/web/page-builder/src/sanity/schema/modules/<name>.ts` (via `defineModule`);
   register it in the schema index.
2. **GROQ** — extend `MODULES_FRAGMENT` (`src/sanity/queries.ts`) **only if** the block dereferences
   refs (`...` already spreads scalar fields).
3. **Type** — add `<Name>Module` to the `BlockModule` union (`@indiecrafts/packages-web-ui-components`
   `src/shared/types.ts`).
4. **Renderer + registry** — `src/web/<domain>/<Name>.tsx` + add it to `BLOCK_RENDERERS`
   (`src/web/registry.tsx`); the `satisfies` clause fails the build if the `_type` is missing.
5. **Story + doc** — colocated `<Name>.stories.tsx` + `<Name>.md`.
6. **Docs + changelog** — this page's block table + the packages `CHANGELOG.md`.

## Removing a field

Drop it from the schema, the `<Name>Module` type, the block `.md`, `seed.mjs`, and the
website `schema.json`. Documents that still hold the value show an "unknown field" warning in
Studio. Clear them once with `client.patch(id).unset([path])` from a `sanity exec` script
(`--with-user-token`). Walk `page.sections`, `post.body` and `blog.postModules` /
`frontpageModules` recursively, because blocks nest inside `blockContent`. Example: the
`alreadyMessage` field left the newsletter, waitlist and lead-magnet blocks.

## Ceiling

`custom-html` renders raw HTML (`dangerouslySetInnerHTML`) — a trusted-editor escape hatch, not
the modelled default; keep it role-gated. Reference blocks (testimonial-list, team, faq, …),
Presentation visual-editing, and array-group / preview-thumbnail picker UX are the natural next packs.
