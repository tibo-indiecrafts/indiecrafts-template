# New client — bring-up runbook

Fork this template into a client site: clone, wire Sanity, set the handful of code-level config values, then author brand + content in the Studio. Read top-to-bottom on first use; keep it open as a checklist afterwards.

The split to internalise up front: **code carries structure, Sanity carries content.** Only a thin slice lives in `@indiecrafts/packages-shared-config` (`code/packages/shared/config/src/index.ts`) — origin URL, feature flags, locales, theme modes, font pairing, route map. Everything a client actually rebrands — name, tagline, description, logo, favicon, OG cards, social profiles, nav, business/legal fields, SEO copy, analytics id, cookie banner — is edited in the Studio at `/studio`.

Companion docs:

- [`../../../modules/blog/sanity-setup.md`](../../../modules/blog/sanity-setup.md) — full Studio bring-up + smoke test
- [`../../../modules/blog/sanity-tokens.md`](../../../modules/blog/sanity-tokens.md) — minting Viewer / Editor tokens (web UI, CI, rotation)
- [`./brand-setup.md`](./brand-setup.md) — brand colors, logo, favicon, OG assets
- [`./environment.md`](./environment.md) — every env var in depth
- [`./launch-checklist.md`](./launch-checklist.md) — the final pre-deploy pass
- [`../seo/editing-seo-in-sanity.md`](../seo/editing-seo-in-sanity.md) — where per-page SEO copy lives

---

## 1. Pick a duplication model

| Model                                      | Sanity                                                                                                                | When to pick                                               |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Fork + new Sanity project**              | Brand-new project; the client owns the bill + permissions                                                             | Default for paid client work                               |
| **Fork + new dataset on a shared project** | Same project id, dataset like `acme-prod` (**never reuse `production`** — clients on one project would share content) | Internal projects or many low-traffic clients you maintain |
| **Fork without Sanity**                    | `features.blog: false` + `features.studio: false`, no Studio                                                          | Brochure site with no blog or editor surface               |

The rest of this doc assumes the **first model**.

---

## 2. Clone + install

```bash
git clone git@github.com:<your-org>/indiecrafts-template.git client-acme
cd client-acme
pnpm install
```

This is a pnpm + Turbo monorepo; the workspace root is the repo root. All app scripts run from there (`pnpm dev`, `pnpm build`, `pnpm seed`, …) and fan out through Turbo to `@indiecrafts/web-surfaces-website` at `code/projects/web/surfaces/website`. Rename the root `package.json` `name` while you are here if you want the workspace to read as the client's.

**Then rename the project namespace — one command, do it now:**

```bash
pnpm project:rename <slug>     # e.g. acme  (lowercase, unique per client)
```

This sets `DEFAULT_SITE_PREFIX` in `@indiecrafts/packages-shared-config` **and** every `wrangler.toml` resource name (`<prefix>-<env>-web-website*`) together. The prefix namespaces the browser keys (consent record, theme, locale cookie) and the Cloudflare Worker + R2 buckets, so two clients never collide. A `staging`/`prod` deploy is **blocked** until you do this (a shared-Cloudflare-account guard). It then prints the R2 buckets to create (§10).

---

## 3. Environment variables

```bash
cp code/projects/web/surfaces/website/.env.example code/projects/web/surfaces/website/.env.local
```

Every var is optional — the template boots with none set (placeholder origin, no Sanity). Fill in what the client needs:

