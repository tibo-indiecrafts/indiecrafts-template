# Security headers & CSP

All security headers are set in `next.config.ts` via the `headers()` hook, applied to every route (`source: "/:path*"`) — no per-page wiring.

## The headers

```ts
{ key: "X-Content-Type-Options", value: "nosniff" },
{ key: "X-Frame-Options", value: "DENY" },
{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
{ key: "Content-Security-Policy", value: csp },
```

| Header | Value | Purpose |
| --- | --- | --- |
| `X-Content-Type-Options` | `nosniff` | Stops MIME-type sniffing. |
| `X-Frame-Options` | `DENY` | Blocks framing (clickjacking) — belt-and-suspenders with the CSP `frame-ancestors`. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Full referrer same-origin, origin-only cross-origin. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables camera, mic, and geolocation for all origins. |
| `Content-Security-Policy` | see below | The main defense. |

Two supporting bits round out the config:

- `poweredByHeader: false` (a top-level option, not part of `headers()`) strips `X-Powered-By: Next.js`.
- Immutable, one-year `Cache-Control` on `/brand/:path*` **and** `/logo.svg`, set in `headers()` (brand assets are swapped by editing the file; logo + icons are Sanity assets on the CDN).

## The Content-Security-Policy

The CSP is assembled from an array in `next.config.ts`:

```ts
const env = getCurrentEnvironment();
const cspConnectSources = getCSPConnectSources(env).join(" ");
// GA hosts, appended unconditionally (measurement id is a runtime Sanity value):
const gaScriptSrc = " https://*.googletagmanager.com";
const gaConnectSrc =
  " https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com";

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${env === "development" ? " 'unsafe-eval'" : ""}${gaScriptSrc}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  `connect-src ${cspConnectSources}${gaConnectSrc}`,
  `frame-src 'self' https://www.youtube-nocookie.com https://player.vimeo.com`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
].join("; ");
```

Directive-by-directive:

| Directive | Value | Why |
| --- | --- | --- |
| `default-src` | `'self'` | Same-origin baseline for anything not otherwise listed. |
| `script-src` | `'self' 'unsafe-inline'` (+ `'unsafe-eval'` in dev only) (+ GA loader host) | Inline scripts (GA init, theme boot). `'unsafe-eval'` only in dev for tooling. |
| `style-src` | `'self' 'unsafe-inline'` | Tailwind / inline style attributes. |
| `img-src` | `'self' data: blob: https:` | `next/image`, data/blob URIs, remote HTTPS images (Sanity CDN, Unsplash). |
| `font-src` | `'self' data:` | Self-hosted `next/font` files + data-URI fonts. |
| `connect-src` | environment-dependent + GA beacon hosts — see below | XHR/fetch/WebSocket targets. |
| `frame-src` | `'self' https://www.youtube-nocookie.com https://player.vimeo.com` | The only third-party frames — validated video embeds. |
| `frame-ancestors` | `'none'` | Nobody may frame this site. |
| `base-uri` | `'self'` | Blocks `<base>` hijacking. |
| `form-action` | `'self'` | Forms may only submit same-origin. |

### `connect-src` is environment-aware

The base `connect-src` list comes from `getCSPConnectSources(env)` in `@indiecrafts/config` (`code/packages/config/src/types.ts`) — the GA beacon hosts (`gaConnectSrc`) are appended after it:

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

- **`https://*.sanity.io` + `wss://*.api.sanity.io`** — required by the embedded Studio at `/studio` and the live-preview client to reach the project API + CDN (the WebSocket carries real-time updates). The wildcard is locked to `*.sanity.io`, so it's safe in the production CSP.
- **`https://registry.npmjs.org`** — the embedded Studio polls npm for its own version ("outdated Studio" check). Harmless, but without it the dev console fills with CSP `Failed to fetch` errors.
- **Dev/test extras** — `ws://localhost:*` + `http://localhost:*` (HMR + local services) and `https://*.vercel.app` (preview deploys) are added only outside production.

`env` comes from `getCurrentEnvironment()` — the same helper that gates `robots.txt`. Setting `NEXT_PUBLIC_ENVIRONMENT=staging` gives you the tighter production `connect-src` on preview deploys. See [Robots & environments](./robots-and-environments.md).

## Extending the CSP for a new external service

When you add a third-party service, add its origin to the matching directive:

- **API / analytics / fetch target:** add the host to `getCSPConnectSources()` in `code/packages/config/src/types.ts` — the single source for `connect-src`, and it keeps the dev/prod split intact.
- **Embedded iframe (another video host, a widget):** add the origin to the `frame-src` line in `next.config.ts`. Also update `parseVideoEmbed` / `HeroVideo` if it's a video host — those enforce the same allowlist in code.
- **Remote images:** `img-src` already allows any `https:` host, but `next/image` also needs the host in `images.remotePatterns` in `next.config.ts` (Sanity CDN + Unsplash are pre-added).
- **External script:** add the host to the `script-src` line. Prefer this over widening — avoid `'unsafe-inline'` growth.

::: warning
`script-src` and `style-src` already carry `'unsafe-inline'` (for the GA/theme boot scripts and Tailwind). Don't loosen them further — add specific hosts to the narrow directives (`connect-src`, `frame-src`) instead.
:::

::: tip Google Analytics hosts are always allowed
GA needs its script host (`googletagmanager.com`) and beacon endpoints (`google-analytics.com`, `analytics.google.com`) in the CSP. The measurement id now lives in **Sanity** (`siteSettings.analytics`, a runtime value), so the build-time CSP can't narrow itself from it — `next.config.ts` appends Google's domains to `script-src` + `connect-src` **unconditionally**. Harmless when GA is off (no script is emitted). No manual CSP edit needed for GA. See [Analytics](./analytics.md).
:::
