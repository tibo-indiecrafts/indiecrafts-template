# Launch checklist

Top-to-bottom from "dev says it's ready" to "Google finds us". Run once on first deploy; keep open as a per-client checklist for the next launch.

---

## 1. Flip the staging gate

Until the production origin is set, `site.url` stays on the placeholder `https://example.com`, `isSiteConfigured` is `false`, and **`robots.txt` serves `Disallow: /`** — the site is intentionally hidden from search. The origin is set by the `NEXT_PUBLIC_SITE_URL` env var (config reads it; there's nothing to edit in code):

```bash
# production deploy environment
NEXT_PUBLIC_SITE_URL=https://acme.com
```

Two conditions must **both** hold for the site to become indexable: the environment resolves to `production` (`getCurrentEnvironment()`) **and** `site.url` is off the placeholder. Deploy, then verify:

```bash
curl -s https://acme.com/robots.txt | head
# → "User-agent: *\nAllow: /"  (was Disallow: / while gated)
```

Still seeing `Disallow: /`? Either `NEXT_PUBLIC_SITE_URL` is unset/wrong, or the deploy's environment isn't `production` — set `NEXT_PUBLIC_ENVIRONMENT=production` (or leave it unset so `NODE_ENV` decides). See [`robots-and-environments.md`](../seo/robots-and-environments.md).

---

## 2. Netlify setup

### Connect the repo

Netlify → **Add new site** → **Import from Git** → pick the repo. Set **Package directory = `code/apps/web`** (Base directory unset) so Netlify reads `code/apps/web/netlify.toml` and installs the workspace from root. Netlify auto-detects Next.js and installs `@netlify/plugin-nextjs`.

### Add the env vars

Site settings → **Environment variables** → Add. None are required to build, but you'll want these for production (full reference in [`environment.md`](./environment.md)):

| Key | When to set | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production | The real origin — flips the staging gate (§ 1) |
| `NEXT_PUBLIC_ENVIRONMENT` | Preview deploys | `staging` tightens CSP; only `production` is indexable |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Always (Studio/blog on) | Public, safe to expose |
| `NEXT_PUBLIC_SANITY_DATASET` | Always | `production` by default |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Always | `2025-01-01` — pin |
| `SANITY_API_READ_TOKEN` | For draft preview | Viewer role; server-only |
| `SANITY_API_WRITE_TOKEN` | Only for `pnpm seed` | Editor role; don't ship to runtime |

### Custom domain

Site settings → **Domain management** → **Add domain alias**. Netlify gives you the DNS records:

- `A` on apex → Netlify load balancer IP (check current value in Netlify docs)
- `CNAME` on `www` → `<your-site>.netlify.app`

Wait for DNS (5 min – 24 h), then enable HTTPS — Netlify provisions Let's Encrypt automatically.

### Branch deploys + previews

On by default. Every PR gets a `deploy-preview-N--<site>.netlify.app` URL with **its own CSP environment** if you set `NEXT_PUBLIC_ENVIRONMENT=staging` for branch contexts.

---

## 3. Sanity Studio (if `features.studio: true`)

Whitelist the production domain so Studio API calls stop throwing `CorsOriginError`:

```bash
pnpm dlx sanity@latest cors add https://acme.com --credentials --project-id <ID>
```

Repeat for `https://staging.acme.com`, deploy-preview wildcards, etc. Then visit `https://acme.com/studio`, verify login against your real project, and invite editors at sanity.io/manage → your project → **Members**.

---

## 4. Analytics + cookie consent

The Google Analytics id and consent behaviour are edited **in Sanity** (`siteSettings.analytics` — Studio → *Analytics & cookies*), not in config. Set the GA id there and choose whether the cookie banner shows. Two shapes:

- **Outside the EU** — set the GA id, banner off. GA loads on every page.
- **EU traffic** — set the GA id, banner on. GA loads with [Consent Mode v2](https://developers.google.com/tag-platform/security/guidance/consent-mode) defaults `denied`; the banner flips them to `granted` only on accept.

Details: [`analytics.md`](../seo/analytics.md) and [`cookie-consent.md`](../config/cookie-consent.md). The five legal pages (legal notice, privacy, cookies, terms, terms-of-sale) each toggle independently via `features.legal.*` — see [`legal-pages.md`](../config/legal-pages.md).

**Verify after deploy:**

```bash
curl -s https://acme.com/en | grep -oE "G-[A-Z0-9]+|googletagmanager.com"   # GA wired
```

---

## 5. Submit to Google Search Console

1. <https://search.google.com/search-console> → **Add property** → **URL prefix** → `https://acme.com`.
2. Verify by DNS TXT or the HTML meta-tag method. For the meta tag, paste Google's value into Sanity `siteSettings.verification` (Studio → *Vérification Google / Bing*) — the layout emits it.
3. **Sitemaps** → enter `sitemap.xml` → **Submit**. GSC will report the URLs it found (one per enabled route × locale, plus published posts).
4. Optional: submit each locale's RSS feed (`/en/blog/rss.xml`, `/fr/blog/rss.xml`) so blog updates surface faster.

Bing has an equivalent at <https://www.bing.com/webmasters> — same sitemap URL.

---

## 6. First-hours verification

Within an hour of the production deploy, run this curl pass:

```bash
SITE=https://acme.com

# Public surfaces — should all be 200
for url in / /en /fr /en/blog /fr/blog /sitemap.xml /robots.txt /manifest.webmanifest; do
  printf "%-30s %s\n" "$url" "$(curl -sSL -o /dev/null -w "%{http_code}" "$SITE$url")"
done

# Sitemap should have entries
curl -s "$SITE/sitemap.xml" | grep -c "<loc>"

# Robots should ALLOW (not the staging Disallow:/)
curl -s "$SITE/robots.txt"

# Studio reachable
curl -sSL -o /dev/null -w "%{http_code}\n" "$SITE/studio"   # → 200

# OG card points at the Sanity CDN (siteMeta.<locale>.ogImage)
curl -s "$SITE/en" | grep -iE 'og:image'   # → content=".../cdn.sanity.io/..."

# Security headers present
curl -sI "$SITE/" | grep -iE "x-frame|content-security|referrer|permissions"
```

If any don't return what's expected, jump to [`operations.md`](./operations.md) § Troubleshooting.

---

## 7. Day-of-launch share kit

Once the curl pass is green, send the client:

- The production URL
- Studio URL (`/studio`) + invitation steps
- The enabled legal-page URLs (e.g. `/privacy-policy`, `/fr/mentions-legales`) for review
- A bookmark to `/sitemap.xml` and `/robots.txt` for their own verification

Then bookmark [`operations.md`](./operations.md) yourself — the steady-state runbook.
