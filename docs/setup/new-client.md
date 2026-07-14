# New client — duplication runbook

How to fork this template for a new client site, including Sanity wiring. Read top-to-bottom on first use; afterwards keep open as a checklist.

Companion docs:

- [`../features/blog/sanity-setup.md`](../features/blog/sanity-setup.md) — full Sanity Studio bring-up + smoke tests
- [`../features/blog/sanity-tokens.md`](../features/blog/sanity-tokens.md) — how to mint Viewer / Editor tokens
- [`../seo/structured-data-cookbook.md`](../seo/structured-data-cookbook.md) — per-page JSON-LD recipes

---

## 1. Pick a duplication model

Three flavors, choose one:

| Model                                    | Sanity                                                    | When to pick                                                  |
| ---------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------- |
| **Fork + new Sanity project**            | Brand new project, one client owns the bill + permissions | Default for paid client work                                  |
| **Fork + new dataset on shared project** | Same project ID, dataset like `acme-prod`                 | Internal projects or many low-traffic clients you'll maintain |
| **Fork without Sanity**                  | `features.blog: false`, no Studio                         | Brochure site that doesn't need a blog                        |

The rest of this doc assumes the **first model**.

---

## 2. Clone + install

```bash
git clone git@github.com:<your-org>/indiecrafts-template.git client-acme
cd client-acme
pnpm install
```

Rename the package while you're here:

```bash
# package.json
{
  "name": "client-acme",
  "version": "0.1.0"
}
```

---

## 3. Create the Sanity project

```bash
pnpm dlx sanity@latest login
pnpm dlx sanity@latest init
# → "Create new project"
# → pick a project name (e.g. "Acme")
# → pick a dataset name (default: "production")
# → answer "n" when it asks to add example schemas (we have our own)
```

That prints the project ID. Save it.

Mint the two tokens you need at runtime:

```bash
pnpm dlx sanity@latest tokens add "Viewer (read-only)" --project-id <ID> --role viewer --json
pnpm dlx sanity@latest tokens add "Editor (seed only)" --project-id <ID> --role editor --json
```

Copy the `sk_…` strings out of each JSON response — they're shown ONCE.

> Need detail on tokens (web UI path, CI, rotation)? See [`../features/blog/sanity-tokens.md`](../features/blog/sanity-tokens.md).

### Whitelist your dev origin (CORS)

Without this, the Studio at `http://localhost:3000/studio` loads but every API request fails with `CorsOriginError`.

```bash
pnpm dlx sanity@latest cors add http://localhost:3000 \
  --credentials --project-id <ID>
```

`--credentials` is required so the Studio session cookie is sent. Repeat for every origin that needs to talk to this project:

```bash
pnpm dlx sanity@latest cors add https://acme.com --credentials --project-id <ID>
pnpm dlx sanity@latest cors add https://staging.acme.com --credentials --project-id <ID>
```

Web UI alternative: https://www.sanity.io/manage/personal/project/&lt;ID&gt;/api → CORS origins → Add CORS origin → tick **Allow credentials**.

---

## 4. Configure `.env.local`

```bash
cp .env.example .env.local
```

