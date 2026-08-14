# Security headers (CSP · headers · image allowlist)

The hardened HTTP-header baseline every app shares — the **CSP builder**, the security header set
(HSTS, COOP, X-Frame, Referrer, Permissions), immutable cache-control, and the Next **image
allowlist**. Lives in the **`@indiecrafts/security`** brick (`code/packages/security`),
consumed as source. Pure TS (no React/Next imports); dep: `@indiecrafts/config`.

Extracted from `next.config.ts` so a second app reuses the hardening and passes only its own hosts.
**It composes `@indiecrafts/config`, it doesn't replace it** — `getCurrentEnvironment` +
`getCSPConnectSources` stay in config; the brick imports them.

## Exports

| Import | What it is |
| --- | --- |
| `buildCsp(env, csp?)` (`./csp`) | The CSP string. Hardened defaults + `connect-src` from `getCSPConnectSources(env)`. App extras via `CspHosts` (`frameSrc`, `mediaSrc`, `embedHosts`, `googleAnalytics`, …). |
| `securityHeaders(opts)` (`./headers`) | The full Next `headers()` array — the security set + CSP (+ HSTS/COOP in prod) + immutable `Cache-Control` on `immutablePaths`. |
| `imageDefaults` / `imageRemotePatterns` (`./images`) | The Next image allowlist (`images.unsplash.com` + `cdn.sanity.io`) + formats + 1-year TTL. Spread into `images`. |

## Using it (`next.config.ts`)

```ts
import { getCurrentEnvironment } from "@indiecrafts/config";
import { imageDefaults, securityHeaders } from "@indiecrafts/security";

const EMBED_HOSTS: string[] = []; // app knob — external embed origins (newsletter provider)

const nextConfig = {
  images: { ...imageDefaults, loaderFile: "./src/lib/sanity-image-loader.ts" },
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
  },
};
```

## What ships on every response

`X-Content-Type-Options: nosniff` · `X-Frame-Options: DENY` · `Referrer-Policy:
strict-origin-when-cross-origin` · `Permissions-Policy: camera=(), microphone=(), geolocation=()` ·
`Content-Security-Policy` · `Cross-Origin-Opener-Policy` · **`Strict-Transport-Security`
(production only)**.

## Hardening — and why it's Sanity-Studio-safe

- **HSTS** — production only (never localhost). `max-age=1y; includeSubDomains`, **no `preload`** by
  default (preload is near-irreversible; opt in with `hsts: { preload: true }`). Sticky: browsers cache
  it, so a bad value is hard to undo — only ships in prod over HTTPS.
- **COOP** — `same-origin-allow-popups` by default. `allow-popups` is deliberate: the embedded Sanity
  **Studio login opens an OAuth popup**, and `same-origin` (no popups) would break it. Override to
  `same-origin` / `false` if you have no popups.
- **`upgrade-insecure-requests`** — added to the production CSP.
- **Skipped:** COEP + CORP — they break the Studio's web workers + cross-origin Sanity CDN resources.
  `img-src` stays `https:`-permissive for editor-embedded images (tighten to specific hosts if you
  don't allow arbitrary embeds).

## Not Sanity

This is **build config** — no editor/Sanity fields (config-first). The GA measurement ID is edited in
Sanity, but its CSP hosts are allowed at build time (`googleAnalytics: true`) since the build can't
read a runtime value.
