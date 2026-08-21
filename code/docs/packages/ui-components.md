# `@indiecrafts/packages-web-ui-components` — shared page-builder blocks

> **Browse it:** every renderer has a live story — `pnpm storybook` ([storybook package](./storybook)).

The generic renderers extracted **down** out of the blog so the app and the blog render the
**same** page-builder blocks — one component, one look, no drift. Pure presentational; takes
resolved Sanity data.

|               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Exports**   | `./web/registry` — `BLOCK_RENDERERS` (the composable `_type`→component map, 16 generic `module.*`) + `renderBlock(module, components)`; `./web/portable-text-components` — the shared portable-text map; `./web/content/CodeBlock` — Shiki code renderer for the body `codeBlock`; `./web/RichTitle` — shared title primitive with `[[word]]` brand highlight (+ `./shared/rich-title` parser); `./web/<domain>/*` — individual renderers (`content`·`media`·`collection`·`layout`·`form`); `./shared/types` — `BlockModule` union + per-block types (platform-agnostic) |
| **Layout**    | **Platform → domain (`src/<platform>/<domain>/`).** `src/web/<domain>/` (`content`·`media`·`collection`·`layout`·`form`) holds the web renderers; `src/web/` holds the registry + portable-text map; `src/shared/types.ts` is the platform-agnostic contract. `src/native/` is reserved for a future React-Native set that mirrors the same domains + shares `shared/types` + tokens (empty until an RN app exists).                                                                                                                                                     |
| **Deps**      | `@indiecrafts/packages-shared-config`, `@indiecrafts/packages-web-ui`, `@indiecrafts/packages-shared-utils`, `@portabletext/react ^6`, `embla-carousel-react ^8`, `lucide-react ^1`, `next-intl ^4`, `shiki ^3` (server-side code highlighting). **Peer:** `next 16.3.1`, `react 19.2.8`                                                                                                                                                                                                                                                                                                                              |
| **Consumers** | app + blog                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

- **Composable registry.** Each page type spreads the shared base + its own modules — the
  blog's `ModuleRenderer` = `{ ...BLOCK_RENDERERS, blog-index, blog-post-list, blog-post-content }`.
- **Renderers here, schemas in `@indiecrafts/packages-web-page-builder`.** The 16 generic block renderers +
  types + `BLOCK_RENDERERS` registry live here; the matching `module.*` **schemas** (plus
  `blockContent`/`link`/`cta` and the `quote`/`person` entities `person-list`/`quote-list` reference)
  live in `@indiecrafts/packages-web-page-builder`. Both are consumed as source — the renderer takes resolved data,
  the schema owns the refs.
- **`RichTitle` — the shared title primitive.** A thin heading (`web/RichTitle`) that colours any
  `[[word]]` span in the brand accent — used by app section titles (`messages/`) and Sanity titles
  alike. Owns no typography; pass classes via `className`. Details → [design/typography](../apps/web/design/typography#title-highlights-richtitle).
- **Marketing/page blocks — `Hero` · `FeatureGrid` · `Pricing`.** The three generic renderers that
  let a page-builder compose a landing page, not just blog chrome: `web/layout/Hero` (eyebrow +
  `RichTitle` title + subtitle + CTA), `web/collection/FeatureGrid` (icon cards), `web/collection/Pricing`
  (tiers with feature list + highlighted badge). Schemas live in `@indiecrafts/packages-web-page-builder`
  (`module.hero`/`module.feature-grid`/`module.pricing`); consumed by every page (incl. the home) + the blog body.
  `AccordionList`/`QuoteList` now also render their optional `title` via `RichTitle`.
- **`form` domain — shared inputs, not blocks.** Alongside the block renderers, `src/web/form/`
  holds reusable form controls: **`PhoneInput`** (`./web/form/PhoneInput`) — a country-aware
  phone field that pairs with `@indiecrafts/packages-shared-format`'s `/validate` (`isPhone`/`formatPhone`, see
  [format](./format)); and **`TurnstileWidget`** (`./web/form/TurnstileWidget`) — the client half of
  `@indiecrafts/packages-shared-security`'s `verifyTurnstile`: renders the Cloudflare Turnstile widget only when
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set, reports the token via `onToken` (the newsletter / waitlist /
  comment forms send it as `cf-turnstile-response` and gate submit on `turnstileActive()`), `siteKey`
  prop override for tests/Storybook.
- **Mixed `.ts`/`.tsx`.** Like the blog module, `exports` is `"./*": "./src/*"` (no extension
  in the map; Next + TS resolve `.ts`/`.tsx`/dir-index), and Tailwind scans it via a `@source`
  line in `ui-tokens/globals.css`.

## Wiring & conventions

How every brick is consumed (exports · `transpilePackages` · resolution · Tailwind `@source`
· hardening), the ≥2-consumer rule → **[Packages overview](./)**.

- [`code/packages/web/ui-components/`](../../code/packages/web/ui-components/) — the source (`src/web/<domain>/` · `src/shared/types.ts`)
- [`code/packages/_registry.md`](../../code/packages/_registry.md) — roster + rule
