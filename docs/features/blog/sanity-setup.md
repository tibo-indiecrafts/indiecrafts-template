# Sanity setup & test guide

End-to-end reference for the Sanity-backed blog: configuration, schemas, routes, seeding, and the full QA matrix. Everything stays gated by `features.blog` (default `false`) — flip it in `src/config/index.ts` to activate.

---

## 1. What's wired

| Surface                    | Where                                      | Notes                                                                                                                                                                                                   |
| -------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Embedded Studio            | `/studio`                                  | Catch-all at `src/app/studio/[[...tool]]/page.tsx` (own root layout `studio/layout.tsx`). Gated by **`features.studio`** — independent of `features.blog`.                                              |
| Public blog                | `/<locale>/blog` + `/<locale>/blog/<slug>` | The frontpage is never module-driven (chrome stays uniform). Each `/blog/<slug>` renders via `DefaultPostLayout` when the `blog` singleton's `postModules` is empty; otherwise driven by `postModules`. |
| Markdown export            | `/<locale>/blog/<slug>/md`                 | YAML frontmatter + PortableText serialized to Markdown.                                                                                                                                                 |
| RSS feed                   | `/<locale>/blog/rss.xml`                   | RSS 2.0, locale-filtered. Requires `features.blog` **and** `features.rss` (`isRssEnabled()`).                                                                                                           |
| Draft preview              | `/api/draft-mode/enable` + `/disable`      | Gated by **`features.studio`** (404 when off). `/enable` also 503s with an actionable message when `SANITY_API_READ_TOKEN` is missing.                                                                  |
| Live content subscriptions | `<SanityLive />` in `[locale]/layout.tsx`  | Only mounted when `features.blog === true`.                                                                                                                                                             |
| Header nav link            | `/blog` link                               | Only shown when `features.blog === true`.                                                                                                                                                               |
| Sitemap + llms.txt entries | `/sitemap.xml` + `/<locale>/llms.txt`      | Auto-included via `pages.blog.enabled = features.blog`.                                                                                                                                                 |

---

## 2. Configuration

### Env vars (`.env.local`)

```bash
# ── Public (safe to expose) ──
NEXT_PUBLIC_SANITY_PROJECT_ID=qy2pp5sn        # your Sanity project ID
NEXT_PUBLIC_SANITY_DATASET=production         # default; the embedded Studio reads from here
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01     # query-stability pin; bump intentionally

# ── Server-only (NOT NEXT_PUBLIC_) ──
SANITY_API_READ_TOKEN=                        # Viewer role. Required for draft preview.
SANITY_API_WRITE_TOKEN=                       # Editor role. Only `pnpm seed` uses this.
```

Issue tokens at: <https://www.sanity.io/manage> → your project → **API** → **Tokens** → **Add API token**. Full reference (roles, CORS, security, troubleshooting) in [`sanity-tokens.md`](./sanity-tokens.md).

### Whitelist your dev origin (CORS)

Required once per origin — without it the Studio at `http://localhost:3000/studio` throws `CorsOriginError` on every request.

```bash
pnpm dlx sanity@latest cors add http://localhost:3000 \
  --credentials --project-id qy2pp5sn
```

`--credentials` lets the Studio's session cookie ride along. Repeat for every domain (staging, prod, preview branches) that will talk to this project.

### Feature flags (`src/config/index.ts`)

Two **independent** flags govern the blog. `features.blog` is the public surface; `features.studio` is the editing surface. Keep the Studio on with `blog: false` so editors keep working while the public site is hidden, or turn `studio` off to lock editing on a frozen site.

```ts
features: {
  // …
  blog: true,     // ← the public surface — lights up every public Sanity-driven route
  studio: true,   // ← the editing surface — /studio + /api/draft-mode/{enable,disable}
}
```

**`features.blog` (public surface)** — when `false`:

