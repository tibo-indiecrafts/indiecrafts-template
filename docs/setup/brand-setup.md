# Brand setup

Change colours, fonts, logo, social links, and brand assets without touching React. Everything below lives in `src/config/index.ts` + `public/`.

After any change, run `pnpm verify` locally to confirm types, lint, format, and contrast all still pass before pushing.

---

## 1. `site.*` — identity, contact, social

```ts
// src/config/index.ts
site = {
  name: "Acme",                            // <title> base + JSON-LD Organization
  tagline: "...",                          // shown in OG cards + footer
  description: "...",                      // <meta description>, OG description
  url: "https://acme.com",                 // ⚠ flip from PLACEHOLDER before launch
  ogImage: { … },                          // brand-default OG card route
  contact: { email: "hello@acme.com" },
  // Logo, favicon/app icon, social profiles, and business/structured-data are
  // now edited in Sanity (Studio → SEO & métadonnées), not here. See
  // docs/seo/editing-seo-in-sanity.md.
  legal: {
    company: "Acme SAS",
    foundingDate: "2024",
    address: { … },                        // schema.org PostalAddress
    contactPoint: { … },                   // schema.org ContactPoint
  },
}
```

**Until `site.url` is changed from the `https://example.com` placeholder, `isSiteConfigured` is `false`** and the site is intentionally hidden from search engines (the staging gate from [`launch-checklist.md`](./launch-checklist.md) § 1). Flipping it to the real domain unlocks sitemap canonicals, OG canonicals, schema.org URLs, and the `Allow: /` robots policy.

---

## 2. `theme.*` — the PWA hex mirror + container

The runtime color, radii, and font tokens live in **`src/app/globals.css`** (oklch)
and are consumed through Tailwind utilities — `theme` in config no longer mirrors
them. It carries only the two values that can't come from CSS at their point of use:

```ts
theme = {
  hexColors: {
    // The one hex the PWA manifest (app/manifest.ts → theme_color /
    // background_color) needs — the manifest spec can't take oklch.
    // Match it to --background in globals.css.
    background: "#ffffff",
  },
  container: { maxWidth: "1280px", gutter: "1rem" },
};
```

To change a brand colour, edit `globals.css` (oklch). To change the container
width or page gutter, edit `theme.container`.

````

### The one hex mirror

Colour lives in **one place** — oklch tokens in `globals.css`, consumed via Tailwind
utilities (modern browsers parse oklch natively). The single exception is
`theme.hexColors.background`: the **PWA manifest** (`app/manifest.ts` →
`theme_color` / `background_color`) is read by the browser for the install/splash
screen, and the manifest spec only takes hex/named colours — **not oklch**. So one
hex value mirrors `--background` to keep the install screen on-brand.

When you change the page background, update both `--background` in `globals.css` and
`theme.hexColors.background`. No other colour needs a mirror.

### Verify contrast

