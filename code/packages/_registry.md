# packages — shared bricks (bridges)

Extract here only when a brick has ≥2 consumers (internal TS packages + `transpilePackages`).

## Extracted

Rows grouped by **category** (foundation → design-system → domain); the roster stays **flat on
disk** while scannable — see [Categorisation & platform](#categorisation--platform) for the axes
and the trigger that folds it into `packages/<category>/`.

| Package | Category · platform | Holds | Consumers |
| --- | --- | --- | --- |
| `@indiecrafts/config` | foundation · agnostic | site config DATA + types/helpers (`isLocale`, env, CSP) | app + (blog) |
| `@indiecrafts/logger` | foundation · agnostic | structured logging — `logger` (levels · scopes) + per-env config (`production: "silent"`) + pretty/json reporters + opt-in Sentry transport; edge/Workers-safe, `console`-based | app + blog + newsletter + waitlist |
| `@indiecrafts/utils` | foundation · agnostic | `cn` · slugify · video-embed · format-date · error-message · truncate · filename (subpath-only) | app + blog + ui |
| `@indiecrafts/schema` | foundation · agnostic | shared Sanity object primitives (`localeString · seoMeta`) + the `sharedSanity` contribution barrel | app + blog |
| `@indiecrafts/i18n` | foundation · agnostic | shared next-intl navigation (`Link`) — modules use it (app keeps typed routing) | app + blog |
| `@indiecrafts/format` | foundation · agnostic | locale money/number/time/list/plural formatters + grammar for generated content (capitalize · adjective position · FR article agreement) + text helpers + validators (phone/IBAN/VAT/postal). Per-locale rules on `config` `i18n.locales` + `formatDefaults`. | app + blog |
| `@indiecrafts/sanity` | foundation · server | Sanity infra — `client · live · env · token` | app + (blog) |
| `@indiecrafts/page-builder` | foundation · agnostic | the page-builder content model — the generic `page` document + 16 `module.*` block **schemas** + `blockContent`/`link`/`cta` objects + `quote`/`person` entities + `MODULES_FRAGMENT` GROQ + `pageBuilderSanity` barrel. Renderers live in `ui-components`; the app's `/[locale]/[...slug]` route + `homePage` + blog all consume it. | app + blog |
| `@indiecrafts/ui` | design-system · web | shadcn primitives (61) + `use-mobile` (the design-system component layer) | app + (blog) |
| `@indiecrafts/ui-tokens` | design-system · web | `globals.css` (OKLCH tokens) · `typeset.css` · `DESIGN.md` — the design system | app |
| `@indiecrafts/ui-components` | design-system · web (+native⌾) | page-builder block **renderers** (16 generic `module.*`) + `ModuleSection` · `Cta` · portable-text map + composable `BLOCK_RENDERERS` registry + block `types`. The matching **schemas** live in `@indiecrafts/page-builder`. | app + blog |
| `@indiecrafts/storybook` | design-system · tooling | Storybook (nextjs-vite) documenting `ui` + `ui-components` + `ui-tokens` — colocated stories + token doc pages · `pnpm storybook` | — (docs tool) |
| `@indiecrafts/compliance` | domain · web | the site's legal + data-protection surface: the 5 **legal pages** (`legalPage` schema + `LegalPageContent` renderer, in `src/pages/`) + **cookie-consent** runtime (banner · store · Consent-Mode gates/hooks, `src/consent/`) + **legal re-acceptance** (`LegalNotice` + `legal-ack` cookie + `getLegalAcceptance`, `src/reacceptance/`) + Sanity schema (`cookieConsent` + `legalConsent` + `legalPage`) + `complianceSanity` barrel + `getCookieConsent` / `getConsentPolicyVersion` (signal types in `./consent/consent-signals`) | app (5 thin route shells; extracted for multi-site reuse) |
| `@indiecrafts/email` | domain · server | transactional email — `sendEmail` (Resend REST, server-only) + shared HTML `renderEmailLayout`/`escapeHtml` + one template per email (`templates/`, `comment-notification` today) | blog (extracted so any module/app can send — modules can't depend on modules) |
| `@indiecrafts/system-pages` | domain · web | branded status pages every app shares — `Maintenance` · `NotFoundContent` · `ErrorContent` (presentational, token-based) + `maintenanceRewrite` proxy helper (`./proxy`) | app (extracted for multi-app reuse — 1 consumer today; copy/routes/fonts stay per-app) |
| `@indiecrafts/security` | domain · server | **response** side — CSP + hardened headers (HSTS/COOP/upgrade-insecure, prod) + immutable cache-control + Next image allowlist (`buildCsp` · `securityHeaders` · `imageDefaults`, composing `config`'s `getCSPConnectSources`). **request** side — `withGuard` route wrapper (`./guard`): same-site origin + body-cap + fixed-window rate-limit (`./rate-limit`, Workers KV) + Turnstile verify (`./turnstile`), `isSameSiteRequest` (`./origin`), validated client IP (`./ip`). **crypto** — AES-256-GCM + salted SHA-256 on Web Crypto (`./crypto`, at-rest PII + GDPR IP-hash). Kept Studio-safe. | app (headers + the 3 public form routes) |
| `@indiecrafts/version` | domain · web | "new version available" prompt — `useVersionCheck` (`no-store` poll of `/api/version` vs the bundle-baked `buildInfo.commit`; SW-free, OpenNext/CF) + self-contained `UpdatePrompt` banner (Reload + auto-reload on next nav). i18n-agnostic; copy from Sanity `siteMeta.<locale>.versionPrompt` | app (extracted for multi-app reuse — 1 consumer today) |
| `@indiecrafts/announcement` | domain · web | announcement / discount strip under the nav — `announcementBar` Sanity singleton (rotating items: message + copyable discount code + internal/external link + schedule window) + `getAnnouncement` reader (live-now + version hash) + `AnnouncementBar` (normal-flow, server-gated dismiss cookie, no flash) | app (extracted for multi-site reuse — 1 consumer today) |
| `@indiecrafts/locale-suggest` | domain · web | "available in your language" suggestion — pure `detectPreferredLocale` (Accept-Language vs active) + `localeSuggest` copy singleton + `LocaleSuggest` strip (suggest, never redirect; native names, no flags; dismiss cookie). Switch reuses `useLocaleSwitch` (`@indiecrafts/i18n`) | app (1 consumer today) |
| `@indiecrafts/gated-delivery` | domain · agnostic | signed-token gated file delivery — `signDownloadToken` / `verifyDownloadToken` (HMAC-SHA256 on Web Crypto, expiring) + `resolveGatedDownload` route helper. Zero-dep, framework-agnostic; the consumer injects the asset resolver + secret. Gates link *discovery*, not the CDN object. | newsletter (lead-magnet delivery — 1 consumer today) |

`⌾` = platform reserved (a README, not an empty scaffold) — see the `ui-components` `renderers/native/` precedent.
Consumed as source via Next `transpilePackages`; resolved through pnpm workspace symlinks.
Tailwind v4 scans the app + `ui` + `ui-components` explicitly via `@source` in the tokens `globals.css`.

## Reserved (extract on ≥2 consumers) — by category

- **foundation:** data · presets · flags
- **domain:** auth · billing · notifications · media · search · ai · realtime · analytics · moderation

Names only; no code yet. (`notifications` = a future broader multi-channel system; `email` above
is the send/render layer it would build on.)

## Categorisation & platform

Two axes, both **decided, not yet foldered** — the convention + the fold-later trigger live in the
area brief: [`.claude/CLAUDE.md` → Categorisation & platform](.claude/CLAUDE.md). In short:

- **Category** (what a brick _is_) — `foundation` · `design-system` · `domain`. Recorded in the
  table above; a new brick declares its category on extraction.
- **Platform** (what runtime it _targets_) — `agnostic` (pure TS/data), `web` (DOM/Tailwind),
  `server`, or `tooling`. Platform **never** becomes a top-level folder; a package that gains a
  second platform splits **inside** itself (`src/web|native/` + `src/shared/`, the UI model —
  `ui`/`ui-components`/`ui-tokens`), while shared `ui-tokens` values + `shared/` contracts stay one
  home. Spawn a sibling brick only for a genuinely separate dependency graph.
- **Fold `packages/` into `packages/<category>/<brick>/`** only when the flat roster passes
  **~18 bricks** _or_ **app #2 targets a new platform**. The move is mechanical — package **names**
  are path-independent (pnpm resolves by name), so only `pnpm-workspace.yaml` globs, tsconfig
  `paths`, `@source` lines, and doc links change.