- `/blog`, `/blog/<slug>`, `/blog/<slug>/md`, `/blog/category` + `/[slug]`, `/blog/tag` + `/[slug]`, `/author` + `/[slug]`, `/blog/rss.xml` all return 404 (gated via `src/features/blog/lib/route-gate.ts`)
- `<SanityLive />` is not mounted in the layout
- The header `/blog` link disappears
- `pages.{blog,author,category,tag}.enabled` mirror the flag → sitemap + llms.txt drop the entries
- `generateStaticParams` for every dynamic blog route returns `[]` so the build skips Sanity calls

**`features.studio` (editing surface)** — when `false`:

- `/studio` (the embedded Studio) returns 404
- `/api/draft-mode/enable` + `/disable` return 404

> The RSS feed also honors a third flag, `features.rss`: `/blog/rss.xml` and its `<link rel="alternate">` tags require `features.blog` **and** `features.rss` (see `isRssEnabled()`).

### CSP allowlist (already configured)

`src/config/types.ts` → `getCSPConnectSources()` returns `https://*.sanity.io` + `wss://*.api.sanity.io` so the Studio can talk to the API in all environments.

### Studio config

Core Sanity infra (client, env, live, token, Studio wrapper) is shared and stays under `src/sanity/`. Everything blog-specific (schema, GROQ, structure, serializer, types) lives inside the self-contained blog feature at `src/features/blog/sanity/`:

```
sanity.config.ts                                 # Schema list + structure + plugins
src/sanity/env.ts                                # projectId, dataset, apiVersion, studioBasePath
src/sanity/client.ts                             # Read client (useCdn: false, stega.studioUrl wired)
src/sanity/live.ts                               # defineLive — sanityFetch/sanityFetchLive + <SanityLive />
src/sanity/token.ts                              # Server-only SANITY_API_READ_TOKEN
src/sanity/Studio.tsx                            # "use client" wrapper around <NextStudio>
src/features/blog/sanity/structure.ts            # Studio sidebar groups
src/features/blog/sanity/queries.ts              # GROQ — every query filters by $locale
src/features/blog/sanity/portable-to-markdown.ts # PortableText → Markdown serializer
src/features/blog/sanity/types.ts                # TypeScript shapes for query results
```

---

## 3. Schemas

All registered via `src/features/blog/sanity/schema/index.ts` (exported as `schemaTypes`, consumed by `sanity.config.ts`). Modules registered via `src/features/blog/sanity/schema/modules/index.ts` (also exports `MODULE_TYPES` — the single source of truth used by both the `blog` singleton and the runtime renderer registry). File paths in the tables below are relative to `src/features/blog/sanity/schema/`.

### Documents

| Schema             | File                  | Localized?           | Purpose                                                                            |
| ------------------ | --------------------- | -------------------- | ---------------------------------------------------------------------------------- |
| `blog` (singleton) | `documents/blog.ts`   | shared               | Owns `postModules[]` (per-post chrome). One per dataset; sidebar enforces.         |
| `post`             | `post.ts`             | **yes** (`language`) | Title, body (PortableText), author ref, categories, featured flag, metadata object |
| `author`           | `author.ts`           | shared               | Name, position, slug, image, bio                                                   |
| `category`         | `category.ts`         | **yes** (`language`) | Title, description                                                                 |
| `tag`              | `tag.ts`              | **yes** (`language`) | Cross-cutting tags (title, slug)                                                   |
| `quote`            | `documents/quote.ts`  | **yes** (`language`) | Testimonial content + attribution                                                  |
| `person`           | `documents/person.ts` | shared               | Team-member docs for Person List module                                            |

### Objects

| Object         | File                  | Used by                                           |
| -------------- | --------------------- | ------------------------------------------------- |
| `metadata`     | `objects/metadata.ts` | post (title/description/image/slug/noIndex)       |
| `blockContent` | `blockContent.ts`     | post body, accordion items, callout content, etc. |
| `link`         | `objects/link.ts`     | inside `cta`. Internal refs target `post` only.   |
| `cta`          | `objects/cta.ts`      | callout, card-list, etc.                          |

### Modules (object types — embedded inside `blog` arrays only)

