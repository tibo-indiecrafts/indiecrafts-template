# Changelog — packages (`@indiecrafts/*` bricks)

One record for the shared bricks under `code/packages/`. Every change that adds,
splits, or reshapes a brick's public surface lands here in plain language with the
_why_. Rolls up to the [root `CHANGELOG.md`](../../CHANGELOG.md) at release.

**Not here:** app behavior/routes/tokens → [`code/projects/web/CHANGELOG.md`](../projects/web/surfaces/website/CHANGELOG.md);
docs-site → [`docs/CHANGELOG.md`](../docs/CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com). Categories: **Added ·
Changed · Deprecated · Removed · Fixed**.

## [Unreleased]

### Fixed

- **`@indiecrafts/packages-web-auth` — Clerk Core 3 migration (sign-in contrast + control components).**
  `authAppearance()` mapped the Core 2 variable names (`colorText`/`colorTextSecondary`), which Core 3
  ignores → the hosted `<SignIn>`/`<SignUp>` rendered **dark-on-dark text on every surface**. It now maps
  the Core 3 roles (`colorForeground`/`colorMutedForeground`/`colorNeutral` + input/primary foregrounds)
  alongside the Core 2 aliases, so sign-in text is legible in light + dark. Also replaced the removed
  `<SignedIn>`/`<SignedOut>` control components with Core 3's `<Show when=…>` (re-exported from the brick;
  the website's `AuthMenu` migrated) — that was 500-ing the website home once Clerk keys were set. **Why:**
  `@clerk/nextjs` resolved to Core 3 but the brick still used the Core 2 API; the bug was dormant until
  Clerk was configured.

### Added

- **`@indiecrafts/packages-web-auth` — Clerk UI localization + self-hosted sign-up.** `AppClerkProvider`
  takes a `locale` prop and passes `@clerk/localizations` (`enUS`/`frFR`) to `<ClerkProvider localization>`;
  a new `SignUpView` renders a themed `<SignUp>` carrying the sign-up locale in `unsafeMetadata`. **Why:**
  Clerk UI now follows the site language, and the captured locale drives localized auth emails.
- **`@indiecrafts/packages-mobile-ui-native` `Button` — an optional `selected` prop.** Maps to
  `accessibilityState.selected`, so a button used in a segmented / toggle group (e.g. the mobile theme
  switcher) announces its chosen state to VoiceOver / TalkBack — selection is never signalled by colour
  alone. Backward-compatible: unset leaves behaviour unchanged.

- **`@indiecrafts/packages-shared-agent` — `runAgent` now validates the output shape.** The forced
  `output` tool guarantees a tool call, but the model can still drop a required field, and callers
  masked that with `?? []`. `runAgent` now checks the returned object against the spec's
  `outputSchema` — every top-level `required` key must be present with a matching primitive type —
  and returns `{ ok: false, error: "output did not match schema" }` otherwise. The check is shallow
  and zero-dep (top-level required keys only); the never-throw contract is unchanged. **Why:** stop
  a malformed reply from reaching a caller as if it were valid.

### Fixed

- **`@indiecrafts/packages-shared-agent` — the Anthropic fetch has a 20s timeout.** `runAgent`'s
  `fetch(ANTHROPIC_URL, …)` had no `signal`, so a stalled/slow Anthropic response could hang the
  caller indefinitely. Added `signal: AbortSignal.timeout(20_000)`; the existing
  `catch (e) { return { ok: false, error } }` already turns the resulting `AbortError` into a
  normal `AgentResult`, so nothing else changed.

### Added

- **Unit tests for previously-untested brick logic.** `web/sanity` — `sanityImageLoader` (the CDN
  image-URL builder, 6 cases) + `composeSanity`/`composeStudio` (schema/template/i18n flatten + desk-item
  divider placement, 5 cases); the brick also gained its missing `vitest.config.ts` + `test` script.
  `web/page-builder` — a `moduleSchemas ↔ MODULE_TYPES` same-file drift guard + `defineModule` preview
  fallback (3 cases). No public-surface change; coverage only.

### Fixed

- **Agnostic bricks import config from `/shared`, not the root barrel (`format` · `announcement` ·
  `utils`).** `plural/relative/money/grammar/number/list.ts` (format), `resolve.ts` (announcement), and
  `format-date.ts` (utils) imported `defaultLocale` / `localeFormat` / `Locale` from
  `@indiecrafts/packages-shared-config` — whose root barrel re-exports `./web` (with `process.env`). That
  dragged the web config into the **mobile** type graph, so `mobile tsc` failed on `process` (no
  `@types/node`). Switched them to `@indiecrafts/packages-shared-config/shared` (the agnostic entry — same
  symbols). **Why:** React-free bricks must not pull web-only code; unblocks `mobile tsc` / `pnpm verify`.

### Added

- **`@indiecrafts/packages-shared-compliance` — `DeleteAccountSection` gains an injected
  `submitErasure` seam.** `erasure-self.ts` splits into `rawErasureFetch` (resolves to a
  plain status carrier, never a collapsed `Response`, so a caller's `useReverification`
  wrap can still detect Clerk's 403 hint) and `mapErasureResponse` (the one
  status→result mapping, reused by the default path). The web section takes an optional
  `submitErasure` prop so a surface can wrap the raw fetch with Clerk `useReverification`
  for step-up, while the brick itself stays `@clerk/*`-free — the Clerk dependency lives
  in each surface's panel, not the shared brick. A try/catch guards a throwing injected
  submit from hanging the UI on `pending`.
- **`@indiecrafts/packages-shared-ui-fonts` — exports its font files (`./fonts/*`).** The package's
  `exports` map now exposes `./fonts/*` alongside `.` (the `FONT_FILES` metadata). **Why:** a bundler
  that resolves via the `exports` field (Vite — the hybrid Electron renderer's `@font-face`
  `url("@indiecrafts/packages-shared-ui-fonts/fonts/Satoshi-Variable.woff2")`) could not reach the
  self-hosted `.woff2` files, so the renderer CSS failed to compile. `next/font` (website) and
  `expo-font` (mobile) reference the files by relative path and are unaffected.

- **`@indiecrafts/packages-web-ui-components` — `showConsentSavedToast` (new `web/consent-toast`
  export, sonner).** One shared "choice saved" toast every web surface fires on an explicit
  cookie-consent or legal-reacceptance choice: `showConsentSavedToast({ saved, description, manage,
onManage })`. Copy is injected by the caller (no i18n inside the package); `onManage` opens that
  surface's cookie-preferences control. **Why:** website, app, and hybrid confirm a consent choice
  the same way instead of three bespoke toasts.

- **`@indiecrafts/packages-shared-system-pages` — offline hook + banner (`useOnlineStatus`,
  `OfflineBanner`, on `./web` and `./native`).** `useOnlineStatus` (`./web`) tracks the `online`/`offline`
  events via `useSyncExternalStore` (hydration-safe — the server snapshot assumes online, so it never
  flashes offline during SSR). `OfflineBanner` renders a slim, auto-hiding strip: the web fork
  self-detects via `useOnlineStatus` (props: `{ message }`); the native fork takes connectivity as a prop
  (props: `{ message, online }`) so the brick stays free of a single-consumer native dep (netinfo) — the
  app owns detection. **Why:** the website, `app`, and the Electron renderer each carried their own copy
  of the same hook + banner; now they import one. Repointed: website, `app`, and hybrid drop their local
  hook/banner for the brick's; mobile keeps its local `useNetworkStatus` (netinfo) and passes its result
  into the brick's native `OfflineBanner`.
