# Changelog — packages (`@indiecrafts/*` bricks)

One record for the shared bricks under `code/packages/`. Every change that adds,
splits, or reshapes a brick's public surface lands here in plain language with the
_why_. Rolls up to the [root `CHANGELOG.md`](../../CHANGELOG.md) at release.

**Not here:** app behavior/routes/tokens → [`code/projects/web/CHANGELOG.md`](../apps/web/CHANGELOG.md);
docs-site → [`docs/CHANGELOG.md`](../projects/docs/CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com). Categories: **Added ·
Changed · Deprecated · Removed · Fixed**.

## [Unreleased]

### Added

- **`@indiecrafts/packages-web-email` — the email palette is now the design tokens (resolved hex), not hand-maintained.**
  New `theme.ts` `EMAIL_COLORS` maps every email role to the generated token hex
  (`@indiecrafts/packages-shared-ui-tokens/native`, light) — mail clients strip `var()`/CSS, so email inlines the hex the
  same way the PWA manifest + React Native do. The **8 duplicated `const C = {…}` palettes** (layout + 7
  templates) collapse into that one source, so a rebrand (`tokens.json` → `pnpm tokens:build`) now flows to
  every email — buttons finally match the real brand instead of a stale `#4f46e5`. `@indiecrafts/packages-web-email` gains
  a `@indiecrafts/packages-shared-ui-tokens` dep (pure data). Full remap: dark CTAs → `foreground`/`background`, delete →
  `destructive`; the only email-specific hex left is the moderation "approve" green (no success token).

- **`@indiecrafts/packages-web-email` — every service email now editable in Sanity (owner-alert bodies + lead-magnet).**
  `ownerAlertGroup` gained **translated `heading` · `intro` · `outro`** fields, so the four internal alerts
  (`newsletterOwner` · `waitlistOwner` · `commentNotification` · `dataRequestOwner`) are no longer
  hardcoded FR — the render fns thread the resolved copy (sent in the default locale) with the previous
  text as the per-field fallback (**empty = today's mail, no regression**). The newsletter **lead-magnet
  delivery** email — the one subscriber email with no group — got a `confirmationGroup` (`leadMagnet`);
  `deliver-magnet.ts` reads `getEmailStrings()?.leadMagnet` (`{{title}}` = the document title) with the old
  `COPY` const kept as the fallback. Both flow through the existing `emailStrings` singleton + "Send test"
  (buildSamples now covers lead-magnet). _Why:_ subscriber confirmations were already Sanity-editable
  per-locale; this closes the gap so **all** transactional copy is editor-owned, no deploy. Touched:
  `email/sanity/groups.ts` · `email/strings.ts` · newsletter/waitlist/blog/compliance render fns + callers
  + `newsletter/sanity/email.ts` · `deliver-magnet.ts` · the app `/api/emails/test` route.

### Changed

- **`@indiecrafts/packages-shared-config` — `site.cdnUrl` (first-party asset CDN).** New `site.cdnUrl` primitive
  (`NEXT_PUBLIC_CDN_URL`, empty = origin), fed into each app's Next `assetPrefix` so the app's own build
  assets (`/_next/*` + first-party `/public`) serve from a CDN — **per env** (each env bakes its own build)
  and available to **any** app. Sanity content is unaffected (keeps its `cdn.sanity.io` loader). _Why:_ a
  config-only, per-env CDN any app can opt into.

- **`@indiecrafts/packages-web-sanity` — `studioBasePath` is now env-driven.** It reads
  `NEXT_PUBLIC_SANITY_STUDIO_BASE_PATH` (default `/studio`) instead of a hard-coded constant, so another
  app in the platform can point the Studio mount + the shared client's stega `studioUrl` elsewhere (or a
  read-only app that never mounts a Studio can ignore it). _Why:_ only the hub app mounts a Studio — the
  shared brick shouldn't hard-code its path for every app that imports the client.

- **`@indiecrafts/packages-web-page-builder` · `@indiecrafts/packages-web-i18n` — per-locale page slugs + author/series in the
  locale switcher.** The `page` slug now sets `documentInternationalization: { exclude: true }`, so a
  translation starts with a blank slug (its own per-locale URL) — matching every other content type;
  and `useLocaleSwitch` now detects `/author/*` + `/blog/series/*` to resolve their translated slug.
  _Why:_ `page` was the one document-internationalized type that copied the source slug into a
  translation, and the switcher ignored author + series (falling back to the homepage).

- **`@indiecrafts/packages-web-ui-components` · `@indiecrafts/packages-web-page-builder` — capture forms drop the "already"
  state.** `NewsletterForm` · `WaitlistForm` · `LeadMagnetForm` now treat any non-`201` as an error
  (the API no longer returns `200 { already }` — see the app log's oracle fix), and `LeadMagnetForm`
  now sends the visitor `language` like its siblings. The three blocks' `alreadyMessage` schema field
  is unused as a result — hidden in Studio + tagged `@debt VESTIGIAL` for a later removal. _Why:_
  closing the membership oracle removed the "already subscribed" response the forms keyed on.

### Added

- **Storybook `play` interaction tests across the interactive design-system components.** The first
  `play` functions in the library — a story drives its own component in real Chromium (via
  `addon-vitest`) and asserts behavior by **role**, not markup. Now covered:
  - **`@indiecrafts/packages-web-ui` (28):** overlays/menus `dialog` · `alert-dialog` · `popover` · `sheet` ·
    `drawer` · `dropdown-menu` · `context-menu` · `menubar` · `navigation-menu` · `hover-card` ·
    `tooltip` (open/close); `select` · `combobox` · `command` · `native-select` (pick/filter); `tabs` ·
    `accordion` · `collapsible` (reveal); `checkbox` · `switch` · `toggle` · `toggle-group` ·
    `radio-group` (toggle/select); `slider` (keyboard adjust); `input-otp` · `form` (fill); `sonner`
    (fires a toast).
  - **`@indiecrafts/packages-web-ui-components` (6):** `NewsletterForm` · `WaitlistForm` · `LeadMagnetForm` (submit
    gated on consent), `PhoneInput` (country + national field), `DataRequestForm` (pick a right),
    `AccordionList` (native `<details>` expand).
  - **`@indiecrafts/packages-web-locale-suggest`:** `LocaleSuggest` (dismiss removes the strip).
  - Skipped as static (render + a11y + visual snapshot already cover them) or too input-analog to drive
    deterministically: carousels, `resizable` (drag), `calendar` (date-dependent labels), `pagination`,
    `sidebar`, `message-scroller`.

  Two enablers in `@indiecrafts/web-tools-storybook`'s `.storybook`: a `storybook/test` resolver alias (so the
  sibling-brick stories import the test utils, resolved from the storybook package with browser
  conditions), and a `next-intl/navigation` mock (inert `createNavigation` — `useLocaleSwitch` reaches
  for a Next router that Storybook has no provider for). _Why:_ the interactive components had only
  static render stories — no test exercised opening a menu, selecting an option, or gating a submit.

