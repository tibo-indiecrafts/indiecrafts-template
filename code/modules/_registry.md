# modules — product features (towns), gated

Vertical, feature-flagged slices — composed from `packages/` bricks, mounted by an app.

## Layout — foldered by **platform-scope**

Modules nest `code/modules/<scope>/<module>/`, where **scope = where the feature renders** — the
same `shared · web · mobile · hybrid` set as the bricks:

- **`web/`** — web-delivered features (the three live modules).
- **`shared/`** — cross-platform features (same feature on ≥2 platforms). Reserved marker.
- **`mobile/`** · **`hybrid/`** — Expo / Electron-only features. Reserved markers.

**Category** (`content · growth · …`) stays a **tag**, not a folder.

## Extracted

### `web/` — web-delivered features

| Module | Category | Holds | Flag |
| --- | --- | --- | --- |
| `@indiecrafts/modules-web-blog` | content | the editorial blog + page-builder + Sanity schema/queries/structure → `code/modules/web/blog` | `features.blog` |
| `@indiecrafts/modules-web-newsletter` | growth | subscribe engine + provider adapters + `subscriber` doc + `newsletterSettings` singleton + `newsletterSanity` barrel → `code/modules/web/newsletter`. The public form is a page-builder block (schema in blog, renderer in `ui-components`) that POSTs the thin `/api/newsletter` route → this module's engine. | `features.newsletter` |
| `@indiecrafts/modules-web-waitlist` | growth | early-access `join` engine + **editor-creatable** `waitlistEntry` doc + `waitlistSettings` singleton + `waitlistSanity` barrel + `user-interface/WaitlistLanding` → `code/modules/web/waitlist`. **Two public surfaces** (same `WaitlistForm`): a full `/waitlist` page (module view; app route is a thin shell) **and** a page-builder block (schema in blog, renderer in `ui-components`) → thin `/api/waitlist` route. All copy in Sanity (form on `waitlistSettings`, SEO on `siteMeta.pageSeo`). Collect + export only; optional confirm/owner emails via `@indiecrafts/packages-web-email`. Modeled on newsletter. | `features.waitlist` |
| `@indiecrafts/modules-web-contact` | growth | contact-form `submit` engine + **read-only** `contactMessage` inbox doc + `contactSettings` singleton + `contactSanity` barrel + `user-interface/ContactLanding` → `code/modules/web/contact`. **Two public surfaces** (same `ContactForm`): a full `/contact` page (module view; app route is a thin shell) **and** a page-builder block (schema in `page-builder`, renderer in `ui-components`) → thin `/api/contact` route. All copy in Sanity (form on `contactSettings`, SEO on its `.seo`). Stores every message; best-effort acknowledgement + owner-alert emails via `@indiecrafts/packages-web-email` (owner alert carries the body, `reply-to` = sender). Modeled on waitlist. | `features.contact` |

The engine (`/api/*` route + provider adapters) is server-side and the Sanity data is agnostic —
both already platform-portable. A module is filed by **where its UI renders**, so all three are
`web/` today; a feature that ships UI on ≥2 platforms moves to `shared/`.

## Reserved — by category

- **commerce:** shop
- **community:** events · community
- **learning:** learning
- **services:** booking · jobs · support · crm

Names only; no code yet.

## Placement — scope, then category

Same two axes as the bricks (full convention →
[`code/packages/.claude/CLAUDE.md` → Categorisation & platform](../packages/.claude/CLAUDE.md)):

- **Scope = where a module renders** — `web` today (`src/user-interface/**`), `shared` when the same
  feature ships on ≥2 platforms, `mobile`/`hybrid` when it is that-platform-only. The engine + data
  are platform-agnostic and travel as-is.
- **Category** — the vertical a module serves (`content` · `growth` · reserved
  `commerce`/`community`/…), the tag column above.
- **Multi-platform UI** — a native app adds `src/user-interface/native/` beside the web tree (the
  `ui-components` `renderers/web|native/` split model — reserve with a README, don't scaffold), and
  the module moves to `modules/shared/`. Module **names** are path-independent, so the move touches
  only globs, `paths`, `@source`, and doc links.
