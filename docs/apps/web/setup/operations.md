# Operations

Day-to-day for whoever runs the site. Where things live, what to bookmark, what to check after a publish, what to do when something breaks. For the launch itself, see [`launch-checklist.md`](./launch-checklist.md).

---

## 1. URLs to bookmark

| URL | What it is |
| --- | --- |
| `/studio` | Sanity Studio — content editing |
| `/sitemap.xml` | Indexed routes — verify a new post appears |
| `/robots.txt` | Crawler rules — should allow `/` in production |
| `/<locale>/blog/rss.xml` | RSS feed per locale — pasteable into Feedly / a Slack RSS bot |
| `/<locale>/blog/<slug>/md` | Markdown export of a single post |
| `/<locale>/llms.txt` | LLM-readable site summary per locale |
| Netlify → **Forms** | Every form submission, by form name |
| Netlify → **Deploys** | Build logs, preview URLs, rollbacks |
| Google Search Console → **Coverage** + **Sitemaps** | What Google sees + indexing errors |
| sanity.io/manage → your project | API tokens, members, CORS allowlist |

---

## 2. Content publish flow

A typical week with the blog on:

1. **Draft in the Studio** (`/studio` → Blog → Posts → EN or FR → + Create). Walk the post form via [`editor-guide.md`](../../../modules/blog/editor-guide.md).
2. **Click Publish.** The site picks up the change via the Sanity Live subscription within seconds — no rebuild.
3. **Verify on the live URL:**
   ```bash
   curl -sSL -o /dev/null -w "%{http_code}\n" https://acme.com/en/blog/<slug>   # → 200
   ```
4. **Re-check the sitemap** a few minutes later:
   ```bash
   curl -s https://acme.com/sitemap.xml | grep <slug>
   ```
5. **Notify subscribers** via RSS (auto-updated). For email, copy `/blog/<slug>/md` into your newsletter tool.

Post never appears? See § Troubleshooting → "Post published but 404".

---

## 3. Form submissions (Netlify Forms)

