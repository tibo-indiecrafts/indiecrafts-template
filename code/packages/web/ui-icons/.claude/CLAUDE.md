# `@indiecrafts/packages-web-ui-icons` — the icon system

Auto-loads under `code/packages/web/ui-icons/**`. One centralized icon brick: a shared **contract**
(glyph names, custom-SVG registry, brand-mark data) with platform-forked **renderers** — the same
data→renderer split as `ui-tokens`. Three families: lucide (cross-platform), custom SVGs, and
brand/social marks. Consumed by `ui-components`, the page-builder picker, and website nav.
Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** React 19 + `lucide-react`.

- **Exports:** `./shared` (contract — `GLYPHS`/`GlyphName`, `glyphOptions()`, `SVGS`, `BRANDS`) · `./web` (`Icon`/`SvgIcon`/`BrandIcon`).
- **Never resolve an icon set by name at runtime** (`import * as Set` + `Set[name]`): the bundler must keep every icon, and a client component ships them all. Name lookups go through `GLYPHS` + an explicit map.
- **`GLYPHS` is the single source** — add a name there and `Icon` and the Sanity Studio picker both follow, no hand-sync.
- **`BRANDS` are GENERATED** — `src/shared/brands.ts` is built from `brands.json` (our name → a `simple-icons` slug, or an inline `{title,hex,path}` for a mark simple-icons lacks, e.g. LinkedIn) via `pnpm brands:build`; `brands:check` guards drift in CI (like `tokens:check`). Never hand-edit `brands.ts`.
- **No Tailwind classes of its own** — renderers take `className`/size from the caller; no `@source` line needed.

Full reference → [`code/docs/packages/web/ui-icons.md`](../../../../docs/packages/web/ui-icons.md).