- **`@indiecrafts/packages-shared-ui-tokens` — token-contract unit test.** `globals.css` is CSS-only (no component to
  drive), so a `tokens.test.ts` guards its structure instead: the light base declares the core semantic
  tokens, the system-dark (`@media prefers-color-scheme: dark`) and toggle-dark (`[data-theme="dark"]`)
  blocks override the **same** token set, and no dark override lacks a light base. _Why:_ a token
  defined in one theme but not the other silently breaks dark mode — this catches the drift.
- **Codified the slots-vs-config boundary (`@indiecrafts/packages-web-ui` + `ui-components`).** Dev-facing
  primitives expose JSX **slots** (`Header`/`Content`/`Footer` + `asChild` + `data-slot`), never a
  presentational-prop bag; the CMS block renderers are the deliberate **data-in** exception (editors,
  not a developer, own the copy). Recorded in `component-architecture.md` + the ui / ui-components
  briefs (the React design-system "slots over config props" lesson). _Why:_ keep the existing slot
  compliance from silently drifting as new components land.
- **`@indiecrafts/packages-web-compliance` — GDPR data-subject request flow.** A visitor can now exercise a
  right (access, rectification, erasure, restriction, portability, objection, withdraw consent)
  from `/data-request` — the legal minimum for a site with no user accounts, where a self-service
  export makes no sense. New: the `dataRequest` record schema + **Demandes RGPD** desk, the seven
  `DATA_REQUEST_TYPES` (one set read by the schema, validator, and form), `submitDataRequest`
  (validate → store → alert), and the `dataRequestOwner` email group. The form UI
  (`DataRequestForm`) is in `@indiecrafts/packages-web-ui-components`; `@indiecrafts/packages-web-email` gains the
  `data-request-notification` template. _Why:_ the brick already covered consent + legal pages but
  had no way to actually exercise Art. 15–21 — this closes it.
- **`@indiecrafts/packages-web-page-builder` — new package: the page-builder, extracted from the blog.** The 16
  generic block **schemas** + `blockContent`/`link`/`cta` objects + `quote`/`person` entities +
  `MODULES_FRAGMENT` GROQ + a new generic **`page` document** + the `pageBuilderSanity` barrel moved out
  of `@indiecrafts/modules-web-blog` into their own package. Renderers stay in `ui-components`; the app, the blog,
  and future apps now compose pages **without depending on the blog module**. `link`'s internal target
  generalized `post` → `page` | `post` (the `LINK_FRAGMENT` href resolves per type, dropping the
  hardcoded `/blog/` prefix). _Why:_ the page-builder is site-wide infra, not a blog concern — the app's
  homepage no longer reaches into `@indiecrafts/modules-web-blog` for its blocks. The `page` doc carries an `isHome`
  flag + an "Accueil" desk section so the **home is the same `page` model** (one model everywhere).
- **`@indiecrafts/packages-shared-gated-delivery` — new brick: signed, expiring download links.** Pure Web-Crypto
  (HMAC-SHA256, zero deps, Node 22 + Workers): `signDownloadToken` / `verifyDownloadToken` + a
  `resolveGatedDownload` route helper. The consumer injects the secret + asset resolver; the brick
  holds no keys and no storage. Gates link _discovery_ (a signed, expiring token), **not** the CDN
  object. First consumer: newsletter lead-magnet delivery. 8/8 unit tests. _Why:_ a reusable delivery
  seam so any capture channel can gate an asset without re-implementing token crypto.
- **`@indiecrafts/packages-web-email` — `renderLeadMagnetEmail` template.** One more template (mirrors
  `newsletter-confirm`) — the branded delivery e-mail carrying the gated download button. Copy is
  resolved by the caller (newsletter), per the package's copy-agnostic template rule.
- **`@indiecrafts/packages-shared-utils` — three new leaf helpers (ported + curated).** `./error-message`
  (`getErrorMessage(unknown)` — joins a Zod-style `issues[]`, then `Error.message`, then `String()`;
  duck-types Zod so utils stays dependency-free), `./truncate` (`truncateText` — word-safe cut +
  ellipsis), `./filename` (`sanitizeAndCropFilename` + `validateFilenameLength` — path/char-safe,
  crops by UTF-8 **byte** length so a multi-byte char never splits). Each subpath-only + colocated
  test. Sourced from an in-house project's utils, filtered against `format` (no date/number overlap).
- **`@indiecrafts/packages-shared-security` — `./ip` + `./crypto`.** `./ip` = `isValidIpAddress` /
  `sanitizeIpAddress` / `extractIpFromHeadersList` (thorough IPv4/IPv6, zero-dep, Edge-safe). `./crypto`
  = AES-256-GCM (integrity tag) + salted SHA-256 (`encrypt`/`decrypt`/`encryptObject`/`decryptObject`/
  `hashIpAddress`/`verifyIpHash`/`isEncryptedData`) on **Web Crypto** (`crypto.subtle`) — zero-dep, runs
  on Node 22 **and** Workers, all async; the secret/salt is caller-injected (no keys in the brick).

### Changed

