# LLM endpoints

Three plain-text endpoints expose the site's content to LLM crawlers and assistants, following the [llmstxt.org](https://llmstxt.org) convention. All three are **built from Sanity** — the per-locale `siteMeta.<locale>` singleton (site summary + resources, and each page's `pageSeo` title / description / **`llmsFull`** body). Edited in the Studio (SEO & métadonnées), per language — see [Editing SEO in Sanity](./editing-seo-in-sanity.md).

| Endpoint          | URL (default locale) | Content                                                      | Content-Type    |
| ----------------- | -------------------- | ------------------------------------------------------------ | --------------- |
| Index             | `/llms.txt`          | Site summary + one line per page + published blog posts      | `text/plain`    |
| Full dump         | `/llms-full.txt`     | Every page's Markdown, `---`-joined, + a blog post directory | `text/plain`    |
| Per-page Markdown | `/llms/<id>`         | One page rendered as Markdown                                | `text/markdown` |

Pages are built from Sanity (`siteMeta.<locale>.pageSeo`); blog posts come from Sanity too (see [Blog posts](#blog-posts)). Each post links to its existing `/md` export.

Every endpoint is locale-aware — the default locale serves the bare path, other locales are prefixed:

```
/llms.txt          /fr/llms.txt
/llms-full.txt     /fr/llms-full.txt
/llms/home         /fr/llms/home
```

## The three endpoints

### `/llms.txt` — the index

Route: `src/app/[locale]/llms.txt/route.ts`. A short, link-heavy summary:

- **H1** = `site.name`
- **blockquote** = `siteMeta.<locale>.llms.summary`, else the site `tagline`
- **paragraph** = `siteMeta.<locale>.llms.paragraph`, else the site `description`
- `Site: <site.url>`
- **`## Pages`** — one bullet per visible page: `- [title](url): summary`, from each page's `siteMeta.<locale>.pageSeo` entry (`llmsSummary`, else the SEO `description`).
- **`## Blog`** — one bullet per published post, linking to its `/md` export (see [Blog posts](#blog-posts) below). Omitted when the blog surface is off.
- **`## Resources`** — external links from `siteMeta.<locale>.llms.resources`. Empty by default, so the section is omitted.

### `/llms-full.txt` — the full dump

Route: `src/app/[locale]/llms-full.txt/route.ts`. An optional site-level intro (`siteMeta.<locale>.llms.full`) comes first, then every visible page's Markdown (the same output `/llms/<id>` returns), `---`-joined, so an LLM can ingest the whole site in one fetch. When the blog is on, a `## Blog` directory of published posts (each linking to its `/md` full-text export) is appended after the pages.

### `/llms/<id>` — per-page Markdown

Route: `src/app/[locale]/llms/[id]/route.ts`. `<id>` is a page's `id` from the `pages` map (`home`, `blog`, …). The `.md` extension is dropped from the URL because Next.js dynamic segments can't carry a literal suffix; the `text/markdown` Content-Type makes the format explicit.

## How pages become Markdown

`renderPageMarkdown()` in `src/lib/seo/page-markdown.ts` is **Sanity-only** — there is no auto-generation from `messages`. A page's Markdown is:

```
# <pageSeo.title>

URL: <site.url><localized pathname>

<pageSeo.description>

<pageSeo.llmsFull>          ← the editor-authored Markdown body
```

- **title / description** come from the page's `siteMeta.<locale>.pageSeo` entry.
- **`llmsFull`** is an optional free Markdown field per page (Studio → SEO par page → "Contenu complet pour les IA"). Empty → only the title + description are exposed for that page.

There is no fixed convention, no message-tree walk, and no auto FAQ block — the editor writes exactly what an assistant should read.

## Blog posts

Static pages come from `siteMeta.<locale>.pageSeo`; blog posts come from their own Sanity docs, so they're contributed separately — but they surface in the same two endpoints. `getBlogLlmsLines(locale)` (`src/features/blog/lib/llms.ts`) fetches every published post via `allPostsQuery` and returns a `## Blog` section, one bullet per post:

```
## Blog

- [Post title](https://acme.com/blog/post-slug/md): The post's llms summary.
```

- **The line** uses the post's `metadata.llmsSummary` (Studio → post → Métadonnées), else its meta `description`.
- **Each entry links to the post's `/md` export**, not the HTML page — that's the clean, text-only Markdown version an agent should ingest (see the [blog docs](../features/blog/blog-architecture.md)). The `/md` body is the post's `metadata.llmsFull` when set, else the serialized PortableText body. The full body isn't inlined into `/llms-full.txt`; the `/md` link is the fetch target.
- **`allPostsQuery` already filters `metadata.noIndex` and scopes by locale**, so hidden posts never appear and a French `/fr/llms.txt` lists French posts.
- **Gated by the public blog surface.** `getBlogLlmsLines` returns `[]` when `isBlogRouteEnabled(pages.blog)` is false (i.e. `features.blog` off or the blog page disabled), so the `## Blog` heading is never emitted empty and the llms routes stay blog-agnostic.
- **Zero per-post config** — publish a post (with a slug, not `noIndex`) and it appears, exactly like adding a page.

## Taxonomy (categories / tags / authors)

`getTaxonomyLlmsLines(locale)` (`src/features/blog/lib/llms.ts`) appends `## Categories`, `## Tags`, and `## Authors` sections — one line per detail page (`- [title](/blog/category/<slug>): summary`). The line's summary is the doc's `seo.llmsSummary`, else its description (category/tag `description` or author `bio`).

- Gated per taxonomy by `features.blogTaxonomy.{categories,tags,authors}` (and the public blog surface); each doc's `seo.noIndex` / `unpublished` excludes it.
- On **`/llms-full.txt`** the call runs with `{ full: true }`, inlining each doc's `seo.llmsFull` Markdown body under its line (empty → just the line).

## Which pages appear — `isLlmsPage`

`isLlmsPage(page)` in `src/lib/seo/page-markdown.ts` is the single source of truth shared by all three endpoints, so they can't drift. A page is included when it is:

```ts
export function isLlmsPage(page: PageConfig): boolean {
  return (
    !page.key.includes("[") && // real static route, not a dynamic pattern
    page.enabled !== false && // not disabled
    !page.seo?.noindex && // not noindex
    page.seo?.llms !== false // hasn't opted out
  );
}
```

Two important consequences:

- **`noindex` pages drop out automatically.** A page hidden from search engines is also hidden from LLM endpoints — no extra flag needed.
- **`seo.llms: false` is the only manual opt-out.** Set it on a page's config when you want it indexed by search engines but _excluded_ from AI assistants. It defaults to `true`.

```ts
// src/config/index.ts — exclude one page from LLM endpoints only
somePage: {
  key: "/some-page",
  id: "somePage",
  slug: "/some-page",
  seo: { llms: false },
}
```

## Per-endpoint feature flags

Each endpoint is gated independently by `features.llms` in `src/config/index.ts`, so you can ship the lightweight index without the heavy full dump:

```ts
features.llms = {
  index: true, // /llms.txt
  full: true, // /llms-full.txt
  pages: true, // /llms/<id>
};
```

When a flag is off, its route returns `404`. The gate is checked at the top of each handler, e.g. `if (!features.llms.index) return new Response("Not found", { status: 404 });`.

## Discoverability

The site layout (`src/app/[locale]/layout.tsx`) emits a `<link rel="alternate">` in `<head>` pointing crawlers at the index — **gated on `features.llms.index`** (the route it points at 404s when the flag is off), and locale-aware:

```html
<link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />
<!-- non-default locale → href="/fr/llms.txt" -->
```

`robots.txt` also advertises the index (as a comment) when the site is indexable and `features.llms.index` is on — see [Robots & environments](./robots-and-environments.md).

## Caching

All three endpoints send `Cache-Control: public, max-age=3600, s-maxage=3600`. Because the locale lives in the URL (not a query string), CDNs key cleanly per locale.

::: tip Adding a page
Add a page to the `pages` map (`src/config/index.ts`), then fill its `pageSeo` entry (title / description / optional `llmsFull`) in Sanity per locale — it flows into all three endpoints in every locale.
:::
