# Full-website template — Sanity structure, page builder & entities

_The complete content model to turn this template from "a blog + code-defined marketing
pages" into a **fully editor-driven website builder**: every page composed from reusable
blocks, every entity a proper document, all following Sanity content-modeling best
practices._

Sources: [Sanity Learn — Page building](https://www.sanity.io/learn/course/page-building) ·
[An introduction to page builders](https://www.sanity.io/learn/course/page-building/an-introduction-to-page-builders) ·
[Content modeling best practices](https://officialskills.sh/sanity-io/skills/content-modeling-best-practices) ·
[Localization](https://www.sanity.io/docs/studio/localization) ·
[document-internationalization — singletons](https://github.com/sanity-io/document-internationalization/blob/main/docs/01-singleton-documents.md) ·
[Roboto Studio — page-builder guide](https://robotostudio.com/blog/the-only-sanity-page-builder-guide-youll-ever-need).

> **Status:** proposal / architecture plan — nothing here is built yet. Reflects the repo
> as of this writing (blog + core singletons live; no `page` doc, no marketing entities).
> Read §8 for the gap list and §13 for the concrete first build. Promote to
> `docs/` once Pack 0 ships.

## Contents

- **§0** Governing principles (best practices) · **§1** What exists today
- **§2** Pages · **§3** Entities (content packs) · **§4** Reusable objects
- **§5** The page builder (blocks) · **§6** Renderers · **§7** Studio structure
- **§8** Gaps vs today · **§9** Phased packs · **§10** Reserved-module alignment
- **§11** Page templates (3 meanings) · **§12** Platform layer (what makes it great)
- **§13** Recommended build order + Pack 0 concrete spec

---

## 0. The governing principles (Sanity best practices, applied)

1. **Model by meaning, not by layout.** Entities (`project`, `service`, `testimonial`)
   are documents that describe _what a thing is_. Pages _compose_ them. Never a
   page-shaped schema where "the testimonials on the homepage" is a field — that traps
   content and breaks reuse across channels.
2. **Objects vs references — the core decision.**
   - **Inline object** = presentational, single-use, trapped in its page, cheapest to
     query. → page-builder _section blocks_ (`hero`, `cta-banner`, `media-text`).
   - **Reference** = shared entity, reused across pages, resolved in GROQ. → _reference
     blocks_ (`featured-projects` → `project` docs).
   - Rule of thumb: **if two pages could show it, it's a document.**
3. **Document-level i18n** via `@sanity/document-internationalization` (already used by
   `post`): every translatable doc carries a `language` field + translation references;
   reference selectors filter by language. Config singletons stay field-level (per-locale
   `localeString`, as `siteMeta` already does).
4. **Reuse the object library everywhere** — `metadata` (slug/excerpt/social),
   `seoMeta`, `link`, `cta`, `blockContent`. Don't re-invent per doc.
5. **Singletons** = fixed document IDs + Structure links + create/delete disabled
   (`siteSettings`, `siteMeta`, `navigation`, `cookieConsent` already do this; add
   `homePage`).
6. **Decouple schema from render.** Schemas own the refs; renderers
   (`@indiecrafts/ui-components`) take **resolved** data and stay pure. The composable
   `BLOCK_RENDERERS` registry already models this — each page type spreads the base +
   its own blocks.
7. **Validation is content quality** — required `title`/`slug`, **image `alt` required**
   (a11y), max lengths on SEO fields, `datetime` on events, unique slug per locale.
8. **Visual editing** — mount Sanity **Presentation** (click-to-edit overlays) on the new
   page routes; draft-mode plumbing already exists.

---

## 1. What exists today (the honest baseline)

**Core (app, feature-independent) — `code/apps/web/src/sanity/schema`**

- Singletons: `siteSettings` (brand · analytics · verification), `siteMeta` (per-locale
  SEO defaults + `pageSeo[pageId]` map), `navigation` (header/footer menus),
  `cookieConsent`. Multi-doc: `legalPage` (5 legal pages).
- Objects: `pageSeo`, `globalSchema`, `navItem`, `localeString`, `cookieCategory`,
  `cookieEntry`.

**Blog module — `code/modules/blog/src/sanity/schema`**

- Documents: `post` (i18n via `language`), `author`, `category`, `tag`, `person`,
  `quote`, `blog` (index config).
- Objects: `blockContent`, `metadata`, `seoMeta`, `link`, `cta`.
- **Page-builder blocks (object types)** — 10 generic + 3 blog-specific:
  `accordion-list · callout · card-list · custom-html · gallery · person-list · prose ·
quote-list · stat-list · step-list` + `blog-index · blog-post-list · blog-post-content`.
- Renderers: the 10 generic live in `@indiecrafts/ui-components`; the 3 blog ones in the
  module. Composed via `{ ...BLOCK_RENDERERS, ...blog }`.

**The critical gap:** the page-builder **mechanism exists but is only mounted inside blog
post bodies** (+ the homepage `BlocksShowcase` demo). Marketing pages are **code routes +
`messages/<locale>.json` copy**, not Sanity documents. There is **no `page` document**,
**no catch-all page route**, and **no marketing entities** (project/service/testimonial/…).

---

## 2. Pages — the routable surface of a full site

| Page                                            | Backed by                                    | Route                           | Status                   |
| ----------------------------------------------- | -------------------------------------------- | ------------------------------- | ------------------------ |
| **Home**                                        | `homePage` **singleton** (`sections[]`)      | `/`                             | ✳ new (today: code)      |
| **Generic marketing page**                      | `page` doc (`sections[]` + slug)             | `/[[...slug]]` catch-all        | ✳ **the core new piece** |
| About / Contact / Landing / Legal-marketing     | `page` docs                                  | `/about`, `/contact`, …         | ✳ via `page`             |
| **Blog** index + post + author + category + tag | `blog`, `post`, `author`, `category`, `tag`  | `/blog/**`                      | ✓ exists                 |
| **Work** index + case study                     | `project`                                    | `/work`, `/work/[slug]`         | ✳ new                    |
| **Services** index + detail                     | `service`                                    | `/services`, `/services/[slug]` | ✳ new                    |
| **Products** index + detail                     | `product` (+ `productCategory`)              | `/products/**`                  | ✳ new (shop module)      |
| **Events** index + detail                       | `event`                                      | `/events`, `/events/[slug]`     | ✳ new                    |
| **Locations** index + detail                    | `location`                                   | `/locations/**`                 | ✳ new                    |
| **Team / People**                               | `person` (team)                              | `/team` (or a `page`)           | ✳ new                    |
| **Pricing**                                     | `page` + `pricing-table` block → `plan` docs | `/pricing`                      | ✳ new (today: code)      |
| **FAQ / Help center**                           | `faq` docs (+ `article` for KB)              | `/faq`, `/help/**`              | ✳ new (today: messages)  |
| **Directory**                                   | `listing` docs + `taxonomy`                  | `/directory/**`                 | ✳ new                    |
| Legal (5)                                       | `legalPage`                                  | `/mentions-legales`, …          | ✓ exists                 |
| System (404, maintenance, studio)               | code                                         | —                               | ✓ exists                 |

**Routing rule:** the catch-all `/[[...slug]]` resolves a `page` by localized slug;
reserved first-segments (`blog`, `work`, `services`, `studio`, `api`, …) are excluded so
entity routes win. Slugs unique per locale; a reserved-slug guard in validation.

---

## 3. Entities (documents) — the content packs

Grouped by domain. Each doc carries `language` (i18n) + reusable `metadata` + `seoMeta`
unless noted. ✓ exists · ✳ new · ↑ extend existing.

### Editorial (exists)

| Doc                                 | Fields (core)                                                             | Notes                                               |
| ----------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------- |
| `post` ✓                            | title · excerpt · author→ · categories[]→ · tags[]→ · body(PT) · metadata | i18n                                                |
| `author` ✓ / `category` ✓ / `tag` ✓ | name/title · slug · image · bio                                           | taxonomy shared below                               |
| `person` ✓↑                         | name · role · bio · image · social[]                                      | **extend → team member** (department, order)        |
| `quote` ✓↑                          | content · author · role · image                                           | **generalize → `testimonial`** (+ rating, company→) |

### People & social proof (new)

| Doc                                | Fields                                               | Powers                               |
| ---------------------------------- | ---------------------------------------------------- | ------------------------------------ |
| `testimonial` ✳ (from `quote`)     | quote · author · role · `company`→ · rating · avatar | testimonial blocks, JSON-LD Review   |
| `client` / `partner` ✳             | name · logo(mono+color) · url · tier                 | logo-wall, directory, `company` refs |
| `caseStudy` ✳ (or reuse `project`) | client→ · challenge · solution · results[] · gallery | proof + portfolio                    |

### Portfolio & offerings (new)

| Doc                | Fields                                                                                | Route                     |
| ------------------ | ------------------------------------------------------------------------------------- | ------------------------- |
| `project` ✳        | title · client→ · services[]→ · summary · body(PT) · gallery · results(stat[]) · date | `/work/[slug]`            |
| `service` ✳        | title · icon · summary · body(PT) · price→ · faqs[]→ · relatedProjects[]→             | `/services/[slug]`        |
| `plan` (pricing) ✳ | name · price · interval · features(`feature`[]) · cta · highlighted                   | pricing-table block       |
| `product` ✳        | title · price · variants[] · gallery · category→ · specs                              | shop module (`/products`) |

### Knowledge, help & FAQ (new)

| Doc              | Fields                                           | Powers                                                                 |
| ---------------- | ------------------------------------------------ | ---------------------------------------------------------------------- |
| `faq` ✳          | question · answer(PT) · category→ · order        | faq blocks + **`FAQPage` JSON-LD** (already have `buildFAQPageSchema`) |
| `article` (KB) ✳ | title · body(PT) · category→ · relatedArticles[] | `/help/**` search + list                                               |

### Place & time (new)

| Doc                     | Fields                                                                   | Powers                                                               |
| ----------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `location` ✳            | name · `address`(obj) · `geopoint` · `openingHours`(obj) · phone · email | `/locations/**`, map block, `LocalBusiness` JSON-LD                  |
| `event` ✳               | title · start/end(datetime) · location→ · cta · body(PT) · ics           | `/events/[slug]`, `Event` JSON-LD                                    |
| `listing` (directory) ✳ | name · taxonomy[]→ · url · logo · description                            | `/directory/**` (third-party entries — distinct from own `location`) |

### Forms (**the biggest omission — flagged in the old draft**)

| Doc                | Fields                                                                                                       | Notes                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `form` ✳           | title · fields(`formField`[]) · submitLabel · successMessage · notifyEmail · action(native/Resend/Formspree) | referenced by the `form` block                                                                                       |
| `formSubmission` ✳ | form→ · values(obj) · createdAt · meta                                                                       | **or** POST to an external provider; native needs an API route + spam guard (honeypot/turnstile) + `logger` + notify |

### Company / global (new)

| Doc                         | Fields                                                       | Notes                                         |
| --------------------------- | ------------------------------------------------------------ | --------------------------------------------- |
| `companyInfo` ✳ (singleton) | mission · foundedYear · stats[] · timeline[] · socialLinks[] | feeds About + footer + `Organization` JSON-LD |

### Taxonomy (generalize)

`category` ✓↑ (add optional `parent`→ for hierarchy) + `tag` ✓ become **shared taxonomy**
usable by `project`/`service`/`product`/`faq`/`listing` — or per-domain taxonomies where
vocabularies must not mix. Best practice: **hierarchical categories, flat tags.**

---

## 4. Reusable objects

**Exist:** `metadata`, `seoMeta`, `link`, `cta`, `blockContent`, `module.image`,
`navItem`, `localeString`.

**Add:**
| Object | For |
| --- | --- |
| `address` · `geopoint` · `openingHours` | `location` |
| `formField` (text/email/tel/textarea/select/checkbox/radio/consent + label/required/placeholder) | `form` |
| `feature` (label · included · note) | `plan`, `service` |
| `stat` (value · label) | results, stats-band (today inline in `stat-list`) |
| `logoItem` (image · url · alt) | logo-wall |
| `mediaBlock` (image \| video-embed \| iframe, validated hosts) | hero, media-text, `embed` block |
| `seo` | already `seoMeta` — keep one canonical SEO object, don't fork |

---

## 5. The page builder — `page.sections[]` + block registry

**`page` / `homePage` doc** = `title` + `metadata` + `seoMeta` + **`sections[]`** (the
builder array). Studio uses **array groups** (Intro · Content · Social proof · Convert) +
**preview thumbnails** per block to keep insertion low-friction (Roboto Studio pattern).

Extend the composable registry: `PAGE_RENDERERS = { ...BLOCK_RENDERERS, ...sectionBlocks,
...referenceBlocks }`, dispatched by a new `<PageSections>` (mirrors the blog's
`ModuleRenderer`).

### 5a. Section blocks (inline objects) — new

| Block `_type`                                                                                           | Fields                                              | Renderer (new)                    |
| ------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | --------------------------------- |
| `module.hero` ✳                                                                                         | eyebrow · headline · sub · media · ctas[] · variant | `Hero` — **the #1 missing block** |
| `module.feature-grid` ✳                                                                                 | title · items(icon·title·body) · columns            | `FeatureGrid`                     |
| `module.media-text` ✳                                                                                   | media · body(PT) · side(left/right) · cta           | `MediaText`                       |
| `module.cta-banner` ✳                                                                                   | headline · body · ctas[] · variant                  | `CtaBanner`                       |
| `module.logo-wall` ✳                                                                                    | title · logos(`logoItem`[]) **or** clients[]→       | `LogoWall`                        |
| `module.pricing-table` ✳                                                                                | title · plans[]→ · interval-toggle                  | `PricingTable`                    |
| `module.newsletter` ✳                                                                                   | title · body · form→                                | `Newsletter`                      |
| `module.form` ✳                                                                                         | form→ · layout                                      | `FormBlock`                       |
| `module.embed` ✳                                                                                        | url(validated) · caption                            | `Embed` (reuse `parseVideoEmbed`) |
| `module.banner` ✳                                                                                       | text · cta · dismissible                            | `AnnouncementBanner`              |
| `module.divider` / `module.spacer` ✳                                                                    | size                                                | trivial                           |
| _exist_: `callout · card-list · gallery · prose · stat-list · step-list · accordion-list · custom-html` |                                                     | ✓ reuse as-is                     |

### 5b. Reference blocks (reference entity docs) — new

| Block `_type`                | References                          | Renderer (new)                                   |
| ---------------------------- | ----------------------------------- | ------------------------------------------------ |
| `module.featured-projects` ✳ | `project`[] (or auto by `featured`) | `ProjectList`                                    |
| `module.service-grid` ✳      | `service`[]                         | `ServiceGrid`                                    |
| `module.testimonial-list` ✳  | `testimonial`[]                     | `TestimonialList` (today `quote-list` is inline) |
| `module.team` ✳              | `person`[]                          | `Team` (today `person-list` is inline)           |
| `module.faq` ✳               | `faq`[]                             | `FaqList` (+ FAQPage JSON-LD)                    |
| `module.event-list` ✳        | `event`[] (upcoming)                | `EventList`                                      |
| `module.location-list` ✳     | `location`[]                        | `LocationList` / map                             |
| `module.product-list` ✳      | `product`[]                         | `ProductList`                                    |
| _exist_: `blog-post-list`    | `post`[]                            | ✓ blog module                                    |

> **Naming:** keep the `module.*` prefix (renaming to `block.*` is a breaking migration
> for zero gain). Inline vs reference blocks share the registry; only their schema differs
> (object fields vs `reference` arrays).

---

## 6. UI-components (renderers) roll-up

- **Dispatcher:** `<PageSections>` (new, in `@indiecrafts/ui-components` or app) over
  `PAGE_RENDERERS`.
- **New generic renderers** (in `@indiecrafts/ui-components`): `Hero`, `FeatureGrid`,
  `MediaText`, `CtaBanner`, `LogoWall`, `PricingTable`, `Newsletter`, `FormBlock`,
  `Embed`, `AnnouncementBanner`, `Divider/Spacer`, plus reference-block renderers
  `ProjectList`, `ServiceGrid`, `TestimonialList`, `Team`, `FaqList`, `EventList`,
  `LocationList`, `ProductList`.
- **Entity page templates** (per routable doc): `ProjectDetail`, `ServiceDetail`,
  `EventDetail`, `LocationDetail`, `ProductDetail` + their index/list sections.
- **Reuse:** every one takes resolved data, uses `@indiecrafts/ui` primitives +
  `ui-tokens`, and renders Sanity images via the CDN loader (`sanity-images` rule) → same
  look in blog + pages automatically.

---

## 7. Studio structure (desk organization)

Group by domain; singletons pinned; entity lists filtered by `language`.

```
⚙︎ Site        → Site settings · SEO defaults · Navigation · Cookies · Home page · Company
▤ Pages        → page[]           (the builder)
✍ Blog         → Posts · Authors · Categories · Tags
💼 Work         → Projects
🛠 Services      → Services · Plans
🛍 Shop          → Products · Product categories
★ Social proof → Testimonials · Clients / Partners
👥 People        → Team
❓ FAQ / Help    → FAQ · KB articles
📅 Events        → Events
📍 Locations     → Locations · Directory listings
✉︎ Forms         → Forms · Submissions
§ Legal         → Legal pages
🏷 Taxonomy      → Categories · Tags
```

Each new pack registers its schema + a structure section (extend
`@indiecrafts/sanity/structure` builders) in `sanity.config.ts`.

---

## 8. Gaps vs today — the punch list

1. **No `page` / `homePage` document + no page-builder route.** ← unblocks everything.
2. **No `hero` block** (and no `feature-grid`, `media-text`, `cta-banner`, `logo-wall`,
   `pricing-table`) — the marketing staples.
3. **No forms** — `form` + `formField` + submission/API. Biggest content omission.
4. **Marketing entities absent** — project, service, testimonial(doc), faq(doc),
   plan, event, location, product, client, listing.
5. **No reference blocks** — the registry supports them; none authored.
6. **FAQ + pricing live in code/messages**, not Sanity — move to `faq`/`plan` docs.
7. **`quote`/`person` are half-entities** — generalize to `testimonial`/team.
8. **No shared taxonomy** beyond blog; no hierarchical category.
9. **No Presentation/visual-editing** on marketing pages.

---

## 9. Phased packs (each = docs + objects + blocks + renderers + route + structure + docs + changelog)

- **Pack 0 — Page builder foundation** _(unblocks the site)_: `page` + `homePage` docs,
  `/[[...slug]]` catch-all, `<PageSections>`, blocks `hero · feature-grid · media-text ·
cta-banner`, Presentation tool. Migrate the current homepage sections → blocks.
- **Pack 1 — Social proof & people**: `testimonial` (from `quote`), `client`, `person`→team;
  blocks `testimonial-list · logo-wall · team`.
- **Pack 2 — Portfolio & services**: `project`, `service`; routes + `featured-projects ·
service-grid` blocks.
- **Pack 3 — FAQ & pricing → Sanity**: `faq`, `plan`; `faq` + `pricing-table` blocks; wire
  FAQPage JSON-LD.
- **Pack 4 — Forms**: `form`, `formField`, `formSubmission` + submit API + spam guard +
  `form`/`newsletter` blocks.
- **Pack 5 — Events, locations, directory**: `event`, `location`, `listing` + blocks +
  `Event`/`LocalBusiness` JSON-LD.
- **Pack 6 — Catalog & KB** _(heavier modules)_: `product` (+ variants) `shop`, `article`
  help-center.

Each pack follows the existing extraction checklists (`code/modules/CLAUDE.md`,
`code/packages/CLAUDE.md`): schema + registry + types + renderer + query + docs page +
sidebar line + changelog — and lands behind a feature flag.

---

## 10. Reserved-module alignment

The packs map onto the already-reserved module names
(`code/modules/_registry.md`: shop · events · community · learning · booking · jobs ·
newsletter · support · crm). Pack 0–1 stay in the **core** (page builder + generic
entities belong to every site); shop/events/etc. graduate to their own gated modules when
they earn a vertical slice.

---

## 11. Page templates — three distinct meanings, don't conflate them

"Template" means three different things; a great builder does all three.

### 11a. Initial-value templates (editor presets) — **mechanism already exists**

`sanity.config.ts` already wires `templates: () => localeTemplates` + per-locale
`S.initialValueTemplateItem(...)` in structure. **Extend it to `page`:** ship a preset per
**page kind** that pre-fills `sections[]` so an editor starts from a real layout, not a
blank array:

| Preset (per locale) | Pre-filled `sections[]`                                                                 |
| ------------------- | --------------------------------------------------------------------------------------- |
| **Landing**         | `hero · logo-wall · feature-grid · testimonial-list · pricing-table · faq · cta-banner` |
| **Service**         | `hero · media-text · feature-grid · testimonial-list · faq · cta-banner`                |
| **About**           | `hero · media-text · stats-band · team · logo-wall · cta-banner`                        |
| **Contact**         | `hero(short) · form · location-list`                                                    |
| **Blank**           | `[]`                                                                                    |

Wire each as an initial-value template → they appear in the Structure **"＋ Create"**
menu. This is the highest-leverage "template" feature and reuses plumbing that's already
there.

### 11b. Layout templates (render variants) — a `template` field on `page`

`page.template: "default" | "full-width" | "sidebar" | "landing"` selects the **wrapping
layout** in `<PageSections>` / the route (container width, whether a sidebar/TOC renders,
header/footer variant). Keep it a small closed list — one field, no dev per new page.

### 11c. Entity templates (code render templates) — per routable doc

`project`/`service`/`event`/`location`/`product` each get a **dedicated detail template**
(`ProjectDetail`, …) — these are code, not an editor choice: the doc's shape _is_ the
template, optionally with a `sections[]` builder appended for a free-form tail.

> **Section presets** (drop a saved group of blocks) have no native Sanity primitive;
> approximate with 11a page presets. Only reach for a plugin if editors ask for it.

---

## 12. The platform layer — what's missing to build something _great_

The entity/block model (§1–11) is the _content_. Greatness is the **DX + delivery layer**
around it. Ranked by leverage:

1. **Sanity Typegen** _(biggest DX gap)_. Types are **hand-written** today
   (`BlockModule` union, `ImageRef`, …) — fine for one blog, unscalable across a dozen
   packs. Add `sanity schema extract` + `sanity typegen generate` → generated types from
   schema + typed GROQ. Kills the "add a block → edit 8 places" drift at the type layer.
2. **Section-level design controls** — a shared **`sectionOptions`** object on _every_
   block (`background: default|muted|inverted|brand` · `paddingY: sm|md|lg` · `width:
contained|wide|full` · `anchor`). Editors control rhythm + emphasis without a dev.
   **Expose semantic token roles only, never raw hex** — enforced by
   `design-token-usage.md`. This is what makes a page builder feel _designed_, not just
   stacked.
3. **Presentation / Visual Editing** — `stega.studioUrl` is already set, but there's **no
   `presentationTool`** in `sanity.config`. Add it → click-to-edit overlays on the new
   page routes. Draft-mode + `sanityFetchLive` already carry the data side.
4. **Content-driven revalidation strategy.** Today: `sanityFetchLive` (SSE live) opts a
   page into **dynamic** rendering. For static marketing pages that's wasteful — add a
   **Sanity webhook → `revalidateTag`** (tag fetches by doc type/id) so edits go live on
   static pages with no redeploy. Decide per-route: static+tag-revalidate (marketing) vs
   live-dynamic (dashboards). Document the trade.
5. **Sitemap · robots · llms from Sanity.** `app/sitemap.ts` + the llms endpoints are
   driven by the **code `pages` map** — new `page`/entity docs won't appear. Make the
   sitemap union code-routes **+ published Sanity docs** (per locale, `noIndex`-aware).
6. **Editor-managed redirects** — a `redirect` doc (`from · to · permanent`) →
   `next.config` `redirects()` or middleware. Clients rename slugs; without this every
   rename is a 404 + lost SEO.
7. **Slug/pathname discipline** — auto-slug from title, **unique per locale**,
   reserved-word guard (`blog`, `studio`, `api`), and a computed `pathname` for nested
   pages so routing + sitemap agree. One `metadata.slug` helper, used by every doc.
8. **Validation + a11y baked in** — required `title`/`slug`, **image `alt` required**
   (already the image rule), SEO length hints, `datetime` on events, and **reference
   integrity**: `weak` refs where deletion should be allowed, block-delete-when-in-use
   where not.
9. **Seed / demo content per pack** — the blog seed script exists; every new pack ships
   demo docs so `pnpm seed` yields a fully-populated site to design against (and so
   previews aren't empty).
10. **Publishing workflow** — scheduled publishing plugin, custom document actions
    (duplicate, "open on site"), and roles for client vs agency. Optional but expected on
    "great".
11. **Site-wide search** — Pagefind (static, zero-infra) indexes the built pages +
    entities; or Sanity-backed search for large catalogs.
12. **Tests** — schema smoke tests + GROQ snapshot tests. CodeGraph flags **no covering
    tests** on the Sanity layer today; a few golden-query tests catch fragment drift when
    packs land.

**The short answer:** to go from _"a page builder"_ to _"something great"_ →
**Typegen (1) + section design controls (2) + Presentation (3) + a revalidation +
sitemap story (4–5)**. Those four turn the content model into a fast, editor-driven,
click-to-edit site that stays type-safe as it grows. Everything else (6–12) is polish that
compounds.

---

## 13. Recommended build order + Pack 0 concrete spec

### Order

Pack 0 first (it unblocks everything), then the two "great" foundations that pay off across
every later pack, then content packs by client demand:

```
Pack 0  page builder foundation          ← do this first
  └─ then  §12.1 Typegen  +  §12.2 sectionOptions   (before more blocks land)
  └─ then  §12.3 Presentation             (once a page route renders)
Pack 1  social proof & people
Pack 2  portfolio & services
Pack 3  FAQ & pricing → Sanity
Pack 4  forms
Pack 5  events · locations · directory
Pack 6  catalog & KB
```

### Pack 0 — exact deliverables

**Schema (core, `code/apps/web/src/sanity/schema/`)**

- `documents/page.ts` — `page` doc: `language` · `title` · `metadata` (slug/excerpt/social)
  · `seoMeta` · `template` (default|full-width|sidebar|landing) · `sectionOptions`-aware
  `sections[]`.
- `singletons/home-page.ts` — `homePage` singleton (same `sections[]`, fixed id, no
  create/delete).
- `objects/section-options.ts` — the shared `sectionOptions` (background · paddingY ·
  width · anchor); **semantic tokens only**.
- New block objects in `code/modules/blog/src/sanity/schema/modules/` **→ move to a shared
  home** (they're no longer blog-only): `hero.ts` · `feature-grid.ts` · `media-text.ts` ·
  `cta-banner.ts`. Register in the module index + the composable r/uiegistry.
- Wire a **`page` initial-value template** per preset (§11a) into `sanity.config` +
  structure "＋ Create".

**Types + renderers (`code/packages/ui-components/src/`)**

- `types.ts` — add the 4 block types to the `BlockModule` union.
- `renderers/` — `Hero`, `FeatureGrid`, `MediaText`, `CtaBanner`; register in
  `BLOCK_RENDERERS`.
- `renderers/PageSections.tsx` — the dispatcher (mirrors the blog `ModuleRenderer`):
  `{ ...BLOCK_RENDERERS, ...referenceBlocks }`, wraps each block in the `sectionOptions`
  shell.

**Query + route (`code/apps/web/src/`)**

- `sanity/queries` — `pageBySlugQuery` (resolve `sections[]` + refs), `homePageQuery`,
  `allPageSlugsQuery` (for `generateStaticParams` + sitemap).
- `app/[locale]/[[...slug]]/page.tsx` — catch-all: resolve `page` by localized slug,
  `notFound()` on miss, reserved-segment guard (`blog`/`studio`/`api`/…), `<PageSections>`,
  `buildMetadata` from `seoMeta` with fallback to `siteMeta`.
- Rebuild the **home route** to render `homePage.sections` (migrate the current code
  sections — Features/Pricing/Testimonials/Cta — into blocks).

**Delivery**

- `app/sitemap.ts` — union code routes **+ published `page`/`homePage` slugs** (per locale,
  `noIndex`-aware).
- Mount **`presentationTool`** in `sanity.config` (stega already set).

**Docs + logs (in lockstep, per the repo rules)**

- `docs/apps/web/config/page-builder.md` (+ sidebar line) — how to build a page, the block
  catalogue, presets, `sectionOptions`.
- New rule `method/apps/web/rules/page-builder.md` — "marketing pages are `page` docs, not
  code; a new section = block + renderer + registry + query + preset".
- Changelogs: app (route + home migration), packages (new renderers), module (schemas).

**Verify**

- `pnpm build` green; `/[[...slug]]` + home prerender per locale; a demo `page` with
  `hero + feature-grid + testimonial-list` looks pixel-identical to the same blocks in a
  blog body (Chrome, light/dark, 375/768/1280); Presentation click-to-edit works in draft
  mode.

> When Pack 0 ships, **promote this file** to `docs/apps/web/config/page-builder.md` (canon)
> and delete `temp-sanity.md` — drafts live at root only until they stick.