- **`@indiecrafts/packages-web-email` — pure infra; each email template moved to its owning feature.** Every
  transactional email's `render…Email` template + colocated test moved out of the brick's `templates/`
  into the owning feature's `src/emails/` (blog · newsletter · waitlist · compliance). The brick now
  holds only the shared **system** — `sendEmail`, `renderEmailLayout`/`escapeHtml`, the `RenderedEmail`
  contract, and the `confirmationGroup`/`ownerAlertGroup` factories — and **names zero features**.
  `getEmailStrings()` became a **generic whole-doc read** (no field projection); it exports
  `OwnerAlertConfig`/`ConfirmationConfig` shapes each feature narrows to, so adding an email no longer
  edits `strings.ts` (previously a group name was hardcoded in both the type and the GROQ query). The
  `/api/emails/test` aggregator imports each render fn from its module. _Why:_ the shared brick grew
  with every feature (a template + edits to `index.ts`/`strings.ts` per email) — a bottleneck at scale;
  now a feature owns its email end-to-end (group + template + send).
- **`@indiecrafts/consent` → `@indiecrafts/packages-web-compliance` — legal pages folded into the brick.**
  Renamed the cookie-consent brick to `@indiecrafts/packages-web-compliance` and moved the whole legal-pages
  surface **down into it** from the app: the `legalPage` schema (+ its desk section + i18n
  templates), the `LegalPageContent` renderer + `LegalBody` + `CookieDeclaration`, the
  `legalPageQuery` / `consentPolicyVersionQuery`, and the `getConsentPolicyVersion` reader (now
  `@indiecrafts/packages-web-compliance/sanity/policy-version`, used by the newsletter/waitlist/comment opt-ins).
  **Why:** the consent package already read the app-owned `legalPage` doc through a runtime GROQ
  string — an inverted dependency (package reaching up into app content). Co-locating the schema
  with the queries that read it makes the link compile-time and gives the site one self-contained
  legal + data-protection brick. Reorganized into `src/pages/` · `src/consent/` · `src/reacceptance/`
  under one `complianceSanity` barrel. The 5 legal routes stay in the app as thin shells (Next.js
  routes can't live in a package); the app keeps the `pages` map, `features.legal.*`, and page SEO.

- **`withGuard` validates the client IP.** `guard.ts`'s `clientIp` now runs the trusted
  `cf-connecting-ip` / first `x-forwarded-for` hop through `sanitizeIpAddress` (`./ip`), so a spoofed
  or malformed header can no longer poison the fixed-window rate-limit key.

- **`@indiecrafts/packages-web-announcement` + `@indiecrafts/packages-web-locale-suggest` — two site-chrome bricks (domain · web).**
  **Announcement:** an editor-managed discount/announcement strip under the nav — an `announcementBar`
  Sanity singleton (enable toggle · schedule window · style variant · an array of rotating items, each
  with a per-locale message + a click-to-copy discount code + an internal/external link) read by
  `getAnnouncement` (live-now filter + a content `version` hash), rendered by the normal-flow
  `AnnouncementBar` (dismiss remembered in a server-read cookie → no flash; a new announcement re-shows).
  **Locale-suggest:** a "this site is available in {your language}" strip — pure unit-tested
  `detectPreferredLocale` (Accept-Language vs active), a `localeSuggest` copy singleton, and a
  `LocaleSuggest` banner that **suggests, never auto-redirects** (best practice; native language names,
  no flags) and remembers the answer in a cookie. Both singletons join `sharedModules` in one line.
  _Why:_ common marketing chrome that a client edits in Sanity, kept out of the app codebase.
- **`@indiecrafts/packages-web-i18n` — `useLocaleSwitch()`.** Extracted the locale-switch logic (next-intl prefix swap
  - the blog translated-slug resolve via `/api/i18n/translated-slug`) out of the app's `LocaleSwitcher`
    into the shared i18n brick, so the header switcher **and** the new locale-suggestion banner share one
    implementation. Doc: [`docs/packages/announcement.md`](../projects/docs/packages/announcement.md) ·
    [`docs/packages/locale-suggest.md`](../projects/docs/packages/locale-suggest.md).

- **`@indiecrafts/packages-web-ui-components` — `TurnstileWidget` (client Cloudflare Turnstile).** The client half of
  `@indiecrafts/packages-shared-security`'s server `verifyTurnstile`: renders only when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is
  set (else nothing, form unchanged), loads the CF script once, and reports the token via `onToken` — the
  forms send it as `cf-turnstile-response` and gate submit on `turnstileActive()`. A `siteKey` prop
  override + colocated stories drive it with Cloudflare's test keys. Wired into the newsletter / waitlist /
  comment forms (see the app changelog). Also recorded the **stories-are-mandatory** convention in the
  ui-components brief. Doc: [`docs/packages/ui-components.md`](../projects/docs/packages/ui-components.md).
- **`@indiecrafts/packages-web-sanity` — `composeStudio(groups)`, the hub-Studio composer (per-app desk).** Alongside
  `composeSanity` (flat "Contenu" desk), the new `composeStudio([{ title, modules }])` aggregates the same
  schema/templates/i18n but renders the desk **grouped per app** — one top-level list per group. It's how
  **one Studio edits many apps' content, organized by app** (multi-app readiness — the web app now groups
  its desk into "Site web" vs "Contenu partagé"). `@indiecrafts/packages-web-schema`'s `sharedSanity` (objects-only)
  registers schema without a desk item. Doc: [`docs/packages/sanity.md`](../projects/docs/packages/sanity.md) +
  [`docs/apps/web/config/multi-app.md`](../projects/docs/apps/web/config/multi-app.md).

