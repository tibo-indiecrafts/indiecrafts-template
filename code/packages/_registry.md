# packages — shared bricks (bridges)

Extract here only when a brick has ≥2 consumers (internal TS packages + `transpilePackages`).

## Layout — foldered by **platform-scope**

Bricks nest `code/packages/<scope>/<brick>/`, where **scope = the highest platform the brick runs
on** — the same `shared · web · mobile · hybrid` set as `code/shared` ↔ `code/projects/<platform>`:

- **`shared/`** — cross-platform: agnostic (pure TS/data), server-side (used by every backend), or a
  cross-platform contract. A brick that runs on ≥2 platforms lives here.
- **`web/`** — web-client-only (DOM · Tailwind · Next).
- **`mobile/`** · **`hybrid/`** — reserved README markers (Expo / Electron bricks) until those apps
  build UI. **Delete** the marker if the scope is never needed.

**Category** (`foundation · design-system · domain`) is a **tag**, not a folder — recorded below.

## Extracted

Rows grouped by **scope**; the `Category` column keeps the old axis as a tag.

### `shared/` — cross-platform bricks

| Package | Category | Holds | Consumers |
| --- | --- | --- | --- |
| `@indiecrafts/config` | foundation | site config DATA + types/helpers (`isLocale`, env, CSP) | app + (blog) |
| `@indiecrafts/logger` | foundation | structured logging — `logger` (levels · scopes) + per-env config (`production: "silent"`) + pretty/json reporters + opt-in Sentry transport; edge/Workers-safe, `console`-based | app + blog + newsletter + waitlist |
| `@indiecrafts/utils` | foundation | `cn` · slugify · video-embed · format-date · error-message · truncate · filename (subpath-only) | app + blog + ui |
| `@indiecrafts/schema` | foundation | shared Sanity object primitives (`localeString · localeText · seoMeta`) + the `sharedSanity` contribution barrel | app + blog |
| `@indiecrafts/i18n` | foundation | shared next-intl navigation (`Link`) — modules use it (app keeps typed routing) | app + blog |
| `@indiecrafts/format` | foundation | locale money/number/time/list/plural formatters + grammar for generated content (capitalize · adjective position · FR article agreement) + text helpers + validators (phone/IBAN/VAT/postal). Per-locale rules on `config` `i18n.locales` + `formatDefaults`. | app + blog |
| `@indiecrafts/page-builder` | foundation | the page-builder content model — the generic `page` document + 16 `module.*` block **schemas** + `blockContent`/`link`/`cta` objects + `quote`/`person` entities + `MODULES_FRAGMENT` GROQ + `pageBuilderSanity` barrel. Renderers live in `ui-components`; the app's `/[locale]/[...slug]` route + `homePage` + blog all consume it. | app + blog |
| `@indiecrafts/gated-delivery` | domain | signed-token gated file delivery — `signDownloadToken` / `verifyDownloadToken` (HMAC-SHA256 on Web Crypto, expiring) + `resolveGatedDownload` route helper. Zero-dep, framework-agnostic; the consumer injects the asset resolver + secret. Gates link *discovery*, not the CDN object. | newsletter (lead-magnet delivery — 1 consumer today) |
| `@indiecrafts/sanity` | foundation (server-side) | Sanity infra — `client · live · env · token`. Server-side but consumed by every platform's backend → cross-platform. | app + (blog) |
| `@indiecrafts/email` | domain (server-side) | transactional email — `sendEmail` (Resend REST, server-only) + shared HTML `renderEmailLayout`/`escapeHtml` + the render contract. **Owns no templates** — each `render<Name>Email` lives in the owning feature's `src/emails/` (blog · newsletter · waitlist) | blog (extracted so any module/app can send — modules can't depend on modules) |
| `@indiecrafts/security` | domain (server-side) | **response** side — CSP + hardened headers (HSTS/COOP/upgrade-insecure, prod) + immutable cache-control + Next image allowlist (`buildCsp` · `securityHeaders` · `imageDefaults`, composing `config`'s `getCSPConnectSources`). **request** side — `withGuard` route wrapper (`./guard`): same-site origin + body-cap + fixed-window rate-limit (`./rate-limit`, Workers KV) + Turnstile verify (`./turnstile`), `isSameSiteRequest` (`./origin`), validated client IP (`./ip`). **crypto** — AES-256-GCM + salted SHA-256 on Web Crypto (`./crypto`, at-rest PII + GDPR IP-hash). Kept Studio-safe. | app (headers + the 3 public form routes) |
| `@indiecrafts/ui-tokens` | design-system | `globals.css` (OKLCH tokens) · `typeset.css` · `DESIGN.md` — the design system. Token **values** are platform-agnostic (the web `globals.css` is just the web consumer view), so the source of truth lives at `shared`. | app |

### `web/` — web-client-only bricks

| Package | Category | Holds | Consumers |
| --- | --- | --- | --- |
| `@indiecrafts/ui` | design-system | shadcn primitives (61) + `use-mobile` (the DOM component layer) — `src/web/` today; a `src/native/` reserved marker awaits a mobile design system | app + (blog) |
| `@indiecrafts/ui-components` | design-system | page-builder block **renderers** (16 generic `module.*`) + `ModuleSection` · `Cta` · portable-text map + composable `BLOCK_RENDERERS` registry + block `types`. The matching **schemas** live in `@indiecrafts/page-builder`. | app + blog |
| `@indiecrafts/compliance` | domain | the site's legal + data-protection surface: the 5 **legal pages** (`legalPage` schema + `LegalPageContent` renderer, in `src/pages/`) + **cookie-consent** runtime (banner · store · Consent-Mode gates/hooks, `src/consent/`) + **legal re-acceptance** (`LegalNotice` + `legal-ack` cookie + `getLegalAcceptance`, `src/reacceptance/`) + Sanity schema (`cookieConsent` + `legalConsent` + `legalPage`) + `complianceSanity` barrel + `getCookieConsent` / `getConsentPolicyVersion` (signal types in `./consent/consent-signals`) | app (5 thin route shells; extracted for multi-site reuse) |
| `@indiecrafts/system-pages` | domain | branded status pages every app shares — `Maintenance` · `NotFoundContent` · `ErrorContent` (presentational, token-based) + `maintenanceRewrite` proxy helper (`./proxy`) | app (extracted for multi-app reuse — 1 consumer today; copy/routes/fonts stay per-app) |
| `@indiecrafts/version` | domain | "new version available" prompt — `useVersionCheck` (`no-store` poll of `/api/version` vs the bundle-baked `buildInfo.commit`; SW-free, OpenNext/CF) + self-contained `UpdatePrompt` banner (Reload + auto-reload on next nav). i18n-agnostic; copy from Sanity `siteMeta.<locale>.versionPrompt` | app (extracted for multi-app reuse — 1 consumer today) |
| `@indiecrafts/announcement` | domain | announcement / discount strip under the nav — `announcementBar` Sanity singleton (rotating items: message + copyable discount code + internal/external link + schedule window) + `getAnnouncement` reader (live-now + version hash) + `AnnouncementBar` (normal-flow, server-gated dismiss cookie, no flash) | app (extracted for multi-site reuse — 1 consumer today) |
| `@indiecrafts/locale-suggest` | domain | "available in your language" suggestion — pure `detectPreferredLocale` (Accept-Language vs active) + `localeSuggest` copy singleton + `LocaleSuggest` strip (suggest, never redirect; native names, no flags; dismiss cookie). Switch reuses `useLocaleSwitch` (`@indiecrafts/i18n`) | app (1 consumer today) |

Consumed as source via Next `transpilePackages`; resolved through pnpm workspace symlinks.
Tailwind v4 scans the app + `web/` bricks + `web/` modules explicitly via `@source` in the tokens
`globals.css` (in `shared/ui-tokens`).

## Reserved (extract on ≥2 consumers) — by category

- **foundation:** data · presets · flags
- **domain:** auth · billing · notifications · media · search · ai · realtime · analytics · moderation

Names only; no code yet. (`notifications` = a future broader multi-channel system; `email` above
is the send/render layer it would build on.)

## Placement — scope, then category

Two axes. **Scope is the folder** (which platforms a brick runs on); **category is a tag** (what a
brick _is_). The convention + the multi-platform escape hatch live in the area brief:
[`.claude/CLAUDE.md` → Categorisation & platform](.claude/CLAUDE.md). In short:

- **Scope = the highest platform a brick runs on** — `shared` if it works on ≥2 platforms (agnostic,
  server-side, or a pure data/contract brick), else its single client platform (`web` today). A new
  brick declares its scope by the folder it lands in.
- **Category** (what a brick _is_) — `foundation` · `design-system` · `domain`. Recorded as the tag
  column above; a new brick declares its category on extraction.
- **Multi-platform design bricks** (web shadcn vs native RN) stay in `shared/` with an internal
  `src/{web,native}/` fork, or spawn siblings (`ui-web` + `ui-native`) once the dependency graphs
  diverge. `ui`/`ui-components` are `web/` today because shadcn is DOM-only; promote to `shared/`
  when the native design system is real. Package **names** are path-independent (pnpm resolves by
  name), so the move touches only `pnpm-workspace.yaml` globs, tsconfig `paths`, `@source` lines,
  and doc links — no import specifier moves.