| Module                     | File                           | Notes                                                 |
| -------------------------- | ------------------------------ | ----------------------------------------------------- |
| `module.accordion-list`    | `modules/accordion-list.ts`    | title + intro + items[{title, content}]               |
| `module.callout`           | `modules/callout.ts`           | variant (info/success/warning/danger) + content + cta |
| `module.card-list`         | `modules/card-list.ts`         | title + intro + columns + cards[]                     |
| `module.gallery`           | `modules/gallery.ts`           | image carousel + thumbnails + zoom lightbox (embla)   |
| `module.person-list`       | `modules/person-list.ts`       | title + intro + refs to `person`                      |
| `module.prose`             | `modules/prose.ts`             | content + width (narrow/wide)                         |
| `module.stat-list`         | `modules/stat-list.ts`         | title + intro + stats[{value, label}]                 |
| `module.step-list`         | `modules/step-list.ts`         | title + intro + steps[{title, content}]               |
| `module.quote-list`        | `modules/quote-list.ts`        | refs to `quote` (locale-filtered)                     |
| `module.custom-html`       | `modules/custom-html.ts`       | raw HTML — `dangerouslySetInnerHTML`                  |
| `module.blog-index`        | `modules/blog-index.ts`        | frontpage hero                                        |
| `module.blog-post-content` | `modules/blog-post-content.ts` | renders the active post (slot)                        |
| `module.blog-post-list`    | `modules/blog-post-list.ts`    | filtered post grid (limit, categories, featuredOnly)  |

Every module gets `anchor` + `hidden` fields auto-injected by `defineModule` (`src/features/blog/sanity/schema/objects/define-module.ts`).

### Renderer

`src/features/blog/user-interface/renderers/registry.tsx` holds the `SIMPLE_MODULES` map (`_type` → component), constrained with `satisfies` so a missing entry is a **compile error** — this is where TS exhaustiveness lives. `ModuleRenderer.tsx` (`<Modules>` + `ModuleSwitch`) consumes that registry, special-casing the two context-aware modules. Each module has a matching component in `src/features/blog/user-interface/renderers/`.

### Studio sidebar (`src/features/blog/sanity/structure.ts`)

```
Contenu
├─ Blog
│  ├─ Mise en page (singleton)   ← always opens documentId="blog"
│  ├─ Articles (EN / FR)
│  ├─ Auteurs
│  ├─ Catégories (EN / FR)
│  └─ Tags (EN / FR)
└─ Références
   ├─ Citations (EN / FR)
   └─ Personnes
```

The 13 modules are object types, not documents — editors only ever encounter them via the picker inside the singleton's `postModules` array or directly inline in a post body (the 9 inline-embeddable types listed in `blockContent.ts`).

---

## 4. Routes

| Route                                  | Type    | Gated                                       | Reads from                                         |
| -------------------------------------- | ------- | ------------------------------------------- | -------------------------------------------------- |
| `/<locale>`                            | static  | —                                           | `messages/<locale>.json`                           |
| `/<locale>/legal`                      | static  | `features.legalPage`                        | `messages/<locale>.json`                           |
| `/<locale>/blog`                       | SSG     | `features.blog`                             | `blogSingletonQuery` + `allPostsQuery` (fallback)  |
| `/<locale>/blog/<slug>`                | SSG     | `features.blog`                             | `postBySlugQuery` + `blogSingletonQuery`           |
| `/<locale>/blog/<slug>/md`             | dynamic | `features.blog`                             | `postBySlugQuery`                                  |
| `/<locale>/blog/rss.xml`               | dynamic | `features.blog` + `features.rss`            | `rssPostsQuery`                                    |
| `/<locale>/blog/category` + `/<slug>`  | SSG     | `features.blog`                             | `categoriesForLocaleQuery` / `categoryBySlugQuery` |
| `/<locale>/blog/tag` + `/<slug>`       | SSG     | `features.blog`                             | `tagsForLocaleQuery` / `tagBySlugQuery`            |
| `/<locale>/author` + `/<slug>`         | SSG     | `features.blog`                             | `authorsForLocaleQuery` / `authorBySlugQuery`      |
| `/<locale>/llms.txt`                   | dynamic | `features.llms.index`                       | messages tree                                      |
| `/<locale>/llms-full.txt`              | dynamic | `features.llms.full`                        | messages tree                                      |
| `/<locale>/llms/<id>`                  | dynamic | `features.llms.pages`                       | messages tree                                      |
| `/api/draft-mode/enable`               | dynamic | `features.studio` + `SANITY_API_READ_TOKEN` | —                                                  |
| `/api/draft-mode/disable`              | dynamic | `features.studio`                           | —                                                  |
| `/studio/[[...tool]]`                  | static  | `features.studio`                           | Sanity API                                         |
| `/sitemap.xml`                         | static  | —                                           | `pages` map                                        |
| `/robots.txt`, `/manifest.webmanifest` | static  | —                                           | `site` config + Sanity `siteSettings.icon`         |

