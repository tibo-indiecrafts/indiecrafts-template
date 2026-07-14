# LLM endpoints

Three plain-text endpoints expose the site's content to LLM crawlers and assistants, following the [llmstxt.org](https://llmstxt.org) convention. All three are **auto-built from `messages.<locale>.pages.*`** — the same translations that drive SEO titles, descriptions, and the UI. There is **zero per-page config**: register a page and it appears in every endpoint, in every locale.

| Endpoint          | URL (default locale) | Content                                         | Content-Type    |
| ----------------- | -------------------- | ----------------------------------------------- | --------------- |
| Index             | `/llms.txt`          | Site summary + one line per page (title + link) | `text/plain`    |
| Full dump         | `/llms-full.txt`     | Every page's Markdown concatenated with `---`   | `text/plain`    |
| Per-page Markdown | `/llms/<id>`         | One page rendered as Markdown                   | `text/markdown` |

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
- **blockquote** = `messages.site.tagline`
- **paragraph** = `messages.site.description`
- `Site: <site.url>`
- **`## Pages`** — one bullet per visible page: `- [title](url): description`, pulling `pages.<id>.title` + `pages.<id>.description` per locale.
- **`## Resources`** — optional external links from `llms.resources` in `src/config/index.ts` (GitHub, docs, status page). Empty by default, so the section is omitted.

### `/llms-full.txt` — the full dump

Route: `src/app/[locale]/llms-full.txt/route.ts`. Concatenates every visible page's Markdown (the same output `/llms/<id>` returns) with `---` separators, so an LLM can ingest the whole site in one fetch.

### `/llms/<id>` — per-page Markdown

Route: `src/app/[locale]/llms/[id]/route.ts`. `<id>` is a page's `id` from the `pages` map (`home`, `blog`, …). The `.md` extension is dropped from the URL because Next.js dynamic segments can't carry a literal suffix; the `text/markdown` Content-Type makes the format explicit.

## How pages become Markdown

`renderPageMarkdown()` in `src/lib/seo/page-markdown.ts` walks `messages.pages.<id>.*` and applies a fixed convention — no per-page authoring:

| Message shape  | Rendered as                         |
| -------------- | ----------------------------------- |
| `title`        | page H1                             |
| `description`  | leading paragraph                   |
| `blocks.<k>`   | `## <k>` section, recursed          |
| `items.<k>`    | `- **<k>**: <body>` bullets         |
| nested objects | recurse with a bumped heading level |
| other strings  | `**<key>**: <value>` bullet         |

The document also emits a `URL:` line (`site.url` + the localized pathname).

### The `## FAQ` block

When `features.faq` is on and a page has a translated `faq` array under `messages.pages.<id>.faq`, `renderPageMarkdown` appends a dedicated `## FAQ` section — each item rendered as `### question` followed by the answer. This is the **same** `faq` array the `<Faq>` section and the FAQPage JSON-LD consume, so the three stay in sync automatically. When `features.faq` is off, the block is dropped everywhere.

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
Add a page to the `pages` map (`src/config/index.ts`) plus its `messages.pages.<id>.*` keys and it flows into all three endpoints, in every locale, with no further work.
:::
