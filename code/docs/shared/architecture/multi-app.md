---
title: "Multi-app architecture"
description: "How the platform scales from one app to several — and how content, Studio, and infra are shared."
status: stable
---

# Multi-app architecture

How the platform scales from one app to several — and how content, Studio, and infra are shared. This
is the **target model**; today there is one app (`web`), which _is_ the hub. New apps follow this.

## Three axes — name them, everything follows

- **Tenant** = one client = **one Sanity project/dataset + one Cloudflare zone**. The multi-_instance_
  axis, already handled by [`pnpm project:rename`](/projects/web/website/setup/new-client) (namespace) + a per-client
  project/dataset. Every app a tenant runs shares this one content graph.
- **App** = a deployable Next app = a **read-lens** over the tenant's content + its own Worker/domain.
  The multi-_app_ axis (web · a future admin · a standalone blog · …).
- **Island** = a module/package (`@indiecrafts/modules-web-blog`, `newsletter`, `waitlist`, …) contributing schema +
  UI + routes + flags, **composed into** apps. The recombination axis — "choose what an app has".

## Decision A — one dataset per tenant; apps are lenses (not per-app datasets)

A tenant's content is **one graph**: `post` / `quote` / `person` are read by more than one app, the
page-builder (`@indiecrafts/packages-web-page-builder`) `module.*` blocks compose every page + the blog body, and the shared primitives
(`localeString`, `seoMeta`) + the `emailStrings` singleton assume a single schema registry. Splitting by
app-dataset would fork all of that and break content sharing.

So **the dataset is the tenant, not the app.** Each app queries the one dataset for the `_type`s it
renders; app-**private** collections (`subscriber`, `waitlistEntry`, `comment`) are only edited/owned by
the app that defines them; **shared** collections (`post`, `quote`, `person`) are read by any app.
Scoping is by **`_type`** (today's mechanism). If two apps ever need separate instances of the _same_
type (e.g. two blogs), add an optional `scope` field + a query filter — not needed until then.

## Decision B — one hub Studio, desk organized per app; apps are read-only

There is **exactly one Studio** — the hub. It composes the **union of every island's schema** and is the
single place everything is edited; the desk is **grouped by owning app** (+ a **Shared** group), so an
editor sees `Web app · … · Shared` and edits a `post` once for every lens that shows it.

**Front-end apps are read-only lenses** — they query the one dataset via the read client + generated
types and **embed no Studio** (only the hub holds `SANITY_API_WRITE_TOKEN` + the full schema). Today the
hub _is_ the web app's `/studio`; when apps proliferate, extract a dedicated **`apps/studio`** so editors
have one home independent of any front-end.

## Decision C — the per-app island manifest (choose what an app has)

"What an app mounts" is currently spread across six unsynced places (`transpilePackages` · deps ·
`composeSanity` · route files · the `pages` map · feature flags). The target is a single per-app
**manifest** — `apps/<app>/islands.ts` — where each island is one line. Two composers read it:

- **`composeStudio(allIslands)`** (hub) → the union schema + the per-app-grouped desk.
- **`composeApp(manifestIslands)`** (each app) → that app's `transpilePackages` · feature defaults ·
  `pages` map. A read-only app needs no `composeSanity`.

Each island exports an `Island` descriptor (`name`, `app` tag for desk grouping, `pkg`, its
`SanityModule`, `features`, `pages`). Adding/removing an island is then one edit, and the app's surface is
legible in one file.

## Config split (done — the enabling refactor)

`@indiecrafts/packages-shared-config` is now **shared primitives + the generic page-config contract** (i18n mechanics,
Intl format, env/CSP, logging, `PageConfig`/`isPageVisible`); the app owns its instance config in
`projects/web/website/src/config` (`theme` · `fonts` · `features` · the `pages` map + the derived
`StaticAppPathname`), imported via `@/config`. A second app gets its own `src/config`.

- **`site` stays in `@indiecrafts/packages-shared-config`** — it's pure deploy env (`NEXT_PUBLIC_SITE_URL` /
  `NEXT_PUBLIC_SITE_PREFIX`), already per-deployment, and read by shared packages (`consent`, `email`);
  a second app overrides it via its own Worker env, which is the correct multi-app mechanism.