`proxy.ts` matcher excludes `/studio` and `/api`; explicitly includes `/llms.txt`, `/llms-full.txt`, `/llms/:path*`, `/blog/rss.xml`, `/blog/:slug/md`.

---

## 5. Initial setup (one-time)

```bash
# 1. Install deps
pnpm install

# 2. Copy env template; fill in project ID + dataset
cp .env.example .env.local
# Edit .env.local — at minimum NEXT_PUBLIC_SANITY_PROJECT_ID + _DATASET

# 3. Flip the feature flag in src/config/index.ts
#    features: { blog: true }

# 4. (Optional) Issue tokens at https://www.sanity.io/manage
#    Add SANITY_API_READ_TOKEN  for draft preview
#    Add SANITY_API_WRITE_TOKEN for `pnpm seed`

# 5. Boot dev — Studio is at /studio
pnpm dev
```

---

## 6. Seed demo content

`scripts/seed-blog-demo.mjs` populates a complete demo dataset:

- **3 authors** — Lovelace, Hopper, Berners-Lee
- **6 categories** — 3 en (Engineering, Product, Stories) + 3 fr (Ingénierie, Produit, Histoires)
- **20 tags** — 10 per locale
- **4 quotes** — 2 per locale, each carrying a real Unsplash portrait
- **3 people** — for the Person List module
- **10 posts** — 5 per locale, including a long-form "fast prototyping" showcase per locale that exercises **every** body-editor primitive (H1-H6, numbered + bulleted lists, code / underline / strike-through marks, inline images, links, blockquote) plus **8 of the 9 inline-embeddable modules** (all but the image gallery, which needs uploaded images)
- **1 blog singleton** — `postModules` empty by default, so every post renders via `DefaultPostLayout` (hero card → TOC sidebar + body panel → keep-reading grid)

Total: **47 documents** in a single transaction.

Before the seed transaction commits, `cleanupLegacy()` runs once to scrub any leftover `module.hero-split` / `module.logo-list` blocks from existing post bodies + delete orphan `logo` docs in the correct reference order. Re-running the seed is therefore safe even against an older dataset that pre-dates this template version.

### Run

```bash
SANITY_API_WRITE_TOKEN=<your-editor-token> pnpm seed
```

Or set `SANITY_API_WRITE_TOKEN` in `.env.local` first and just run `pnpm seed` — the npm script loads `.env.local` for you via `node --env-file=.env.local`.

**Idempotent**: re-running upserts the same `_id`s via `createOrReplace`. Tweak the script and re-run to update content in place.

### Expected output

```
Seeding into <projectId>/<dataset>…

✓ Cleanup: cleaned N post(s) + 0 blog singleton(s), removed orphan logos

Uploading 11 images to Sanity…
  11/11 uploaded

Committing 47 documents…
✓ Committed transaction <uuid>

What you should see:
  /blog                                 → minimal card grid
  /blog/fast-prototyping-with-nextjs    → 8 inline modules (no gallery)
  /blog/prototypage-rapide-avec-nextjs  → 8 inline modules (no gallery, FR)
  any other post                         → default article layout
```

---

## 7. Full QA matrix

After seeding + setting `features.blog = true`:

### 7.1 Static checks

```bash
pnpm tsc            # → no output (0 errors)
pnpm lint           # → no output (0 errors, 0 warnings)
pnpm format:check   # → "All matched files use Prettier code style!"
pnpm verify:contrast # → "All pairs meet WCAG AA."
pnpm build          # → prerenders every static route × locale + the dynamic handlers
```

