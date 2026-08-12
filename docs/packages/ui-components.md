# `@indiecrafts/ui-components` — shared page-builder blocks

The generic renderers extracted **down** out of the blog so the app and the blog render the
**same** page-builder blocks — one component, one look, no drift. Pure presentational; takes
resolved Sanity data.

| | |
| --- | --- |
| **Exports** | `./renderers/registry` — `BLOCK_RENDERERS` (the composable `_type`→component map, 10 generic `module.*`) + `renderBlock(module, components)`; `./renderers/portable-text-components` — the shared portable-text map; `./renderers/*` — individual renderers + `ModuleSection` · `Cta`; `./types` — `BlockModule` union + per-block types |
| **Deps** | `@indiecrafts/config`, `@indiecrafts/ui`, `@indiecrafts/utils`, `@portabletext/react ^6`, `embla-carousel-react ^8`, `lucide-react ^1`, `next-intl ^4`. **Peer:** `next 16.2.10`, `react 19.2.4` |
| **Consumers** | app + blog |

- **Composable registry.** Each page type spreads the shared base + its own modules — the
  blog's `ModuleRenderer` = `{ ...BLOCK_RENDERERS, blog-index, blog-post-list, blog-post-content }`.
- **Renderers moved, schemas didn't (Phase 1).** The 10 generic block `module.*` **schemas**
  still live in the blog; only the renderers + types + registry moved. `person-list`/`quote-list`
  renderers are generic (resolved data), but their **schemas** ref blog `person`/`quote` docs —
  so they stay put until the domain packs exist.
- **Mixed `.ts`/`.tsx`.** Like the blog module, `exports` is `"./*": "./src/*"` (no extension
  in the map; Next + TS resolve `.ts`/`.tsx`/dir-index), and Tailwind scans it via a `@source`
  line in `ui-tokens/globals.css`.

## Wiring & conventions

How every brick is consumed (exports · `transpilePackages` · resolution · Tailwind `@source`
· hardening), the ≥2-consumer rule, and the four-folder mirror → **[Packages overview](./)**.

- [`code/packages/ui-components/`](../../code/packages/ui-components/) — the source (`renderers/` · `types.ts`)
- [`code/packages/_registry.md`](../../code/packages/_registry.md) — roster + rule
