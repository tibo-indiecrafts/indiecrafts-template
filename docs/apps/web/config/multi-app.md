# Multi-app architecture

How the platform scales from one app to several — and how content, Studio, and infra are shared. This
is the **target model**; today there is one app (`web`), which *is* the hub. New apps follow this.

## Three axes — name them, everything follows

- **Tenant** = one client = **one Sanity project/dataset + one Cloudflare zone**. The multi-*instance*
  axis, already handled by [`pnpm project:rename`](../setup/new-client) (namespace) + a per-client
  project/dataset. Every app a tenant runs shares this one content graph.
- **App** = a deployable Next app = a **read-lens** over the tenant's content + its own Worker/domain.
  The multi-*app* axis (web · a future admin · a standalone blog · …).
- **Island** = a module/package (`@indiecrafts/blog`, `newsletter`, `waitlist`, …) contributing schema +
  UI + routes + flags, **composed into** apps. The recombination axis — "choose what an app has".

## Decision A — one dataset per tenant; apps are lenses (not per-app datasets)

A tenant's content is **one graph**: `post` / `quote` / `person` are read by more than one app, the
marketing homepage's page-builder reuses the blog's `module.*` object types, and the shared primitives
(`localeString`, `seoMeta`) + the `emailStrings` singleton assume a single schema registry. Splitting by
app-dataset would fork all of that and break content sharing.

So **the dataset is the tenant, not the app.** Each app queries the one dataset for the `_type`s it
renders; app-**private** collections (`subscriber`, `waitlistEntry`, `comment`) are only edited/owned by
the app that defines them; **shared** collections (`post`, `quote`, `person`) are read by any app.
Scoping is by **`_type`** (today's mechanism). If two apps ever need separate instances of the *same*
type (e.g. two blogs), add an optional `scope` field + a query filter — not needed until then.

## Decision B — one hub Studio, desk organized per app; apps are read-only

There is **exactly one Studio** — the hub. It composes the **union of every island's schema** and is the
single place everything is edited; the desk is **grouped by owning app** (+ a **Shared** group), so an
editor sees `Web app · … · Shared` and edits a `post` once for every lens that shows it.

**Front-end apps are read-only lenses** — they query the one dataset via the read client + generated
types and **embed no Studio** (only the hub holds `SANITY_API_WRITE_TOKEN` + the full schema). Today the
hub *is* the web app's `/studio`; when apps proliferate, extract a dedicated **`apps/studio`** so editors
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

## Config split (the enabling refactor)

`@indiecrafts/config` becomes **shared primitives only** (i18n mechanics, env, CSP, logging, format,
types); a per-app config (`apps/<app>/config/`) owns `site` · `theme` · `fonts`, and `features` / `pages`
compose from the manifest. Islands stop reading `features.blog` from a central registry — their route
gates take the app's resolved config, so an island recombines across apps without assuming one app's flag
shape. (See [`packages/config`](/packages/config).)

## Infra per app (Terraform)

Already multi-app: the reusable `modules/site` is keyed by `worker_name`, and state is isolated per
app-dir × per-env-workspace. A new app = copy `apps/web/` → `apps/<app>/` + its tfvars + `infra:<app>:*`
delegators. **One app = one Cloudflare zone** (the zone-level rules are singletons — see
[Cloudflare IaC](../setup/cloudflare-iac#add-app-2)). `pnpm project:rename <slug>` keeps the config
prefix, the wrangler names, **and** the tfvars `worker_name` in sync.

## Where it stands

- **Now:** one app (`web`) = the hub Studio + the only lens; one tenant dataset. The `Island` manifest +
  `composeStudio`/`composeApp` + the config split are the readiness work; graduation of a module into its
  own app (e.g. `apps/blog`) is a cheap follow-up *because* of them — not built yet.
- **Adding an app** (when it lands): scaffold `code/apps/<name>/` (own `CLAUDE.md`/`DESIGN.md`/`README`,
  `_registry` row — `pnpm-workspace.yaml` already globs `code/apps/*`), an `islands.ts`, per-app config,
  route files (thin), its Terraform dir + a distinct zone; it reads the shared dataset and edits through
  the one hub Studio.
