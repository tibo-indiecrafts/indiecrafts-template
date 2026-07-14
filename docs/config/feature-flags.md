# Feature flags & feature-gate

Every optional surface of the site is a boolean in one object: `features` in
`src/config/index.ts` (section `4. ─── features ───`, ~line 327). Flip a flag,
and the routes, discovery files, nav links, and `<head>` emissions that depend
on it all follow. No flag needs a matching code change elsewhere — the gate is
already wired at every consumer.

Theme availability (`light` / `dark` / `system` / `forced`) lives in a sibling
object, `themeConfig`, and has its own guide: see
[Theme modes](./theme-modes.md).

## The flags at a glance

| Flag             | Type      | Default | Gates                                                                     |
| ---------------- | --------- | ------- | ------------------------------------------------------------------------- |
| `llms.index`     | `boolean` | `true`  | `/<locale>/llms.txt` + its `<link rel="alternate">` discovery tag         |
| `llms.full`      | `boolean` | `true`  | `/<locale>/llms-full.txt`                                                 |
| `llms.pages`     | `boolean` | `true`  | `/<locale>/llms/<id>` per-page markdown                                   |
| `rss`            | `boolean` | `true`  | `/blog/rss.xml` + its alternate link — **requires `blog`**                |
| `sitemap`        | `boolean` | `true`  | `/sitemap.xml`; also whether `robots.txt` advertises it                   |
| `structuredData` | `boolean` | `true`  | All JSON-LD (Organization/WebSite site-wide, WebPage/FAQPage per page)    |
| `localeSwitcher` | `boolean` | `true`  | The header locale picker                                                  |
| `cookieBanner`   | `boolean` | `false` | Bottom-fixed cookie banner + GA Consent Mode gating                       |
| `legalPage`      | `boolean` | `true`  | `/legal` route + its footer nav link                                      |
| `faq`            | `boolean` | `true`  | Per-page `<Faq>` accordion + FAQPage JSON-LD + llms FAQ block             |
| `blog`           | `boolean` | `true`  | The entire public blog surface (routes, feeds, discovery, `<SanityLive>`) |
| `studio`         | `boolean` | `true`  | `/studio` + the draft-mode preview API                                    |
| `maintenance`    | `boolean` | `false` | Site-wide 503 rewrite to `/maintenance` (via `proxy.ts`)                  |

Everything reads these from `@/config` — never re-declare a flag or its
condition locally.

## LLM endpoints — `llms.{index,full,pages}`

Three independent booleans so you can ship the short index without the heavy
full dump:

```ts
llms: {
  index: true, // /<locale>/llms.txt      (the short index)
  full: true,  // /<locale>/llms-full.txt (every page inlined)
  pages: true, // /<locale>/llms/<id>     (one page as markdown)
},
```

When `index` is off, the route 404s **and** the layout stops emitting the
`<link rel="alternate" type="text/plain" title="llms.txt">` discovery tag (see
`src/app/[locale]/layout.tsx`). All three are auto-populated from the `pages`
map — adding a page makes it appear in every enabled endpoint, in every locale,
with zero per-page config. A page opts out individually with `seo.llms: false`
(see `PageSeo` in `src/config/types.ts`).

## `rss` — depends on `blog`

RSS lists blog posts, so it can only be on when the blog is reachable. The
dependency is enforced in `isRssEnabled()` (`@/features/blog/lib/route-gate`):

```ts
export function isRssEnabled(): boolean {
  return isBlogRouteEnabled(pages.blog) && features.rss;
}
```

`blog: false` hides the feed regardless of `rss`. When on, it drives both the
`/blog/rss.xml` handler and the `<link rel="alternate" application/rss+xml>`
tags on blog pages.

## `sitemap`

`/sitemap.xml`. When off, the route serves an empty sitemap **and** `robots.txt`
stops advertising it. Leave on for SEO unless you're intentionally hiding the
site from crawlers.

## `structuredData`

Master switch for all JSON-LD. When off, `<PageSchemas>` and the layout's site
schema (`buildSiteSchemas`, gated at `src/app/[locale]/layout.tsx`) emit
nothing — no Organization/LocalBusiness, WebSite, WebPage, or FAQPage. Leave on
for rich results.

## `localeSwitcher`

