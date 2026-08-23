# Feature flags & feature-gate

Every optional surface is a boolean in one object: `features`, **app-owned** in
`code/projects/web/surfaces/website/src/config/features.ts` (imported via `@/config`). Flip a flag and the routes,
discovery files, nav links, and `<head>` emissions that depend on it all follow — the gate is
already wired at every consumer. Islands (blog, newsletter, waitlist) don't read `features`
directly — the app **injects** their flags at boot (`src/instrumentation.ts` → `configureIslands`),
so the same island can mount in a second app with a different set. See
[Multi-app](./multi-app).

Theme availability (`light` / `dark` / `system` / `forced`) lives in a sibling app-owned object,
`themeConfig` (`src/config/theme.ts`), with its own guide: [Theme modes](./theme-modes.md).

## The flags at a glance

| Flag             | Type      | Default    | Gates                                                                                                                                                                      |
| ---------------- | --------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `llms.index`     | `boolean` | `true`     | `/<locale>/llms.txt` + its `<link rel="alternate">` discovery tag                                                                                                          |
| `llms.full`      | `boolean` | `true`     | `/<locale>/llms-full.txt`                                                                                                                                                  |
| `llms.pages`     | `boolean` | `true`     | `/<locale>/llms/<id>` per-page markdown                                                                                                                                    |
| `rss`            | `boolean` | `true`     | `/blog/rss.xml` + `/blog/atom.xml` + their alternate links — **requires `blog`**                                                                                           |
| `sitemap`        | `boolean` | `true`     | `/sitemap.xml`; also whether `robots.txt` advertises it                                                                                                                    |
| `structuredData` | `boolean` | `true`     | All JSON-LD (Organization/WebSite site-wide, WebPage/FAQPage per page)                                                                                                     |
| `localeSwitcher` | `boolean` | `true`     | The header locale picker                                                                                                                                                   |
| `legal.*`        | `object`  | see below  | The five legal pages + the data-request form, each toggled independently                                                                                                   |
| `account.delete` | `boolean` | `true`     | The self-service `/account` "Delete my account" page — requires Clerk configured                                                                                           |
| `faq`            | `boolean` | `true`     | Per-page `<Faq>` accordion + FAQPage JSON-LD + llms FAQ block                                                                                                              |
| `newsletter`     | `boolean` | `true`     | Newsletter capture block (`module.newsletter`) + the `/api/newsletter` route + the **Abonnés** desk — site-wide, **independent of `blog`** ([guide](/modules/newsletter/)) |
| `blog`           | `boolean` | `true`     | The entire public blog surface (routes, feeds, discovery, `<SanityLive>`)                                                                                                  |
| `blogTaxonomy.*` | `object`  | all `true` | Author/category/tag routes, each `&& blog`                                                                                                                                 |
| `blogComments`   | `boolean` | `true`     | Moderated comments on each post (`/api/comments` + the `<Comments>` section) — **requires `blog`** ([guide](/modules/blog/comments))                                       |
| `blogSearch`     | `boolean` | `true`     | The `/blog/search` route + the frontpage search box (`isSearchEnabled`) — **requires `blog`**                                                                              |
| `blogSeries`     | `boolean` | `true`     | The `/blog/series/<slug>` landing + on-post "Part N of M" nav (`isSeriesEnabled`) — **requires `blog`**                                                                    |
| `studio`         | `boolean` | `true`     | `/studio` + the draft-mode preview API                                                                                                                                     |
| `maintenance`    | `boolean` | `false`    | Site-wide 503 rewrite to `/maintenance` (via `proxy.ts`)                                                                                                                   |

Everything reads these from `@/config` — the app-owned `src/config/features.ts` (flags,
theme, fonts, and the `pages` map are app-instance config so a second app ships its own;
`@indiecrafts/packages-shared-config` holds only shared primitives). Never re-declare a flag or its condition
locally.

## LLM endpoints — `llms.{index,full,pages}`

Three independent booleans, so you can ship the short index without the heavy full dump:

```ts
llms: {
  index: true, // /<locale>/llms.txt      (the short index)
  full: true,  // /<locale>/llms-full.txt (every page inlined)
  pages: true, // /<locale>/llms/<id>     (one page as markdown)
},
```

When `index` is off the route 404s **and** the layout stops emitting the
`<link rel="alternate" type="text/plain" title="llms.txt">` discovery tag (see
`src/app/[locale]/layout.tsx`). All three are auto-populated from the `pages` map — adding
a page makes it appear in every enabled endpoint, in every locale, with zero per-page
config. A page opts out individually with `seo.llms: false` (`PageSeo` in
`@indiecrafts/packages-shared-config` `./types`).

## `rss` — depends on `blog`

RSS lists blog posts, so it can only be on when the blog is reachable. The dependency is
enforced in `isRssEnabled()` (`@indiecrafts/modules-web-blog/lib/route-gate`):

```ts
export function isRssEnabled(): boolean {
  return isBlogRouteEnabled(pages.blog) && features.rss;
}
```

`blog: false` hides the feeds regardless of `rss`. When on, it drives the `/blog/rss.xml`
**and** `/blog/atom.xml` handlers (both call `isRssEnabled()`) plus their
`<link rel="alternate">` tags on blog pages. Feeds are per-locale — the `[locale]` segment
yields one RSS + one Atom feed per language in `i18n.locales`.

## `sitemap`

`/sitemap.xml`. When off, the route serves an empty sitemap **and** `robots.txt` stops
advertising it. Leave on for SEO unless you're intentionally hiding the site from crawlers.

