# Security headers & CSP

Security headers are built by the shared **[`@indiecrafts/packages-shared-security`](/packages/security)**
brick and applied in `next.config.ts` via one `securityHeaders({...})` call in the `headers()` hook —
every route (`source: "/:path*"`), no per-page wiring. The brick owns the hardened defaults; the app
passes only its own extra hosts.

```ts
// next.config.ts
import { getCurrentEnvironment } from "@indiecrafts/packages-shared-config";
import { imageDefaults, securityHeaders } from "@indiecrafts/packages-shared-security";

const EMBED_HOSTS: string[] = []; // external embed origins (newsletter provider)

async headers() {
  return securityHeaders({
    env: getCurrentEnvironment(),
    csp: {
      frameSrc: ["https://www.youtube-nocookie.com", "https://player.vimeo.com", "https://www.dailymotion.com"],
      mediaSrc: ["https://cdn.sanity.io"],
      googleAnalytics: true,
      embedHosts: EMBED_HOSTS,
    },
    immutablePaths: ["/brand/:path*", "/logo.svg"],
  });
}
```

## The headers

| Header                       | Value                                      | Purpose                                                                                                       |
| ---------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `X-Content-Type-Options`     | `nosniff`                                  | Stops MIME-type sniffing.                                                                                     |
| `X-Frame-Options`            | `DENY`                                     | Blocks framing (clickjacking) — belt-and-suspenders with CSP `frame-ancestors`.                               |
| `Referrer-Policy`            | `strict-origin-when-cross-origin`          | Full referrer same-origin, origin-only cross-origin.                                                          |
| `Permissions-Policy`         | `camera=(), microphone=(), geolocation=()` | Disables camera, mic, geolocation.                                                                            |
| `Cross-Origin-Opener-Policy` | `same-origin-allow-popups`                 | Isolates the browsing context; **`allow-popups`** keeps OAuth/share popups (the Sanity Studio login) working. |
| `Strict-Transport-Security`  | `max-age=31536000; includeSubDomains`      | **Production only.** Forces HTTPS. No `preload` by default (sticky — hard to undo).                           |
| `Content-Security-Policy`    | see below                                  | The main defense.                                                                                             |

Plus: `poweredByHeader: false` strips `X-Powered-By`; immutable one-year `Cache-Control` on
`/brand/:path*` + `/logo.svg` (via `immutablePaths`).

## The Content-Security-Policy

`buildCsp(env, csp)` composes the directives — hardened defaults baked in, the app's extras merged
per directive:

| Directive                   | Value                                                             | Why                                                     |
| --------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------- |
| `default-src`               | `'self'`                                                          | Same-origin baseline.                                   |
| `script-src`                | `'self' 'unsafe-inline'` (+ `'unsafe-eval'` dev only) (+ GA host) | Inline scripts (GA init, theme boot).                   |
| `style-src`                 | `'self' 'unsafe-inline'`                                          | Tailwind / inline styles.                               |
| `img-src`                   | `'self' data: blob: https:`                                       | `next/image`, data/blob URIs, remote HTTPS images.      |
| `media-src`                 | `'self' blob:` (+ `cdn.sanity.io`)                                | Uploaded featured videos (Sanity file assets).          |
| `font-src`                  | `'self' data:`                                                    | Self-hosted `next/font` + data-URI fonts.               |
| `connect-src`               | `getCSPConnectSources(env)` (+ GA beacons + embeds)               | XHR/fetch/WebSocket targets.                            |
| `frame-src`                 | `'self'` (+ the video hosts + embeds)                             | Validated video embeds only.                            |
| `frame-ancestors`           | `'none'`                                                          | Nobody may frame this site.                             |
| `base-uri`                  | `'self'`                                                          | Blocks `<base>` hijacking.                              |
| `form-action`               | `'self'` (+ embeds)                                               | Forms submit same-origin (or a whitelisted embed host). |
| `upgrade-insecure-requests` | (production)                                                      | Auto-upgrades any `http:` subresource.                  |

### `connect-src` is environment-aware (still in `@indiecrafts/packages-shared-config`)

The `connect-src` base is `getCSPConnectSources(env)` in `@indiecrafts/packages-shared-config` — the brick imports it,
it did **not** move:

```ts
export function getCSPConnectSources(env: Environment): readonly string[] {
  const sanity = ["https://*.sanity.io", "wss://*.api.sanity.io"];
  const npm = ["https://registry.npmjs.org"];
  const common = ["'self'", ...sanity, ...npm];
  if (env === "development" || env === "test") {
    return [
      ...common,
      "ws://localhost:*",
      "http://localhost:*",
      "https://*.vercel.app",
    ];
  }
  return common;
}
```

- **`*.sanity.io` + `wss://*.api.sanity.io`** — the embedded Studio + live preview reach the project
  API + CDN (the WebSocket carries realtime). Locked to `*.sanity.io` → safe in prod.
- **`registry.npmjs.org`** — the Studio's own version check.
- **Dev/test extras** — localhost (HMR) + `*.vercel.app` (previews), outside production only.

`env` comes from `getCurrentEnvironment()` (the same helper that gates `robots.txt`). See
[Robots & environments](./robots-and-environments.md).

## Hardening — and why it's Sanity-Studio-safe

- **HSTS** ships **production only** (never localhost). No `preload` by default — preload is
  near-irreversible; opt in with `hsts: { preload: true }`.
- **COOP** = `same-origin-allow-popups` **on purpose**: the Studio login opens an OAuth popup, and
  plain `same-origin` would break it.
- **COEP + CORP are deliberately skipped** — they break the Studio's web workers + cross-origin Sanity
  CDN resources.
- After a headers change, smoke-test `/studio` — login (popup), content load, and save.

## Extending the CSP for a new external service

- **API / analytics / fetch target:** add the host to `getCSPConnectSources()` in `@indiecrafts/packages-shared-config`
  (keeps the dev/prod split), or pass `csp.connectSrc: [...]` for an app-only host.
- **Embedded iframe (video, widget):** add the origin to `csp.frameSrc` in the `securityHeaders({...})`
  call. Update `parseVideoEmbed`/`HeroVideo` too if it's a video host.
- **Editor-pasted embed (custom-html provider form):** add the origin to `EMBED_HOSTS` — it lands in
  `script-src` + `connect-src` + `frame-src` + `form-action`. See [Newsletter](/modules/newsletter/).
- **Remote images:** add the host to `imageDefaults.remotePatterns` (in the brick) — `img-src` already
  allows any `https:`.

::: tip Google Analytics hosts are always allowed
`csp.googleAnalytics: true` adds Google's script + beacon hosts to `script-src` + `connect-src`
unconditionally — the measurement id lives in Sanity (a runtime value the build-time CSP can't read),
so no manual edit per GA change. Harmless when GA is off. See [Analytics](./analytics.md).
:::
