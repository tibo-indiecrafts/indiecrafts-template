# Security headers & CSP

All security headers are set in `next.config.ts` via the `headers()` hook. They apply to every route (`source: "/:path*"`), so there's no per-page wiring to remember.

## The headers

```ts
{ key: "X-Content-Type-Options", value: "nosniff" },
{ key: "X-Frame-Options", value: "DENY" },
{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
{ key: "Content-Security-Policy", value: csp },
```

| Header                    | Value                                      | Purpose                                                                             |
| ------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------- |
| `X-Content-Type-Options`  | `nosniff`                                  | Stops MIME-type sniffing.                                                           |
| `X-Frame-Options`         | `DENY`                                     | Blocks framing (clickjacking) — belt-and-suspenders with the CSP `frame-ancestors`. |
| `Referrer-Policy`         | `strict-origin-when-cross-origin`          | Sends full referrer same-origin, origin-only cross-origin.                          |
| `Permissions-Policy`      | `camera=(), microphone=(), geolocation=()` | Disables camera, mic, and geolocation for all origins.                              |
| `Content-Security-Policy` | see below                                  | The main defense — see below.                                                       |

Two supporting bits also live in `headers()`:

- `poweredByHeader: false` strips the `X-Powered-By: Next.js` header.
- Immutable, one-year `Cache-Control` on `/brand/:path*` and `/logo.svg` (brand assets are swapped by editing the file, not the URL).

## The Content-Security-Policy

The CSP is assembled from an array in `next.config.ts`:

```ts
const env = getCurrentEnvironment();
const cspConnectSources = getCSPConnectSources(env).join(" ");
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${env === "development" ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  `connect-src ${cspConnectSources}`,
  `frame-src 'self' https://www.youtube-nocookie.com https://player.vimeo.com`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
].join("; ");
```

Directive-by-directive:

| Directive         | Value                                                              | Why                                                                                  |
| ----------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `default-src`     | `'self'`                                                           | Same-origin baseline for anything not otherwise listed.                              |
| `script-src`      | `'self' 'unsafe-inline'` (+ `'unsafe-eval'` in dev only)           | Inline scripts (GA init, theme boot). `'unsafe-eval'` only in dev for tooling.       |
| `style-src`       | `'self' 'unsafe-inline'`                                           | Tailwind / inline style attributes.                                                  |
| `img-src`         | `'self' data: blob: https:`                                        | Allows `next/image`, data/blob URIs, and remote HTTPS images (Sanity CDN, Unsplash). |
| `font-src`        | `'self' data:`                                                     | Self-hosted `next/font` files + data-URI fonts.                                      |
| `connect-src`     | environment-dependent — see below                                  | XHR/fetch/WebSocket targets.                                                         |
| `frame-src`       | `'self' https://www.youtube-nocookie.com https://player.vimeo.com` | The only third-party frames rendered — validated video embeds.                       |
| `frame-ancestors` | `'none'`                                                           | Nobody may frame this site.                                                          |
| `base-uri`        | `'self'`                                                           | Blocks `<base>` hijacking.                                                           |
| `form-action`     | `'self'`                                                           | Forms may only submit same-origin.                                                   |

### `connect-src` is environment-aware

The `connect-src` list comes from `getCSPConnectSources(env)` in `src/config/types.ts`, and it's where the Sanity blog is allowed through:

```ts
export function getCSPConnectSources(env: Environment): readonly string[] {
  const sanity = ["https://*.sanity.io", "wss://*.api.sanity.io"];
  const npm = ["https://registry.npmjs.org"];
  const common = ["'self'", ...sanity, ...npm];
  if (env === "development" || env === "test") {
    return [...common, "ws://localhost:*", "http://localhost:*", "https://*.vercel.app"];
  }
  return common;
}
```

- **`https://*.sanity.io` + `wss://*.api.sanity.io`** — required by the embedded Studio at `/studio` and the live-preview client to reach the Sanity project API + CDN (the WebSocket is for real-time updates). The wildcard is locked to `*.sanity.io`, so it's safe to keep in the production CSP.
- **`https://registry.npmjs.org`** — the embedded Studio polls npm for its own version ("outdated Studio" check). Harmless, but without it the dev console fills with CSP `Failed to fetch` errors.
- **Dev/test extras** — `ws://localhost:*` and `http://localhost:*` (HMR + local services) and `https://*.vercel.app` (preview deploys) are added only outside production.

The `env` comes from `getCurrentEnvironment()` — the same helper that gates `robots.txt`. Setting `NEXT_PUBLIC_ENVIRONMENT=staging` gives you the tighter production `connect-src` on preview deploys. See [Robots & environments](./robots-and-environments.md).

## Extending the CSP for a new external service

When you add a third-party service, add its origin to the matching directive:

- **API / analytics / fetch target (e.g. a form backend, an external API):** add the host to `getCSPConnectSources()` in `src/config/types.ts` — that's the single source of truth for `connect-src`, and it keeps the dev/prod split intact.
- **Embedded iframe (another video host, a widget):** add the origin to the `frame-src` line in `next.config.ts`. Also update `parseVideoEmbed` / `HeroVideo` if it's a video host, since those enforce the same allowlist in code.
- **Remote images:** `img-src` already allows any `https:` host, but `next/image` needs the host declared in `images.remotePatterns` in `next.config.ts` too (Sanity CDN and Unsplash are pre-added).
- **External script:** add the host to the `script-src` line. Prefer this over widening it — avoid `'unsafe-inline'` growth.

::: warning
`script-src` and `style-src` already carry `'unsafe-inline'` (needed for the GA/theme boot scripts and Tailwind). Don't loosen them further — add specific hosts to the narrow directives (`connect-src`, `frame-src`) instead of broadening the script/style policy.
:::

::: warning Google Analytics needs CSP additions
The CSP as shipped does **not** whitelist Google's analytics hosts — the default config has GA off (`analytics.googleAnalyticsId: ""`), so nothing to allow. When you enable GA (see [Analytics](./analytics.md)), the `gtag/js` loader is fetched from `https://www.googletagmanager.com`, which isn't covered by `script-src 'self'`. Add `https://www.googletagmanager.com` to the `script-src` line in `next.config.ts`, and `https://*.google-analytics.com` to `connect-src` (via `getCSPConnectSources`) so GA's beacon requests aren't blocked.
:::