The build output should list these routes:

```
○ /_not-found
● /[locale] (/en, /fr)
● /[locale]/blog (/en/blog, /fr/blog)
● /[locale]/blog/[slug]                     ← 10 statically generated paths
ƒ /[locale]/blog/[slug]/md
ƒ /[locale]/blog/rss.xml
● /[locale]/blog/category, /[locale]/blog/category/[slug]
● /[locale]/blog/tag, /[locale]/blog/tag/[slug]
● /[locale]/author, /[locale]/author/[slug]
● /[locale]/legal (/en/legal, /fr/legal)
ƒ /[locale]/llms-full.txt
ƒ /[locale]/llms.txt
ƒ /[locale]/llms/[id]
ƒ /api/draft-mode/disable
ƒ /api/draft-mode/enable
○ /manifest.webmanifest, /robots.txt, /sitemap.xml
○ /studio/[[...tool]]
```

### 7.2 Public routes (curl)

`pnpm dev`, then in another shell:

```bash
# Home
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/en      # 200
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/fr      # 200

# Blog frontpage
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/en/blog # 200
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/fr/blog # 200

# Fast-prototyping article in both locales
curl -sSL -o /dev/null -w "%{http_code}\n" \
  http://localhost:3000/en/blog/fast-prototyping-with-nextjs              # 200
curl -sSL -o /dev/null -w "%{http_code}\n" \
  http://localhost:3000/fr/blog/prototypage-rapide-avec-nextjs            # 200

# Cross-locale should 404 (post.language doesn't match request locale)
curl -sSL -o /dev/null -w "%{http_code}\n" \
  http://localhost:3000/fr/blog/fast-prototyping-with-nextjs              # 404
curl -sSL -o /dev/null -w "%{http_code}\n" \
  http://localhost:3000/en/blog/prototypage-rapide-avec-nextjs            # 404

# Markdown export
curl -sS http://localhost:3000/en/blog/fast-prototyping-with-nextjs/md | head -10
#   ---
#   title: "Fast prototyping with Next.js: …"
#   description: "…"
#   date: 2026-05-26
#   author: "Ada Lovelace"
#   canonical: https://example.com/en/blog/fast-prototyping-with-nextjs
#   ---
#   # Fast prototyping with Next.js: …

# RSS
curl -sS http://localhost:3000/en/blog/rss.xml | head -20
# <rss version="2.0" …> with 5 EN posts

curl -sS http://localhost:3000/fr/blog/rss.xml | head -20
# <rss version="2.0" …> with 5 FR posts

# Metadata routes (locale-agnostic)
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3000/sitemap.xml     # 200, lists /blog
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3000/robots.txt       # 200
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3000/manifest.webmanifest # 200
# Favicon + OG image are now <link>/<meta> to the Sanity CDN (siteSettings.icon /
# siteMeta.ogImage), not /icon or /opengraph-image routes.

# llms.txt — should now include the Blog entry
curl -sS http://localhost:3000/en/llms.txt | grep -A 1 Blog
```

### 7.3 Studio

Open <http://localhost:3000/studio>. Log in with the account that owns the project.

**Verify sidebar:**

- Blog (expandable) → Mise en page (singleton) + Articles (EN/FR) + Auteurs + Catégories (EN/FR) + Tags (EN/FR)
- Références (expandable) → Citations (EN/FR) + Personnes

**Verify content** (after seeding):

- Articles list: 10 documents — 5 EN, 5 FR
- Each post preview line shows `EN · <date>` or `FR · <date>`
- Open any post → defaults to the **All fields** tab (whole document at once); **Contenu** and **Métadonnées** remain as filter tabs
- Open Mise en page (singleton): a single `Modules par article` array (empty by default, so posts fall back to `DefaultPostLayout`)
- Add a new module from the picker — every type from the 13-module catalog should be selectable

### 7.4 Draft preview

Requires `SANITY_API_READ_TOKEN`. With it set:

