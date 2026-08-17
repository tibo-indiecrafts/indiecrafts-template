# Feature architecture (frontend)

**Principle:** one feature = one vertical slice in `features/<name>/`. The app
router holds routes only; the feature owns its UI, data, gating, and docs.

## Plan first (answer before coding)

- **Boundary** — what belongs to this feature, what stays shared?
- **Routes** — which URLs, static or dynamic, which locales?
- **Data** — what it reads/writes, from where?
- **Config** — which flags gate it? default on or off?
- **Strings** — what user-facing copy, which locales?
- **Docs** — which page mirrors it?
- **Seams** — where will the next person extend it?

## Canonical structure

```
features/<name>/
  user-interface/      UI by route → sections/ components/ layout/ + shared/
  <data>/              queries · types · schema (API client, ORM, or CMS)
  lib/                 route-gate + feature utilities
  CLAUDE.md            feature rules (auto-loaded when editing here)
app/<route>/           route files only — thin page.tsx / route.ts
config/                flags + page registry
messages/<locale>      user-facing strings
docs/features/<name>   human docs mirror
```

| Concern | Generic rule                                                                | In indiecrafts-template                    |
| ------- | --------------------------------------------------------------------------- | ------------------------------------------ |
| Routes  | `app/` = routes only; `page.tsx` thin (< 150 lines)                         | `app/[locale]/blog/**`                     |
| UI      | organize by route → `sections/ components/ layout/`; multi-page → `shared/` | `features/blog/user-interface/`            |
| Data    | one typed layer, one client (never per-route)                               | `features/blog/sanity/{queries,types}.ts`  |
| Gating  | one helper folds flag **and** page-enabled                                  | `features/blog/lib/route-gate.ts`          |
| Flags   | config data, not scattered booleans                                         | `features.blog`, `features.blogTaxonomy.*` |
| Strings | never inline                                                                | `messages/<locale>.json`                   |
| Docs    | mirror the feature                                                          | `docs/features/blog/`                      |

## Next.js / React best practice

- **Server Components by default**; `"use client"` only for real interactivity.
- Fetch data at the route (server), pass plain props down.
- Compose with `cn()` + `cva` variants — never fork a component.
- Semantic tokens (`bg-card`), not raw values; container queries when the
  component's own width drives layout.
- File-size discipline: components < 200 lines, page templates < 150. Split at the seam.
- Extensible registries use an **exhaustive `switch`** so the compiler flags a
  missing case.

## Expansion seams (add X = N steps)

- **Sub-route** → `app/.../page.tsx` + config page entry + messages key + docs row.
- **UI block** → one file in `sections/` + mount it; strings in messages.
- **Render module** → schema + component + one `switch` case (types enforce).
- **Flag** → one config field + read it at the gate.

## Anti-patterns

Giant `page.tsx` · cross-feature imports · a route with no gate · inline strings ·
a second component duplicating an existing one under a new name.

## Definition of done

Route gated · strings externalized · tokens not raw values · responsive at
375/768/1280 · docs + index updated · typecheck + lint clean.
