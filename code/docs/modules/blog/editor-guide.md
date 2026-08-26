# Editor guide

For content editors. Gets you from "I have access to the project" to "my post is live on the site."

Setting the project up for the first time? Read [`sanity-setup.md`](./sanity-setup.md) first — this guide assumes the project, dataset, tokens, and `features.blog` flag are already wired.

---

## 1. Sign in to the Studio

The Sanity Studio is embedded in the site at `/studio` — locally <http://localhost:3000/studio>, in production `https://<your-domain>/studio`.

First visit shows a login screen. Sign in with the provider (Google / GitHub / email) tied to your Sanity account; Sanity matches you against the project's member list. Never been invited? Ask the project owner to add you at <https://www.sanity.io/manage> → project → **Members** → **Invite**.

The Studio needs no API token — you authenticate with your own Sanity session cookie.

---

## 2. Tour the sidebar

The desk (`code/modules/web/blog/src/sanity/structure.ts`) groups everything under **Contenu** (the labels are French):

```text
Contenu
├─ Blog
│  ├─ Mise en page (singleton)   ← the one blog doc that governs /blog/[slug] chrome
│  ├─ Articles                   ← posts, split English / Français (+ Toutes les langues)
│  ├─ Auteurs                    ← writer profiles (+ social links), split by language
│  ├─ Catégories                 ← topic taxonomy, split by language
│  ├─ Tags                       ← finer labels, split by language
│  └─ Séries                     ← ordered multi-part collections, split by language
├─ Témoignages                   ← quote docs (data for the quote-list block), split by language
├─ Équipe                        ← person docs (data for the person-list block), split by language
├─ SEO & métadonnées             ← site-wide SEO singletons (core, not blog)
├─ Navigation
├─ Cookies & consentement
└─ Pages légales
```

**Singleton vs. list.** _Mise en page_ opens the **same one** `blog` document every time (id `blog`) — there's exactly one per dataset. _Articles_, _Auteurs_, etc. are lists you add to freely.

**Language splits.** Every content type (`post, author, category, tag, quote, person`) is localized. Each parent (e.g. _Articles_) opens **English** / **Français** leaves plus a flat **Toutes les langues**. Entering through a language leaf pre-fills the new document's `language` field, so you can't accidentally file a French post in the English feed. The `language` split is driven by `@sanity/document-internationalization`.

---

## 3. Write your first post

### 3.1 Create the document

Sidebar → **Blog → Articles → English → + Create**.

The post document has a hidden `language` field (set by the language leaf you entered through, read-only — the translation plugin owns it) and two field groups: **Contenu** and **Métadonnées**. Neither is marked default, so the built-in **All fields** tab is active on open and the whole document shows at once; **Contenu** / **Métadonnées** act as filter tabs.

### 3.2 Contenu fields