- **`@indiecrafts/consent` — legal re-acceptance (the compliance brick now covers terms, not just cookies).**
  New non-blocking `LegalNotice` banner (`./LegalNotice`) + `getLegalAcceptance` reader (`./sanity/legal`)
  - a `legalConsent` copy singleton (new desk item) + a first-party cookie store (`./legal-store` —
    `LEGAL_ACK_COOKIE` + `acceptLegal`). It reuses the cookie-consent recipe — an effective **version**
    composed from the privacy/terms/terms-of-sale pages' `lastUpdated`, re-shown when the deposited value
    differs — but deposits a **real cookie** (not localStorage) so the app layout gates it **server-side,
    no flash**. Copy from Sanity, no `messages` fallback. The wildcard `exports` (`./*`) needed no change.
    _Why:_ terms/privacy changes deserve the same "please re-accept" flow cookies already had, kept
    separate from cookie consent (don't bundle). Doc: [`docs/packages/consent.md`](../projects/docs/packages/consent.md).
- **`@indiecrafts/packages-web-version` — the "new version available" prompt brick.** Notices when a new deploy
  shipped while a tab was open and offers a one-click reload. Service-worker-free (the app is
  OpenNext/Cloudflare): `useVersionCheck` (`./use-version-check`) polls `/api/version` (`no-store`) and
  compares the served id to the bundle-baked `buildInfo.commit` — on mount, a 15-min interval, and every
  tab-focus / network-back (tabs stay open for days). `UpdatePrompt` (`./update-prompt`) is a
  self-contained, token-styled `role="status"` banner (no `<Toaster>`) with two safe update paths: the
  Reload button and an automatic reload on the **next** navigation — never a forced one. i18n-agnostic
  (copy in as props). Category `domain · web`; deps `ui` + `utils`. _Why:_ a config-first template
  deploys often; an open tab shouldn't silently run stale code. Doc:
  [`docs/packages/version.md`](../projects/docs/packages/version.md).

### Changed

- **`@indiecrafts/packages-shared-config` — split the 571-line monolith into per-concern files (behind the same barrel).**
  `index.ts` was one god-file mixing data + derived helpers + functions + env-reads + a type re-export
  barrel, scarred by the Sanity migration (orphan section headers, a stale docblock). Now `index.ts` is a
  **curated `.` barrel** re-exporting cohesive modules — `src/{site,theme,i18n,format,features,seo,pages,
env}.ts` + a **types-only** `types.ts` (data/functions/env moved out; `env.ts` isolates the `process.env`
  reads). **Zero import-site churn** — the 129 consumers still import `@indiecrafts/packages-shared-config`; verified by
  `tsc`. **Tidied:** deleted the fully-dead `BusinessType`; un-exported ~13 zero-consumer internals
  (`PLACEHOLDER_SITE_URL`, `isDefaultLocale`, `STATIC_PATHNAME_KEYS`, and internal-only types); **dropped
  the `./types` subpath** (0 importers). No behavior change. Doc:
  [`docs/packages/config.md`](../projects/docs/packages/config.md). _Follow-up:_ `seo.ts` then dropped
  `madeBy` + `seoDefaults.schemaImage` (moved to Sanity `siteSettings`); `themeConfig` stays as the
  code default behind the new Sanity `themeModes` override — see the app changelog.
- **`@indiecrafts/packages-shared-system-pages` — `maintenanceRewrite(request, isDown)` is now pure.** It no longer
  imports `features` from config; the caller passes `isDown`, so the brick stays Sanity-free while the app
  ORs the build-time `features.maintenance` flag with the live Sanity `siteSettings.maintenanceMode` toggle.
  See the app changelog for the maintenance-mode behavior change.

### Added

- **`@indiecrafts/packages-web-ui-components` — three page/marketing blocks: `hero`, `feature-grid`, `pricing`.** New
  generic `module.*` renderers (schemas in `@indiecrafts/modules-web-blog`, in `MODULE_TYPES`) so a page-builder can
  compose a full landing page, not just blog chrome: **Hero** (eyebrow + `RichTitle` title + subtitle +
  CTA), **FeatureGrid** (icon cards, icon enum = the shipped Lucide set), **Pricing** (tiers with price /
  period / feature list / highlighted badge). All three plug into `BLOCK_RENDERERS` (the `satisfies`
  exhaustiveness map) and the shared `MODULES_FRAGMENT` (which now resolves `hero`/`pricing` CTA links).
  Consumed by the app's new Sanity-driven homepage. `ModuleCta` gained an optional `className` (full-width
  pricing CTAs). Also: **`AccordionList` + `QuoteList` now render their optional `title`/`intro`** via
  `RichTitle` (previously ignored) — used for the homepage FAQ + testimonials headings.
- **`@indiecrafts/security-headers` → `@indiecrafts/packages-shared-security` + request hardening (`withGuard`).** The
  brick grew from response headers (CSP/HSTS/COOP + image allowlist) to also own **request-boundary
  hardening**, and renamed to match. New subpaths: `./guard` — `withGuard(handler, opts)` wraps a POST
  route with a **same-site origin** check + **body-size cap** + fixed-window **rate-limit**
  (`./rate-limit`, Workers KV — no-ops when the binding is absent) + **Turnstile** verify
  (`./turnstile` — no-ops until `TURNSTILE_SECRET` is set), parsing the body once. `./origin`
  (`isSameSiteRequest`) is pure + unit-tested. CSP now allows `challenges.cloudflare.com` (the
  Turnstile widget). Injection/XSS were already covered (React escaping · structured Portable Text ·
  whitelisted Sanity writes · `escapeHtml`); this closes the **abuse** gaps — rate-limit · CSRF/origin ·
  bot. Doc: [`docs/packages/security.md`](../projects/docs/packages/security.md).
- **`@indiecrafts/packages-shared-logger` — a real logging brick (beautiful · edge-safe · Sentry-ready).** Replaces the
  26-line `@indiecrafts/packages-shared-utils/logger` placeholder with a proper foundation·agnostic system: six levels
  (`trace…fatal`) + `child(scope)` scoped loggers + `time/timeEnd`; **per-environment config** in
  `@indiecrafts/packages-shared-config → logging` (`production: "silent"` = **prod console off**, override live with
  `NEXT_PUBLIC_LOG_LEVEL` or `configure(...)`); **auto-picked reporters** — `prettyReporter` (dev TTY,
  hand-rolled ANSI, no `chalk`), `browserReporter` (`%c`), `jsonReporter` (prod/Workers, one JSON line
  per the right `console` method so **Cloudflare Workers Logs** captures + classifies it, zero wiring);
  **source-side redaction** (`redactKeys`) + circular/depth-capped `safeStringify`. **Transports fire
  independent of the console gate** — so a prod-silent console still feeds a sink; `sentryTransport(Sentry)`
  (`@indiecrafts/packages-shared-logger/sentry`) is **opt-in with no `@sentry/*` dependency** (structural `SentryLike`).
  `console`-based + `typeof`-guarded `process` reads → runs on browser/server/edge/Workers. `error(msg,
err?, ctx?)` accepts both the positional-Error and the `{ error }`-in-context shapes, so all existing
  call sites migrate untouched. Zero-dep-but-config. Doc:
  [`docs/packages/logger.md`](../projects/docs/packages/logger.md).