Edit:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<the new project ID>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=<viewer token>   # used at runtime by the live preview client
SANITY_API_WRITE_TOKEN=<editor token>  # only read by scripts/seed-blog-demo.mjs
```

Never commit `.env.local`. `.gitignore` already blocks it.

---

## 5. Edit `src/config/index.ts`

This file is the **single source of truth** for everything that isn't Sanity-driven content. Every value below has a comment in the file — open it side by side.

### 5.1 — `site` block

```ts
site = {
  name: "Acme",
  tagline: "...",                       // shown in <title>, OG cards, footer
  description: "...",                   // <meta description>, OG, schema.org
  url: "https://acme.com",              // ⚠️ MUST change from PLACEHOLDER_SITE_URL
  logo: "/logo.svg",                    // file at /public/logo.svg
  brandLogoPng: "/brand/logo.png",      // raster for schema.org Organization
  icon: { ... },                        // favicon + apple-touch-icon
  ogImage: { ... },                     // /opengraph-image route
  contact: { email: "..." },
  social: {                             // empty string = omitted
    twitter: "@acme",
    github: "",
    linkedin: "https://www.linkedin.com/company/acme",
    instagram: "",
    mastodon: "",
  },
  legal: {
    company: "Acme SAS",
    foundingDate: "2024",
    address: { ... },                   // schema.org PostalAddress (any field can be empty)
    contactPoint: { ... },              // schema.org ContactPoint
  },
}
```

Until `site.url` is changed from `PLACEHOLDER_SITE_URL`, `isSiteConfigured` is `false` and a few schema.org emissions are skipped. Setting it to the real domain unlocks sitemap canonical, OG canonicals, etc.

### 5.2 — `theme` block

```ts
theme = {
  hexColors: { brand, brandForeground, background, foreground },  // hex mirror for the PWA manifest (no oklch)
  colors: { brand, brandForeground, ... },                        // CSS vars (oklch ok here)
  fonts: { sans, mono },
  radii: { sm, md, lg, xl },
  container: { maxWidth, gutter },
}
```

Keep `hexColors` in sync with `colors` for the brand/foreground pair — the PWA manifest (`app/manifest.ts`) reads `hexColors` for its `theme_color`/`background_color`, and the manifest spec can't take oklch.

After any theme change, run `pnpm verify:contrast` to confirm WCAG AA holds on the new palette.

### 5.3 — `locales`

```ts
locales = [
  { code: "en", label: "English", abbr: "EN", dir: "ltr" },
  { code: "fr", label: "Français", abbr: "FR", dir: "ltr" },
];
defaultLocale = "en";
```

Monolingual client? Strip the row + delete `messages/fr.json`. Multilingual with a new language? Add the row + drop `messages/<code>.json`.

### 5.4 — `features` flags

```ts
features = {
  llms: { index: true, full: true, pages: true }, // /llms.txt · /llms-full.txt · /llms/<id>
  rss: true, // /blog/rss.xml (requires blog)
  sitemap: true, // /sitemap.xml
  structuredData: true, // all JSON-LD (Organization/WebSite/WebPage/FAQ)
  localeSwitcher: true, // header locale picker (auto-hides at 1 locale)
  cookieBanner: false, // GA Consent Mode banner — turn ON for EU + GA
  legalPage: true, // /legal route
  faq: true, // per-page FAQ accordion + FAQPage JSON-LD
  blog: true, // public blog surface — /blog, /author, /blog/tag, /blog/category
  studio: true, // Sanity Studio at /studio + draft-mode preview (independent of blog)
  maintenance: false, // site-wide 503 maintenance page (see maintenance-mode.md)
};
```

Turning `blog: false` drops every blog route from routing, sitemap, llms.txt, and the header. `/studio` is gated **separately** by `features.studio`, so leaving `studio: true` keeps editors working while the public blog is hidden.

### 5.5 — `analytics`

```ts
analytics = { googleAnalyticsId: "" }; // empty = no script loaded
```

Outside the EU you can leave the cookie banner off and the script loads unconditionally. Inside the EU, flip `cookieBanner: true` and the script only fires after consent.

### 5.6 — `headerNav`

Already wired — only displays Home + Blog when `features.blog` is on. Add more entries by extending the array and the `AppPathname` union in `src/config/types.ts`.

### 5.7 — `pages.*`

One entry per static route. Each has `key`, `id`, `slug`, optional `enabled`, optional `seo.keywords`. Defaults derive title + description + OG image from the page id; override via `seo.titleKey` / `seo.descriptionKey` / `seo.openGraph.imageUrl` if needed.

### 5.8 — `seoDefaults`

`titleTemplate`, robot rules, OG type/siteName, twitter card, Search Console verification codes (empty by default).

### 5.9 — `globalSchemas`

Extra site-wide JSON-LD beyond `Organization` + `WebSite` (which are always emitted). Pulled into the layout's `@graph`. Cookbook at [`../seo/structured-data-cookbook.md`](../seo/structured-data-cookbook.md).

---

## 6. Edit `messages/<locale>.json`

Single flat file per locale. The keys that need attention per client:

### Site-level

```jsonc
{
  "site": { "tagline": "...", "description": "..." },     // copy here only used if config doesn't override
  "nav": { ... },                                          // labels for headerNav items
  "common": { ... },                                       // skip-link, theme toggle, locale switcher
  "cookies": { ... },                                      // banner copy (only if cookieBanner: true)
  "typography": { ... },                                   // quote marks, decimal separator, date format, etc.
  "validation": { ... },                                   // form error messages
}
```

### Marketing home

```jsonc
"pages": {
  "home": {
    "title": "...",                                        // <title>
    "description": "...",                                  // <meta description>
    "hero": { "eyebrow", "title", "subtitle" },
    "blocks": {
      "features":     { "title", "body", "items": { ... } },        // 3 items by default
      "cta":          { "title", "body", "emailPlaceholder", "submit" },
      "pricing":      { "title", "body", "tiers": { ... } },        // 3 tiers
      "testimonials": { "label", "quotes": { ... } },              // 1 quote
      "featured":     { "eyebrow", "title", "body", "viewAll" },    // latest blog posts (only when blog on)
      "icons":        { "eyebrow", "title", "body", "lucide", "reicon", "brands" }, // icon showcase
    }
  }
}
```

If the client doesn't need a particular section, delete its mount from `src/app/[locale]/(home)/page.tsx` (the component + the keys can both go).

### Blog chrome (when `features.blog: true`)

The Sanity Studio drives **content**. These messages drive everything **chromatic** — headings, button labels, breadcrumb names, etc.

```jsonc
"pages": {
  "blog": {
    "title", "description", "heading", "subheading", "noPosts",
    "readMore", "minRead", "by", "backToList", "onThisPage",
    "related", "relatedSubheading", "tagsLabel",
    "categories": { "heading", "subheading", "viewAll" },
    "tags":       { "heading", "subheading", "viewAll" },
    "authors":    { "heading", "viewAll", "posts" },
    "category":   { "headingPrefix", "subheading", "noPosts", "back" }
  },
  "author":    { "title", "description", "heading", "subheading", "empty", "posts", "noPosts", "breadcrumbs" },
  "category":  { "title", "description", "heading", "subheading", "empty", "posts", "breadcrumbs" },
  "tag":       { "title", "description", "heading", "subheading", "empty", "posts", "noPosts", "breadcrumbs", "tagsLabel" },
}
```

Same keys in `fr.json`, translated.

---

## 7. Replace brand assets

Drop your client's files at:

```
/public/logo.svg                        # header logo (any size SVG)
/public/brand/logo.png                  # raster fallback for schema.org Organization (>=512×512)
/public/brand/apple-icon.png            # 180×180 PNG (iOS rejects SVG)
/public/brand/og.png                    # 1200×630, used by /opengraph-image
/public/brand/og-home.png               # optional per-page OG image (one per page id)
/public/brand/og-blog.png               # ditto
```

The icon + OG routes (`/icon`, `/apple-icon`, `/opengraph-image`) auto-serve whichever file is at the configured path.

---

## 8. Seed (optional) + Studio setup

### Option A — start clean

Skip the seed. Run `pnpm dev`, open `/studio`, and create your first documents:

1. **Auteur** (Authors are global — no language picker). Add at least one with name, slug, photo, bio.
2. **Catégorie** → Français/English leaf → "+ Créer". Add slug.
3. **Tag** → same pattern.
4. **Article** → Français/English leaf → "+ Créer". Choose category + tags from the locale-scoped picker. Add cover under Métadonnées.

### Option B — re-seed with your own demo content

Edit `scripts/seed-blog-demo.mjs`: change author names + bios, replace `IMAGES` URLs, swap `categories` / `tags` / `posts` arrays. Then:

```bash
pnpm seed:blog
```

#### Re-seed semantics — read this once

| Action                               | Behavior                                                                                |
| ------------------------------------ | --------------------------------------------------------------------------------------- |
| Re-run with same data                | No-op — Sanity diffs the doc against the stored copy and skips identical writes         |
| Edit a field, re-run                 | The doc with that `_id` is updated in place. **No duplicates.**                         |
| Add a new doc to the script, re-run  | New doc appears. Existing docs untouched.                                               |
| Remove a doc from the script, re-run | **The old doc stays in Sanity.** The seed only writes, never deletes.                   |
| Change a doc's `_id`, re-run         | The old `_id` is orphaned (still in the dataset); the new `_id` is created.             |
| Change an image URL, re-run          | The new image is fetched + uploaded as a new asset; the old asset stays in the project. |

Mechanism: a single `createOrReplace` transaction over every doc in `allDocs`. See the header comment of `scripts/seed-blog-demo.mjs` for the canonical wording.

#### Cleanup workflows

When the seed leaves orphans, pick one:

```bash
# Delete a single doc by id (safe — confirms before commit)
pnpm dlx sanity@latest documents delete <doc._id> --dataset <name>

