---
title: "Robots & environments"
description: "robots.txt and the sitemap are environment-aware: only a real production deployment with a configured origin is indexable."
status: stable
---

# Robots & environments

`robots.txt` and the sitemap are **environment-aware**: only a real production deployment with a configured origin is indexable. Every other deployment — local dev, a preview deploy, staging, test, or a production build still on the placeholder URL — stays "quiet when online" and never leaks into search results.

## robots.txt

Route: `src/app/robots.txt/route.ts`. A plain Route Handler (not the typed `robots.ts` metadata route) so it can emit an `/llms.txt` pointer alongside the standard directives.

The single decision it makes:

```ts
const indexable = getCurrentEnvironment() === "production" && isSiteConfigured;
```

**Indexable** — full crawl instructions:

```text
# AI training crawlers blocked (features.blockAiTraining) — one group each, so `*` still allows search
User-agent: GPTBot
Disallow: /
User-agent: Google-Extended
Disallow: /
# … CCBot · ClaudeBot · anthropic-ai · Bytespider · Applebot-Extended · Meta-ExternalAgent · FacebookBot · Amazonbot · PanguBot · AI2Bot · cohere-training-data-crawler

User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://acme.com/sitemap.xml     # only if features.sitemap
# llms.txt: https://acme.com/llms.txt      # only if features.llms.index
```

`/_next/` is **never** disallowed: it serves the CSS, JS and optimized images a crawler fetches
to render the page, and Google warns that blocking them harms rendering and indexing. There is
no `Host:` line — Google ignores it and Yandex dropped it in 2018.

**Not indexable** — everything blocked:

```text
User-agent: *
Disallow: /
```

So two conditions must _both_ hold before crawlers are invited in:

1. `getCurrentEnvironment() === "production"`
2. `isSiteConfigured` — `site.url` points at a real origin.

### `getCurrentEnvironment()`

Defined in `@indiecrafts/packages-shared-config` (`code/packages/shared/config/src/types.ts`). It reads `NEXT_PUBLIC_ENVIRONMENT` first (an explicit override), then falls back to `NODE_ENV`:

```ts
export function getCurrentEnvironment(): Environment {
  const explicit = process.env.NEXT_PUBLIC_ENVIRONMENT;
  if (explicit === "staging") return "staging";
  if (explicit === "test") return "test";
  switch (process.env.NODE_ENV) {
    case "production":
      return "production";
    case "test":
      return "test";
    default:
      return "development";
  }
}
```

`Environment` is `"development" | "test" | "staging" | "production"`. Setting `NEXT_PUBLIC_ENVIRONMENT=staging` keeps a deploy **non-production** even when `NODE_ENV=production` — so a staging build with a real `NEXT_PUBLIC_SITE_URL` still serves `Disallow: /`. (The same helper also tightens the CSP — see [Security headers](/projects/web/website/seo/security-headers).)

### `isSiteConfigured`

Defined in `@indiecrafts/packages-shared-config` (`code/packages/shared/config/src/index.ts`):

```ts
export const PLACEHOLDER_SITE_URL = "https://example.com";
export const isSiteConfigured = site.url !== PLACEHOLDER_SITE_URL;
```

`site.url` reads `NEXT_PUBLIC_SITE_URL` and falls back to the placeholder. Until you set the env var to the client's real domain, `isSiteConfigured` is `false` and robots.txt stays closed — even in production. A deliberate safety net: a production deploy that forgot the domain won't get indexed under `example.com`.

::: warning Set the origin on production only
Set `NEXT_PUBLIC_SITE_URL` **only** on the production deployment. Leaving it unset everywhere else keeps previews and staging on the placeholder origin, so they can't accidentally become indexable.
:::

## Blocking AI training crawlers

`features.blockAiTraining` (default **on**) blocks AI **training** / dataset crawlers while keeping
search and AI-_search_ crawlers indexing — so you fight the learning bots, not the search bots, even
the AI ones. It only applies when the site is indexable; a non-indexable deploy already serves
`Disallow: /` to everyone.

Robots.txt matches the **most specific** user-agent group, so each training bot gets its own
`Disallow: /` group and everything else falls through to `User-agent: *` (`Allow: /`). The blocked
list is `AI_TRAINING_USER_AGENTS` in `@indiecrafts/packages-shared-config` — edit it to taste:

