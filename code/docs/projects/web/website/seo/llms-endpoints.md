---
title: "LLM endpoints"
description: "Three plain-text endpoints expose the site's content to LLM crawlers and assistants, following the llmstxt.org convention."
status: stable
---

# LLM endpoints

Three plain-text endpoints expose the site's content to LLM crawlers and assistants, following the [llmstxt.org](https://llmstxt.org) convention. All three are **built from Sanity** — the per-locale `siteMeta.<locale>` singleton (site summary + resources) plus each page's own `.seo` (title / description / **`llmsFull`** body, resolved by `getPageSeo`). Edited in the Studio (each document's **SEO & visibilité** section) — see [Editing SEO in Sanity](/projects/web/website/seo/editing-seo-in-sanity).

| Endpoint          | URL (default locale) | Content                                                       | Content-Type    |
| ----------------- | -------------------- | ------------------------------------------------------------- | --------------- |
| Index             | `/llms.txt`          | Site summary + one line per page + blog posts + taxonomy      | `text/plain`    |
| Full dump         | `/llms-full.txt`     | Every page's Markdown, `---`-joined, + blog + taxonomy bodies | `text/plain`    |
| Per-page Markdown | `/llms/<id>`         | One page rendered as Markdown                                 | `text/markdown` |

Static pages come from each page's `.seo` (resolved by `getPageSeo`); blog posts and taxonomy come from their own Sanity docs (see [Blog posts](#blog-posts)). Every endpoint is locale-aware — the default locale serves the bare path, other locales are prefixed:

```text
/llms.txt          /fr/llms.txt
/llms-full.txt     /fr/llms-full.txt
/llms/home         /fr/llms/home
```

## The three endpoints

### `/llms.txt` — the index

Route: `src/app/[locale]/llms.txt/route.ts`. A short, link-heavy summary:

- **H1** = the Sanity `siteSettings.siteName` (else `DEFAULT_SITE_NAME`, `"indiecrafts.dev"`)
- **blockquote** = `siteMeta.<locale>.llms.summary`, else the site `tagline`
- **paragraph** = `siteMeta.<locale>.llms.paragraph`, else the site `description`
- `Last reviewed: <date>` — from `siteMeta.<locale>.llms.reviewedAt` (omitted when unset)
- `Site: <site.url>`
- **Curated `## H2` sections** — visible pages grouped by each page's `seo.llmsSection` (per-locale, since every rendering doc is per-locale), ordered by `siteMeta.<locale>.llms.sectionOrder`; pages with no section fall under a default `## Pages` (kept last). Each bullet is `- [title](url): summary` — title = `seo.title` (else the page `id`); summary = `seo.llmsSummary`, else its `description` (flattened to one line). Editorial grouping is the file's only real edge over a sitemap, so it's editor-controlled in Sanity.
- **`## Blog`** — one bullet per published post, linking to its `/md` export. Omitted when the blog surface is off.
- **`## Categories` / `## Tags` / `## Authors`** — one line per taxonomy detail page, each gated by its `features.blogTaxonomy.*` flag.
- **`## Resources`** — external `http(s)` links from `siteMeta.<locale>.llms.resources`. Empty by default, so the section is omitted.

### `/llms-full.txt` — the full dump

Route: `src/app/[locale]/llms-full.txt/route.ts`. Sections joined with `---`: an optional site-level intro (`siteMeta.<locale>.llms.full`), then every visible page's Markdown (the same output `/llms/<id>` returns), then — when the blog is on — a `## Blog` directory of published posts, then the taxonomy sections with each doc's `llmsFull` body inlined. One fetch ingests the whole site.

### `/llms/<id>` — per-page Markdown

Route: `src/app/[locale]/llms/[id]/route.ts`. `<id>` is a page's `id` from the `pages` map (`home`, `blog`, …). The `.md` extension is dropped from the URL because Next.js dynamic segments can't carry a literal suffix; the `text/markdown` Content-Type makes the format explicit. Unknown `id`, a non-llms page, or an editor `noindex` → `404`.

## How pages become Markdown

`renderPageMarkdown()` in `src/lib/seo/page-markdown.ts` is **Sanity-only** — there is no auto-generation from `messages`. A page's Markdown is:

```text
# <seo.title>

URL: <site.url><localized pathname>

<seo.description>

<seo.llmsFull>          ← the editor-authored Markdown body
```

- **title / description** come from the page's `.seo` (resolved by `getPageSeo`; title falls back to the page `id`).
- **`llmsFull`** is an optional free Markdown field per page (Studio → the page's **SEO & visibilité** section). Empty → only the title + description are exposed for that page.

There is no fixed convention, no message-tree walk, and no auto FAQ block — the editor writes exactly what an assistant should read.

## Blog posts

Blog posts live in their own Sanity docs, so they're contributed separately — but surface in the index and full dump. `getBlogLlmsLines(locale)` (`@indiecrafts/modules-web-blog/lib/llms`, at `code/modules/web/blog/src/lib/llms.ts`) fetches every published post via `allPostsQuery` and returns a `## Blog` section, one bullet per post:

```text
## Blog

- [Post title](https://acme.com/blog/post-slug/md): The post's llms summary.
```

- **The line** uses the post's `metadata.llmsSummary` (Studio → post → **SEO & visibilité**), else its `metadata.description`; title = `metadata.title`, else the post title, else the slug. (GROQ re-projects the post's `seo.*` into this `metadata` shape, so the read path is unchanged.)
- **Each entry links to the post's `/md` export**, not the HTML page — the clean, text-only Markdown version an agent should ingest. The full body isn't inlined into `/llms-full.txt`; the `/md` link is the fetch target (see the [blog architecture](/modules/web/blog/blog-architecture)).
- **`allPostsQuery` filters `metadata.noIndex` and scopes by locale**, so hidden posts never appear and a French `/fr/llms.txt` lists French posts.
- **Gated by the public blog surface.** `getBlogLlmsLines` returns `[]` when `isBlogRouteEnabled(pages.blog)` is false (i.e. `features.blog` off or the blog page disabled), so the `## Blog` heading is never emitted empty.
- **Zero per-post config** — publish a post (with a slug, not `noIndex`) and it appears, exactly like adding a page.

## Taxonomy (categories / tags / authors)

`getTaxonomyLlmsLines(locale)` (same module) appends `## Categories`, `## Tags`, and `## Authors` sections — one line per detail page (`- [title](/blog/category/<slug>): summary`; authors at `/author/<slug>`). The summary is the doc's `seo.llmsSummary`, else its description.

- Gated per taxonomy by `features.blogTaxonomy.{categories,tags,authors}` (and the public blog surface); each doc's `noIndex` / unpublished status excludes it.
- On **`/llms-full.txt`** the call runs with `{ full: true }`, inlining each doc's `llmsFull` Markdown body under its line (empty → just the line).

## Which pages appear — `isLlmsPage`

`isLlmsPage(page)` in `src/lib/seo/page-markdown.ts` is the single source of truth shared by all three endpoints, so they can't drift:

```ts
export function isLlmsPage(page: PageConfig): boolean {
  return (
    !page.key.includes("[") && // real static route, not a dynamic pattern
    page.enabled !== false && // not disabled
    !page.seo?.noindex && // not config-level noindex
    page.seo?.llms !== false // hasn't opted out
  );
}
```

The routes additionally drop any page the editor set `noIndex` on in Sanity (the document's `seo.noIndex`). Two consequences:

- **`noindex` pages drop out automatically.** A page hidden from search engines — via config `seo.noindex` or the Sanity per-page toggle — is also hidden from the LLM endpoints. No extra flag.
- **`seo.llms: false` is the only manual opt-out.** Set it on a page's config when you want it indexed by search engines but _excluded_ from AI assistants. It defaults to `true`.

```ts
// code/packages/shared/config/src/index.ts — exclude one page from LLM endpoints only
somePage: {
  key: "/some-page",
  id: "somePage",
  slug: "/some-page",
  seo: { llms: false },
}
```

## Per-endpoint feature flags

Each endpoint is gated independently by `features.llms` in `code/packages/shared/config/src/index.ts`, so you can ship the lightweight index without the heavy full dump:

```ts
features.llms = {
  index: true, // /llms.txt
  full: true, // /llms-full.txt
  pages: true, // /llms/<id>
};
```

When a flag is off, its route returns `404` — checked at the top of each handler (e.g. `if (!features.llms.index) return new Response("Not found", { status: 404 });`).

## Discoverability

The site layout (`src/app/[locale]/layout.tsx`) emits a `<link rel="alternate">` in `<head>` pointing crawlers at the index — **gated on `features.llms.index`** (the route it points at 404s when the flag is off), and locale-aware via `localePrefix`:

```html
<link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />
<!-- non-default locale → href="/fr/llms.txt" -->
```

`robots.txt` also advertises the index when the site is indexable and `features.llms.index` is on — see [Robots & environments](/projects/web/website/seo/robots-and-environments).

## Caching

All three endpoints send `Cache-Control: public, max-age=3600, s-maxage=3600`. Because the locale lives in the URL (not a query string), CDNs key cleanly per locale.

::: tip Adding a page
Add a page to the `pages` map (`code/packages/shared/config/src/index.ts`) and it flows into all three endpoints, in every locale. For a custom title / description / `llmsFull`, wire its route to a Sanity document that carries a `.seo` (see [SEO metadata](/projects/web/website/seo/seo-metadata)); otherwise it appears with its default title.
:::