1. Edit a post in the Studio but don't publish — just save as draft
2. Visit:
   ```
   http://localhost:3000/api/draft-mode/enable?sanity-preview-secret=<token>&sanity-preview-pathname=/en/blog/fast-prototyping-with-nextjs
   ```
3. You should land on the post with **draft** content rendered
4. Exit: `http://localhost:3000/api/draft-mode/disable`

Without the token: the enable endpoint returns 503 with the message `Draft preview unavailable — set SANITY_API_READ_TOKEN in your environment.`

### 7.5 The 8 seeded inline modules (gallery excluded — not seeded)

Visit `/en/blog/fast-prototyping-with-nextjs`. Scroll top to bottom and verify each inline module renders:

1. **Callout (info)** — neutral muted background, just after the intro paragraph
2. **Stat list** — 4 stats (48h / 17 / 2 / AA) inside a hairline-divided grid
3. **Card list** — 3 cards with the same hairline-divider treatment
4. **Callout (warning)** — amber
5. **Step list** — 3 numbered steps with vertical connector
6. **Accordion list** — 3 expandable Q&As
7. **Quote list** — 2 testimonials (locale-filtered), each with portrait + role
8. **Person list** — 3 team members, centered avatars
9. **Callout (success)** — emerald
10. **Callout (danger)** — destructive red
11. **Custom HTML** — centered "raw HTML the editor controls" block

(8 module types, 11 instances because Callout renders 4× with different variants.)

In the same post, also verify the default body primitives that ship with `blockContent`:

- **Heading hierarchy** — H2 ("Day one"…), H3 ("Deploy before you decorate"…), H4, H5, H6 examples toward the end
- **Numbered list** — "The three-move playbook"
- **Bulleted list** — "Day one bullets"
- **Inline marks** — `pnpm dev` as code, "Shipping is the artefact." as strong, strike-through in the "older draft" footnote
- **Inline image** — hero photo embedded in the body
- **Link** — closing "indiecrafts.dev" link

### 7.6 Per-post layout

By default the `blog` singleton's `postModules` array is empty, so every `/blog/[slug]` route renders via `DefaultPostLayout` (`src/features/blog/user-interface/post/layout/DefaultPostLayout.tsx`):

- Full-width hero card with cover image touching the nav, breadcrumbs in a backdrop-blur pill, bottom-aligned title block
- Two-column layout below: TOC sidebar on the right (sticky `top-24`, only mounted when `post.headings` has at least one h2/h3/h4) and a rounded body panel filling the rest of the width
- "Keep reading" related-posts grid at the bottom

To swap in a module-driven shell for every post, populate `postModules` from the Studio: drop in `blog-post-content` → `quote-list` → `blog-post-list` (or any other order). The fallback only fires when the array is empty.

### 7.7 Feature flag OFF (regression check)

Flip back to `features: { blog: false }` (leave `studio: true`). After dev reload:

```bash
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/en/blog                 # 404
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/en/blog/fast-prototyping-with-nextjs # 404
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/en/blog/fast-prototyping-with-nextjs/md # 404
curl -sS    -o /dev/null -w "%{http_code}\n" http://localhost:3000/en/blog/rss.xml         # 404
curl -sS    -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/draft-mode/enable    # 404
curl -sS    -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/draft-mode/disable   # 404
curl -sS    -o /dev/null -w "%{http_code}\n" http://localhost:3000/studio                   # 200 (Studio stays — gated by features.studio)
```

Home `/`: no "Blog" link in the header nav. `/sitemap.xml` should not list `/blog`. `/llms.txt` should not list the Blog entry. (To 404 the Studio too, set `features.studio = false` as well.)

---

## 8. Troubleshooting

### "Draft preview unavailable" (503)

`SANITY_API_READ_TOKEN` isn't set. Add it to `.env.local`. The 503 is intentional — it's better than the 500 `defineEnableDraftMode` would otherwise throw at module-load time.

### Build fails: "Route used draftMode() inside generateStaticParams"

`generateStaticParams` cannot call `sanityFetchLive` (which reads `draftMode()`). Use the plain `client.fetch(query)` there — the `/blog/[slug]/page.tsx` does exactly this. The fix is already in place; this note is for future routes.