- **`@indiecrafts/packages-shared-config` — `DEFAULT_SITE_PREFIX` / `site.prefix`, the per-deployment namespace.** New
  `DEFAULT_SITE_PREFIX` constant (env-overridable via `NEXT_PUBLIC_SITE_PREFIX`) exposed as `site.prefix`,
  plus a derived `localeCookieName` (`${prefix}_NEXT_LOCALE`). It namespaces the browser-owned keys so
  reusing the template per client never collides on a shared origin — **`@indiecrafts/consent`**'s
  `STORAGE_KEY` becomes `${site.prefix}.cookie-consent`, and the app's next-themes `storageKey` +
  next-intl locale cookie follow. Kept in sync with the `wrangler.toml` deploy names by
  `pnpm project:rename <slug>` (app script). _Why:_ one documented identity + a deploy guard make
  many-clients-under-one-Cloudflare-account safe. Doc: [`docs/packages/config.md`](../projects/docs/packages/config.md).
- **`@indiecrafts/packages-web-ui-components` — `RichTitle`, the shared title primitive.** Titles were raw
  `<hN className="…">{title}</hN>` duplicated across the app's marketing sections and every module
  renderer, with no way to emphasise a word or customise a title's classes from one place. New
  `web/RichTitle` renders a heading from a string and colours any `[[word]]` span in the brand
  accent (`text-brand`); pass the element's classes via `className` (`cn`-merged), pick the tag via
  `as`. The `[[word]]` marker is parsed by the pure `shared/rich-title` (`splitHighlights`, unit-tested)
  and is safe inside next-intl messages **and** Sanity strings, so one primitive serves the app and
  the CMS — **i18n-agnostic** (the marker lives inside each already-localised string). Brand-only by
  design (no palette); a marker-free string is a no-op, so any title is safe to wrap. Wired into the
  `Gallery` module title as the CMS example. New Storybook story + `@source`-scanned `text-brand` stays
  purge-safe. Doc: [`docs/apps/web/design/typography.md`](../projects/docs/apps/web/design/typography.md) § Title highlights.
- **`@indiecrafts/packages-web-email` — per-module compose + Studio "Send test" + deliverability.** The E-mails
  entity no longer hardcodes each module's groups (a brick must not name modules; a 2nd app using only
  some modules couldn't). Now: `emailSanity(modules)` builds the **field-less** `emailStrings` singleton
  by composing every module's `emailGroups` (mirrors `composeSanity`) — remove a module from
  `composeSanity([...])` and its email group disappears. Two group factories, `confirmationGroup`
  (subscriber-facing, translated) + `ownerAlertGroup` (internal alert), replace the inline field lists;
  both carry a **BCC** field, so confirmations can BCC an admin too. New `sendTestEmailAction` — an
  "Envoyer un test" document action on `emailStrings` that POSTs `/api/emails/test` (sends a sample of
  every enabled email to a chosen address) so an editor can **verify mail lands** in both inboxes; the
  route is gated by `features.studio` **and** a Sanity user-token check, so it is not a public spam
  relay. New dep `@sanity/ui` (the action dialog). Doc rewritten with a **deliverability** section
  (Resend verified domain, SPF/DKIM/DMARC, valid From) + the **config-placement** answer (recipients/
  copy/BCC → Sanity; `RESEND_API_KEY` → env; per-module → compose):
  [`docs/packages/email.md`](../projects/docs/packages/email.md). _Read path unchanged: `getEmailStrings()`
  still returns the whole doc; consumers pick their group by key._
- **`@indiecrafts/packages-web-sanity` — `SanityModule.emailGroups`.** The contribution contract gains an optional
  `emailGroups?: FieldDefinition[]` so a module hands its transactional-email group(s) to
  `emailSanity(modules)` — the compose mechanism above.
- **`@indiecrafts/consent` — GDPR hardening (GPC · policy-linked re-consent · opt-in proof).** Three
  additions borrowed from a mature SaaS consent system, scoped to **anonymous cookie consent** (no
  accounts/DB): **(A)** the banner honours **Global Privacy Control / Do-Not-Track** on first visit —
  auto reject-all, no nag, `respectGpc` prop (default on), `browserSignalsDeny()` in `consent-store`.
  **(C)** the effective consent `version` now folds in the **cookie-policy** page's `lastUpdated`
  (`getCookieConsent` + `cookiePolicyVersionQuery`), so publishing a policy change re-prompts every
  visitor — no manual bump. **(D)** newsletter + waitlist opt-ins are stamped with the
  **privacy-policy version** accepted (`consentPolicyVersion` on `subscriber` / `waitlistEntry`),
  derived **server-side** by the app route (`getConsentPolicyVersion`, `@/lib/consent-policy`) and
  passed to the module engines — defensible GDPR proof of email consent (Art. 7). Banner copy
  (`messages.cookies.body`, en/fr) tightened to name the legal basis + free withdrawal; the Sanity
  `cookieConsent.banner` override stays the editable primary. Doc:
  [`docs/packages/consent.md`](../projects/docs/packages/consent.md). _Not ported from the SaaS: DB
  consent-history, GDPR data export/anonymization, account deletion, IP-salt hashing — they need user
  accounts a marketing template doesn't have._
- **`@indiecrafts/security-headers` — CSP + headers extracted to a brick (and hardened).** A new pure,
  framework-agnostic brick (domain · server) that **builds** the CSP + security headers from hardened
  defaults + per-app hosts: `buildCsp(env, csp?)`, `securityHeaders(opts)` (the full Next `headers()`
  array), and `imageDefaults`/`imageRemotePatterns` (the Next image allowlist). Moved out of
  `code/projects/web/next.config.ts` (that block collapses to one call). **Composes, doesn't replace,
  `@indiecrafts/packages-shared-config`** — `getCurrentEnvironment` + `getCSPConnectSources` stay in config; the brick
  imports them. **Hardened** (new headers): `Strict-Transport-Security` (prod only, no `preload`),
  `Cross-Origin-Opener-Policy: same-origin-allow-popups`, `upgrade-insecure-requests` (prod) — all
  chosen to keep the embedded **Sanity Studio** working (COOP allow-popups for its OAuth login; COEP/CORP
  skipped). Doc: [`docs/packages/security-headers.md`](../projects/docs/packages/security-headers.md).
