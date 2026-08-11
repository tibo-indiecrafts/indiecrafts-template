# Operations

Day-to-day for the client running the site. Where things live, what to bookmark, what to check after a publish, what to do when something breaks.

For the launch itself, see [`launch-checklist.md`](./launch-checklist.md).

---

## 1. URLs to bookmark

| URL                                                 | What it is                                                              |
| --------------------------------------------------- | ----------------------------------------------------------------------- |
| `/studio`                                           | Sanity Studio — content editing                                         |
| `/sitemap.xml`                                      | Indexed routes — handy for verifying a new post appears                 |
| `/robots.txt`                                       | Crawler rules — should allow `/` in production                          |
| `/<locale>/blog/rss.xml`                            | RSS feed per locale — pasteable into Feedly / Inoreader / Slack RSS bot |
| `/<locale>/blog/<slug>/md`                          | Markdown export of any single post                                      |
| `/<locale>/llms.txt`                                | LLM-readable site summary per locale                                    |
| Netlify dashboard → **Forms**                       | Every form submission, by form name                                     |
| Netlify dashboard → **Deploys**                     | Build logs, deploy preview URLs, rollbacks                              |
| Google Search Console → **Coverage** + **Sitemaps** | What Google sees + indexing errors                                      |
| <https://www.sanity.io/manage> → your project       | API tokens, members, CORS allowlist                                     |

---

## 2. Content publish flow

A typical week with the blog on:

1. **Draft in the Studio** (`/studio` → Blog → Posts → EN or FR → + Create). Walk through the post form following [`editor-guide.md`](../features/blog/editor-guide.md).
2. **Click Publish.** The site receives the change via the Sanity Live subscription within a few seconds — no rebuild required.
3. **Verify on the live URL:**
   ```bash
   curl -sSL -o /dev/null -w "%{http_code}\n" https://acme.com/en/blog/<slug>
   # → 200
   ```
4. **Re-check the sitemap a few minutes later:**
   ```bash
   curl -s https://acme.com/sitemap.xml | grep <slug>
   ```
5. **Notify subscribers** via the RSS feed (auto-updated). For email, copy `/blog/<slug>/md` into your newsletter tool.

If a post never appears at the public URL: see § Troubleshooting → "Post published but 404".

---

## 3. Form submissions (Netlify Forms)

If the site has forms (contact, newsletter, etc.), submissions land in **Netlify dashboard → Forms** under each form's `name=` attribute. To receive emails on each new submission, configure **Forms → Settings → Notifications → Form submission notifications** with the recipient address. Slack / webhook destinations live in the same panel.

Quick verification after a deploy:

```bash
# Confirm Netlify is finding the form schema
curl -sSL -o /dev/null -w "%{http_code}\n" https://acme.com/__forms.html
# → 200
```

If forms in production submit successfully but never appear in the dashboard:

- Check that the form name in the React component matches an entry in `public/__forms.html`
- Make sure the hidden `<input name="form-name" value="<name>" />` is present
- Re-deploy — Netlify's form parser only scans static files at build time

---

## 4. Analytics + consent

The cookie banner stores a single key in `localStorage`:

```
cookie-consent: "accepted" | "rejected"
```

If a user wants to change their mind, send them to `?cookies=manage` — the banner re-appears without clearing other state. To erase the choice entirely:

```js
localStorage.removeItem("cookie-consent");
window.dispatchEvent(new Event("cookie-consent-change"));
```

When `analytics.googleAnalyticsId` is set:

- **Without banner** (outside EU): GA loads on every page, fires automatically.
- **With banner** (EU): GA loads with Consent Mode defaults `denied`. Pageview / events queue locally and only flush after the user clicks **Accept**. Until then, GA reports zero in real-time.

To verify in production:

1. Open the site in an incognito window.
2. DevTools → Application → Local Storage → confirm `cookie-consent` is absent.
3. Network tab → filter by `google` — you should see the GA script load but no `collect` requests (Scenario A: requests fire; Scenario B: nothing until accept).

---

## 5. Adding a new post

For non-editors: walk an editor through [`editor-guide.md`](../features/blog/editor-guide.md) once, then point them at it.

For someone with code access: the post lives in Sanity, not in the repo. There's no PR to merge — clicking **Publish** in the Studio is the deploy. The only repo change a new post triggers is when you next run the build, `generateStaticParams` picks it up and prerenders the new route.

---

## 6. Adding a new category or tag

