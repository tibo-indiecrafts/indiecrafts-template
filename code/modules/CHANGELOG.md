# Changelog — modules (`@indiecrafts/*` product slices)

One record for the product modules under `code/modules/`. Every change that adds, extracts,
or reshapes a module's public surface or wiring lands here in plain language with the _why_.
Rolls up to the [root `CHANGELOG.md`](../../CHANGELOG.md) at release.

**Not here:** app behavior/routes/tokens → [`code/projects/web/CHANGELOG.md`](../projects/web/surfaces/website/CHANGELOG.md);
shared bricks → [`code/packages/CHANGELOG.md`](../packages/CHANGELOG.md); docs-site →
[`docs/CHANGELOG.md`](../docs/CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com). Categories: **Added ·
Changed · Deprecated · Removed · Fixed**.

## [Unreleased]

### Added

- **`lib/pin-order.ts` in the blog module** — `reorderByIds` + `mergePinnedWithFallback` extract the
  pin/reorder/merge/dedupe/cap logic that was inlined and copy-pasted across four frontpage renderers
  (`BlogTrending`, `BlogFeatured`, `BlogCollection`, `BlogCategorySpotlight`). Behaviour-preserving; now
  unit-tested (11 cases) — the logic was previously untested because it lived inside async Server Components.

- **blog — composable `/blog` frontpage.** A new `frontpageModules[]` array on the `blog` singleton
  composes the frontpage the same way `postModules[]` composes a post; empty falls back to the code
  default (`DefaultBlogFrontpage` — the former fixed hero-mosaic → explore → newsletter chain),
  selected via `pickFrontpage`. Seven new blog-specific blocks are frontpage-capable — `blog-hero`
  (one lead post, latest or pinned), `blog-featured` (lead + grid, flagged or pinned),
  `blog-category-spotlight` (a curated category row), `blog-collection` (a pinned-only carousel),
  `blog-topic-cards` (1-3 clickable category/tag cards), `blog-trending` (popularity, falling back
  to most-recent), and `blog-explore` (the existing categories/tags/authors sections behind a
  variant picker) — plus the existing `blog-post-list` doubling as the frontpage's "Latest" block.
  Every dynamic block shares one **auto + pin** shape: pinned posts take precedence in editor order,
  the block's rule (latest / flag / category / popularity) fills the rest up to a shared
  `count`/`limit` cap. `lib/popularity.ts` (`getPopularPostIds`) is the Trending popularity seam —
  returns `[]` today (no read-count source), so it falls back to most-recent (`@debt MIGRATION` for
  the future read-count pipeline). **Why:** the frontpage was a fixed layout; editors can now compose
  it from the same block catalog as a post, without a deploy.
- **blog — share is no longer blog-owned (removed `display.post.share`).** The per-post share row is
  gated by the app's shared `siteSettings.share` setting, injected into `DefaultPostLayout` as a
  `share` prop; the blog no longer carries a share display toggle. Share copy now reads the shared
  `common.share.*` namespace (was `pages.blog.share`), so a host app must provide `common.share.*`.
  **Why:** share is a cross-cutting site setting, not blog chrome.
- **blog — top category navigation with sub-category dropdowns.** A category `parent`
  reference (self-referential) turns any category into a sub-category. A `getCategoryNav(locale)`
  server helper (`lib/category-nav.ts`, gated by the new `blog.display.categoryNav` toggle) fetches
  them via `categoryNavQuery` and returns the ui-components `CategoryNav` under the header on every
  blog page — top-level categories, each with children opening a dropdown — via `DefaultLayout`'s
  new `subnav` slot.
- **blog — end-of-article author bio + sidebar "More on {topic}".** The post layout now composes
  the ui-components `AuthorBio` ("Written by" card, after the body) and `MoreOnTopic` (a compact
  "More on {category}" related-links block under the TOC in the sidebar).
