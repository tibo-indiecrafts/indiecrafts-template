# @indiecrafts/web-surfaces-app

A minimal **Hello World** Next.js web surface (`next-cf`: Next → OpenNext → Cloudflare Workers).
Wires only the **baseline** bricks (`config` · `ui` · `ui-tokens`) and ships a single placeholder
page. Not a content surface — add `sanity`/`security`/content bricks only when a real page needs them.

**Status: scaffold** — one Hello World page. Grow it by copying the chrome you need from
`code/projects/web/surfaces/website` (fonts, theme, i18n) and building pages from
`@indiecrafts/packages-web-ui` primitives.

**Deploy:** `pnpm deploy:web:app:<dev|staging|prod>` → the shared `scripts/deploy/next.mjs`; or
`pnpm deploy:all:<env>`. Registry row: [`scripts/lib/apps.mjs`](../../../../shared/scripts/lib/apps.mjs).