| Variable                         | Scope           | Notes                                                                                                                                                                                                                                                                                       |
| -------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | production only | Scheme + host, no trailing slash (`https://acme.com`). Feeds `site.url` → `metadataBase`, canonicals, sitemap, JSON-LD, OG, robots. While unset the site keeps the placeholder origin, `isSiteConfigured` stays `false`, and robots serves a full `Disallow: /`.                            |
| `NEXT_PUBLIC_SITE_PREFIX`        | optional        | The per-deployment namespace. Usually **unset** — `pnpm project:rename` (§2) sets `DEFAULT_SITE_PREFIX` in config instead. Set this only to override the namespace by env without editing code. Prefixes the consent/theme/locale keys; must be unique per client.                          |
| `NEXT_PUBLIC_ENVIRONMENT`        | optional        | `development` \| `test` \| `staging` \| `production`. Only `production` is indexable; every other value serves `Disallow: /`. Drives the CSP in `next.config.ts`. When unset, `NODE_ENV` decides. Set `staging` on preview deploys for the tighter CSP.                                     |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | all envs        | Public. Required for the Studio and any `@indiecrafts/packages-web-sanity/client` query.                                                                                                                                                                                                                 |
| `NEXT_PUBLIC_SANITY_DATASET`     | all envs        | Public. Usually `production`.                                                                                                                                                                                                                                                               |
| `NEXT_PUBLIC_SANITY_API_VERSION` | all envs        | Pins query semantics. Defaults to `2025-01-01`; bump intentionally.                                                                                                                                                                                                                         |
| `SANITY_API_READ_TOKEN`          | all envs        | **Server-only.** Viewer role is enough. Powers draft-mode preview (`/api/draft-mode/enable`) and the live-preview fetch used by blog routes.                                                                                                                                                |
| `SANITY_API_WRITE_TOKEN`         | local only      | Editor role. Read **only** by `pnpm seed`. Never set it in a deploy env.                                                                                                                                                                                                                    |
| `RESEND_API_KEY`                 | server-only     | Transactional email. **Reusing the template:** one key = one shared Resend account (shared quota/logs/verified domains). Give each client its **own** Resend account/key for real isolation — the per-site `From` (Sanity) is not enough. Verify with Studio → E-mails → "Envoyer un test". |

Never commit `.env.local` — `.gitignore` already blocks every `.env*` except `.env.example`. Never move a server token under a `NEXT_PUBLIC_` prefix.

---

## 4. Create the Sanity project

```bash
pnpm dlx sanity@latest login
pnpm dlx sanity@latest init
# → "Create new project"
# → project name (e.g. "Acme")
# → dataset name (default: "production")
# → answer "n" to "add example schemas" — the template ships its own
```

Save the printed project id into `NEXT_PUBLIC_SANITY_PROJECT_ID`.

Mint the two runtime tokens:

```bash
pnpm dlx sanity@latest tokens add "Viewer (read-only)" --project-id <ID> --role viewer --json
pnpm dlx sanity@latest tokens add "Editor (seed only)" --project-id <ID> --role editor --json
```

Copy the `sk_…` string out of each JSON response — it is shown **once**. Viewer → `SANITY_API_READ_TOKEN`, Editor → `SANITY_API_WRITE_TOKEN`. Detail (web UI path, CI, rotation) in [`../../../modules/blog/sanity-tokens.md`](../../../modules/blog/sanity-tokens.md).

### Whitelist your dev origin (CORS)

Without this the Studio at `http://localhost:3000/studio` loads but every API request fails with `CorsOriginError`.

```bash
pnpm dlx sanity@latest cors add http://localhost:3000 --credentials --project-id <ID>
```

`--credentials` is required so the Studio session cookie is sent. Repeat for every origin that talks to the project:

```bash
pnpm dlx sanity@latest cors add https://acme.com --credentials --project-id <ID>
pnpm dlx sanity@latest cors add https://staging.acme.com --credentials --project-id <ID>
```

Web UI alternative: Sanity manage → your project → API → CORS origins → Add CORS origin → tick **Allow credentials**.

---

## 5. Set the code-level config (`@indiecrafts/packages-shared-config`)

Edit `code/packages/shared/config/src/index.ts`. It is almost pure data — every field is commented in-file, so open it side by side. What matters per client:

### 5.1 — `site.url`

Not edited in the file — `site.url` reads `NEXT_PUBLIC_SITE_URL` (§3). Until it points at a real origin, `isSiteConfigured` is `false` and canonical/sitemap/OG URL emission stays on the placeholder. Name, tagline, description, contact, social, and business/legal fields are **not here** — they live in Sanity (`siteSettings` / `siteMeta`).

### 5.2 — `theme`

```ts
export const theme = {
  hexColors: { background: "#ffffff" }, // hex mirror of --background for the PWA manifest
  container: { maxWidth: "1280px", gutter: "1rem" },
} as const;
```