- **`@indiecrafts/packages-shared-compliance` — account copy moved to `./shared` + copy-builders
  (`buildDeleteAccountCopy`, `buildExportCopy`).** `DeleteAccountCopy`/`ExportCopy` (previously defined
  twice, once in the `./web` and once in the `./native` section files) now live in
  `src/shared/account-copy.ts`, re-exported from `./shared`, `./web`, and `./native` unchanged. The two
  builders assemble each shape from a namespace-scoped translator (`t` already scoped to `account.delete`
  / `account.export`), so one field list serves both next-intl and react-intl callers. **Why:** every
  surface's account page hand-assembled the same two objects field-by-field; now website, `app`, hybrid,
  and mobile call one builder each.

### Changed

- **`@indiecrafts/packages-web-compliance` — fires the confirmation toast on explicit consent
  choices.** `CookieBanner` (accept/reject), `CookiePreferences` (save), and `LegalNotice`
  (accept) each call `showConsentSavedToast` after persisting the choice. The silent
  `applyConsent(..., "auto")` geo auto-seed path is untouched — it never toasts. **Why:** the
  website's consent UI confirms an explicit choice the same way the app/hybrid surfaces do.

- **`@indiecrafts/packages-web-ui-components` — `ShareButtons` gains a `networks` prop.** An optional
  `{ x, linkedin, facebook, copyLink }` filter (unset = shown) hides individual controls, driven by
  the editor's Sanity `siteSettings.share` choices. Backward-compatible — omit it to show all.
- **`@indiecrafts/packages-web-ui-components` — `ShareButtons` `url` is now optional.** When omitted
  it resolves the current page URL on the client (`window.location.href`, deferred to an effect so SSR
  and the first client render match); the website/blog still pass an explicit server-resolved `url`
  (no flash). **Why:** lets client-only surfaces (the app, the Electron renderer) reuse the same share
  row without threading a server pathname through.

### Fixed

- **`@indiecrafts/packages-web-version` — leaked `online` listener.** `useVersionCheck`
  added a `window` `online` listener, but its effect cleanup removed only the interval and
  the `visibilitychange` listener — so every mount leaked one `online` listener. Cleanup now
  removes all three. Also moved `UpdatePrompt`'s latest-value ref write out of render into an
  effect, so render stays pure under React 19 concurrency.
- **`@indiecrafts/packages-web-ui-components` — `TurnstileWidget` load listener.** The
  Turnstile-script `load` listener is now registered `{ once: true }`, so it self-removes after
  firing instead of lingering when the effect unmounts before the script loads.

### Added

- **`@indiecrafts/packages-web-ui-components` — six new presentational primitives for the blog's
  composable frontpage.** `PostHero` (`web/layout/`) — a full-width lead-post hero (image/video,
  category chip, author/date). `FeaturedPosts` (`web/collection/`) — a lead card + grid of
  featured/pinned posts. `SpotlightRow` (`web/collection/`) — a curated post-picks row + "view all"
  link. `Carousel` (`web/collection/`, client) — an embla-driven scroller of pinned posts.
  `TopicCards` (`web/layout/`) — one to three large clickable category/tag cards. `PostCard`
  (`web/collection/`) — the shared single-post card, extracted out of `FeaturedPosts` so
  `SpotlightRow`/`Carousel` reuse it instead of reimplementing it. All six take a resolved
  `PostCardItem[]` — the new shared shape in `shared/types.ts` — so they stay pure (no Sanity client,
  no i18n). Each ships a colocated `.stories.tsx` + `.md`. Also: `POST_CARD_PROJECTION`, the blog's
  GROQ post-card fragment, is now reused by every frontpage query instead of being redeclared per
  block. **Why:** the blog's new frontpage blocks (`code/modules/CHANGELOG.md`) needed one set of
  reusable card/row/carousel primitives instead of six near-duplicate layouts.
- **`@indiecrafts/packages-web-ui-components` — three new blocks for the blog: `CategoryNav`,
  `AuthorBio`, `MoreOnTopic`.** `CategoryNav` (`web/layout/`) — a top-level category bar with
  sub-category dropdowns (shadcn `NavigationMenu`). `AuthorBio` (`web/collection/`) — an
  end-of-article "Written by" card. `MoreOnTopic` (`web/collection/`) — a compact "more on this
  topic" sidebar list + optional "see all" footer. All data-driven over resolved `{ title, href }`
  items (plain `<a>`, like the other renderers), each Storybook-documented (`.stories.tsx` + `.md`);
  the blog composes them.
- **`@indiecrafts/packages-shared-ui-icons` — brand marks are now GENERATED.** `src/shared/brands.ts`
  is built from `brands.json` (our name → a `simple-icons` slug, or an inline `{title,hex,path}` for a
  mark simple-icons lacks — e.g. LinkedIn) via `pnpm brands:build`; `brands:check` guards drift in CI
  (mirrors `tokens:build`/`tokens:check`). No hand-copied SVG paths; adding a brand is one config line.
  Regenerating picked up the official (updated) X and Facebook marks. Runtime stays dependency-free —
  `simple-icons` is a build-only devDependency and the shape/exports are unchanged (`BrandIcon`,
  `ShareButtons`, `SocialFollow`, native all keep working).
- **`ShareButtons` moved to `@indiecrafts/packages-web-ui-components` (`web/layout/`) + intent logic to
  `@indiecrafts/packages-shared-utils/share`.** The X/LinkedIn/Facebook + copy-link row is now a
  shared, Storybook-documented block over a `url`+`title` — the blog post mounts it inline, and the
  website footer mounts it site-wide. The platform-agnostic `shareTargets(url, title)` (no DOM) is a
  new shared-utils export, so a native surface can feed the same targets to the OS share sheet.
- **`@indiecrafts/packages-shared-config` — the settings registry (`src/shared/settings.ts`).**
  New `SETTINGS` map: version-controlled defaults + a per-key `[min, max]` bound for 8
  worker-read operational knobs (5 retention windows, `ops.sla_warning_days`, 2 link TTLs),
  plus `coerceSetting` (parse + clamp a raw override, `null` on unknown/non-integer) and
  `effectiveSettings` (merge D1 override rows over the defaults, ignoring anything invalid).
  React-free — safe in a bare Worker; imported by both `cron` and `api`. **Why:** one source
  of truth for what an operator can override from the new admin Settings card, and the
  guaranteed fallback when they don't — see `code/docs/apps/web/config/settings.md`.
- **`@indiecrafts/packages-shared-security` — opt-in Trusted-Types Report-Only trial.** New
  `buildTrustedTypesReportOnly(reporting)` + a `reporting.trustedTypesReportOnly` flag; `cspHeadersForMode`
  fills the (otherwise-null) enforce-mode Report-Only slot with `require-trusted-types-for 'script'` pointed
  at `/api/csp-report`. **Reports, never blocks** — so a surface can learn which DOM script-sink assignments
  (React/Next/Clerk/GA) a future Trusted-Types enforcement would break, before enforcing. Off by default; apps
  wire it to `CSP_TRUSTED_TYPES=report`. Chrome/Edge only. **Why:** from the wahio review — a structural
  anti-DOM-XSS layer the nonce policy can't provide, trialled safely on the report-only pipeline we already have.
- **`@indiecrafts/packages-shared-security` — `permissiveCspRule(source, env, csp?, reporting?)`.**
  Generalizes `studioCspRule` (now a thin `/studio/:path*` shorthand over it) so any proxy-excluded
  route that can't take a per-request nonce gets the static, permissive CSP scoped to it. **Why:**
  `/maintenance` was proxy-excluded like `/studio` but had no static rule, so `cspMode: "proxy"` left
  it shipping **no** CSP at all — the website now scopes a rule to it too.
- **`@indiecrafts/packages-shared-config` + `-shared-security` — the CSP now allows Clerk when it is configured.**
  New `getClerkCspHosts()` (config `./web`, env-gated) derives Clerk's Frontend-API host from
  `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`; `buildCsp` adds it to `script-src`/`connect-src`/`frame-src`, adds
  `img.clerk.com` to `img-src`, the telemetry host to `connect-src`, and a `worker-src 'self' blob:`. All
  empty when the key is unset, so the policy is byte-for-byte unchanged until an operator configures Clerk.
  **Why:** admin and app now emit an enforced CSP — without this the enforced policy would block ClerkJS and
  break sign-in.