- **`@indiecrafts/packages-shared-format` — locale formatting & grammar brick.** A new pure, framework-agnostic
  brick (foundation · agnostic, `Intl`-based, dep: `@indiecrafts/packages-shared-config`) for **money** (`formatMoney`
  - `convert`/`withVat`/`parseMoney`), **number** (percent/compact/unit/ordinal/bytes/range),
    **relative time** (`Intl.RelativeTimeFormat` — replaces hardcoded buckets), **lists**
    (`Intl.ListFormat`), **plurals** (`Intl.PluralRules`), **grammar for generated content** (`capitalize`
    Title-vs-sentence · `placeAdjective` adjective position · FR `article` `le/la/l'/du/au` agreement ·
    `inlineNoun`), **text** (truncate/initials/readingTime/excerpt/maskEmail/…), and **validators**
    (phone/IBAN/VAT/postal). Subpath-only (explicit-extension `exports` → no tsconfig `paths`). Adopted:
    the blog byline now uses `formatList`. Config: **`@indiecrafts/packages-shared-config`** gained per-locale format
    rules on the `i18n.locales` rows (`numberLocale` · `currency` · `capitalizeInlineNouns` ·
    `adjBeforeNoun`) + a site-wide `formatDefaults` (`currency`/`vatRate`/`rates`) + `localeFormat(locale)`
    — **not Sanity, not `messages/`** (technical i18n rules). Doc:
    [`docs/packages/format.md`](../projects/docs/packages/format.md).
- **`@indiecrafts/packages-web-ui-components` — `PhoneInput`.** A lightweight international phone field (dial-code
  select + national `tel` input → emits E.164) at `web/form/PhoneInput.tsx`; validation via
  `@indiecrafts/packages-shared-format/validate`. Address autocomplete + payment-card fields deliberately **not**
  shipped (external API + privacy; PCI / Stripe Elements).