# Bulk delete a whole type (e.g. all old tags)
pnpm dlx sanity@latest documents query '*[_type == "tag"]._id' \
  --dataset <name> --json | jq -r '.[]' | \
  xargs -I{} pnpm dlx sanity@latest documents delete {} --dataset <name>

# Nuclear option — wipe the dataset clean (DESTROYS EVERYTHING)
pnpm dlx sanity@latest dataset delete <name>
pnpm dlx sanity@latest dataset create <name>
pnpm seed:blog
```

#### When to re-seed in practice

- **During template iteration** — yes, often. Edit + re-run while building the schema.
- **After deploying for a client** — never. Production content lives in Studio. Re-seeding would overwrite real edits to any doc whose `_id` matches a seed entry.
- **For a clean demo** — destroy + recreate the dataset (see above) so removed entries don't linger.

### Blog singleton layout

Open `/studio` → Blog → "Mise en page (singleton)". The singleton owns one array:

- **Modules par article** (`postModules`) — composes EVERY `/blog/[slug]`. Empty ⇒ each post uses `DefaultPostLayout` (back-link + cover image + author/category/date header + body + tag chips + related). Populate to give all articles the same custom shell (typical pattern: `Fil d'ariane` → `Contenu de l'article (article actif)` → `Liste d'articles`).