- **Islands read app-injected config, not a central registry** (packages/modules can't import an app):
  the blog reads a `configureBlog(...)` holder (route-gate + settings + llms); the newsletter/waitlist
  page-builder blocks read `configureBlocks(...)`; their Studio desks are `xSanity(enabled)` functions;
  `getLegalAcceptance(locale, flags)` takes the legal flags; the `/api/newsletter*` + `/api/waitlist`
  routes gate on `features` directly. The app wires all of it once at boot in
  `src/instrumentation.ts` → `@/lib/islands` (`configureIslands`), so an island recombines across apps
  without assuming one app's flag shape. Each holder defaults to the template's set, so a single app is
  correct even before `configureIslands` runs. (See [`packages/shared/config`](/packages/shared/config).)

## Brick & module tiers — what a surface pulls in

Not every surface is a marketing site. What a surface depends on falls in tiers, so a lean surface
(`admin` · `app` · `mobile`) never carries the content stack:

- **baseline** — every surface: `packages-shared-config` (via `@/config`), `packages-shared-ui-tokens`
  (`globals.css`), and, on web, `packages-web-ui` (shadcn primitives). The Hello-World `app` surface
  wires only these.
- **portable** (`packages/shared/*`) — any platform: `config · ui-tokens · ui-icons · ui-fonts · utils ·
format · logger · security · gated-delivery · system-pages · compliance · version` (`system-pages` +
  `compliance` fork `web`/`native` inside). No Next/React/DOM/Sanity coupling in the shared surface.
  `compliance`/`version` each pair a portable core here with a richer `web/` brick (below): the
  shared core is what the `app`/Expo shells consume, the web brick is the website's Sanity
  surface over the same math.
- **web-coupled** (`packages/web/*`) — needs Next/React/DOM/Sanity: `ui · ui-components · sanity ·
email · page-builder · schema · i18n · announcement · compliance · locale-suggest · version`. Shared
  across web _surfaces_; can't run on Expo as-is.
- **native** (`packages/mobile/*`) — Expo/RN-only: `ui-native` (the native design system). The web `ui`
  (shadcn/DOM) can't run here; native forks the components but shares the **tokens**.
- **content / marketing** (`modules/web/*`) — website-only feature verticals: `blog · newsletter ·
waitlist · contact`. A non-content surface depends on **none** of these.

Rule of thumb: **content is a module or a `web/` brick, and only the content surface (`website`) pulls
it in.** Add `sanity`/`email`/page-builder/a module to another surface only when a real page needs it —
`app` deliberately declares none. Scope is decided by _what a brick can run on_, not who uses it today
(see [`packages/_registry.md`](/packages/README)). When a native app eventually needs a web-coupled brick
(Sanity reads, block types, i18n), split its portable core into `shared/` then — `config`'s `./shared`
vs `./web` split is the proven pattern.

How the two UI platforms assemble the **same shell** (theme · i18n · fonts · status pages · UI) from
these tiers — and the Next-agnostic rule that keeps web bricks portable — is its own page:
[**Cross-platform shell**](/shared/architecture/cross-platform-shell).

## Infra & deploy per app

**Deploy** is registry-driven: one row in [`code/shared/scripts/lib/apps.mjs`](../../../code/shared/scripts/lib/apps.mjs) per
app, shared runners dispatched by platform class, and CI that fans out from the registry — full model in
[**Platform deploy**](/shared/architecture/platform-deploy).

**Terraform** (the Cloudflare edge config `wrangler.toml` can't express) is already multi-app: each app's
per-app root is **co-located with the app and self-contained** at `code/projects/<platform>/<kind>/<app>/infra/` (one
`main.tf` with all edge resources inlined — no shared module), keyed by `worker_name`, state isolated per
env workspace. A new app = copy `code/projects/web/surfaces/website/infra/` → `code/projects/<platform>/<kind>/<app>/infra/` + its tfvars +
`infra:<app>:*` delegators. **One app = one Cloudflare zone** (the zone-level rules are singletons — see
[Cloudflare IaC](/shared/infra/cloudflare-iac#add-app-2)). `pnpm project:rename <slug>` keeps the config
prefix, the wrangler names, **and** the tfvars `worker_name` in sync.

## Where it stands

- **Now:** eight activated app slots across three platform classes; `web` is the full app + the hub
  Studio + the only content lens; one tenant dataset. The non-website shells (`app` · `mobile`)
  now share a compliance + version + locale layer over the portable bricks
  ([`compliance-shared`](/packages/shared/compliance) · [`version-shared`](/packages/shared/version)) —
  legal link-out, a compliant-ready consent + re-acceptance UI, an update prompt, and a persisted locale
  choice; see [Cross-platform shell](/shared/architecture/cross-platform-shell). **Done:** the config split (app-owned
  `theme`/`fonts`/`features`/`pages`; islands read injected config), `composeStudio` (the per-app-grouped
  hub desk), and registry-driven deploy + CI ([Platform deploy](/shared/architecture/platform-deploy)). **Still readiness
  work:** the `Island` manifest + `composeApp` (Decision C — one line per island composing
  `transpilePackages`/features/pages), and graduation of a module into its own app (e.g. `apps/blog`) — a
  cheap follow-up _because_ of the split, not built yet.
- **Adding an app** (when it lands): scaffold `code/projects/<name>/` (own `CLAUDE.md`/`DESIGN.md`/`README`,
  `_registry` row — `pnpm-workspace.yaml` already globs `code/projects/*`), an `islands.ts`, per-app config,
  route files (thin), its Terraform dir + a distinct zone; it reads the shared dataset and edits through
  the one hub Studio.
