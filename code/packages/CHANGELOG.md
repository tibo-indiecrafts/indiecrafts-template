# Changelog — packages (`@indiecrafts/*` bricks)

One record for the shared bricks under `code/packages/`. Every change that adds,
splits, or reshapes a brick's public surface lands here in plain language with the
_why_. Rolls up to the [root `CHANGELOG.md`](../../CHANGELOG.md) at release.

**Not here:** app behavior/routes/tokens → [`code/apps/web/CHANGELOG.md`](../apps/web/CHANGELOG.md);
docs-site → [`docs/CHANGELOG.md`](../../docs/CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com). Categories: **Added ·
Changed · Deprecated · Removed · Fixed**.

## [Unreleased]

### Added

- **`@indiecrafts/consent` — legal re-acceptance (the compliance brick now covers terms, not just cookies).**
  New non-blocking `LegalNotice` banner (`./LegalNotice`) + `getLegalAcceptance` reader (`./sanity/legal`)
  + a `legalConsent` copy singleton (new desk item) + a first-party cookie store (`./legal-store` —
  `LEGAL_ACK_COOKIE` + `acceptLegal`). It reuses the cookie-consent recipe — an effective **version**
  composed from the privacy/terms/terms-of-sale pages' `lastUpdated`, re-shown when the deposited value
  differs — but deposits a **real cookie** (not localStorage) so the app layout gates it **server-side,
  no flash**. Copy from Sanity, no `messages` fallback. The wildcard `exports` (`./*`) needed no change.
  _Why:_ terms/privacy changes deserve the same "please re-accept" flow cookies already had, kept
  separate from cookie consent (don't bundle). Doc: [`docs/packages/consent.md`](../../docs/packages/consent.md).
- **`@indiecrafts/version` — the "new version available" prompt brick.** Notices when a new deploy
  shipped while a tab was open and offers a one-click reload. Service-worker-free (the app is
  OpenNext/Cloudflare): `useVersionCheck` (`./use-version-check`) polls `/api/version` (`no-store`) and
  compares the served id to the bundle-baked `buildInfo.commit` — on mount, a 15-min interval, and every
  tab-focus / network-back (tabs stay open for days). `UpdatePrompt` (`./update-prompt`) is a
  self-contained, token-styled `role="status"` banner (no `<Toaster>`) with two safe update paths: the
  Reload button and an automatic reload on the **next** navigation — never a forced one. i18n-agnostic
  (copy in as props). Category `domain · web`; deps `ui` + `utils`. _Why:_ a config-first template
  deploys often; an open tab shouldn't silently run stale code. Doc:
  [`docs/packages/version.md`](../../docs/packages/version.md).

### Changed

- **`@indiecrafts/config` — split the 571-line monolith into per-concern files (behind the same barrel).**
  `index.ts` was one god-file mixing data + derived helpers + functions + env-reads + a type re-export
  barrel, scarred by the Sanity migration (orphan section headers, a stale docblock). Now `index.ts` is a
  **curated `.` barrel** re-exporting cohesive modules — `src/{site,theme,i18n,format,features,seo,pages,
  env}.ts` + a **types-only** `types.ts` (data/functions/env moved out; `env.ts` isolates the `process.env`
  reads). **Zero import-site churn** — the 129 consumers still import `@indiecrafts/config`; verified by
  `tsc`. **Tidied:** deleted the fully-dead `BusinessType`; un-exported ~13 zero-consumer internals
  (`PLACEHOLDER_SITE_URL`, `isDefaultLocale`, `STATIC_PATHNAME_KEYS`, and internal-only types); **dropped
  the `./types` subpath** (0 importers). No behavior change. Doc:
  [`docs/packages/config.md`](../../docs/packages/config.md). _Follow-up:_ `seo.ts` then dropped
  `madeBy` + `seoDefaults.schemaImage` (moved to Sanity `siteSettings`); `themeConfig` stays as the
  code default behind the new Sanity `themeModes` override — see the app changelog.
- **`@indiecrafts/system-pages` — `maintenanceRewrite(request, isDown)` is now pure.** It no longer
  imports `features` from config; the caller passes `isDown`, so the brick stays Sanity-free while the app
  ORs the build-time `features.maintenance` flag with the live Sanity `siteSettings.maintenanceMode` toggle.
  See the app changelog for the maintenance-mode behavior change.

### Added

- **`@indiecrafts/ui-components` — three page/marketing blocks: `hero`, `feature-grid`, `pricing`.** New
  generic `module.*` renderers (schemas in `@indiecrafts/blog`, in `MODULE_TYPES`) so a page-builder can
  compose a full landing page, not just blog chrome: **Hero** (eyebrow + `RichTitle` title + subtitle +
  CTA), **FeatureGrid** (icon cards, icon enum = the shipped Lucide set), **Pricing** (tiers with price /
  period / feature list / highlighted badge). All three plug into `BLOCK_RENDERERS` (the `satisfies`
  exhaustiveness map) and the shared `MODULES_FRAGMENT` (which now resolves `hero`/`pricing` CTA links).
  Consumed by the app's new Sanity-driven homepage. `ModuleCta` gained an optional `className` (full-width
  pricing CTAs). Also: **`AccordionList` + `QuoteList` now render their optional `title`/`intro`** via
  `RichTitle` (previously ignored) — used for the homepage FAQ + testimonials headings.
