# i18n & routing

The entire internationalization surface is one object — `i18n` in
`src/config/index.ts` (section `3. ─── i18n ───`, ~line 257). It declares the
languages the site ships, which one is the unprefixed default, and how locales
appear in URLs. `src/i18n/routing.ts` and the proxy (`src/proxy.ts`) consume it
directly; everything downstream — routing, sitemap, hreflang, the llms
endpoints, and the locale switcher — follows automatically.

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
} as const;
```

Each locale row is a `LocaleConfig` (`src/config/types.ts`):

| Field   | Meaning                                                                   |
| ------- | ------------------------------------------------------------------------- |
| `code`  | BCP-47 code. Doubles as the URL prefix for non-default locales (`/fr/…`). |
| `label` | Native language name — shown in the switcher menu.                        |
| `abbr`  | Short 2-letter badge — shown on the switcher trigger.                     |
| `dir`   | `"ltr"` or `"rtl"`. Drives `<html dir>`; set `"rtl"` for Arabic/Hebrew.   |

The `Locale` union type is **derived** from this data:

```ts
export type Locale = (typeof i18n.locales)[number]["code"];
```

So adding a locale row automatically widens `Locale` everywhere — no separate
type to maintain.

## Derived helpers (the public API)

`src/config/index.ts` exposes flat aliases and lookups so the rest of the app
imports one stable name instead of re-deriving from `i18n`:

- `locales` / `defaultLocale` / `localeCodes` — the raw list + codes.
- `localeMap` — O(1) `code → LocaleConfig` lookup.
- `isDefaultLocale(code)` — whether a code is the unprefixed default.
- `localePrefix(code)` — the URL path prefix for manual URL building (sitemap,
  the llms head link). next-intl drives live routing itself.
- `localeDir(code)` — text direction, falling back to `"ltr"`.
- `isLocale(value, localeCodes)` — a type-guard (`src/config/types.ts`) for
  narrowing an unknown string to `Locale`.

## localePrefix modes

`i18n.localePrefix` maps 1:1 onto next-intl's `localePrefix` and to the
`localePrefix(code)` helper used for manual URL building:

| Mode          | Default locale    | Other locales     | Notes                                              |
| ------------- | ----------------- | ----------------- | -------------------------------------------------- |
| `"as-needed"` | `/`, `/blog`      | `/fr/blog`        | The usual choice — default is unprefixed.          |
| `"always"`    | `/en`, `/en/blog` | `/fr`, `/fr/blog` | Every locale prefixed.                             |
| `"never"`     | `/`, `/blog`      | `/`, `/blog`      | No prefixes; active locale tracked by cookie only. |

The helper mirrors these modes exactly:

```ts
export const localePrefix = (code: Locale): string => {
  const mode = i18n.localePrefix as string;
  if (mode === "never") return "";
  if (mode === "always") return `/${code}`;
  return isDefaultLocale(code) ? "" : `/${code}`;
};
```

`localeDetection: true` redirects a first-time visitor at `/` to their
browser's `Accept-Language` locale when it's one of `locales`. Their explicit
choice — the `NEXT_LOCALE` cookie — always wins afterwards. `false` = always
serve the default locale until the user picks one.

## The routing definition

`src/i18n/routing.ts` assembles the next-intl routing from `i18n` plus the
`PATHNAMES` table (built from the `pages` map in `src/app/routes.ts`):

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

`PATHNAMES` merges every static route's `key → slug` with the dynamic patterns
(`/blog/[slug]`, `/blog/category/[slug]`, `/blog/tag/[slug]`, `/author/[slug]`)
declared in `src/app/routes.ts`.

::: danger Never import navigation from next/link or next-intl
Always import `Link`, `useRouter`, `redirect`, `usePathname`, and `getPathname`
from `@/i18n/routing` — never from `next/link` or `next-intl/navigation`
directly. Those wrappers are locale-aware and pathname-typed; the raw versions
aren't and will produce wrong URLs. For static routes, prefer the typed helper
`getStaticPathname(href, locale)`; for dynamic detail pages whose slug isn't in
`PATHNAMES`, use `localizedPathname(pathname, locale)`.
:::

## Localized (per-locale) slugs

A page's `slug` in the `pages` map may be a plain string (same path everywhere)
**or** a `{ [code]: string }` object for per-locale paths. The type is
`RouteSlug = string | Partial<Record<Locale, string>>` (`src/config/types.ts`):

```ts
legal: {
  key: "/legal",
  id: "legal",
  slug: { en: "/legal", fr: "/mentions-legales" },
  enabled: features.legalPage,
},
```

next-intl then serves `/legal` in English and `/mentions-legales` in French, and
`Link href="/legal"` resolves to the right path per locale automatically.

## The proxy (Next 16 middleware)

Next 16 renamed `middleware.ts` → `proxy.ts`. `src/proxy.ts` wraps the next-intl
middleware (for locale routing) and adds the maintenance-mode rewrite:

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

Its `matcher` excludes Next internals, the metadata routes, `/studio`, and
`/maintenance`, then explicitly re-adds the locale-aware route handlers
(`/llms.txt`, `/llms-full.txt`, `/llms/:path*`, `/blog/rss.xml`,
`/blog/:slug/md`) so next-intl rewrites those too. Add any new per-locale
endpoint path to that list.

## Per-request messages

`src/i18n/request.ts` loads the active locale's single flat message tree from
`messages/<locale>.json` — no build-time merge, no per-route aggregation. Every
key the app reads at runtime lives in that one file, including page content and
block copy nested under `pages.<id>.blocks.<simple>.*`.

```ts
const messages = (await import(`../../messages/${locale}.json`)).default;
```

The active locale drives `<html lang>` and `<html dir={localeDir(locale)}>` in
`src/app/[locale]/layout.tsx`.

## Adding a locale

1. Add a row to `i18n.locales` (e.g. `{ code: "de", label: "Deutsch", abbr:
"DE", dir: "ltr" }`).
2. Drop the translated `messages/de.json` (copy an existing file and translate).

The `Locale` union, routing, sitemap, hreflang, the llms endpoints, and the
locale switcher all follow automatically. Going monolingual? Strip the extra row
and delete the matching `messages/<code>.json`.