- **`@indiecrafts/packages-web-security-reports` — CSP report sink + forwarder (new brick).**
  `handleCspReport(request, opts)` (`./handle`) — the Next route trust boundary for browser CSP
  violation reports: accepts only the CSP content-types, caps the body, normalizes + sanitizes +
  drops extension noise via `@indiecrafts/packages-shared-security/csp-report`, always answers `204`.
  `forwardCspReports(reports)` (`./forward`) — `server-only`, bearer-authed batches of 5 to the
  api's `POST /v1/events` (`kind: "csp-report"`). **Why:** the pure parsing brick can't hold
  `server-only` or Next's `Request`/`Response` types, so the route glue needed its own home.
- **Geo-targeted consent regulations in `shared-compliance`.** New `./shared` exports a
  regulation-named model: `Regulation` (`{ name, mode }`) + the built-in `REGULATIONS` catalog
  (GDPR / UK GDPR / CCPA / None), `CONSENT_REGIONS` (country/territory → regulation key),
  `TERRITORIES` (parent country → its overseas territories), `ConsentConfig`
  (`{ regulations?, overrides? }`), and `resolveRegulation()` / `resolveConsentMode()`. Defaults:
  EU-27 · EEA · EU outermost regions · UK + Gibraltar + Crown Dependencies → GDPR/UK-GDPR (opt-in);
  US + its territories → CCPA (opt-out); else none; unknown / Cloudflare `XX`/`T1` → opt-in fail-safe.
  **Flexible + extensible:** a client adds named regulations (LGPD, …) and reassigns any
  country/territory — an assignment on a PARENT cascades to its territories. New `./web`
  `browserSignalsDeny()` (GPC / Do-Not-Track) so the shared web shells honour the signal the way the
  website already does. **Why:** show each visitor the consent regime their country actually requires —
  named, configurable per country + territory, on every surface. Design →
  `code/docs/apps/web/config/cookie-consent-geo.md`.
- **Storybook stories for the undocumented design-system bricks.** Colocated `*.stories.tsx` for the
  native brick (`ui-native`: `Screen` · `ThemedText` · `Button` · `Card`), `system-pages` (web **and**
  native: `NotFoundContent` · `ErrorContent` · `OfflineContent` · `Maintenance`), and `ui-icons/web`
  (`Icon` · `BrandIcon` · `SvgIcon` · `ReiconIcon`). They render in the one gallery (native via
  react-native-web) and run as component + a11y tests. **Why:** every renderable brick now has a story,
  and the native design system was previously undocumented.
- **`@indiecrafts/packages-mobile-ui-native` exports `./package.json`.** Needed so the Storybook
  story-glob helper can `require.resolve` the brick by name (the other bricks already exposed it).

- **`@indiecrafts/packages-shared-announcement` — the portable announcement core (new brick).** The
  React/Next-free resolve path (`resolveBanner`/`resolveToast`: live-window + per-surface targeting +
  localize + link + version hash + CDN image URL), the `SURFACES` list (**no admin**), the GROQ
  strings, and `fetchAnnouncements`. **Why:** the Next server readers AND the bare `code/shared/api`
  Worker must run the SAME transform (website reads Sanity server-side; app/mobile/hybrid read the
  Worker) — one home for the logic, and `web/announcement` stays web-only.
- **`@indiecrafts/packages-web-announcement` — a rich toast + per-surface targeting.** New
  `announcementToast` singleton (title/body/optional image/link, editor `autoDismissSeconds`) rendered
  by a self-contained `AnnouncementToast` card (not sonner — a must-click link must never auto-dismiss);
  the `announcementBar` gains a `surfaces` field; the readers became thin adapters over
  `packages-shared-announcement`; the bar/toast self-suppress a dismissal client-side so the
  logged-in surfaces stay dismissed across a reload. **Why:** announcements now reach every surface,
  gated to logged-in users on app/mobile/hybrid.
- **`@indiecrafts/packages-shared-auth` — the DOM-free authorization contract (new brick).** `Roles`
  (the gated-role union, `"admin"` today) + `AppSessionClaims` (the `metadata.role` session-token claim
  shape — the single home each app augments Clerk's `CustomJwtSessionClaims` from) + `isAdmin(claims)`
  (strict `role === "admin"`; safe on `null` / malformed). Zero-dep, no Clerk/React/Next — so every
  platform's Clerk SDK reads the same role off the signed JWT. **Why:** one home for the role string and
  the claim shape, so the four apps never drift. Activates the reserved `domain: auth` slot.
- **`@indiecrafts/packages-web-auth` — the themed Clerk provider (new brick, web tier).**
  `AppClerkProvider` (wraps `<ClerkProvider>` for the root layout; **opt-in** — inert with no publishable
  key bound, like Turnstile/Resend; server-component-safe) + `authAppearance()` (Clerk
  `appearance.variables` → `ui-tokens` CSS vars, so sign-in UI is token-themed with **no hard-coded
  color**; a colocated test fails on a raw hex). DOM-coupled → web scope. **Why:** the appearance bridge
  themes DOM sign-in components, so it can't sit in the DOM-free `shared/auth`; four consumers (the 3
  Next surfaces + the Electron renderer).
- **`@indiecrafts/packages-web-auth` — shared sign-in surface + validated redirects.** Adds
  `<SignInView>` (Clerk's prebuilt `<SignIn>` themed from tokens, `fallbackRedirectUrl` = the app's home),
  re-exports `<SignInButton>` / `<UserButton>` / `<SignedIn>` / `<SignedOut>` so app code imports auth UI
  from one place, and **`resolveSignInRedirect` / `isSafeRelativePath`** — the open-redirect guard (a
  `redirect_url` is kept only when it's a same-origin RELATIVE path; anything absolute / protocol-relative
  / cross-origin falls back to the app home). A colocated test covers the validator. **Why:** standardize
  sign-in across the web surfaces and close the open-redirect vector in one home.
- **`@indiecrafts/packages-web-auth` — session logging (`SessionLogger` + `logSession`).** `SessionLogger`
  (client) fires one ping per Clerk session (deduped in `sessionStorage`) to the app's same-origin
  `/api/session-log` route; `logSession` (server, `./session-log`) forwards it to the audit api's
  `/v1/events` holding `APP_API_TOKEN` — **the token never reaches the browser**. **Why:** per-surface
  sign-in tracking on every web surface without exposing the api secret client-side.

- **`@indiecrafts/packages-shared-system-pages` — `OfflineContent` page (web + native fork).** A branded
  offline status screen for a route/screen that cannot render without the network, forked `./web` (DOM,
  `"use client"` + `packages-web-ui` Button) + `./native` (RN) exactly like the Maintenance/404/500 trio;
  `OfflineContentProps` (`title, description, retryLabel, onRetry?`) in `./shared`, plus a `SHELL_COPY.offline`
  default (adds a short `banner` string) so the non-CMS shells render consistent wording. **Why:** offline
  was a silent failure — now every surface reuses one branded state. The banner strip (not this full-screen
  page) is wired via the shared `useOnlineStatus`/`OfflineBanner` brick (see above): website, `app`, and
  hybrid render it through the brick; mobile pairs its local `useNetworkStatus` (netinfo) with the brick's
  native `OfflineBanner`. The full-screen `OfflineContent` (for a route that can't render offline) is
  available on both `./web` and `./native`.
- **`@indiecrafts/packages-mobile-ui-native` — accessibility baseline on the primitives.** `Button` now
  ships `accessibilityLabel` (its `label`) + `accessibilityState` (disabled announced to AT, not by opacity
  alone) + an optional `accessibilityHint` (`accessibilityRole="button"` and the 44 pt touch target were
  already there). `ThemedText variant="title"` gets `accessibilityRole="header"` (screen-reader heading
  navigation), overridable via a new `accessibilityRole` prop. `Card`/`Screen` stay transparent containers
  (children individually focusable). **Why:** the native design system had ~zero a11y props, so every screen
  built on it would inherit that gap; now VoiceOver/TalkBack get a role + name on the interactive
  primitives out of the box. Native a11y rule: the mobile app's `.claude/rules/accessibility.md` (mirrors
  the web rule). RNTL component assertions land with the native component-test harness (deferred P1.5).