`hexColors.background` exists only because the PWA manifest (`app/manifest.ts` → `theme_color` / `background_color`) can't read OKLCH — keep it matched to `--background`. The actual palette (brand colors and all) is authored in OKLCH in `@indiecrafts/packages-shared-ui-tokens/globals.css`, the authoritative color source — see [`./brand-setup.md`](./brand-setup.md). After any palette change run `pnpm verify:contrast` to confirm WCAG AA holds.

Theme **modes** are a separate `themeConfig` object:

```ts
export const themeConfig = {
  light: true,
  dark: true,
  system: true,
  forced: null,
};
```

`forced` (a `ThemeName` or `null`) wins over everything and hides the toggle — set `forced: "dark"` to lock one mode. Full behaviour in [`../config/theme-modes.md`](../config/theme-modes.md).

### 5.3 — `fonts` (typeface pairing)

```ts
export const fonts = { display: "satoshi", body: "geist", mono: "geist-mono" };
```

One registered font per role; swapping the whole pairing is this one line. `display` drives headings — set it equal to `body` for a single-face look. The fonts themselves are loaded in the registry (`src/lib/fonts.ts`), because `next/font` needs static literal loader calls. The template ships **Satoshi** (self-hosted variable font, `.woff2` in `src/assets/fonts/`) + **Geist** / **Geist Mono** (Google). Add a font → register a `Google(...)` / `localFont(...)` call in `src/lib/fonts.ts`, extend the shared `FontKey` type in `code/packages/shared/config/src/types.ts`, then name it here (`code/projects/web/surfaces/website/src/config/fonts.ts`). Full guide: [`../design/typography.md`](../design/typography.md).

### 5.4 — `i18n` (locales)

```ts
locales: [
  { code: "en", label: "English", abbr: "EN", dir: "ltr" },
  { code: "fr", label: "Français", abbr: "FR", dir: "ltr" },
],
defaultLocale: "en",
localePrefix: "as-needed", // default locale unprefixed, others /<code>
localeDetection: true,
```

Row order is the switcher order; the `Locale` union, routing, sitemap, hreflang, and llms endpoints all derive from this array. **Monolingual client?** Strip a row + delete its `messages/<code>.json`. **Add a language?** Add a row + drop `messages/<code>.json`. Detail in [`../config/i18n-and-routing.md`](../config/i18n-and-routing.md).

### 5.5 — `features` flags

```ts
export const features = {
  llms: { index: true, full: true, pages: true }, // /llms.txt · /llms-full.txt · /llms/<id>
  rss: true, // RSS + Atom (requires blog)
  sitemap: true, // /sitemap.xml
  structuredData: true, // all JSON-LD
  localeSwitcher: true, // header locale picker
  legal: {
    notice: true,
    privacy: true,
    cookies: true,
    terms: true,
    sales: false,
  },
  faq: true, // per-page FAQ + FAQPage JSON-LD
  blog: true, // public blog surface (route-gated)
  blogTaxonomy: { authors: true, categories: true, tags: true },
  studio: true, // /studio + draft-mode preview (independent of blog)
  maintenance: false, // site-wide 503 (proxy rewrites to /maintenance)
};
```

`blog: false` drops every blog route from routing, sitemap, llms, RSS, and nav. `studio` is gated **separately**, so `studio: true` keeps editors working while the public blog is hidden. Each `legal.*` and `blogTaxonomy.*` toggles a route independently. Full per-flag behaviour: [`../config/feature-flags.md`](../config/feature-flags.md). Maintenance mode: [`./maintenance-mode.md`](./maintenance-mode.md).

Note: analytics id and the cookie-consent banner are **not** flags here — both are edited in Sanity (`siteSettings.analytics`). See [`../seo/analytics.md`](../seo/analytics.md) and [`/packages/compliance`](/packages/compliance).

### 5.6 — `seoDefaults`

Site-wide head defaults only: `robots` (global index/follow + googleBot), `openGraph.type` (`website`), `twitter.card` (`summary_large_image`), and `schemaImage` (rich-result image path, empty = reuse the OG card). The title template and default title are built in the layout from the Sanity `siteName` + locale tagline — not here. No default OG image: the card is Sanity-only.

### 5.7 — `pages`

