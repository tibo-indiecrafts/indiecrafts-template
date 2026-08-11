# Icons &amp; favicons

Two separate concerns: the **icon sets** you draw UI glyphs from, and the **favicon / app-icon routes** that give the site its mark in browser tabs, iOS home screens, and social cards.

## Icon sets

The template ships three sets, each for a different job (all demoed in `src/user-interface/homepage/sections/IconShowcase.tsx`):

| Set               | Package         | Use for                                                                |
| ----------------- | --------------- | ---------------------------------------------------------------------- |
| **Lucide**        | `lucide-react`  | The default outline UI glyph set — buttons, list bullets, nav.         |
| **Reicon**        | `reicon-react`  | The same shapes in Outline **and** Filled weights (`weight="Filled"`). |
| **Reicon Brands** | `reicon-brands` | Third-party logos painted in their official brand colors.              |

Lucide icons are plain React components: `<Zap className="size-5" aria-hidden="true" />`. Mark decorative icons `aria-hidden="true"` — only give them a label when the icon is the sole content of a control.

## BrandIcon

Brand logos need a wrapper because `reicon-brands` icons are framework-agnostic factories that call `document.createElementNS` — which throws during SSR. `src/user-interface/shared/components/BrandIcon.tsx` sidesteps that by building the `<svg>` itself from the icon's static `svgContent`:

```tsx
import { Github } from "reicon-brands";
import { BrandIcon } from "@/user-interface/shared/components/BrandIcon";

<BrandIcon icon={Github} size={28} brandColor />;
```

- `icon` is typed as the structural **`BrandMark`** (`{ hex, title, svgContent }`), not the library's own type. A `reicon-brands` icon satisfies it, and so does a hand-declared mark for a brand the set doesn't carry (e.g. LinkedIn, dropped from Simple Icons after a trademark request) — declare `{ hex, title, svgContent }` and pass it the same way.
- `brandColor` paints the logo in its official hex (`#${icon.hex}`); omit it to inherit `currentColor`.
- `aria-label` defaults to `icon.title`, and the `<svg>` carries `role="img"` — so a brand mark is always named for assistive tech.

Injecting `icon.svgContent` is safe: it's static path markup (no user input), and it's the only SSR-compatible render path `reicon-brands` exposes.

## Favicon, app icon &amp; logo — edited in Sanity

The **favicon / app icon** and the **site logo** are edited in Sanity Studio
(**SEO & métadonnées → Paramètres du site → Logo & icônes**), not in code. Three
fields on the `siteSettings` singleton:

| Field      | Drives                                                                | Guidance              |
| ---------- | --------------------------------------------------------------------- | --------------------- |
| `icon`     | favicon (`<link rel="icon">`) + apple-touch icon + PWA manifest icons | square PNG, ≥ 512×512 |
| `logo`     | header + footer logo (light backgrounds)                              | any proportions       |
| `logoDark` | header + footer logo on the **dark** theme (optional)                 | any proportions       |

**Sole source, no fallback.** When `icon` is empty the site emits no favicon
`<link>` (the browser shows its default) and the manifest `icons` array is empty;
when `logo` is empty the header/footer show the `{site.name}` **wordmark** alone.
Nothing reads `/public` for these anymore — `pnpm seed` uploads the defaults.

- **Favicon + apple-touch** — emitted by the layout's `generateMetadata.icons`
  from `siteSettings.icon` (Sanity CDN URL, cropped to 180×180). No `app/icon.tsx`
  / `app/apple-icon.tsx` route files.
- **Logo** — rendered by `Logo.tsx` (presentational; URLs fetched server-side in
  `DefaultLayout` and passed to the client Header + Footer).

### Theme-safe logo

Set `logoDark` when the main logo is unreadable on the dark theme. Both render and
a pure-CSS swap (`block dark:hidden` / `hidden dark:block`, keyed on
`data-theme` via the `@custom-variant dark` in `globals.css`) shows the right one
for **light / dark / system / forced** — no JS, no flash. No `logoDark` → the main
logo shows on every theme.

::: warning
Favicons don't theme-switch in browsers — one `icon` asset serves every theme, so
it must read on any background.
:::

## Open Graph images

The OG share card is **also edited in Sanity** — per language (`siteMeta.<locale>.ogImage`) or per page (`pageSeo.ogImage`). See [Editing SEO in Sanity](../seo/editing-seo-in-sanity.md). It is Sanity-only: when a locale has no card, `buildMetadata` emits no `og:image` (no `/public` file, no convention route). `pnpm seed` uploads the defaults from `scripts/seed-media/og.png` + `og-fr.png`.

Nothing brand-related lives in `/public` anymore — logo, favicon, and OG card are all Sanity assets on the CDN.

::: tip
`theme.hexColors` in `src/config/index.ts` mirrors the OKLCH brand/background tokens as hex for the **PWA manifest** (`app/manifest.ts` → `theme_color`/`background_color`), which can't take oklch. Keep the mirror in sync so the install screen stays on-brand. See the [brand-setup guide](../setup/brand-setup.md).
:::
