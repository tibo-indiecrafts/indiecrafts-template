# Launch checklist

Step-by-step from "dev says it's ready" to "Google finds us". Run top-to-bottom on first deploy; keep open as a checklist for subsequent client launches.

---

## 1. Flip the staging gate

The template ships with `site.url: "https://example.com"` in `src/config/index.ts`. While that placeholder is in place:

- `robots.txt` serves `Disallow: /` (the staging gate — search engines stay out)
- A few schema.org emissions are skipped
- Sitemap canonicals point at the placeholder

Replace it with the **real production URL** before the first public deploy:

```ts
// src/config/index.ts
site = {
  // …
  url: "https://acme.com",
};
```

Push, deploy, then verify:

```bash
curl -s https://acme.com/robots.txt | head
# → "User-agent: *\nAllow: /"  (was Disallow: / before)
```

If you still see `Disallow: /`, the env var `NEXT_PUBLIC_SITE_URL` is overriding the config (it takes precedence). Set it to the same value in Netlify → Site settings → Environment variables, or unset it and redeploy.

---

## 2. Netlify setup

### Connect the repo

Netlify dashboard → **Add new site** → **Import from Git** → pick the repo. Build settings are pre-filled from `netlify.toml`; Netlify auto-detects Next.js and installs `@netlify/plugin-nextjs`.

### Add the env vars

Site settings → **Environment variables** → Add. None of these are required for a site to build, but you'll want them for production:

| Key                              | When to set                       | Notes                                            |
| -------------------------------- | --------------------------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_ENVIRONMENT`        | Preview deploys                   | `staging` tightens CSP without flipping NODE_ENV |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | Always (if `features.blog: true`) | Public, safe to expose                           |
| `NEXT_PUBLIC_SANITY_DATASET`     | Always (if blog)                  | `production` by default                          |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Always (if blog)                  | `2025-01-01` — pin                               |
| `SANITY_API_READ_TOKEN`          | If you want draft preview         | Viewer role; server-only                         |
| `SANITY_API_WRITE_TOKEN`         | Only for `pnpm seed`              | Editor role; don't ship to runtime               |

`.env.example` documents the full set.

### Custom domain

Site settings → **Domain management** → **Add domain alias**. Netlify gives you the DNS records to set at your registrar. Pattern:

- `A` record on apex → Netlify load balancer IP (`75.2.60.5` at time of writing — check Netlify docs)
- `CNAME` on `www` → `<your-site>.netlify.app`

Wait for DNS to propagate (5 min – 24 h), then enable HTTPS — Netlify provisions Let's Encrypt automatically. Your site is now reachable at the real domain.

### Branch deploys + previews

Already on by default. Every PR gets a `deploy-preview-N--<site>.netlify.app` URL with **its own CSP environment** if you set `NEXT_PUBLIC_ENVIRONMENT=staging` for branch contexts.

---

## 3. Sanity Studio (if `features.blog: true`)

Whitelist the production domain so Studio API calls stop throwing `CorsOriginError`:

```bash
pnpm dlx sanity@latest cors add https://acme.com --credentials --project-id <ID>
```

Repeat for `https://staging.acme.com`, `https://*.deploy-preview-*.netlify.app`, etc.

Then visit `https://acme.com/studio` and verify the login flow works against your real Sanity project. Invite editors at <https://www.sanity.io/manage> → your project → **Members**.

---

## 4. Analytics + cookie banner

Two scenarios:

**Scenario A — outside the EU, simple analytics**

```ts
// src/config/index.ts
features = { cookieBanner: false, … }
analytics = { googleAnalyticsId: "G-XXXXXXXXXX" }
```

GA loads unconditionally on every page. No banner. Legally fine outside GDPR jurisdictions.

**Scenario B — EU traffic with GA**

```ts
features = { cookieBanner: true, legalPage: true, … }
analytics = { googleAnalyticsId: "G-XXXXXXXXXX" }
```

GA loads with [Consent Mode v2](https://developers.google.com/tag-platform/security/guidance/consent-mode) defaults set to `denied`. The banner flips them to `granted` only on accept. The `/legal` route surfaces privacy / cookies / terms / contact pulled from `messages.<locale>.pages.legal.*`.

**Verify after deploy:**

```bash
# 1. Banner visible on first visit (no cookies yet)
curl -s https://acme.com/en | grep -oE "cookie-consent|Accept|Reject" | head -3

# 2. GA script loads (will only run after accept in Scenario B)
curl -s https://acme.com/en | grep -oE "G-[A-Z0-9]+|googletagmanager.com"
```

---

## 5. Submit to Google Search Console

1. <https://search.google.com/search-console> → **Add property** → **URL prefix** → enter `https://acme.com`
2. Verify via the DNS TXT record or the HTML meta tag method. The template already supports the meta-tag method via `seoDefaults.verification.google` in `src/config/index.ts` — paste the value Google gives you.
3. Once verified: **Sitemaps** → enter `sitemap.xml` → **Submit**. Within an hour, GSC will show how many URLs it found (should match the 37+ in your build output for a fully-seeded blog).
4. Optional: also submit `/rss.xml` for each locale (`/en/blog/rss.xml`, `/fr/blog/rss.xml`) under **Sitemaps** so blog updates surface faster.

Bing has an equivalent at <https://www.bing.com/webmasters> — same sitemap URL.

---

## 6. First-hours verification

Within an hour of the production deploy, run this curl pass to catch anything broken before someone else does:

```bash
SITE=https://acme.com

# Public surfaces — should all be 200
for url in / /en /fr /en/blog /fr/blog /sitemap.xml /robots.txt /manifest.webmanifest; do
  printf "%-30s %s\n" "$url" "$(curl -sSL -o /dev/null -w "%{http_code}" "$SITE$url")"
done

# Sitemap should have entries (37 + for a seeded blog, more after content)
curl -s "$SITE/sitemap.xml" | grep -c "<loc>"

# Robots should ALLOW (not Disallow:/ from the staging placeholder)
curl -s "$SITE/robots.txt"

# Sanity Studio reachable
curl -sSL -o /dev/null -w "%{http_code}\n" "$SITE/studio"   # → 200

# OG card is a <meta property="og:image"> pointing at the Sanity CDN (siteMeta.ogImage)
curl -s "$SITE/en" | grep -iE 'og:image'   # → content=".../cdn.sanity.io/..."

# Security headers present
curl -sI "$SITE/" | grep -iE "x-frame|content-security|referrer|permissions"
```

If any of these don't return what's expected, jump to [`operations.md`](./operations.md) § Troubleshooting.

---

## 7. Day-of-launch share kit

Once the curl pass is green, send the client:

- The production URL
- Studio URL (`/studio`) + invitation steps
- `/legal` URL (if `legalPage: true`) for them to review
- A bookmark to `/sitemap.xml` and `/robots.txt` for their own verification

Then bookmark [`operations.md`](./operations.md) yourself — that's the steady-state runbook you'll point at the next time something needs attention.