- **contact — a new `@indiecrafts/contact` module (contact form).** Submit engine (`submit()`) that
  validates and writes a `contactMessage` doc, then fires two best-effort emails: a "we got your
  message" acknowledgement to the sender and an owner alert that carries the message body with
  `reply-to` set to the sender. Two public surfaces reuse one `ContactForm` — the `module.contact`
  page-builder block and a full `/contact` page (copy + SEO from the `contactSettings` singleton).
  Studio gets a **Contact** section: the settings singleton + a read-only message inbox. Emails are
  configured on the shared `emailStrings` singleton (`contactConfirm` + `contactOwner`). _Why:_ the
  template had newsletter/waitlist capture blocks but no way for a visitor to send a message and get
  an acknowledgement. Modeled on `@indiecrafts/waitlist`.

### Fixed

- **blog — series "Part N of M" rendered a raw translation key.** `DefaultPostLayout` passed
  `t("series.partOf")` — next-intl formats the message and errors on the missing `{n}`/`{total}`
  params, printing the key. `SeriesNav` interpolates those itself, so it now receives the raw
  template via `t.raw("series.partOf")`.

### Changed

- **newsletter — the confirm email links to the localized confirm page.** `sendConfirmEmail` now
  builds `${site.url}${localizedPathname("/newsletter/confirm", locale)}?token=…` (was the
  un-localized `/api/newsletter/confirm` GET). _Why:_ the confirm mutation moved to a `POST` behind a
  human click (see the app log) to stop mail-scanner auto-confirm.

- **blog · newsletter · waitlist — email templates now live in the module (`src/emails/`).** Each
  module's transactional-email `render…Email` template + test moved out of `@indiecrafts/email`'s
  shared `templates/` into its own `src/emails/` (blog: `comment-notification`; newsletter:
  `newsletter-confirm`/`newsletter-notification`/`lead-magnet`; waitlist: `waitlist-confirm`/
  `waitlist-notification`), importing `renderEmailLayout`/`escapeHtml`/`RenderedEmail` from the brick.
  Each module now owns its email end-to-end — the Sanity group (`emailGroups`), the template, and the
  send — and narrows `getEmailStrings()` to its own group with the exported config shapes. _Why:_ stop
  the shared email brick from growing with every feature; a module's email is a module concern.

### Added

- **newsletter · waitlist · blog — write-path unit tests.** New/extended colocated tests cover the
  previously-untested engines: `subscribe` + `confirmSubscriber` (newsletter had **zero** tests),
  `join` (waitlist), `createComment` threading + post-existence (blog), plus `portableTextToMarkdown`
  and `resolveBlogDisplay`. _Why:_ the security-critical write paths (field whitelisting, `_type`
  pinning, consent stamping, dedupe, opt-in) shipped with no coverage.

- **blog — page-builder extracted to `@indiecrafts/page-builder`.** The blog held the generic
  page-builder (16 blocks + `blockContent`/`link`/`cta` + `quote`/`person`) even though the app's
  marketing pages used it. Moved all of it to the new `@indiecrafts/page-builder` package; the blog now
  owns only its docs (`post`/`author`/`category`/`tag`/`series`/`comment` + `metadata`) and its **3**
  blog-specific blocks (`blog-index`, `blog-post-*`), and imports `MODULES_FRAGMENT` + `defineModule`
  from the package (composing its own `blog-post-list` projection on top). Desk sections Témoignages
  (`quote`) + Équipe (`person`) moved to the page-builder desk. _Why:_ decouple site-wide page-building
  from the blog feature — a marketing/admin app can now build pages without pulling in the blog.
- **Lead magnet — capture block + gated delivery (newsletter + blog).** A new `module.lead-magnet`
  page-builder block (schema in blog, renderer in `@indiecrafts/ui-components`, inline-embeddable)
  captures an e-mail against a referenced `leadMagnet` document, then — after double opt-in — e-mails
  a signed, expiring download link. **One subscriber list:** a magnet lead is a normal `subscriber`
  tagged `source: "lead-magnet"` + the magnet id in `tags` (no second list). New `leadMagnet` document
  (title · file · enabled) + a desk section in the newsletter module; `lib/deliver-magnet.ts` signs the
  link (`@indiecrafts/gated-delivery`) and delivers on confirm (`confirm.ts`), best-effort. _Why:_
  inbound lead-gen that reuses the existing capture + opt-in + subscriber list, not a parallel system.
