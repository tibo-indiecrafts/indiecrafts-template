# modules — product features (towns), gated

Vertical, feature-flagged slices — composed from `packages/` bricks, mounted by an app.

## Extracted

| Module | Category · platform | Holds | Flag |
| --- | --- | --- | --- |
| `@indiecrafts/blog` | content · web (+native⌾) | the editorial blog + page-builder + Sanity schema/queries/structure → `code/modules/blog` | `features.blog` |
| `@indiecrafts/newsletter` | growth · web + server | subscribe engine + provider adapters + `subscriber` doc + `newsletterSettings` singleton + `newsletterSanity` barrel → `code/modules/newsletter`. The public form is a page-builder block (schema in blog, renderer in `ui-components`) that POSTs the thin `/api/newsletter` route → this module's engine. | `features.newsletter` |
| `@indiecrafts/waitlist` | growth · web + server | early-access `join` engine + **editor-creatable** `waitlistEntry` doc + `waitlistSettings` singleton + `waitlistSanity` barrel + `user-interface/WaitlistLanding` → `code/modules/waitlist`. **Two public surfaces** (same `WaitlistForm`): a full `/waitlist` page (module view; app route is a thin shell) **and** a page-builder block (schema in blog, renderer in `ui-components`) → thin `/api/waitlist` route. All copy in Sanity (form on `waitlistSettings`, SEO on `siteMeta.pageSeo`). Collect + export only; optional confirm/owner emails via `@indiecrafts/email`. Modeled on newsletter. | `features.waitlist` |

## Reserved — by category

- **commerce:** shop
- **community:** events · community
- **learning:** learning
- **services:** booking · jobs · support · crm

Names only; no code yet.

## Categorisation & platform

Same two axes as the bricks (full convention → [`code/packages/.claude/CLAUDE.md` → Categorisation
& platform](../packages/.claude/CLAUDE.md)):

- **Category** — the vertical a module serves (`content` · `growth` · reserved `commerce`/`community`/…),
  recorded above. **Platform** — a module is **web UI today** (`src/user-interface/**`) with a
  **server** engine (`/api/*` route + provider adapters) and **agnostic** Sanity data.
- A **native app** adds `src/user-interface/native/` beside the web tree (the `ui-components`
  `renderers/web|native/` split model — reserve with a README, don't scaffold); the engine + data
  are already platform-agnostic and shared as-is.
- **Fold `modules/` into `modules/<category>/<module>/`** at the same triggers as the bricks
  (roster grows past scanning, or app #2 on a new platform). Module **names** are path-independent,
  so the move touches only globs, `paths`, `@source`, and doc links.