- **Blocked** (training): `GPTBot` · `Google-Extended` · `CCBot` · `ClaudeBot` · `anthropic-ai` · `Bytespider` · `Applebot-Extended` · `Meta-ExternalAgent` · `FacebookBot` · `Amazonbot` · `PanguBot` · `AI2Bot` · `cohere-training-data-crawler`.
- **Still allowed** (search, AI search and user-fetch — never named): `Googlebot`, `Bingbot`, `Applebot`, `DuckDuckBot`, `PetalBot` (Huawei Petal Search), `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`, `Perplexity-User`, `Amzn-SearchBot`. A test fails if one of these lands in the blocked list.

Several operators split one purpose per bot — block the training one, keep the search one:
Anthropic `ClaudeBot` / `Claude-SearchBot` + `Claude-User`, Amazon `Amazonbot` / `Amzn-SearchBot`,
Huawei `PanguBot` / `PetalBot`, Meta `FacebookBot` + `Meta-ExternalAgent` / `facebookexternalhit`
(link previews).

`Google-Extended` and `Applebot-Extended` opt out of Gemini/Apple **training** without touching Search
ranking or AI Overviews. This is robots.txt-only — no `X-Robots-Tag: noai` header, which is broad
(discourages AI _search_ too) and barely honored. Set `features.blockAiTraining: false` to let AI
training crawlers in.

**The Cloudflare edge must not undo this.** Every Terraform stack on the zone pins
`ai_bots_protection = "disabled"`, `crawler_protection = "disabled"` and
`is_robots_txt_managed = false` on `cloudflare_bot_management`. Cloudflare's "Block AI bots" also
blocks crawlers that do both search and training (Googlebot, Bingbot, Applebot), and new domains
block training crawlers on ad pages by default since 2026-09-15. A test keeps the stacks in step
(`infra-registry.test.mjs`). Bot Fight Mode stays on — it targets malicious automation, not
verified crawlers; confirm in Cloudflare → Security → Bots that AI search crawlers get `200`.

## The sitemap

Route: `src/app/sitemap.ts`. Emits every `(route × locale)` combination with `hreflang` alternates. Gated by **`features.sitemap`**:

```ts
if (!features.sitemap) return [];
```

When off, the route serves an **empty sitemap** _and_ `robots.txt` stops advertising the `Sitemap:` line — the two are kept in agreement.

What's included:

- **Static pages** — from the `pages` map (`app/routes.ts` → `ROUTES`), dropping any entry with `seo.noindex`, `seo.robots.index === false`, or `enabled === false`. The home page gets priority `1`, others `0.7`. The document's Sanity `seo.noIndex` further prunes individual locales from a page's `hreflang` alternates (and drops the page entirely if every locale is hidden).
- **Dynamic blog entries** — posts, categories, tags, and authors, expanded from Sanity at build time, but **only when `features.blog` is on** (`if (!features.blog) return staticEntries;`). Each is emitted once per slug with `hreflang` alternates for the locales it exists in.

::: tip
The sitemap's inclusion rules mirror `robots.txt` and the LLM endpoints: a page opts out of all discovery surfaces at once via `seo.noindex` (config) or the document's Sanity `seo.noIndex`, `seo.robots.index = false`, or `enabled: false`. See [LLM endpoints](/projects/web/website/seo/llms-endpoints) for the parallel `isLlmsPage` gate.
:::

## Quick reference

| Env var                   | Effect                                                            |
| ------------------------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`    | Sets `site.url`; must be real for `isSiteConfigured` → indexable. |
| `NEXT_PUBLIC_ENVIRONMENT` | Overrides detected env; only `production` is indexable.           |

| Feature flag               | Effect                                                                                                               |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `features.sitemap`         | Off ⇒ empty sitemap + robots.txt drops the `Sitemap:` line.                                                          |
| `features.llms.index`      | Off ⇒ robots.txt drops the `# llms.txt:` pointer.                                                                    |
| `features.blockAiTraining` | On ⇒ robots.txt blocks the AI-training crawlers in `AI_TRAINING_USER_AGENTS`; search + AI-search bots keep indexing. |
| `features.blog`            | Off ⇒ sitemap skips all Sanity-driven blog entries.                                                                  |
