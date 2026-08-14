# `@indiecrafts/sanity` — Sanity infra

The client/config plumbing shared by the app's Studio and the blog module. Infra only —
schemas and GROQ stay in their owning feature.

| | |
| --- | --- |
| **Exports (subpath-only, no `.` root)** | `./client` · `./live` · `./env` · `./token` · `./structure` · `./image` · `./write` · `./module` |
| **Deps** | `next-sanity ^13.0.3`, `@indiecrafts/config`. **Peer:** `next 16.2.10`, `react 19.2.4`, `sanity: "*"` |
| **Consumers** | app + blog |

- **`env.ts`** derives `projectId`/`dataset` (from `NEXT_PUBLIC_SANITY_PROJECT_ID` /
  `_DATASET`, asserted present), `apiVersion` (`NEXT_PUBLIC_SANITY_API_VERSION` ??
  `"2025-01-01"`), and `studioBasePath = "/studio"`.
- **`structure.ts`** ships the feature-independent desk builders `seoStructureItem`,
  `legalStructureItem`, `navStructureItem`, `cookieStructureItem` — the shared Studio
  sections that the blog's own structure composes.
- **`module.ts`** exports the `SanityModule` contribution type + `composeSanity()` — see
  [Composing the Studio config](#composing-the-studio-config).
- **`write.ts`** exports `writeClient` — a **server-only** authenticated write client
  (Editor-role `SANITY_API_WRITE_TOKEN`). The one runtime write path (blog comments); callers
  must hard-code `_type` + whitelist fields. `import "server-only"` keeps it off the browser.
- **`image.ts`** exports `sanityImageLoader` — the isomorphic `next/image` loader that
  rewrites every image `src` to a CDN-sized source (`?w=&q=&auto=format&fit=max`), wired
  app-side via `images.loaderFile`. Details: [Images](/apps/web/config/images).
- **Gotcha — no `.` root export.** Always import a subpath (`@indiecrafts/sanity/env`,
  `@indiecrafts/sanity/client`, …).
- **Gotcha — `Studio.tsx` and the app's `sanity/structure.ts` stay in the app** (they
  import `sanity.config`); only the reusable *builders* moved here. Pin `sanity` to the
  app's major (v5) — a version skew breaks types across the boundary.

## Composing the Studio config

The Studio is **composed**, not hand-wired. Each owner — the shared-schema brick, the app
core, and every module — exports a **`SanityModule`** contribution:

```ts
export type SanityModule = {
  name: string;
  schemaTypes: SchemaTypeDefinition[];
  structure?: (S) => ListItemBuilder[];   // this owner's desk items (no dividers)
  templates?: Template[];                  // "+ Create" initial-value templates
  i18nSchemaTypes?: string[];              // document-internationalized types
  emailGroups?: FieldDefinition[];         // E-mails singleton groups (→ @indiecrafts/email)
};
```

`sanity.config.ts` is then a thin composer — **one line per module**:

```ts
const s = composeSanity([sharedSanity, blogSanity, coreSanity]);
// schema.types = s.schemaTypes · structureTool({ structure: s.structure })
// templates: () => s.templates · documentInternationalization({ schemaTypes: s.i18nSchemaTypes })
```

`composeSanity` flattens the schema/templates/i18n lists and stitches the desk sections into
one "Contenu" list with a divider between items. **Adding a module** = drop its `xSanity`
into the array (+ the `transpilePackages`/`package.json` dep it already needs); **removing**
= delete the line — no dangling references across four hardcoded lists. This is what makes
each module standalone. A module's barrel lives at `@indiecrafts/<module>/sanity`; the
app-core one at `apps/web/src/sanity`; the shared primitives at
[`@indiecrafts/schema`](/packages/schema).

## Wiring & conventions

How every brick is consumed (exports · `transpilePackages` · resolution · Tailwind `@source`
· hardening), the ≥2-consumer rule → **[Packages overview](./)**.

- [`code/packages/sanity/`](../../code/packages/sanity/) — the source
- [`code/packages/_registry.md`](../../code/packages/_registry.md) — roster + rule