### Posts don't appear on `/en/blog` or `/fr/blog`

Check the post's language — must equal the route locale. The `language` field is plugin-managed and hidden; read it from the locale badge in the doc's **Translations** menu (top of the editor), and switch a post's language there rather than editing a field. The fallback `coalesce(language, "en") == $locale` means a missing language defaults to `en` (legacy docs).

### Studio shows "Schema migration needed" warning

After running the seed against an existing dataset that pre-dated the `language` field, Sanity may flag legacy docs. The fallback in queries already handles them; in the Studio, open each doc and the field will auto-default to `en`.

### Seed script fails with 401/403

The write token is missing or doesn't have Editor permissions. Re-issue at <https://www.sanity.io/manage> → API → Tokens with role `Editor`.

### Removed a schema field, but old docs still expose it in the Studio

Sanity stores every previously-set field on a document forever — removing the schema entry hides it from the editor, but the data is still in the JSON. Use `scripts/unset-legacy-fields.mjs` to nuke a named field from every document in one transaction.

```bash
node --env-file=.env.local scripts/unset-legacy-fields.mjs
```

The script reads the `TARGETS` array at the top — `[GROQ query returning _ids, field-path to unset]`. Edit those entries to match the field you're retiring, run once, and the orphan fields are gone. Idempotent — re-running with no matches reports `nothing to unset`.

It currently ships pointing at two fields removed in earlier releases (`post.modules` and `blog.frontpageModules`) — adapt or comment out before running against a fresh dataset.

### CSP blocks Studio API calls

Already allowed via `getCSPConnectSources()` in `src/config/types.ts`. If you've customized that function, ensure `https://*.sanity.io` + `wss://*.api.sanity.io` are present.

### `/blog` 200s but is blank