- **Roster gained a `category · platform` taxonomy (flat-until-trigger).** The 12 bricks + 3 modules
  are now tagged by **category** — `foundation · design-system · domain` for bricks; `content ·
growth · …` for modules — and **platform** — `agnostic · web · server · tooling` — in their
  `_registry.md`, with reserved names grouped the same way. **No files moved:** the roster stays flat
  on disk while it is scannable. The convention lives in `code/packages/.claude/CLAUDE.md →
Categorisation & platform`: platform splits **inside** the one package that needs them (the
  `ui-components` `renderers/web|native/` model), never as a top-level `packages/web` folder; a
  new-platform design system is a sibling brick (`ui-native`) while `ui-tokens` values stay shared;
  and the roster folds into `packages/<category>/<brick>/` only past a trigger (more than ~18 bricks,
  or app #2 on a new platform) — a mechanical move, since package names are path-independent. Sets
  the shape for multi-app / multi-platform growth without premature scaffolding. Also completed the
  stale `docs/packages/README.md` roster (listed 8 of 12).
- **`@indiecrafts/packages-web-email` — waitlist emails.** Two new groups on the `emailStrings` entity —
  `waitlistConfirm` (joiner-facing, **translated** "you're on the list" copy) + `waitlistOwner` (owner
  alert) — plus the `waitlist-confirm` + `waitlist-notification` templates. Consumed by the new
  `@indiecrafts/modules-web-waitlist` module (see modules changelog).
- **`@indiecrafts/packages-shared-system-pages` — the shared status pages extracted to a brick.** The **maintenance**
  page, **404**, and **error (500)** presentational components moved out of `code/projects/web`
  (`src/user-interface/{maintenance,not-found,error}/`) into a token-based, app-agnostic brick, plus a
  `maintenanceRewrite(request)` proxy helper (`./proxy`) — the `features.maintenance` 503 rewrite. So a
  second app inherits the same branded status pages + behaviour for free. Decoupling: `NotFoundContent`
  now uses the shared `@indiecrafts/packages-web-i18n` `Link` (was app `@/i18n/routing`) and `ErrorContent` takes
  copy as **props** (was client `useTranslations`) — both dropped the app's `DefaultLayout`, which the
  **route** now wraps. Per-app glue stays in the app: the routes, `getSystemPages` (Sanity copy) +
  `messages` fallbacks, `@/lib/fonts`, `DefaultLayout`, and `maintenanceLocale()`. Wired via
  `transpilePackages` + a tsconfig `paths` entry + a `@source` line in `ui-tokens/globals.css`. 1
  consumer today (extracted for multi-app reuse, like `consent`). Doc:
  [`docs/packages/system-pages.md`](../projects/docs/packages/system-pages.md).
- **`@indiecrafts/packages-web-email` — the E-mails entity: config + translated copy in Sanity.** The brick now
  owns an **`emailStrings` singleton** (Studio → **E-mails**, via the new `emailSanity`
  `SanityModule`) — one place that configures every transactional email: recipients, sender, and
  copy. **Subscriber-facing copy is translated** (`localeString`/`localeText`, resolved by the
  recipient's locale); internal owner alerts keep a plain subject. New subpaths: `@indiecrafts/packages-web-email/
strings` (`getEmailStrings()` React-`cache`d read + `pick`) and `@indiecrafts/packages-web-email/sanity` (the
  barrel). Two new templates — `newsletter-confirm` (translated) + `newsletter-notification`. Copy no
  longer lives hardcoded in the templates; the senders read the entity and pass resolved strings.
  Adds a `@indiecrafts/packages-web-sanity` dep. Doc: [`docs/packages/email.md`](../projects/docs/packages/email.md).
- **`@indiecrafts/packages-web-schema` — `localeText` primitive.** The multi-line sibling of `localeString`
  (`type:"text"` per registered locale) for longer editor-managed translated copy (email bodies).
  Registered in `sharedSanity`; same generation + `value[locale] ?? value[defaultLocale]` read path.
- **`@indiecrafts/packages-web-email` — transactional email extracted to a brick.** A new package holds the
  Resend sender (`sendEmail` — server-only, one `fetch`, no SDK, reads `RESEND_API_KEY`), the shared
  HTML **`renderEmailLayout`** (table-based + inline-styled — the only mail-client-safe technique;
  palette hex inlined on purpose since oklch tokens never reach an email client) + `escapeHtml`, and
  **one template per email** in `templates/` (`comment-notification` today) that renders `{ subject,
text, html }` from plain data. Moved out of the blog so any module/app can send — **modules can't
  depend on modules**, so a second sender could never reach a helper stuck in the blog. Adding an
  email = drop a `templates/<name>.ts` + re-export; the feature passes data, the brick renders. Doc:
  [`docs/packages/email.md`](../projects/docs/packages/email.md).
- **`@indiecrafts/packages-web-schema/generated` — the shared home for Sanity typegen output.** The schema is
  composed at the app, so `pnpm sanity:typegen` (app) extracts it → `schema.json` and generates typed
  GROQ document + query-result types into `code/packages/schema/src/generated.ts`, imported via
  `@indiecrafts/packages-web-schema/generated` (the package's `./*` wildcard export). This is deliberately a
  **shared package, not app-local**: the blog module fetches its own data (`sanityFetchLive` in
  `llms.ts`/`Comments.tsx`/`BlogPostList.tsx`), and a module must never import an app — so the
  generated types live where both the app and modules can import them. Ships as a committed
  placeholder (`export {}`) until first generation; adopt incrementally (replace a hand-written result
  type like blog's `PostListItem` with the generated `…QueryResult`). `schema.json` is gitignored.
- **`@indiecrafts/consent` — cookie consent extracted to a brick.** The consent runtime (banner ·
  store · Consent-Mode gates/hooks · `ManagePreferencesButton`), the `cookieConsent` schema +
  category/entry objects + `getCookieConsent`, and the "Cookies & consentement" desk (moved out of
  `@indiecrafts/packages-web-sanity`) now live in `code/packages/consent/`, shipped as the `consentSanity`
  **`SanityModule`** barrel — one line in `composeSanity([...])`. Signal types live in
  `@indiecrafts/consent/consent-signals`; the banner mount + GA `<head>` script stay in the app. Doc:
  [`docs/packages/consent.md`](../projects/docs/packages/consent.md).
- **`@indiecrafts/packages-shared-config` newsletter config + `features.newsletter`.** New `newsletter` object —
  `destination: "sanity" | "provider" | "both"` (default `sanity` → zero config) and `provider:
"none" | "buttondown" | "mailchimp" | "resend"` — plus the `features.newsletter` flag. Provider
  secrets read from env server-side, never `NEXT_PUBLIC_`.
- **`@indiecrafts/packages-web-ui-components` newsletter block + new `form/` domain.** `Newsletter` renderer
  (server wrapper gating on `features.newsletter` + client `NewsletterForm` — 3 variants
  card/inline/banner, honeypot, idle/submitting/success/already/error states) at
  `renderers/web/form/`; `NewsletterModule` added to the `BlockModule` union + `BLOCK_RENDERERS` +
  the `INLINE_TYPES` allowlist. Posts to `/api/newsletter`. Colocated story + doc. Why: newsletter
  now, contact/form blocks later — the `form/` domain is the home for both.

### Changed

- **UI bricks nested by platform (`src/<platform>/<domain>/` + `src/shared/`) — scaffolds
  multi-platform.** Anticipating several UI systems across platforms, every UI brick now carries
  `web/` + `native/` (reserved, README) + `shared/`. `@indiecrafts/packages-web-ui` moved its 61 shadcn primitives
  - `use-mobile` into `src/web/` (imported `@indiecrafts/packages-web-ui/web/<name>`); `@indiecrafts/packages-web-ui-components`
    flattened `renderers/web/<domain>/` → `src/web/<domain>/` and moved `types.ts` → `src/shared/types.ts`
    (imported `@indiecrafts/packages-web-ui-components/web/<domain>/<Name>` + `/shared/types`); `@indiecrafts/packages-shared-ui-tokens`
    reserved `src/native/` + `src/shared/` (web CSS stays put — moving it has outsized blast radius for
    zero gain). A React-Native design system now lands **inside** each brick under `native/` — never a
    top-level `packages/web` split or a `ui-native` sibling; token values + `shared/` contracts stay one
    home, only components fork per platform. Platform is explicit in every UI import path. Updated:
    `ui`/`ui-components` `exports`, shadcn `components.json` `ui`/`hooks` aliases → `@indiecrafts/packages-web-ui/web`,
    a tsconfig `paths` entry for `@indiecrafts/packages-web-ui/web/*`, ~48 import sites (app · blog · consent ·
    waitlist), and fixed a latent `_mock.ts` bad relative import. `tsc` + `lint` green. Convention:
    `code/packages/.claude/CLAUDE.md → Categorisation & platform`.
- **`@indiecrafts/packages-shared-utils` → subpath-only; `consent-signals` moved to its domain owner; `formatPostDate`
  renamed.** The utils brick dropped its `.` barrel (`src/index.ts` deleted) for explicit-extension
  subpath `exports` — `@indiecrafts/packages-shared-utils/{cn,logger,slugify,video-embed,format-date}`, the sanity-style
  pattern that resolves for every consumer with no tsconfig `paths` entry. A barrel costs build/HMR time
  and defeats tree-shaking; every other brick was already barrel-less, so utils now matches (the
  "one brick you may barrel" exception is retired). `consent-signals` — the seven Consent-Mode signal
  constants + the `CookieRow`/`ConsentCategory`/`ConsentSignal`/`CookieConsent` types — moved to its
  domain owner `@indiecrafts/consent` (`@indiecrafts/consent/consent-signals`, client-safe, no Sanity
  graph); `@indiecrafts/consent` dropped its now-unused `@indiecrafts/packages-shared-utils` dep. `formatPostDate` →
  `formatDate` (a generic date formatter, not blog-flavored). ~93 import sites updated to subpaths;
  `@indiecrafts/consent` added to the app's declared deps (it was a phantom import). Doc:
  [`docs/packages/utils.md`](../projects/docs/packages/utils.md).
- **`@indiecrafts/packages-web-ui-components` reorganized platform → domain.** Renderers moved from a flat
  `src/renderers/` into `src/renderers/web/<domain>/` — `content` · `media` · `collection` ·
  `layout` — with the registry + portable-text map at `renderers/web/`. `src/types.ts` stays the
  platform-agnostic contract; `renderers/native/` is **reserved** (empty) for a future React-Native
  set that mirrors the same domains + shares `types` + tokens. Consumers import
  `@indiecrafts/packages-web-ui-components/renderers/web/<domain>/<Name>` (blog + app updated). Why: establish the
  stable **domain** axis now and the **platform** axis lazily — web renderers (Tailwind/DOM) can't be
  reused by RN, so an empty `mobile/` today would be scaffolding, not architecture.

### Added

- **`@indiecrafts/web-tools-storybook` — living design-system docs.** A new Storybook (`@storybook/nextjs-vite`)
  documenting all three design-system packages so `ui` primitives, `ui-components` block renderers,
  and `ui-tokens` are inspectable + theme-toggleable, instead of only visible by running the whole
  app. **Colocated stories** — `<name>.stories.tsx` beside each component in its own package (the
  storybook package only aggregates via glob), so docs never drift from source: 61 `ui` primitive
  stories + 15 `ui-components` renderer/helper stories + 4 token MDX doc pages (live `var(--token)`
  swatches). One `data-theme` toolbar (`@storybook/addon-themes`) flips the whole token system;
  Tailwind v4 via `@tailwindcss/vite`; a `next-intl` alias-mock resolves the two translation-reading
  renderers; `experimentalRSC` renders the async ones (QuoteList, CodeBlock). `pnpm storybook` /
  `pnpm storybook:build`. Doc: `docs/packages/storybook.md`. _(Adding a component now includes adding
  its story — see the block workflows + the component-architecture rule in the dev framework.)_
- **`@indiecrafts/packages-web-schema` — shared Sanity primitives + composable Studio config.** A new brick
  holds the doc-agnostic object types (`localeString` moved from app-core, `seoMeta` moved from
  the blog) so no module reaches into another for a field type. `@indiecrafts/packages-web-sanity/module`
  adds the **`SanityModule`** contribution contract + **`composeSanity()`**: each owner
  (`sharedSanity`, `coreSanity`, `blogSanity`) exports its schema + desk section + create
  templates + i18n types, and `sanity.config.ts` composes them — **one line per module**,
  no more four hand-wired lists. Makes each module's Sanity config standalone. Guide:
  [`docs/packages/sanity.md` → Composing the Studio config](../projects/docs/packages/sanity.md).
- **`@indiecrafts/packages-web-sanity/write` — server-only authenticated write client.** New `./write`
  export: `writeClient` (Editor-role `SANITY_API_WRITE_TOKEN`, `import "server-only"`). The one
  runtime write path (blog comments today); callers hard-code `_type` + whitelist fields so no
  untrusted input is spread into a mutation.

### Changed

- **`FeaturedMedia` gained `autoplay` + `controls`.** `autoplay` mounts the player
  immediately, muted + looping (ambient backdrop, no play button); `controls` toggles the
  native/provider player UI (embeds get `mute=1`/`controls=0` url params per provider).
  Defaults preserve the click-to-play facade with controls on.
- **`FeaturedMedia` replaces `VideoEmbed` + `PlayBadge`** in `@indiecrafts/packages-web-ui-components` —
  **one structure for a featured image or video**. The video plays **inline** (poster swaps
  to an `<iframe>`/`<video>` in place on click, facade/lazy-mount) — **no dialog**. Handles
  the image (CDN-sized, lqip blur), the play button, and the badge-only marker
  (`interactive={false}`). i18n-agnostic (`playLabel` prop). Used by the post hero, blog
  frontpage, and all cards, so image and video render identically everywhere.

### Added

- **Dailymotion featured-video support** in `@indiecrafts/packages-shared-utils` `parseVideoEmbed` — accepts
  `dailymotion.com/video/<id>`, `/embed/video/<id>`, and short `dai.ly/<id>` (strips a
  `_title` suffix; id `^[a-zA-Z0-9]{5,32}$`), producing `dailymotion.com/embed/video/<id>`.
  Joins YouTube/Vimeo/file. Host must be in the app's `frame-src` CSP (done).
- **`VideoEmbed` + `PlayBadge` extracted to `@indiecrafts/packages-web-ui-components`** (`renderers/`)
  from the blog module, so app pages + blog share one video player + badge. `VideoEmbed`
  (was blog `HeroVideo`) and `PlayBadge` are i18n-agnostic — labels are passed in, not
  self-resolved — so the package owns no message namespace. Enables the page-builder
  `embed`/`hero` media block without duplicating the player.

- **`@indiecrafts/packages-web-sanity/image` — the `next/image` CDN loader.** New subpath export
  `sanityImageLoader`: an isomorphic loader that appends `?w=&q=&auto=format&fit=max` for
  `cdn.sanity.io` + `images.unsplash.com` (SVG + non-CDN sources pass through). Wired
  app-side via `images.loaderFile`. Behavior/usage logged in the app changelog.
- **`@indiecrafts/packages-web-ui-components` — shared page-builder blocks.** Extracted the 10 generic
  block renderers **down** out of `@indiecrafts/modules-web-blog` so the app and the blog render the same
  components and look identical (no duplication → no drift). Ships `BLOCK_RENDERERS` (a
  composable `_type`→component map + `renderBlock`), the shared `portable-text-components`
  map, `ModuleSection` · `Cta`, and the block `types` (`BlockModule` union). The blog's
  `ModuleRenderer` now spreads `BLOCK_RENDERERS` and adds its 3 blog-specific dispatchers
  (`blog-index · blog-post-list · blog-post-content`); `AnyModule = BlockModule | BlogModule`.
  **Renderers moved, schemas didn't** — the block `module.*` schemas stay in the blog for now
  (`person-list`/`quote-list` schemas ref blog `person`/`quote` docs), a later phase moves the
  schemas + a `blockContent` factory. Blog renders byte-identically; build green.
