---
title: "Icons & favicons"
description: "Two separate concerns: the icon sets you draw UI glyphs from, and the favicon / app-icon / logo assets that give the site its mark."
status: stable
---

# Icons & favicons

Two separate concerns: the **icon sets** you draw UI glyphs from, and the
**favicon / app-icon / logo** assets that give the site its mark. The sets live in
code; the marks are edited in Sanity.

## Icon sets

Icons come from **one brick** — [`@indiecrafts/packages-web-ui-icons`](/packages/web/ui-icons)
— so the app, blog, and (later) native surfaces draw from a single source. Import the renderers from
`/web`; all are demoed in `src/user-interface/homepage/sections/IconShowcase.tsx`.

| Renderer     | Family         | Use for                                                                                      |
| ------------ | -------------- | -------------------------------------------------------------------------------------------- |
| `Icon`       | Lucide         | The default outline UI glyph set — buttons, list bullets, nav. Cross-platform.               |
| `ReiconIcon` | Reicon         | The same shapes in Outline **and** Filled weights (`weight="Filled"`). Web only.             |
| `SvgIcon`    | Custom SVGs    | Project-specific marks (a logo glyph) — add path data to the brick's `SVGS`. Cross-platform. |
| `BrandIcon`  | Brand / social | Social logos painted in their official brand colors (`brandColor`). Cross-platform.          |

```tsx
import { Icon, BrandIcon } from "@indiecrafts/packages-web-ui-icons/web";

<Icon name="zap" className="size-5" aria-hidden="true" />
<BrandIcon name="github" size={20} brandColor />
```

The design contract ([`DESIGN.md`](../../../../code/packages/web/ui-tokens/DESIGN.md)): default
**20px**, **16px** in compact controls, consistent **2px** stroke; don't mix filled + outline in one
nav area. Mark decorative icons `aria-hidden="true"` — give them a label only when the icon is the
sole content of a control.

**Cross-platform:** `Icon`/`SvgIcon`/`BrandIcon` also render on native (`/native`, via
`lucide-react-native` + `react-native-svg`); `ReiconIcon` is web only (reicon has no React
Native build). Full reference + how to add a glyph or a custom SVG → the [`ui-icons` package doc](/packages/web/ui-icons).

## Favicon, app icon & logo — edited in Sanity

The **favicon / app icon** and the **site logo** are edited in Sanity Studio
(**SEO & métadonnées → Paramètres du site → Logo & icônes**), not in code. Three
fields on the `siteSettings` singleton:

| Field      | Drives                                                                | Guidance              |
| ---------- | --------------------------------------------------------------------- | --------------------- |
| `icon`     | favicon (`<link rel="icon">`) + apple-touch icon + PWA manifest icons | square PNG, ≥ 512×512 |
| `logo`     | header + footer logo (light backgrounds)                              | any proportions       |
| `logoDark` | header + footer logo on the **dark** theme (optional)                 | any proportions       |

**Sole source, no fallback.** When `icon` is empty the layout emits no favicon
`<link>` (the browser shows its default) and the manifest `icons` array is empty;
when `logo` is empty the header/footer show the site-name **wordmark** alone.
Nothing reads `/public` for these — `pnpm seed` uploads the defaults.

- **Favicon + apple-touch** — emitted by the layout's `generateMetadata.icons` from `settings.brand.icon` (Sanity CDN URL, cropped `?w=180&h=180&fit=crop`). No `app/icon.tsx` / `app/apple-icon.tsx` route files.
- **Manifest icons** — `app/manifest.ts` pulls the same `icon`, cropped to 192×192 and 512×512.
- **Logo** — rendered by `Logo.tsx` (presentational; URLs fetched server-side in `DefaultLayout` and passed to the client Header + Footer).

### Theme-safe logo

Set `logoDark` when the main logo is unreadable on the dark theme. When present,
`Logo.tsx` renders both and does a pure-CSS swap — `block dark:hidden` on the light
logo, `hidden dark:block` on the dark one, keyed on `data-theme` via the
`@custom-variant dark` in `globals.css`. So it works for **light / dark / system /
forced** with no JS and no flash. No `logoDark` → the main logo shows on every theme.

::: warning
Favicons don't theme-switch in browsers — one `icon` asset serves every theme, so
it must read on any background.
:::

## Open Graph images

The OG share card is **also edited in Sanity** — per language
(`siteMeta.<locale>.ogImage`) or per document (`seo.image`). See
[Editing SEO in Sanity](/projects/web/website/seo/editing-seo-in-sanity). It is Sanity-only: when a
locale has no card, the layout's `generateMetadata` emits no `og:image` (no
`/public` file, no convention route). `pnpm seed` uploads the defaults.

::: tip
`theme.hexColors.background` in `projects/web/website/src/config/theme.ts` mirrors the OKLCH background
token as hex for the **PWA manifest** (`app/manifest.ts` sets both `theme_color`
and `background_color` from it), which can't take `oklch`. Keep the mirror in sync
when you change `--background` so the install screen stays on-brand. See the
[brand-setup guide](/projects/web/website/setup/brand-setup).
:::