- **blog — post `priority` ranking (slider).** A new **Priorité de classement** field on `post` (a
  native `<input type="range">` slider, 0–10) ranks a post **above the date order** in every public
  listing. All 9 listing queries (all-posts · featured · related · search · category · tag · author ·
  RSS · the `blog-post-list` module) now sort by a shared `ORDER_BY_PRIORITY`
  (`coalesce(priority, 0) desc, coalesce(publishedAt, _createdAt) desc`); `0`/unset falls through to
  pure date order, so existing content is unaffected. Series listings keep their own `seriesOrder`
  sort. The slider is the **only custom Studio input** in the repo — kept dependency-free on purpose
  (`sanity/components/PrioritySlider.tsx`, no `@sanity/ui`/Radix). `priority` is read straight by
  `order()` (not projected), so types/renderers/typegen are untouched. Distinct from `featured`
  (which _picks_ the hero posts); priority sets _the order_. Editor doc:
  [`docs/modules/blog/editor-guide.md`](../docs/modules/blog/editor-guide.md).
- **blog · newsletter · waitlist — each module now owns its E-mails groups.** The transactional-email
  config that used to live in `@indiecrafts/email` moved **into the modules** (`src/sanity/email.ts`,
  exported as `emailGroups` on each `SanityModule` barrel): blog → `commentNotification`; newsletter →
  `newsletterConfirm` + `newsletterOwner`; waitlist → `waitlistConfirm` + `waitlistOwner`. Built with
  the shared `confirmationGroup`/`ownerAlertGroup` factories, so the brick stays generic and a module's
  email appears in Studio only when the module is composed in. **Per-email BCC:** the confirmation
  engines (`newsletter`/`waitlist`) now pass `bcc: clean(cfg?.bcc)` to `sendEmail`, so an admin can BCC
  themselves on user-facing confirmations. See [`docs/packages/email.md`](../docs/packages/email.md).
- **`@indiecrafts/waitlist` — early-access signups (collect + export).** A new module modeled on the
  newsletter, with **two public surfaces** (same `WaitlistForm`): a full **`/waitlist` landing page**
  (the view — `src/user-interface/WaitlistLanding.tsx` — lives in the module; the app route is a thin
  shell) **and** a public **`module.waitlist`** page-builder block (schema in the blog, `Waitlist`/
  `WaitlistForm` renderer in `@indiecrafts/ui-components`, 3 variants + an optional name field). Both
  POST the thin `/api/waitlist` route → the `join()` engine → a `waitlistEntry` doc (deduped,
  whitelisted). **All copy is Sanity-only** (form on `waitlistSettings`, page SEO on `siteMeta.pageSeo`).
  **No runtime gating** — collect + export only. Unlike `subscriber`, the entry doc is
  **editor-creatable** (the "Liste d'attente" desk's "Tous·tes" list carries **+ Create**, so an admin
  adds rows by hand; status sub-lists En attente / Invité·e·s). Optional best-effort emails via
  `@indiecrafts/email` (a translated "you're on the list" confirmation + an owner alert, on the shared
  E-mails entity). Gated by **`features.waitlist`**; `waitlistSanity` activates with one line in
  `composeSanity`. Export: `pnpm waitlist:export` → CSV. Seed ships settings + 2 demo entries. Doc:
  [`docs/modules/waitlist/`](../docs/modules/waitlist).
- **One-click comment moderation from the email.** The comment-alert email now carries **Approuver ·
  Spam · Supprimer** buttons (toggle `commentNotification.moderationButtons` on the E-mails entity,
  default on). **Prefetch-safe:** a button opens a branded **confirm page** (`GET
/api/comments/moderate`) and the mutation only happens on that page's **POST**, so a link-scanner
  can't auto-moderate. Each comment carries a single-use `moderationToken` (`lib/moderate.ts` —
  approve → `approved:true`, spam → `spam:true`, delete → removes the doc; token cleared after).
  Desk: "En attente" now excludes spam (`approved != true && spam != true`) + a new **Spam** list, so
  the Spam action actually clears the queue. Export comments with `pnpm comments:export` → CSV. Guide:
  [`docs/modules/blog/comments.md`](../docs/modules/blog/comments.md).
