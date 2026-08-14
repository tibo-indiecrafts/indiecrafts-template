# Changelog — app (`@indiecrafts/web`)

One shared record for **code and design** — every change that alters behavior,
config, a route/convention, or a design token lands here in plain language,
explaining the _why_, not just the _what_. Dev and design write to the same file
so an agent (or a client) reads one history, not two.

**Not here:** docs-site changes → [`docs/CHANGELOG.md`](../../../docs/CHANGELOG.md);
the repo-wide roll-up → [root `CHANGELOG.md`](../../../CHANGELOG.md).

- **Design/token changes** are also governed by `DESIGN.md` (the token contract);
  **code/convention changes** by `CLAUDE.md`. This file is where both are logged.
- Format follows [Keep a Changelog](https://keepachangelog.com); versions are
  `[major.minor.patch]`. Categories: **Added · Changed · Deprecated · Removed ·
  Fixed**. Tag design-only entries with _(design)_ for quick scanning.
- After any token change, re-sync `theme.hexColors` and run `pnpm verify:contrast`.

## [Unreleased]

### Changed

- **Config split — the app owns its instance config (multi-app readiness).** `@indiecrafts/config`
  is now **shared primitives + the generic page-config contract only** (i18n, Intl format, env/CSP,
  logging, `site` deploy env, `PageConfig`/`isPageVisible`). The app's own **instance** config —
  `theme`, `fonts`, `features`, and the `pages` map (+ the derived `StaticAppPathname`) — moved to
  `apps/web/src/config`, imported via a new `@/config` barrel that re-exports the shared primitives.
  _Why:_ a second app is coming, and each app needs its own look + feature set + routes; keeping them
  in the shared package would force both apps to share one. `site` stays shared on purpose — it's pure
  deploy env, already per-deployment, and read by shared packages. `StaticAppPathname` now derives from
  the `pages` map, so adding a route is one edit (no parallel key list). No user-visible change — the
  app renders identically.
- **Islands read app-injected flags, not a central registry (invert flag ownership).** Modules +
  shared packages can't import an app, so the app now **injects** each island's config once at boot
  (`src/instrumentation.ts` → `@/lib/islands`): the blog reads a `configureBlog(...)` holder
  (route-gate + settings + llms); the newsletter/waitlist page-builder blocks read `configureBlocks(...)`;
  their Studio desks became `xSanity(enabled)` functions; `getLegalAcceptance(locale, flags)` takes the
  legal flags; the `/api/newsletter*` + `/api/waitlist` routes gate on `features` directly (the module
  `isXEnabled()` helpers are gone). _Why:_ so the same island can mount in a second app with a different
  feature set. Each holder defaults to the template's set, so a single app is correct even before the
  injection runs. A route-gate test proves a second app can disable the blog via injected flags.
- **Public-form security hardening (newsletter · waitlist · comments).** An audit found the forms
  well-built (whitelisted server-only Sanity writes, parameterized GROQ, escaped email + comment render,
  same-site origin, body-cap) but two enforcement gaps + a few unbounded fields. Fixed: **(1) Turnstile is
  now wired end-to-end** — a shared `TurnstileWidget` (`@indiecrafts/ui-components/web/form`) renders on
  all three forms when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set and sends `cf-turnstile-response`, so setting
  the key pair now turns on real CAPTCHA instead of 403-ing every submit (the old configured-but-not-wired
  trap). **(2) The in-app rate limiter is activatable per deploy** — `pnpm setup:kv` creates a
  **per-env** `RATE_LIMIT_KV` namespace (dev/staging/prod, like the R2 buckets — a staging load-test can't
  burn prod's budget) and binds it in `wrangler.toml` (it fell open by default because the binding was
  commented out); the CF WAF rule stays the separate edge layer. **Bounds:** `language` is now allowlisted to `isLocale`, tag strings capped
  (≤40), comment `authorEmail` capped (≤254) and `postId` format-checked + **verified to reference a real
  post** before write. **Hygiene:** comments now stamp `consentPolicyVersion` (parity with newsletter /
  waitlist); the consent-policy lookup no longer swallows a Sanity error silently; `/api/emails/test` gained
  a body-size cap; `/api/i18n/translated-slug` gained a CDN cache header (read-amplification). A skew-safe
  submit-timing heuristic (`startedAt`) drops near-instant bot posts. Verified: `tsc` + `lint` + new
  validator tests. Doc: [`setup/deployment`](../../../docs/apps/web/setup/deployment.md) § one-time setup
  (the `pnpm setup:kv` step) + the Turnstile block in `.env.example`.

### Added

- **Visual-verification rule — look at the pixels before "done".** A new engineering rule
  (`.claude/rules/visual-verification.md`, auto-loaded on UI work) makes screenshot review a
  required step, not an option. Green tests do not prove a human can see the screen: jsdom has no
  layout, and snapshots diff markup, not pixels. The loop: render the affected pages, screenshot at
  the three adaptive widths (375 · 768 · 1280), review the _images_ for overlap / clipping /
  off-centre / dark-mode grey-on-grey, fix, and re-screenshot before calling the task done. Verify
  the mechanism (reflow vs context-swap), stub dynamic data, and record intentional asymmetry so it
  is not "fixed". A **"Looked at it"** line joins the `self-review` checklist, and the design guide
  [`adaptive-responsive`](../../../docs/apps/web/design/adaptive-responsive.md) gains a matching
  section. _Why:_ a screen that renders is not a screen a human has seen — a passing suite tests the
  app you wrote, not the app the user sees.
- **"Policies updated — please Accept" banner (legal re-acceptance).** A non-blocking bottom banner
  (`@indiecrafts/consent`'s new `LegalNotice`) tells a returning visitor when the **Privacy Policy /
  Terms / Terms of sale** changed and records a one-click **Accept**. Trigger = the tracked legal pages'
  editor-set `lastUpdated` (the same signal that already re-prompts cookie consent), composed into an
  effective version by `getLegalAcceptance`. **Deposit = a real first-party cookie**
  `<site.prefix>.legal-ack` (SameSite=Lax, Secure on https, 1-year), **server-read** in the layout so the
  banner is decided server-side — no flash. Copy is edited per language in Sanity (`legalConsent`
  singleton, Studio → **Mise à jour des documents légaux**), no `messages` fallback. **Cookie declared:**
  the new cookie is a strictly-necessary row in the cookie declaration (`cookieConsent.cookies[]`) so it
  appears on the cookie-policy page (ePrivacy). Cookie consent stays its own granular banner — not bundled
  with terms; the legal notice (imprint) is excluded. Seed ships `legalConsent` (en/fr) + the declaration
  row. _Why:_ when the terms change, a returning visitor should be told and their acknowledgment recorded.
  Doc: [`docs/packages/consent.md`](../../../docs/packages/consent.md).
- **"New version available" banner, copy edited in Sanity.** The locale layout now mounts
  `@indiecrafts/version`'s `UpdatePrompt` and the app serves `GET /api/version` (`no-store`, returns the
  live deploy's `buildInfo`). An open tab notices when a new version shipped and offers a reload — the
  button, plus a safe auto-reload on the **next** navigation (never forced). The banner **copy is edited
  per language in Sanity** — `siteMeta.<locale>.versionPrompt` (`message` · `reload` · `dismiss`), Studio
  → SEO par langue → Pages système → Bandeau « nouvelle version », read by `getVersionPrompt`
  (`src/lib/system-pages.ts`). **No fallback:** the banner mounts only when all three strings are set, so
  the `common.updateAvailable` / `reload` / `dismiss` keys were removed from `messages/`. _Why:_ frequent
  deploys shouldn't leave open tabs on stale code, and the copy is content — it belongs in Sanity with
  everything else. Doc: [`docs/packages/version.md`](../../../docs/packages/version.md).

### Changed

- **Studio desk is now grouped per app (`composeStudio`).** `sanity.config.ts` swaps the flat
  `composeSanity` for `@indiecrafts/sanity`'s new **`composeStudio([{ title, modules }])`** — one hub
  Studio, one dataset, but the desk splits into **"Site web"** (this app's content — home, blog,
  newsletter, waitlist) and **"Contenu partagé"** (site-wide config every app/lens reads — SEO, nav, UI
  messages, legal, cookies/consent, E-mails). `coreSanity` keeps the shared surfaces; a tiny `homeSanity`
  carries the home desk entry into the app group (its `homePage` schema still registered by `coreSanity`).
  No `_id`/editing change — every singleton/collection resolves as before, just organized per app. _Why:_
  multi-app readiness — [`config/multi-app`](../../../docs/apps/web/config/multi-app.md).
- **Theme modes, footer maker-credit, rich-result image + 3 display toggles moved to Sanity
  `siteSettings` (editor-controlled, no deploy).** Six things that lived in `@indiecrafts/config` now
  read from Sanity: **theme modes** (`themeModes` — light/dark/system/forced, over the `themeConfig` code
  default; `src/lib/theme.ts`'s constants became functions and the layout prop-feeds the client
  ThemeProvider/toggle — next-themes' pre-paint script still prevents a flash); the **footer maker
  credit** (`madeBy` — deleted from config, seeded with the indiecrafts.dev values, prop-fed to
  `MadeByCredit`; a client can now rebrand or clear it); the site-wide **rich-result image**
  (`schemaImage` — was `seoDefaults.schemaImage`); and **three display toggles** (`showLocaleSwitcher` ·
  `showStructuredData` · `showFaq`) as a **two-layer** override (code `features.*` stays the master; the
  Sanity boolean can hide). All read via the already-cached `getSiteSettings()` in server contexts, so
  no new fetch and no SSG break. Sanity typegen regenerated. **Skipped:** `blogComments` (module
  boundary) + `formatDefaults` (no consumer). _Why:_ a client edits their brand/theme in the CMS.
  Docs: [`config/theme-modes`](../../../docs/apps/web/config/theme-modes.md) +
  [`config/navigation`](../../../docs/apps/web/config/navigation.md).
- **UI chrome strings moved to Sanity (`uiMessages.<locale>`), fed to next-intl.** The remaining
  `messages/` copy — nav, cookies, validation, blog UI labels, system pages — is now owned in a
  per-locale `uiMessages` singleton (Studio → **Textes de l'interface**). `src/i18n/request.ts`
  reads it (`getUiMessages`) and **overlays it on the bundled `messages/<locale>.json`**
  (`overlayMessages`, unit-tested) — Sanity is the edit surface, the JSON stays a **fallback** (a
  Sanity outage or blank field never blanks the chrome). Every `t(...)` call site is unchanged. The
  schema fields are **generated from the message shape** so they can't drift; `pnpm seed` populates
  the docs (`buildUiMessages`). **`typography`** (i18n/format rules) is deliberately excluded — it
  stays in the JSON file (technical, not editorial). Doc:
  [`config/i18n-and-routing`](../../../docs/apps/web/config/i18n-and-routing.md) § Where UI text lives.
- **Maintenance mode is now a live Sanity toggle (was code-only).** `siteSettings.maintenanceMode` (Studio
  → Paramètres du site → Indexation) lets an operator take the site offline (503 behind the branded
  `/maintenance` page) **without a redeploy** — the proxy reads it from Sanity's CDN with a ~30s
  per-isolate cache, **fail-open** (`src/lib/maintenance.ts`; a Sanity error never 503s the site). The
  build-time `features.maintenance` flag stays as a **hard override** that short-circuits the Sanity read.
  `proxy.ts` is now async (`features.maintenance || getMaintenanceMode()`), and
  `@indiecrafts/system-pages`' `maintenanceRewrite(request, isDown)` became **pure** (the app decides
  `isDown`). _Why:_ maintenance is the one flag with real ops value — flipping it shouldn't need a deploy.
  Doc: [`setup/maintenance-mode`](../../../docs/apps/web/setup/maintenance-mode.md).
- **`@indiecrafts/config` internal reshape (no app-visible change).** The config god-file was split into
  per-concern modules behind the same `@indiecrafts/config` barrel, dead exports removed, and the unused
  `./types` subpath dropped — all 129 import sites unchanged (verified by `tsc`). See the packages
  changelog. The only new public config surface this cycle is on Sanity (maintenance), not code.
- **Homepage is now an editor-composed Sanity page-builder (was code + `messages/`).** The editorial
  sections — hero, feature grid, pricing, testimonials, email-capture CTA, FAQ — moved out of
  `messages/pages.home.*` into a per-locale **`homePage.<locale>`** singleton (Studio → **Accueil**),
  an ordered `pageModules[]` of the same `module.*` blocks the blog body uses, painted by the shared
  `renderBlock` registry (`getHomePage` → `src/lib/home.ts`, `home-queries.ts`). Add / reorder / hide
  sections from the Studio, no code change. The dynamic `FeaturedArticles` (live posts) and the
  template's icon / motion / blocks **showcases stay in code** (their content is code). **FAQ SEO**
  (`getFaqItems` + FAQPage JSON-LD) now reads the homepage's `accordion-list` block instead of
  `messages` — one source for the visible FAQ and the rich result. Deleted the five superseded section
  components (`Features` / `Cta` / `Pricing` / `Testimonials` / `Faq`) and trimmed `messages/{en,fr}.json`
  from 246 → 191 strings. Seed gains `buildHomePage()` (`homePage.en` / `.fr`). _Why:_ a client edits
  their landing page in the CMS, not the codebase.

### Added

- **Form endpoints hardened + Cloudflare edge as code + Worker logs.** The three public POST routes
  (`/api/{newsletter,waitlist,comments}`) now run through `@indiecrafts/security` **`withGuard`** —
  same-site origin + body-cap + fixed-window rate-limit + optional Turnstile — on top of each engine's
  existing validation/honeypot/whitelisting. **Cloudflare as code:** a new Terraform layer
  (`code/infra/iac/cloudflare/`, provider `~> 5`) provisions the **edge** `wrangler` can't — **auto
  custom domain** · Managed WAF · the **`/api/*` rate-limit rule** (the guard's primary limiter) ·
  **Bot Fight Mode** · **Cache Rules** (immutable `/_next/static`, bypass `/api` + `/studio`) +
  **Tiered Cache** · zone hardening (SSL strict · TLS 1.2 · Always-HTTPS) · a **Turnstile widget**
  whose keys feed the app env. **Per app × per env** — a reusable `modules/site/` + `apps/web/env/
{dev,staging,prod}.tfvars`, state isolated per Terraform workspace, run via
  `infra:web:{plan,apply,output}:<env>` (mirroring `deploy:web:<env>`). **Worker Logs** enabled on
  every env (`wrangler.toml` observability — base + dev/staging/prod). Env: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
  - `TURNSTILE_SECRET` + an optional `RATE_LIMIT_KV` binding. Docs:
    [`setup/cloudflare-iac.md`](../../../docs/apps/web/setup/cloudflare-iac.md) +
    [`packages/security`](../../packages/security/README). _wrangler owns the Worker; Terraform owns the edge._
- **Logging moved to `@indiecrafts/logger` (structured · edge-safe · Sentry-ready).** The app + the
  three modules now import `logger` from the new `@indiecrafts/logger` brick instead of the retired
  `@indiecrafts/utils/logger` (12 import sites migrated, call sites untouched — the `error()` signature
  is back-compatible). Wired via `transpilePackages` + a dep on app/blog/newsletter/waitlist. Behavior
  change: **prod console is `"silent"` by default** (`logging.levels` in `@indiecrafts/config`), so live
  sites emit no console noise; raise it live with **`NEXT_PUBLIC_LOG_LEVEL`** (added to `.env.example`)
  and error/fatal still reach Sentry when the opt-in transport is wired. Dev gets pretty colored output;
  prod/Workers get one JSON line per log (captured by Cloudflare Workers Logs, already `enabled` in
  `wrangler.toml`). Doc: [`packages/logger`](../../packages/logger/README).
- **Safe multi-instance reuse — one `DEFAULT_SITE_PREFIX` namespace + a deploy guard.** Reusing the
  template per client under **one shared Cloudflare account** could silently clobber: the Worker + R2
  names were hardcoded `indiecrafts-web*`, so a 2nd client who forgot to rename would `deploy:web:prod`
  **into the 1st client's Worker + ISR bucket**. Now one knob — `DEFAULT_SITE_PREFIX` in
  `@indiecrafts/config` (env-overridable via `NEXT_PUBLIC_SITE_PREFIX` → `site.prefix`) — is the project
  namespace: it **prefixes the browser keys** (consent record `${prefix}.cookie-consent`, next-themes
  `storageKey` `${prefix}-theme`, the next-intl locale cookie `${prefix}_NEXT_LOCALE` via
  `localeCookieName`) so instances never collide even on a shared origin. **`pnpm project:rename <slug>`**
  rewrites the config default **and** every `wrangler.toml` resource name (`<slug>-web*`) in one command
  - prints the R2 buckets to create; backups (`backup-common`) follow the slug. **A `staging`/`prod`
    deploy + `secrets:sync` are now blocked** while the names are still the template default
    (`assertRenamed` in `scripts/lib/project.mjs`; `ALLOW_DEFAULT_SLUG=true` lets the template's own
    indiecrafts.dev deploy through). `doctor:env` prints a **site-identity** block + warns on prefix/deploy
    drift or a shared-project `production` dataset. **Fail-loud:** an empty `siteName` in production now
    `logger.error`s (once/request, via `getSiteSettings`) instead of silently rendering the template brand.
    `.env.example` reworded (Resend = one shared account per key → per-client key for isolation). Docs:
    every `setup/*` page (new-client, deployment, environment, backups, scripts, launch-checklist,
    workspace) + [`packages/config`](../../packages/config/README) + [`packages/email`](../../packages/email/README).
- **Homepage section titles support brand highlights via `RichTitle`.** The `Features` section `<h2>`
  now renders through `@indiecrafts/ui-components/web/RichTitle`, so wrapping a word in `[[ ]]` inside
  the `messages/` title colours it in the brand accent — the home `features.title` is now
  `"Built to [[cover]] your needs"` (FR `"…[[couvrir]]…"`). The app gains a direct `@indiecrafts/ui-components`
  dependency. _Why:_ one reusable, config-first way to emphasise a title word, shared with the CMS
  (Sanity titles use the same marker). Doc: [`design/typography`](../../../docs/apps/web/design/typography.md) § Title highlights.
- **Studio "Send test" for emails → `/api/emails/test`.** A new server route (Node) lets an editor
  verify transactional email actually lands: it sends a sample of every **enabled** email to a typed
  address. Triggered from Studio → **E-mails → ⋯ → "Envoyer un test"** (the `sendTestEmailAction` wired
  via `document.actions` in `sanity.config.ts`). **Security:** gated by `features.studio`, then the
  caller's **Sanity session token** is verified against the project's `users/me` — not a public spam
  relay; test sends go only to the given address; `RESEND_API_KEY` stays server-side. `sanity.config.ts`
  now composes the E-mails singleton from every module's `emailGroups` (`emailSanity(modules)`) instead
  of a static `emailSanity`. Doc: [`packages/email`](../../packages/email/README).
- **Security headers moved to `@indiecrafts/security-headers` + hardened (behavior change).** The
  40-line inline CSP/headers/images block in `next.config.ts` collapses to one `securityHeaders({...})`
  call + `...imageDefaults` (the video/GA hosts + the `EMBED_HOSTS` knob stay declared app-side). The
  brick adds **three new headers in production**: `Strict-Transport-Security` (`max-age=1y;
includeSubDomains`, no `preload`), `Cross-Origin-Opener-Policy: same-origin-allow-popups`, and CSP
  `upgrade-insecure-requests`. Chosen to keep `/studio` working (COOP allow-popups for the Sanity login
  popup; COEP/CORP not added). `getCurrentEnvironment`/`getCSPConnectSources` stay in `@indiecrafts/
config`. **Note:** HSTS is sticky — it only ships in prod over HTTPS. Doc:
  [`seo/security-headers.md`](./seo/security-headers) + [`packages/security-headers`](../../packages/security-headers/README).
- **Waitlist wiring — full page + `/api/waitlist` + `waitlist:export`.** The app-side surfaces for the
  new `@indiecrafts/waitlist` module: a **full `/waitlist` landing page** (`[locale]/waitlist/page.tsx`,
  a thin shell — gate + `DefaultLayout` + SEO — rendering the module's `WaitlistLanding` view;
  registered in the `pages` map), a gated `POST /api/waitlist` route (→ the module's `join()`),
  `waitlistSanity` added to `composeSanity([...])` (Studio → **Liste d'attente**), the module wired via
  `transpilePackages` + a tsconfig `paths` entry + a `@source` line + an app dep, and a
  `pnpm waitlist:export` script → `backups/waitlist/…csv`. **All waitlist copy is Sanity-only** — the
  form on `waitlistSettings`, the page SEO on `siteMeta.<locale>.pageSeo` (`pageId: "waitlist"`,
  auto-listed from the `pages` map) — nothing in `messages/`. Seed adds waitlist settings + 2 demo
  entries + the `waitlist` pageSeo (EN/FR). Also added the missing `@indiecrafts/utils/*` tsconfig
  `paths` entry (the utils package is subpath-only — `@indiecrafts/utils/cn`/`logger` — so the app
  needs the path like every other brick).
- **CI now enforces `verify` + a real Worker build; per-PR previews.** `.github/workflows/test.yml`
  became a full CI: blocking **verify** (tsc · lint · format:check · verify:contrast · tests +
  tags/lint:scripts/test:scripts) and **build** (`build:cf` — the OpenNext Worker build, catching
  prerender + CF-only breakage like Shiki WASM on every PR). Previously CI ran only vitest + Storybook
  - e2e, so **tsc / lint / format / contrast / build never gated a PR** (the docs already claimed they
    did — now true). Added an advisory **docs** build (VitePress) + GitHub **dependency-review**, and
    `preview.yml` — a per-PR Cloudflare **version-preview URL** commented on the PR (same-repo only). The
    `build` / `preview` jobs read the repo's Environment vars/secrets. **Secrets:** `secrets:sync` stays
    a local one-time op — `keep_vars = true` means CI deploys never wipe the Worker's synced runtime
    secrets, so CI needs no `.dev.vars`. Docs: `setup/scripts.md` (CI table) + `setup/deployment.md`.
- **Backups — Sanity + D1, local/remote (R2), scheduled.** New `backup:web:sanity` (retires
  `content:export`) + `backup:web:d1:<env>` scripts: a local dump to a clean, gitignored
  `backups/{sanity,d1,subscribers}/`, and `-- --remote` also uploads to a per-env R2 bucket
  `indiecrafts-web-backups-<env>`. Each keeps the last 10 per source (shared `lib/backup-common.mjs`;
  the `prune` logic is unit-tested). A nightly `.github/workflows/backup.yml` (cron + manual dispatch)
  dumps → R2; rotate the remote copies with an R2 bucket lifecycle rule. **Fixes** the previously
  **untracked `content-backups/`** — Sanity dumps + subscriber CSVs (with emails) were git-committable;
  `**/backups/` + `content-backups/` are now gitignored. Restore: Sanity → `content:import`; D1 →
  Time Travel / `wrangler d1 execute --file`. Docs: `setup/backups.md`.
- **Newsletter double opt-in + external-embed CSP knob + subscriber export.** New app surfaces for
  the newsletter emails: a `GET /api/newsletter/confirm` route (validates the one-time token → flips
  the subscriber to `confirmed` → redirects home with `?newsletter=confirmed|invalid`), an
  `EMBED_HOSTS` array in `next.config.ts` (empty by default; concatenated into `form-action`,
  `frame-src`, `script-src`, `connect-src` so an editor-pasted external newsletter form in a
  `custom-html` block can actually submit past the CSP), and a `pnpm subscribers:export` script →
  `backups/subscribers/subscribers-<timestamp>.csv`. The engine + email config live in
  `@indiecrafts/newsletter` + `@indiecrafts/email`; this logs the app-side wiring.
- **One-click comment moderation route + `comments:export`.** `GET|POST /api/comments/moderate` — a
  self-contained handler behind the email's Approve/Spam/Delete buttons: **GET** renders a branded
  confirm page (read-only), **POST** performs the action (`@indiecrafts/blog/lib/moderate`). The
  mutation is POST-only so an email-link scanner can't auto-moderate; a one-time token authorizes it.
  Plus `pnpm comments:export` → `backups/comments/…csv`. Gated by `features.blogComments`; needs
  `SANITY_API_WRITE_TOKEN`.

### Changed

- **Container queries: fixed a live bug + moved reusable blocks off the viewport.** `@min-4xl:` is
  invalid Tailwind v4 (named sizes are `@4xl:`; `@min-[…]`/`@max-[…]` are arbitrary-only) — it
  generated nothing, so the homepage **Features** grid was stuck single-column on every screen.
  Fixed → `@4xl:` (`Features.tsx`). Then migrated the two dual-width block renderers that keyed off
  the **viewport** — `CardList` + `StatList` (`ui-components/web/collection/`) — to **container
  queries** (`@container` on the wrapper + `@2xl:`/`@4xl:` columns), so a block dropped inline in the
  ~768px blog article column no longer shows desktop columns while the same block full-width shows
  more. `PersonList`/`Features`/`TopAuthors` were already correct (the reference). Reconciled the
  doctrine: fixed every `@min-<name>` example and added one rule — _"viewport sizes the PAGE,
  `@container` sizes a COMPONENT; any inline-embeddable `module._`block MUST be container-driven"* —
across`adaptive-responsive.md`, `DESIGN.md § Responsive`, `rules/adaptive-design.md`, and
`rules/component-architecture.md`. New **Storybook** doc `Adaptive & container queries`
(`storybook/stories/Adaptive.mdx`) with a drag-to-resize live demo. Verified: no `@min-<name>`remains;`tsc`+`lint`green. Best practice confirmed (Tailwind v4 + 2025 guidance): viewport for
macro/page,`@container`for micro/component, reflow-first, no JS`ResizeObserver` for layout.
- **Design rules are now adaptive-aware, not just "responsive".** New `rules/adaptive-design.md`
  (auto-loaded) + reworded `DESIGN.md § Responsive & adaptive behavior`, the app `CLAUDE.md` ALWAYS
  line, and the accessibility / self-review checklists. The rule: _same content reflowing = responsive
  (default); different content by context = adaptive, for that component only — **name the mechanism**_,
  plus container queries (`inline-size`), `pointer`/`hover` input-method queries, and safe-areas;
  375/768/1280 is the **floor**, not the definition. Explicitly warns off the anti-pattern (separate
  mobile codebase / device sniffing), matching the impeccable `adapt` skill. Consumer imports for the
  `ui-components` renderer reorg (see packages changelog) were updated (`renderers/web/…`).

### Added

- **Cloudflare Workers deployment (OpenNext) — replaces Netlify.** The app now deploys to Cloudflare
  Workers via `@opennextjs/cloudflare` across **dev / staging / prod**, with an **R2-backed
  incremental cache** for ISR. New `code/apps/web/`: `wrangler.toml` (3 envs, `nodejs_compat`,
  R2 binding, prod custom-domain block), `open-next.config.ts` (R2 cache), `.dev.vars.example` (local
  preview secrets), + `next.config.ts` `initOpenNextCloudflareForDev()`. **Deploy scripts are per app AND per env**
  — every name is `deploy:<app>:<env>` (`deploy:web:{dev,staging,prod}` at both the app and the root,
  which delegates); `build:cf` / `preview:cf` at the app, `preview:web:cf` at root. A second app reads
  `deploy:admin:<env>` — nothing env-generic or ambiguous. Auto-deploy via `.github/workflows/deploy.yml` (push to `main` → prod;
  manual dispatch for any env), using `CLOUDFLARE_API_TOKEN`/`ACCOUNT_ID` + per-environment Sanity
  vars/secrets. **Removed** `netlify.toml` + the dead `public/__forms.html` (Netlify Forms — the app's
  forms POST to `/api/*` now). Images need no image worker (the `next/image` Sanity CDN loader already
  bypasses Next's optimizer). Runbook + first-deploy checks (Shiki WASM, `/studio`, `nodejs_compat`):
  `docs/apps/web/setup/deployment.md`. Adds deps `@opennextjs/cloudflare` + `wrangler` — run
  `pnpm install` to resolve + lock before the first CI deploy.
- **Deploy tooling — secret sync, guarded prod, build stamp.** `secrets:sync:web:<env>`
  (`scripts/sync-secrets.mjs`) bulk-provisions the Worker's server secrets from `.dev.vars` via
  `wrangler secret bulk` (skips `NEXT_PUBLIC_*` + unfilled placeholders) — replaces manual `wrangler
secret put` × N; one dataset → same secrets to every env. `deploy:web:<env>` now routes through
  `scripts/deploy.mjs` (prod prompts for confirmation unless CI or `--yes`). `build:cf` stamps
  `src/lib/build-info.ts` (version · git sha · build time) via `scripts/version.mjs`. All
  per-app-per-env. Patterns mined from the sister repo's `sync-secrets.sh` / `deploy.sh` / `version.sh`,
  adapted to Node + the single-dataset model. Docs: `setup/deployment.md`.
- **Base-setup CLI scripts (mined from a sister multi-repo, filtered to this stack).** Adds
  `sanity:typegen` (extract the composed schema → typed GROQ results in the shared
  `@indiecrafts/schema/generated`, so app **and** blog import them — see packages changelog),
  `content:export` / `content:import` (Sanity `dataset export/import` wrappers — the CMS analog of a
  DB backup/restore; export→`content-backups/` read-only, import destructive + confirmation-gated),
  `doctor:env` (a `.env.local` preflight with clear "missing X" messages; now gates `seed` +
  `content:*`), `scan:placeholders` (pre-handoff scan of `code/`+`docs/` for leftover template
  tokens/lorem/`your_…_here` — deliberately **not** in CI since the template ships its own fill-me
  tokens), `clean` (wipe build artifacts; `--all` also `node_modules`), and `lint:scripts`
  (shellcheck) + `test:scripts` (Node's built-in runner over `scripts/*.test.mjs`). `lint:scripts`,
  `test:scripts`, and `tags:check` now run in `verify` + CI (`test.yml`). **Deliberately not ported**
  from the source repo: multi-env dev/deploy matrices, Cloudflare Workers/R2/Stripe/GDPR-salt tooling
  — wrong stack for a Sanity/Vercel marketing+blog template. Docs: `apps/web/setup/scripts.md`.
- **Newsletter capture — `/api/newsletter` + `subscriber` doc + Abonnés desk + `features.newsletter`.**
  A gated POST route (`src/app/api/newsletter/route.ts`) hands submissions to `subscribe()`
  (`src/lib/newsletter.ts`): validate (email + required consent + honeypot), then per
  `newsletter.destination` in config — dedupe + `writeClient.create` a `subscriber` doc
  (`sanity`, the zero-config default), forward to an ESP (`provider`), or both. Buttondown is the
  one live provider adapter; mailchimp/resend are stubs. New app Studio desk **Abonnés** groups
  subscribers by `status` (En attente / Confirmés / Désabonnés). `SANITY_API_WRITE_TOKEN` is the
  only key for the default path; provider keys stay server-only (`BUTTONDOWN_API_KEY`, never
  `NEXT_PUBLIC_`) — `.env.example` updated. Homepage `BlocksShowcase` now demos the block (banner
  variant); `pnpm seed` adds a demo block + 3 `subscriber` docs. **Why:** every client site wants
  email capture; this ships it config-first with no third-party account required to start.
- **`/api/comments` + `features.blogComments`.** A thin POST route mounts the blog comments
  feature (validation/write live in `@indiecrafts/blog`); the `<Comments>` section renders on
  each post when the flag is on. **`SANITY_API_WRITE_TOKEN` is now a runtime dependency** when
  comments are on (was seed-only) — `.env.example` updated; prefer a dedicated rotatable token.
  Seed adds one approved + one pending demo comment.

### Changed

- **Multi-author output in SEO + feeds.** `buildArticleSchema` takes `authorNames[]` and emits
  a single `Person`, an array of `Person`, or the org fallback; the post page passes every
  author. RSS repeats `<dc:creator>`, Atom repeats `<author>`, and the `.md` export joins the
  names — following the post `author` → `authors[]` change (blog module).
- **CSP `media-src` added** (`'self' blob: https://cdn.sanity.io`) so editor-uploaded
  featured videos (Sanity file assets) play in a native `<video>` — without it the element
  fell back to `default-src 'self'` and was blocked.
- **Homepage `FeaturedArticles` cards simplified + share `FeaturedMedia`.** The lead card and
  secondary rows now render their cover through the shared `FeaturedMedia` (image or
  inline-playable video, no modal); the lead uses a stretched title link so the whole card
  navigates while the play button plays in place. Distilled to media · category · title ·
  excerpt · author·date.

### Added

- **Dailymotion allowed in the `frame-src` CSP.** `next.config.ts` `frame-src` now includes
  `https://www.dailymotion.com` alongside YouTube-nocookie + Vimeo, so featured-video posts
  can embed Dailymotion (parser support lives in `@indiecrafts/utils`). The homepage
  `FeaturedArticles` cards pass the play-badge `label` explicitly now that `PlayBadge` moved
  to `@indiecrafts/ui-components` and takes it as a prop.

- **Sanity images sized at the CDN (`next/image` loader).** A `next/image` loader
  (`@indiecrafts/sanity/image`, wired via `images.loaderFile`) rewrites every image `src`
  to a CDN-sized source (`?w=&q=&auto=format&fit=max`) — Sanity + Unsplash resize/re-encode
  at the edge, so the full-resolution original is never downloaded and there's no
  double-fetch through Next's optimizer. Zero per-call changes (the 13 `next/image` sites
  already pass `sizes`/`fill`). Also fixed the three sites the loader can't reach: the
  gallery full-view raw `<img>` (`?w=1600`), the markdown export (`?w=1200`), and the
  `unoptimized` **logo** (raster logos now `?w=192`; the loader's SVG guard keeps vector
  logos untouched). _Why:_ covers previously shipped full-res originals into small slots.
  New rule `.claude/rules/sanity-images.md` + NEVER in `CLAUDE.md`; guide
  `docs/apps/web/config/images.md`.
- **`DESIGN.md` — spacing scale + interaction-state tokens** _(design)_. Added a numeric
  `spacing` step scale (`xs 4 · sm 8 · md 16 · lg 24 · xl 32`) so layout gaps come from a
  fixed vocabulary, and tokenized the two button hover deltas as `button-primary-hover` /
  `button-secondary-hover` variants (hover = tint/`muted` fill, disabled = 50% opacity — no
  new hue). Also aligned the `components` block to the Google spec sub-token names
  (`textColor`/`rounded`), added a `primary` alias for `brand`, and fixed the `letterSpacing`
  - stale-path lint errors: `npx @google/design.md lint` now reports **0 errors** (was 3).
- **Chip contrast fix** _(design)_. Darkened light `--muted-foreground` `oklch(0.556)` →
  `oklch(0.52)` (`#737373` → `#696969`) so `muted-foreground` on `--muted` (chips, `text-xs`)
  clears WCAG AA — **5.05:1**, was 4.0:1. Surfaced by the Google linter, which our own
  `verify:contrast` missed. Added the `muted-foreground`/`muted` pair to
  `scripts/check-contrast.mjs` so the gate now covers it. Dark mode already passed (6.9:1);
  hex mirror synced in `DESIGN.md`.
- **Homepage page-builder demo (`BlocksShowcase`).** A server section on the home page that
  renders `stat-list`, `step-list`, and `card-list` through the shared
  `@indiecrafts/ui-components` renderers — visible proof marketing pages and blog posts paint
  the **same** blocks. Chrome (`eyebrow`/`title`/`body`) reads from
  `pages.home.blocks.blocks`; the block payloads are inline demo fixtures standing in for
  Sanity-authored content. _Known gap:_ the demo fixtures are English-only (they mimic CMS
  content, not translated copy) — real `page` documents feed localized content from Sanity.

### Changed

- **Extracted the app into workspace packages + a blog module** (deps point down: app → module → packages).
  Packages: `@indiecrafts/config` (site config + types; cut the `MessageKey` coupling → `PageSeo` keys
  are `string`), `@indiecrafts/utils` (`cn`/logger/slugify/video-embed/consent-signals/format-date),
  `@indiecrafts/sanity` (client/live/env/token + `structure` builders), `@indiecrafts/ui` (61 shadcn
  primitives + `use-mobile`), `@indiecrafts/ui-tokens` (the design system — `globals.css`/`typeset.css`/`DESIGN.md`),
  `@indiecrafts/i18n` (shared next-intl nav for modules). Module: `@indiecrafts/blog` → `code/modules/blog`
  (queries + Studio stay in the app; app registers its schema via `sanity.config`). Consumed as source via
  `transpilePackages`; Tailwind `@source` scans the ui + blog packages. Fixed a latent broken import
  (`carousel` → uninstalled `@tabler`, now lucide). tsc + build green, every route × locale prerenders.

- **Analytics + cookie consent moved to Sanity; `features.cookieBanner` removed.**
  The GA measurement id and a `requireCookieConsent` toggle now live in
  `siteSettings.analytics` (Studio → Paramètres du site → Analytics & cookies),
  read by `getSiteSettings()`; the layout gates the GA script + Consent-Mode
  preamble + `<CookieBanner>` off those, and `CookieBanner` takes a `gaEnabled`
  prop (client can't read Sanity). Removed the `analytics` config export + the
  `cookieBanner` flag. Search-verification codes were already Sanity-driven — the
  dead `seoDefaults.verification` is gone and the seed now ships demo google/bing
  codes + a demo GA id. **CSP:** since the GA id is now a runtime value, `next.config.ts`
  allows Google's domains unconditionally (was build-narrowed). _Why:_ a client can
  paste their GA id + flip consent in the Studio with no redeploy, and the two are
  now coupled (consent actually gates GA). Also fixed a latent bug this surfaced:
  `<CookieBanner>` (a client component calling `useTranslations`) was rendered
  outside `NextIntlClientProvider` — dormant while the flag defaulted off, it
  500'd once Sanity enabled the banner; moved inside the provider.

- **Trimmed the `features` flag comments in `src/config/index.ts`** to one line each
  (the file dropped from ~51% comments). Full per-flag behavior already lives in
  `docs/apps/web/config/feature-flags.md` — the config now points there instead of
  duplicating it. _Why:_ one home per fact; duplicated docs drift.

### Added

- **Complete cookie-consent (CMP) in Sanity.** The old all-or-nothing bar becomes a full consent
  manager: a `cookieConsent` singleton (Studio → **Cookies & consentement**) holds banner copy,
  consent **categories** (necessary + analytics/marketing/preferences, each mapping to Google
  Consent-Mode signals), and a **cookie inventory**. The banner offers **Reject all / Customize /
  Accept all** (equal weight, GDPR); a **preferences dialog** (shadcn `Dialog` + `Switch`) toggles
  each category (optional default off); choices persist in `localStorage` with a `version` (bump →
  re-prompt) + timestamp and push a per-signal `gtag('consent','update')`. The cookie-policy page
  auto-renders the inventory (grouped cards) + a Manage-preferences button. **App consent slots:**
  `useConsent()` (`@/hooks`), `<ConsentGate category>` and `<ConsentScript category …>` load any
  third-party pixel/embed only after its category is granted (GA still loads always, gated via
  Consent Mode). Read path `getCookieConsent()` (`src/lib/cookies.ts`, React `cache()`, Sanity-only).
  Guide: `docs/apps/web/config/cookie-consent.md`.

- **Navigation + footer menus are now edited in Sanity.** The header menu and
  footer columns move out of `@/config` (`headerNav` / `footerNav` and the
  `NavLink` / `NavGroup` types are removed) into a new `navigation` singleton —
  the **sole runtime source, no config fallback** (same contract as the SEO
  surface). One shared structure with per-language labels (`localeString`); each
  link is a reusable `navItem` with an internal (typed route key) / external
  toggle. Internal links are flag-gated at read time, so a link to a disabled
  route (e.g. CGV, or any blog route) silently drops — no dead links. Read via
  `getNavigation(locale)` (`src/lib/navigation.ts`, React `cache()`, empty-on-
  error). _Why:_ a client can reorder, rename, add, or regroup menu items without
  a code edit. **Header dropdowns + rich links:** a header item can have a
  `children` submenu (renders as a shadcn `NavigationMenu` dropdown), and each
  dropdown link can carry a free-text Reicon `icon` + a `description`. A new
  Studio **Navigation** desk section; `pnpm seed` writes a starter menu (Home +
  Blog, a demo Resources dropdown, a Legal footer column). Guide:
  `code/docs/config/navigation.md`.
- **Legal pages: `/legal` split into five dedicated, Sanity-editable pages.** Renamed
  the single legal page to **Mentions légales** and added **Privacy policy** (RGPD),
  **Cookie policy**, **Terms of use (CGU)**, and **Terms of sale (CGV)** — each a
  static route with a per-locale slug (French primary) and its own `features.legal.*`
  toggle. The **body is edited in Sanity** (new core `legalPage` doc, translated,
  rendered by a minimal blog-decoupled `LegalBody` PortableText serializer); SEO comes
  from the existing `siteMeta.pageSeo`. A "Pages légales" Studio desk section + 10
  seeded boilerplate docs (LCEN / RGPD / ePrivacy structure, `[bracketed]` placeholders
  - a "have a lawyer review it" note). `features.legalPage` → `features.legal` group;
    footer now shows a **Legal** group of the enabled pages. Guide:
    `code/docs/config/legal-pages.md`.
- **Footer follow block + social profiles fully in Sanity.** The dead `site.social`
  config block is removed; `siteSettings.social` (clearer per-platform legends) is the
  sole source. A new `SocialFollow` footer block renders the profiles as icon links
  (`reicon-brands` marks via `BrandIcon` + a hand-declared LinkedIn), each icon taking
  its official brand color on hover/focus and carrying `rel="me"`. One helper
  `socialLinks` (`src/lib/social.ts`) drives **both** the visible links and the
  Organization `sameAs` JSON-LD, so they can't drift.

- **SEO, llms.txt, and structured data are now edited in Sanity Studio, per
  language** — the client-intake SEO data no longer requires a code edit after
  launch. Two singletons under **Studio → SEO & métadonnées** are the **sole
  runtime source** (no config/messages fallback): `siteMeta.<locale>` (tagline,
  description, keywords, OG card, llms.txt summary + resources, and per-page
  `pageSeo` title/description/keywords/share-card) and `siteSettings` (social
  profiles, schema.org business type + LocalBusiness fields, and an editor-picked
  list of extra global schemas — Service / Product / Person / Event). Read through
  `getSiteSeo` / `getSiteSettings` (`src/lib/seo/site-seo.ts`, React `cache()` —
  one fetch per request shared by metadata, JSON-LD, layout, and the `/llms*`
  routes). _Why:_ clients need to change their own titles, descriptions, share
  cards, and structured data without a developer. Guide:
  `docs/seo/editing-seo-in-sanity.md`.
- **Full per-page SEO overrides in Sanity.** Each `pageSeo` entry now also carries
  a **canonical URL**, a **noindex** toggle (drops the page from `robots`, the
  sitemap — per locale — and the llms.txt/llms-full index), a dedicated
  **rich-result image**, OG image **alt text**, and **page-specific structured
  data** (Service / Product / Person / Event, merged into that page's JSON-LD).
- **Site-wide base-metadata defaults in Sanity.** `siteSettings` gains
  **Search Console verification codes** (Google / Bing — now editor-set, replacing
  the config values in the `<head>`) and Organization identity fields
  (`legalName`, `alternateName`), all emitted in the Organization JSON-LD.
- **Logo + favicon/app icon are edited in Sanity.** `siteSettings` gains `logo`,
  `logoDark` (optional dark-theme logo), and `icon`. The header/footer logo swaps
  light↔dark with a pure-CSS `data-theme` variant (no JS, no flash, works for
  light / dark / system / forced). Favicon + apple-touch come from the layout's
  `generateMetadata.icons`; PWA icons from `manifest.ts`; Organization JSON-LD logo
  from `siteSettings.logo` — all Sanity-only, **no config fallback** (empty = wordmark
  / no favicon). Removed `app/icon.tsx` + `app/apple-icon.tsx`, the `site.logo` /
  `site.brandLogoPng` / `site.icon` config, and the now-unused `/public/logo.svg` +
  `/public/brand/{logo,apple-icon,icon-192,icon-512,icon-maskable-512}.png`.
- **The Open Graph card is also Sanity-only now** — moved out of `/public`. Removed
  `app/opengraph-image.tsx` + `site.ogImage` + `/public/brand/og*.png`; `og:image`
  comes from `siteMeta.<locale>.ogImage` / `pageSeo.ogImage` and is omitted when
  unset (`seed` uploads the defaults). **`/public` no longer holds any brand asset.**
- **Site-wide robots toggle in Sanity.** `siteSettings.robots` (`noindex` /
  `nofollow`) applies `noindex` / `nofollow` to every page — a one-switch way to keep
  a staging/holding site out of search, editor-controlled.
- **Per-page `llmsSummary` field** — a short summary (a few sentences, flattened to a
  single bullet line) for the `/llms.txt` index per page (`pageSeo.llmsSummary`, else
  the SEO description). Pairs with `llmsFull`.
- **Blog posts get llms overrides** — `metadata.llmsSummary` (the `## Blog` line, else
  the meta description) + `metadata.llmsFull` (the `/md` export body, else the
  serialized PortableText body).
- **Taxonomy pages (categories / tags / authors) now appear in the llms endpoints** —
  `getTaxonomyLlmsLines` emits `## Categories` / `## Tags` / `## Authors` sections in
  `/llms.txt` (one line per detail page) and `/llms-full.txt` (with each doc's
  `seo.llmsFull` body inlined). `seoMeta` gained `llmsSummary` + `llmsFull`; gated by
  `features.blogTaxonomy.*` + per-doc noindex.
- **Per-page `llmsFull` field; llms-full is now Sanity-only.** Each `pageSeo` entry
  gains a free Markdown **`llmsFull`** body that drives that page's section in
  `/llms-full.txt` + `/llms/<id>`. **Removed the entire auto-generation mechanism**
  that walked `messages.pages.<id>` into Markdown (plus the auto `## FAQ` block) —
  `renderPageMarkdown` is now head (Sanity title/description) + `llmsFull`, no
  messages fallback. `/llms.txt` (the one-line index) is unchanged. Also added an
  explicit `robots: noindex` to the 404 page (belt-and-suspenders; the 404/500 HTTP
  status already deindexes, and neither they nor `/maintenance` are in the sitemap or
  llms endpoints). Also added a **site-level `llms.full`** intro
  (`siteMeta.<locale>.llms.full`) prepended to `/llms-full.txt`.
- **Taxonomy index-page copy editable in Sanity.** The category / tag / author
  listing pages' heading + subheading + empty-state text move to
  `siteMeta.<locale>.taxonomyPages` (read `?? messages` per field — always-rendered
  UI keeps the bundled fallback). The ICU post-count + breadcrumb aria strings stay
  in `messages`.
- **System-page copy (maintenance + 404) editable in Sanity.**
  `siteMeta.<locale>.systemPages` holds the maintenance + 404 text; the pages read
  it via `getSystemPages` (`src/lib/system-pages.ts`) **`?? messages/<locale>.json`**
  per field — deliberately keeping the bundled fallback because these are failure
  pages that must render even when Sanity is down. The **500 error page** stays on
  `messages` only (Next client error boundary — can't safely fetch). `NotFound`
  became presentational; `not-found.tsx` + `maintenance/page.tsx` resolve the copy.

### Changed

- **The SEO documents moved from `features/blog` into core `src/sanity/`** so
  site-wide SEO survives with the blog feature removed. `sanity.config.ts` now
  registers `coreSchemaTypes` alongside the blog schema, and the blog desk composes
  the core `seoStructureItem`. A field left empty in Sanity is simply empty on the
  site (framework default); `pnpm seed` populates both singletons.

### Fixed

- `.prettierignore` no longer walks generated / read-only trees, so `pnpm verify`'s
  `format:check` (`prettier --check .`) stops failing on files it should never lint.
  Added `docs/.vitepress/dist/` + `docs/.vitepress/cache/` (VitePress build output —
  110 warnings the moment docs are built) and corrected the stale shadcn path
  `src/components/ui-primitives/` → `src/user-interface/ui/` (the UI reorg moved the
  CLI-managed primitives; prettier had been reformatting ~60 READ-ONLY files).
  One-time `pnpm format` cleared the pre-existing authored-file backlog. _Why:_
  `.prettierignore` had drifted from the real tree, so the format gate flagged
  hundreds of files nobody edits.

### Fixed

- Moved the `body` + `h1–h6` **font-family** rules in `globals.css` into `@layer base`.
  They were unlayered, so an unlayered element rule beat Tailwind's `font-sans`/
  `font-display` utilities — a `<h2 className="font-sans">` silently stayed on the
  display face. Now utilities win per element. Verified safe: `@tailwindcss/typography`
  sets no heading font-family, so the base rules still cascade into `.prose`/`.typeset`
  and headings keep the display face there. (No heading in the template hit this yet —
  it was a latent trap for client forks.)

### Changed

- OG images are now **one card per language, site-wide** — no per-page cards. Removed
  the home page's `og-home.png` override (it was a byte-identical duplicate of `og.png`)
  and deleted the file. `pageOgImage` resolves per locale: default → `/opengraph-image`
  (`/brand/og.png`), other locales → `/brand/og-<locale>.png`; added `og-fr.png`. The
  per-page `seo.openGraph.imageUrl` escape hatch still exists but no page uses it. Docs
  updated (seo-metadata, brand-setup, icons, new-client, README) + `og.png`/`og-home.png`
  had already been resized to a true 1200×630 this cycle.

- `module.custom-html` now forces any embedded `<iframe>` to its parent's full width
  (`[&_iframe]:w-full` on the render section). Editors paste embed codes with hard-coded
  `width`/`height` attributes; CSS now overrides the width so an embed (YouTube, Google
  Form, map…) never ships narrower than the content column. Height stays as authored.

- All **per-request** Sanity reads now go through `sanityFetchLive` (was plain
  `client.fetch` in four spots): the home page's featured posts, the RSS + Atom feed
  routes, and the `/api/i18n/translated-slug` locale-switcher. So live revalidation
  (via `<SanityLive>`) + draft preview work uniformly across the whole site, not just
  the blog routes — the code now matches what `blog-architecture.md` already prescribed.
  Trade-off: these opt into dynamic rendering (the home page is no longer fully static).
  **Build-time** fetches (`generateStaticParams` ×4 + `app/sitemap.ts`) stay on
  `client.fetch` — live fetch needs request scope (`draftMode()`) and would break static
  generation. Fixed the OG placeholders `og.png` / `og-home.png` to a true **1200×630**
  (they were 1179×630, mismatching the declared `og:image:width`).

- Footer maker-credit link preview now works on **mobile**. `MadeByCredit` swapped its
  Radix `HoverCard` (hover/focus only — never opened on a touch tap) for a **Popover**:
  tapping/clicking "Indiecrafts" opens the indiecrafts.dev link-preview card on both
  desktop and mobile, with Radix collision handling + `max-w-[calc(100vw-2rem)]` so it
  never overflows a phone screen; the card itself is the link to visit. Added
  `footer.previewLabel` (en + fr) for the trigger's aria-label. _Why:_ the preview was
  unreachable on touch devices.
- `defineModule` now accepts an optional `description` (shown in the Studio module
  picker) — required by the ported `module.gallery` schema; fixes a `tsc` error.

- Gated `reactCompiler` to production (`process.env.NODE_ENV === "production"`) in
  `next.config.ts`. The React Compiler's memoization pass ran on every edit in dev;
  prod-only keeps HMR fast while still shipping the optimization in the build. _Why:_
  biggest remaining dev-HMR cost after adopting Turbopack. (Applied across the Sanity
  repos — template, sensoria, indiecrafts.dev, yakarchitecture.fr.)

- Sanity `post` documents now open on the **All fields** tab instead of "Contenu".
  Removed `default: true` from the `content` field group — with no group pinned,
  Studio's built-in "All fields" tab is active, so the whole document (content +
  metadata) shows at once; "Contenu"/"Métadonnées" stay as filter tabs. _Why:_
  editors kept missing the metadata tab. (post is the only entity with field groups.)

- Wired prettier **format-on-save** in `.vscode/settings.json`
  (`editor.formatOnSave` + `editor.defaultFormatter: esbenp.prettier-vscode`) and
  added `.vscode/extensions.json` recommending the Prettier extension. Prettier was
  already connected at **commit** time (husky → `lint-staged` → `prettier --write` on
  staged files); this adds the every-save layer so formatting isn't deferred to the
  commit hook. _Why:_ catch formatting on each edit, not only when committing.

- `pnpm dev` now runs **Turbopack** (`next dev --turbopack`) instead of webpack.
  _Why:_ webpack dev spins a heavy compiler over the full module graph (Next 16 +
  embedded Sanity Studio + next-intl + shadcn + reicon + React Compiler), and the
  CPU cost multiplies when several template-based projects run at once. Turbopack is
  Rust/incremental — booted in ~2 s here vs webpack's 5–15 s, with far lower steady
  CPU. Config is Turbopack-compatible (no custom webpack); build stays on webpack.

- Aligned `BrandIcon` with `../sensoria`: it now types its `icon` prop as a
  structural **`BrandMark`** (`{ hex, title, svgContent }`) it exports, instead of
  importing `BrandIconFn` from `reicon-brands`. A `reicon-brands` icon still satisfies
  it, and a hand-declared mark (for a brand the set doesn't carry, e.g. LinkedIn) now
  works too. _Why:_ decouples the component from the library's internal type and
  supports custom marks. `IconShowcase` is unchanged; docs updated (`docs/design/icons.md`,
  CLAUDE.md). Note: `BrandIcon` can't be dropped for "direct" reicon use — `reicon-brands`
  icons are DOM factories that throw on SSR, and `reicon-react` doesn't ship the brand logos.

- **Every blog content document is now translated.** Wired `author`, `person`, and
  `quote` into `@sanity/document-internationalization` (`schemaTypes` now lists all
  six: post, category, tag, quote, author, person). Each gained a plugin-managed
  `language` field (`readOnly` + `hidden`); `quote` migrated off its old manual
  language radio for consistency. Added per-locale create templates + desk
  language-split for author/person. Added same-language reference filters on
  `post → author` and `person-list → person` (categories/tags/quote-list already had
  them), so an EN post can only link EN entities. Locale-filtered `authorBySlugQuery`
  - `authorsForLocaleQuery`, and made the author route emit per-locale static params
    (`allAuthorSlugsQuery` now returns `language`). _Why:_ author/person bio + role were
    shared across locales (EN text on FR pages), and quote used an inconsistent manual
    field — everything now follows one plugin-managed i18n model. Seed rewritten to
    match: authors + people are EN/FR pairs, all refs resolve same-language, and a new
    `buildTranslationMeta` emits `translation.metadata` docs linking every EN↔FR set
    (post/category/tag/quote/author/person) so the Studio and the front-end locale
    switcher (`/api/i18n/translated-slug`) can resolve counterparts. Docs updated
    (blog-architecture, sanity-setup) + `audit-dataset.mjs` now flags missing
    `language` on author/person too.

- Hardened the `@sanity/document-internationalization` setup to match the plugin's
  documented best practice. The `language` field on `post` / `category` / `tag` is
  now `readOnly` + `hidden` — the plugin writes it, so editors can no longer flip a
  document's language and desync it from its `translation.metadata` link. The Studio
  language set (`supportedLanguages`, per-locale create templates, and the desk's
  EN/FR split) now derives from `@/config`'s `locales` instead of hardcoded `en`/`fr`,
  so adding a locale to config extends Studio automatically — one source, no drift.
  The post/category/tag **slug** is excluded from translation copies
  (`options.documentInternationalization.exclude`), so a new-language version starts
  with an empty slug rather than duplicating the source URL. Plugin
  `translation.metadata` docs are hidden from Studio global search
  (`metadataOmnisearchVisibility: false`). _Why:_ prevents the most common
  document-i18n data-integrity bugs (language desync, duplicate slugs across locales)
  and keeps the locale list single-source across next-intl routing and Sanity.

- Moved the `tsc` typecheck from the pre-push hook to **pre-commit** and removed
  the pre-push hook entirely (matches `../sensoria`). The commit gate is now
  `pnpm lint-staged && pnpm tsc` — staged-file lint/format plus a full typecheck —
  and nothing runs on push. _Why:_ the pre-push `lint && tsc` re-ran checks the
  commit had already covered; one gate at commit + CI is enough. `verify:quick` is
  now a manual pre-PR check, not a hook. Docs updated: CLAUDE.md, README.md,
  `docs/setup/{scripts,environment,new-client}.md`.

### Removed

- Removed the `module.breadcrumbs` blog page-builder module (editor-authored manual
  breadcrumb trail). Dropped its renderer + schema, the `AnyModule`/registry/
  `MODULE_TYPES` entries, and updated module counts (13 modules, 4 layout-slot) across
  README, blog `CLAUDE.md`, and the blog docs. _Why:_ every blog route already builds a
  correct auto breadcrumb from route context (verified: parent crumbs link back to
  `/blog`, and the post's category crumb is `showCategories`-gated) — a hand-typed
  module duplicated that and could link at flag-disabled routes. The shared auto
  `Breadcrumbs` component (`shared/components/Breadcrumbs.tsx`) is unchanged.

- Removed the `module.search` blog page-builder module (client-side post search
  widget). Dropped its renderer + schema files, the `AnyModule`/registry/`MODULE_TYPES`
  entries, the now-orphaned `data-search-title` attribute on `BlogCard` (search was
  its only consumer), the `searchPlaceholder`/`searchLabel` message keys (en + fr),
  and updated every module-count reference (14 → 13 modules, 6 → 5 layout-slot) across
  README, blog `CLAUDE.md`, and the blog docs. _Why:_ the widget was a filter-visible-
  cards toy, not real search — not worth carrying as a first-class module.

- Removed the dead `STATIC_PATHNAME_KEYS` value re-export from `src/config/index.ts`
  — a config-audit found zero importers of the value. The const stays in
  `config/types.ts` (it derives the `StaticAppPathname` type, which is used); only
  the unused barrel re-export was dropped.

- _(design)_ Deleted the unused `theme.colors`, `theme.radii`, and `theme.fonts`
  mirrors from `src/config/index.ts` — an audit found zero consumers (`globals.css`
  is the real runtime source; `check-contrast.mjs` parses it directly, and the OG
  image is a static PNG so no Satori path reads oklch). `theme.hexColors` now keeps
  only `background`, the one hex the PWA manifest needs. _Why:_ a hand-maintained
  color mirror nobody read was pure drift risk with no enforcement. Rewrote the
  "keep in sync" contract in DESIGN.md, `docs/setup/brand-setup.md`,
  `design-token-usage.md`, and logged it in `docs/design-decisions.md`. Also removed
  the dead `TAILARK_API_KEY` from `.env.example` (wired to nothing — components.json
  has no registries block).

### Added

- **`pnpm shadscan`** script ([shadscan](https://github.com/TheOrcDev/shadscan),
  `pnpm dlx @shadscan/cli`) — a deterministic shadcn/ui fundamentals audit scoring UX
  0–100 across 6 categories (62 rules). Manual audit like `pnpm doctor`, not in the
  `verify` gate; no dependency added (runs via `dlx`). Documented in CLAUDE.md,
  command.md, and `docs/setup/scripts.md`.

- **Editor-controlled OG image per language** — new `siteMeta` Sanity singleton (one
  per locale, `siteMeta.en` / `siteMeta.fr`, in the Studio under **Métadonnées du site**)
  with an `ogImage` field. `resolveOgImage` (`@/lib/metadata`) now resolves the `<meta
og:image>` as: per-page override → editor's `siteMeta.<locale>.ogImage` → static
  `/brand/og[-<locale>].png`; a Sanity outage falls through to static, so metadata never
  breaks. `pageOgImage` stays sync (override or static) for JSON-LD. Seed: new
  `scripts/seed-media/` folder holds the OG cards (og.png / og-fr.png), uploaded via
  `uploadLocalMedia` and referenced by the seeded `siteMeta` docs. Docs updated
  (seo-metadata, brand-setup). Also fixed a latent `pageOgImage(page)` call in
  `jsonld.tsx` that was missing the `locale` arg.

- **Separate post `excerpt` field** — the SEO `metadata.description` was doubling as
  the visible teaser on cards + the post page. Added a dedicated `excerpt` (Contenu tab);
  cards/post now show `excerpt ?? metadata.description` (fallback keeps existing content
  working), and `metadata.description` is SEO-only again. Touched schema (`post.ts`),
  `PostListItem`, `POST_LIST_FRAGMENT` + `postBySlugQuery`, `BlogCard`, the post page,
  the `metadata.ts` help text, the seed (helper + showcase posts), and the editor guide.

- **Morphicons homepage demo** — added [`morphicons`](https://www.morphicons.com) +
  `lucide` (raw icon data), and a `MorphiconsShowcase` homepage section: a grid of
  tiles that morph between two icons on tap/click. SSR-safe and honors
  `prefers-reduced-motion` (instant swap), neutral tokens per DESIGN. Mounted after
  `IconShowcase` in `(home)/page.tsx`; copy in `messages/{en,fr}.json`
  (`pages.home.blocks.morphicons.*`); `lucide` added to `optimizePackageImports`.

- **`docs/features/blog/gallery.md`** — the missing doc for the `module.gallery`
  feature added earlier (editor guide + developer wiring), adapted from `../sensoria`
  to the template's neutral tokens. Synced into the VitePress sidebar + README index.
  _Why:_ the gallery feature shipped without its doc, against the template's own
  "docs are part of the change" rule.

- **`.claude/workflows/`** — step-by-step checklists for the repeatable, error-prone,
  multi-file procedures that were previously prose (or understated): `add-blog-module`
  - `remove-blog-module` (the ~8 code locations + 4 doc count-refs, e.g. the search/
    gallery/breadcrumbs module changes), `add-page`, `adapt-library-section`. Wired from
    `CLAUDE.md` and `src/features/blog/CLAUDE.md` (whose "schema + component + switch case"
    line understated the real surface). _Why:_ codifies the checklist so a missed location
    (Studio picker, TS exhaustiveness, stale doc counts) stops happening.

- **Atom 1.0 feed** at `/blog/atom.xml` — sibling of the RSS feed. Same
  `rssPostsQuery` data, same `isRssEnabled()` gate (blog + rss flags), same
  per-locale `[locale]` routing (one feed per language in `i18n.locales`); Atom
  serialization (ISO-8601 dates, `<feed>`/`<entry>`, stable `<id>`s). Wired the
  `<link rel="alternate" type="application/atom+xml">` discovery tag on the blog
  frontpage + every post, next to the RSS one. Docs updated (blog-architecture routes
  table, feature-flags, README).

- **Image gallery** blog module (`module.gallery`, ported from `../sensoria`) —
  swipeable embla carousel with a thumbnail strip, an editorial counter, and a
  click-to-zoom fullscreen lightbox; inline-embeddable in a post body. Adapted to
  template conventions: neutral tokens (no `decor-warm`), `rounded-xl`/`shadow-lg`,
  lucide icons. Added `embla-carousel-react` (also fixes the template's
  already-present-but-broken `ui/carousel.tsx`). GROQ projection resolves each image
  to CDN url + `lqip`. Message keys `pages.blog.gallery.*` (en + fr).

- _(design)_ DESIGN.md closed the gaps from the "10 lines" design.md pattern: new
  **Rejected Patterns** section (encodes what we tried and killed, with reasons, so
  an agent stops and asks instead of shipping a carousel or long modal) and
  **Required States** contract (Loading/Empty/Error each map to a real primitive —
  `Skeleton`/`Empty`/`Spinner` — "never a blank screen"). Folded in a destructive-
  confirm rule (verb-repeat + `AlertDialog`, non-destructive never confirms), a
  "match nearest existing screen" fallback, a spacing usage map, and table→stacked-
  cards below `md`. Skipped the rest — the file already exceeded the template.

- _(design)_ DESIGN.md hardened against the "7 DESIGN.md mistakes": CLAUDE.md now
  imports it via `@DESIGN.md` + a pre-UI checklist (mistake #7 — actually loaded);
  new **Interaction & States**, **Accessibility**, **Motion**, **Iconography**,
  **Product Content**, and **Maintenance & Validation** sections (#5); deduped the
  restated Responsive bullet and folded the shadcn-conventions block into a pointer
  to `.claude/rules/component-architecture.md` (#6). Skipped component-anatomy
  expansion and semantic color renames.

- _(design)_ Typography levels `subheading`, `title`, `lead`, `caption` — filled
  the 5→9 gap so an agent building an `h3`/lead/caption has a token instead of a
  guess. Each maps to a Tailwind size already in use (`text-sm` was the most-used
  size with no token).
- _(design)_ `elevation` tokens (`flat/card/raised/overlay`) — the Elevation
  section was prose-only; the depth steps are now machine-readable.
- _(design)_ Component tokens `button-secondary` and `focus-ring`; `card` now
  cross-links `{elevation.card}`.
- _(design)_ "How to read this system" precedence header — states that tokens win
  over hardcoded values and where the runtime source of truth lives.
- This shared `CHANGELOG.md`.
- Scaffolded the template toward the Babich "design project" structure (Phases 1–4):
  `MEMORY.md`, `CLAUDE.local.md` (gitignored), `.claude/settings.json`,
  `reference/` (screenshots/competitors/moodboards/flows/research), `docs/design-decisions.md`,
  `.claude/rules/` (naming, accessibility, component-architecture, design-token-usage,
  figma-handoff — CLAUDE.md now points to them), 3 project agents (design-system-reviewer,
  accessibility-reviewer, ux-reviewer), and 3 project skills (design-system-check,
  accessibility-pass, visual-polish). `.gitignore` refined to commit the `.claude`
  team toolkit while ignoring personal/machine state. Skipped `design-tokens.json`
  (would fork the OKLCH source of truth).

### Changed

- `CLAUDE.md` front-loaded: a stack line + top-5 non-negotiables now open the file
  so the highest-attention lines carry the load-bearing rules; Working principles
  and the docs section tightened.
- _(design)_ Colors prose now pairs each role with its resolved value
  (`brand — oklch(0.55 0.18 260) · #4f69d9`) so agents don't cross-reference.
- Added rules (CLAUDE.md + DESIGN.md) to maximise the `frontend-design` skill and
  require all UI to be responsive/optimised for every supported screen size
  (verify 375 / 768 / 1280).