One entry per static route, structural only — `key`, `id`, `slug` (a string, or `{ [locale]: string }` for per-locale paths like the legal pages), and optional `enabled` (feature-gate). **Per-page SEO copy is Sanity-only** — on each rendering document's `.seo` (the shared `seoMeta`), not this map. Adding a static route = an entry here + a literal in `STATIC_PATHNAME_KEYS` (`code/packages/shared/config/src/types.ts`) + the matching folder under `src/app/[locale]/`.

### 5.8 — `madeBy` (do not touch)

The fixed maker credit rendered in the footer (indiecrafts.dev). Its `title` / `description` / `image` are indiecrafts.dev's real live OG data — deliberately survives a client rebrand. Leave it.

---

## 6. Author brand + content in Sanity

Everything client-facing lives in the Studio at `/studio`. Run `pnpm dev`, open it, and fill the singletons (French desk labels shown):

| Studio section             | Singleton           | Carries                                                                                                                                                                                   |
| -------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SEO & métadonnées**      | `siteMeta.<locale>` | Per-language site-wide defaults: tagline, description, keywords, default OG share card, llms.txt summary + resources (per-page SEO lives on each document's **SEO & visibilité** section) |
| (site settings)            | `siteSettings`      | Site name, logo + `logoDark`, favicon/app `icon`, social profiles, business/legal entity, analytics id, global schemas                                                                    |
| **Navigation**             | `navigation`        | Header menu + footer columns (sole runtime source — no config fallback)                                                                                                                   |
| **Cookies & consentement** | (cookie consent)    | Consent banner copy + behaviour                                                                                                                                                           |
| **Pages légales**          | `legalPage` docs    | Legal page bodies (per locale)                                                                                                                                                            |

Brand assets are Sanity-only — nothing lives in `/public`:

- `siteSettings.logo` / `logoDark` — header/footer logo (+ dark variant)
- `siteSettings.icon` — favicon + apple-touch + PWA icons (square PNG ≥ 512×512)
- `siteMeta.<locale>.ogImage` — Open Graph card, per language (1200×630)

Favicon and OG are emitted with no fallback: empty = no favicon / no `og:image`. `pnpm seed` (§8) uploads defaults from `code/projects/web/surfaces/website/scripts/seed-media/` (`logo.png`, `icon.png`, `og.png`, `og-fr.png`). Deeper walkthrough: [`./brand-setup.md`](./brand-setup.md) and [`../seo/editing-seo-in-sanity.md`](../seo/editing-seo-in-sanity.md).

---

## 7. Edit `messages/<locale>.json`

One flat file per locale (`code/projects/web/surfaces/website/messages/en.json`, `fr.json`). These drive **chrome + on-page block copy** — not SEO metadata (that is Sanity, §6). Keys worth attention per client:

- **Site-level** — `common` (skip-link, theme toggle, locale switcher), `typography` (quote marks, decimal separator, date format), `validation` (form errors).
- **Marketing home** — `pages.home.*`: `hero` + the block copy under `blocks` (features, cta, pricing, testimonials, featured, icons). Drop a section you don't need by removing its mount in `src/app/[locale]/(home)/page.tsx` and deleting its keys.
- **Blog chrome** (when `blog: true`) — `pages.blog.*`, `pages.author.*`, `pages.category.*`, `pages.tag.*`: headings, button labels, breadcrumb names. Sanity drives blog _content_; these drive everything _chromatic_.

Keep `en.json` and `fr.json` key-parallel — same keys, translated.

---

## 8. Seed (optional) + Studio bring-up

### Option A — start clean

Skip the seed. With `pnpm dev` running, open `/studio` and create your first documents (Auteur → Catégorie → Tag → Article). Authors are global (no language picker); categories, tags, and articles pick a Français/English leaf then "+ Créer". Full step-by-step + smoke test: [`../../../modules/blog/sanity-setup.md`](../../../modules/blog/sanity-setup.md).

### Option B — re-seed with your own demo content

`pnpm seed` runs `node --env-file=.env.local scripts/seed-demo.mjs` (needs `SANITY_API_WRITE_TOKEN`). It seeds EN+FR authors, categories, tags, posts, quotes, people, the `siteMeta` + `siteSettings` singletons, and an empty-`postModules` blog singleton. Edit the data arrays and image URLs at the top of `code/projects/web/surfaces/website/scripts/seed-demo.mjs`, then:

```bash
pnpm seed
```

#### Re-seed semantics — read once

The whole seed is one `createOrReplace` transaction over every doc, keyed by `_id`. It is idempotent and **write-only — it never deletes**.

| Action                               | Behavior                                                     |
| ------------------------------------ | ------------------------------------------------------------ |
| Re-run with same data                | No-op — identical writes are skipped                         |
| Edit a field, re-run                 | Doc with that `_id` updated in place. **No duplicates.**     |
| Add a new doc to the script, re-run  | New doc appears; existing docs untouched                     |
| Remove a doc from the script, re-run | **Old doc stays in Sanity** — the seed only writes           |
| Change a doc's `_id`, re-run         | Old `_id` orphaned (still in the dataset); new `_id` created |
| Change an image URL, re-run          | New image fetched + uploaded as a new asset; old asset stays |

#### Cleanup — clearing orphans

```bash
# One doc by id (confirms before commit)
pnpm dlx sanity@latest documents delete <doc._id> --dataset <name>

# Bulk-delete a whole type (e.g. all old tags)
pnpm dlx sanity@latest documents query '*[_type == "tag"]._id' \
  --dataset <name> --json | jq -r '.[]' | \
  xargs -I{} pnpm dlx sanity@latest documents delete {} --dataset <name>

# Nuclear — wipe the dataset clean (DESTROYS EVERYTHING)
pnpm dlx sanity@latest dataset delete <name>
pnpm dlx sanity@latest dataset create <name>
pnpm seed
```

#### When to re-seed in practice

- **During template iteration** — often. Edit + re-run while shaping the schema.
- **After deploying for a client** — never. Production content lives in the Studio; re-seeding overwrites real edits to any doc whose `_id` matches a seed entry.
- **For a clean demo** — destroy + recreate the dataset so removed entries don't linger.

### Blog layout + inline content

The blog singleton (Studio → Blog) owns two arrays: `frontpageModules` that composes the `/blog` frontpage, and `postModules` that composes every `/blog/[slug]`. Both are empty ⇒ fall back to default layouts (the homepage hero-mosaic and per-post article shell); populate them to give the frontpage and articles custom shells. Editable in the Studio without a deploy. Rich content inside a post body goes via the inline modules picker. Full editor mechanics: [`../../../modules/blog/editor-guide.md`](../../../modules/blog/editor-guide.md) and [`../../../modules/blog/body-editor.md`](../../../modules/blog/body-editor.md).

---

## 9. Verify before deploy

```bash
pnpm verify:quick   # tsc + lint (manual pre-PR check)
pnpm verify         # full gate: tsc + lint + format:check + verify:contrast + doctor:changed (CI runs this)
pnpm build          # prerenders every static route × locale
```

Then walk the smoke test in [`../../../modules/blog/sanity-setup.md`](../../../modules/blog/sanity-setup.md) once, and run the final pass in [`./launch-checklist.md`](./launch-checklist.md).

---

## 10. Deploy

The app deploys to **Cloudflare Workers** ([runbook](./deployment)). **You must have run `pnpm project:rename <slug>` (§2)** — a `staging`/`prod` deploy is blocked while the Worker/R2 names are the template default (shared-account clobber guard). Then create the `<slug>-<env>-web-website-isr` R2 buckets it printed and set these as Worker vars/secrets (and GitHub Environment vars/secrets for CI):

| Variable                         | Where         | Notes                                                                          |
| -------------------------------- | ------------- | ------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`           | production    | Real origin — unlocks live canonical/sitemap/OG and indexable robots           |
| `RESEND_API_KEY`                 | server secret | Transactional email — give each client its **own** Resend account/key (see §3) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | all envs      | Public — the Studio uses it too                                                |
| `NEXT_PUBLIC_SANITY_DATASET`     | all envs      | Usually `production`                                                           |
| `NEXT_PUBLIC_SANITY_API_VERSION` | all envs      | Match local (`2025-01-01` default)                                             |
| `SANITY_API_READ_TOKEN`          | all envs      | Server-only; runtime preview client uses it                                    |
| `NEXT_PUBLIC_ENVIRONMENT`        | optional      | `staging` on preview deploys → tighter CSP + `Disallow: /`                     |
| `SANITY_API_WRITE_TOKEN`         | **never**     | Editor token; only the local seed script needs it                              |

Robots: with `NEXT_PUBLIC_SITE_URL` set and `NEXT_PUBLIC_ENVIRONMENT=production`, sitemap + canonicals go live and the site is indexable. `seoDefaults.robots` controls global index/follow; per-post `noIndex` lives under a post's **SEO & visibilité** section. Detail: [`../seo/robots-and-environments.md`](../seo/robots-and-environments.md).

---

## 11. Quick reference — what to edit where

| Want to change                                                    | Where                                                                                                                                                                                                      |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project namespace (deploy names + browser keys)                   | `pnpm project:rename <slug>` → `DEFAULT_SITE_PREFIX` (config) + `wrangler.toml`                                                                                                                            |
| Production origin (canonicals, sitemap, robots)                   | `NEXT_PUBLIC_SITE_URL` env                                                                                                                                                                                 |
| Brand name, tagline, description, social, contact, business/legal | Sanity → SEO & métadonnées / site settings                                                                                                                                                                 |
| Logo, favicon, OG cards                                           | Sanity (`siteSettings.logo`/`icon`, `siteMeta.<locale>.ogImage`)                                                                                                                                           |
| Header/footer nav                                                 | Sanity → Navigation                                                                                                                                                                                        |
| Per-page SEO copy                                                 | Sanity (each document's **SEO & visibilité** section — the shared `seoMeta`)                                                                                                                               |
| Analytics id, cookie banner                                       | Sanity (`siteSettings.analytics`)                                                                                                                                                                          |
| Brand palette (OKLCH)                                             | `@indiecrafts/packages-shared-ui-tokens/globals.css`                                                                                                                                                                       |
| PWA manifest bg color                                             | `code/projects/web/surfaces/website/src/config/theme.ts` → `theme.hexColors`                                                                                                                               |
| Font pairing                                                      | `code/projects/web/surfaces/website/src/config/fonts.ts` → `fonts` (+ registry `src/lib/fonts.ts`, shared `FontKey` type in `packages/shared/config/src/types.ts`)                                                |
| Theme modes (light/dark/forced)                                   | `config/src/index.ts` → `themeConfig`                                                                                                                                                                      |
| Locales                                                           | `config/src/index.ts` → `i18n.locales` + `messages/<code>.json`                                                                                                                                            |
| Feature flags                                                     | `config/src/index.ts` → `features`                                                                                                                                                                         |
| Site-wide SEO defaults                                            | `config/src/index.ts` → `seoDefaults`                                                                                                                                                                      |
| Static route list                                                 | `config/src/index.ts` → `pages` + `STATIC_PATHNAME_KEYS` (`config/src/types.ts`) + folder under `src/app/[locale]/`                                                                                        |
| Marketing home copy                                               | `messages/<locale>.json` → `pages.home.*`                                                                                                                                                                  |
| Blog chrome copy                                                  | `messages/<locale>.json` → `pages.blog.*` etc.                                                                                                                                                             |
| Blog content (posts, authors, categories, tags, layout)           | Sanity → `/studio`                                                                                                                                                                                         |
| Add a home section                                                | Copy a section from your component library (browse-only) into `src/user-interface/homepage/sections/`, mount in `(home)/page.tsx`, add message keys — see [`../design/sections.md`](../design/sections.md) |

---

## Critical rules (the NEVERs)

- NEVER commit `.env*` except `.env.example`.
- NEVER hard-code brand strings, URLs, colors, or nav — read from `@indiecrafts/packages-shared-config` (or the relevant Sanity singleton).
- NEVER inline user-facing strings — every visible string lives in `messages/<locale>.json`.
- NEVER import from `next/link` or `next-intl/navigation` — the app uses typed `@/i18n/routing`.
- NEVER expose `SANITY_API_READ_TOKEN` (or the write token) under a `NEXT_PUBLIC_` prefix.
- NEVER instantiate a Sanity `createClient` per route — use `@indiecrafts/packages-web-sanity/client`.

Full list in the app brief, [`code/projects/web/surfaces/website/CLAUDE.md`](../../../../code/projects/web/surfaces/website/CLAUDE.md).