The `/blog` frontpage is intentionally **not editor-configurable**; it always renders the default layout (hero card grid + ExploreCategories + ExploreTags + TopAuthors + Newsletter). Modify via code in `src/app/[locale]/blog/page.tsx` if you need a different landing.

There is also intentionally **no per-post layout override** — articles share one consistent shell. Rich content INSIDE an article goes in the post body (next section).

### Inline modules inside post body

Click "+" inside any `body` field — the 8 inline modules (Encadré, Cartes, Personnes, Statistiques, Étapes, Citations, Accordéon, HTML personnalisé) appear in the picker alongside the standard text styles. They interleave with paragraphs / headings / lists and render in document order. The inline allowlist lives in `src/features/blog/sanity/schema/blockContent.ts` (`INLINE_MODULES`).

---

## 9. Verify before deploy

```bash
pnpm verify:quick      # tsc + lint (pre-push gate)
pnpm verify            # full gate: tsc + lint + format + contrast (CI runs this)
pnpm build             # prerenders every static route × locale
```

Walk the smoke test from [`../features/blog/sanity-setup.md`](../features/blog/sanity-setup.md) once.

---

## 10. Deploy

Where you host doesn't matter — Vercel, Netlify, self-hosted Docker, all work. Two env-var groups to set up in the platform:

| Variable                        | Where                    | Notes                                           |
| ------------------------------- | ------------------------ | ----------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | All envs                 | Public — Studio uses it too                     |
| `NEXT_PUBLIC_SANITY_DATASET`    | All envs                 | Usually "production"                            |
| `SANITY_API_READ_TOKEN`         | All envs                 | Server-only; runtime preview client uses it     |
| `SANITY_API_WRITE_TOKEN`        | NEVER set in deploy envs | Editor token; only seed script needs it locally |
| `NEXT_PUBLIC_ENVIRONMENT`       | Optional                 | `staging` flips a couple of CSP defaults        |

Robots:

- `site.url` set → sitemap + canonical URLs are live.
- `seoDefaults.robots` controls global index/follow. Per-post `noIndex` lives under post → Métadonnées.

---

## 11. Quick reference — what to edit when

| Want to change                                           | File                                                                                                                       |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Brand name, URL, colors, social, contact                 | `src/config/index.ts:site` + `theme`                                                                                       |
| Locales                                                  | `src/config/index.ts:locales` + `messages/<code>.json`                                                                     |
| Feature flags (blog, cookies, legal page)                | `src/config/index.ts:features`                                                                                             |
| Header nav items                                         | `src/config/index.ts:headerNav`                                                                                            |
| Site-wide SEO defaults                                   | `src/config/index.ts:seoDefaults`                                                                                          |
| Static page list                                         | `src/config/index.ts:pages` + add the matching route folder under `src/app/[locale]/`                                      |
| Marketing home copy                                      | `messages/<locale>.json:pages.home.*`                                                                                      |
| Blog chrome copy                                         | `messages/<locale>.json:pages.blog.*`                                                                                      |
| Blog content (posts, authors, categories, tags, layouts) | Sanity Studio at `/studio`                                                                                                 |
| Sanity Studio language / labels                          | `src/features/blog/sanity/schema/**` (already in French)                                                                   |
| Add a new static route                                   | New folder under `src/app/[locale]/<seg>/`, entry in `pages`, key in `AppPathname`, message keys                           |
| Add a new section to the home                            | Copy a section file from `../indiecrafts-library` into `src/parts/sections/`, mount in `(home)/page.tsx`, add message keys |

---

## Critical rules (the NEVERs)

- NEVER commit `.env*` except `.env.example`.
- NEVER hard-code brand strings, URLs, colors — read from `@/config`.
- NEVER inline user-facing strings — every visible string lives in `messages/<locale>.json`.
- NEVER import from `next/link` / `next-intl/navigation` — use `@/i18n/routing`.
- NEVER expose `SANITY_API_READ_TOKEN` (or write token) under a `NEXT_PUBLIC_` prefix.
- NEVER instantiate a Sanity `createClient` per route — use `@/sanity/client`.

Full list in the repo's `CLAUDE.md`.