- **`@indiecrafts/packages-shared-query` — shared TanStack Query setup for the client SPAs
  (`code/packages/shared/query`).** `queryDefaults` (one `QueryClient` config — brief freshness, no
  focus-refetch, retries) + `queryKeys` (namespaced key factory: `all`/`list`/`detail` — the cache
  equivalent of `STORAGE_KEYS`). **React-free + zero-dep** so mobile (React 18) and hybrid (React 19) never
  share a React or a client instance — each app does `new QueryClient({ defaultOptions: queryDefaults })`
  and renders its own provider (mobile `app/_layout.tsx`, hybrid `main.tsx`). The `queryFn` is the P0.1
  api-client. **Why:** both client apps needed a server-state cache foundation (the ≥2-consumer extraction
  trigger); the website deliberately does **not** use it (RSC + `cache()`/`sanityFetchLive` is its data
  layer). **Not yet:** query/mutation hooks land with the first data screen (pattern documented); the
  offline persister layers on with the first cached query.
- **`@indiecrafts/packages-shared-logger` — `./cloudflare` transport (Cloudflare Workers Logs sink).**
  `cloudflareTransport()` forwards `error`/`fatal` records to `console.error` (one JSON line, via the prod
  `jsonReporter`) **independent of the console gate**, so production errors reach Workers Logs even though
  the prod console is `silent`. Cloudflare-native — no vendor SDK, no DSN; the counterpart to `./sentry`.
  Wired (production-gated, self-correcting) at the `code/shared/api` + `code/shared/cron` Workers and the
  website's `instrumentation.ts`; the hybrid renderer ErrorBoundary now logs its (previously swallowed)
  error via the shared `logger` too. **Why:** the platform runs on Cloudflare Workers, so Workers Logs is
  the native observability channel — this makes prod errors visible there without turning the whole console
  back on or adding Sentry. **Not covered:** native/desktop client errors → a POST-to-Worker ingestion sink
  (later); mobile does not consume the logger yet (it imports config's web slice — a `/shared` move is the
  prerequisite).
- **`@indiecrafts/packages-shared-agent-client` — the AI-agent client half (`code/packages/shared/agent-client`).**
  `callAgent(name, { context, locale }, { urlPrefix, token, extraBody, fetch, timeoutMs })` — the ONE typed,
  never-throw caller for an agent endpoint. Injected URL prefix + auth (no env reads), a 30s AbortController
  timeout, and the `{ ok: true, data } | { ok: false, error }` contract; parses the agent core's `{ data }`
  envelope. **Why:** three callers hand-rolled the same `fetch` + parse + never-throw block and had drifted
  (different Result shapes, no timeout) — the web `ContentResearchAgent`, the mobile `lib/agent.ts`, and the
  hybrid main process. Now they share one copy: the web injects `/api/agent` + a Turnstile token, the shells
  inject `${base}/v1/agent` + their bearer. Pairs with `packages-shared-agent` (the server half). Zero-dep,
  edge/browser/Electron-safe.
- **`@indiecrafts/packages-shared-compliance` — the portable compliance core (`code/packages/shared/compliance`).**
  The half of the compliance surface the shells can share, forked like `system-pages`: `./shared` (consent
  decision math `grantedKeys`/`consentUpdate` + the `Store`/`ConsentStore` contract + the default taxonomy +
  signal types; the legal-route contract `LEGAL_PAGES`/`legalUrl` + `LegalAcceptanceRecord`/`needsReacceptance`),
  `./web` (shadcn, Next-free) + `./native` (RN) — `ConsentBanner`/`ConsentPreferences` + the legal
  re-acceptance popup `LegalReacceptancePrompt` + `localStorage`/`AsyncStorage` store adapters. **Why:** the
  `app`/Electron/Expo shells had no compliance and can't reuse the Next/Sanity-coupled web brick; now they link
  out to the website's legal pages and ship a compliant-ready consent + re-acceptance UI out of the box. The
  website keeps its Sanity banner over the same math; `packages-web-compliance` re-exports the moved
  `consent-signals` (unchanged import path) and imports the math from here.
- **`@indiecrafts/packages-shared-version` — the portable version-check core (`code/packages/shared/version`).**
  `isUpdateAvailable(current, latest)` (string-identity deploy-id compare, **not** semver) + `VersionResponse`
  - `versionId` + `VERSION_ENDPOINT`. **Why:** all three shells now detect a new deploy the same way;
    `packages-web-version` re-exports the compare instead of inlining it. The poll mechanism stays per-platform
    (DOM `visibilitychange`/`online`; RN `AppState`).
- **`packages-shared-config` — `site.websiteUrl` + `pickSuggestedLocale`.** `site.websiteUrl`
  (`NEXT_PUBLIC_WEBSITE_URL`, else `site.url`) = the marketing-site origin the shells link to for legal pages.
  `pickSuggestedLocale(rankedPrefs, active, supported)` (`./shared`) = the shared "suggest a language switch?"
  decision, lifted from `locale-suggest` so the native shells reuse it over `getLocales()`/`navigator.languages`.
