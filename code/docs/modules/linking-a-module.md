# Linking a module into an app

A module (`code/modules/<name>`, `@indiecrafts/<name>`) is a **vertical product slice** — routes +
UI + data + Studio, feature-flagged, that an app mounts. Linking a module is the same wiring as a
package (see [Linking a package](../packages/linking-a-package.md)) **plus** the extras a
self-contained, gated feature needs. The blog (`@indiecrafts/blog`) is the live reference.

## Module vs package

|        | Package                | Module                                                                           |
| ------ | ---------------------- | -------------------------------------------------------------------------------- |
| Scope  | single-purpose brick   | vertical feature slice                                                           |
| Routes | rarely (a page or two) | often many, incl. dynamic slugs + API                                            |
| Gating | usually none           | a **feature flag** — every public surface 404s + drops from sitemap/nav when off |
| Config | prop-driven            | flags **injected** via `configure*(…)` + a route-gate                            |

## Same five wires

Do the [package five wires](../packages/linking-a-package.md#the-five-wires) first:
`transpilePackages` + `workspace:*` dep + `paths` (if wildcard export) + `@source` (if it renders
classes) + the `SanityModule` barrel. A module's barrel usually goes in the **`appModules`** group
(its content is this app's), and is often a **factory** `xSanity(enabled)` so a disabled feature
hides its desk:

```ts
// apps/web/sanity.config.ts
const appModules = [
  homeSanity,
  blogSanity,
  newsletterSanity(features.newsletter) /* … */,
];
```

## Feature flag

A module declares its flag in the app's `features` config (`apps/web/src/config/features.ts`). The
flag gates **everything**: routes 404, the nav link drops, sitemap + llms.txt entries disappear,
the Studio desk hides. One switch, the whole feature.

## Config injection (a module can't import an app)

Dependencies point down (app → module → package), so a module can't read the app's `features`. The
app **injects** them at boot:

```ts
// apps/web/src/lib/islands.ts  — called once from src/instrumentation.ts
configureBlog({
  flags: { blog: features.blog, comments: features.blogComments /* … */ },
  blogPage: pages.blog,
});
```

Each module ships template-matching defaults, so it is correct even before injection runs. See
`configureBlog` (`modules/blog/src/lib/config.ts`) + [Multi-app](../shared/architecture/multi-app.md).

## The route-gate (gating in one place)

A module folds "flag on **AND** `page.enabled`" into one guard, so a new route can't drift by
checking only half:

```ts
// modules/blog/src/lib/route-gate.ts
export function requireBlogRoute(page) {
  // 404s the page component
  if (!(blogFlags().blog && isPageVisible(page))) notFound();
}
```

Every route shell calls it; sub-surfaces get their own (`isCommentsEnabled`, `isSearchEnabled`, …).

## Routes (app-owned thin shells)

Same rule as packages — routes live in `apps/web/src/app/**`, never in the module. Three shapes:

- **Static page** — `app/[locale]/<seg>/page.tsx` + a `pages` map entry (drives sitemap / llms /
  typed routing / SEO automatically) + `messages.<locale>.pages.<id>.*`.
- **Dynamic page** (`/blog/[slug]`) — the shell adds `generateStaticParams` + `generateMetadata`,
  plus one entry in `DYNAMIC_PATHNAMES` (`apps/web/src/app/routes.ts`) — one per URL **pattern**,
  not per content item (it is excluded from sitemap/llms, which iterate real pages).
- **API route** — `app/api/<name>/route.ts` calling the module engine (`subscribe`, `withGuard`)
  behind an inline `features.<x>` gate.

Each shell calls the route-gate, wraps the module UI in `DefaultLayout`, and emits SEO. Live:
`app/[locale]/blog/[slug]/page.tsx`, `app/api/newsletter/route.ts`.

## Checklist

1. **Wires** — the [package five](../packages/linking-a-package.md#the-five-wires) (barrel usually in `appModules`, often `xSanity(enabled)`).
2. **Flag** — a `features.<x>` entry that gates the whole surface.
3. **Inject** — `configure<X>(…)` in `src/lib/islands.ts`.
4. **Route-gate** — `require<X>Route` folding flag + `page.enabled`; called by every shell.
5. **Routes** — app-owned thin shells (static / dynamic / API) + `pages` / `DYNAMIC_PATHNAMES` entries.
6. **Registry + `CLAUDE.md`** — a row in `code/modules/_registry.md` + a module-root `CLAUDE.md`.
7. **Docs** — `docs/modules/<name>/` + sidebar lines in `docs/.vitepress/config.mts` (same change).
8. **Changelog** — `code/modules/CHANGELOG.md`.
9. `pnpm install` → `pnpm verify:quick`.

## Issue tags

- `@debt COUPLING` — mounting a module hand-wires ~7 app touch-points (the 5 wires + a `features` flag +
  the `configure*` injection + the route shells). Error-prone by hand; a CLI codemod should automate it
  (tracked for the a-la-carte CLI).
