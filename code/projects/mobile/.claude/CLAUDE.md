# @indiecrafts/mobile — mobile app (reserved slot · skeleton)

Auto-loads under `code/projects/mobile/**`. The **React Native (Expo)** mobile client. Talks to the `api`
slot (or the web `/api` routes) for data; renders content from the same Sanity dataset.

**Framework:** React Native · Expo (managed) · TypeScript · Expo Router.

**Activate:**
1. `npx create-expo-app@latest code/projects/mobile` (or `pnpm dlx create-expo`), name it `@indiecrafts/mobile`.
2. Consume the shared bricks' **`native/` layer**, not the web one: `@indiecrafts/ui/native/*`,
   `@indiecrafts/ui-components/native/*` (both **reserved** today — a README, not code, until this app
   exists; see `code/packages/ui-components/src/native/README.md`). The token _values_ (`ui-tokens`) +
   the `shared/` contracts are one home; only the components fork per platform.
3. Reuse the platform-agnostic bricks as-is: `@indiecrafts/config` (primitives), `@indiecrafts/format`,
   `@indiecrafts/i18n`-equivalent (next-intl → a RN i18n lib), `@indiecrafts/sanity` reads via the API.
4. Deploy: **EAS Build** → App Store / Play Store; OTA updates via EAS Update.

**Rules:** compose bricks (native layer); **no cross-app imports**; no `next/*` or DOM. This is the day the
`src/native/` layers earn their keep — build them here, mirroring the web domain folders.
