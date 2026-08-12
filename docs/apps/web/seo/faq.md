# FAQ

One FAQ array per page, written once in `messages`, feeds two surfaces at once: the on-page accordion and FAQPage rich-result JSON-LD. Same translated Q&A drives both — no separate config, no schema to hand-write, no duplication. The whole system is gated by a single flag, `features.faq`.

> The `/llms.txt` family is **not** a FAQ consumer. LLM bodies come from the Sanity `pageSeo.llmsFull` field, not the messages `faq` array — see [Editing SEO in Sanity](./editing-seo-in-sanity.md) and [LLM endpoints](./llms-endpoints.md).

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

## The two consumers

Both read the same `messages.pages.<id>.faq` array via `getFaqItems` / `parseFaqItems` in `src/lib/faq.ts` (both work on the client `useTranslations()` and server `getTranslations()` translators, via `t.raw`; malformed or absent → `[]`). Edit the array once and both update together.

### 1. The accordion (`<Faq>`)

`src/user-interface/homepage/sections/Faq.tsx` renders the two-column FAQ section. Mount it with a `pageId` and nothing else:

```tsx
import { Faq } from "@/user-interface/homepage/sections/Faq";

// inside the page body
<Faq pageId="home" />;
```

The component is fully self-gating — mount it unconditionally:

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
`<PageSchemas>` emits the FAQPage automatically from messages, so do **not** also add a manual `buildFAQPageSchema(...)` to that page's `seo.structuredData`, or the Sanity `pageSeo` structured-data entries — you'd get two FAQPage blocks. Use the messages array (this page) for content-driven FAQs; reserve the manual factory for FAQs that aren't in the page's message tree.
:::

## Adding a FAQ to a page

1. Add a `faq` array under that page's node in **every** `messages/<locale>.json`:
   ```jsonc
   "pages": { "pricing": { "faq": [ { "question": "…", "answer": "…" } ] } }
   ```
2. Mount the accordion where you want it shown:
   ```tsx
   <Faq pageId="pricing" />
   ```

That's the whole job. The FAQPage rich result appears on its own — no schema import, no `structuredData` entry, no extra flag. Skip step 2 if you only want the JSON-LD without rendering the accordion (`<PageSchemas>` reads the array directly).

## The feature flag

`features.faq` is the master switch:

```ts
features = {
  // …
  faq: true,
};
```

When `false`: the `<Faq>` accordion renders nothing and `<PageSchemas>` emits no FAQPage — both at once. The Q&A stays in `messages` untouched; flipping the flag back on restores both surfaces.

::: tip Highest-ROI rich result
For B2B and service sites, FAQPage is the highest-value structured-data win — Google can render the Q&A directly under your search result. Because it's wired from content you're already writing, adding one is nearly free. Validate the rendered markup with [Google's Rich Results Test](https://search.google.com/test/rich-results) before shipping.
:::

## See also

- [Structured-data cookbook](./structured-data-cookbook.md) — the full JSON-LD system, including the manual `buildFAQPageSchema` factory
- [SEO metadata](./seo-metadata.md) — how the rest of a page's `<head>` is composed
- [LLM endpoints](./llms-endpoints.md) — the `/llms.txt` family (now Sanity-`llmsFull`-driven)