- **`@indiecrafts/security-headers` → `@indiecrafts/security` + request hardening (`withGuard`).** The
  brick grew from response headers (CSP/HSTS/COOP + image allowlist) to also own **request-boundary
  hardening**, and renamed to match. New subpaths: `./guard` — `withGuard(handler, opts)` wraps a POST
  route with a **same-site origin** check + **body-size cap** + fixed-window **rate-limit**
  (`./rate-limit`, Workers KV — no-ops when the binding is absent) + **Turnstile** verify
  (`./turnstile` — no-ops until `TURNSTILE_SECRET` is set), parsing the body once. `./origin`
  (`isSameSiteRequest`) is pure + unit-tested. CSP now allows `challenges.cloudflare.com` (the
  Turnstile widget). Injection/XSS were already covered (React escaping · structured Portable Text ·
  whitelisted Sanity writes · `escapeHtml`); this closes the **abuse** gaps — rate-limit · CSRF/origin ·
  bot. Doc: [`docs/packages/security.md`](../../docs/packages/security.md).
- **`@indiecrafts/logger` — a real logging brick (beautiful · edge-safe · Sentry-ready).** Replaces the
  26-line `@indiecrafts/utils/logger` placeholder with a proper foundation·agnostic system: six levels
  (`trace…fatal`) + `child(scope)` scoped loggers + `time/timeEnd`; **per-environment config** in
  `@indiecrafts/config → logging` (`production: "silent"` = **prod console off**, override live with
  `NEXT_PUBLIC_LOG_LEVEL` or `configure(...)`); **auto-picked reporters** — `prettyReporter` (dev TTY,
  hand-rolled ANSI, no `chalk`), `browserReporter` (`%c`), `jsonReporter` (prod/Workers, one JSON line
  per the right `console` method so **Cloudflare Workers Logs** captures + classifies it, zero wiring);
  **source-side redaction** (`redactKeys`) + circular/depth-capped `safeStringify`. **Transports fire
  independent of the console gate** — so a prod-silent console still feeds a sink; `sentryTransport(Sentry)`
  (`@indiecrafts/logger/sentry`) is **opt-in with no `@sentry/*` dependency** (structural `SentryLike`).
  `console`-based + `typeof`-guarded `process` reads → runs on browser/server/edge/Workers. `error(msg,
  err?, ctx?)` accepts both the positional-Error and the `{ error }`-in-context shapes, so all existing
  call sites migrate untouched. Zero-dep-but-config. Doc:
  [`docs/packages/logger.md`](../../docs/packages/logger.md).
