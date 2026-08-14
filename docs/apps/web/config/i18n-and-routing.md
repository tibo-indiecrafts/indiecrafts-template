# i18n & routing

The entire internationalization surface is one object — `i18n` in `@indiecrafts/config`
(`code/packages/config/src/index.ts`, section `3. ─── i18n ───`). It declares the
languages the site ships, which one is the unprefixed default, and how locales appear in
URLs. `src/i18n/routing.ts` and the proxy (`src/proxy.ts`) consume it directly; everything
downstream — routing, sitemap, hreflang, the llms endpoints, the locale switcher — follows
automatically.

## Where UI text lives (Sanity + fallback)

The app's chrome strings (nav, cookies, validation, blog UI, system pages) are **owned in
Sanity** — one per-locale `uiMessages.<locale>` singleton (Studio → **Textes de l'interface**).
`src/i18n/request.ts` reads it (`getUiMessages`) and **overlays it on the bundled
`messages/<locale>.json` file** (`overlayMessages`): Sanity is the edit surface, the JSON file
is a **fallback** so a Sanity hiccup or a blank field never blanks the chrome. Every
`useTranslations(...)`/`t(...)` call site is unchanged — only the source moved.

- **`typography`** stays in the JSON file only (never in the CMS): it is machine i18n/format
  config (quote style, date format, oxford comma) consumed by `@indiecrafts/format`, not editorial
  copy — a wrong edit would break formatting site-wide.
- **Homepage editorial copy** is separate again — the page-builder `homePage.<locale>` singleton
  (see [Homepage](../features/homepage)).
- The `uiMessages` schema fields are **generated from the message shape** (`en.json`) so they can't
  drift; `pnpm seed` populates the Sanity docs from the JSON files.

## The `i18n` object

```ts
export const i18n = {
  /** Registered languages. Row order is the locale-switcher menu order. */
  locales: [
    { code: "en", label: "English", abbr: "EN", dir: "ltr" },
    { code: "fr", label: "Français", abbr: "FR", dir: "ltr" },
  ],
  /** The unprefixed locale, served at bare paths (`/`, `/blog`). */
  defaultLocale: "en",
  /** How the locale appears in the URL: "as-needed" | "always" | "never". */
  localePrefix: "as-needed",
  /** Redirect first-time `/` visitors to their Accept-Language locale. */
  localeDetection: true,
} as const satisfies { … };
```

Each locale row is a `LocaleConfig` (`@indiecrafts/config` `./types`):

| Field | Meaning |
| --- | --- |
| `code` | BCP-47 code. Doubles as the URL prefix for non-default locales (`/fr/…`). |
| `label` | Native language name — shown in the switcher menu. |
| `abbr` | Short 2-letter badge — shown on the switcher trigger. |
| `dir` | `"ltr"` or `"rtl"`. Drives `<html dir>`; set `"rtl"` for Arabic/Hebrew. |

The `Locale` union type is **derived** from this data:

```ts
export type Locale = (typeof i18n.locales)[number]["code"];
```

Adding a locale row automatically widens `Locale` everywhere — no separate type to maintain.

## Derived helpers (the public API)

`@indiecrafts/config` exposes flat aliases + lookups so the rest of the app imports one
stable name instead of re-deriving from `i18n`:

- `locales` / `defaultLocale` / `localeCodes` — the raw list + codes.
- `localeMap` — O(1) `code → LocaleConfig` lookup.
- `isDefaultLocale(code)` — whether a code is the unprefixed default.
- `localePrefix(code)` — the URL path prefix for manual URL building (sitemap, the llms
  head link). next-intl drives live routing itself.
- `localizedPathname(pathname, locale)` — locale-aware absolute path for a **dynamic** detail
  route whose slug isn't in `PATHNAMES` (blog posts, categories, tags, authors). Lives in
  config so modules can use it; re-exported from `@/i18n/routing` for the app.
- `localeDir(code)` — text direction, falling back to `"ltr"`.
- `isLocale(value, supported)` — a type-guard (`@indiecrafts/config` `./types`) for narrowing
  an unknown string to `Locale`.

## localePrefix modes

`i18n.localePrefix` maps 1:1 onto next-intl's `localePrefix` and to the `localePrefix(code)`
helper used for manual URL building:

| Mode | Default locale | Other locales | Notes |
| --- | --- | --- | --- |
| `"as-needed"` | `/`, `/blog` | `/fr/blog` | The usual choice — default is unprefixed. |
| `"always"` | `/en`, `/en/blog` | `/fr`, `/fr/blog` | Every locale prefixed. |
| `"never"` | `/`, `/blog` | `/`, `/blog` | No prefixes; active locale tracked by cookie only. |

`localeDetection: true` redirects a first-time visitor at `/` to their browser's
`Accept-Language` locale when it's one of `locales`. Their explicit choice — the
`NEXT_LOCALE` cookie — always wins afterwards. `false` = always serve the default locale
until the user picks one.

## The routing definition

`src/i18n/routing.ts` assembles the next-intl routing from `i18n` plus the `PATHNAMES`
table (built from the `pages` map in `src/app/routes.ts`):

```ts
export const routing = defineRouting({
  locales: [...localeCodes],
  defaultLocale: i18n.defaultLocale,
  localePrefix: i18n.localePrefix,
  localeDetection: i18n.localeDetection,
  pathnames: PATHNAMES,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

`PATHNAMES` (`src/app/routes.ts`) merges every static route's `key → slug` (from the `pages`
map, via `ROUTES`) with the dynamic patterns in `DYNAMIC_PATHNAMES`
(`/blog/[slug]`, `/blog/category/[slug]`, `/blog/tag/[slug]`, `/author/[slug]`).

::: danger Never import navigation from next/link or next-intl
Always import `Link`, `useRouter`, `redirect`, `usePathname`, and `getPathname` from
`@/i18n/routing` — never from `next/link` or `next-intl/navigation` directly. Those wrappers
are locale-aware and pathname-typed; the raw versions aren't and will produce wrong URLs.
For static routes, prefer the typed helper `getStaticPathname(href, locale)`; for dynamic
detail pages whose slug isn't in `PATHNAMES`, use `localizedPathname(pathname, locale)`.
:::

## Localized (per-locale) slugs

A page's `slug` in the `pages` map may be a plain string (same path everywhere) **or** a
`{ [code]: string }` object for per-locale paths. The type is
`RouteSlug = string | Partial<Record<Locale, string>>` (`@indiecrafts/config` `./types`):

```ts
legalNotice: {
  key: "/legal-notice",
  id: "legal-notice",
  slug: { en: "/legal-notice", fr: "/mentions-legales" },
  enabled: features.legal.notice,
},
```

next-intl then serves `/legal-notice` in English and `/mentions-legales` in French, and
`Link href="/legal-notice"` resolves to the right path per locale automatically.

## The proxy (Next 16 middleware)

Next 16 renamed `middleware.ts` → `proxy.ts`. `src/proxy.ts` wraps the next-intl middleware
(for locale routing) and adds the maintenance-mode rewrite:

```ts
const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  if (features.maintenance && !request.nextUrl.pathname.startsWith("/maintenance")) {
    return NextResponse.rewrite(new URL("/maintenance", request.url), {
      status: 503,
      headers: { "Retry-After": "3600" },
    });
  }
  return intlMiddleware(request);
}
```

Its `matcher` excludes Next internals, the metadata routes (`manifest`, `robots`,
`sitemap`), `/studio`, and `/maintenance`, then explicitly re-adds the locale-aware route
handlers whose paths carry a file extension (otherwise excluded by the dot rule): `/llms.txt`,
`/llms-full.txt`, `/llms/:path*`, `/blog/rss.xml`, `/blog/:slug/md`. Add any new
per-locale endpoint path to that list.

## Per-request messages

`src/i18n/request.ts` loads the active locale's single flat message tree from
`messages/<locale>.json` — no build-time merge, no per-route aggregation:

```ts
const messages = (await import(`../../messages/${locale}.json`)).default;
```

Every key the app reads at runtime lives in that one file, including on-page block copy under
`pages.<id>.blocks.*`. (SEO metadata is **not** here — it's authored in Sanity; see
[Editing SEO](../seo/editing-seo-in-sanity.md).) The active locale drives `<html lang>` and
`<html dir={localeDir(locale)}>` in `src/app/[locale]/layout.tsx`.

## Adding a locale

1. Add a row to `i18n.locales` (e.g. `{ code: "de", label: "Deutsch", abbr: "DE", dir: "ltr" }`).
2. Drop the translated `messages/de.json` (copy an existing file and translate).

The `Locale` union, routing, sitemap, hreflang, the llms endpoints, and the locale switcher
all follow automatically. Going monolingual? Strip the extra row and delete the matching
`messages/<code>.json`.

### Don't pre-fill locales

Add a locale only when a real audience or translation exists. An empty or machine-filled
`messages/<code>.json` ships an English-looking page under a foreign URL, and every locale adds
build, SEO, sitemap, and `llms` surface. The two steps above make a locale cheap to add later — add
on demand, not "just in case".

### Where each kind of content lives

Adding a locale touches three homes, by content type:

| Kind | Home | Per locale |
| --- | --- | --- |
| **Editorial content + UI copy** | Sanity (`localeString` / `localeText`) + `messages/<locale>.json` | translated |
| **Page SEO** (title / description / OG) | Sanity (`siteMeta`, per page) — **not** `messages/` | translated |
| **Technical format rules** (number / money / date / grammar) | `config` `i18n.locales` rows + `formatDefaults` — **not** Sanity, **not** `messages/` | rule per locale |

**As much _content_ as possible is editable in Sanity** — copy, SEO, cookie/legal text, and email
strings all resolve `value[locale] ?? value[defaultLocale]`. What is **not** content — number
grouping, currency, adjective position, article agreement — lives in `config` and is served by
[`@indiecrafts/format`](../../../packages/format.md) (`localeFormat(locale)`), because it is a
language _rule_, not editable copy.

### RTL

`dir: "rtl"` on the locale row drives `<html dir>` (via `localeDir` — the layout already reads it),
so a right-to-left locale needs no code change beyond the row + its `messages/<code>.json`. When you
first ship one, audit directional utilities in components (`ml-`/`pl-` → logical `ms-`/`ps-`).