Same flow: Studio → Categories (or Tags) → + Create → pick the language. Once published, it appears in `/<locale>/blog/category/<slug>` and in the ExploreCategories chip row on `/blog`.

A category or tag with **zero published posts** is hidden from the chip row but its detail page is still reachable by URL — visiting it shows the "no posts" copy.

---

## 7. SEO operations

After publishing a batch of new posts, ping Google Search Console:

1. Sitemaps → click your existing entry → look at **Last read** and **Discovered URLs**. GSC re-scans automatically but a manual nudge can help.
2. URL Inspection (top of GSC) → paste the new post URL → **Request indexing**. Useful for the first article of a new content push.

For richer surfacing:

- **Article schema** is emitted automatically on every post page via `buildArticleSchema(...)`. Verify with <https://search.google.com/test/rich-results>.
- **FAQ schema** is the highest-ROI rich result for B2B — wire it manually for any page where it makes sense via the recipes in [`structured-data-cookbook.md`](../seo/structured-data-cookbook.md).

---

## 8. Theming + brand updates

Changing the brand colour, logo, font, or social links happens in `src/config/index.ts`. See [`brand-setup.md`](./brand-setup.md) for the worked walkthrough including the contrast verification step.

---

## 9. Troubleshooting

| Symptom                                  | First place to look                                            | Detail                                                                                                   |
| ---------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Site is fully down                       | Netlify → Deploys → most recent build log                      | Failed build = rolled back to previous version usually                                                   |
| Post published but 404 on the public URL | Studio post's `Metadata` tab → check `noIndex`, slug, language | Common cause: post saved as draft, never published                                                       |
| Image not loading                        | Browser console → `next/image` errors                          | Domain not in `next.config.ts` `remotePatterns` — see [`brand-setup.md`](./brand-setup.md) § Image hosts |
| Studio shows "CorsOriginError"           | <https://www.sanity.io/manage> → API → CORS origins            | Add the exact origin (incl. protocol + port) with **Allow credentials** ticked                           |
| Studio "Configuration error"             | Netlify env vars                                               | `NEXT_PUBLIC_SANITY_PROJECT_ID` missing or typo                                                          |
| Draft preview returns 503                | Netlify env vars                                               | `SANITY_API_READ_TOKEN` not set — see [`sanity-tokens.md`](../features/blog/sanity-tokens.md)            |
| Form submits but no email arrives        | Netlify dashboard → Forms → Settings → Notifications           | Add email / Slack / webhook destination                                                                  |
| `/sitemap.xml` is missing entries        | Build was at the wrong revision                                | Re-deploy from `main` — sitemap is regenerated at build time                                             |
| Cookie banner won't go away              | Browser DevTools → Application → Local Storage                 | `cookie-consent` key is missing; banner reappears every visit until set                                  |

Deeper Sanity-specific symptoms (e.g. "Schema migration needed", legacy module fields) are in [`sanity-setup.md`](../features/blog/sanity-setup.md) § Troubleshooting.

---

## 10. Backups

The site has two stores worth backing up:

- **Code** — the git repo. Pushes to GitHub / GitLab are the backup. Tag releases (`git tag -a v1.0.0 -m "Launch"`) at milestones.
- **Sanity dataset** — the content. Export periodically:

  ```bash
  pnpm dlx sanity@latest dataset export production ./backup-$(date +%Y-%m-%d).tar.gz \
    --project-id <ID>
  ```

  The resulting tarball can be re-imported into a new dataset with `sanity dataset import` if anything goes wrong on the live one.

Form submissions are stored on Netlify and can be exported from the dashboard → Forms → Submissions → **Export CSV**.

Brand assets live in `public/` — already covered by the git backup.

---

## 11. Routine maintenance

| Cadence   | Action                                                                                                                              |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Weekly    | Glance at Netlify Forms → Spam tab. Promote false positives back to Verified.                                                       |
| Monthly   | Run `pnpm verify` locally on the latest `main` to confirm CI still passes (tsc + lint + format + contrast).                         |
| Monthly   | Export the Sanity dataset (see § Backups).                                                                                          |
| Quarterly | `pnpm outdated` → review and bump minor versions of dependencies. Then re-run `pnpm verify`.                                        |
| Quarterly | Re-check Google Search Console → Coverage for unindexed pages or new errors.                                                        |
| Yearly    | Refresh `NEXT_PUBLIC_SANITY_API_VERSION` in `.env` to the latest dated version Sanity recommends. Test in preview before promoting. |
