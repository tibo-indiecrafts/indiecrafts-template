# @indiecrafts/mobile-surfaces-main — mobile app (expo)

Auto-loads under `code/projects/mobile/**`. The **React Native (Expo)** mobile client. Talks to the `api`
slot (or the web `/api` routes) for data; renders content from the same Sanity dataset. **Shell wired +
the first product screen (`account`) — theme · i18n · status pages · native UI foundation · a signed-in
`account` screen (native cookie preferences + a web hand-off for account management/deletion); further
product screens are TBD.**

> **AI tooling — install the official Expo plugin** (`claude plugin install expo@claude-plugins-official`,
> then `/reload-plugins`): the Expo **Skills** (`expo-router` · `expo-native-ui` · `expo-design-system` ·
> `expo-tailwind-setup` · `expo-upgrade` · `eas-*`) + the Expo **MCP** for version-correct SDK-52 docs.
> Reach for them here — the model's RN/Expo priors are stale. Setup:
> [environment → Expo / React Native](../../../../../docs/apps/web/setup/environment.md). **Lint here is
> `npx expo lint`** (Expo's own `eslint-config-expo`, RN-appropriate — it self-configures on first run),
> **not** the website's Next config; the on-the-fly lint hook **skips** these files and the Stop
> review-nudge prompts `expo lint` / `expo-doctor` when you touch `mobile/**`.

## The shell (built)

- **Providers** — `app/_layout.tsx`: `QueryClientProvider` (TanStack Query — shared `queryDefaults` from
  [`packages-shared-query`](../../../../../packages/shared/query); server-state cache for the client SPAs) →
  `ThemePreferenceProvider` (`lib/theme-preference` — a persisted `light`/`dark`/`system` choice over the
  shared tokens; `system` follows the OS, switched by a 3-way home-screen control; wraps `ui-native`'s
  `ThemeProvider`) → `IntlProvider`
  (`react-intl`) → the router `Stack`. Data screens fetch with `useQuery`/`useMutation`, the `queryFn`
  calling the shared api.
- **i18n** — `lib/i18n.ts`: `expo-localization` detects the device locale → `react-intl` formats the
  app's own `messages/{en,fr}.json` (same ICU format as web; flattened for react-intl). Vocabulary
  (`isLocale`/`localeCodes`) from `@/config`.
- **UI foundation** — [`@indiecrafts/packages-mobile-ui-native`](../../../../../packages/mobile/ui-native)
  (shadcn-for-RN start: `Screen` · `ThemedText` · `Button` · `Card`) over `ui-tokens/native`.
- **Status pages** — `app/+not-found.tsx` + the `ErrorBoundary` export use
  `system-pages/native` (404 · 500), themed at the shell.
- **Compliance + version + locale** — `components/ShellOverlays.tsx` (mounted in `_layout`):
  the shared `compliance/native` consent banner + legal re-acceptance popup (AsyncStorage store,
  gated by `config.features.requireConsent`, off by default; **geo-targeted** per country via the api
  `GET /v1/geo` + `config.consent` — `lib/geo.ts`; the legal gate uses the website's **live** version
  via `fetchLegalVersion` — static `policyVersion` = offline fallback — and, when `hasClerk`
  (`SignedInLegalReacceptGate`), syncs acceptance across surfaces via `/v1/consent/legal`), an `AppState` version poll of the
  website's `/api/version`, a first-run locale suggestion (`pickSuggestedLocale`), and an offline banner
  (`hooks/useNetworkStatus` via `@react-native-community/netinfo` feeds the shared `system-pages/native`
  `OfflineBanner`, copy from `SHELL_COPY.offline`). `app/legal.tsx`
  links out to the website's legal pages (`Linking.openURL(legalUrl(websiteUrl, …))`). Locale switches
  at runtime + persists (`lib/i18n.ts` `getStoredLocale`/`setStoredLocale`). Instance config
  (`sitePrefix` · `websiteUrl` · `features` · `policyVersion`) in `config/index.ts`.
- **Account** — `app/account.tsx` (signed-in): the shared `compliance/native` cookie-preferences panel
  (`ConsentPreferences`, one shared `consentStore` from `lib/consent-store.ts`) + a `MarketingEmailToggle`
  (commercial-email opt-in → `/v1/consent/marketing-email`) + an `accountUrl` web hand-off (in-app
  browser tab, sharing the system cookie jar) for profile/security/export/deletion and general account
  management — no native delete or export control; the web account's `DeleteAccountSection` is where the
  churn exit-survey lives. Linked from home + the sign-in signed-in view. `app/sign-in.tsx`
  carries the sign-up marketing opt-in (+ locale) in `signUp.create` `unsafeMetadata`; a one-time
  post-sign-in `MarketingNudgeGate` (in `ShellOverlays`, gated on `hasClerk`) prompts a signed-in user who
  has no decision yet.
  `app/sign-in.tsx`'s OTP step/mode/busy/error state is `lib/sign-in-machine.ts`'s pure
  `signInReducer` (+ `State`/`Action`/`initialState`) via `useReducer` — no Clerk or react-intl
  imports there; the component still owns every Clerk call and dispatches on each result.
- **Persistence** — every storage key lives in `STORAGE_KEYS` (`@/config`); read a name, never inline
  `${sitePrefix}.…`. `lib/storage` wraps `AsyncStorage` never-throw for app **prefs** (non-secret). A
  runtime **session token** belongs in `expo-secure-store` (OS keychain) once the `auth` brick lands — not
  here; today's `EXPO_PUBLIC_EVENTS_TOKEN` (session-log ingest bearer — least-privilege, not the admin `APP_API_TOKEN`) is a build-time bundle gate, so it stays in env.
- **Fonts** — deferred: Satoshi ships as web `.woff2`; RN needs `.ttf`/`.otf`, so the shell renders with
  the system font until an `.otf` lands in `ui-fonts`. Wire `expo-font` `useFonts` then.

Model → [`cross-platform-shell.md`](../../../../../docs/shared/architecture/cross-platform-shell.md).

**Framework:** React Native · Expo (managed) · TypeScript · Expo Router. **Platform class:** `expo` — ships
via **EAS Build → App Store / Play Store** (OTA via EAS Update), **NOT** Cloudflare, so it sits outside the
default `deploy:all` (Cloudflare) set.

- Consume the **native** design system `@indiecrafts/packages-mobile-ui-native` (NOT the web shadcn `ui`)
  and the shared bricks' **`native/` layer** (`ui-icons/native`, `system-pages/native`). Page-builder block
  renderers stay web-only (`@indiecrafts/packages-web-ui-components/native/*` is still a reserved README).
  Token _values_ (`ui-tokens`) + the `shared/` contracts are one home; only the components fork per
  platform. Reuse the agnostic bricks as-is (`@indiecrafts/packages-shared-config`/`format`; Sanity reads
  via the API).
- **Deploy:** `pnpm deploy:mobile:main:<dev|staging|prod>` → `shared/scripts/deploy/expo.mjs` (env → EAS profile;
  structure-first — full EAS setup is a follow-up). Reached by `pnpm deploy:all:<env> --only all`.
- **Registry:** a row in [`scripts/lib/apps.mjs`](../../../../../shared/scripts/lib/apps.mjs); full deploy model →
  [`code/docs/shared/architecture/platform-deploy.md`](../../../../../docs/shared/architecture/platform-deploy.md).

**Rules:** compose bricks (native layer); **no cross-app imports**; no `next/*` or DOM; follow
[`.claude/rules/accessibility.md`](rules/accessibility.md) (roles + labels on every touchable,
`title` = heading, 44 pt targets, dynamic type on). This is the day the `src/native/` layers earn their
keep — build them here, mirroring the web domain folders.
