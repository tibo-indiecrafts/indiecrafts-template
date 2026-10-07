# Changelog — app (`@indiecrafts/website`)

One shared record for **code and design** — every change that alters behavior,
config, a route/convention, or a design token lands here in plain language,
explaining the _why_, not just the _what_. Dev and design write to the same file
so an agent (or a client) reads one history, not two.

**Not here:** docs-site changes → [`docs/CHANGELOG.md`](../../../../docs/CHANGELOG.md);
the repo-wide roll-up → [root `CHANGELOG.md`](../../../../../CHANGELOG.md).

- **Design/token changes** are also governed by `DESIGN.md` (the token contract);
  **code/convention changes** by `CLAUDE.md`. This file is where both are logged.
- Format follows [Keep a Changelog](https://keepachangelog.com); versions are
  `[major.minor.patch]`. Categories: **Added · Changed · Deprecated · Removed ·
  Fixed**. Tag design-only entries with _(design)_ for quick scanning.
- After any token change, re-sync `theme.hexColors` and run `pnpm verify:contrast`.

## [Unreleased]

### Fixed

- **French pages get French SEO on shared documents.** `/fr/blog`, `/fr/author`, `/fr/blog/category`,
  `/fr/blog/tag`, `/fr/contact` and `/fr/waitlist` showed the English title and description: their SEO
  lives on singletons that serve every locale. The SEO queries now read the locale's `seoTranslations`
  entry first, and the seed fills the French ones (plus the missing contact SEO). A language with no
  entry keeps the default-language SEO, as before.
- **The cookie banner link says where it goes.** "Learn more" → "Read the cookie policy" (fr: "Lire la
  politique cookies"). Lighthouse flagged the vague link text.
- **Screen readers say the site name once.** The header and footer logo image had `alt` = the site
  name, right next to the same name as text. The image is now decorative (`alt=""`).
- **The comment moderation page follows the default locale.** Its copy was hard-coded French while
  the email that links to it uses the default locale; it now comes from the bundled
  `messages.moderation`, read without a Sanity call so a rate-limited request stays cheap.
- **The demo post's headings follow the outline.** The seeded showcase post jumped H2 → H4 and H2 → H5;
  those headings are now H3 and H4.

- **A shared English blog link opens in French for a French visitor.** The locale cookie redirects
  `/blog/<en-slug>` to `/fr/blog/<en-slug>`, which no French doc has, so every English post, category,
  tag and series link was a 404 for anyone who had picked French. The detail pages now redirect to the
  translation (`redirectToTranslation`); a document with no translation still 404s. The demo seed
  also links the EN↔FR series (it was the one translated type left unlinked), so the series gets the
  locale switcher, hreflang and this redirect.
- **`/blog/atom.xml` works on the default locale.** The proxy matcher listed `/blog/rss.xml` but not
  the Atom feed, so `/blog/atom.xml` was a 404 while every post advertised it. Added; `src/proxy.test.ts`
  now fails when a dotted route under `[locale]/` (`.xml`, `.txt`) is missing from the matcher.
- **Post counts say "1 post", not "1 posts".** The category, tag and author counts and the series
  "parts" are ICU plurals (`{count, plural, one {# post} other {# posts}}`) formatted by next-intl;
  the blog components take a `(count) => string` instead of a `{count}` template. The live Sanity
  `uiMessages` still hold the old strings until they are updated.
- **A page past the end 404s.** `?page=9` on a category, tag, author or series page rendered "3 posts"
  above "No posts yet" as an indexable 200. It is now a 404.
- **The pager label no longer throws.** The four detail pages formatted `Page {page} of {total}` with
  no values, which logged a `FORMATTING_ERROR` on every request; they pass the raw template the
  `Pager` fills in.
- **The Markdown export's canonical matches the page.** `/blog/<slug>/md` said
  `https://…/en/blog/<slug>`; the default locale has no prefix, so it is now `https://…/blog/<slug>`.

- **The cookie table names the real cookies.** The seed declared `NEXT_LOCALE` and `legal-ack`; the
  browser stores `<prefix>_NEXT_LOCALE` and `<prefix>.legal-ack`. The seed now uses `site.prefix` and
  adds the three undeclared necessary cookies (`.locale-suggest`, `.announcement-ack`,
  `.announcement-toast-ack`). The live dataset was patched the same way.
- **The seed creates `contactSettings`** (heading, intro, message/button/success labels, en + fr).
  Without it `/contact` showed no heading and French labels on the English page.
- **The language strip no longer argues with the visitor.** A French browser that switched the site to
  English saw "Ce site est aussi disponible en Français" on every page. The header `LocaleSwitcher`
  now records the choice (`dismissLocaleSuggest`), like the strip's own buttons. The `i18n` e2e
  journey covers it: a French browser lands on `/fr`, picks English, and stays there.
- **No request to Google before consent.** GA now loads through `<GoogleAnalytics>` (basic consent
  mode) at the end of the body instead of always in `<head>`: before a choice and after "Reject" the
  browser contacts Google not at all (measured: 0 requests); after "Accept", GA loads and measures.
- **Analytics respects consent, and the banner shows in Brave.** A visitor who accepted was never
  measured (the consent update was ignored and not restored on later pages), and in the EU a browser
  privacy signal (Brave's GPC) hid the banner behind a silent reject. Both fixed in
  `packages-web-compliance`; the layout restores the stored choice before GA's first hit.
- **A cookie change in the account widget now takes effect and is logged.** The Privacy tab saved
  through its own store: the page's consent gates did not see it until a reload, no Consent-Mode
  update was pushed, nothing reached `consent_events`, and it used the default categories + version
  `"1"` instead of the banner's Sanity ones (a first save there made the banner ask again). The tab
  now gets the banner's categories + version (`CookieConsentConfig`) and saves through `applyConsent`.
- **Email preferences live in the account widget, centred.** `/account` showed the preference
  centre as a separate block under Clerk's card, and the card sat to the left. The centre is now
  the widget's **Emails** tab (also in the header avatar modal), the card is centred, and the
  category copy follows the page language (it used the profile's). `EmailPreferencesMount` is
  gone; `EmailPreferences` moved to `packages-shared-compliance`.
- **Legal acceptance reaches your other surfaces even if the first write was lost.** Signed-in
  builds now mount the legal notice even after a local accept (hidden, `acceptedHere`), so a lost
  server write is re-sent on the next load.
- **The announcement banner has an accessible name.** It is a `region` landmark with no label, so
  screen readers listed an unnamed region. It now reads "Announcement" / "Annonce"
  (`common.announcement`). The overlays e2e journey now also checks that every fixed overlay sits
  in the bottom slot, and that a dismissed banner stays dismissed after a reload.

- **Server calls reach the api on deployed envs.** A fetch from one Worker to another on the
  same zone (every `*.workers.dev` Worker of the account) fails with Cloudflare error 1042, so
  on dev no consent log, CSP report or data request ever reached the api (`csp_reports` was
  empty). The `global_fetch_strictly_public` compatibility flag sends these calls over the
  public internet, as `API_URL` already assumed.
- **`RATE_LIMIT_KV` points at live namespaces.** The dev and staging ids named deleted
  namespaces, so the first deploy after the limiter fix failed. New `RATE_LIMIT_KV_dev` /
  `RATE_LIMIT_KV_staging` namespaces, ids updated.
- **The api rate-limits per visitor.** `/api/consent-log`, `/api/data-request`,
  `/api/session-log` and `/api/csp-report` send the visitor IP (`x-client-ip`) with their api call.
- **`API_URL` is a per-env var; the manual secret sync is the deploy's own.** `API_URL` moved to
  `wrangler.toml` (dev, staging; prod commented): a synced secret carried the local
  `localhost` value. `secrets:sync:website:<env>` now runs the shared `data/secrets.mjs`; the
  legacy `scripts/sync-secrets.mjs` (which read the dev file for staging/prod) is deleted.

- **`ADMIN_URL` for the GDPR request alert.** Set per env in `wrangler.toml` (dev, staging; prod
  commented) and listed in `.env.example`, so the owner alert links the admin "Data requests"
  screen. `.env.example` also says that `APP_API_TOKEN` is needed for `/data-request` to store requests.

- **Pages without Sanity SEO had no `<title>` at all.** `buildMetadata` returned `title: undefined`,
  and Next treats a present key as an override — so `/contact`, `/erasure` and `/data-request`
  (en + fr) shipped with no title and no description, for browsers and crawlers alike. The keys are
  now left out, so the layout default applies. `/contact` also reads its own Sanity SEO
  (`contactSettings.seo`) again — `getPageSeo` had no contact branch.
- **`robots.txt` no longer blocks `/_next/`.** Crawlers fetch the page's CSS, JS and optimized
  images from it to render; Google warns that blocking them harms indexing. The obsolete `Host:`
  line is gone too.
- **`/account` is `noindex`** — a signed-in page was in search, the sitemap and `llms.txt`.
- **`llms.txt` speaks the URL's language and links its translations.** The route's own labels
  (`Last reviewed`, `Site`, `## Pages`, `## Resources`, and the blog's section headings) come from
  `messages.<locale>.llms`, and a new `Other languages` line links every other locale's file.
- **The Cloudflare edge can't override the AI-crawler policy.** Every Terraform stack on the zone
  (website · admin · app · api) pins `ai_bots_protection` / `crawler_protection` = `"disabled"`
  and `is_robots_txt_managed = false`: Cloudflare's AI-bot block also stops Googlebot and Bingbot,
  and new domains block training crawlers on ad pages by default since 2026-09-15. A test keeps
  the four stacks in step.

### Added

- **`audit-dataset` flags posts with no slug.** The Studio requires one, so these come in through the
  API and no page, feed or sitemap can reach them. Five such probe posts sit in the dataset today.

### Changed

- **The announcement card mounts after every top strip** (bar, language suggestion, sub-nav), so on
  a wide screen it sits under all of them; on a phone it stays at the bottom. The overlays e2e
  checks both.
- **Cloudflare observability is fully on.** Traces (10% sampled) and Issues (grouped production
  errors) join the Workers Logs in the top-level `wrangler.toml` `[observability]` block, which every
  env inherits. Wrangler is pinned to 4.143.0 (Issues needs ≥ 4.134). A test fails if a part is off.
- **The data-request success message mentions the receipt email** (en/fr).

- **The registry deploys the cron before the api** (`order: 5`): the api's new `CRON` service binding
  needs the cron to exist. Config tests pin that the cron has no public URL and the binding targets
  it, and that `project:rename` rewrites the binding target.
- **CI dry-runs every bare Worker service from the registry.** The `wrangler` job hard-coded
  `api cron workers agent` — `agent` no longer exists, and a new service would have been skipped.
  It now reads `apps.mjs --class worker-cf --kind service` (new `--kind` filter, tested), so a
  registry row is the only thing a new service needs.
- **`verify:contrast` checks the destructive pairs** — error text on the background and text on a
  destructive fill, in both themes. The dark theme's error red failed (4.15:1) with nothing catching it.
- **`check:claude-md` fails on a dead relative link** in a brief or rule (LINK). 36 links pointed at moved
  doc pages (mostly `docs/packages/<name>.md` → `docs/packages/{shared,web}/<name>.md`); all fixed, and
  two pointers to files that no longer exist were dropped (the `issue-tags` rule, the `better-colors` skill).

- **Agent instructions load only where they apply, and cannot silently outgrow their budget.**
  `pnpm check:claude-md` now counts `@imports` (they load at launch), fails any brief or rule past 200
  lines (the official Claude Code target), fails dead `@imports`, and covers `.claude/rules/**`. It
  allows nested `.claude/skills/`, which Claude Code now loads per folder. The website brief was 179
  lines plus a 474-line `DESIGN.md` import (≈650 lines on every website read); it is now a 66-line map
  that sends you to `DESIGN.md` before UI work. The api brief moved its route catalogue to
  `code/docs/shared/api/`. The eight UI and Sanity rules moved from the website to root
  `.claude/rules/web/` with `paths:`, so they now also reach admin, app, packages, and modules — but
  only with a matching `.tsx`/`.css`/schema file. The Stop hook reports every new guard error or bloat
  warning, so the evolve loop stays inside the budget.
- **Stale agent tooling removed.** The React Native and Electron build agents, the `animate-expo`
  skill, and the dead `platform-patterns` hook wiring are gone (no such surfaces remain). The
  `/brief` and `/grill-plan` commands are now skills (Claude Code merged commands into skills).
  `schema-markup` keeps its templates in `types.md` (a skill stays under 500 lines).
- **Briefs name the real bindings and paths.** `AUDIT_DB` (not `DB`) in the api, cron, and db briefs;
  `code/docs/projects/web/website/…` (not the removed `code/docs/apps/web/…`) across briefs, rules,
  agents, skills, workflows, and code comments.
- **`doctor:web:website:env` no longer reports a false prefix drift.** It expected the Worker to be
  `<prefix>-web`, but Workers are `<prefix>-<env>-<platform path>`, so it always warned — and its
  advice (`project:rename indiecrafts`) is refused for the template default. It now checks the name
  starts with `<prefix>-`.
- **`.env.example` documents `EMAIL_BCC_ALL_ENABLED`** — the QA blind-copy gate the email modules
  read (any value turns it on; leave it unset in prod).

### Fixed

- **`pnpm verify` is green again.** React Doctor failed the website gate on
  `EmailPreferences.tsx`: the React Compiler can't lower a `try`/`finally`. The saving-flag
  cleanup now runs after the `try`/`catch` (same behavior — the catch never rethrows); the tests
  now also assert the switch is re-enabled after a save and after a failure.
- **CI runs every check `pnpm verify` runs.** `test.yml` lacked `check:secret-leak`,
  `check:lint-no-types`, `check:doc-coverage` and `check:claude-md`, so the secret-leak guard
  never ran in CI. **Why:** QA Runbook card 02 — the local gate and CI must be the same gate.

- **The header no longer draws over the brand name on a phone.** In French ("Se connecter") the
  controls squeezed the logo and the menu icon overlapped its text at 390 px. The name now
  ellipsizes and the controls keep their size. **Why:** seen on the QA Runbook card 01 check.
- **`dev:setup` can finish for cron and workers.** Their `.dev.vars.example` held a commented
  `EXAMPLE_TOKEN` stub that no code reads, but setup counted it as a required secret, so it never
  got past step 2. The stub is gone (the example explains how to declare a real one).

- **`dev:doctor` checks only the env you run.** It flagged `PASTE_…_HERE` placeholders in the
  staging/prod tables of `wrangler.toml` while booting `dev`, telling every newcomer to fix dev ids
  that were already set. It now reads only `[env.<env>]` (`wranglerEnvSection` in
  `scripts/lib/project.mjs`, tested). **Why:** found on the QA Runbook card 01 boot.
- **React Doctor ignores build output.** `doctor.config.jsonc` now skips `.open-next/**` and
  `.next/**`; minified bundles were reported as app findings ("weak cryptography" in chunks).

### Changed

- **Signing in re-checks the legal acceptance.** `SignedInLegalNotice` keys the banner on the user
  id, so a user who accepted on another surface no longer sees it until a reload.

- **Overlays take turns.** The cookie banner shows first; the legal banner, then the announcement
  card follow one at a time (`useOverlayTurn`). Before, the legal banner sat on top of the cookie
  banner on a phone. Confirmation toasts sit at the top (`<Toaster position="top-center" />`).
  New e2e journey: `e2e/journeys/overlays.spec.ts` (at most one overlay, 390 px and 1280 px).

### Removed

- **The `mobile` announcement surface and the `appContent` mobile welcome section** (schema, seed, and
  stored data). **Why:** the mobile app is now the `app` surface inside a Capacitor shell.

### Added

- **`GET /api/legal-version`** — a tiny public route returning the effective legal version (the SAME
  string the re-acceptance banner computes: `getLegalAcceptance(...).version`), served `no-store` +
  CORS `*`. **Why:** the `app` + Expo shells fetch it so every surface re-prompts on ONE Sanity bump
  and compares the same version string (a per-surface static `policyVersion` never matched the
  website's). Client half + full model → [`compliance-shared`](../../../../docs/packages/shared/compliance.md).

### Changed

- **Blog posts emit `og:type=article` (+ `article:published_time` / `modified_time` / `author` /
  `section`).** The post `generateMetadata` spread `seoDefaults.openGraph.type` (`website`) unchanged,
  so every article advertised itself as a generic page. It now overrides `type: "article"` and adds
  the `article:*` tags from the post's own `publishedAt` / `updatedAt` / authors / first category — via
  a pure, unit-tested `articleOpenGraph(post)` helper (`src/lib/seo/article-og.ts`). **Why:** correct
  OpenGraph type for social + search article treatment; the JSON-LD already emitted an `Article`, so OG
  and structured data now agree. (Found while QA-verifying SEO card 16.)
- **Harness memory + speed: typecheck no longer builds, lint stays type-free, Oxlint added.**
  The type graph — the memory-intensive part of the harness — is built only by `tsc`, and we were
  building it wastefully. Fixes, from the biggest:
  - **Dropped `dependsOn:["^build"]` from the turbo `tsc` (and `test`/`verify`) tasks.** tsc typechecks
    workspace packages as source (they're `transpilePackages`-consumed), so it never needed the upstream
    OpenNext builds it was forcing first. Result: `pnpm tsc` went from **~2 min (with builds) → 435 ms
    cached** (0.4s FULL TURBO); `verify` no longer runs OpenNext builds (the CI `build` job still does).
  - **`incremental: true` on the 5 tsconfigs that lacked it** (api · cron · workers · mobile · storybook;
    the 3 Next apps already had it) + `.tsbuildinfo` in the turbo `tsc` `outputs` — repeat typechecks
    reuse the graph.
  - **`--concurrency=50%` on `build`/`test`/`verify`** — caps how many type graphs + workerd test pools
    build at once (the peak-memory event, and the source of the documented workerd-parallelism flakes).
  - **Lint is confirmed type-info-free** (verified via `eslint --print-config`: no `parserOptions.project`/
    `projectService`, no type-aware rules) — so ESLint never builds the type graph. New `check:lint-no-types`
    guard (in `verify`) fails if a config re-introduces it — the one change that would regress lint memory.
  - **`tsc:fast` via tsgo** (`@typescript/native-preview`, the TS 7 Go port) — ~10× faster, ~half the
    memory of `tsc`, for the local inner loop (`pnpm tsc:fast`). Scoped to the 6 core surfaces (api · cron ·
    workers · website · admin · app); storybook + mobile stay on real `tsc` (the preview doesn't yet
    auto-discover their vitest/jest ambient globals). CI + the commit hook keep the real `tsc`.
  - **Oxlint added** (`pnpm oxlint`, `.oxlintrc.json`) — the fast (Rust) AST-only linter, repo-wide in
    ~3s, covering the surfaces ESLint doesn't (admin · app · storybook). **Advisory** for now (it surfaces
    ~4 pre-existing findings — Carousel unsupported-aria, a ref-in-render); graduate it to a gate once
    those are triaged. Our AST-only rules port to it 1:1 (the whole point of keeping lint type-free).

### Added

- **Remote-dev workflow: `dev:doctor` · `dev:setup` · `dev:refresh:dev`.** `pnpm dev` runs the workers as
  `wrangler dev --env dev --remote` against the one shared remote `dev`, which silently 500s when you're
  logged out / a worker has no `.dev.vars` / a `[env.dev]` id is a placeholder. New shared runners
  (`code/shared/scripts/dev/{doctor,setup,refresh}.mjs`): **`dev:doctor`** preflights those (wired as
  `predev`, so `pnpm dev` runs it first — warns without blocking, hard-fails only when not logged in;
  `SKIP_DEV_DOCTOR=1` bypasses; `dev:doctor:deep` adds a remote D1 migration-drift check). **`dev:setup`**
  is a one-shot bootstrap (login → scaffold each worker's `.dev.vars` from `.dev.vars.example`, which you
  fill → `deploy:all:dev`). **`dev:refresh:dev`** re-aligns dev (migrations + secrets) without a full
  redeploy; **`secrets:sync:all:dev`** pushes every worker's secrets at once. **Why:** make "working
  directly on dev" fail loud with the fix instead of a confusing 500, and bootstrap a fresh clone in one
  command. Docs: [setup/environment.md](../../../../docs/apps/web/setup/environment.md).

- **`appContent` welcome singleton in the hub Studio.** A new `Contenu de l'app` singleton
  (`src/sanity/app-content.ts`, wired into the "Contenu partagé" desk group) holds an editor-owned
  home welcome message with `shared` / `web` / `mobile` sections, each internationalized (`localeText`).
  Read live by the web `app` surface + the mobile app (not the website itself). **Why:** give the app +
  mobile home screens an editor-changeable welcome without a redeploy, from the one shared Sanity project.
- **Email preference centre.** A new `EmailPreferences` component
  (`src/user-interface/account/EmailPreferences.tsx`) renders a switch per email category (optimistic,
  rolls back on a failed save) plus a read-only "Account & security" notices list; category/notice copy
  comes from the api already locale-resolved. Mounted two places: the `/account` page (JWT, via the new
  `EmailPreferencesMount`, alongside `AccountControl`) and a new public, unauthenticated
  `/email-preferences?token=…` page (`EmailPreferencesPublic`) for recipients who aren't signed in — not
  in the `pages` map, so it stays out of nav/sitemap/llms, mirroring `/newsletter/confirm`. **Why:** the
  account modal's single "Commercial emails" toggle (`packages-web-auth`'s `account-modal.tsx`) only
  covers one category; granular per-category control needed a website-owned UI. The modal's toggle stays
  as-is — it lives in a shared package, and mounting a website-only component there would be a
  wrong-direction package→app dependency.

### Changed

- **Sanity Studio upgraded to v6 (from v5).** Bumped the whole Sanity family to `sanity@6.16.0`
  (`@sanity/vision` 6.16.0, `@sanity/client` 8.7.0, `@sanity/ui` 4.2.3, `@sanity/icons` 5.2.2,
  `next-sanity` 13.3.4, `@sanity/document-internationalization` 6.2.37). **Why:** v6 runs on Vite 8 and
  builds the Studio ~4–5× faster (measured `sanity build` ≈ 2.4s here). Migration work this required:
  - **`@sanity/icons` v5 moved named icons off the root barrel to per-icon subpaths** — `import { EnvelopeIcon }
from "@sanity/icons"` → `from "@sanity/icons/Envelope"`. Rewrote all 49 import sites (bricks + modules +
    website). tsc still accepted the old form (the root re-exports each as `never`), so this only surfaced in
    the Studio bundle — validate icon changes with `sanity build`, not tsc alone.
  - **`@sanity/ui` v4 deprecated `space` in favour of `gap`** on `Stack`/`Flex` (`send-test-action.tsx`).
  - **Bumped the two companion i18n plugins** to their `@sanity/ui`-v4 builds — `sanity-plugin-internationalized-array`
    5.3.1 and `@sanity/language-filter` 5.0.18 (both now declared directly in the website; the old auto-installed
    peers still imported removed `@sanity/ui` root components). Added `sanity-plugin-internationalized-array` to
    `minimumReleaseAgeExclude` (its only matching release is days old, on the Studio cadence).
  - **Pinned one React across the web tree.** Added `react`/`react-dom` `19.2.8` to the root so the root-level
    test/Clerk devDeps stop auto-installing React 19.3.0; a second React runtime forks the `sanity` Studio peer
    closure into two instances and breaks tsc. Run `pnpm dedupe` after adding a new Sanity/React dependency to
    keep the closure collapsed. Mobile stays on React 18.3.1 (untouched).
  - **Converted 9 schema/content bricks' `sanity` dependency to a peer** (page-builder, compliance,
    locale-suggest, announcement, email, waitlist, contact, blog, newsletter) so every `sanity` resolves to the
    one app-provided instance. The custom `workspaceIndexFallback` Vite plugin (`sanity.cli.ts`) survives Vite 8
    unchanged.
- **The language switcher now persists a signed-in user's choice.** Switching language calls
  `usePersistLocale` (`@indiecrafts/packages-web-auth`) → the user's Clerk `unsafeMetadata.locale` →
  (via the api webhook) `user_profiles.locale`. **Why:** the stored locale was captured only at
  sign-up, so a user who later switched language still got transactional/auth emails in the old one.
  No-op when signed out (the `NEXT_LOCALE` cookie still drives the UI). The `blog`/`nav` locale reads
  now go through the shared `pickLocale` helper (no behavior change).

- **Clerk UI localized + self-hosted `/sign-up`.** `<ClerkProvider>` now receives the active locale (the
  provider moved into `[locale]/layout.tsx`) so Clerk's sign-in/up + the account modal render in the
  visitor's language (`@clerk/localizations` `enUS`/`frFR`); a new `/sign-up` route renders `<SignUp>`
  carrying `unsafeMetadata.locale` (set `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`). **Why:** localized auth
  UI, and the captured locale drives the api's localized auth emails.
- **Unified account modal.** The header avatar and `/account` now open one Clerk `<UserProfile>`
  with two custom tabs — "Privacy & consent" (cookie choices) and "Your data" (export +
  deletion) — via the new `@indiecrafts/packages-web-auth/account` (`AccountButton` / `AccountPage`)
  over the shared, Clerk-free tab bodies in `@indiecrafts/packages-shared-compliance`. A single
  `AccountControl` wrapper resolves copy + consent categories from `messages` and `@/config`.
  Removed the old `AccountDeletePanel` (its delete/export now live in the "Your data" tab).
  **Why:** one account surface, identical on the website, app, and hybrid, with less per-surface
  UI to maintain.

### Fixed

- **`pnpm project:rename` was fully broken — now renames everything.** It aborted immediately
  (_"Could not find DEFAULT_SITE_PREFIX … nothing changed"_) because `CONFIG_INDEX` still pointed at
  `config/src/index.ts`, but the constant had moved to `config/src/web/site.ts` (index only re-exports
  it) — pointed it at the definition. Also closed two coverage gaps: the runner is now a **repo-wide
  sweep** of every `wrangler.toml` + `*.tfvars` under `code/` (the registry loop skipped `tools/storybook`,
  a non-registry deployable, though its own docs claimed rename covered it), and `BACKUP_BUCKET` (an R2
  bucket name carried in `[vars]`) is now in `RESOURCE_LINE` so a client's backups don't target the
  template bucket. Added a **`--dry-run`** flag (`project.test.mjs` covers the `BACKUP_BUCKET` case).
- **`POST /api/consent-log` (and `/api/session-log`) 500 → work again.** The `proxy.ts` matcher
  excluded `/api`, so `clerkMiddleware()` never ran for those routes and their `auth()` call threw
  _"can't detect clerkMiddleware()"_. Both authenticated API routes are now in the matcher, and the
  intl/CSP/maintenance pipeline passes any `/api` request straight through (`NextResponse.next()`)
  so next-intl can't locale-rewrite the endpoint and break the POST. **Why:** server-side consent +
  sign-in logging was failing on every request; the account modal's consent tab was unaffected
  (it writes `localStorage`), but the cookie banner's audit log was not.
- **`pnpm lint` and `pnpm format:check` work again — both were scanning build output.** Two gaps
  fixed together. (1) The `eslint.config.mjs` override set `jsx-a11y/*` + `@typescript-eslint/*` rules
  in a global object (no `files` key), but `eslint-config-next` registers those plugins only for
  specific file globs, so ESLint 9 threw "could not find plugin jsx-a11y" at config load; the override
  is now scoped to that same glob so the plugins resolve. (2) Neither the eslint `globalIgnores` nor the
  app's Prettier config ignored the Cloudflare / OpenNext build output (`.open-next/`, `dist/`,
  `.wrangler/`, `.turbo/`, `.sanity/`), so once a build existed both tools scanned 100+ huge minified
  bundles — ESLint exhausted memory (node OOM) and Prettier reported 118 false "style" hits. Added those
  build/generated dirs to the eslint `globalIgnores` and a new website `.prettierignore`. **Why:** the
  full `pnpm verify` (tsc + lint + format + tests + guards) now passes end-to-end; before, `pnpm lint`
  and `format:check` could not complete once the app had been built.

### Removed

- **Dead `BUTTONDOWN_API_KEY` from the website `.dev.vars.example`.** The Buttondown ESP integration
  was removed — the newsletter engine is provider-agnostic (it stores subscribers in Sanity, and an
  external ESP is wired via its own embed form, not an API key). No code read the var; the example line
  was stale and misleadingly implied a live integration.

### Added

- **`pnpm check:secret-leak` — CI-enforces that no server secret ships under a public build prefix.**
  A new guard (`code/shared/scripts/checks/secret-leak.mjs`, in `verify` + CI) reads every
  `.dev.vars.example` / `.env.example` as the secret registry, then scans app/brick/worker source
  for a documented secret carrying a `NEXT_PUBLIC_` / `EXPO_PUBLIC_` / `VITE_` prefix — the config
  NEVER "never expose a non-public token under a public prefix". A documented public value (e.g.
  `EXPO_PUBLIC_AGENT_TOKEN`, the bundle abuse-gate) is allowlisted by its own example entry.
  Colocated `secret-leak.test.mjs`; wired into root `verify` + `.vscode/tasks.json`; mirrors
  `check:api-guards` / `check:typed-routing`. **Why:** the existing `guard.mjs` write-hook only
  fires inside Claude Code — this is the CI backstop a human commit or pipeline also hits.

- **Self-service account delete now triggers Clerk step-up reverification.**
  `AccountDeletePanel` wraps the erasure fetch (`rawErasureFetch`) in Clerk's
  `useReverification`, so a stale first factor (the worker's `fva` gate, >10
  minutes) opens the reverification modal and auto-retries on success — a raw
  API call can no longer erase an account without a fresh factor. The
  post-reverification retry mints its token with `{ skipCache: true }`: a
  cached (~60s) token still carries the stale `fva` and would re-trip the
  server gate, silently defeating the step-up.
- **`pnpm check:typed-routing` — CI-enforces the typed-routing NEVER across every Next surface
  (`code/shared/scripts/checks/typed-routing.mjs`, in `verify` + CI).** The `website` bans direct
  `next/link` / `next-intl/navigation` imports via ESLint (`no-restricted-imports`), but the `admin` /
  `app` scaffolds ship tsc-only (no ESLint config), so that NEVER was convention-clean but not gated.
  A new registry-driven scan (reads the `next-cf` surfaces from `apps.mjs`, so a future Next surface
  auto-joins) fails if any surface imports the banned modules outside `src/i18n/routing.ts` — the one
  file that creates the typed wrappers. Colocated `typed-routing.test.mjs`; wired into root `verify`,
  CI `test.yml`, and `.vscode/tasks.json`. **Why:** admin/app were clean by convention only; this makes
  the config-first typed-routing rule a real gate on all three surfaces, not just the website. Mirrors
  the `check:api-guards` pattern.

### Fixed

- **`secrets:sync` no longer crashes on staging/prod (`scripts/sync-secrets.mjs`).** The clobber guard
  called `assertRenamed("web", env)`, but `web` is not an `apps.mjs` slug — `resourceName("web")` throws
  `unknown app slug`, so `secrets:sync:web:website:staging|prod` aborted before uploading (dev was masked
  by the guard's early return). Now passes the real slug `website`.

### Fixed

- **§09 quality pass — a11y + perf fixes (audit 2026-09-04).** **a11y:** the two erasure `<section>`s
  (`ErasureConfirmForm`/`ErasureRequestForm`) got `aria-labelledby` wired to their `<h2>` (the template's
  own structural rule); `/maintenance` layout now sets `dir={localeDir(locale)}` (was `lang` only — latent
  RTL gap); the header's `ThemeToggle`/`LocaleSwitcher` icon buttons use `size="icon-lg"` (40px, was 36px,
  below the touch floor); the header gained a `<lg` **mobile nav drawer** (Radix `Sheet`) — the Sanity-driven,
  uncapped nav previously overflowed 375px with no way to reach the rest (1.4.10 reflow risk). Documented the
  focus-ring reality in `accessibility.md` + `DESIGN.md`: app-authored controls use `ring-2 ring-ring`, the
  CLI-managed shadcn primitives ship the CLI default `ring-[3px] ring-ring/50` — reconcile via
  `components.json`, never hand-edit primitives. **perf:** `DefaultLayout` now runs one `Promise.all` of 6
  (was two back-to-back — an extra round trip on every page); the `getCategoryNav` subnav is folded into each
  blog-family page's own `Promise.all` (10 routes — was `await`ed as a JSX prop, serializing a round trip);
  `Logo` only marks the light variant `priority` so the dark logo no longer double-preloads.
- **Corrected the Cloudflare bot guidance in `infra/cloudflare/main.tf` — don't blanket-block AI bots.**
  The Bot-Fight comment advised turning on Cloudflare's "Block AI Bots", which is too broad: it blocks the
  search + user-fetch agents you WANT (Googlebot/AI Overviews, OAI-SearchBot, ChatGPT-User, Claude-User,
  PerplexityBot). The AI-**training** opt-out is already handled precisely by robots.txt
  (`AI_TRAINING_USER_AGENTS` → each training bot gets `Disallow: /`; search + user-fetch fall through to
  `*`), verified against the 2026 crawler landscape — so the site stays accessible + citable but is not
  used for model training. Added a commented, precise edge rule (blocks only the training UAs) as opt-in
  defence-in-depth. Bot Fight Mode stays on for genuinely malicious automation.
- **The hosted Sanity Studio now builds + deploys (`sanity.cli.ts`, `src/sanity/schema/ui-messages.ts`).**
  `pnpm studio:deploy` → `https://indiecrafts.sanity.studio/` is live. Three things blocked
  `sanity build` (its standalone Vite/Rollup build, unlike Next, doesn't replicate the app's
  resolution): (1) workspace source packages export `"./*": "./src/*"`, so a subpath like
  `@indiecrafts/x/sanity` hits a directory and Rollup won't index-fallback; (2) the `@/*` tsconfig path
  alias is unknown to Rollup. Both are handled by a small `vite` resolver plugin in `sanity.cli.ts`
  (try the direct path, else `…/index`; map `@/…` → `src/…`). (3) `uiMessages` auto-generates schema
  fields from `messages/en.json` keys, but `legal.dataRequest.types.withdraw-consent` (a kebab GDPR
  type-id reused as a key) is an invalid Sanity field name — `fieldsFrom` now skips keys that fail
  `/^[A-Za-z][0-9A-Za-z_]*$/`; they stay bundled-only (the i18n overlay falls back for any key Sanity
  doesn't carry, so the label still renders — it's just not CMS-editable). `deployment.appId` pins the
  target so later deploys don't prompt.

### Changed

- **The embedded Sanity Studio is excluded from the Cloudflare build (host it separately).** The
  `/studio` route pulled the whole `sanity` package (schemas + Vision) into OpenNext's single server
  Worker (~50 MB) — over Cloudflare's 10 MiB limit, so the website could not deploy. The route files are
  now `page.studio.tsx` / `layout.studio.tsx`, counted as pages only when `studio.tsx` is in
  `pageExtensions` (`next.config.ts`), which is gated by `NEXT_PUBLIC_EMBED_STUDIO`. `build:cf` sets it
  `false` ⇒ the Studio never enters the Worker (website now ships at ~9.8 MiB gzip). Local `pnpm dev`
  keeps the embedded Studio (default on). Host the production Studio with `pnpm studio:deploy`
  (`sanity deploy` → `<host>.sanity.studio`); set `NEXT_PUBLIC_SANITY_STUDIO_URL` and `/studio` redirects
  there (`next.config.ts` `redirects()`), else it 404s in prod. Draft-mode preview is unaffected (it uses
  the `@sanity/client`, not the Studio bundle). **Ceiling:** even without the Studio the Worker sits at
  ~9.8/10 MiB — watch the budget (`pnpm size`) when adding heavy deps. `@debt PERFORMANCE`.
- **Pinned Next `16.3.4` + `@opennextjs/cloudflare` `1.20.6` (exact) — the next-cf surfaces now deploy
  to Cloudflare.** The blocker was Next 16's Node-only `src/proxy.ts` vs older OpenNext rejecting Node
  middleware. OpenNext `1.20.6` adds **experimental** Node-middleware support, so the exact pin builds
  and ships `website`/`admin`/`app` (both verified via `build:cf` → `Worker saved 🚀`). The pin is
  **repo-wide**: all 16 workspace `next` entries moved to `16.3.4`, because a second Next in
  `node_modules` re-introduces a duplicate-types conflict that fails the OpenNext build. **Why:** unblocks
  the three OpenNext apps that could not reach Cloudflare before; the exact pin holds until
  `cloudflare/workers-sdk#13755` makes Node middleware stable. **Ceiling:** relies on an experimental
  OpenNext flag (`@debt MIGRATION`).
- **`project:rename` now covers the native surfaces too (`scripts/project-rename.mjs`).** Besides the
  config prefix + every Cloudflare app's `wrangler.toml`/tfvars, a rename now swaps the prefix in the
  Expo `app.config.ts` (`name`/`slug`/`scheme` + the `dev.<prefix>.app` bundle id), `eas.json` (the
  `EXPO_PUBLIC_API_URL` host prefix), and the Electron `electron-builder.yml` (`appId` + `productName`).
  **Why:** a client rename is complete in one command — no native config left on the template prefix
  (the prod domains in `domains.mjs` stay a separate, client-set axis).

### Added

- **Consent/legal confirmation toast.** `[locale]/layout.tsx` mounts a single `<Toaster>`;
  `CookieBanner`'s accept/reject, `CookiePreferences`' save, and `LegalNotice`'s accept each fire
  `showConsentSavedToast` (`@indiecrafts/packages-web-ui-components`) — "choice saved," with a
  Manage action that reopens the preferences dialog. The silent geo auto-seed never toasts.
  **Why:** confirm an explicit consent/legal choice, not the auto-seeded default.
- **Cookie preferences on `/account`.** The account page gains a "Cookie preferences" card with a
  `ManagePreferencesButton` that opens the site-wide `CookiePreferences` dialog — the destination
  the toast's Manage action points to.

### Fixed

- **`CookiePreferencesHost` now mounts for every consent mode.** It previously mounted only for
  `consentMode === "opt-out"` when `requireCookieConsent` was off, so the default `opt-in`/`none`
  mode left `openPreferences()` with no listener and the new `/account` Manage button silently did
  nothing. It now mounts whenever `CookieBanner` itself isn't rendering the dialog, regardless of
  mode.

### Changed

- **`/blog` is now module-driven.** `blog/page.tsx` renders the `blog` singleton's
  `frontpageModules[]` (via `pickFrontpage`, `blog/frontpage-select.ts`) when the editor has
  composed any; an empty array keeps today's behavior unchanged — the code-default
  `DefaultBlogFrontpage` (hero mosaic → explore → newsletter). The demo seed now composes a
  non-empty `frontpageModules` (hero → featured → category spotlight → collection → latest →
  explore) so `/blog` showcases the feature out of the box. **Why:** the frontpage was the one
  page-builder surface still hard-coded; it now composes from the same block catalog as a post.

### Added

- **`DefaultLayout` gains a `subnav` slot; blog pages mount the category bar.** A new optional
  `subnav` renders directly under the header chrome, above the page. Every blog + author page passes
  `subnav={await getCategoryNav(locale)}`, so the category nav (top-level categories + sub-category
  dropdowns) appears across the blog surface. New `pages.blog` message keys (`writtenBy`,
  `moreOnTopic`, `moreReading`, `allInCategory`, `categoryNav.*`). The demo seed adds 8 sub-categories
  (both locales) so the dropdowns have content.
- **Site-wide "share this page" — an editor-controlled Sanity setting.** `proxy.ts` sets an
  `x-pathname` header so `DefaultLayout` builds the absolute page URL server-side and renders the
  shared `ShareButtons` (X / LinkedIn / Facebook / copy-link) in the footer on every page — no
  per-page wiring, works without JS. **Enabled + the visible networks are editor-controlled in
  Sanity** — `siteSettings.share` (Studio → Paramètres du site → Partage): a master toggle plus a
  per-network checkbox each. The same setting also gates the share row under blog posts (the app
  route injects it), so **share is one shared setting, not blog-owned** — the old `features.share`
  code flag and the blog's `display.post.share` toggle are both gone. Copy is the single shared
  `common.share.*` (both locales; the duplicate `pages.blog.share` was removed).
  The blog post keeps its own richer inline share too.

### Fixed

- **Social follow links had no accessible name (a11y).** Each icon-only `<a>` in `SocialFollow`
  now carries `aria-label={l.label}` (the brand name), so a screen reader announces "X",
  "LinkedIn", … instead of an unlabeled link.

### Added

- **Documented the service-binding hardening for the internal `/v1/events` forwarders.** The
  `wrangler.toml` `[[services]]` stub now spells out that the four server-only forwarders
  (security-reports · consent-log · session-log · security-events) call `API_URL` over public HTTPS,
  and how to route that internal telemetry worker-to-worker instead (bind `API`, switch each forwarder
  to `getCloudflareContext().env.API.fetch(...)` with the current `fetch` as the off-CF fallback).
  **Why:** from the wahio review — internal worker traffic can skip the public hop; documented (not
  wired) because the endpoint is already bearer-gated + WAF-rate-limited, so it's defence-in-depth an
  operator enables, not a fix.
- **bfcache repair in `src/proxy.ts`.** On the responses it already stamps the CSP, the proxy now swaps
  Next's dynamic `Cache-Control: no-store` for `no-cache` on top-level HTML navigations
  (`Sec-Fetch-Dest: document`). `no-store` disables the browser back/forward cache entirely; `no-cache`
  still revalidates every request but lets bfcache restore instantly. Scoped by `Sec-Fetch-Dest`, so RSC
  prefetches and the feed/`llms.txt` route handlers keep Next's own (CDN-cacheable) caching. **Why:** from
  the wahio middleware review — instant back/forward nav at no correctness cost. (Runtime-unverified in-sandbox;
  confirm on deploy that the middleware `Cache-Control` wins over Next's `no-store` on page docs.)
- **Cloudflare edge hardening (Terraform) — sensitive-path block, tiered rate-limit, opt-in bad-bot challenge.**
  Three additions to `infra/cloudflare/main.tf`, run at the edge _before_ the Worker (unbypassable, 0
  invocations): (1) the `http_request_firewall_custom` ruleset now **blocks probes for `.env`/`.git`/`.sql`/`wp-*`
  paths** (regex-free `ends_with`/`contains`) — merged with the existing leaked-credentials challenge since a zone
  allows one ruleset per phase; (2) the `http_ratelimit` ruleset is now **tiered** — a tighter cap
  (`rate_limit_form_requests`, default 10) on the form/report endpoints (`/api/{data-request,contact,comments,newsletter,waitlist,csp-report}`)
  ahead of the general `/api/*` cap; (3) an **opt-in** `block_bad_bots` var managed-challenges scraper UAs
  (scrapy/python-requests/curl/headless…) on content routes — off by default (a public site wants search bots;
  robots.txt already handles AI-training opt-out). **Why:** move edge-appropriate hardening to the edge (from
  the wahio middleware review) instead of the Worker hot path. Authored only — the tfvars are placeholders; CI's
  `infra` job validates, ops applies. See [`cloudflare-iac.md`](../../../../docs/infra/cloudflare-iac.md).
- **`/maintenance` now carries a CSP; the CSP-enforcement e2e is a blocking CI gate.** Two
  loose ends from the enforce rollout: (1) `/maintenance` is excluded from the proxy matcher like
  `/studio`, so `cspMode: "proxy"` left it shipping **no** `Content-Security-Policy` on a direct hit —
  `next.config.ts` now adds a static `permissiveCspRule("/maintenance", …)` (the proxy still stamps the
  nonce CSP on the internal rewrite when maintenance mode is on). (2) `e2e/journeys/csp-nonce.spec.ts`
  ran only inside the advisory `browser` job; a new **blocking** `csp` job in `.github/workflows/test.yml`
  runs just that spec (real browser + built app), so a broken nonce pipeline fails the PR now that
  enforce is the live default — split out so the untrusted visual baselines stay advisory. **Why:**
  close the last no-CSP route and make enforce a gate, not a hope. See
  `code/docs/apps/web/seo/security-headers.md`.
- **Block AI-training crawlers in `robots.txt` — `features.blockAiTraining` (default on).** When the
  site is indexable, `src/app/robots.txt/route.ts` now emits a `Disallow: /` group per AI-_training_
  crawler (`AI_TRAINING_USER_AGENTS` from `@indiecrafts/packages-shared-config` — GPTBot,
  Google-Extended, CCBot, ClaudeBot, …) before the `User-agent: *` allow group. Robots.txt matches the
  most specific user-agent, so search and AI-_search_ bots (Googlebot, Bingbot, PerplexityBot,
  OAI-SearchBot, …) fall through and keep indexing. **Why:** fight the learning bots without losing
  search — even AI search. robots.txt-only (no broad, barely-honored `X-Robots-Tag: noai`). The route
  logic is extracted to a pure `robotsTxt()` builder with a colocated test.
- **Proxy-set, per-request nonce CSP — `CSP_MODE`.** `src/proxy.ts` now generates one nonce per
  request (`generateNonce`) and stamps the response with `cspHeadersForMode(...)` from
  `@indiecrafts/packages-shared-security`: `CSP_MODE=enforce` ships the strict nonce `script-src`
  (`'nonce-…' 'strict-dynamic'`) as the enforced policy; the default `CSP_MODE=report-only` keeps the
  existing permissive policy enforced (nothing breaks) and ships the strict policy as
  `Content-Security-Policy-Report-Only` so violations surface first. The nonce is threaded to the root
  layout (`AppClerkProvider`) and the `[locale]` layout's Google Analytics `<Script>` tags via the
  `x-nonce` request header; Next.js auto-nonces its own inline scripts once the header carries one — no
  extra wiring needed there. `next.config.ts` drops the static `Content-Security-Policy` from
  `headers()` (`cspMode: "proxy"`) since the proxy now owns it, and adds a `studioCspRule` scoped to
  `/studio` that reproduces the old permissive CSP exactly (`'unsafe-inline'`, no nonce) — the embedded
  Sanity Studio isn't behind the proxy and can't take a per-request nonce. **Why:** a static
  `'unsafe-inline'` CSP can't stop inline-script injection; a per-request nonce can, and `CSP_MODE`
  lets us observe violations in report-only before enforcing, with a same-env kill switch back to
  report-only if enforcement ever breaks something. e2e proof: `e2e/journeys/csp-nonce.spec.ts`. See
  `code/docs/apps/web/seo/security-headers.md`.
- **CSP violation reporting + `/api/csp-report`.** `next.config.ts` now passes a `reporting` option
  to `securityHeaders({...})`: the enforced CSP gains a `Reporting-Endpoints` header pointing at the
  new same-origin `/api/csp-report` route, and a `Content-Security-Policy-Report-Only` candidate
  ships alongside it that drops the blanket `https:` from `img-src` (`reportOnly: { dropSources:
["https:"] }`), so we learn the real image allowlist from reports before enforcing it. The route
  itself is a one-line delegate to `handleCspReport` from the new
  `@indiecrafts/packages-web-security-reports` brick, which sanitizes and forwards violations
  server-side. **Why:** turn the CSP from write-only into something we can observe and tighten —
  starting with the image-source allowlist — without risking a live block.
- **Anonymous branded erasure flow (`/erasure` + `/erasure/confirm`).** A signed-out visitor
  requests erasure by email at `/erasure` (Turnstile-gated, posts form-encoded to the shared api's
  public `POST /v1/erasure/request`), then confirms via the emailed link at `/erasure/confirm`
  (types their email, posts JSON to `POST /v1/erasure/confirm`). Both routes share the new
  `features.legal.erasure` flag; `/erasure/confirm` reuses the same `pages.erasure` gate — no
  separate `pages` entry. A short cross-link on `/data-request` (`legal.dataRequest.erasureNote`)
  points visitors here for the erasure right specifically. Copy in `messages.legal.erasure.*` (en +
  fr). **Why:** a faster, self-service erasure path that needs no account, alongside the existing
  authenticated `/account` delete and the general GDPR data-request form.
- **Self-service "Delete my account" (`/account`).** A new Clerk-authenticated page mounts the
  shared `DeleteAccountSection` (`@indiecrafts/packages-shared-compliance/web`) via the
  `AccountDeletePanel` client wrapper, which posts the authenticated `POST /v1/erasure/self` to
  the shared api worker, then signs the visitor out and returns them home. New
  `features.account.delete` flag + `pages.account` route entry; copy in
  `messages.account.delete.*` (en + fr). Gated three ways — the flag, Clerk being configured
  (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`), and the client api origin being set
  (`NEXT_PUBLIC_API_URL`, new — added to `.env.example`) — any one missing 404s the route, so the
  control never renders somewhere it can only fail on submit. **Why:** the GDPR data-request form
  covers every right by email; this is the one-click erasure path for a signed-in account.
- **Self-service "Download my data" (`/account`).** The same `/account` page now also mounts the
  shared `ExportSection` (`@indiecrafts/packages-shared-compliance/web`) beside `DeleteAccountSection`,
  via the `AccountDeletePanel` client wrapper, posting the authenticated `POST /v1/export` to the
  shared api worker and opening the returned single-use, 1-hour-expiring download link in a new tab.
  New `features.account.export` flag (gates just the control's render — the page's own visibility
  still follows `features.account.delete`); copy in `messages.account.export.*` (en + fr). **Why:**
  GDPR data portability alongside the existing erasure control, on the same authenticated page.
- **Geo-targeted cookie consent.** The `[locale]/layout` reads the visitor's `cf-ipcountry`
  server-side and passes a geo-resolved `mode` to `CookieBanner`: EU/EEA/UK + territories show the
  opt-in banner, the US gets no blocking banner (opt-out + preferences + GPC), elsewhere shows
  nothing. Per-country/regulation config in `src/config/consent.ts` (`ConsentConfig` — named
  regulations + overrides, cascading to territories). **Why:** don't show an opt-in banner where it
  isn't required, while staying compliant everywhere. Design → `code/docs/apps/web/config/cookie-consent-geo.md`.
- **CCPA "Do Not Sell or Share My Personal Information" footer link.** `Footer` now renders a
  `DoNotSellLink` (`@indiecrafts/packages-web-compliance`) that opens the existing cookie-preferences
  dialog via `openPreferences()` — no new consent UI. `DefaultLayout` resolves `consentMode` from
  `cf-ipcountry` server-side (same as `[locale]/layout.tsx`) and gates the link to `opt-out`
  (US/CCPA) visitors, so it never flashes for EU/other visitors. Copy in `messages.cookies.doNotSell.link`
  (en + fr). **Why:** opt-out regions had no visible privacy-choices affordance outside the
  cookie-policy page — CCPA/CPRA expects a footer-prominent link. The dialog the link opens (and its
  `OPEN_PREFERENCES_EVENT` listener) previously lived only inside `CookieBanner`, which
  `[locale]/layout.tsx` mounts only when `requireCookieConsent` is on (off by default) — so on a
  default-configured site the link did nothing. `[locale]/layout.tsx` now also mounts the new
  standalone `CookiePreferencesHost` (same dialog + listener, no banner) whenever `requireCookieConsent`
  is off and `consentMode === "opt-out"`, so the control always works for a US visitor.
- **Announcement toast + per-surface targeting.** `DefaultLayout` now also mounts the new
  `AnnouncementToast` (a self-contained corner card — title/body/optional image/link, editor-set
  dismiss) beside the existing bar, and passes `surface="website"` so an editor can target which
  surfaces each announcement reaches (the bar/toast now carry a `surfaces` field). Toast dismissal is
  decided server-side (cookie) like the bar, so no flash. **Why:** richer, targeted announcements —
  and the same content now also reaches the app/mobile/hybrid shells (logged-in only) via the api Worker.
- **Website sign-in — shared `<SignInView>` route + header Sign-in / User button.** New
  `/[locale]/sign-in/[[...sign-in]]` renders the shared Clerk sign-in (`@indiecrafts/packages-web-auth`,
  email + social, themed from tokens); the header shows a "Sign in" button (Clerk modal) when signed out
  and the account menu when signed in (`AuthMenu`, opt-in on the publishable key). Post-sign-in lands on
  the homepage, honoring a **validated** `redirect_url` (same-origin only). Strings in `messages`
  (`nav.signIn`). The route 404s when Clerk is unconfigured. **Why:** a real, polished sign-in affordance
  (was provider-only) with correct, safe redirects.
- **Session logging (opt-in).** `SessionLogger` in `[locale]/layout` pings the new `/api/session-log`
  route on sign-in, which forwards to the audit api (`API_URL` + `APP_API_TOKEN`, server-only) → EU D1.
  **Why:** per-surface sign-in tracking; the api secret never reaches the browser.
- **Edge security — leaked-credentials rule (Terraform).** `infra/cloudflare/main.tf` gains a
  `cloudflare_ruleset.leaked_credentials` (managed-challenge on `cf.waf.credential_check.*`, gated by
  `enable_leaked_credentials`, Free-plan one field) + a note to turn on **Block AI Bots**. Full posture →
  `code/docs/apps/web/config/security-hardening.md`. **Why:** credential-stuffing defence at the edge, free,
  zero app load.
- **Auth foundation — Clerk wired into the app shell (opt-in).** The root layout (`src/app/layout.tsx`)
  mounts `AppClerkProvider` (`@indiecrafts/packages-web-auth`) and `src/proxy.ts` wraps the
  maintenance→locale pipeline in `clerkMiddleware` — **both gated on
  `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`**, so with no key bound the site runs exactly as before (fail-open,
  like Turnstile/Resend). `src/global.d.ts` types Clerk's session claims from
  `@indiecrafts/packages-shared-auth` (`CustomJwtSessionClaims`) via an empty single-extends interface
  (declaration merging — a type alias can't merge), which the eslint config now allows
  (`@typescript-eslint/no-empty-object-type: with-single-extends`) instead of a per-line disable.
  `.env.example` documents the publishable (public) + secret (server-only) keys. Passwordless (email OTP + social); **no admin gate on
  the website** — the admin role is enforced only on the admin app. **Why:** one auth system across every
  app, off by default so the template still runs configuration-free. Design → `code/docs/apps/web/config/auth.md`.
- **Hook — `guard.mjs` allows publishable keys under `NEXT_PUBLIC_`.** The `NEXT_PUBLIC_*SECRET/KEY`
  leak-check now exempts a `*PUBLISHABLE*` match (Clerk / Stripe `pk_…` are public by design); every real
  secret still blocks. **Why:** Clerk's SDK requires the exact public name `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.

- **Offline banner — a non-blocking connectivity strip in `DefaultLayout`.** A slim `OfflineBanner`
  (`role="status"` `aria-live="polite"`, `bg-secondary` tokens) shows while offline and auto-hides on
  reconnect. Copy in `messages.offline.banner` (en + fr); the full-screen `OfflineContent` (for a route
  that can't render offline) is the `system-pages` component. **Why:** losing the network was a silent
  failure — now the visitor is told, in their language, without blocking the page.
- **Offline banner + detection moved to `system-pages`.** The local `useOnlineStatus` hook and
  `OfflineBanner` component are dropped; `DefaultLayout` now imports both from
  `@indiecrafts/packages-shared-system-pages/web`. **Why:** the `app` surface and the Electron renderer
  needed the same detection + banner — one implementation instead of three.
- **Account copy assembled via the shared `compliance` builders.** `account/page.tsx` now calls
  `buildDeleteAccountCopy`/`buildExportCopy` (`@indiecrafts/packages-shared-compliance/web`) instead of
  hand-assembling the `DeleteAccountCopy`/`ExportCopy` objects field-by-field. **Why:** the field list now
  lives in one place, shared with `app`, mobile, and hybrid.
- **AI agent on the web — cross-origin call to the shared agent Worker + a translated demo UI.** The
  `ContentResearchAgent` client component posts a goal to the standalone `code/shared/agent` Worker
  (`NEXT_PUBLIC_AGENT_URL` → `POST /v1/agent/:name`), guarded by Turnstile (the site ships only the public
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; the Worker holds `ANTHROPIC_API_KEY` + `TURNSTILE_SECRET`). The Worker
  origin is in the CSP `connect-src`. Ideas render **for human review** — every string in
  `messages/<locale>.json` (en + fr), the active locale sent so the agent answers in the visitor's
  language. The **same Worker** backs the native/hybrid apps (by bearer). _Why: one small, secure,
  translated agent that works the same on every surface — hosted once, deployed + rate-limited on its own._

- **Contact form — a `/contact` page + `module.contact` block, wired end to end.** New `features.contact`
  flag, `pages.contact` route entry, `security.contact` guard config (rate limit + Turnstile + 12 KB
  body cap), the `/api/contact` route (`withGuard` → the module's `submit()`), the `[locale]/contact`
  page shell, `@indiecrafts/contact` in `transpilePackages` + deps + the `ui-tokens` `@source` list,
  `contactSanity(features.contact)` in the Studio, the `contact` block flag in `configureIslands`, and
  contact samples in the **Send test** email route. _Why:_ visitors had no way to send a message and
  get an acknowledgement. Feature lives in `@indiecrafts/contact`; this app only wires it.

- **Contact message CSV export — `pnpm contact:export`.** `scripts/contact-export.mjs` writes
  `backups/contact/contact-<timestamp>.csv` (read-only, `SANITY_API_READ_TOKEN`), matching
  `waitlist:export` / `export:web:website:subscribers` / `comments:export`. _Why:_ every stored entity now has the
  same export escape hatch.

### Changed

- **CSP now ENFORCED by default (`CSP_MODE` default flipped from `report-only` to `enforce`); set
  `CSP_MODE=report-only` to roll back.** `src/proxy.ts`'s `CSP_MODE` fallback flips: env unset now
  resolves to `enforce` instead of `report-only`. **Why:** the strict nonce CSP shipped observe-only
  since SP3; the strict policy now graduates to actually blocking inline-script injection instead of
  just reporting it. `e2e/journeys/csp-nonce.spec.ts` rewritten to assert the enforced strict CSP
  (was: Report-Only).
- **Surface id is now one config value, not a scattered literal.** Added
  `surface` to app-owned `@/config` (`src/config/surface.ts`, `"website"`). The
  audit/telemetry origin — hardcoded as `"website"` in the consent-log route and
  the `SessionLogger` mount, and defaulted to `"web"` in the session-log route —
  now reads from that one home. _Why:_ as surfaces multiply (admin, app, mobile),
  the consent + session audit trail must tag the right origin; a copied route
  changes one config value instead of hunting magic strings, and a malformed
  session body now falls back to the correct surface rather than a generic `"web"`.

- **Icons + fonts now come from shared bricks.** Icon usage moved onto
  `@indiecrafts/packages-shared-ui-icons`: the footer/social + homepage showcase render `BrandIcon`
  (from shared SVG data), `NavIcon` uses the brick's `ReiconIcon`, and `FeatureGrid`'s Studio picker is
  single-sourced. The website's own `BrandIcon.tsx`, its `reicon-brands` + `reicon-react` deps, and the
  two stale `doctor.config` overrides are removed. Self-hosted **fonts** (Satoshi `.woff2`) moved to
  `@indiecrafts/packages-shared-ui-fonts`; `src/lib/fonts.ts` points `next/font` `localFont` at the
  brick. No visual change — same paths, same faces, one source.
- **Nav route dropdown lists only activated pages.** `ROUTE_OPTIONS` in `nav-item.ts` now filters the
  `pages` map to `enabled !== false`, and `ROUTE_LABELS` gained `contact` · `waitlist` · `data-request`
  labels. So an editor can't link a disabled route, and an activated page (blog, contact, …) appears in
  Studio → Navigation the moment its flag is on — the generic pattern for every page. Render-time
  `getNavigation` already dropped disabled links; this closes the editor side.

- **Waitlist + contact `enabled` toggle is now a live API kill switch.** `/api/waitlist` + `/api/contact`
  read the Studio `*Settings.enabled` and `404` when off, in lockstep with the page. _Why:_ an editor can
  deactivate the feature from Sanity with no deploy — not just hide the page. The block still gates on the
  code flag (the inline render path can't be async).

- **DESIGN.md gains an ordered design-critique principle _(design)_.** §Definition of done now says:
  to refine a screen, run four critique passes in a fixed order — accessibility → visual hierarchy →
  content → interaction-states — one lens at a time, fixing before the next (a11y first = the foundation
  a later fix must not regress). Each pass cites its DESIGN.md section. Runnable via the `design-critique`
  skill; shipped reference at `docs/apps/web/design/design-critique.md`. _Why: the template reviewed in
  parallel batches but had no ordered critique-then-fix loop for polishing one screen._
- **API safety: one reviewable security surface + a check that keeps it that way.** After auditing
  every route handler (all safe by design — writes are whitelisted with bound GROQ params, secrets
  are server-only, redirects/tokens are HMAC-signed), two hardening changes landed. (1) The one-click
  email **`/api/comments/moderate`** POST — the sole mutating route with no app-layer throttle — now
  calls `rateLimit` (20/600s, defence-in-depth on its single-use token; `clientIp` was exported from
  `@indiecrafts/security/guard` to share the trusted IP derivation). (2) A new **`pnpm check:api-guards`**
  (`code/shared/scripts/checks/api-guards.mjs`, in `verify` + CI) fails if any public **mutating** route
  ships without `withGuard` or an allowlisted reason — so "all API safe" holds without a manual re-audit.
  _Why: the surface was safe but unenforced; a future POST could regress it silently._
- **Cloudflare configs expose the full option surface (commented) + a domain-authority + admin-Access.**
  The bare workers gain a commented **bindings & runtime-options reference** — `code/shared/api/wrangler.toml`
  is the full list (KV · R2 · D1 · queues · services · Durable Objects · AI · Vectorize · Hyperdrive · Browser ·
  Analytics Engine · mTLS · send_email · `[placement] smart` · `[limits]` · `[[tail_consumers]]` · `[vars]` ·
  `[dev]` · source maps); `cron`/`workers` carry the scheduled/queue subset + a pointer; the website adds
  placement/limits/hyperdrive/tail. Terraform (`infra/cloudflare/main.tf`) gains commented **Zero-Trust Access**
  (gate the admin app behind SSO — copy into admin's own infra when it ships), a **www→apex redirect ruleset**,
  a **DNS record**, and a **Logpush job**. **Domain double-attach resolved:** Terraform
  `cloudflare_workers_custom_domain` is authoritative; `domains:print` now prints the wrangler-route and tfvars
  paths as **mutually exclusive** ("pick one"), and the wrangler comment + `deployment.md` + `cloudflare-iac.md`
  say so. _Why:_ configure a maximum at the edge without leaving the tree, and stop the two domain mechanisms
  fighting. Env-file check: `.env.example` was already complete (opt-in secrets shown commented); added the
  optional `NEXT_PUBLIC_SANITY_STUDIO_BASE_PATH`.

### Changed

- **Theme switcher drops "System"; OS auto-detect stays, automatic.** The toggle now offers only
  **Light** and **Dark** — no "System"/Monitor option. First-load **auto-detect of the OS theme**
  (`prefers-color-scheme`) is kept but **decoupled from the menu**: `themeProviderProps` sets
  next-themes' `enableSystem` + `defaultTheme:"system"` whenever both themes are offered and none is
  forced, so a dark-OS visitor still lands in dark without picking. The `system` flag was removed
  everywhere — `themeConfig`, the `ThemeConfig`/`ThemeMode` types, the Sanity `siteSettings.themeModes`
  field, and the `common.themeSystem` string (both locales). No CSS/token change (the generated
  double dark-trigger already auto-detects); a legacy stored `"system"` preference still resolves.
  _Why: "System" is the default behaviour, not a mode — one fewer confusing menu row._
- **Per-route API guard limits moved to one app-owned config, `src/config/security.ts`.** The
  `rateLimit` / `bodyMax` / `turnstile` options that were inline literals in each public POST route
  (repeating `windowSec: 600` and the body-cap tiers across six files) now live in one reviewable
  `security` object, imported via `@/config` and passed as `withGuard(handler, security.<name>)`.
  Values are byte-identical — no runtime change. _Why: one home per fact, and a single place to review
  or tune the whole API's abuse policy (documented in `docs/apps/web/config/security-limits.md`)._
- **Cloudflare resource names now follow the folder tree — `<prefix>-<env>-<platform>-<slug>`, env-first.**
  One formula (`resourceName` in `scripts/lib/apps.mjs`) replaces the hand-typed, special-cased names:
  `indiecrafts-web` → `indiecrafts-<env>-web-website`, `indiecrafts-admin` → `…-web-admin`,
  `indiecrafts-{api,cron}-prod` (stray `-prod`) → `indiecrafts-prod-shared-{api,cron}`. R2/KV/D1 stems +
  Terraform `worker_name` follow (e.g. `…-web-website-isr`). **Fixes two deploy blockers:** (1) the
  clobber-guard was **dead for the flagship** (`web`≠`website` slug/stem mismatch) and **unreachable for
  `code/shared/*`** — it now compares every app against `resourceName(app,"prod",TEMPLATE_PREFIX)` and fires
  for all five; (2) `project:rename` is registry-driven, reaches `code/shared/*`, and a client rename is a
  single `<prefix>` swap (was a broken loop over the wrong directory). `project.mjs` reads `@indiecrafts/config`
  by script-relative path (was CWD-relative → wrong at surface depth). _Why:_ names mirror `code/`, prod stops
  clobbering under a shared account, and adding an app gets a correct name for free. `resourceName` is unit-tested.

### Added

- **Editor-curated `/llms.txt` sections + a last-reviewed date — all in Sanity, per language.**
  Each page's **SEO & visibilité** gains **Section pour les IA** (`seoMeta.llmsSection`): the `## H2`
  the page groups under in `/llms.txt` (empty = the default « Pages »). The per-language **Résumé pour
  les assistants IA** singleton (`siteMeta.<locale>.llms`) gains **Ordre des sections** (`sectionOrder`,
  orders the H2s) and **Dernière révision** (`reviewedAt`, printed as `Last reviewed:` in the header).
  Since every rendering doc is per-locale, the grouping is per-locale with no extra model. Why:
  `/llms.txt`'s only real edge over a sitemap is editorial judgement — this hands that judgement to the
  editor in the Studio, not code or config. Touched: `seoMeta` (`@indiecrafts/schema`), `siteMeta`,
  `seo-queries.ts`, `site-seo.ts`, `llms.txt/route.ts`. Evidence that llms.txt drives AI citations is
  weak (Google declines it); shipped as the cheap option + an editorial forcing function, not a growth lever.

### Changed

- **Design tokens adopt the W3C DTCG 2025.10 standard — one JSON source, all platforms _(design)_.**
  `code/packages/shared/ui-tokens/src/shared/tokens.json` (DTCG, 3-tier primitive→semantic→component, OKLCH
  structured color) is now the **single source of truth**. `pnpm tokens:build` (`scripts/build-tokens.mjs` +
  `culori`) generates: `globals.css` token blocks (web, unchanged values — `globals.css` now `@import`s the
  generated file, keeping only hand-authored Tailwind scaffolding), `native/tokens.ts` (**React Native** hex
  object — fixes the gap where mobile couldn't read the CSS/oklch tokens), and the manifest hex mirror
  (`theme.hexColors` now imports it — the old "keep oklch + hex in sync by hand" trap is gone). Guarded by
  `pnpm tokens:check` (in `verify`) + a local `tokens-fresh` PostToolUse hook. Value-neutral: `verify:contrast`
  - the light/dark parity test pass unchanged. Why: DTCG is the cross-vendor standard (Figma/Style-Dictionary/
    Tokens-Studio interop) **and** the machine contract AI agents read to use real tokens, not invented hex.
- **`code/projects/` regrouped by platform → kind; the flagship `web` app is now `website`.**
  Deployables nest as `code/projects/<platform>/<kind>/<name>`: `web/apps/{website,marketing,admin}`
  · `web/services/{api,cron,workers}` · `web/tooling/storybook` · `mobile/apps/mobile` ·
  `hybrid/apps/hybrid`; `docs/` stays top-level (npm-isolated). The flat `web` → **`website`**
  (`@indiecrafts/web` → `@indiecrafts/website`; `deploy:web:*`/`backup:web:*`/`infra:web:*` →
  `:website:`). The **registry** (`scripts/lib/apps.mjs`) now carries `platform · kind · dir` and is
  the single source of each app's path — every resolver (`deploy-all`, `infra`, `setup-bindings`,
  CI preview matrix, the `apps.test` guard) reads `app.dir`, never a hard-coded `code/projects/<slug>`.
  `pnpm-workspace.yaml` globs `code/projects/*/{apps,services,tooling}/*`; each moved app's relative
  paths (`tsconfig` package maps, `vitest.shared`, root-script calls) were re-depthed (+2). The stray
  `desktop/` was removed. _Why:_ a flat 11-entry `projects/` couldn't tell an app from a worker from a
  tool; platform → kind stays scannable as it scales. Verified: `tsc` 8/8 · `lint` · `apps.test` ·
  tags · delivery-canary · docs:build. The docs site's sidebar/link drift was fixed separately (see the
  docs changelog); its `apps/ · packages/ · modules/ · shared/` foldering already mirrors the code at
  the right altitude, so a deeper URL re-folder was intentionally skipped.

- **Dependency refresh — Next.js 16.3.1, React 19.2.8, + a safe same-major sweep (platform-wide).**
  Bumped the exact `next` 16.2.10 → 16.3.1 and `react`/`react-dom` 19.2.4 → 19.2.8 pins across every
  next-cf app (`web` · `admin` · `marketing`) and every shared package/module peer + dep;
  `eslint-config-next` + `@next/bundle-analyzer` 16.2.4 → 16.3.1 to match. Also floated the
  **same-major** minor/patch line: Sanity `5.26 → 5.31.1` (`sanity` · `@sanity/vision` · `@sanity/client`
  `7.22 → 7.26.2` · `@sanity/document-internationalization` → 6.2.30), `next-sanity` → 13.3.3,
  `next-intl` → 4.13, `tailwindcss` + `@tailwindcss/postcss` → 4.3.3, `radix-ui` → 1.6.7,
  `@base-ui/react` → 1.7.0, `lucide`/`lucide-react` → 1.31, `react-hook-form` → 7.85,
  `@hookform/resolvers` → 5.8, `styled-components` → 6.5.2, `tailwind-merge` → 3.6, `sonner`,
  `prettier`, `turbo`, and more. `mobile` (Expo, React 18.3.1) is untouched. Floating `next-sanity`
  pulled `@sanity/client@7.26.2`, which needed `sanity 5.31.1` + a `pnpm dedupe` to collapse a stray
  second `sanity`/`@sanity/client` copy (the `sanity: "*"` peers held 5.26.0) — otherwise two
  `@sanity/types` clashed. **Verified:** `tsc` 8/8 · `build` (web prerender) · `lint`. _Why:_ stay
  current on the runtime toolchain without taking on a major migration. **Held for a dedicated pass
  (breaking majors):** Sanity 5 → 6, Storybook 9 → 10, Vite 6 → 8, TypeScript 5 → 7, eslint 9 → 10,
  Vitest 3 → 4, `@types/node` 20 → 26, `@portabletext/react` 6 → 8.

- **One SEO model on the doc — the central `pageSeo` array is gone.** Per-page SEO + LLMs no longer
  live in a central `siteMeta.<locale>.pageSeo[]` array. Every document a route renders now carries
  its own `.seo` (the shared `seoMeta` object, `@indiecrafts/schema`), so each page is self-contained
  and there is ONE field-set, ONE editor UI, ONE type. `getPageSeo(pageId, locale)`
  (`src/lib/seo/site-seo.ts`) resolves each static route to its owning doc's `.seo`: `home` → the home
  `page` doc · `blog` → the `blog` singleton · `author`/`category`/`tag` (list pages) → `blog.indexSeo.*`
  · legal pages → the matching `legalPage` · `waitlist` → `waitlistSettings`. `data-request` owns no
  doc, so it uses the layout default. `buildMetadata` + `<PageSchemas>` + the sitemap + the three llms
  endpoints all read the resolver; the route call-sites are unchanged. _Why:_ the SEO/LLMs fields were
  spread across THREE near-duplicate objects (`seoMeta` + post `metadata` + the central `pageSeo`) with
  divergent field names, and the doc-level copy sat dead while the central array drove the render —
  "as few models as possible" (user), each page self-contained.

- **`seoMeta` is now the superset + naming is standardised.** Added `keywords`, `schemaImage`,
  `canonical`, and `structuredData` to `seoMeta` (previously only on the deleted `pageSeo`). Field names
  standardise to `image` (the OG card, was `ogImage`) and `noIndex` (was `noindex`); `schemaImage` stays
  the distinct Google rich-result image. `siteMeta.<locale>` keeps only the site-wide DEFAULTS (tagline,
  description, keywords, default OG, llms, systemPages, taxonomyPages, versionPrompt).

- **Posts split `metadata` → `media` + `seo`.** The post `metadata` object is deleted. The slug + cover
  image/video move to a new `postMedia` object (`post.media`); post SEO uses the shared `seoMeta`
  (`post.seo`). The cover `media.image` doubles as the OG/social card unless `seo.image` overrides it.
  GROQ re-projects `media` + `seo` back into the old `metadata`-shaped output + `slug`, so every reader
  of a post (cards, hero, RSS, `/md`, llms) is unchanged.

- **Index + landing SEO is single-value (deliberate trade).** The `blog` and `waitlistSettings`
  singletons are locale-independent, so `/blog`, `/author`, `/blog/category`, `/blog/tag`, and `/waitlist`
  now carry ONE SEO value across locales (was per-locale in the old array). `home` and the legal pages
  keep per-locale SEO (their docs are translated). This is the accepted cost of the "fewest models"
  consolidation; add per-locale objects on the singletons later if a client needs it.

### Removed

- **The `pageSeo` object + `siteMeta.pageSeo[]` array + the post `metadata` object.** Replaced by the
  per-doc `.seo` (`seoMeta`) above. `getSiteSeo` no longer returns a `pageSeo` Map; the `siteMeta`
  "Pages" group is gone.

- **Deploy is registry-driven + CI fans out (platform).** One app registry (`scripts/lib/apps.mjs`) is the
  source of truth; shared runners (`deploy-next` · `deploy-worker` · `deploy-expo` · `deploy-electron`)
  dispatch by platform class; the deploy/build/preview workflows matrix over the registry (adding an app
  needs no workflow edit) — replacing the web-pinned pipeline. Full model →
  `docs/shared/architecture/platform-deploy.md`.

- **Infra folded into the app — `code/infra/` removed.** Each app's Cloudflare edge Terraform is now
  **co-located + self-contained** at `code/projects/<app>/infra/` (one `main.tf`, all resources inlined —
  no shared module); the `code/infra/` folder (module + empty `ci/`/`envs/` stubs) is deleted.
  `scripts/infra.mjs` resolves `code/projects/<app>/infra`; add IaC to an app by copying that dir. _Why:_
  an app owns its whole deploy surface (`wrangler.toml` + `infra/`) — no separate infra tree to keep in sync.

### Added

- **Per-env asset CDN (`NEXT_PUBLIC_CDN_URL` → `assetPrefix`).** The app's own build assets (`/_next/*` +
  first-party `/public`) can serve from a CDN **per environment** — set `NEXT_PUBLIC_CDN_URL` (empty =
  origin). It feeds `@indiecrafts/config` `site.cdnUrl` → Next `assetPrefix`; since each env deploys its own
  build (with that env's GitHub-Environment var, now passed into every CI build), the prefix is per-env with
  no extra machinery, and any app opts in the same way. **Sanity content is untouched** — it keeps
  `cdn.sanity.io`. _Why:_ a per-env, per-app CDN for first-party assets, config-only. Docs: `config/images.md`.

- **E2e journey — the gated download route is token-guarded.** A new `e2e/journeys/download.spec.ts`
  asserts `/api/download` answers `403` (never a redirect to the file) for a missing, empty, garbage,
  or tampered `token`, and leaks no `Location` header. Deterministic — the guard short-circuits before
  any Sanity read, like `api-guard`. _Why:_ the gated lead-magnet download had no journey proving an
  unconfirmed request can't reach the CDN URL.

### Fixed

- **Translated content pages now emit correct `hreflang` alternates + the locale switcher covers
  author/series.** A blog/CMS detail page that has a real translation (linked by `translation.metadata`)
  now advertises it via `<link rel="alternate" hreflang>`, resolved by the new
  `@/lib/seo/translations` (`translationAlternates`); a single-locale page self-references, so it never
  claims a translation that isn't there. `/api/i18n/translated-slug` + `useLocaleSwitch` gained `author`
  - `series`, so switching language on `/author/*` or `/blog/series/*` lands on the translated doc, not
    the homepage. _Why:_ `buildMetadata` previously collapsed every detail page's hreflang to self-only,
    and the switcher fell back to `/` for author/series — real translations went unadvertised.

- **Newsletter · waitlist — closed the membership-enumeration oracle + hardened double opt-in.**
  `/api/newsletter` + `/api/waitlist` now answer `201` for both a new and an already-known email
  (identical body) instead of `200 { already }`, so a prober can't enumerate who is subscribed; the
  three capture forms drop their now-dead "already" state. `/api/newsletter/confirm` is now
  **POST-only** (paired with the new confirm page). _Why:_ the `200`-vs-`201` split leaked membership,
  and the GET confirm let a mail scanner / link-prefetcher auto-confirm.

### Added

- **Newsletter double opt-in confirm page (`[locale]/newsletter/confirm`).** The confirmation email
  links to a localized page with a **Confirm** button; only the button's `POST` flips the subscriber
  `pending → confirmed`. New route + `pages.newsletterConfirm` copy (EN/FR) + the `NewsletterConfirm`
  client component; not in the `pages` SEO map (a callback, kept out of sitemap/llms). _Why:_ restores
  the verified-intent step a prefetching mail client was silently completing.

- **GDPR data-subject request page (`/data-request`).** A new legal surface where a visitor
  exercises a right (access, erasure, portability…) — the request is stored as a Sanity
  `dataRequest` record and the controller is alerted by email. New `features.legal.dataRequest`
  flag, the `pages.dataRequest` route (slugs `/data-request` · `/exercer-mes-droits`), the
  `/api/data-request` route (`withGuard` → `submitDataRequest`), and the `/data-request` route
  shell rendering `DataRequestForm`. Copy lives in `messages.legal.dataRequest.*`; SEO, the footer
  **Legal** link, and the privacy-policy "Your rights" prose (now linking the form) are seeded by
  `pnpm seed`. The flow + record + email live in `@indiecrafts/compliance`. _Why:_ the template
  shipped consent + legal pages but no way to exercise Art. 15–21 — the last gap in the GDPR minimum
  for an anonymous site (self-service export/delete is out of scope: no user database).
- **One page model everywhere — the home is now a `page`.** Retired the `homePage` singleton
  (schema + `homeSanity` desk + `homePage.<locale>` fixed ids). The home is the same `page` model
  with an `isHome` flag (one pinned doc per locale, id `page-home-<locale>`, desk "Accueil"), rendered
  at `/` by the `(home)` route via `getHomePage`. `isHome` pages carry no slug and are excluded from
  the `/[locale]/[...slug]` catch-all + the sitemap. `lib/faq.ts` + the FAQ JSON-LD follow through
  `getHomePage` unchanged; `seed-demo` seeds the home as a `page`. _Why:_ one content model for every
  page (home, landing, marketing), not two.
- **Generic editor-driven pages — `/[locale]/[...slug]`.** A catch-all route renders any `page`
  document (`@indiecrafts/page-builder`) composed from page-builder blocks — editors create landing
  pages in Studio → Pages, no code. `generateStaticParams` from published pages; a **required**
  catch-all (`[...slug]`, not `[[...slug]]`) so it never shadows the `(home)` index; the 11 static
  routes resolve first, unknown paths still 404. `homePage` + `home-queries` now source their blocks
  from `@indiecrafts/page-builder` instead of `@indiecrafts/blog`. _Why:_ the site is editor-driven,
  not blog-coupled. **SEO:** canonical + self-hreflang + OpenGraph + robots via `buildMetadata` (the
  page's `seo` overrides title/description/og-image/noindex), and published pages are added to the
  sitemap (drops unpublished / noindex / hidden), plus **JSON-LD `WebPage`** built from the page's own
  `seo` (gated on `features.structuredData` + noindex). `llms.txt` parity for pages remains a follow-up.
- **`/api/download` — gated lead-magnet download.** Verifies the signed, expiring token from the
  delivery e-mail (`@indiecrafts/gated-delivery`, via the newsletter module) and redirects to the file,
  or `403` on a bad/expired token or unknown magnet — so the CDN URL is never exposed to an unconfirmed
  request. Rides the `newsletter` feature flag. New `LEAD_MAGNET_SECRET` env (server-only, opt-in —
  unset disables delivery). _Why:_ the confirmed-only hand-off for the `module.lead-magnet` capture block.

### Changed

- **CSV exports now block formula injection (+ dedup).** The three dataset exporters
  (`subscribers`/`waitlist`/`comments`) each carried an identical `csvCell` that RFC-4180-quoted but
  did **not** neutralise formula injection — a cell starting with `= + - @` (or tab/CR) runs in Excel /
  Sheets, and `comments-export` writes user-supplied `authorName`/`body`. Extracted one shared
  `scripts/lib/csv.mjs` (guard prefixes a `'` then quotes) imported by all three, killing the 3× copy.
  Unit-tested (`scripts/lib/csv.test.mjs`); `pnpm test:scripts` now also covers `scripts/lib/*.test.mjs`.
- **`deploy:all:<env>` — deploy every app to one env.** New repo-root dispatcher
  (`scripts/deploy-all.mjs`, `pnpm deploy:all:dev|staging|prod`): discovers deployable apps from
  `code/projects/*/wrangler.toml`, orders services before the web app, and runs each app's own
  `deploy:<app>:<env>` sequentially + fail-fast (`--dry-run` / `--yes` supported). Today just `web`; a
  second app is picked up automatically. Mirrors the `infra.mjs` multi-app pattern.
- **Dropped the duplicated `docs:*` scripts from the app.** `docs`, `docs:build`, and `docs:install`
  (all `npm --prefix docs …`) lived in **both** the root and `code/projects/web/package.json`, identical.
  `docs/` is a repo-root sibling, npm-isolated from the pnpm workspace — the app owning docs commands
  was the wrong altitude. Removed the app copies (unused — `pnpm docs` runs from root); the root scripts
  are unchanged. Convention now documented in [scripts.md](../../../../docs/apps/web/setup/scripts.md)
  ("Where a script lives — root vs app").

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
  trap). **(2) The in-app rate limiter is activatable per deploy** — `pnpm setup:web:website:kv` creates a
  **per-env** `RATE_LIMIT_KV` namespace (dev/staging/prod, like the R2 buckets — a staging load-test can't
  burn prod's budget) and binds it in `wrangler.toml` (it fell open by default because the binding was
  commented out); the CF WAF rule stays the separate edge layer. **Bounds:** `language` is now allowlisted to `isLocale`, tag strings capped
  (≤40), comment `authorEmail` capped (≤254) and `postId` format-checked + **verified to reference a real
  post** before write. **Hygiene:** comments now stamp `consentPolicyVersion` (parity with newsletter /
  waitlist); the consent-policy lookup no longer swallows a Sanity error silently; `/api/emails/test` gained
  a body-size cap; `/api/i18n/translated-slug` gained a CDN cache header (read-amplification). A skew-safe
  submit-timing heuristic (`startedAt`) drops near-instant bot posts. Verified: `tsc` + `lint` + new
  validator tests. Doc: [`setup/deployment`](../../../../docs/apps/web/setup/deployment.md) § one-time setup
  (the `pnpm setup:web:website:kv` step) + the Turnstile block in `.env.example`.

### Added

- **End-to-end journey suite (Playwright).** The e2e setup did only Storybook visual regression;
  now it also drives **real user journeys against the running app**. `playwright.config.ts` runs two
  `E2E_TARGET`s — `app` (`pnpm e2e`: a `global-setup` seeds a **throwaway `e2e` Sanity dataset** via
  the existing `scripts/seed-demo.mjs`, then `build && start` serves the app) and `visual`
  (`pnpm e2e:visual`). 11 specs in `e2e/journeys/`: `api-guard` (403 cross-site · 413 oversize · 400
  bad email — all before any Sanity write), `waitlist`, `consent`, `a11y` (skip-link + axe), `theme`,
  `not-found`, plus content-dependent `blog-read` · `comment` · `search` · `i18n` · `route-gate`.
  Role/accessible-name locators + web-first assertions + `page.route('**/api/*')` boundary mocks
  (Playwright's own best practices). **Fixed a phantom dependency** — `@playwright/test` +
  `@axe-core/playwright` were used by the app but declared only at the repo root; now in
  `code/projects/web/package.json`. CI `browser` job runs both targets, still **advisory** until linux
  baselines land. _Why:_ the app had zero journey coverage — no form-submit, route-gate, or a11y flow
  was exercised in a real browser.
- **Announcement bar + language-suggestion strips (site chrome, edited in Sanity).** `DefaultLayout` now
  renders two strips at the top of `<main>`, both decided server-side so they never flash: the
  `@indiecrafts/announcement` discount bar (rotating items with a copyable code + internal/external link;
  shown per the `announcement-ack` cookie vs the live version) and the `@indiecrafts/locale-suggest`
  "available in {language}" banner (shown when `Accept-Language` prefers a different supported locale and
  the `locale-suggest` cookie is unset — suggest, never auto-redirect). Both edit in Studio (**Bandeau
  d'annonce** / **Suggestion de langue**). The header `LocaleSwitcher` now uses the shared
  `useLocaleSwitch` (`@indiecrafts/i18n`), so the switcher and the suggestion share one implementation.
  Added `common.dismiss` / `copy` / `copied`; seed ships both singletons. _Why:_ common marketing chrome a
  client edits in the CMS, not the code. Docs: [`packages/announcement`](../../../../docs/packages/announcement.md)
  - [`packages/locale-suggest`](../../../../docs/packages/locale-suggest.md).

- **Visual-verification rule — look at the pixels before "done".** A new engineering rule
  (`.claude/rules/visual-verification.md`, auto-loaded on UI work) makes screenshot review a
  required step, not an option. Green tests do not prove a human can see the screen: jsdom has no
  layout, and snapshots diff markup, not pixels. The loop: render the affected pages, screenshot at
  the three adaptive widths (375 · 768 · 1280), review the _images_ for overlap / clipping /
  off-centre / dark-mode grey-on-grey, fix, and re-screenshot before calling the task done. Verify
  the mechanism (reflow vs context-swap), stub dynamic data, and record intentional asymmetry so it
  is not "fixed". A **"Looked at it"** line joins the `self-review` checklist, and the design guide
  [`adaptive-responsive`](../../../../docs/apps/web/design/adaptive-responsive.md) gains a matching
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
  Doc: [`docs/packages/consent.md`](../../../../docs/packages/compliance.md).
- **"New version available" banner, copy edited in Sanity.** The locale layout now mounts
  `@indiecrafts/version`'s `UpdatePrompt` and the app serves `GET /api/version` (`no-store`, returns the
  live deploy's `buildInfo`). An open tab notices when a new version shipped and offers a reload — the
  button, plus a safe auto-reload on the **next** navigation (never forced). The banner **copy is edited
  per language in Sanity** — `siteMeta.<locale>.versionPrompt` (`message` · `reload` · `dismiss`), Studio
  → SEO par langue → Pages système → Bandeau « nouvelle version », read by `getVersionPrompt`
  (`src/lib/system-pages.ts`). **No fallback:** the banner mounts only when all three strings are set, so
  the `common.updateAvailable` / `reload` / `dismiss` keys were removed from `messages/`. _Why:_ frequent
  deploys shouldn't leave open tabs on stale code, and the copy is content — it belongs in Sanity with
  everything else. Doc: [`docs/packages/version.md`](../../../../docs/packages/version.md).

### Changed

- **Studio desk is now grouped per app (`composeStudio`).** `sanity.config.ts` swaps the flat
  `composeSanity` for `@indiecrafts/sanity`'s new **`composeStudio([{ title, modules }])`** — one hub
  Studio, one dataset, but the desk splits into **"Site web"** (this app's content — home, blog,
  newsletter, waitlist) and **"Contenu partagé"** (site-wide config every app/lens reads — SEO, nav, UI
  messages, legal, cookies/consent, E-mails). `coreSanity` keeps the shared surfaces; a tiny `homeSanity`
  carries the home desk entry into the app group (its `homePage` schema still registered by `coreSanity`).
  No `_id`/editing change — every singleton/collection resolves as before, just organized per app. _Why:_
  multi-app readiness — [`config/multi-app`](../../../../docs/shared/architecture/multi-app.md).
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
  Docs: [`config/theme-modes`](../../../../docs/apps/web/config/theme-modes.md) +
  [`config/navigation`](../../../../docs/apps/web/config/navigation.md).
- **UI chrome strings moved to Sanity (`uiMessages.<locale>`), fed to next-intl.** The remaining
  `messages/` copy — nav, cookies, validation, blog UI labels, system pages — is now owned in a
  per-locale `uiMessages` singleton (Studio → **Textes de l'interface**). `src/i18n/request.ts`
  reads it (`getUiMessages`) and **overlays it on the bundled `messages/<locale>.json`**
  (`overlayMessages`, unit-tested) — Sanity is the edit surface, the JSON stays a **fallback** (a
  Sanity outage or blank field never blanks the chrome). Every `t(...)` call site is unchanged. The
  schema fields are **generated from the message shape** so they can't drift; `pnpm seed` populates
  the docs (`buildUiMessages`). **`typography`** (i18n/format rules) is deliberately excluded — it
  stays in the JSON file (technical, not editorial). Doc:
  [`config/i18n-and-routing`](../../../../docs/apps/web/config/i18n-and-routing.md) § Where UI text lives.
- **Maintenance mode is now a live Sanity toggle (was code-only).** `siteSettings.maintenanceMode` (Studio
  → Paramètres du site → Indexation) lets an operator take the site offline (503 behind the branded
  `/maintenance` page) **without a redeploy** — the proxy reads it from Sanity's CDN with a ~30s
  per-isolate cache, **fail-open** (`src/lib/maintenance.ts`; a Sanity error never 503s the site). The
  build-time `features.maintenance` flag stays as a **hard override** that short-circuits the Sanity read.
  `proxy.ts` is now async (`features.maintenance || getMaintenanceMode()`), and
  `@indiecrafts/system-pages`' `maintenanceRewrite(request, isDown)` became **pure** (the app decides
  `isDown`). _Why:_ maintenance is the one flag with real ops value — flipping it shouldn't need a deploy.
  Doc: [`setup/maintenance-mode`](../../../../docs/apps/web/setup/maintenance-mode.md).
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
    [`setup/cloudflare-iac.md`](../../../../docs/infra/cloudflare-iac.md) +
    [`packages/security`](../../../../docs/packages/security.md). _wrangler owns the Worker; Terraform owns the edge._
- **Logging moved to `@indiecrafts/logger` (structured · edge-safe · Sentry-ready).** The app + the
  three modules now import `logger` from the new `@indiecrafts/logger` brick instead of the retired
  `@indiecrafts/utils/logger` (12 import sites migrated, call sites untouched — the `error()` signature
  is back-compatible). Wired via `transpilePackages` + a dep on app/blog/newsletter/waitlist. Behavior
  change: **prod console is `"silent"` by default** (`logging.levels` in `@indiecrafts/config`), so live
  sites emit no console noise; raise it live with **`NEXT_PUBLIC_LOG_LEVEL`** (added to `.env.example`)
  and error/fatal still reach Sentry when the opt-in transport is wired. Dev gets pretty colored output;
  prod/Workers get one JSON line per log (captured by Cloudflare Workers Logs, already `enabled` in
  `wrangler.toml`). Doc: [`packages/logger`](../../../../docs/packages/logger.md).
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
    indiecrafts.dev deploy through). `doctor:web:website:env` prints a **site-identity** block + warns on prefix/deploy
    drift or a shared-project `production` dataset. **Fail-loud:** an empty `siteName` in production now
    `logger.error`s (once/request, via `getSiteSettings`) instead of silently rendering the template brand.
    `.env.example` reworded (Resend = one shared account per key → per-client key for isolation). Docs:
    every `setup/*` page (new-client, deployment, environment, backups, scripts, launch-checklist,
    workspace) + [`packages/config`](../../../../docs/packages/config.md) + [`packages/email`](../../../../docs/packages/email.md).
- **Homepage section titles support brand highlights via `RichTitle`.** The `Features` section `<h2>`
  now renders through `@indiecrafts/ui-components/web/RichTitle`, so wrapping a word in `[[ ]]` inside
  the `messages/` title colours it in the brand accent — the home `features.title` is now
  `"Built to [[cover]] your needs"` (FR `"…[[couvrir]]…"`). The app gains a direct `@indiecrafts/ui-components`
  dependency. _Why:_ one reusable, config-first way to emphasise a title word, shared with the CMS
  (Sanity titles use the same marker). Doc: [`design/typography`](../../../../docs/apps/web/design/typography.md) § Title highlights.
- **Studio "Send test" for emails → `/api/emails/test`.** A new server route (Node) lets an editor
  verify transactional email actually lands: it sends a sample of every **enabled** email to a typed
  address. Triggered from Studio → **E-mails → ⋯ → "Envoyer un test"** (the `sendTestEmailAction` wired
  via `document.actions` in `sanity.config.ts`). **Security:** gated by `features.studio`, then the
  caller's **Sanity session token** is verified against the project's `users/me` — not a public spam
  relay; test sends go only to the given address; `RESEND_API_KEY` stays server-side. `sanity.config.ts`
  now composes the E-mails singleton from every module's `emailGroups` (`emailSanity(modules)`) instead
  of a static `emailSanity`. Doc: [`packages/email`](../../../../docs/packages/email.md).
- **Security headers moved to `@indiecrafts/security-headers` + hardened (behavior change).** The
  40-line inline CSP/headers/images block in `next.config.ts` collapses to one `securityHeaders({...})`
  call + `...imageDefaults` (the video/GA hosts + the `EMBED_HOSTS` knob stay declared app-side). The
  brick adds **three new headers in production**: `Strict-Transport-Security` (`max-age=1y;
includeSubDomains`, no `preload`), `Cross-Origin-Opener-Policy: same-origin-allow-popups`, and CSP
  `upgrade-insecure-requests`. Chosen to keep `/studio` working (COOP allow-popups for the Sanity login
  popup; COEP/CORP not added). `getCurrentEnvironment`/`getCSPConnectSources` stay in `@indiecrafts/
config`. **Note:** HSTS is sticky — it only ships in prod over HTTPS. Doc:
  [`seo/security-headers.md`](../../../../docs/apps/web/seo/security-headers.md) + [`packages/security-headers`](../../../../docs/packages/security.md).
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
  `**/backups/` + `content-backups/` are now gitignored. Restore: Sanity → `db:restore:content`; D1 →
  Time Travel / `wrangler d1 execute --file`. Docs: `setup/backups.md`.
- **Newsletter double opt-in + external-embed CSP knob + subscriber export.** New app surfaces for
  the newsletter emails: a `GET /api/newsletter/confirm` route (validates the one-time token → flips
  the subscriber to `confirmed` → redirects home with `?newsletter=confirmed|invalid`), an
  `EMBED_HOSTS` array in `next.config.ts` (empty by default; concatenated into `form-action`,
  `frame-src`, `script-src`, `connect-src` so an editor-pasted external newsletter form in a
  `custom-html` block can actually submit past the CSP), and a `pnpm export:web:website:subscribers` script →
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
  incremental cache** for ISR. New `code/projects/web/`: `wrangler.toml` (3 envs, `nodejs_compat`,
  R2 binding, prod custom-domain block), `open-next.config.ts` (R2 cache), `.dev.vars.example` (local
  preview secrets), + `next.config.ts` `initOpenNextCloudflareForDev()`. **Deploy scripts are per app AND per env**
  — every name is `deploy:<app>:<env>` (`deploy:web:{dev,staging,prod}` at both the app and the root,
  which delegates); `build:cf` / `preview:cf` at the app, `preview:web:cf` at root. A second app reads
  `deploy:web:admin:<env>` — nothing env-generic or ambiguous. Auto-deploy via `.github/workflows/deploy.yml` (push to `main` → prod;
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
  `content:export` / `db:restore:content` (Sanity `dataset export/import` wrappers — the CMS analog of a
  DB backup/restore; export→`content-backups/` read-only, import destructive + confirmation-gated),
  `doctor:web:website:env` (a `.env.local` preflight with clear "missing X" messages; now gates `seed` +
  `content:*`), `check:placeholders` (pre-handoff scan of `code/`+`docs/` for leftover template
  tokens/lorem/`your_…_here` — deliberately **not** in CI since the template ships its own fill-me
  tokens), `clean` (wipe build artifacts; `--all` also `node_modules`), and `lint:scripts`
  (shellcheck) + `test:scripts` (Node's built-in runner over `scripts/*.test.mjs`). `lint:scripts`,
  `test:scripts`, and `check:tags` now run in `verify` + CI (`test.yml`). **Deliberately not ported**
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