- **`packages-shared-security` — per-request nonce CSP + a rollout kill switch.** `buildCsp(env, csp,
reporting, nonce)` (`./csp`) now takes an optional `nonce`: when set, `script-src` becomes `'self'
'nonce-<value>' 'strict-dynamic' https: 'unsafe-inline'` (the strict, nonce-gated policy) instead of
  the permissive `'unsafe-inline'` list. New `./csp-nonce` module: `generateNonce()` (16 random bytes,
  base64 — Web Crypto, Edge/Node-safe) and `cspHeadersForMode(env, csp, reporting, nonce, mode)`, which
  returns `{ enforced, reportOnly }` for a `CspMode` of `"enforce"` (the strict nonce policy is the
  enforced header, no Report-Only) or `"report-only"` (the CURRENT permissive policy stays enforced —
  the site keeps working — while the strict nonce policy ships as `Content-Security-Policy-Report-Only`,
  so violations are observed without blocking). `securityHeaders({ ...opts, cspMode: "proxy" })`
  (`./headers`) drops `Content-Security-Policy` / `Reporting-Endpoints` / the Report-Only header from the
  static `headers()` array, so a proxy can set them per-request instead (`cspMode` defaults to
  `"static"` — today's behavior, unchanged). New `studioCspRule(env, csp, reporting)` reproduces the
  prior static, permissive CSP (`'unsafe-inline'`, no nonce) scoped to one route — for a static asset
  like the embedded Sanity Studio that can't take a per-request nonce. **Why:** a static, allowlist-only
  CSP can't stop inline-script injection; a per-request nonce (with `'strict-dynamic'`) can, but
  flipping it on cold is a real regression risk — `cspMode` lets each surface roll it out behind
  `CSP_MODE=report-only` first (observe violations, ship nothing broken) and flip to `enforce` once
  the reports are clean, with `/studio` staying on the policy it always had.
- **`@indiecrafts/packages-shared-security-events` — `shouldAlert`/`formatSecurityAlert`.**
  `shouldAlert(severity)` decides which incidents page the operator (`high`/`critical` —
  `credential_stuffing` and `privilege_escalation` are both `high`, so a `critical`-only gate would
  rarely fire). `formatSecurityAlert(alert)` builds the internal alert email's subject + text: pure,
  null-safe, non-PII (no raw IP, no email address). **Why:** the `api` worker's high/critical
  `security_events` write sites now email the owner/DPO — see
  `code/docs/apps/web/config/breach-response.md`.

### Changed

- **`@indiecrafts/packages-shared-config` — log redaction now scrubs raw PII.** `logging.redactKeys`
  adds `email`, `ip`, `ipAddress` to the auth-material list, so identifiers passed as log context keys
  are `[REDACTED]` before any reporter/transport. The hashed `emailFingerprint`/`ip_hash` stay
  un-redacted (not PII, must remain queryable). **Why:** GDPR log hygiene, from the wahio review —
  keep raw PII out of logs by default. (Redaction is key-based; free-text message values aren't scrubbed.)
- **`@indiecrafts/packages-shared-security` — broader `Permissions-Policy` default.** `securityHeaders`
  now denies every sensor/hardware/payment/privacy feature a marketing+blog site never needs
  (`accelerometer`, `bluetooth`, `browsing-topics`, `camera`, `display-capture`, `geolocation`, `gyroscope`,
  `hid`, `interest-cohort`, `magnetometer`, `microphone`, `midi`, `payment`, `serial`, `usb`,
  `xr-spatial-tracking`) — up from just camera/mic/geolocation. **Not** locked: `autoplay`/`fullscreen`/
  `encrypted-media`/`picture-in-picture`, which the featured-video embeds (YouTube/Vimeo) need. **Why:**
  from the wahio security review — a hardened baseline shuts more attack/tracking surface at ~zero cost.
- **`@indiecrafts/packages-web-security-reports` — `handleCspReport` now rate-limits the anonymous sink.**
  Before parsing the body it applies a per-client-IP fixed window (`csp:<surface>:<ip>`, 30/min) via
  `rateLimit` + `clientIp` from `packages-shared-security`, answering `429` over the limit. **Why:** the
  report route takes unauthenticated POSTs and writes an aggregate D1 row per violation group — a flood
  could inflate the table. No-ops without `RATE_LIMIT_KV` (the CF WAF rule on `/api/*` stays primary);
  this is portable defence-in-depth, the same layer the form routes get from `withGuard`.
- **`packages-web-compliance` split — the portable half moved to `packages-shared-compliance`.** `consent-signals`
  is now a 1-line re-export (every importer unchanged); `consent-store` imports `grantedKeys`/`consentUpdate`/
  `ConsentRecord` from the shared brick and re-exports them (public surface unchanged). **Why:** one source of
  truth for the consent math + the legal-route slugs across every platform.
- **`packages-web-version` — re-exports `isUpdateAvailable` from `packages-shared-version`** (dedupes the inline
  deploy-id compare); `packages-web-locale-suggest`'s `detectPreferredLocale` now calls the shared
  `pickSuggestedLocale` (the HTTP-header parser stays web-only). Behaviour unchanged.

- **`@indiecrafts/packages-shared-agent` — a simple, shared AI-agent core (`code/packages/shared/agent`).**
  One zero-dep, edge/Node-safe brick: the 5-part `AgentSpec` (Goal·Instructions·Context·Tools·Output) +
  `runAgent` (raw-fetch Anthropic Messages API, **forced structured output** via one `output` tool,
  locale-aware, never throws) + a `SPECS` registry (demo `content-research`). Reason-only,
  human-in-the-loop; the caller injects `ANTHROPIC_API_KEY`. Consumed by **all surfaces**: the web app's
  Next route (behind `withGuard`), and the `code/shared/api` Worker (bearer-gated) that the native (Expo)
  - hybrid (Electron) apps call. _Why: give a client one small, secure, translated agent that works the
    same everywhere, with the key always server-side._

- **New brick `@indiecrafts/packages-mobile-ui-native` — the native design system (shadcn-for-RN start).**
  The mobile counterpart of the web `ui` shadcn brick: `ThemeProvider`/`useTheme`/`useColor` over
  `ui-tokens/native` (system light/dark) + the shell component set (`Screen` · `ThemedText` · `Button` ·
  `Card`), StyleSheet on the **same** design tokens as web. Scoped `mobile/` (RN-only). NativeWind
  (`className`) is the drop-in upgrade — the token names already match. Consumed by the mobile shell +
  `system-pages/native`. Docs → [`docs/packages/ui-native.md`](../docs/packages/ui-native.md).
- **`@indiecrafts/packages-shared-ui-tokens` — a 4th generated output: `nativewind.css`.**
  `build-tokens.mjs` now emits a NativeWind theme (`:root` + `.dark:root` hex vars) from the same
  `tokens.json`, so react-native-reusables/NativeWind consume one palette with the web. New `./nativewind.css`
  export. `pnpm tokens:build`/`tokens:check` cover it.
- **New brick `@indiecrafts/packages-shared-ui-fonts` — the self-hosted font files.** Moves Satoshi's
  `.woff2` (+ license) out of the website surface into a shared design-system brick (like `ui-tokens`),
  so a second surface ships the same fonts from one place. `next/font` needs static-literal loader
  calls, so the app keeps its `localFont(...)` in `src/lib/fonts.ts` and points `src.path` at the
  brick's `fonts/*.woff2` by relative path; a native app loads the same file via `expo-font`. `src/index.ts`
  carries a `FONT_FILES` registry; `FontKey`/`FontRoles` **types** stay in `config`. Geist (Google) unchanged.
- **New brick `@indiecrafts/packages-shared-ui-icons` — one cross-platform icon system.** A shared
  contract (`./shared`: `GLYPHS` glyph-name set + `glyphOptions()` for Sanity pickers + `SVGS`
  custom-SVG registry + `BRANDS` brand/social SVG-path data) with platform-forked renderers. **Four
  families:** `Icon` (lucide, cross-platform base), `ReiconIcon` (reicon — web/hybrid; no RN build),
  `SvgIcon` (custom SVGs, cross-platform), `BrandIcon` (brand marks, cross-platform). `./web` serves the
  web surfaces **and the Electron renderer**; `./native` (lucide-react-native + react-native-svg, optional
  peers) omits reicon. The `FeatureGrid` renderer + its Studio picker now derive from **one** `GLYPHS`
  list (was hand-synced in two files); `ui-components`' `FeatureIcon` re-exports `GlyphName` (stored
  content stays valid, set widens 6→~28). **Brand icons deduped** — the website footer/social + the blog
  share/author rows + the homepage showcase render from `BrandIcon`; the website's `reicon-brands` +
  `BrandIcon.tsx` and the blog's inline `BrandIcons.tsx` are removed. Native renderers are ready (`npx
expo install`).
- **`module.custom-html` gains a `width` option (`contained` | `full`).** The custom-HTML block — the
  escape hatch for an editor-pasted embed or a third-party newsletter form — used to render full-bleed
  with no gutter (the only block without a width cap), so a custom form spanned the whole viewport and
  touched the screen edges on mobile. It now defaults to **`contained`** (`max-w-6xl` + gutter, sits with
  the other blocks) with an opt-in **`full`** that keeps a gutter; the renderer is also inline-aware (in
  a blog body the `.prose` column owns width). `<iframe>` embeds stay auto-full-width; a raw
  `<input>`/`<button>` styles its own width. Schema (page-builder) + `CustomHtmlModule` type + `CustomHtml`
  renderer + stories/doc (ui-components). _Why: make "add a custom form and it displays 100% correctly"
  predictable — full width when you want it, with a gutter, and consistent with sibling blocks otherwise._
- **`@indiecrafts/page-builder` + `@indiecrafts/ui-components` — a `module.contact` block.** New
  `module.contact` schema (page-builder) + `Contact`/`ContactForm` renderer (ui-components, tokens +
  Storybook story + `Contact.md`), registered across the sync surface: `moduleSchemas`,
  `MODULE_TYPES`, `blockContent` inline list, `BlockModule` union, `BLOCK_RENDERERS`,
  `portable-text` inline list, and the `BlockFeatures`/`configureBlocks` gate (adds a `contact`
  flag). Renders the contact form for the new `@indiecrafts/contact` module. _Why:_ the form needed
  a droppable block + a self-hiding renderer like newsletter/waitlist.

- **`@indiecrafts/email` — the email palette is now the design tokens (resolved hex), not hand-maintained.**
  New `theme.ts` `EMAIL_COLORS` maps every email role to the generated token hex
  (`@indiecrafts/ui-tokens/native`, light) — mail clients strip `var()`/CSS, so email inlines the hex the
  same way the PWA manifest + React Native do. The **8 duplicated `const C = {…}` palettes** (layout + 7
  templates) collapse into that one source, so a rebrand (`tokens.json` → `pnpm tokens:build`) now flows to
  every email — buttons finally match the real brand instead of a stale `#4f46e5`. `@indiecrafts/email` gains
  a `@indiecrafts/ui-tokens` dep (pure data). Full remap: dark CTAs → `foreground`/`background`, delete →
  `destructive`; the only email-specific hex left is the moderation "approve" green (no success token).

- **`@indiecrafts/email` — every service email now editable in Sanity (owner-alert bodies + lead-magnet).**
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
  - `newsletter/sanity/email.ts` · `deliver-magnet.ts` · the app `/api/emails/test` route.

### Changed

- **`system-pages` promoted to a shared brick + made Next-agnostic.** `@indiecrafts/packages-web-system-pages`
  → **`@indiecrafts/packages-shared-system-pages`** (`packages/shared/system-pages`), forked inside like
  `ui-icons`: `./shared` (prop contracts) · `./web` (DOM — the 404 home link is now **injected**
  (`LinkComponent`, default `<a>`), so **no `next-intl` dep**: one fork serves the Next website AND the
  plain-React Electron renderer) · `./native` (React Native, `onGoHome`/`onRetry`) · `./proxy` (web-only).
  Rename + `@source` + tsconfig `paths` updated; the website passes its typed `Link`. Model →
  [`docs/shared/architecture/cross-platform-shell.md`](../docs/shared/architecture/cross-platform-shell.md).
- **`@indiecrafts/config` — `site.cdnUrl` (first-party asset CDN).** New `site.cdnUrl` primitive
  (`NEXT_PUBLIC_CDN_URL`, empty = origin), fed into each app's Next `assetPrefix` so the app's own build
  assets (`/_next/*` + first-party `/public`) serve from a CDN — **per env** (each env bakes its own build)
  and available to **any** app. Sanity content is unaffected (keeps its `cdn.sanity.io` loader). _Why:_ a
  config-only, per-env CDN any app can opt into.

- **`@indiecrafts/sanity` — `studioBasePath` is now env-driven.** It reads
  `NEXT_PUBLIC_SANITY_STUDIO_BASE_PATH` (default `/studio`) instead of a hard-coded constant, so another
  app in the platform can point the Studio mount + the shared client's stega `studioUrl` elsewhere (or a
  read-only app that never mounts a Studio can ignore it). _Why:_ only the hub app mounts a Studio — the
  shared brick shouldn't hard-code its path for every app that imports the client.