- **`@indiecrafts/config` — `DEFAULT_SITE_PREFIX` / `site.prefix`, the per-deployment namespace.** New
  `DEFAULT_SITE_PREFIX` constant (env-overridable via `NEXT_PUBLIC_SITE_PREFIX`) exposed as `site.prefix`,
  plus a derived `localeCookieName` (`${prefix}_NEXT_LOCALE`). It namespaces the browser-owned keys so
  reusing the template per client never collides on a shared origin — **`@indiecrafts/consent`**'s
  `STORAGE_KEY` becomes `${site.prefix}.cookie-consent`, and the app's next-themes `storageKey` +
  next-intl locale cookie follow. Kept in sync with the `wrangler.toml` deploy names by
  `pnpm project:rename <slug>` (app script). _Why:_ one documented identity + a deploy guard make
  many-clients-under-one-Cloudflare-account safe. Doc: [`docs/packages/config.md`](../../docs/packages/config.md).
- **`@indiecrafts/ui-components` — `RichTitle`, the shared title primitive.** Titles were raw
  `<hN className="…">{title}</hN>` duplicated across the app's marketing sections and every module
  renderer, with no way to emphasise a word or customise a title's classes from one place. New
  `web/RichTitle` renders a heading from a string and colours any `[[word]]` span in the brand
  accent (`text-brand`); pass the element's classes via `className` (`cn`-merged), pick the tag via
  `as`. The `[[word]]` marker is parsed by the pure `shared/rich-title` (`splitHighlights`, unit-tested)
  and is safe inside next-intl messages **and** Sanity strings, so one primitive serves the app and
  the CMS — **i18n-agnostic** (the marker lives inside each already-localised string). Brand-only by
  design (no palette); a marker-free string is a no-op, so any title is safe to wrap. Wired into the
  `Gallery` module title as the CMS example. New Storybook story + `@source`-scanned `text-brand` stays
  purge-safe. Doc: [`docs/apps/web/design/typography.md`](../../docs/apps/web/design/typography.md) § Title highlights.
- **`@indiecrafts/email` — per-module compose + Studio "Send test" + deliverability.** The E-mails
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
  [`docs/packages/email.md`](../../docs/packages/email.md). _Read path unchanged: `getEmailStrings()`
  still returns the whole doc; consumers pick their group by key._
- **`@indiecrafts/sanity` — `SanityModule.emailGroups`.** The contribution contract gains an optional
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
  [`docs/packages/consent.md`](../../docs/packages/consent.md). _Not ported from the SaaS: DB
  consent-history, GDPR data export/anonymization, account deletion, IP-salt hashing — they need user
  accounts a marketing template doesn't have._
- **`@indiecrafts/security-headers` — CSP + headers extracted to a brick (and hardened).** A new pure,
  framework-agnostic brick (domain · server) that **builds** the CSP + security headers from hardened
  defaults + per-app hosts: `buildCsp(env, csp?)`, `securityHeaders(opts)` (the full Next `headers()`
  array), and `imageDefaults`/`imageRemotePatterns` (the Next image allowlist). Moved out of
  `code/apps/web/next.config.ts` (that block collapses to one call). **Composes, doesn't replace,
  `@indiecrafts/config`** — `getCurrentEnvironment` + `getCSPConnectSources` stay in config; the brick
  imports them. **Hardened** (new headers): `Strict-Transport-Security` (prod only, no `preload`),
  `Cross-Origin-Opener-Policy: same-origin-allow-popups`, `upgrade-insecure-requests` (prod) — all
  chosen to keep the embedded **Sanity Studio** working (COOP allow-popups for its OAuth login; COEP/CORP
  skipped). Doc: [`docs/packages/security-headers.md`](../../docs/packages/security-headers.md).