Shows the header locale picker (`<LocaleSwitcher>`), gated in
`src/user-interface/shared/layout/Header.tsx`:

```tsx
{
  features.localeSwitcher ? <LocaleSwitcher /> : null;
}
```

For a single-locale site, either drop this flag or shrink `i18n.locales` to one
row — see [i18n & routing](./i18n-and-routing.md).

## `cookieBanner`

Bottom-fixed banner mounted in the root layout (`{features.cookieBanner ?
<CookieBanner /> : null}`) plus GA Consent Mode integration. When on **and**
`analytics.googleAnalyticsId` is set, GA loads in `denied` state and only fires
after consent. When off and GA is set, GA loads unconditionally — fine outside
the EU, risky inside. Banner copy lives under `messages.<locale>.cookies`.

## `legalPage`

Enables the `/legal` route (privacy + cookies + terms). The `legal` entry in
the `pages` map mirrors the flag (`enabled: features.legalPage`), and the footer
nav link is added conditionally in `src/config/index.ts`:

```ts
export const footerNav: readonly NavGroup[] = [
  ...(features.legalPage
    ? [{ labelKey: "company", links: [{ labelKey: "legal", href: "/legal" }] }]
    : []),
];
```

Nav and routing can't disagree — both key off the same flag.

## `faq`

Per-page FAQ. Content lives in `messages.<locale>.pages.<id>.faq` (a translated
`{ question, answer }` array). When on, any page that mounts `<Faq>` renders the
accordion **and** automatically gets FAQPage JSON-LD plus an llms.txt FAQ block
(see `@/lib/faq`). Off = no FAQ renders and the schema/llms blocks are dropped
everywhere. FAQ is the highest-ROI rich result for B2B.

## `blog` — the public surface

The Sanity-powered public blog. When off, everything blog-related disappears:

- **Routes** — `/blog`, `/blog/[slug]`, `/blog/category` + `/[slug]`,
  `/blog/tag` + `/[slug]`, `/author` + `/[slug]` all 404.
- **Feeds / exports** — `/blog/rss.xml`, `/blog/[slug]/md`.
- **Discovery** — the `blog`/`author`/`category`/`tag` entries in the `pages`
  map carry `enabled: features.blog`, so sitemap + llms.txt drop them; the
  header `/blog` nav link is added only when on.
- **`<SanityLive>`** — mounted only when on (it revalidates public blog pages).

Route gating is centralized in `@/features/blog/lib/route-gate` — call
`requireBlogRoute(page)` in page components (it `notFound()`s) and
`isBlogRouteEnabled(page)` in route handlers. Both fold in the `features.blog`
flag **and** the page's `enabled` field, so a new blog route can't drift by
checking only one half.

::: tip blog vs studio
`blog` is the **public** surface; `studio` is the **editing** surface. They're
independent — keep the Studio on with `blog: false` so editors keep working
while the public blog is hidden.
:::

## `studio` — the editing surface

The embedded Sanity Studio at `/studio` plus the draft-mode preview API
(`/api/draft-mode/enable` + `/disable`) its Presentation tool drives. Turn off
to 404 the Studio (e.g. to lock editing on a frozen production site) without
touching the public blog.

## `maintenance`

Site-wide maintenance mode, enforced in `src/proxy.ts`:

```ts
if (features.maintenance && !request.nextUrl.pathname.startsWith("/maintenance")) {
  return NextResponse.rewrite(new URL("/maintenance", request.url), {
    status: 503,
    headers: { "Retry-After": "3600" },
  });
}
```

Every public request rewrites to `/maintenance` with a `503` (so crawlers treat
the outage as temporary, not a dead site). The proxy matcher excludes `/studio`
and the metadata routes (robots, sitemap, icons), so editors keep working and
crawlers keep resolving discovery files while visitors see the maintenance page.

## Not a flag: `analytics`

`analytics.googleAnalyticsId` is a string, not a boolean — empty (`""`) means no
GA script, no `<meta>`, no network call. It pairs with `cookieBanner` for
consent gating (above).

::: warning Never re-implement a gate
Every gate already has one canonical home (the `pages` map, `route-gate.ts`, the
layout, `proxy.ts`). Read the flag from `@/config`; don't add a second condition
that can fall out of sync.
:::