- **`@indiecrafts/page-builder` · `@indiecrafts/i18n` — per-locale page slugs + author/series in the
  locale switcher.** The `page` slug now sets `documentInternationalization: { exclude: true }`, so a
  translation starts with a blank slug (its own per-locale URL) — matching every other content type;
  and `useLocaleSwitch` now detects `/author/*` + `/blog/series/*` to resolve their translated slug.
  _Why:_ `page` was the one document-internationalized type that copied the source slug into a
  translation, and the switcher ignored author + series (falling back to the homepage).

- **`@indiecrafts/ui-components` · `@indiecrafts/page-builder` — capture forms drop the "already"
  state.** `NewsletterForm` · `WaitlistForm` · `LeadMagnetForm` now treat any non-`201` as an error
  (the API no longer returns `200 { already }` — see the app log's oracle fix), and `LeadMagnetForm`
  now sends the visitor `language` like its siblings. The three blocks' `alreadyMessage` schema field
  is unused as a result — hidden in Studio + tagged `@debt VESTIGIAL` for a later removal. _Why:_
  closing the membership oracle removed the "already subscribed" response the forms keyed on.

### Added

- **Storybook `play` interaction tests across the interactive design-system components.** The first
  `play` functions in the library — a story drives its own component in real Chromium (via
  `addon-vitest`) and asserts behavior by **role**, not markup. Now covered:
  - **`@indiecrafts/ui` (28):** overlays/menus `dialog` · `alert-dialog` · `popover` · `sheet` ·
    `drawer` · `dropdown-menu` · `context-menu` · `menubar` · `navigation-menu` · `hover-card` ·
    `tooltip` (open/close); `select` · `combobox` · `command` · `native-select` (pick/filter); `tabs` ·
    `accordion` · `collapsible` (reveal); `checkbox` · `switch` · `toggle` · `toggle-group` ·
    `radio-group` (toggle/select); `slider` (keyboard adjust); `input-otp` · `form` (fill); `sonner`
    (fires a toast).
  - **`@indiecrafts/ui-components` (6):** `NewsletterForm` · `WaitlistForm` · `LeadMagnetForm` (submit
    gated on consent), `PhoneInput` (country + national field), `DataRequestForm` (pick a right),
    `AccordionList` (native `<details>` expand).
  - **`@indiecrafts/locale-suggest`:** `LocaleSuggest` (dismiss removes the strip).
  - Skipped as static (render + a11y + visual snapshot already cover them) or too input-analog to drive
    deterministically: carousels, `resizable` (drag), `calendar` (date-dependent labels), `pagination`,
    `sidebar`, `message-scroller`.

  Two enablers in `@indiecrafts/storybook`'s `.storybook`: a `storybook/test` resolver alias (so the
  sibling-brick stories import the test utils, resolved from the storybook package with browser
  conditions), and a `next-intl/navigation` mock (inert `createNavigation` — `useLocaleSwitch` reaches
  for a Next router that Storybook has no provider for). _Why:_ the interactive components had only
  static render stories — no test exercised opening a menu, selecting an option, or gating a submit.

- **`@indiecrafts/ui-tokens` — token-contract unit test.** `globals.css` is CSS-only (no component to
  drive), so a `tokens.test.ts` guards its structure instead: the light base declares the core semantic
  tokens, the system-dark (`@media prefers-color-scheme: dark`) and toggle-dark (`[data-theme="dark"]`)
  blocks override the **same** token set, and no dark override lacks a light base. _Why:_ a token
  defined in one theme but not the other silently breaks dark mode — this catches the drift.
- **Codified the slots-vs-config boundary (`@indiecrafts/ui` + `ui-components`).** Dev-facing
  primitives expose JSX **slots** (`Header`/`Content`/`Footer` + `asChild` + `data-slot`), never a
  presentational-prop bag; the CMS block renderers are the deliberate **data-in** exception (editors,
  not a developer, own the copy). Recorded in `component-architecture.md` + the ui / ui-components
  briefs (the React design-system "slots over config props" lesson). _Why:_ keep the existing slot
  compliance from silently drifting as new components land.
- **`@indiecrafts/compliance` — GDPR data-subject request flow.** A visitor can now exercise a
  right (access, rectification, erasure, restriction, portability, objection, withdraw consent)
  from `/data-request` — the legal minimum for a site with no user accounts, where a self-service
  export makes no sense. New: the `dataRequest` record schema + **Demandes RGPD** desk, the seven
  `DATA_REQUEST_TYPES` (one set read by the schema, validator, and form), `submitDataRequest`
  (validate → store → alert), and the `dataRequestOwner` email group. The form UI
  (`DataRequestForm`) is in `@indiecrafts/ui-components`; `@indiecrafts/email` gains the
  `data-request-notification` template. _Why:_ the brick already covered consent + legal pages but
  had no way to actually exercise Art. 15–21 — this closes it.
