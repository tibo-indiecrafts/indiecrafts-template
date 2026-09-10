# Linking a package into an app

A package (`code/packages/<name>`, `@indiecrafts/<name>`) is a single-purpose brick — shared
logic, UI, types, or a Sanity contribution. Linking it means **wiring its code into an app**; a
package never wires itself. This is the generic recipe. For a full feature slice with its own
routes and gating, see [Linking a module](../modules/linking-a-module.md).

## What the package ships vs what the app owns

| The package ships                         | The app owns                              |
| ----------------------------------------- | ----------------------------------------- |
| Importable code (`@indiecrafts/<name>/…`) | The wires that activate it                |
| A `SanityModule` (schema + desk), if any  | The one line that mounts it in the Studio |
| UI + readers (prop-driven, app-agnostic)  | Any **route** that renders them           |

A package **cannot own a route** — Next.js scans only `code/projects/web/surfaces/website/src/app/**`. See
[Routes](#routes-a-package-cant-own-one).

## The five wires

Activate a package by adding only the wires it needs:

| #   | Wire                                            | Where                                                 | When                                                                                                                                                          |
| --- | ----------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| a   | `transpilePackages` entry                       | `code/projects/web/surfaces/website/next.config.ts`   | **always** (consumed as TS source)                                                                                                                            |
| b   | `workspace:*` dependency                        | `code/projects/web/surfaces/website/package.json`     | **always**                                                                                                                                                    |
| c   | `paths` entry                                   | `code/projects/web/surfaces/website/tsconfig.json`    | **only** if it has a wildcard subpath export (`"./*"`) — tsc + the Sanity schema-extract can't map that to a 1:1 file; packages with per-file exports skip it |
| d   | `@source` line                                  | `packages/shared/ui-tokens/src/globals.css`           | only if it renders Tailwind classes                                                                                                                           |
| e   | `SanityModule` barrel → a `composeStudio` group | `code/projects/web/surfaces/website/sanity.config.ts` | only if it ships Sanity content                                                                                                                               |

- **Pure-logic brick** (e.g. `utils`, `format`): `a` + `b` only.
- **UI + Sanity brick** (e.g. `compliance`): all five.

After adding the wires, run `pnpm install` (relinks the workspace) then `pnpm verify:quick`.

## Sanity: the one-line mount

If the package ships schema, it exports a `SanityModule` barrel (`src/sanity/index.ts`) — schema
types + its desk section (+ i18n templates). Add it to a group in the `composeStudio([…])` call:

```ts
// code/projects/web/surfaces/website/sanity.config.ts
import { complianceSanity } from "@indiecrafts/packages-web-compliance/sanity";

const sharedModules = [coreSanity, complianceSanity /* … */];
```

`sharedModules` = site-wide config every app reads ("Contenu partagé"); `appModules` = this app's
own content ("Site web"). See [sanity](./sanity.md) + [Multi-app](../shared/architecture/multi-app.md).

## Routes: a package can't own one

Next.js only scans `code/projects/web/surfaces/website/src/app/**` for routes, so a page file can never live in a package.
When a package renders a page, the **app** adds a thin `page.tsx` shell that wraps the package view:

```tsx
// code/projects/web/surfaces/website/src/app/[locale]/cookie-policy/page.tsx
import { LegalPageContent } from "@indiecrafts/packages-web-compliance/pages/LegalPageContent";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildMetadata({ page: pages.cookies, locale }); // SEO — app
}
export default async function CookiePolicyPage({ params }) {
  const { locale } = await params;
  if (!isPageVisible(pages.cookies)) notFound(); // gate — app
  return (
    <DefaultLayout>
      {" "}
      {/* shell — app */}
      <LegalPageContent pageKey="cookies" locale={locale} />{" "}
      {/* body — package */}
    </DefaultLayout>
  );
}
```

The package stays **prop-driven** — no layout, no SEO, no flags inside. The app keeps the shell,
the `pages` map entry, feature-flag gating, and SEO. Adding the one `pages` entry auto-propagates
sitemap, llms.txt, typed routing, and the SEO chain. Full route detail →
[Linking a module § Routes](../modules/linking-a-module.md#routes-app-owned-thin-shells). Live
examples: `@indiecrafts/packages-web-compliance` (5 legal pages), `@indiecrafts/packages-shared-system-pages` (404 · error ·
maintenance).

## Checklist

1. **Wires** — `a` + `b` always; `c` / `d` / `e` per the table.
2. **Studio** — the `SanityModule` line, if it ships schema.
3. **Routes** — app-owned thin shells + `pages` entries, if it renders pages.
4. **Registry** — a row in `code/packages/_registry.md`.
5. **Doc** — a page `docs/packages/<name>.md` + a sidebar line in `docs/.vitepress/config.mts` (same change).
6. **Changelog** — `code/packages/CHANGELOG.md`.
7. `pnpm install` → `pnpm verify:quick`.

## Issue tags

- `@debt COUPLING` — activating a brick still hand-wires up to 5 app files (`next.config.ts`,
  `package.json`, `tsconfig.json`, `ui-tokens/globals.css`, `sanity.config.ts`). A CLI codemod should
  automate the wiring so a buyer never edits them by hand (tracked for the a-la-carte CLI).
