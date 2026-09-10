# Brand setup

Recolour, re-font, and re-badge the site without touching React. Brand lives in two places by kind: **color, type, and layout** are code (design tokens + config + the font registry); **logo, favicon, and share cards** are content (Sanity). Nothing brand-related is hard-coded in components.

After any change, run `pnpm verify` to confirm types, lint, format, and contrast still pass.

---

## Where each brand surface lives

| Surface                                    | Home                                                                                                 | Edited by |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------- | --------- |
| Colours (light + dark)                     | `@indiecrafts/packages-shared-ui-tokens` → `code/packages/shared/ui-tokens/src/globals.css` (OKLCH)  | developer |
| PWA install/splash colour                  | `theme.hexColors.background` in `code/projects/web/surfaces/website/src/config/theme.ts` (app-owned) | developer |
| Container width + gutter                   | `theme.container` in `code/projects/web/surfaces/website/src/config/theme.ts`                        | developer |
| Font pairing                               | `fonts` in `code/projects/web/surfaces/website/src/config/fonts.ts` + registry in `src/lib/fonts.ts` | developer |
| Logo / dark logo / favicon                 | Sanity `siteSettings.{logo,logoDark,icon}`                                                           | editor    |
| Open Graph share card                      | Sanity `siteMeta.<locale>.ogImage` (+ per-page `seo.image` on the document)                          | editor    |
| Site name, tagline, social, business/legal | Sanity `siteSettings` / `siteMeta`                                                                   | editor    |

Brand name, contact, social profiles, and structured-data business fields no longer live in config — they moved to Sanity. Config keeps only `site.url` (see [`environment.md`](./environment.md)). Full Sanity walkthrough: [Editing SEO in Sanity](../seo/editing-seo-in-sanity.md).

---

## 1. Colours — OKLCH tokens

Colour lives in **one place**: the OKLCH tokens in `@indiecrafts/packages-shared-ui-tokens/globals.css`, consumed through Tailwind utilities (modern browsers parse `oklch()` natively). Light values sit under `:root`; dark values under `:root[data-theme="dark"]` and a `prefers-color-scheme: dark` block.

To rebrand a colour, edit the token — never a hex literal in a component.

### The one hex mirror

The single value that can't be OKLCH is `theme.hexColors.background` in `code/projects/web/surfaces/website/src/config/theme.ts`. The PWA manifest (`src/app/manifest.ts` → `background_color` / `theme_color`) is read by the browser for the install/splash screen and the manifest spec only accepts hex/named colours. Keep it matched to `--background` in `globals.css`. No other colour needs a mirror.

```ts
// @indiecrafts/packages-shared-config
theme = {
  hexColors: { background: "#ffffff" }, // mirror of --background for the PWA manifest
  container: { maxWidth: "1280px", gutter: "1rem" },
};
```

### Verify contrast

```bash
pnpm verify:contrast
```

Parses the OKLCH tokens (light + explicit dark + `prefers-color-scheme: dark`), converts to sRGB, and asserts WCAG AA on a fixed pair list — `foreground/background`, `muted-foreground/background`, `brand-foreground/brand`, `brand/background` (3:1), `ring/background` (3:1), `border/background` (1.5:1), `selection-fg/selection-bg`. It fails if any pair dips below its threshold in **either** theme, printing the ratio and the minimum needed. It's part of `pnpm verify`, so a failing pair blocks the gate. Add a new enforced pair by extending the `PAIRS` array in `scripts/check-contrast.mjs`.

### Selected text

`::selection` is wired to `--selection-bg` + `--selection-fg` (pale indigo wash / dark text in light, deep indigo / light text in dark). Both adapt to the active theme and pass AA against each other. You almost never touch these — they recolour every selectable surface at once. To suppress the brand wash on one section (e.g. a dark hero over a photo), scope an override:

```css
.no-brand-selection ::selection {
  background-color: var(--muted);
  color: var(--foreground);
}
```

### Windows High Contrast (forced-colors)

A `@media (forced-colors: active)` block at the bottom of `globals.css` remaps every token to OS system colours (`Canvas`, `CanvasText`, `LinkText`, `Highlight`). Windows High Contrast users get the site in their chosen palette automatically — no per-component work, because every utility already reads the same `--*` tokens. You should never need to change this block; the mapping is conservative (backgrounds → `Canvas`, text → `CanvasText`, links/brand → `LinkText`, focus → `Highlight`).

---

## 2. Fonts

The active pairing is one line in `@indiecrafts/packages-shared-config`:

```ts
// @indiecrafts/packages-shared-config
fonts = {
  display: "satoshi", // headings → --font-display
  body: "geist", // body     → --font-sans
  mono: "geist-mono", // code     → --font-mono
};
```

`next/font` needs statically-analyzable literal calls, so the fonts themselves are instantiated once in **`src/lib/fonts.ts`** (the registry) and given `--f-<key>` CSS variables. Config just picks which registered font plays each role. Ships a display/body split: **Satoshi** (self-hosted local variable font, `src/assets/fonts/Satoshi-Variable.woff2` + italic), **Geist** and **Geist Mono** (Google, auto-subset + self-hosted + preloaded). Set `display` equal to `body` for a single-typeface look.

**Add a font:** register a `Google(...)` or `localFont(...)` call in `src/lib/fonts.ts`, add its key to the `FontKey` type (still shared in `@indiecrafts/packages-shared-config`), then name it in `fonts` (`src/config/fonts.ts`). The `satisfies FontRoles` check keeps the registry and config in lockstep. Local fonts drop their `.woff2` in `src/assets/fonts/`.

Font details also covered in [`theme-modes.md`](../config/theme-modes.md).

---

## 3. Brand assets — in Sanity

**Logo, favicon/app icon, and the Open Graph card are edited in Sanity** (Studio → _Paramètres du site_ / _SEO & métadonnées_), not `/public`. They're the sole source, no code fallback; `pnpm seed` uploads the defaults from `scripts/seed-media/` (`logo.png`, `icon.png`, `og.png`, `og-fr.png`).

| Sanity field                     | Drives                                               | Guidance                          |
| -------------------------------- | ---------------------------------------------------- | --------------------------------- |
| `siteSettings.logo` / `logoDark` | header + footer logo (+ optional dark-theme variant) | any proportions; empty = wordmark |
| `siteSettings.icon`              | favicon + apple-touch + PWA icons                    | square PNG ≥ 512×512              |
| `siteMeta.<locale>.ogImage`      | Open Graph share card, per language                  | 1200×630                          |
| `seo.image` (on the document)    | per-page share card override                         | 1200×630                          |

Export OG cards at **exactly 1200×630** (the 1.91:1 ratio the metadata declares via `og:image:width/height`). An off-size file can letterbox the card or trip strict validators (LinkedIn Post Inspector).

A brand-colour change never touches the OG card — it's a Sanity image. To rebrand it, upload a new card per language in the Studio.

---

## 4. Image hosts (`next.config.ts`)

`next/image` only loads from hosts on the allowlist. Defaults:

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" }, // demo seed images
    { protocol: "https", hostname: "cdn.sanity.io" },        // Sanity-hosted assets
  ],
}
```

Reference an external image from anywhere else (a partner logo, a YouTube thumbnail) and you must add its hostname here, or the request 500s in production.

---

## 5. After any change

```bash
pnpm verify   # tsc + lint + format:check + verify:contrast + doctor:changed
pnpm dev      # eyeball locally
git diff      # review before pushing
```

A failed `verify:contrast` means you broke an accessibility pair — review the failing pair, tweak the token, re-run.
