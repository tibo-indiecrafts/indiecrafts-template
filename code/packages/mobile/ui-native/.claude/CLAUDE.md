# @indiecrafts/packages-mobile-ui-native — React Native design system

Auto-loads under `code/packages/mobile/ui-native/**`. The shadcn-for-React-Native brick: StyleSheet
components over the **same** `ui-tokens` as web, so native and web share one palette. Consumed by the
**mobile (Expo) app only** — RN-only, it cannot render on web/server. Area rules →
`../../../.claude/CLAUDE.md`.

**Stack:** React Native (Expo) · `StyleSheet` · `packages-shared-ui-tokens`. Peer `react` / `react-native`.

- **Exports:** `.` → theme runtime + shell components (`Screen` · `ThemedText` · `Button` · `Card`);
  `./theme` → the theme runtime alone (`ThemeProvider` · `useTheme` · `useColor`).
- **Never hard-code a colour** — read tokens via `useColor(token)` over `ui-tokens/native`;
  `pnpm tokens:build` regenerates them.
- **Keep the a11y baseline the primitives ship** — 44 pt targets, roles, dynamic type stay on; full
  rule → the mobile app's `.claude/rules/accessibility.md`.
- **Separate from web `ui`** (DOM-only) — a parallel set; the shared token layer is the only overlap.

Full reference → [`code/docs/packages/ui-native.md`](../../../../docs/packages/ui-native.md).
