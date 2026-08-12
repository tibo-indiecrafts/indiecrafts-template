# packages — shared bricks (bridges)

Extract here only when a brick has ≥2 consumers (internal TS packages + `transpilePackages`).

## Extracted

| Package | Holds | Consumers |
| --- | --- | --- |
| `@indiecrafts/config` | site config DATA + types/helpers (`isLocale`, env, CSP) | app + (blog) |
| `@indiecrafts/utils` | `cn` · logger · slugify · video-embed · consent-signals · format-date | app + (blog) |
| `@indiecrafts/sanity` | Sanity infra — `client · live · env · token` | app + (blog) |
| `@indiecrafts/ui` | shadcn primitives (61) + `use-mobile` (the design-system component layer) | app + (blog) |
| `@indiecrafts/i18n` | shared next-intl navigation (`Link`) — modules use it (app keeps typed routing) | app + blog |
| `@indiecrafts/ui-tokens` | `globals.css` (OKLCH tokens) · `typeset.css` · `DESIGN.md` — the design system | app |
| `@indiecrafts/ui-components` | page-builder block renderers (10 generic `module.*`) + `ModuleSection` · `Cta` · portable-text map + composable `BLOCK_RENDERERS` registry + block `types` | app + blog |

Consumed as source via Next `transpilePackages`; resolved through pnpm workspace symlinks.
Tailwind v4 scans the app + `ui` + `ui-components` explicitly via `@source` in the tokens `globals.css`.

## Reserved (extract on ≥2 consumers)

- schema · presets · auth · billing · data · notifications · media · search · ai · realtime · analytics · flags · moderation — names only; no code yet.
