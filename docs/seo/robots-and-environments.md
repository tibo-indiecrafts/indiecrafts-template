# Robots & environments

`robots.txt` and the sitemap are **environment-aware**: only a real production deployment with a configured origin is indexable. Every other deployment — local dev, Vercel preview, staging, test, or a production build still on the placeholder URL — stays "quiet when online" and never leaks into search results.

## robots.txt

Route: `src/app/robots.txt/route.ts`. It's a plain Route Handler (not the typed `robots.ts` metadata route) so it can emit an `/llms.txt` pointer alongside the standard directives.

The single decision it makes:

```ts
const indexable = getCurrentEnvironment() === "production" && isSiteConfigured;
```

**Indexable** — full crawl instructions:

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Sitemap: https://acme.com/sitemap.xml     # only if features.sitemap
# llms.txt: https://acme.com/llms.txt      # only if features.llms.index
Host: https://acme.com
```

**Not indexable** — everything blocked:

```
User-agent: *
Disallow: /
```

So two conditions must _both_ hold before search engines are invited in:

1. `getCurrentEnvironment() === "production"`
2. `isSiteConfigured` — `site.url` has been pointed at a real origin.

### `getCurrentEnvironment()`

Defined in `src/config/types.ts`. It reads `NEXT_PUBLIC_ENVIRONMENT` first (an explicit override), then falls back to `NODE_ENV`:

```ts
export function getCurrentEnvironment(): Environment {
  const explicit = process.env.NEXT_PUBLIC_ENVIRONMENT;
  if (explicit === "staging") return "staging";
  if (explicit === "test") return "test";
  switch (process.env.NODE_ENV) {
    case "production":
      return "production";
    case "test":
      return "test";
    default:
      return "development";
  }
}
```

The `Environment` type is `"development" | "test" | "staging" | "production"`. Note that setting `NEXT_PUBLIC_ENVIRONMENT=staging` on a preview deploy keeps it **non-production** even when `NODE_ENV=production` — so a staging build with a real `NEXT_PUBLIC_SITE_URL` still serves `Disallow: /`. (This same helper also tightens the CSP — see [Security headers](./security-headers.md).)

### `isSiteConfigured`

Defined in `src/config/index.ts`:

```ts
export const PLACEHOLDER_SITE_URL = "https://example.com";
export const isSiteConfigured = site.url !== PLACEHOLDER_SITE_URL;
```

`site.url` reads `NEXT_PUBLIC_SITE_URL` and falls back to the placeholder. Until you set the env var to the client's real domain, `isSiteConfigured` is `false` and robots.txt stays closed — even in production. This is a deliberate safety net: a production deploy that forgot to set the domain won't get indexed under the placeholder.

::: warning Set the origin on production only
Set `NEXT_PUBLIC_SITE_URL` **only** on the production deployment. Leaving it unset everywhere else keeps previews and staging on the placeholder origin, so they can't accidentally become indexable.
:::

## The sitemap

Route: `src/app/sitemap.ts`. Emits every `(route × locale)` combination with `hreflang` alternates. It is gated by **`features.sitemap`**:

```ts
if (!features.sitemap) return [];
```

When `features.sitemap` is off, the route serves an **empty sitemap** _and_ `robots.txt` stops advertising the `Sitemap:` line — the two are kept in agreement.

What's included:

- **Static pages** — from the `pages` map, filtered to `!seo.noindex && seo.robots.index !== false && enabled !== false`. The home page gets priority `1`, others `0.7`.
- **Dynamic blog entries** — posts, categories, tags, and authors, expanded from Sanity at build time, but **only when `features.blog` is on** (`if (!features.blog) return staticEntries;`). Each is emitted once per slug with `hreflang` alternates for the locales it exists in.

::: tip
The sitemap's inclusion rules mirror `robots.txt` and the LLM endpoints: a page opts out of all discovery surfaces at once via `seo.noindex`, `seo.robots.index = false`, or `enabled: false`. See [LLM endpoints](./llms-endpoints.md) for the parallel `isLlmsPage` gate.
:::

## Quick reference

| Env var                   | Effect                                                            |
| ------------------------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`    | Sets `site.url`; must be real for `isSiteConfigured` → indexable. |
| `NEXT_PUBLIC_ENVIRONMENT` | Overrides detected env; only `production` is indexable.           |

| Feature flag          | Effect                                                      |
| --------------------- | ----------------------------------------------------------- |
| `features.sitemap`    | Off ⇒ empty sitemap + robots.txt drops the `Sitemap:` line. |
| `features.llms.index` | Off ⇒ robots.txt drops the `# llms.txt:` pointer.           |
| `features.blog`       | Off ⇒ sitemap skips all Sanity-driven blog entries.         |
