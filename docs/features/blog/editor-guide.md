# Editor guide

For content editors. Get from "I have an account on the project" to "my post is live on the site".

If you're a developer setting up the project for the first time, read [`sanity-setup.md`](./sanity-setup.md) first — this guide assumes the project, dataset, and feature flag are already wired.

---

## 1. Sign in to the Studio

The Sanity Studio lives inside the site itself at `/studio`. Append it to the domain — locally, that's <http://localhost:3000/studio>, on production it's `https://<your-domain>/studio`.

The first time you visit you'll see a login screen. Click **Continue with Google / GitHub / Email** — Sanity matches your login against the project members list. If you've never been invited, ask whoever owns the project to add you at <https://www.sanity.io/manage> → your project → **Members** → **Invite**.

Once you're in, the Studio loads with the sidebar visible.

---

## 2. Tour the sidebar

```
Content
├─ Blog
│  ├─ Layout              ← the singleton that governs /blog/[slug] chrome
│  ├─ Posts               ← every article (split EN / FR)
│  ├─ Authors             ← writer profiles
│  └─ Categories          ← topic taxonomy (split EN / FR)
└─ References
   ├─ Quotes              ← reusable testimonials (split EN / FR)
   └─ People              ← reusable team-member docs (used by the Team module)
```

**Singleton vs. document list:** the _Layout_ entry under Blog opens **the same one document** every time — there's only ever one `blog` singleton per dataset. _Posts_, _Authors_, _Categories_, etc. are lists where you can create as many as you like.

**Language splits:** _Posts_, _Categories_, _Tags_, and _Quotes_ each have two child entries — `EN` and `FR`. Clicking `EN` pre-fills the `language` field on any new document you create, so you can't accidentally publish a French post into the English feed. The flat _Toutes les langues_ entry below is for power users editing across locales.

---

## 3. Write your first post

### 3.1 Create the document

In the sidebar, **Blog → Posts → EN → "+ Create"** (the green button at the top of the list).

You land on an empty post form with two top-level tabs:

- **Contenu** — title, body, author, categories, tags, featured flag
- **Metadata** — per-post SEO override (slug, OG image, noIndex…)

### 3.2 Fill the basic fields (Contenu tab)

