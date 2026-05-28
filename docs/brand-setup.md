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
  logo: "/logo.svg",                       // header / footer / favicon source
  brandLogoPng: "/brand/logo.png",         // schema.org Organization (Google rejects SVG here)
  icon: { … },                             // favicon + apple-touch-icon refs
  ogImage: { … },                          // global OG card route
  contact: { email: "hello@acme.com" },
  social: {
    twitter: "@acme",                      // → twitter:site / creator
    github: "",                            // empty string = omitted
    linkedin: "https://linkedin.com/company/acme",
    instagram: "",
    mastodon: "",
  },
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

## 2. `theme.*` — colours, fonts, radii

```ts
theme = {
  hexColors: {
    // for next/og (Satori) — no oklch
    brand: "#5b21b6",
    brandForeground: "#ffffff",
    background: "#ffffff",
    foreground: "#0a0a0a",
  },
  colors: {
    // CSS vars — oklch encouraged
    brand: "oklch(0.46 0.21 290)",
    brandForeground: "oklch(1 0 0)",
    background: "oklch(1 0 0)",
    foreground: "oklch(0.18 0 0)",
    muted: "oklch(0.97 0 0)",
    mutedForeground: "oklch(0.46 0 0)",
    border: "oklch(0.92 0 0)",
    ring: "oklch(0.46 0.21 290)",
    // …
  },
  fonts: { sans: "Inter", mono: "JetBrains Mono" },
  radii: { sm: "0.25rem", md: "0.5rem", lg: "0.75rem", xl: "1rem" },
  container: { maxWidth: "1280px", gutter: "1rem" },
};
```

### The hex / oklch trap

`hexColors` and `colors` describe **the same palette twice**. They must stay in sync for the `brand` + `brandForeground` + `background` + `foreground` pair, because:

- `colors.*` becomes CSS variables consumed by Tailwind utilities — modern browsers parse oklch natively.
- `hexColors.*` is used by `next/og` (Satori) to render the OG cards as PNGs at build time. **Satori doesn't parse oklch** — it falls back to black if it can't read the value, which is how OG cards silently break.

When you change a colour, change it in both places. The contrast check below will scream if they drift far enough apart to break accessibility, but a subtle mismatch (e.g. picking a slightly different brand shade in oklch vs hex) won't get caught — only manual review will.

### Verify contrast

```bash
pnpm verify:contrast
```

Asserts WCAG AA on every pair in `theme.colors` (`foreground`/`background`, `mutedForeground`/`background`, `brandForeground`/`brand`, …). If a pair fails, the script tells you the ratio and the minimum needed.

This is also part of `pnpm verify` (the full CI gate), so failing contrast blocks the build.

---

## 3. Brand assets — `public/`

Drop files at these exact paths:

| File                                 | Role                                                   | Dimensions / format                  |
| ------------------------------------ | ------------------------------------------------------ | ------------------------------------ |
| `public/logo.svg`                    | Browser favicon source + UI logo                       | SVG, any reasonable proportions      |
| `public/brand/apple-icon.png`        | iOS home-screen icon                                   | 180×180, opaque background           |
| `public/brand/icon-192.png`          | PWA install                                            | 192×192                              |
| `public/brand/icon-512.png`          | PWA install                                            | 512×512                              |
| `public/brand/icon-maskable-512.png` | Adaptive Android icon                                  | 512×512 with ~10% safe-area padding  |
| `public/brand/logo.png`              | schema.org Organization logo (Google rejects SVG here) | Square, ≥512×512                     |
| `public/brand/og.png`                | Global Open Graph card                                 | 1200×630                             |
| `public/brand/og-<id>.png`           | Per-page OG card                                       | 1200×630, auto-detected by `page.id` |

Per-page OG cards are optional — when a file isn't present, the global `og.png` is used.

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
  { href: "/", labelKey: "nav.home" },
  { href: "/blog", labelKey: "nav.blog" },
  { href: "/about", labelKey: "nav.about" }, // ⚠ also add a new entry to AppPathname
];
```

`labelKey` is a path into `messages/<locale>.json`. Add the translation in every locale file.

Removing an entry hides it from the header but the route stays reachable by direct URL. Hide an entire route at the routing layer by toggling `enabled: false` on its `pages.<id>` entry instead.

---

## 6. `analytics` + `features`

The two operational flags you'll touch most often:

```ts
features = {
  cookieBanner: false, // turn ON for EU traffic when GA is on
  legalPage: false, // /legal route
  blog: true, // every Sanity-driven route
  llmsTxt: true, // /llms.txt + /llms-full.txt + /llms/<id>
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

If the OG card looks wrong after a brand change, check that `theme.hexColors.brand` matches `theme.colors.brand`. Visit `/opengraph-image` in the browser to see the live render.
