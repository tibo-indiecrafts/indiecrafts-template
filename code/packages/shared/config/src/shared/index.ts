/**
 * `@indiecrafts/config/shared` — the PLATFORM-AGNOSTIC config core.
 *
 * Pure TypeScript, zero web-runtime coupling (no `next`, no DOM, no
 * `NEXT_PUBLIC_` env): locales + routing helpers, `Intl` format defaults, and
 * the shared types. Safe to import from ANY platform — web, mobile (Expo/RN),
 * or hybrid (Electron). The web-only primitives live in `../web`.
 */

// ── Values + functions ───────────────────────────────────────
export {
  i18n,
  locales,
  defaultLocale,
  localeCodes,
  localeMap,
  localePrefix,
  localizedPathname,
  localeDir,
  isLocale,
} from "./i18n";
export { formatDefaults, localeFormat } from "./format";

// ── Public types ─────────────────────────────────────────────
export type {
  Locale,
  ThemeName,
  ThemeMode,
  FontKey,
  FontRoles,
  Environment,
  LogLevel,
} from "./types";