| Field                   | Notes                                                                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Titre**               | Internal/display title. Required.                                                                                                                                   |
| **Langue**              | Pre-filled to `en` because you came in through the EN list.                                                                                                         |
| **Auteur**              | Reference picker. Click "Add" → select from existing authors, or create a new one inline. The locale filter is bypassed here — authors are shared across languages. |
| **Catégories**          | Reference picker, language-filtered (you'll only see EN categories from an EN post). One post can sit in multiple categories.                                       |
| **Tags**                | Same shape as categories, language-filtered.                                                                                                                        |
| **Featured**            | Boolean. When true, the post is eligible for the BlogHero card-grid on `/blog`.                                                                                     |
| **Corps de l'article**  | The body editor. See **§4 The body editor** below.                                                                                                                  |
| **Date de publication** | Defaults to "now" if you leave it blank when you publish.                                                                                                           |

### 3.3 Set the metadata (Metadata tab)

The **Metadata** tab holds per-post overrides for SEO and routing.

| Field                | What it controls                                                                                                   | Falls back to                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| **Titre** (metadata) | `<title>` of the post page                                                                                         | Document title                                                    |
| **Description**      | `<meta description>` + OG description                                                                              | Empty                                                             |
| **Image**            | OG card image + cover image at the top of the post                                                                 | None (page renders without a hero image)                          |
| **Slug**             | The URL segment (`/blog/<slug>`)                                                                                   | Required — generate one from the title with the "Generate" button |
| **No index**         | When true, the post is excluded from sitemap, `/blog` listing, and serves `<meta name="robots" content="noindex">` | False                                                             |

The cover image uses Sanity's **hotspot + crop** — once uploaded, click into the image, drag the round dot to mark the "important" part, and crop manually if needed. The site renders the asset with `next/image`, so it'll automatically serve correctly sized variants per viewport.

### 3.4 Publish

Bottom-right corner: a **Publish** button (or **Publish** dropdown if there's an active draft).

- **Publish** — saves + makes the post live immediately. On a static build, the page refreshes within ~30 seconds via the Next.js ISR + Sanity Live integration; locally, the dev server hot-reloads instantly.
- **Save as draft** — your changes persist in the dataset, marked as draft. The public site still serves the previous published version. Drafts are visible only inside the Studio (and via the [draft preview workflow](#5-draft-preview-workflow)).
- **Discard changes** — reverts the form to the last published state.

### 3.5 See your post on the live site

After **Publish**, go to <http://localhost:3000/en/blog/your-slug> (dev) or `https://<your-domain>/en/blog/your-slug` (prod). The post should appear with the title you set, the cover image, your body content, and the meta strip showing author + date + read time + category.

---

## 4. The body editor

The body field is a rich-text canvas backed by [Sanity Portable Text](https://www.sanity.io/docs/presenting-block-content). Hit the **+** button at the start of any empty line to see what you can insert. Full reference: [`body-editor.md`](./body-editor.md).

Quick summary of what's available:

- **Headings** — H1 through H6 (use H2 for major sections, H3 for sub-sections; the TOC sidebar on the live site auto-collects H2/H3/H4)
- **Lists** — bulleted (Puces) and numbered (Numéros)
- **Inline marks** — bold, italic, code (monospace pill), underline, strike-through, links
- **Blockquote** — large editorial pull quote
- **Inline image** — drop directly into the body, rendered as a 16:9 rounded image with alt text
- **Inline modules** — 8 fancy blocks you can drop anywhere in the flow:
  - Accordion (FAQ)
  - Callout (info / warning / success / danger)
  - Cards (3-column hairline grid)
  - Custom HTML (escape hatch)
  - People (team grid)
  - Stats
  - Steps (numbered timeline)
  - Quotes (testimonials)
  - Search

Each module has its own simple form when you insert it (title, intro, items array, etc.) — none require code.

---

## 5. Draft preview workflow

The Studio always shows you what's about to publish. To preview a draft **on the live site** before publishing:

1. In the post, click **Save as draft** instead of Publish.
2. Build your preview URL:

   ```
   http://localhost:3000/api/draft-mode/enable?sanity-preview-secret=<TOKEN>&sanity-preview-pathname=/en/blog/your-slug
   ```

   Replace `<TOKEN>` with the `SANITY_API_READ_TOKEN` your developer configured in `.env.local`. (Production typically wires this as a Studio toolbar action — ask your developer if you don't see a "Preview" button.)

3. You land on the post URL with **draft content** rendered. A small banner at the bottom of the page indicates draft mode is on.
4. When you're done previewing, visit `/api/draft-mode/disable` to drop back to published content.

If draft preview returns a 503, the `SANITY_API_READ_TOKEN` isn't set — see [`sanity-tokens.md`](./sanity-tokens.md).

---

## 6. Reuse content across posts (References)

The sidebar's **References** group holds documents you can pick from inside modules:

- **Quotes** — testimonial content (author + role + body + portrait). When you insert a `Citations` (Quote list) module into a post body, you pick existing quote docs to display. Editing the quote doc updates every post that references it.
- **People** — team-member profiles (name + role + bio + portrait). Used by the `Personnes` (Person list) module — same pattern.

To create a new quote or person: **References → Quotes / Personnes → "+ Create"**. Once published, the document appears in the picker the next time you insert a Quote List or Person List module.

---

## 7. Locale ergonomics

The same template serves both `/en/blog/<slug>` and `/fr/blog/<slug>`. The `language` field on each post / category / quote determines which locale's routes it surfaces on.

- An EN post lives at `/en/blog/<slug>`; visiting `/fr/blog/<slug>` returns 404 (even with the same slug)
- The Studio's sidebar pre-filters by language when you enter via the EN or FR branch, so you can't accidentally cross-publish

There's no automatic translation. To publish an article in both languages, create **two separate posts** with the same title (translated) and the same shape — typically you'll use the same slug structure (`/en/...` vs `/fr/...`).

If you accidentally created a post under the wrong language: open it, change the `Langue` field, **Publish**. The post will disappear from the wrong locale and reappear under the right one.

---

## 8. Common gotchas

| Symptom                                         | Cause                                                                                                                                                               | Fix                                                         |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Post saved but not appearing at `/en/blog`      | `metadata.noIndex` is on, OR `language` doesn't match the route                                                                                                     | Untick `No index`; check the `Langue` field matches the URL |
| Cover image looks cropped weird                 | Hotspot is centred (default) but the image's subject isn't                                                                                                          | Click the image → drag the round dot over the subject       |
| Body content renders without the hero image     | `metadata.image` is empty (only the post-level image renders, not the document-level)                                                                               | Set the image in the **Metadata** tab                       |
| "Reference broken" red box appears              | The quote/person doc you referenced was deleted or has the wrong language                                                                                           | Open the picker, swap to a valid doc, publish               |
| Module picker shows fewer options than expected | You're inside a post body — only the 8 inline-embeddable types appear. The other 6 (Layout, Blog hero, etc.) live inside the `blog` singleton's `postModules` array | Open Studio → Blog → Layout to access them                  |

---

## 9. Where to go next

- Body editor reference: [`body-editor.md`](./body-editor.md)
- Architecture (routes, queries, components): [`blog-architecture.md`](./blog-architecture.md)
- Initial Sanity wiring + QA matrix: [`sanity-setup.md`](./sanity-setup.md)
- Token / CORS / role reference: [`sanity-tokens.md`](./sanity-tokens.md)