The frontpage is driven entirely by published posts (it's never module-driven), so a blank `/blog` means there are no posts in the requested locale. Run `pnpm seed`, or publish a post with its `language` matching the route locale.

### `/studio` shows "Configuration error"

Likely an unset `NEXT_PUBLIC_SANITY_PROJECT_ID`. Check `.env.local`, restart dev.

---

## 9. Customization

### Add a new module

1. **Schema** — create `src/features/blog/sanity/schema/modules/<name>.ts` using the `defineModule` helper
2. **Register** — import + add to `moduleSchemas` and `MODULE_TYPES` in `src/features/blog/sanity/schema/modules/index.ts`
3. **Type** — add a `<Name>Module` discriminant + add it to `AnyModule` union in `src/features/blog/sanity/types.ts`
4. **GROQ** (only if the module has cross-references) — add a `_type == "module.<name>" => { ... }` branch to `MODULES_FRAGMENT` in `src/features/blog/sanity/queries.ts`
5. **Component** — add `src/features/blog/user-interface/renderers/<Name>.tsx`
6. **Registry** — add the `_type` → component entry to `SIMPLE_MODULES` in `src/features/blog/user-interface/renderers/registry.tsx` (the `satisfies` check flags a missing entry). Context-aware modules are special-cased in `ModuleRenderer.tsx` instead.

### Rename `/blog` to something else

Two places:

1. `src/config/index.ts` → `pages.blog.slug` and `pages.blog.key`
2. `src/config/types.ts` → `StaticAppPathname` + `DynamicAppPathname` unions

Routes + sitemap + Studio sidebar follow automatically.

### Change locale set

Edit `locales` in `src/config/index.ts`, then drop `messages/<code>.json`. That's it — the Sanity side reads the same `locales` array: the `@sanity/document-internationalization` `supportedLanguages`, the per-locale create templates, and the desk's language split (`languageSplit` in `structure.ts`) all derive from it. Every content document (`post`, `author`, `category`, `tag`, `quote`, `person`) is translated, and its `language` field is plugin-managed (`readOnly` + `hidden`), so there's no `options.list` to extend.

### Disable a module without deleting it

Every module has a `hidden` boolean (auto-injected by `defineModule`). Toggle it in the Studio — the renderer skips hidden modules.

---

## 10. File map

Core Sanity infra is shared (`src/sanity/`); everything blog-specific is self-contained under `src/features/blog/`.

```
sanity.config.ts                                Studio config (schema, plugins, structure)
scripts/seed-blog-demo.mjs                      pnpm seed — populates demo dataset
scripts/unset-legacy-fields.mjs                 one-shot field unset after a schema removal

src/sanity/                                     SHARED core infra (not blog-specific)
├── env.ts                                      projectId, dataset, apiVersion, studioBasePath
├── client.ts                                   Read client (useCdn: false, stega.studioUrl)
├── token.ts                                    Server-only SANITY_API_READ_TOKEN
├── live.ts                                     defineLive — sanityFetch / sanityFetchLive + <SanityLive />
└── Studio.tsx                                  "use client" wrapper around <NextStudio>

src/features/blog/                              THE BLOG FEATURE (gated by features.blog)
├── lib/route-gate.ts                           requireBlogRoute / isBlogRouteEnabled / isRssEnabled
├── sanity/
│   ├── queries.ts                              Every GROQ query (locale-filtered)
│   ├── types.ts                                TypeScript shapes for query results
│   ├── structure.ts                            Studio sidebar layout
│   ├── portable-to-markdown.ts                 PortableText → Markdown serializer
│   └── schema/
│       ├── index.ts                            schemaTypes registry
│       ├── post.ts, author.ts, category.ts, tag.ts   Top-level documents
│       ├── blockContent.ts                     Rich text def + INLINE_MODULES allowlist
│       ├── documents/                          Singleton + module-reference documents
│       │   ├── blog.ts                         Singleton (postModules layout slot)
│       │   └── quote.ts, person.ts
│       ├── objects/                            Reusable object types
│       │   ├── metadata.ts                     Per-doc SEO override
│       │   ├── link.ts, cta.ts
│       │   └── define-module.ts                Helper (auto-injects anchor + hidden)
│       └── modules/                            Module schemas + MODULE_TYPES catalog
│           ├── index.ts
│           ├── accordion-list.ts, callout.ts, card-list.ts,
│           │   gallery.ts, person-list.ts, prose.ts, stat-list.ts,
│           │   step-list.ts, quote-list.ts, custom-html.ts,
│           │   blog-index.ts, blog-post-content.ts, blog-post-list.ts
└── user-interface/                             Blog UI, organized by route (like src/user-interface/)
    ├── blog/sections/                          Frontpage: BlogListing, BlogHero, ExploreCategories/Tags, TopAuthors
    ├── post/                                   A single post (/blog/[slug])
    │   ├── layout/DefaultPostLayout.tsx        Per-post shell (hero + TOC + body)
    │   └── components/                         Toc, MobileToc, HeroVideo
    ├── author/  category/  tag/                Each: sections/ (Listing + Detail views) + components/ (its card)
    ├── shared/                                 Multi-page: sections/PageHero + components/{BlogCard, Breadcrumbs, PlayBadge}
    └── renderers/                              Page-builder module renderers
        ├── registry.tsx                        SIMPLE_MODULES map (TS exhaustiveness)
        ├── ModuleRenderer.tsx                  <Modules> + ModuleSwitch
        ├── portable-text-components.tsx        Shared PortableText render map
        ├── Cta.tsx                             ModuleCta button
        └── <13 module component files>

src/app/
├── studio/layout.tsx                           Studio root layout (own <html>/<body>)
├── studio/[[...tool]]/page.tsx                 Embedded Studio route (features.studio)
├── api/draft-mode/{enable,disable}/route.ts    Draft preview toggles (features.studio)
└── [locale]/
    ├── blog/
    │   ├── page.tsx                            Frontpage (post grid; never module-driven)
    │   ├── [slug]/page.tsx                     Detail (postModules-driven, falls back to DefaultPostLayout)
    │   ├── [slug]/md/route.ts                  Markdown export
    │   ├── rss.xml/route.ts                    RSS feed
    │   ├── category/…                          Category listing + detail
    │   └── tag/…                               Tag listing + detail
    └── author/…                                Author listing + detail
```
