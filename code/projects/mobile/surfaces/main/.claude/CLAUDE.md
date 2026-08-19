# @indiecrafts/mobile — mobile app (expo)

Auto-loads under `code/projects/mobile/**`. The **React Native (Expo)** mobile client. Talks to the `api`
slot (or the web `/api` routes) for data; renders content from the same Sanity dataset. **Activated Expo
scaffold — one placeholder screen; the real app is TBD.**

**Framework:** React Native · Expo (managed) · TypeScript · Expo Router. **Platform class:** `expo` — ships
via **EAS Build → App Store / Play Store** (OTA via EAS Update), **NOT** Cloudflare, so it sits outside the
default `deploy:all` (Cloudflare) set.

- Consume the shared bricks' **`native/` layer**, not the web one: `@indiecrafts/ui/native/*`,
  `@indiecrafts/ui-components/native/*` (**reserved** today — a README, not code; see
  `code/packages/web/ui-components/src/native/README.md`). Token _values_ (`ui-tokens`) + the `shared/` contracts
  are one home; only the components fork per platform. Reuse the agnostic bricks as-is
  (`@indiecrafts/config`/`format`; Sanity reads via the API).
- **Deploy:** `pnpm deploy:mobile:<dev|staging|prod>` → `scripts/deploy-expo.mjs` (env → EAS profile;
  structure-first — full EAS setup is a follow-up). Reached by `pnpm deploy:all:<env> --only all`.
- **Registry:** a row in [`scripts/lib/apps.mjs`](../../../../scripts/lib/apps.mjs); full deploy model →
  [`code/docs/shared/architecture/platform-deploy.md`](../../docs/shared/architecture/platform-deploy.md).

**Rules:** compose bricks (native layer); **no cross-app imports**; no `next/*` or DOM. This is the day the
`src/native/` layers earn their keep — build them here, mirroring the web domain folders.
