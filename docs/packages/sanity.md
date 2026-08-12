# `@indiecrafts/sanity` — Sanity infra

The client/config plumbing shared by the app's Studio and the blog module. Infra only —
schemas and GROQ stay in their owning feature.

| | |
| --- | --- |
| **Exports (subpath-only, no `.` root)** | `./client` · `./live` · `./env` · `./token` · `./structure` · `./image` |
| **Deps** | `next-sanity ^13.0.3`, `@indiecrafts/config`. **Peer:** `next 16.2.10`, `react 19.2.4`, `sanity: "*"` |
| **Consumers** | app + blog |

- **`env.ts`** derives `projectId`/`dataset` (from `NEXT_PUBLIC_SANITY_PROJECT_ID` /
  `_DATASET`, asserted present), `apiVersion` (`NEXT_PUBLIC_SANITY_API_VERSION` ??
  `"2025-01-01"`), and `studioBasePath = "/studio"`.
- **`structure.ts`** ships the feature-independent desk builders `seoStructureItem`,
  `legalStructureItem`, `navStructureItem`, `cookieStructureItem` — the shared Studio
  sections that the blog's own structure composes.
- **`image.ts`** exports `sanityImageLoader` — the isomorphic `next/image` loader that
  rewrites every image `src` to a CDN-sized source (`?w=&q=&auto=format&fit=max`), wired
  app-side via `images.loaderFile`. Details: [Images](/apps/web/config/images).
- **Gotcha — no `.` root export.** Always import a subpath (`@indiecrafts/sanity/env`,
  `@indiecrafts/sanity/client`, …).
- **Gotcha — `Studio.tsx` and the app's `sanity/structure.ts` stay in the app** (they
  import `sanity.config`); only the reusable *builders* moved here. Pin `sanity` to the
  app's major (v5) — a version skew breaks types across the boundary.

## Wiring & conventions

How every brick is consumed (exports · `transpilePackages` · resolution · Tailwind `@source`
· hardening), the ≥2-consumer rule, and the four-folder mirror → **[Packages overview](./)**.

- [`code/packages/sanity/`](../../code/packages/sanity/) — the source
- [`code/packages/_registry.md`](../../code/packages/_registry.md) — roster + rule