| Field                      | Notes                                                                                                                                                                                                                                                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Titre**                  | Display title. Required.                                                                                                                                                                                                                                                                                                                                      |
| **Extrait**                | Teaser on listing cards + top of the post. Falls back to the SEO **Description** (Métadonnées) when empty.                                                                                                                                                                                                                                                    |
| **Publié le**              | `datetime`. Blank = published now (uses the created date). **Set a future date to schedule** — the post stays out of every listing, feed, sitemap, and related grid until that date passes (its own URL still works, so you can share a preview link).                                                                                                        |
| **Auteur·rice·s**          | A list — add **one or several** authors (drag to reorder; the first leads on cards). Language-filtered picker: an EN post only lists EN authors. A co-written post shows on every author's page.                                                                                                                                                              |
| **Catégories**             | Reference array, language-filtered. A post can sit in several.                                                                                                                                                                                                                                                                                                |
| **Tags**                   | Reference array, language-filtered. Each tag gets `/blog/tag/<slug>`.                                                                                                                                                                                                                                                                                         |
| **Mis en avant**           | Boolean. When true the post is eligible for the featured hero grid on `/blog` (`featuredPostsQuery`).                                                                                                                                                                                                                                                         |
| **Priorité de classement** | A slider (0–10). Ranks the post **above the date order** in every listing — search, category, tag, author, related, RSS, and the `blog-post-list` module. `0` = ranked by date (the default); higher pins it toward the top. Distinct from **Mis en avant**: featured picks _which_ posts show in the hero block; priority sets _the order_ within a listing. |
| **Série**                  | Optional. Attach the post to a series (a multi-part guide). Create series under **Blog → Séries**. Empty = standalone post.                                                                                                                                                                                                                                   |
| **Ordre dans la série**    | The post's position in the series (1, 2, 3…). Shown only when a **Série** is set. Empty = ordered by date.                                                                                                                                                                                                                                                    |
| **Corps**                  | The rich-text body — see [§4](#4-the-body-editor).                                                                                                                                                                                                                                                                                                            |

### 3.3 Métadonnées fields

Per-post SEO + visibility overrides (the reusable `metadata` object):

| Field                                                  | Controls                                                                                                                              | Fallback                            |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **Titre**                                              | `<title>` of the post page. Warns over 60 chars.                                                                                      | Document title                      |
| **Description**                                        | `<meta description>` + OG description (**SEO only** — cards/post use **Extrait**). Warns over 160 chars.                              | Empty                               |
| **Slug**                                               | URL segment `/blog/<slug>`. Required — generate from the title, then edit if needed.                                                  | —                                   |
| **Image sociale**                                      | OG/Twitter card + listing cover + post hero. 1200×630 recommended. Hotspot + crop enabled.                                            | None (renders without a hero image) |
| **Vidéo à la une**                                     | YouTube / Vimeo / file URL. When set, the hero plays this and **Image sociale** becomes the poster. Paste the URL, not an embed code. | None (cover image used)             |
| **Masquer des moteurs de recherche** (`noIndex`)       | Adds `robots: noindex` **and** drops the post from RSS + sitemap.                                                                     | False                               |
| **Masquer des listings du site** (`hideFromDiscovery`) | Removes from listings, the explorer, and related posts — the direct URL still works.                                                  | False                               |
| **Dépublier** (`unpublished`)                          | Returns 404 everywhere (listings, sitemap, RSS, and its own URL). Still editable in the Studio.                                       | False                               |
| **Résumé pour les IA** (`llmsSummary`)                 | One-line summary for `/llms.txt`.                                                                                                     | SEO description                     |
| **Contenu complet pour les IA** (`llmsFull`)           | Markdown served at `/blog/<slug>/md`.                                                                                                 | The post body                       |

**Image hotspot.** After uploading, click the image, drag the round dot onto the subject, and crop if needed. The site renders it with `next/image`, serving correctly sized variants per viewport.

### 3.4 Publish

Bottom-right: **Publish** (or a dropdown when a draft is pending).

- **Publish** — saves and goes live. With `<SanityLive />` mounted, published pages revalidate live; the dev server hot-reloads instantly.
- **Save as draft** — persists in the dataset as a draft. The public site keeps serving the last published version; drafts show only in the Studio (and via draft preview — [§5](#5-draft-preview)).
- **Discard changes** — reverts to the last published state.

### 3.5 See it live

After **Publish**, open <http://localhost:3000/blog/your-slug> (default locale is served unprefixed; French is `/fr/blog/your-slug`). You'll see your title, cover, body, and the meta strip (author · date · category).

---

## 4. The body editor

The **Corps** field is Sanity Portable Text (`blockContent`). Hit the **+** at the start of an empty line to insert. Full reference: [`body-editor.md`](./body-editor.md).

- **Headings** H1–H6, plus **Citation** (blockquote) style
- **Lists** — Puces (bullet) and Numéros (numbered)
- **Marks** — Gras, Italique, Code, Souligné, Barré, and URL links
- **Inline image** — hotspot-enabled
- **Bloc de code** — syntax-highlighted code (set the language, e.g. `tsx`; optional filename). Colours adapt to light/dark automatically (Shiki)
- **Inline modules** — 9 blocks droppable anywhere in the flow: Encadré (callout), Cartes (card list), Galerie d'images, Personnes (person list), Statistiques (stat list), Étapes (step list), Citations (quote list), Accordéon, HTML personnalisé

The four page-chrome modules — Prose, Hero du blog, Contenu d'article, Articles — are **not** in the body picker. They live in the `blog` singleton's `Modules par article` (`postModules`) layout slot ([§6](#6-post-layout-the-singleton)).

Each inline module has a small form on insert (title, items, etc.) — no code.

---

## 5. Draft preview

Preview a saved draft **on the live site** before publishing.

1. Click **Save as draft** instead of Publish.
2. Enter draft mode by hitting the enable endpoint:

   ```text
   /api/draft-mode/enable?sanity-preview-secret=<SECRET>&sanity-preview-pathname=/blog/your-slug
   ```

   The endpoint is gated by `features.studio` and needs `SANITY_API_READ_TOKEN` set on the server. The `<SECRET>` is validated by next-sanity's draft-mode flow — ask your developer for the preview link, since this project doesn't ship a Studio "Preview" button.

3. You land on the post URL with **draft** content rendered.
4. Exit with `/api/draft-mode/disable` — it drops draft mode and redirects to the home page.

**Responses to expect:** `404` = `features.studio` is off; `503` = `SANITY_API_READ_TOKEN` isn't set (see [`sanity-tokens.md`](./sanity-tokens.md)).

---

## 6. Post layout (the singleton)

**Blog → Mise en page** opens the single `blog` document. Its **Modules par article** (`postModules`) composes the chrome wrapped around **every** `/blog/[slug]`: a Contenu d'article module renders the body, with Hero du blog / Articles around it. Leave the array empty and posts fall back to the built-in `DefaultPostLayout`.

The `/blog` frontpage composes the same way, from **Sections de l'accueil du blog** (`frontpageModules`) — see §6.2. Its major elements also toggle on and off — see §6.1.

### 6.1 Display settings (Affichage du blog)

The same **Blog → Mise en page** document holds an **Affichage du blog** group. Each toggle shows or hides a blog element without a code deploy. Every toggle is ON by default; an empty toggle also reads as shown (the legend says "Vide = affiché").

| Group                               | Toggle                            | Turning it off                                                                                             |
| ----------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Catégories, tags, auteur·rice·s** | Catégories                        | Hides category chips **and** the `/blog/category` pages (dropped from the sitemap + AI files).             |
|                                     | Tags                              | Hides tag chips **and** the `/blog/tag` pages.                                                             |
|                                     | Auteur·rice·s                     | Hides author bylines **and** the `/author` pages.                                                          |
|                                     | Barre de navigation par catégorie | Hides the category nav bar (top-level categories + sub-category dropdowns) under the header on blog pages. |
| **Page article**                    | Date de publication               | Hides the published date on a post.                                                                        |
|                                     | Temps de lecture                  | Hides the "N min" reading estimate.                                                                        |
|                                     | Sommaire                          | Hides the table of contents.                                                                               |
|                                     | À lire ensuite                    | Hides the related-posts grid.                                                                              |
|                                     | Barre de progression de lecture   | Hides the thin scroll-progress bar at the top of a post.                                                   |
| **Accueil du blog**                 | Grille « à la une »               | Swaps the featured mosaic for a simple grid.                                                               |
| **Cartes d'article**                | Extrait                           | Hides the teaser under each card title.                                                                    |

**Taxonomy toggles remove routes, not just chips.** Turning **Catégories** off returns 404 on every `/blog/category/...` URL and drops them from the sitemap and `/llms.txt`. It stays off until you turn it back on — no deploy either way. A toggle only appears when its capability is compiled in (`features.blogTaxonomy.*`); see [`blog-architecture.md`](./blog-architecture.md).

**Share buttons live in Site settings now.** The X / LinkedIn / Facebook / copy-link row (post footer **and** the site footer) is controlled site-wide in **Paramètres du site → Partage** — one master toggle plus a checkbox per network — not per the blog. Share is a shared setting, not blog chrome. See [editing-seo-in-sanity](../../apps/web/seo/editing-seo-in-sanity).

### 6.2 Blog homepage sections (Sections de l'accueil du blog)

The same **Blog → Mise en page** document also holds **Sections de l'accueil du blog** (`frontpageModules`) — an array just like **Modules par article**, but it composes **`/blog`** itself instead of a post. Stack any of the blocks below, in any order. **Leave it empty and `/blog` falls back to the built-in default layout** (hero mosaic → explore → newsletter signup).

| Block (Studio name)                                            | What it shows                                                                         | Auto or picks                                                                          |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Grande une** (`blog-hero`)                                   | One large lead post, full width.                                                      | Auto = the latest published post, or pin one specific article.                         |
| **Articles à la une** (`blog-featured`)                        | A lead card plus a grid of more posts.                                                | Auto = posts marked **Mis en avant**, or pin an ordered list.                          |
| **Articles** (`blog-post-list`) — this is the **Latest** block | A plain grid of posts, optionally filtered to one category.                           | Always auto.                                                                           |
| **Coup de projecteur catégorie** (`blog-category-spotlight`)   | A curated row from one category, with a "Tout voir" link.                             | Pick the category; optionally pin posts to lead — the category's latest fill the rest. |
| **Carrousel d'articles** (`blog-collection`)                   | A hand-picked, ordered carousel.                                                      | Always a pick — no auto source; choose one or more posts.                              |
| **Cartes de sujets** (`blog-topic-cards`)                      | One to three large clickable cards, each linking to a category or tag.                | Always a pick — choose the category/tag (plus an optional image) per card.             |
| **Articles tendance** (`blog-trending`)                        | The most-read posts, falling back to the most recent while no popularity data exists. | Auto = popularity (or recency) — or pin posts to lead.                                 |
| **Explorer** (`blog-explore`)                                  | Category chips, tag pills, or top authors — pick which with **Contenu affiché**.      | Always auto.                                                                           |

**Auto + pin.** Every block above except **Cartes de sujets** and **Explorer** shares one pattern: a **Nombre d'articles** (or **Limite**) field caps how many posts show, and an optional **Articles à mettre en avant en premier** (pinned) list lets you hand-pick posts that always appear first, in the order you set. The block's automatic rule (latest / featured / category / trending) fills any remaining slots up to that cap. **Carrousel d'articles** is the one exception — it has no automatic rule, so every post in it is a manual pick.

Every generic block (Infolettre, and the rest of the page-builder catalog) is also selectable here, alongside the blog-specific ones above — so a newsletter signup or a stat list can sit right in the middle of the frontpage.

### 6.3 Category navigation & sub-categories

The **Barre de navigation par catégorie** toggle (above) shows a horizontal bar of your **top-level** categories under the header on every blog page. To nest categories, open a category document and set its **Catégorie parente**:

- **Empty parent** → a top-level category (a link, or a dropdown if it has children).
- **A parent set** → a sub-category: it leaves the top bar and appears inside its parent's dropdown. The dropdown also gets an "All {parent}" link to the parent's own listing.

Rules: the parent must be in the **same language**; a category can't be its own parent; nesting is one level (a sub-category's children are not shown). The bar needs **Catégories** on, and each category page stays the existing `/blog/category/<slug>`.

The **post page sidebar** also carries a "More on {category}" block (the post's related articles) beneath the table of contents, and a "Written by" author card follows the article body — both follow the **Catégories** / **Auteur·rice·s** / **À lire ensuite** toggles.

---

## 7. Reuse content across posts (References)

Two top-level sections hold docs you pick from inside modules:

- **Témoignages** (quote docs) — author + role + body + portrait. Insert a Citations (quote list) module and pick existing testimonials; editing the doc updates every post that references it.
- **Équipe** (person docs) — used by the Personnes (person list) module, same pattern.

Create via **Témoignages** / **Équipe → + Create**. Both are language-split — create the doc in the locale you'll reference it from. _(These are promoted to first-class domains; a future release generalizes them to full `testimonial` / `team` entities.)_

---

## 8. Locales

The same template serves `/blog/<slug>` (default locale, unprefixed) and `/fr/blog/<slug>`. A post's plugin-managed `language` decides which locale routes it surfaces on — an EN post at `/blog/<slug>` returns 404 at `/fr/blog/<slug>`.

**Translating a post.** Use the **Translations** menu at the top of the editor to create the other-language version. The plugin makes a linked document and records the pair, so the two stay connected and the front-end language switcher jumps a reader to the translated slug (falling back to `/blog` when no translation exists). Title/body copy across as a starting point; the **slug starts empty** (`documentInternationalization: { exclude: true }`) so each locale gets its own URL. There's no machine translation — you write the copy.

Wrong-language post? There's no editable `Langue` field (hidden by the plugin) — create the correct-language version via **Translations**, then delete the wrong one.

---

## 9. Common gotchas

| Symptom                                                          | Cause                                                                                                     | Fix                                                                                                                         |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Post saved but missing from `/blog`                              | `metadata.noIndex`, `hideFromDiscovery`, or `unpublished` is on — or the language doesn't match the route | Untick the visibility flag; confirm the locale badge in **Translations** matches the URL                                    |
| Post saved but missing from listings, feed still shows old count | **Publié le** is a **future** date (scheduled)                                                            | Set **Publié le** to now (or past) to publish immediately; it appears automatically once the date passes                    |
| Post 404s at its own URL                                         | `metadata.unpublished` is on                                                                              | Untick **Dépublier**                                                                                                        |
| Cover image cropped oddly                                        | Hotspot is centered but the subject isn't                                                                 | Click the image → drag the round dot onto the subject                                                                       |
| Post renders without a hero image                                | `metadata.image` is empty                                                                                 | Set **Image sociale** on the Métadonnées tab                                                                                |
| "Reference broken" red box                                       | The quote/person doc was deleted or is the wrong language                                                 | Open the picker, swap to a valid same-language doc, publish                                                                 |
| Body picker shows fewer options than expected                    | You're in a post body — only the 9 inline modules appear                                                  | The chrome modules (Prose, Hero du blog, Contenu d'article, Articles) live in **Blog → Mise en page → Modules par article** |
| Draft preview returns 503                                        | `SANITY_API_READ_TOKEN` not set at server start                                                           | See [`sanity-tokens.md`](./sanity-tokens.md), restart dev                                                                   |

---

## 10. Where to go next

- Body editor reference → [`body-editor.md`](./body-editor.md)
- Image gallery module → [`gallery.md`](./gallery.md)
- Architecture (routes, queries, components) → [`blog-architecture.md`](./blog-architecture.md)
- Initial Sanity wiring + QA matrix → [`sanity-setup.md`](./sanity-setup.md)
- Tokens / CORS / roles → [`sanity-tokens.md`](./sanity-tokens.md)