- **`@indiecrafts/page-builder` — new package: the page-builder, extracted from the blog.** The 16
  generic block **schemas** + `blockContent`/`link`/`cta` objects + `quote`/`person` entities +
  `MODULES_FRAGMENT` GROQ + a new generic **`page` document** + the `pageBuilderSanity` barrel moved out
  of `@indiecrafts/blog` into their own package. Renderers stay in `ui-components`; the app, the blog,
  and future apps now compose pages **without depending on the blog module**. `link`'s internal target
  generalized `post` → `page` | `post` (the `LINK_FRAGMENT` href resolves per type, dropping the
  hardcoded `/blog/` prefix). _Why:_ the page-builder is site-wide infra, not a blog concern — the app's
  homepage no longer reaches into `@indiecrafts/blog` for its blocks. The `page` doc carries an `isHome`
  flag + an "Accueil" desk section so the **home is the same `page` model** (one model everywhere).
- **`@indiecrafts/gated-delivery` — new brick: signed, expiring download links.** Pure Web-Crypto
  (HMAC-SHA256, zero deps, Node 22 + Workers): `signDownloadToken` / `verifyDownloadToken` + a
  `resolveGatedDownload` route helper. The consumer injects the secret + asset resolver; the brick
  holds no keys and no storage. Gates link _discovery_ (a signed, expiring token), **not** the CDN
  object. First consumer: newsletter lead-magnet delivery. 8/8 unit tests. _Why:_ a reusable delivery
  seam so any capture channel can gate an asset without re-implementing token crypto.
- **`@indiecrafts/email` — `renderLeadMagnetEmail` template.** One more template (mirrors
  `newsletter-confirm`) — the branded delivery e-mail carrying the gated download button. Copy is
  resolved by the caller (newsletter), per the package's copy-agnostic template rule.
- **`@indiecrafts/utils` — three new leaf helpers (ported + curated).** `./error-message`
  (`getErrorMessage(unknown)` — joins a Zod-style `issues[]`, then `Error.message`, then `String()`;
  duck-types Zod so utils stays dependency-free), `./truncate` (`truncateText` — word-safe cut +
  ellipsis), `./filename` (`sanitizeAndCropFilename` + `validateFilenameLength` — path/char-safe,
  crops by UTF-8 **byte** length so a multi-byte char never splits). Each subpath-only + colocated
  test. Sourced from an in-house project's utils, filtered against `format` (no date/number overlap).
- **`@indiecrafts/security` — `./ip` + `./crypto`.** `./ip` = `isValidIpAddress` /
  `sanitizeIpAddress` / `extractIpFromHeadersList` (thorough IPv4/IPv6, zero-dep, Edge-safe). `./crypto`
  = AES-256-GCM (integrity tag) + salted SHA-256 (`encrypt`/`decrypt`/`encryptObject`/`decryptObject`/
  `hashIpAddress`/`verifyIpHash`/`isEncryptedData`) on **Web Crypto** (`crypto.subtle`) — zero-dep, runs
  on Node 22 **and** Workers, all async; the secret/salt is caller-injected (no keys in the brick).

### Changed

- **`@indiecrafts/email` — pure infra; each email template moved to its owning feature.** Every
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
- **`@indiecrafts/consent` → `@indiecrafts/compliance` — legal pages folded into the brick.**
  Renamed the cookie-consent brick to `@indiecrafts/compliance` and moved the whole legal-pages
  surface **down into it** from the app: the `legalPage` schema (+ its desk section + i18n
  templates), the `LegalPageContent` renderer + `LegalBody` + `CookieDeclaration`, the
  `legalPageQuery` / `consentPolicyVersionQuery`, and the `getConsentPolicyVersion` reader (now
  `@indiecrafts/compliance/sanity/policy-version`, used by the newsletter/waitlist/comment opt-ins).
  **Why:** the consent package already read the app-owned `legalPage` doc through a runtime GROQ
  string — an inverted dependency (package reaching up into app content). Co-locating the schema
  with the queries that read it makes the link compile-time and gives the site one self-contained
  legal + data-protection brick. Reorganized into `src/pages/` · `src/consent/` · `src/reacceptance/`
  under one `complianceSanity` barrel. The 5 legal routes stay in the app as thin shells (Next.js
  routes can't live in a package); the app keeps the `pages` map, `features.legal.*`, and page SEO.

- **`withGuard` validates the client IP.** `guard.ts`'s `clientIp` now runs the trusted
  `cf-connecting-ip` / first `x-forwarded-for` hop through `sanitizeIpAddress` (`./ip`), so a spoofed
  or malformed header can no longer poison the fixed-window rate-limit key.

- **`@indiecrafts/announcement` + `@indiecrafts/locale-suggest` — two site-chrome bricks (domain · web).**
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
- **`@indiecrafts/i18n` — `useLocaleSwitch()`.** Extracted the locale-switch logic (next-intl prefix swap
  - the blog translated-slug resolve via `/api/i18n/translated-slug`) out of the app's `LocaleSwitcher`
    into the shared i18n brick, so the header switcher **and** the new locale-suggestion banner share one
    implementation. Doc: [`docs/packages/announcement.md`](../docs/packages/announcement.md) ·
    [`docs/packages/locale-suggest.md`](../docs/packages/locale-suggest.md).

- **`@indiecrafts/ui-components` — `TurnstileWidget` (client Cloudflare Turnstile).** The client half of
  `@indiecrafts/security`'s server `verifyTurnstile`: renders only when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is
  set (else nothing, form unchanged), loads the CF script once, and reports the token via `onToken` — the
  forms send it as `cf-turnstile-response` and gate submit on `turnstileActive()`. A `siteKey` prop
  override + colocated stories drive it with Cloudflare's test keys. Wired into the newsletter / waitlist /
  comment forms (see the app changelog). Also recorded the **stories-are-mandatory** convention in the
  ui-components brief. Doc: [`docs/packages/ui-components.md`](../docs/packages/ui-components.md).
- **`@indiecrafts/sanity` — `composeStudio(groups)`, the hub-Studio composer (per-app desk).** Alongside
  `composeSanity` (flat "Contenu" desk), the new `composeStudio([{ title, modules }])` aggregates the same
  schema/templates/i18n but renders the desk **grouped per app** — one top-level list per group. It's how
  **one Studio edits many apps' content, organized by app** (multi-app readiness — the web app now groups
  its desk into "Site web" vs "Contenu partagé"). `@indiecrafts/schema`'s `sharedSanity` (objects-only)
  registers schema without a desk item. Doc: [`docs/packages/sanity.md`](../docs/packages/sanity.md) +
  [`docs/apps/web/config/multi-app.md`](../docs/shared/architecture/multi-app.md).

