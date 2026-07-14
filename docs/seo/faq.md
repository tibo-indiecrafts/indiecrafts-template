# FAQ

One FAQ array per page, written once in `messages`, feeds three surfaces at once: the on-page accordion, FAQPage rich-result JSON-LD, and the page's llms.txt output. There is no separate config, no schema to hand-write, and no duplication — the same translated Q&A drives all three. The whole system is gated by a single flag, `features.faq`.

## The one source

FAQ content lives in `messages.<locale>.pages.<id>.faq` — a translated array of `{ question, answer }` objects:

```jsonc
// messages/en.json
"pages": {
  "home": {
    "title": "…",
    "description": "…",
    "faq": [
      {
        "question": "Do I need to touch code to rebrand?",
        "answer": "No. Point the config at your brand — name, colors, logo, languages — and the whole site follows."
      },
      {
        "question": "Is it SEO-ready out of the box?",
        "answer": "Yes. Titles, canonical URLs, hreflang, Open Graph, and JSON-LD — including this FAQ's rich-result markup — are generated from your content."
      }
    ]
  }
}
```

Translate it like any other message — a parallel `faq` array under `pages.<id>` in each `messages/<locale>.json`. The heading, eyebrow, and subtitle above the accordion are separate top-level keys (shared across pages):

```jsonc
// messages/en.json — top level
"faq": {
  "eyebrow": "FAQ",
  "title": "Frequently asked questions",
  "subtitle": "Everything you need to know about the template. Can't find an answer? Reach out."
}
```

## The three consumers

All three read the exact same `messages.pages.<id>.faq` array via `getFaqItems` / `parseFaqItems` in `src/lib/faq.ts`. Edit the array once and everything below updates together.

### 1. The accordion (`<Faq>`)

`src/parts/sections/Faq.tsx` renders the two-column FAQ section. Mount it with a `pageId` and nothing else:

```tsx
import { Faq } from "@/parts/sections/Faq";

// inside the page body
<Faq pageId="home" />;
```

The component is fully self-gating — you can mount it unconditionally:

- returns `null` when `features.faq` is off, and
- returns `null` when the page has no `faq` items.

It reads the section chrome (`faq.eyebrow`, `faq.title`, `faq.subtitle`) and the Q&A array (`pages.<pageId>.faq`) straight from messages. No props for content.

### 2. FAQPage JSON-LD (rich result)

`<PageSchemas>` (`src/lib/seo/jsonld.tsx`) auto-appends FAQPage markup whenever the page has FAQ items and `features.faq` is on — no per-page config:

```tsx
// what PageSchemas does internally
const faqItems = features.faq ? getFaqItems(t.raw, page.id) : [];
const faqSchema = faqItems.length ? [buildFAQPageSchema(faqItems)] : [];
// rendered into the page's @graph alongside the WebPage schema
```

So mounting `<PageSchemas page={pages.home} locale={locale} />` (which every route already does for its WebPage schema) is all it takes — the FAQ rich result rides along. The rendered output:

```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do I need to touch code to rebrand?",
      "acceptedAnswer": { "@type": "Answer", "text": "No. Point the config…" }
    }
  ]
}
```

::: warning Don't double-emit
Because `<PageSchemas>` emits the FAQPage automatically from messages, do **not** also add a manual `buildFAQPageSchema(...)` to `pages.<id>.seo.structuredData` for the same page — you'd get two FAQPage blocks. Use the messages array (this page) for content-driven FAQs; reserve the manual factory for FAQs that aren't in the page's message tree.
:::

### 3. llms.txt output

`renderPageMarkdown` (`src/lib/seo/page-markdown.ts`) appends a `## FAQ` block to the page's Markdown for `/llms.txt`, `/llms-full.txt`, and `/llms/<id>` — again from the same array, again gated on `features.faq`:

```md
## FAQ

### Do I need to touch code to rebrand?

No. Point the config at your brand — name, colors, logo, languages — and the whole site follows.
```

## Adding a FAQ to a page

1. Add a `faq` array under that page's node in **every** `messages/<locale>.json`:
   ```jsonc
   "pages": { "pricing": { "faq": [ { "question": "…", "answer": "…" } ] } }
   ```
2. Mount the accordion where you want it shown:
   ```tsx
   <Faq pageId="pricing" />
   ```

That's the whole job. The FAQPage rich result and the llms.txt FAQ block appear on their own — no schema import, no structuredData entry, no extra flag. Skip step 2 if you only want the SEO/llms output without rendering the accordion (the JSON-LD and Markdown read the array directly).

## The feature flag

`features.faq` (`config/index.ts`) is the master switch:

```ts
features = {
  // …
  faq: true,
};
```

When `false`: the `<Faq>` accordion renders nothing, `<PageSchemas>` emits no FAQPage, and `renderPageMarkdown` drops the FAQ block — everywhere, at once. The Q&A stays in `messages` untouched; flipping the flag back on restores all three surfaces.

::: tip Highest-ROI rich result
For B2B and service sites, FAQPage is the highest-value structured-data win — Google can render the Q&A directly under your search result. Because it's wired from content you're already writing, adding one is nearly free. Validate the rendered markup with [Google's Rich Results Test](https://search.google.com/test/rich-results) before shipping.
:::

## See also

- `docs/seo/structured-data-cookbook.md` — the full JSON-LD system, including the manual `buildFAQPageSchema` factory
- `docs/seo/llms-endpoints.md` — the `/llms.txt` family that picks up the FAQ block
- `docs/seo/seo-metadata.md` — how the rest of a page's `<head>` is composed
