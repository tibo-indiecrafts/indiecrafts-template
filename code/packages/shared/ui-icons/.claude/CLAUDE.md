# @indiecrafts/packages-shared-ui-icons — the icon system

Auto-loads under `code/packages/shared/ui-icons/**`. One centralized icon brick: a shared **contract**
(glyph names, custom-SVG registry, brand-mark data) with platform-forked **renderers** — the same
data→renderer split as `ui-tokens`. Four families: lucide (cross-platform), reicon (web), custom
SVGs, and brand/social marks. Consumed by `ui-components`, the page-builder picker, and website nav.
Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** React 19 + `lucide-react`/`reicon-react` (web); `lucide-react-native`/`react-native-svg` optional peers (native).

- **Exports:** `./shared` (contract — `GLYPHS`/`GlyphName`, `glyphOptions()`, `SVGS`, `BRANDS`) · `./web` (`Icon`/`ReiconIcon`/`SvgIcon`/`BrandIcon`) · `./native` (`Icon`/`SvgIcon`/`BrandIcon` — **no `ReiconIcon`**).
- **`GLYPHS` is the single source** — add a name there and web `Icon`, native `Icon`, and the Sanity Studio picker all follow, no hand-sync.
- **`BRANDS` are GENERATED** — `src/shared/brands.ts` is built from `brands.json` (our name → a `simple-icons` slug, or an inline `{title,hex,path}` for a mark simple-icons lacks, e.g. LinkedIn) via `pnpm brands:build`; `brands:check` guards drift in CI (like `tokens:check`). Never hand-edit `brands.ts`.
- **Import `./web` on DOM, `./native` on React Native** — reicon has no RN build.
- **No Tailwind classes of its own** — renderers take `className`/size from the caller; no `@source` line needed.

Full reference → [`code/docs/packages/ui-icons.md`](../../../../docs/packages/ui-icons.md).