- **`@indiecrafts/format` — locale formatting & grammar brick.** A new pure, framework-agnostic
  brick (foundation · agnostic, `Intl`-based, dep: `@indiecrafts/config`) for **money** (`formatMoney`
  + `convert`/`withVat`/`parseMoney`), **number** (percent/compact/unit/ordinal/bytes/range),
  **relative time** (`Intl.RelativeTimeFormat` — replaces hardcoded buckets), **lists**
  (`Intl.ListFormat`), **plurals** (`Intl.PluralRules`), **grammar for generated content** (`capitalize`
  Title-vs-sentence · `placeAdjective` adjective position · FR `article` `le/la/l'/du/au` agreement ·
  `inlineNoun`), **text** (truncate/initials/readingTime/excerpt/maskEmail/…), and **validators**
  (phone/IBAN/VAT/postal). Subpath-only (explicit-extension `exports` → no tsconfig `paths`). Adopted:
  the blog byline now uses `formatList`. Config: **`@indiecrafts/config`** gained per-locale format
  rules on the `i18n.locales` rows (`numberLocale` · `currency` · `capitalizeInlineNouns` ·
  `adjBeforeNoun`) + a site-wide `formatDefaults` (`currency`/`vatRate`/`rates`) + `localeFormat(locale)`
  — **not Sanity, not `messages/`** (technical i18n rules). Doc:
  [`docs/packages/format.md`](../../docs/packages/format.md).
- **`@indiecrafts/ui-components` — `PhoneInput`.** A lightweight international phone field (dial-code
  select + national `tel` input → emits E.164) at `web/form/PhoneInput.tsx`; validation via
  `@indiecrafts/format/validate`. Address autocomplete + payment-card fields deliberately **not**
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
- **`@indiecrafts/email` — waitlist emails.** Two new groups on the `emailStrings` entity —
  `waitlistConfirm` (joiner-facing, **translated** "you're on the list" copy) + `waitlistOwner` (owner
  alert) — plus the `waitlist-confirm` + `waitlist-notification` templates. Consumed by the new
  `@indiecrafts/waitlist` module (see modules changelog).
- **`@indiecrafts/system-pages` — the shared status pages extracted to a brick.** The **maintenance**
  page, **404**, and **error (500)** presentational components moved out of `code/apps/web`
  (`src/user-interface/{maintenance,not-found,error}/`) into a token-based, app-agnostic brick, plus a
  `maintenanceRewrite(request)` proxy helper (`./proxy`) — the `features.maintenance` 503 rewrite. So a
  second app inherits the same branded status pages + behaviour for free. Decoupling: `NotFoundContent`
  now uses the shared `@indiecrafts/i18n` `Link` (was app `@/i18n/routing`) and `ErrorContent` takes
  copy as **props** (was client `useTranslations`) — both dropped the app's `DefaultLayout`, which the
  **route** now wraps. Per-app glue stays in the app: the routes, `getSystemPages` (Sanity copy) +
  `messages` fallbacks, `@/lib/fonts`, `DefaultLayout`, and `maintenanceLocale()`. Wired via
  `transpilePackages` + a tsconfig `paths` entry + a `@source` line in `ui-tokens/globals.css`. 1
  consumer today (extracted for multi-app reuse, like `consent`). Doc:
  [`docs/packages/system-pages.md`](../../docs/packages/system-pages.md).
