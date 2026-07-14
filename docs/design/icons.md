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

- `brandColor` paints the logo in its official hex (`#${icon.hex}`); omit it to inherit `currentColor`.
- `aria-label` defaults to `icon.title`, and the `<svg>` carries `role="img"` — so a brand mark is always named for assistive tech.

Injecting `icon.svgContent` is safe: it's the library's own static path markup (no user input), and it's the only SSR-compatible render path the library exposes.

## Favicon &amp; app-icon routes

Three Next.js metadata routes serve raster images from `/public`, all driven by `src/config/index.ts`:

| Route              | File                          | Config                                       | Size     |
| ------------------ | ----------------------------- | -------------------------------------------- | -------- |
| `/icon`            | `src/app/icon.tsx`            | `site.icon.file`                             | 180×180  |
| `/apple-icon`      | `src/app/apple-icon.tsx`      | `site.icon.appleFile` (falls back to `file`) | 180×180  |
| `/opengraph-image` | `src/app/opengraph-image.tsx` | `site.ogImage.file`                          | 1200×630 |

Each reads its file with `readFileSync` from `/public` and returns it with a one-year immutable cache header. To rebrand, replace the files in `/public/brand/` — no code changes.

### The Safari tab-vs-sidebar strategy

`/icon` (tab strip) and `/apple-icon` (iOS home screen + Safari sidebar/tab-overview thumbnail) intentionally point at the **same 180×180 raster**. Safari uses the favicon for the tab but the higher-res apple-touch-icon for the sidebar; serving one identical file is the only way to guarantee the same mark on both surfaces. The default config wires both to `/brand/apple-icon.png`:

```ts
icon: {
  file: "/brand/apple-icon.png",
  contentType: "image/png",
  appleFile: "/brand/apple-icon.png",     // iOS rejects SVG here — PNG required
  appleContentType: "image/png",
}
```

::: warning
The exported `size` in `icon.tsx` (`180×180`) must match the served file's real pixels. If it lies, Safari picks the wrong source for the sidebar and the two marks diverge. An SVG favicon would render as different artwork than the PNG sidebar icon — hence both point at one PNG.
:::

## Open Graph images

`/opengraph-image` (`src/app/opengraph-image.tsx`, 1200×630) is the default OG image for **every** page. Like the icon routes, it `readFileSync`s a static PNG from `/public` — `site.ogImage.file` (default `/brand/og.png`). `buildMetadata` sets `og:image` to `page.seo?.openGraph?.imageUrl ?? "/opengraph-image"` — so a page only diverges from that default when it sets an explicit `imageUrl`. To point one route at its own card, set `imageUrl` to a file:

```ts
// config: pages entry
seo: {
  openGraph: { imageUrl: "/brand/og-home.png" },
},
```

The `/brand/og-<id>.png` filenames are just a naming convention for those static overrides — nothing auto-derives them.

Drop the PNGs in `/public/brand/`. Existing assets there include `apple-icon.png`, `og.png`, `og-home.png`, plus the PWA manifest rasters (`icon-192.png`, `icon-512.png`, `icon-maskable-512.png`) and `logo.png` (schema.org Organization raster).

::: tip
`theme.hexColors` in `src/config/index.ts` mirrors the OKLCH brand/background tokens as hex for the **PWA manifest** (`app/manifest.ts` → `theme_color`/`background_color`), which can't take oklch. The OG card itself is a static PNG (`site.ogImage.file`), so it doesn't read these — but keep the mirror in sync so the install screen stays on-brand. See the [brand-setup guide](../setup/brand-setup.md).
:::