## `structuredData`

Master switch for all JSON-LD. When off, the per-page schemas and the layout's site schema
emit nothing — no Organization/LocalBusiness, WebSite, WebPage, or FAQPage. Leave on for
rich results.

## `localeSwitcher`

Shows the header locale picker (`<LocaleSwitcher>`), gated in `Header.tsx`
(`src/user-interface/shared/layout/`). For a single-locale site, either drop this flag or
shrink `i18n.locales` to one row — see [i18n & routing](./i18n-and-routing.md).

## `legal`

The site's five legal pages plus the data-request form, each toggled independently:

```ts
legal: { notice: true, privacy: true, cookies: true, terms: true, sales: false, dataRequest: true },
```

- `notice` — Mentions légales (LCEN) · `privacy` — Politique de confidentialité (RGPD)
- `cookies` — Politique de cookies · `terms` — CGU · `sales` — CGV (**off by default**;
  only needed when selling online).
- `dataRequest` — the **GDPR data-subject request form** at `/data-request` + the
  `/api/data-request` route. A visitor exercises a right (access, erasure, portability…);
  the request is stored as a `dataRequest` record and the controller is alerted by email.

Each `pages` entry mirrors its flag (`enabled: features.legal.<key>`); turning one off 404s
the route and drops it from the footer nav, the sitemap, and the llms endpoints. Legal-page
content is edited in Sanity (`legalPage` docs) — see [Legal pages](./legal-pages.md).

## `account`

Self-service account actions, currently one:

```ts
account: { delete: true },
```

- `delete` — the **"Delete my account" page** at `/account`, gated by
  `features.account.delete` **and** by Clerk being configured
  (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`) **and** by the client api origin being set
  (`NEXT_PUBLIC_API_URL`) — any one missing 404s the route. The page renders the shared
  `DeleteAccountSection` (`@indiecrafts/packages-shared-compliance/web`), which posts the
  authenticated `POST /v1/erasure/self` to the shared api worker, then signs the visitor out.

## `faq`

Per-page FAQ. When on, any page that mounts `<Faq>` renders the accordion **and**
automatically gets FAQPage JSON-LD plus an llms FAQ block (see `@/lib/faq`). Off = no FAQ
renders and the schema/llms blocks are dropped everywhere. FAQ is the highest-ROI rich
result for B2B.

## `blog` — the public surface

The Sanity-powered public blog. When off, everything blog-related disappears:

- **Routes** — `/blog`, `/blog/[slug]`, `/blog/category` + `/[slug]`, `/blog/tag` +
  `/[slug]`, `/author` + `/[slug]` all 404.
- **Feeds / exports** — `/blog/rss.xml`, `/blog/atom.xml`, `/blog/[slug]/md`.
- **Discovery** — the `blog`/`author`/`category`/`tag` entries in the `pages` map carry
  `enabled` folding in `features.blog`, so sitemap + llms.txt drop them; the header `/blog`
  nav link is added only when on.
- **`<SanityLive>`** — mounted only when on (it revalidates public blog pages).

Route gating is centralized in `@indiecrafts/modules-web-blog/lib/route-gate` — call
`requireBlogRoute(page)` in page components (it `notFound()`s) and `isBlogRouteEnabled(page)`
in route handlers. Both fold in `features.blog` **and** the page's `enabled` field, so a
new blog route can't drift by checking only one half.

::: tip blog vs studio
`blog` is the **public** surface; `studio` is the **editing** surface. They're independent
— keep the Studio on with `blog: false` so editors keep working while the public blog is
hidden.
:::

## `blogTaxonomy`

The author / category / tag routes, each toggled independently and each `&& features.blog`:

```ts
blogTaxonomy: { authors: true, categories: true, tags: true },
```

The `author` / `category` / `tag` entries in the `pages` map set
`enabled: features.blog && features.blogTaxonomy.<key>`, so turning one off 404s that
taxonomy's index + detail routes and drops them from sitemap/llms while the rest of the
blog stays live.

## `studio` — the editing surface

The embedded Sanity Studio at `/studio` plus the draft-mode preview API
(`/api/draft-mode/enable` + `/disable`) its Presentation tool drives. Turn off to 404 the
Studio (e.g. to lock editing on a frozen production site) without touching the public blog.

## `maintenance`

Site-wide maintenance mode, enforced in `src/proxy.ts`:

```ts
if (
  features.maintenance &&
  !request.nextUrl.pathname.startsWith("/maintenance")
) {
  return NextResponse.rewrite(new URL("/maintenance", request.url), {
    status: 503,
    headers: { "Retry-After": "3600" },
  });
}
```

Every matched request rewrites to `/maintenance` with a `503` (so crawlers treat the outage
as temporary). The proxy matcher excludes `/studio` and the metadata routes (robots,
sitemap, manifest), so editors keep working and crawlers keep resolving discovery files.

## Not a flag: analytics + cookie banner

Google Analytics and the cookie banner are **not** config flags — the measurement id and
the "require consent" toggle are edited in Sanity (`siteSettings.analytics`,
`googleAnalyticsId` + `requireCookieConsent`), read by `getSiteSettings()`. Empty id = no GA
script, no network call. See [Analytics](../seo/analytics.md) and
[Cookie consent](/packages/compliance).

::: warning Never re-implement a gate
Every gate already has one canonical home (the `pages` map, `route-gate.ts`, the layout,
`proxy.ts`). Read the flag from `@/config`; don't add a second condition that can
fall out of sync.
:::
