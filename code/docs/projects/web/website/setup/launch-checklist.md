---
title: "Launch checklist"
description: 'Top-to-bottom from "dev says it''s ready" to "Google finds us".'
status: stable
---

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

Still seeing `Disallow: /`? Either `NEXT_PUBLIC_SITE_URL` is unset/wrong, or the deploy's environment isn't `production` — set `NEXT_PUBLIC_ENVIRONMENT=production` (or leave it unset so `NODE_ENV` decides). See [`robots-and-environments.md`](/projects/web/website/seo/robots-and-environments).

---

## 2. Cloudflare Workers setup

The app deploys to Cloudflare Workers via OpenNext (dev / staging / prod). The **full runbook** — R2 buckets, secrets, GitHub Actions, custom domain, first-deploy checks — is [Deployment (Cloudflare)](/projects/web/website/setup/deployment). The launch-critical bits:

> **Reusing the template? Rename first.** Run `pnpm project:rename <slug>` before any staging/prod deploy — it sets `DEFAULT_SITE_PREFIX` + the `<prefix>-<env>-web-website*` Worker/R2 names, and the deploy is **blocked** until you do (so one client can't overwrite another under a shared Cloudflare account). Give this client its **own** Resend key + (if on a shared Sanity project) its **own** dataset, not `production`.

**Turn on rate-limiting + CAPTCHA.** Run `pnpm setup:web:website:kv` once — it creates a `RATE_LIMIT_KV` namespace
**per env** and activates the in-app form rate limiter (it fails **open** until you do). To also enable
Turnstile CAPTCHA on the public forms, set **both** `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET`
(set only one and submissions are rejected) — see the Turnstile block in [`environment.md`](/projects/web/website/setup/environment).

**Arm the rest of the defenses.** These also run open or idle until configured:

- [ ] **Edge stack** — on `*.workers.dev` the WAF, bot, rate-limit and leaked-credential rules do
      nothing. Put the site on its real domain and apply the zone stack:
      `pnpm infra:web:website:apply:prod` (the api has its own stack under `code/shared/api/infra/`).
- [ ] **GDPR fingerprint salt** — `pnpm gdpr:salt:generate`, then `pnpm gdpr:salt:set:prod`; check
      with `pnpm gdpr:salt:status:prod`. One value per env, never rotated: it is the key that finds a
      person's records on erasure.
- [ ] **Worker secrets** — `pnpm secrets:sync:shared:api:prod` and `pnpm secrets:sync:web:website:prod`
      push `APP_API_TOKEN`, `CLERK_WEBHOOK_SECRET`, the Sanity tokens and the rest from the env files.
- [ ] **Check them** — a public form POST without a valid Turnstile token is refused, `/admin`
      sends a signed-out visitor to sign in, and an erasure request finds its subject.

### Env vars + secrets

Public `NEXT_PUBLIC_*` go in `wrangler.toml [vars]` (and GitHub Environment **vars** for the CI build); server tokens are **secrets** (`wrangler secret put … --env <env>`, and GitHub Environment **secrets**). Full reference in [`environment.md`](/projects/web/website/setup/environment).

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

The `dev` + `staging` Workers publish to `*.workers.dev` (robots Disallow — non-prod). Trigger one from the **Deploy (Cloudflare)** GitHub Action ("Run workflow" → env) or `pnpm deploy:web:website:staging`.

---

## 3. Sanity Studio (if `features.studio: true`)

Whitelist the production domain so Studio API calls stop throwing `CorsOriginError`: set the
env's `NEXT_PUBLIC_SITE_URL` in `wrangler.toml` (or its domain in the registry), then run
`pnpm sanity:setup` — it adds every website origin that is missing. Deploy-preview wildcards stay
manual (`sanity cors add <origin> --credentials`). Then visit `https://acme.com/studio`, verify login against your real project, and invite editors at sanity.io/manage → your project → **Members**.

The Studio's **Aperçu** (preview) tab needs `SANITY_API_READ_TOKEN` on the deployed site (else 503).
On Cloudflare `/studio` redirects to the hosted Studio (`NEXT_PUBLIC_SANITY_STUDIO_URL`). Its Aperçu
tab previews every site whose URL is known when you run `studio:deploy` (each env's
`NEXT_PUBLIC_SITE_URL` in `wrangler.toml`, else the domain registry; prod first). After you set a
new site URL, redeploy the site (it lets the Studio frame it) **and** the Studio.
Safari blocks the preview cookie inside the Studio's frame: editors preview in Chrome, Edge or Firefox.

**Personal data stays private.** On Sanity's free plan the dataset is public. Check that an
anonymous read sees no personal data (expect `0` for each count):

```bash
curl -sG "https://<ID>.apicdn.sanity.io/v2025-01-01/data/query/production" --data-urlencode \
  'query={"forms":count(*[_type in ["contactMessage","waitlistEntry","comment"]]),"emails":count(*[_type=="emailStrings"])}'
```

A non-zero count means documents from before the private ids: run
`pnpm --filter @indiecrafts/web-surfaces-website sanity:privatize -- --apply` (dry run first,
without `--apply`). The api worker needs `SANITY_API_READ_TOKEN` in every env to read the E-mails
singleton (support address, BCC). A lead-magnet file is public on this plan (see the newsletter page).

**Publish webhook (every site, Studio or not).** Without it a newly published post stays 404 and
a deleted one stays online. Set `SANITY_REVALIDATE_SECRET` for the environment, then at
sanity.io/manage → **API** → **Webhooks** create one per site URL: `https://acme.com/api/revalidate`,
dataset `production`, triggers **Create · Update · Delete**, method `POST`, the same secret.
Details → [the route reference](/reference/projects/web/website/src/app/api/revalidate/route).

---

## 4. Analytics + cookie consent

The Google Analytics id and consent behaviour are edited **in Sanity** (`siteSettings.analytics` — Studio → _Analytics & cookies_), not in config. Set the GA id there and choose whether the cookie banner shows. Two shapes:

- **Outside the EU** — set the GA id, banner off. GA loads on every page.
- **EU traffic** — set the GA id, banner on. GA loads with [Consent Mode v2](https://developers.google.com/tag-platform/security/guidance/consent-mode) defaults `denied`; the banner flips them to `granted` only on accept.

Details: [`analytics.md`](/projects/web/website/seo/analytics) and [`cookie-consent.md`](/packages/web/compliance). The five legal pages (legal notice, privacy, cookies, terms, terms-of-sale) each toggle independently via `features.legal.*` — see [`legal-pages.md`](/projects/web/website/config/legal-pages).

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

If any don't return what's expected, jump to [`operations.md`](/projects/web/website/setup/operations) § Troubleshooting.

---

## 7. Day-of-launch share kit

Once the curl pass is green, send the client:

- The production URL
- Studio URL (`/studio`) + invitation steps
- The enabled legal-page URLs (e.g. `/privacy-policy`, `/fr/mentions-legales`) for review
- A bookmark to `/sitemap.xml` and `/robots.txt` for their own verification

Then bookmark [`operations.md`](/projects/web/website/setup/operations) yourself — the steady-state runbook.