- **Newsletter — double opt-in + owner alert, and providers simplified away.** New subscribers can
  now get a **double opt-in confirmation** (a one-time `confirmToken` on the `subscriber`; the
  confirm link `/api/newsletter/confirm?token=…` flips `pending → confirmed` and clears the token,
  single-use — `lib/confirm.ts`), and the owner an **new-subscriber alert**. Both are best-effort
  (never fail a signup), via `@indiecrafts/email`, configured on the shared **E-mails** entity —
  the confirmation copy is **translated per language** (seeded EN + FR). **Removed the provider
  machinery** (`destination`/`provider` config + the buttondown/mailchimp/resend adapters +
  `getProvider` + the block's `listId`): the engine now **always stores** the subscriber in Sanity.
  To use an external ESP, drop its own embed form in a `custom-html` block (posts to the provider
  directly, nothing stored our side; add the host to `EMBED_HOSTS` in `next.config.ts`). Export the
  list with `pnpm export:web:website:subscribers` → CSV. Doc: [`docs/modules/newsletter/`](../docs/modules/newsletter).
- **Comment email notifications (Resend).** A best-effort email fires when a comment is submitted
  (`createComment` → `notifyNewComment`), so the owner is alerted to moderate instead of polling the
  desk. Configured on the shared **E-mails** entity (Studio → E-mails → `commentNotification`): an
  `enabled` toggle + **To / CC / BCC** as multi-email arrays (each `Rule.email()`-validated, tag
  input) + `from` (a Resend-verified domain) + `replyTo` (empty = the commenter) + a
  `{{author}}`/`{{post}}` subject. The only secret is `RESEND_API_KEY` (env, server-only). The blog
  reads the entity in `lib/notify-comment.ts`; the layout + sender live in **`@indiecrafts/email`**
  (`renderCommentNotificationEmail` → `sendEmail`). Never throws — a mail failure can't turn a saved
  comment into a `500`; honeypot spam drops before the write, so only real comments notify. Guide:
  [`docs/modules/blog/comments.md`](../docs/modules/blog/comments.md).
- **`@indiecrafts/newsletter` — the newsletter feature extracted to a module.** The subscribe
  engine (`lib/newsletter.ts`), the `subscriber` doc, and a new editable
  **`newsletterSettings`** singleton moved into `code/modules/newsletter/`, shipped as the
  `newsletterSanity` **`SanityModule`** barrel — activate with one line in `composeSanity([...])`
  - `features.newsletter`. The public form stays a page-builder block (schema in the blog,
    renderer in `@indiecrafts/ui-components`); the thin `/api/newsletter` route now calls the
    module's engine. Doc: [`docs/modules/newsletter/`](../docs/modules/newsletter).
- **`module.newsletter` page-builder block (`@indiecrafts/blog`).** New `defineModule` schema
  (`sanity/schema/modules/newsletter.ts`, "Infolettre") — per-instance, per-locale copy (heading,
  body, placeholder, button, consent, success/already/error) + a `variant` (card/inline/banner).
  No refs, no image, so it passes straight through `MODULES_FRAGMENT`.
  Registered in `moduleSchemas` + `MODULE_TYPES` + the `INLINE_MODULES` inline allowlist (10 of 14
  now). The renderer + backend live in `@indiecrafts/ui-components` + the app — this is the schema
  half only.

### Changed

- **Studio desk: `quote`/`person` promoted to top-level domains.** The reference docs moved out of the
  nested **Références** list into two first-class top-level sections — **Témoignages** (`quote`, ★) +
  **Équipe** (`person`, 👥) — via `blogStructure` (`composeSanity` already flattens each
  owner's items, so no resolver change). Doc titles renamed (Citation → Témoignage, Personne → Membre
  d'équipe); doc **types**, fields, i18n templates, and the `quote-list` / `person-list` blocks are
  unchanged. The full generalization to `testimonial` / `team` entities (rating, company, department,
  order + a `/team` route + a shared/core home) is a future release.

### Added

- **Blog code blocks — Shiki syntax highlighting.** A new `codeBlock` body object (`language` /
  optional `filename` / `code`) renders through a server-side, async `CodeBlock`
  (`@indiecrafts/ui-components`, new `shiki ^3` dep) with a light+dark theme pair; the dark colours
  swap under `[data-theme="dark"]` via `.shiki` rules in `@indiecrafts/ui-tokens/globals.css`. An
  unsupported language degrades to a plain `<pre>`. Registered in the shared
  `portable-text-components` map, so app pages and blog posts highlight identically. Seed adds a
  demo block. _(Renderer + dependency live in `code/packages/ui-components`; logged here to keep the
  blog sprint together.)_
- **Blog series / collections.** A new `series` document (localized like the taxonomies) + a
  `post.series` reference and `post.seriesOrder` number group posts into an ordered multi-part
  guide. Each post shows a "Part N of M" `SeriesNav` (ordered sibling list, current marked), and
  every series gets a paginated `/blog/series/<slug>` landing (posts in `seriesOrder`, then date),
  with a `BreadcrumbList` + sitemap entries. Gated by a new **`features.blogSeries`** flag
  (`isSeriesEnabled`, requires `blog`). Studio: a **Séries** desk section + EN/FR create templates.
  Seed ships a demo "Ship your first MVP" 3-part series (EN + FR).
- **Blog post extras — share, reading progress, author socials.** A share row (X / LinkedIn /
  Facebook + copy-link) and a scroll `ReadingProgress` bar on each post, each gated by a new
  `blog.display.post.{share,readingProgress}` editor toggle (default on). Authors gain an optional
  `social[]` (`{ platform, url }` — X / LinkedIn / GitHub / Instagram / Mastodon / website) shown as
  icon links on `/author/[slug]`. Brand glyphs are inlined in `shared/components/BrandIcons.tsx`
  (lucide removed brand logos).
- **Blog search.** A `/blog/search?q=` route + a no-JS GET search box (on the search page and the
  frontpage). `searchPostsQuery` runs GROQ `match` over title / excerpt / SEO description / body
  text, sharing the public listing filter (noindex / unpublished / scheduled). Results are
  `noindex`, capped at 30 (no pagination — `match` is prefix-only, swap to Algolia/Orama at scale).
  Gated by a new **`features.blogSearch`** flag (`isSearchEnabled`, requires `blog`).
- **Blog `BreadcrumbList` JSON-LD + real `dateModified`.** The post route now emits a
  `BreadcrumbList` (Blog → category → post; the category crumb drops when categories are toggled
  off, so the schema never links a 404'd route) alongside its `Article`, and the category / tag /
  author detail routes emit one too (via the shared `buildBreadcrumbSchema`). `Article.dateModified`
  now reads the projected `_updatedAt` (`post.updatedAt`) instead of falling back to
  `datePublished` — a genuine freshness signal for search. Visual `<Breadcrumbs>` + the JSON-LD are
  built separately (trail in the body, machine trail in the head).
- **Blog scheduled publishing.** Every public listing/discovery query now filters
  `coalesce(publishedAt, _createdAt) <= now()`, so setting a **future** `publishedAt` keeps a
  post out of listings, feeds, related, sitemap, and llms until its date passes. The direct URL
  stays resolvable (shareable preview) — a hard 404-until-date would break draft preview.
- **Blog listing pagination.** The category / tag / author detail routes page their post lists
  at `POSTS_PER_PAGE = 12` (`lib/pagination.ts`) via `?page=N`: a `[$start...$end]` slice + a
  matching `count(...)` query, rendered with a shared `<Pager>` (prev/next, "Page X of Y", `rel`
  prev/next). Page 1 is the canonical bare URL. The curated `/blog` frontpage is not paginated.

- **Blog display settings — editor-toggled, no deploy.** A new **Affichage du blog** group on
  the `blog` singleton (`display`) lets a non-technical editor show or hide blog elements from
  Studio: category/tag/author chips, the post date, reading time, table of contents, related
  grid, the frontpage "à la une" mosaic, and card excerpts. All default ON (an unset toggle
  also reads as shown). `lib/settings.ts` — `getBlogSettings()` (React-`cache`d, build-safe
  `client.fetch`) — resolves the raw toggles against the feature flags into one `BlogDisplay`;
  every renderer reads it (`BlogCard`/`HeroCard` became async server components to do so). The
  three **taxonomy** toggles are two-tier — visible only when the code capability
  (`features.blogTaxonomy.*`) **and** the editor toggle agree — and gate more than chips: new
  `requireTaxonomyRoute` / `isTaxonomyRouteEnabled` (route-gate) 404 the `/blog/category`,
  `/blog/tag`, `/author` routes and drop them from the sitemap + `/llms.txt` when off ("off =
  truly gone"). Guide: `docs/modules/blog/editor-guide.md` §6.1; architecture:
  `docs/modules/blog/blog-architecture.md` §1.

- **Blog comments — moderated, Sanity-backed, per-locale editable.** A public comment form
  under each post: `POST /api/comments` → `createComment` validates + writes a `comment` doc
  `approved: false` via the server-only write client; it's invisible until an editor ticks
  **Approuvé** in the new Studio **Commentaires** desk (En attente / Approuvés). The list is
  live (`<SanityLive>`); only `approved == true` is read publicly and `authorEmail` is never
  projected. Copy (heading, labels, consent, messages) is editable per locale on the `blog`
  singleton (`comments`, `localeString`). Spam guard: a **honeypot** (bots get `201`, the doc
  is dropped). Gated by `features.blogComments`. Guide: `docs/modules/blog/comments.md`.
- **Comment threading (1 level).** A `parent` reference on `comment` + a per-comment **Reply**
  form; replies render indented under their parent. Server-verified: a reply only threads onto
  an **approved** comment on the **same post**, else it's stored top-level. Reply/Cancel labels
  join the editable per-locale copy; the seed adds a demo reply.

### Changed

- **A post can have several authors.** The post `author` (single reference) became **`authors`**
  (an ordered array, min 1; first = lead). Bylines updated everywhere: the post hero lists
  **all** authors (avatar + name + role, each linked), cards show the **first + "+N"**, and the
  `blog-post-content` byline joins names via `Intl.ListFormat` ("A and B"). A post now appears
  on **each** of its authors' `/author/<slug>` pages (`postsByAuthor` matches the array;
  `postCount` already used field-agnostic `references()`). The seed co-writes the featured post
  (Ada + Grace). _Migration:_ existing single-`author` posts need `author` → `authors[0]`
  (the seed rewrites demo data; real datasets need a one-off patch).

### Added

- **Editors can upload their own featured video + toggle autoplay/controls.** Post
  `metadata` gained `videoFile` (uploaded `.mp4`/`.webm`, wins over the `videoUrl` embed
  link), `videoAutoplay` (muted + looping ambient backdrop, hero only), and `videoControls`
  (default true). GROQ resolves one source — `"video": coalesce(videoFile.asset->url,
videoUrl)` — so uploads and links share the same `parseVideoEmbed` path. The seed sets a
  demo YouTube URL on the featured post so a video is visible out of the box.

### Changed

- **Blog media + cards simplified.** The post hero is now **one structure for image and
  video** — a media block (image, or inline-playable video via `FeaturedMedia`) with title +
  meta below in theme colours; dropped the white-on-dark image overlay + all `--hero-*` CSS
  vars + the dual code path + the separate below-the-fold video block. `BlogCard` distilled
  (dropped the avatar-spill overlay + tags row; calmer hover) and the `/blog` frontpage
  mosaic distilled (dropped the avatar overlay, added a video marker). Video now plays inline
  in cards + hero — no modal.
- **Blog featured video accepts Dailymotion + player extracted.** `metadata.videoUrl` now
  takes Dailymotion / `dai.ly` URLs (Studio legend updated). The video player moved out of
  the blog (`post/components/HeroVideo` → `@indiecrafts/ui-components` `renderers/VideoEmbed`)
  and the listing play-badge too (`shared/components/PlayBadge` → same package), so app pages
  and the blog share one player; `BlogCard` passes the badge `label` from `pages.blog`.

### Added

- **`@indiecrafts/blog` — the blog extracted to a module.** The blog feature moved from the
  app (`src/features/blog`) to `code/modules/blog/` as a self-contained, feature-flagged
  vertical slice, consumed by the app as source. Wired via `transpilePackages`, a tsconfig
  `paths` entry (`@indiecrafts/blog/*`, mixed `.ts`/`.tsx`), a `@source` line in
  `ui-tokens/globals.css`, and schema/structure registration in `sanity.config.ts`. It
  depends on the shared bricks (`config`/`utils`/`sanity`/`ui`/`ui-components`/`i18n`) and
  never on the app. See [`docs/modules/blog/`](../docs/modules/blog).