```bash
pnpm verify:contrast
````

Asserts WCAG AA on every token pair parsed from `src/app/globals.css` (`foreground`/`background`, `mutedForeground`/`background`, `brandForeground`/`brand`, `selectionFg`/`selectionBg`, …). Runs both light + dark themes independently — if a pair fails in either, it fails the whole check. The script tells you the ratio and the minimum needed.

This is also part of `pnpm verify` (the full CI gate), so failing contrast blocks the build.

### Selected text

`::selection` is wired to two brand-tinted tokens, `--selection-bg` + `--selection-fg`. Both adapt automatically to the active theme — the light variant uses a pale indigo wash with dark text; the dark variant uses a deeper indigo with light text. Both pass WCAG AA against each other (14.5:1 light, 9:1 dark).

You almost never need to touch these — they recolour every selectable surface on the site at once. The only reason to override would be intentionally suppressing brand colour on a specific section (e.g. a dark hero where the brand wash would visually fight with the cover image). In that case, scope an override:

```css
.no-brand-selection ::selection {
  background-color: var(--muted);
  color: var(--foreground);
}
```

### Windows High Contrast mode (forced-colors)

A `@media (forced-colors: active)` block at the bottom of `globals.css` remaps every token to OS system colours (`Canvas`, `CanvasText`, `LinkText`, `Highlight`, `Mark`). Vision-impaired Windows users who turn on High Contrast see the site rendered in their chosen palette automatically — no per-component work needed, because every utility already reads the same `--*` tokens.

You should never need to change this block. The mapping is conservative: backgrounds → `Canvas`, text → `CanvasText`, brand/links → `LinkText`, focus rings → `Highlight`.

---

## 3. Brand assets — all in Sanity

**Logo, favicon/app icon, and the Open Graph share card are edited in Sanity**
(Studio → **SEO & métadonnées**), not in `/public` — nothing brand-related lives
in the repo anymore. They are the sole source (no fallback); `pnpm seed` uploads
the defaults from `scripts/seed-media/`. Full guide:
[Editing SEO in Sanity](../seo/editing-seo-in-sanity.md).

| Sanity field                     | Drives                                               | Guidance                                 |
| -------------------------------- | ---------------------------------------------------- | ---------------------------------------- |
| `siteSettings.logo` / `logoDark` | header + footer logo (+ optional dark-theme variant) | any proportions; empty = wordmark        |
| `siteSettings.icon`              | favicon + apple-touch + PWA icons                    | square PNG ≥ 512×512; empty = no favicon |
| `siteMeta.<locale>.ogImage`      | Open Graph share card, per language                  | 1200×630; empty = no `og:image`          |
| `pageSeo.ogImage`                | per-page share card override                         | 1200×630                                 |

Export OG cards at **exactly 1200×630** — that's the standard 1.91:1 ratio the metadata declares (`og:image:width/height`). An off-size file (even 1179×630) mismatches the declared dimensions and can letterbox the card or trip strict validators (LinkedIn Post Inspector).

All `public/brand/*` files are cached `Cache-Control: public, max-age=31536000, immutable` (one year). If you ever need to swap an asset, change the filename so the URL changes and caches break naturally.

---

## 4. Image hosts (`next.config.ts`)

`next/image` only loads images from hosts on the allowlist. Defaults shipped:

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" },  // demo seed
    { protocol: "https", hostname: "cdn.sanity.io" },        // Sanity-hosted
  ],
}
```

If you reference an external image from anywhere else (a partner logo on the homepage, an embedded YouTube thumbnail, etc.), add the hostname here or the request will 500 in production.

---

## 5. `headerNav` — top navigation

```ts
headerNav = [
  { labelKey: "home", href: "/" },
  { labelKey: "blog", href: "/blog" },
  { labelKey: "about", href: "/about" }, // ⚠ also add a new entry to AppPathname
];
```

`labelKey` resolves under the `nav` namespace in `messages/<locale>.json` (`labelKey: "home"` → `nav.home`). Add the translation under `nav` in every locale file.

Removing an entry hides it from the header but the route stays reachable by direct URL. Hide an entire route at the routing layer by toggling `enabled: false` on its `pages.<id>` entry instead.

---

## 6. `analytics` + `features`

The two operational flags you'll touch most often:

```ts
features = {
  cookieBanner: false, // turn ON for EU traffic when GA is on
  legalPage: true, // /legal route
  blog: true, // public Sanity-driven blog surface
  studio: true, // Sanity Studio at /studio (gated separately from blog)
  llms: { index: true, full: true, pages: true }, // /llms.txt + /llms-full.txt + /llms/<id>
  localeSwitcher: true, // header language picker (auto-hides at 1 locale)
};

analytics = {
  googleAnalyticsId: "", // empty = no script loaded
};
```

### Cookie banner / GA / legal page — which flags to set

The three flags interact. This table shows the four reasonable combinations:

| Scenario                                    | `analytics.googleAnalyticsId` | `features.cookieBanner` | `features.legalPage` | Result                                                                                                                                                                                                        |
| ------------------------------------------- | ----------------------------- | ----------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No analytics, no banner                     | `""`                          | `false`                 | depends              | Lightest config. No scripts load, no banner. Pick `legalPage: true` if you need a `/legal` page for other reasons (terms, contact)                                                                            |
| GA, outside the EU                          | `"G-XXXX"`                    | `false`                 | `false` (or `true`)  | GA loads on every page. No banner. Legally fine outside GDPR jurisdictions.                                                                                                                                   |
| GA + EU traffic                             | `"G-XXXX"`                    | `true`                  | `true` (recommended) | GA loads with Consent Mode `denied` defaults. Banner flips to `granted` on accept. `/legal` exposes privacy / cookies / terms.                                                                                |
| Other tracking (Plausible, Fathom, Pirsch…) | `""`                          | depends                 | depends              | The cookie banner is **independent** of GA — only GA Consent Mode wiring is built-in. For privacy-friendly analytics you typically need neither the banner nor the legal page (no personal data, no consent). |

The banner stores user choice in `localStorage["cookie-consent"]` as `"accepted"` or `"rejected"`. Send users to `?cookies=manage` to surface the banner again without clearing other state — see [`operations.md`](./operations.md) § 4 for the user-side detail.

The launch-day verification curl pass is in [`launch-checklist.md`](./launch-checklist.md) § 4.

---

## 7. `locales` — language support

Add or remove a language in one place:

```ts
locales = [
  { code: "en", label: "English", abbr: "EN", dir: "ltr" },
  { code: "fr", label: "Français", abbr: "FR", dir: "ltr" },
];
defaultLocale = "en";
```

For each locale code, drop a matching `messages/<code>.json` (copy from `en.json`, translate, mirror the key set — locale parity is enforced by the CI gate). Routes, sitemap, locale switcher, and llms.txt all pick the new entry up automatically.

Monolingual? Delete the FR row + `messages/fr.json` and the switcher hides itself.

---

## 8. After any change

```bash
pnpm verify                   # full gate: tsc + lint + format + contrast
pnpm dev                      # eyeball locally
git diff                      # review changes before pushing
```

If `pnpm verify:contrast` fails, you broke an accessibility pair — review the failing pair, tweak the colours, re-run.

The OG card is a Sanity image (`siteMeta.<locale>.ogImage`), so a brand-colour change won't touch it — upload a new card in the Studio (SEO & métadonnées) to rebrand it, per language.