- **`@indiecrafts/consent` — legal re-acceptance (the compliance brick now covers terms, not just cookies).**
  New non-blocking `LegalNotice` banner (`./LegalNotice`) + `getLegalAcceptance` reader (`./sanity/legal`)
  - a `legalConsent` copy singleton (new desk item) + a first-party cookie store (`./legal-store` —
    `LEGAL_ACK_COOKIE` + `acceptLegal`). It reuses the cookie-consent recipe — an effective **version**
    composed from the privacy/terms/terms-of-sale pages' `lastUpdated`, re-shown when the deposited value
    differs — but deposits a **real cookie** (not localStorage) so the app layout gates it **server-side,
    no flash**. Copy from Sanity, no `messages` fallback. The wildcard `exports` (`./*`) needed no change.
    _Why:_ terms/privacy changes deserve the same "please re-accept" flow cookies already had, kept
    separate from cookie consent (don't bundle). Doc: [`docs/packages/consent.md`](../docs/packages/compliance.md).
- **`@indiecrafts/version` — the "new version available" prompt brick.** Notices when a new deploy
  shipped while a tab was open and offers a one-click reload. Service-worker-free (the app is
  OpenNext/Cloudflare): `useVersionCheck` (`./use-version-check`) polls `/api/version` (`no-store`) and
  compares the served id to the bundle-baked `buildInfo.commit` — on mount, a 15-min interval, and every
  tab-focus / network-back (tabs stay open for days). `UpdatePrompt` (`./update-prompt`) is a
  self-contained, token-styled `role="status"` banner (no `<Toaster>`) with two safe update paths: the
  Reload button and an automatic reload on the **next** navigation — never a forced one. i18n-agnostic
  (copy in as props). Category `domain · web`; deps `ui` + `utils`. _Why:_ a config-first template
  deploys often; an open tab shouldn't silently run stale code. Doc:
  [`docs/packages/version.md`](../docs/packages/version.md).

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
  [`docs/packages/config.md`](../docs/packages/config.md). _Follow-up:_ `seo.ts` then dropped
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
  bot. Doc: [`docs/packages/security.md`](../docs/packages/security.md).
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
  [`docs/packages/logger.md`](../docs/packages/logger.md).
- **`@indiecrafts/config` — `DEFAULT_SITE_PREFIX` / `site.prefix`, the per-deployment namespace.** New
  `DEFAULT_SITE_PREFIX` constant (env-overridable via `NEXT_PUBLIC_SITE_PREFIX`) exposed as `site.prefix`,
  plus a derived `localeCookieName` (`${prefix}_NEXT_LOCALE`). It namespaces the browser-owned keys so
  reusing the template per client never collides on a shared origin — **`@indiecrafts/consent`**'s
  `STORAGE_KEY` becomes `${site.prefix}.cookie-consent`, and the app's next-themes `storageKey` +
  next-intl locale cookie follow. Kept in sync with the `wrangler.toml` deploy names by
  `pnpm project:rename <slug>` (app script). _Why:_ one documented identity + a deploy guard make
  many-clients-under-one-Cloudflare-account safe. Doc: [`docs/packages/config.md`](../docs/packages/config.md).
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
  purge-safe. Doc: [`docs/apps/web/design/typography.md`](../docs/apps/web/design/typography.md) § Title highlights.
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
  [`docs/packages/email.md`](../docs/packages/email.md). _Read path unchanged: `getEmailStrings()`
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
  [`docs/packages/consent.md`](../docs/packages/compliance.md). _Not ported from the SaaS: DB
  consent-history, GDPR data export/anonymization, account deletion, IP-salt hashing — they need user
  accounts a marketing template doesn't have._
- **`@indiecrafts/security-headers` — CSP + headers extracted to a brick (and hardened).** A new pure,
  framework-agnostic brick (domain · server) that **builds** the CSP + security headers from hardened
  defaults + per-app hosts: `buildCsp(env, csp?)`, `securityHeaders(opts)` (the full Next `headers()`
  array), and `imageDefaults`/`imageRemotePatterns` (the Next image allowlist). Moved out of
  `code/projects/web/next.config.ts` (that block collapses to one call). **Composes, doesn't replace,
  `@indiecrafts/config`** — `getCurrentEnvironment` + `getCSPConnectSources` stay in config; the brick
  imports them. **Hardened** (new headers): `Strict-Transport-Security` (prod only, no `preload`),
  `Cross-Origin-Opener-Policy: same-origin-allow-popups`, `upgrade-insecure-requests` (prod) — all
  chosen to keep the embedded **Sanity Studio** working (COOP allow-popups for its OAuth login; COEP/CORP
  skipped). Doc: [`docs/packages/security-headers.md`](../docs/packages/security.md).
- **`@indiecrafts/format` — locale formatting & grammar brick.** A new pure, framework-agnostic
  brick (foundation · agnostic, `Intl`-based, dep: `@indiecrafts/config`) for **money** (`formatMoney`
  - `convert`/`withVat`/`parseMoney`), **number** (percent/compact/unit/ordinal/bytes/range),
    **relative time** (`Intl.RelativeTimeFormat` — replaces hardcoded buckets), **lists**
    (`Intl.ListFormat`), **plurals** (`Intl.PluralRules`), **grammar for generated content** (`capitalize`
    Title-vs-sentence · `placeAdjective` adjective position · FR `article` `le/la/l'/du/au` agreement ·
    `inlineNoun`), **text** (truncate/initials/readingTime/excerpt/maskEmail/…), and **validators**
    (phone/IBAN/VAT/postal). Subpath-only (explicit-extension `exports` → no tsconfig `paths`). Adopted:
    the blog byline now uses `formatList`. Config: **`@indiecrafts/config`** gained per-locale format
    rules on the `i18n.locales` rows (`numberLocale` · `currency` · `capitalizeInlineNouns` ·
    `adjBeforeNoun`) + a site-wide `formatDefaults` (`currency`/`vatRate`/`rates`) + `localeFormat(locale)`
    — **not Sanity, not `messages/`** (technical i18n rules). Doc:
    [`docs/packages/format.md`](../docs/packages/format.md).
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
  page, **404**, and **error (500)** presentational components moved out of `code/projects/web`
  (`src/user-interface/{maintenance,not-found,error}/`) into a token-based, app-agnostic brick, plus a
  `maintenanceRewrite(request)` proxy helper (`./proxy`) — the `features.maintenance` 503 rewrite. So a
  second app inherits the same branded status pages + behaviour for free. Decoupling: `NotFoundContent`
  now uses the shared `@indiecrafts/i18n` `Link` (was app `@/i18n/routing`) and `ErrorContent` takes
  copy as **props** (was client `useTranslations`) — both dropped the app's `DefaultLayout`, which the
  **route** now wraps. Per-app glue stays in the app: the routes, `getSystemPages` (Sanity copy) +
  `messages` fallbacks, `@/lib/fonts`, `DefaultLayout`, and `maintenanceLocale()`. Wired via
  `transpilePackages` + a tsconfig `paths` entry + a `@source` line in `ui-tokens/globals.css`. 1
  consumer today (extracted for multi-app reuse, like `consent`). Doc:
  [`docs/packages/system-pages.md`](../docs/packages/system-pages.md).
- **`@indiecrafts/email` — the E-mails entity: config + translated copy in Sanity.** The brick now
  owns an **`emailStrings` singleton** (Studio → **E-mails**, via the new `emailSanity`
  `SanityModule`) — one place that configures every transactional email: recipients, sender, and
  copy. **Subscriber-facing copy is translated** (`localeString`/`localeText`, resolved by the
  recipient's locale); internal owner alerts keep a plain subject. New subpaths: `@indiecrafts/email/
strings` (`getEmailStrings()` React-`cache`d read + `pick`) and `@indiecrafts/email/sanity` (the
  barrel). Two new templates — `newsletter-confirm` (translated) + `newsletter-notification`. Copy no
  longer lives hardcoded in the templates; the senders read the entity and pass resolved strings.
  Adds a `@indiecrafts/sanity` dep. Doc: [`docs/packages/email.md`](../docs/packages/email.md).
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
  [`docs/packages/email.md`](../docs/packages/email.md).
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
  [`docs/packages/consent.md`](../docs/packages/compliance.md).
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
  - `use-mobile` into `src/web/` (imported `@indiecrafts/ui/web/<name>`); `@indiecrafts/ui-components`
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
  [`docs/packages/utils.md`](../docs/packages/utils.md).
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
  [`docs/packages/sanity.md` → Composing the Studio config](../docs/packages/sanity.md).
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
