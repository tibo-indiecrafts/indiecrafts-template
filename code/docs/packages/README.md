# Packages — shared bricks

Internal `@indiecrafts/<name>` TypeScript **bricks** shared by the app and the modules.
Single-purpose, **consumed as source** (no per-brick build) through pnpm workspace
symlinks + Next `transpilePackages`. Dependencies point **down** and never up:
`app → module → package`. A brick that imports an app is a design error.

**Fifteen bricks are live** — one page each below (exports · deps · consumers · gotchas). All
ship `version: 0.0.0`, `private: true`, `type: module`. The roster and reserved names live in
[`code/packages/_registry.md`](../../code/packages/_registry.md).

Grouped by **category** — `foundation` (the base every layer builds on) · `design-system` (the
presentation layer) · `domain` (cross-cutting product capabilities). The roster is **flat on
disk** while scannable; it folds into `packages/<category>/` only past a trigger — see the
[categorisation convention](../../code/packages/.claude/CLAUDE.md).

| Brick                                              | Category      | What it holds                                                                                                                                                        | Consumers                          |
| -------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| [`@indiecrafts/config`](./config.md)               | foundation    | site config DATA + types/helpers (`isLocale`, env, CSP, `localizedPathname`)                                                                                         | app + blog                         |
| [`@indiecrafts/logger`](./logger.md)               | foundation    | structured logging — `logger` (levels · `child` scopes) + per-env config + reporters (pretty/json) + opt-in Sentry transport; edge/Workers-safe                      | app + blog · newsletter · waitlist |
| [`@indiecrafts/utils`](./utils.md)                 | foundation    | `cn` · slugify · video-embed · format-date                                                                                                                           | app + blog                         |
| [`@indiecrafts/schema`](./schema.md)               | foundation    | shared Sanity object primitives (`localeString · seoMeta`) + `sharedSanity`                                                                                          | app + blog                         |
| [`@indiecrafts/i18n`](./i18n.md)                   | foundation    | shared next-intl navigation (`Link`) — modules use it (app keeps typed routing)                                                                                      | blog                               |
| [`@indiecrafts/sanity`](./sanity.md)               | foundation    | Sanity infra — `client · live · env · token · structure · image · write` + the `composeSanity` contribution model                                                    | app + blog                         |
| [`@indiecrafts/format`](./format.md)               | foundation    | locale money/number/time/list/plural formatters + grammar for generated content + text helpers + validators (phone/IBAN/VAT/postal); per-locale rules on `config`    | app + blog                         |
| [`@indiecrafts/ui`](./ui.md)                       | design-system | 61 shadcn primitives + `use-mobile` (CLI-managed, docs colocated)                                                                                                    | app + blog                         |
| [`@indiecrafts/ui-tokens`](./ui-tokens.md)         | design-system | `globals.css` (OKLCH) · `typeset.css` · `DESIGN.md` — the design system                                                                                              | app                                |
| [`@indiecrafts/ui-components`](./ui-components.md) | design-system | generic page-builder block renderers + `BLOCK_RENDERERS` registry                                                                                                    | app + blog                         |
| [`@indiecrafts/storybook`](./storybook.md)         | design-system | Storybook documenting `ui` + `ui-components` + `ui-tokens` — colocated stories + token doc pages                                                                     | — (docs tool)                      |
| [`@indiecrafts/consent`](./consent.md)             | domain        | cookie-consent runtime (banner · store · Consent-Mode gates) + Sanity schema + `getCookieConsent`                                                                    | app                                |
| [`@indiecrafts/email`](./email.md)                 | domain        | transactional email — `sendEmail` (Resend REST) + `renderEmailLayout` + per-email templates + the composed **E-mails** entity + "Send test"                          | blog · newsletter · waitlist · app |
| [`@indiecrafts/system-pages`](./system-pages.md)   | domain        | branded status pages — `Maintenance` · `NotFoundContent` · `ErrorContent` + `maintenanceRewrite`                                                                     | app                                |
| [`@indiecrafts/security`](./security.md)           | domain        | CSP + hardened headers (HSTS/COOP) + image allowlist **and** request hardening — `withGuard` (origin · body-cap · rate-limit · Turnstile) for the public form routes | app                                |

## How a brick is wired

1. **`package.json`** — `name` `@indiecrafts/<x>`, an `exports` map pointing at `./src/*`,
   and it declares its own npm deps (pnpm is strict — each brick lists what it imports).
2. **`next.config` `transpilePackages`** lists every `@indiecrafts/*` — Next compiles the
   TS/TSX source directly, no build step.
3. **Resolution — `exports` vs. tsconfig `paths`.** Single-extension packages resolve via
   their `exports` map + workspace symlinks. A **mixed `.ts`/`.tsx`** package (or one imported
   by a deep subpath) needs a tsconfig `paths` entry to resolve — the app declares `@/*` plus one
   `@indiecrafts/<x>/*` line per such brick/module (`utils`, `email`, `system-pages`, `consent`,
   `ui/web`, `ui-components`, `blog`, `newsletter`, `waitlist`).
4. **Tailwind v4** scans code outside `node_modules` only via `@source` in
   `ui-tokens/globals.css` — one line per package that renders classes (`ui`, `ui-components`,
   the blog module, the app).
5. **Supply-chain hardening.** `pnpm-workspace.yaml` sets `minimumReleaseAge` +
   `trustPolicy`; a `pnpm add`/re-resolve needs the temp-relax dance (comment the guards,
   install, restore).

## The ≥2-consumer rule

Extract a brick only at **≥2 consumers** (YAGNI). Today's bricks all clear it — the app and
the blog module both consume `config`/`utils`/`sanity`/`ui`/`i18n`/`ui-components`; `ui-tokens`
is app-only but is the design-system root. A brick depending on another brick is fine
(`utils`→`config`, `ui`→`utils`, `sanity`/`i18n`→`config`); a brick depending on an app is
the one thing that is not.

Reserved (names only — extract on ≥2 consumers): `schema · presets · auth · billing · data ·
notifications · media · search · ai · realtime · analytics · flags · moderation`. See
[`code/packages/_registry.md`](../../code/packages/_registry.md).

## Adding a brick (the repeatable shape)

A new brick lands in known places — see the checklist in
[`code/packages/CLAUDE.md`](../../code/packages/CLAUDE.md): a `code/packages/<name>/` dir, a
row in `_registry.md`, a `docs/packages/<name>.md` page (+ its sidebar line), and a line in
the [packages changelog](./changelog.md).

## Where this sits

`code/packages/<name>/` (build) ↔ `docs/packages/` (what — these
pages).

## Pointers

- [`code/packages/CLAUDE.md`](../../code/packages/CLAUDE.md) — agent conventions
- [`code/packages/_registry.md`](../../code/packages/_registry.md) — the brick roster + rule
- [`DESIGN.md`](../../code/packages/shared/ui-tokens/DESIGN.md) — the `ui-tokens` design contract
- [Packages changelog](./changelog.md) — the `code/packages/` area log

## Links

- **Live:** `<production URL>` · **Repo:** `<git URL>` · **Deploy:** `<Cloudflare dashboard>`

<!-- Template placeholders — fill per project; canonical URLs live in the root README. -->
