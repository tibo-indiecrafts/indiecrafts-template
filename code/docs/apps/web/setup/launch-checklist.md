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

## 2. Cloudflare Workers setup

The app deploys to Cloudflare Workers via OpenNext (dev / staging / prod). The **full runbook** — R2 buckets, secrets, GitHub Actions, custom domain, first-deploy checks — is [Deployment (Cloudflare)](./deployment). The launch-critical bits:

> **Reusing the template? Rename first.** Run `pnpm project:rename <slug>` before any staging/prod deploy — it sets `DEFAULT_SITE_PREFIX` + the `<slug>-web*` Worker/R2 names, and the deploy is **blocked** until you do (so one client can't overwrite another under a shared Cloudflare account). Give this client its **own** Resend key + (if on a shared Sanity project) its **own** dataset, not `production`.

**Turn on rate-limiting + CAPTCHA.** Run `pnpm setup:kv` once — it creates a `RATE_LIMIT_KV` namespace
**per env** and activates the in-app form rate limiter (it fails **open** until you do). To also enable
Turnstile CAPTCHA on the public forms, set **both** `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET`
(set only one and submissions are rejected) — see the Turnstile block in [`environment.md`](./environment.md).

### Env vars + secrets

Public `NEXT_PUBLIC_*` go in `wrangler.toml [vars]` (and GitHub Environment **vars** for the CI build); server tokens are **secrets** (`wrangler secret put … --env <env>`, and GitHub Environment **secrets**). Full reference in [`environment.md`](./environment.md).

| Key                                                         | Where       | Notes                                                                                 |
| ----------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                      | prod var    | The real origin — flips the staging gate (§ 1)                                        |
| `NEXT_PUBLIC_ENVIRONMENT`                                   | per-env var | `wrangler.toml` sets `development` / `staging` / `production`; only prod is indexable |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` · `DATASET` · `API_VERSION` | build var   | Public; needed at build (blog SSG + sitemap)                                          |
| `SANITY_API_READ_TOKEN`                                     | secret      | Viewer; draft preview + build-time fetch                                              |
| `SANITY_API_WRITE_TOKEN`                                    | secret      | Editor; comments + newsletter→sanity writes                                           |

### Custom domain

Uncomment the `[[env.prod.routes]]` block in `code/projects/web/surfaces/website/wrangler.toml`, set your domain, and add it as a **Custom Domain** on the prod Worker (CF dashboard). With DNS on Cloudflare, HTTPS is automatic.

### Preview deploys

The `dev` + `staging` Workers publish to `*.workers.dev` (robots Disallow — non-prod). Trigger one from the **Deploy (Cloudflare)** GitHub Action ("Run workflow" → env) or `pnpm deploy:website:staging`.

---

## 3. Sanity Studio (if `features.studio: true`)

Whitelist the production domain so Studio API calls stop throwing `CorsOriginError`:

```bash
pnpm dlx sanity@latest cors add https://acme.com --credentials --project-id <ID>
```

Repeat for `https://staging.acme.com`, deploy-preview wildcards, etc. Then visit `https://acme.com/studio`, verify login against your real project, and invite editors at sanity.io/manage → your project → **Members**.

---

## 4. Analytics + cookie consent

The Google Analytics id and consent behaviour are edited **in Sanity** (`siteSettings.analytics` — Studio → _Analytics & cookies_), not in config. Set the GA id there and choose whether the cookie banner shows. Two shapes:

- **Outside the EU** — set the GA id, banner off. GA loads on every page.
- **EU traffic** — set the GA id, banner on. GA loads with [Consent Mode v2](https://developers.google.com/tag-platform/security/guidance/consent-mode) defaults `denied`; the banner flips them to `granted` only on accept.

Details: [`analytics.md`](../seo/analytics.md) and [`cookie-consent.md`](/packages/compliance). The five legal pages (legal notice, privacy, cookies, terms, terms-of-sale) each toggle independently via `features.legal.*` — see [`legal-pages.md`](../config/legal-pages.md).

**Verify after deploy:**

```bash
curl -s https://acme.com/en | grep -oE "G-[A-Z0-9]+|googletagmanager.com"   # GA wired
```

---

## 5. Submit to Google Search Console

1. <https://search.google.com/search-console> → **Add property** → **URL prefix** → `https://acme.com`.
2. Verify by DNS TXT or the HTML meta-tag method. For the meta tag, paste Google's value into Sanity `siteSettings.verification` (Studio → _Vérification Google / Bing_) — the layout emits it.
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
