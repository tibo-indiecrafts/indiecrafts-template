# `@indiecrafts/ui-components` — shared page-builder blocks

> **Browse it:** every renderer has a live story — `pnpm storybook` ([storybook package](./storybook)).

The generic renderers extracted **down** out of the blog so the app and the blog render the
**same** page-builder blocks — one component, one look, no drift. Pure presentational; takes
resolved Sanity data.

| | |
| --- | --- |
| **Exports** | `./web/registry` — `BLOCK_RENDERERS` (the composable `_type`→component map, 14 generic `module.*`) + `renderBlock(module, components)`; `./web/portable-text-components` — the shared portable-text map; `./web/content/CodeBlock` — Shiki code renderer for the body `codeBlock`; `./web/RichTitle` — shared title primitive with `[[word]]` brand highlight (+ `./shared/rich-title` parser); `./web/<domain>/*` — individual renderers (`content`·`media`·`collection`·`layout`·`form`); `./shared/types` — `BlockModule` union + per-block types (platform-agnostic) |
| **Layout** | **Platform → domain (`src/<platform>/<domain>/`).** `src/web/<domain>/` (`content`·`media`·`collection`·`layout`·`form`) holds the web renderers; `src/web/` holds the registry + portable-text map; `src/shared/types.ts` is the platform-agnostic contract. `src/native/` is reserved for a future React-Native set that mirrors the same domains + shares `shared/types` + tokens (empty until an RN app exists). |
| **Deps** | `@indiecrafts/config`, `@indiecrafts/ui`, `@indiecrafts/utils`, `@portabletext/react ^6`, `embla-carousel-react ^8`, `lucide-react ^1`, `next-intl ^4`, `shiki ^3` (server-side code highlighting). **Peer:** `next 16.2.10`, `react 19.2.4` |
| **Consumers** | app + blog |

- **Composable registry.** Each page type spreads the shared base + its own modules — the
  blog's `ModuleRenderer` = `{ ...BLOCK_RENDERERS, blog-index, blog-post-list, blog-post-content }`.
- **Renderers moved, schemas didn't (Phase 1).** The 11 generic block `module.*` **schemas**
  still live in the blog; only the renderers + types + registry moved. `person-list`/`quote-list`
  renderers are generic (resolved data), but their **schemas** ref blog `person`/`quote` docs —
  so they stay put until the domain packs exist.
- **`RichTitle` — the shared title primitive.** A thin heading (`web/RichTitle`) that colours any
  `[[word]]` span in the brand accent — used by app section titles (`messages/`) and Sanity titles
  alike. Owns no typography; pass classes via `className`. Details → [design/typography](../apps/web/design/typography#title-highlights-richtitle).
- **`form` domain — shared inputs, not blocks.** Alongside the block renderers, `src/web/form/`
  holds reusable form controls. Today: **`PhoneInput`** (`./web/form/PhoneInput`) — a country-aware
  phone field that pairs with `@indiecrafts/format`'s `/validate` (`isPhone`/`formatPhone`). See
  [format](./format).
- **Mixed `.ts`/`.tsx`.** Like the blog module, `exports` is `"./*": "./src/*"` (no extension
  in the map; Next + TS resolve `.ts`/`.tsx`/dir-index), and Tailwind scans it via a `@source`
  line in `ui-tokens/globals.css`.

## Wiring & conventions

How every brick is consumed (exports · `transpilePackages` · resolution · Tailwind `@source`
· hardening), the ≥2-consumer rule → **[Packages overview](./)**.

- [`code/packages/ui-components/`](../../code/packages/ui-components/) — the source (`renderers/` · `types.ts`)
- [`code/packages/_registry.md`](../../code/packages/_registry.md) — roster + rule