The template ships `public/__forms.html` (Netlify's build-time form registry). Submissions land in **Netlify → Forms** under each form's `name=` attribute. For email/Slack/webhook notifications, use **Forms → Settings → Notifications**.

```bash
# Confirm Netlify found the form schema
curl -sSL -o /dev/null -w "%{http_code}\n" https://acme.com/__forms.html   # → 200
```

Submits succeed but nothing shows in the dashboard? Check the form `name` in the component matches an entry in `public/__forms.html`, the hidden `<input name="form-name" value="<name>" />` is present, and re-deploy — Netlify's parser only scans static files at build time.

---

## 4. Analytics + consent

Analytics (the GA id) and the cookie banner are configured in **Sanity** (`siteSettings.analytics`), not config — see [`analytics.md`](../seo/analytics.md) and [`cookie-consent.md`](../config/cookie-consent.md).

Consent is stored client-side as a **JSON record of per-category choices** under `localStorage["cookie-consent"]`. Reactive state changes fire the `cookie-consent-change` window event; the banner/preferences dialog opens on the `cookie-preferences-open` event (footer "cookie settings" link, or `useConsent().openPreferences()`).

To let a user change their mind, open preferences again:

```js
window.dispatchEvent(new Event("cookie-preferences-open"));
```

To erase the choice entirely:

```js
localStorage.removeItem("cookie-consent");
window.dispatchEvent(new Event("cookie-consent-change"));
```

When a GA id is set: **without banner** GA loads on every page; **with banner** GA loads with Consent Mode defaults `denied` and only flushes after **Accept**. Verify in an incognito window: DevTools → Application → Local Storage (confirm `cookie-consent` absent), Network → filter `google` (script loads; `collect` requests fire only per your consent shape).

---

## 5. Adding a post, category, or tag

Posts and taxonomy live in Sanity, not the repo — **Publish in the Studio is the deploy**, no PR to merge. A new post appears at its public URL via the Live subscription; the next build also prerenders it via `generateStaticParams`.

New category/tag: Studio → Categories (or Tags) → + Create → pick the language. Once published it shows at `/<locale>/blog/category/<slug>` and in the explore chip row on `/blog`. A taxonomy term with **zero published posts** is hidden from the chip row, but its detail page is still reachable by URL (shows the "no posts" copy).

---

## 6. SEO operations

After publishing a batch of posts, nudge Google Search Console:

1. Sitemaps → your entry → **Last read** / **Discovered URLs** (GSC re-scans automatically; a nudge helps).
2. URL Inspection → paste the new post URL → **Request indexing** (useful for the first article of a push).

- **Article schema** is auto-emitted on every post page — verify at <https://search.google.com/test/rich-results>.
- **FAQ schema** is the highest-ROI B2B rich result — wire it per page via [`structured-data-cookbook.md`](../seo/structured-data-cookbook.md).

---

## 7. Theming + brand updates

Colours, fonts, logo, and social links change in code (tokens + `@indiecrafts/config`) or Sanity depending on the surface — the full split and the contrast-verification step are in [`brand-setup.md`](./brand-setup.md).

---

## 8. Troubleshooting

| Symptom | First place to look | Detail |
| --- | --- | --- |
| Site fully down | Netlify → Deploys → latest build log | A failed build usually rolls back to the previous version |
| Post published but 404 | Studio post's metadata → check `noIndex`, slug, language | Common cause: saved as draft, never published |
| Image not loading | Browser console → `next/image` error | Host not in `next.config.ts` `remotePatterns` — see [`brand-setup.md`](./brand-setup.md) § Image hosts |
| Studio "CorsOriginError" | sanity.io/manage → API → CORS origins | Add the exact origin (protocol + port) with **Allow credentials** ticked |
| Studio "Configuration error" | Deploy env vars | `NEXT_PUBLIC_SANITY_PROJECT_ID` missing or typo'd |
| Draft preview returns 503 | Deploy env vars | `SANITY_API_READ_TOKEN` not set — see [`sanity-tokens.md`](../../../modules/blog/sanity-tokens.md) |
| Form submits, no email | Netlify → Forms → Settings → Notifications | Add an email / Slack / webhook destination |
| `robots.txt` still `Disallow: /` | Deploy env vars | `NEXT_PUBLIC_SITE_URL` unset, or environment isn't `production` — see [`robots-and-environments.md`](../seo/robots-and-environments.md) |
| `/sitemap.xml` missing entries | Build at the wrong revision | Re-deploy from `main` — sitemap regenerates at build time |
| Cookie banner won't dismiss | DevTools → Application → Local Storage | `cookie-consent` key isn't being written; banner reappears every visit until it is |

Deeper Sanity-specific symptoms (schema migration, legacy fields) are in [`sanity-setup.md`](../../../modules/blog/sanity-setup.md) § Troubleshooting.

---

## 9. Backups

- **Code** — the git repo. Pushes to the remote are the backup. Tag releases (`git tag -a v1.0.0 -m "Launch"`) at milestones.
- **Sanity dataset** — the content:
  ```bash
  pnpm dlx sanity@latest dataset export production ./backup-$(date +%Y-%m-%d).tar.gz --project-id <ID>
  ```
  Re-importable with `sanity dataset import` if the live dataset breaks.
- **Form submissions** — Netlify → Forms → Submissions → **Export CSV**.

Brand assets in Sanity are covered by the dataset export; code-side assets (fonts) by the git backup.

---

## 10. Routine maintenance

| Cadence | Action |
| --- | --- |
| Weekly | Glance at Netlify Forms → Spam; promote false positives |
| Monthly | Run `pnpm verify` on latest `main` (tsc + lint + format + contrast + doctor) |
| Monthly | Export the Sanity dataset (§ 9) |
| Monthly | `node --env-file=.env.local scripts/audit-dataset.mjs` — catch content drift (broken refs, stale drafts) |
| Quarterly | `pnpm outdated` → bump minor deps, re-run `pnpm verify` |
| Quarterly | GSC → Coverage for unindexed pages / new errors |
| Yearly | Refresh `NEXT_PUBLIC_SANITY_API_VERSION` to the latest dated version; test in preview first |
