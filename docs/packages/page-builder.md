# Page builder (content model + blocks)

The site-wide **page-builder content model** — the generic `page` document, the 16 generic
`module.*` block **schemas**, the reusable `blockContent` / `link` / `cta` objects, the
`quote` / `person` entities the blocks reference, and the `MODULES_FRAGMENT` GROQ that resolves
them. Lives in **`@indiecrafts/page-builder`** (`code/packages/page-builder`), consumed as
source. Pure Sanity schema + GROQ — no React (the **renderers** live in
`@indiecrafts/ui-components`).

Extracted from `@indiecrafts/blog` so the app, the blog, and future apps all compose pages
from the same blocks **without depending on the blog module**. The blog keeps only its 3
blog-specific blocks (`blog-index`, `blog-post-*`) and composes them on top.

## What it owns

| Surface | Contents |
| --- | --- |
| Documents | `page` (slug · seo · `sections[]` · i18n), `quote`, `person` |
| Objects | `blockContent`, `link` (page **or** post internal target), `cta` |
| Modules (16) | `hero · feature-grid · pricing · accordion-list · callout · card-list · gallery · person-list · prose · stat-list · step-list · quote-list · custom-html · newsletter · waitlist · lead-magnet` |
| GROQ | `MODULES_FRAGMENT` (+ `LINK_FRAGMENT` / `CTA_FRAGMENT`) — generic projections |
| Barrel | `pageBuilderSanity` (`SanityModule`) — schema + desk (Pages · Témoignages · Équipe) + i18n templates |

## Consumers

- **App** — `sanity.config.ts` (`pageBuilderSanity`), `home-queries.ts` (the home `page` — the
  `page` with `isHome` — reuses `MODULE_TYPES` + `MODULES_FRAGMENT`), and the
  `/[locale]/[...slug]` route (`page-queries.ts` + `lib/page.ts`).
- **Blog** — imports `MODULES_FRAGMENT` (composes `blog-post-list` on top), `defineModule`, and
  references `blockContent` / `link` / `cta` by type name.
- **ui-components** — the renderers (`BLOCK_RENDERERS`) paint the resolved data.

## Adding a block

The schema goes here; the renderer + type go in `@indiecrafts/ui-components`. Follow the
`method/apps/web/workflows/add-page-builder-block.md` checklist (schema path is
`code/packages/page-builder/src/sanity/schema/modules/`).

## Ceiling

`custom-html` renders raw HTML (`dangerouslySetInnerHTML`) — a trusted-editor escape hatch, not
the modelled default; keep it role-gated. Reference blocks (testimonial-list, team, faq, …),
Presentation visual-editing, and array-group / preview-thumbnail picker UX are the roadmap's
next packs (`method/apps/web/page-builder-roadmap.md`).