- **`@indiecrafts/email` — the E-mails entity: config + translated copy in Sanity.** The brick now
  owns an **`emailStrings` singleton** (Studio → **E-mails**, via the new `emailSanity`
  `SanityModule`) — one place that configures every transactional email: recipients, sender, and
  copy. **Subscriber-facing copy is translated** (`localeString`/`localeText`, resolved by the
  recipient's locale); internal owner alerts keep a plain subject. New subpaths: `@indiecrafts/email/
  strings` (`getEmailStrings()` React-`cache`d read + `pick`) and `@indiecrafts/email/sanity` (the
  barrel). Two new templates — `newsletter-confirm` (translated) + `newsletter-notification`. Copy no
  longer lives hardcoded in the templates; the senders read the entity and pass resolved strings.
  Adds a `@indiecrafts/sanity` dep. Doc: [`docs/packages/email.md`](../../docs/packages/email.md).
- **`@indiecrafts/schema` — `localeText` primitive.** The multi-line sibling of `localeString`
  (`type:"text"` per registered locale) for longer editor-managed translated copy (email bodies).
  Registered in `sharedSanity`; same generation + `value[locale] ?? value[defaultLocale]` read path.
- **`@indiecrafts/email` — transactional email extracted to a brick.** A new package holds the
  Resend sender (`sendEmail` — server-only, one `fetch`, no SDK, reads `RESEND_API_KEY`), the shared
  HTML **`renderEmailLayout`** (table-based + inline-styled — the only mail-client-safe technique;
  palette hex inlined on purpose since oklch tokens never reach an email client) + `escapeHtml`, and
  **one template per email** in `templates/` (`comment-notification` today) that renders `{ subject,
  text, html }` from plain data. Moved out of the blog so any module/app can send — **modules can't
  depend on modules**, so a second sender could never reach a helper stuck in the blog. Adding an
  email = drop a `templates/<name>.ts` + re-export; the feature passes data, the brick renders. Doc:
  [`docs/packages/email.md`](../../docs/packages/email.md).
- **`@indiecrafts/schema/generated` — the shared home for Sanity typegen output.** The schema is
  composed at the app, so `pnpm sanity:typegen` (app) extracts it → `schema.json` and generates typed
  GROQ document + query-result types into `code/packages/schema/src/generated.ts`, imported via
  `@indiecrafts/schema/generated` (the package's `./*` wildcard export). This is deliberately a
  **shared package, not app-local**: the blog module fetches its own data (`sanityFetchLive` in
  `llms.ts`/`Comments.tsx`/`BlogPostList.tsx`), and a module must never import an app — so the
  generated types live where both the app and modules can import them. Ships as a committed
  placeholder (`export {}`) until first generation; adopt incrementally (replace a hand-written result
  type like blog's `PostListItem` with the generated `…QueryResult`). `schema.json` is gitignored.
- **`@indiecrafts/consent` — cookie consent extracted to a brick.** The consent runtime (banner ·
  store · Consent-Mode gates/hooks · `ManagePreferencesButton`), the `cookieConsent` schema +
  category/entry objects + `getCookieConsent`, and the "Cookies & consentement" desk (moved out of
  `@indiecrafts/sanity`) now live in `code/packages/consent/`, shipped as the `consentSanity`
  **`SanityModule`** barrel — one line in `composeSanity([...])`. Signal types live in
  `@indiecrafts/consent/consent-signals`; the banner mount + GA `<head>` script stay in the app. Doc:
  [`docs/packages/consent.md`](../../docs/packages/consent.md).
- **`@indiecrafts/config` newsletter config + `features.newsletter`.** New `newsletter` object —
  `destination: "sanity" | "provider" | "both"` (default `sanity` → zero config) and `provider:
  "none" | "buttondown" | "mailchimp" | "resend"` — plus the `features.newsletter` flag. Provider
  secrets read from env server-side, never `NEXT_PUBLIC_`.
- **`@indiecrafts/ui-components` newsletter block + new `form/` domain.** `Newsletter` renderer
  (server wrapper gating on `features.newsletter` + client `NewsletterForm` — 3 variants
  card/inline/banner, honeypot, idle/submitting/success/already/error states) at
  `renderers/web/form/`; `NewsletterModule` added to the `BlockModule` union + `BLOCK_RENDERERS` +
  the `INLINE_TYPES` allowlist. Posts to `/api/newsletter`. Colocated story + doc. Why: newsletter
  now, contact/form blocks later — the `form/` domain is the home for both.

### Changed

- **UI bricks nested by platform (`src/<platform>/<domain>/` + `src/shared/`) — scaffolds
  multi-platform.** Anticipating several UI systems across platforms, every UI brick now carries
  `web/` + `native/` (reserved, README) + `shared/`. `@indiecrafts/ui` moved its 61 shadcn primitives
  + `use-mobile` into `src/web/` (imported `@indiecrafts/ui/web/<name>`); `@indiecrafts/ui-components`
  flattened `renderers/web/<domain>/` → `src/web/<domain>/` and moved `types.ts` → `src/shared/types.ts`
  (imported `@indiecrafts/ui-components/web/<domain>/<Name>` + `/shared/types`); `@indiecrafts/ui-tokens`
  reserved `src/native/` + `src/shared/` (web CSS stays put — moving it has outsized blast radius for
  zero gain). A React-Native design system now lands **inside** each brick under `native/` — never a
  top-level `packages/web` split or a `ui-native` sibling; token values + `shared/` contracts stay one
  home, only components fork per platform. Platform is explicit in every UI import path. Updated:
  `ui`/`ui-components` `exports`, shadcn `components.json` `ui`/`hooks` aliases → `@indiecrafts/ui/web`,
  a tsconfig `paths` entry for `@indiecrafts/ui/web/*`, ~48 import sites (app · blog · consent ·
  waitlist), and fixed a latent `_mock.ts` bad relative import. `tsc` + `lint` green. Convention:
  `code/packages/.claude/CLAUDE.md → Categorisation & platform`.
- **`@indiecrafts/utils` → subpath-only; `consent-signals` moved to its domain owner; `formatPostDate`
  renamed.** The utils brick dropped its `.` barrel (`src/index.ts` deleted) for explicit-extension
  subpath `exports` — `@indiecrafts/utils/{cn,logger,slugify,video-embed,format-date}`, the sanity-style
  pattern that resolves for every consumer with no tsconfig `paths` entry. A barrel costs build/HMR time
  and defeats tree-shaking; every other brick was already barrel-less, so utils now matches (the
  "one brick you may barrel" exception is retired). `consent-signals` — the seven Consent-Mode signal
  constants + the `CookieRow`/`ConsentCategory`/`ConsentSignal`/`CookieConsent` types — moved to its
  domain owner `@indiecrafts/consent` (`@indiecrafts/consent/consent-signals`, client-safe, no Sanity
  graph); `@indiecrafts/consent` dropped its now-unused `@indiecrafts/utils` dep. `formatPostDate` →
  `formatDate` (a generic date formatter, not blog-flavored). ~93 import sites updated to subpaths;
  `@indiecrafts/consent` added to the app's declared deps (it was a phantom import). Doc:
  [`docs/packages/utils.md`](../../docs/packages/utils.md).
- **`@indiecrafts/ui-components` reorganized platform → domain.** Renderers moved from a flat
  `src/renderers/` into `src/renderers/web/<domain>/` — `content` · `media` · `collection` ·
  `layout` — with the registry + portable-text map at `renderers/web/`. `src/types.ts` stays the
  platform-agnostic contract; `renderers/native/` is **reserved** (empty) for a future React-Native
  set that mirrors the same domains + shares `types` + tokens. Consumers import
  `@indiecrafts/ui-components/renderers/web/<domain>/<Name>` (blog + app updated). Why: establish the
  stable **domain** axis now and the **platform** axis lazily — web renderers (Tailwind/DOM) can't be
  reused by RN, so an empty `mobile/` today would be scaffolding, not architecture.

### Added

- **`@indiecrafts/storybook` — living design-system docs.** A new Storybook (`@storybook/nextjs-vite`)
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
- **`@indiecrafts/schema` — shared Sanity primitives + composable Studio config.** A new brick
  holds the doc-agnostic object types (`localeString` moved from app-core, `seoMeta` moved from
  the blog) so no module reaches into another for a field type. `@indiecrafts/sanity/module`
  adds the **`SanityModule`** contribution contract + **`composeSanity()`**: each owner
  (`sharedSanity`, `coreSanity`, `blogSanity`) exports its schema + desk section + create
  templates + i18n types, and `sanity.config.ts` composes them — **one line per module**,
  no more four hand-wired lists. Makes each module's Sanity config standalone. Guide:
  [`docs/packages/sanity.md` → Composing the Studio config](../../docs/packages/sanity.md).
- **`@indiecrafts/sanity/write` — server-only authenticated write client.** New `./write`
  export: `writeClient` (Editor-role `SANITY_API_WRITE_TOKEN`, `import "server-only"`). The one
  runtime write path (blog comments today); callers hard-code `_type` + whitelist fields so no
  untrusted input is spread into a mutation.

### Changed

- **`FeaturedMedia` gained `autoplay` + `controls`.** `autoplay` mounts the player
  immediately, muted + looping (ambient backdrop, no play button); `controls` toggles the
  native/provider player UI (embeds get `mute=1`/`controls=0` url params per provider).
  Defaults preserve the click-to-play facade with controls on.
- **`FeaturedMedia` replaces `VideoEmbed` + `PlayBadge`** in `@indiecrafts/ui-components` —
  **one structure for a featured image or video**. The video plays **inline** (poster swaps
  to an `<iframe>`/`<video>` in place on click, facade/lazy-mount) — **no dialog**. Handles
  the image (CDN-sized, lqip blur), the play button, and the badge-only marker
  (`interactive={false}`). i18n-agnostic (`playLabel` prop). Used by the post hero, blog
  frontpage, and all cards, so image and video render identically everywhere.

### Added

- **Dailymotion featured-video support** in `@indiecrafts/utils` `parseVideoEmbed` — accepts
  `dailymotion.com/video/<id>`, `/embed/video/<id>`, and short `dai.ly/<id>` (strips a
  `_title` suffix; id `^[a-zA-Z0-9]{5,32}$`), producing `dailymotion.com/embed/video/<id>`.
  Joins YouTube/Vimeo/file. Host must be in the app's `frame-src` CSP (done).
- **`VideoEmbed` + `PlayBadge` extracted to `@indiecrafts/ui-components`** (`renderers/`)
  from the blog module, so app pages + blog share one video player + badge. `VideoEmbed`
  (was blog `HeroVideo`) and `PlayBadge` are i18n-agnostic — labels are passed in, not
  self-resolved — so the package owns no message namespace. Enables the page-builder
  `embed`/`hero` media block without duplicating the player.

- **`@indiecrafts/sanity/image` — the `next/image` CDN loader.** New subpath export
  `sanityImageLoader`: an isomorphic loader that appends `?w=&q=&auto=format&fit=max` for
  `cdn.sanity.io` + `images.unsplash.com` (SVG + non-CDN sources pass through). Wired
  app-side via `images.loaderFile`. Behavior/usage logged in the app changelog.
- **`@indiecrafts/ui-components` — shared page-builder blocks.** Extracted the 10 generic
  block renderers **down** out of `@indiecrafts/blog` so the app and the blog render the same
  components and look identical (no duplication → no drift). Ships `BLOCK_RENDERERS` (a
  composable `_type`→component map + `renderBlock`), the shared `portable-text-components`
  map, `ModuleSection` · `Cta`, and the block `types` (`BlockModule` union). The blog's
  `ModuleRenderer` now spreads `BLOCK_RENDERERS` and adds its 3 blog-specific dispatchers
  (`blog-index · blog-post-list · blog-post-content`); `AnyModule = BlockModule | BlogModule`.
  **Renderers moved, schemas didn't** — the block `module.*` schemas stay in the blog for now
  (`person-list`/`quote-list` schemas ref blog `person`/`quote` docs), a later phase moves the
  schemas + a `blockContent` factory. Blog renders byte-identically; build green.
