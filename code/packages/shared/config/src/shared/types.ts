/**
 * Config TYPES only — no data, no functions, no `process.env`. The matching data
 * + helpers live in the per-concern modules (`./site`, `./i18n`, `./pages`, …),
 * all re-exported through `./index`.
 *
 * `Locale` is derived from the `i18n.locales` data via a **type-only** import
 * (erased at runtime, so the `types ↔ i18n` cycle is types-only and safe).
 * Adding a locale: append a row to `locales` in `./i18n` — this union follows.
 */

import type { i18n } from "./i18n";

// ── Locales ──────────────────────────────────────────────────

/** One registered language (a row in `i18n.locales`). */
export type LocaleConfig = {
  /** BCP-47 code. Doubles as the URL prefix for non-default locales (`/fr/…`). */
  code: string;
  /** Native language name — shown in the locale-switcher menu. */
  label: string;
  /** Short badge (2 letters) — shown on the switcher trigger. */
  abbr: string;
  /** Text direction. Drives `<html dir>`; set `"rtl"` for Arabic/Hebrew/etc. */
  dir: "ltr" | "rtl";
  // ── Formatting rules (consumed by @indiecrafts/packages-shared-format) ──────
  /** BCP-47 tag for `Intl` (money/number/date). Defaults to `code` when unset (e.g. `fr` → `fr`). */
  numberLocale?: string;
  /** Default currency for money in this locale (ISO 4217, e.g. `"EUR"`). Falls back to `formatDefaults.currency`. */
  currency?: string;
  /** Title-Case inline labels (`true` EN/DE) vs sentence-case (`false` FR). Drives `capitalize`. */
  capitalizeInlineNouns?: boolean;
  /** Adjective BEFORE the noun (`true` EN/DE: "custom product") vs after (`false` FR: "produit personnalisé"). */
  adjBeforeNoun?: boolean;
};

/** Union of registered locale codes — derived from the `i18n.locales` data. */
export type Locale = (typeof i18n.locales)[number]["code"];

// ── Theme ────────────────────────────────────────────────────

/** A concrete, paintable theme. */
export type ThemeName = "light" | "dark";

/** A theme option offered in the toggle. "System" (follow-OS) is the default auto-detect behaviour, not a selectable mode. */
export type ThemeMode = ThemeName;

// ── Fonts ────────────────────────────────────────────────────

/**
 * Registry keys for the fonts wired up in `@/lib/fonts`. `next/font` needs
 * its loader calls to be static literals, so fonts are registered there and
 * `config.fonts` selects among them by key. Adding a font = one key here +
 * one `next/font` call in the registry.
 */
export type FontKey = "geist" | "geist-mono" | "satoshi";

/** The active pairing — one registered font per role. */
export type FontRoles = {
  /** Headings. Drives `--font-display`; set equal to `body` for one face. */
  display: FontKey;
  /** Body + UI default. Drives `--font-sans`. */
  body: FontKey;
  /** Code / tabular figures. Drives `--font-mono`. */
  mono: FontKey;
};

// ── Environment ──────────────────────────────────────────────

export type Environment = "development" | "test" | "staging" | "production";

// ── Logging ──────────────────────────────────────────────────

/** Log severities, low → high; `silent` gates everything off. Consumed by `@indiecrafts/packages-shared-logger`. */
export type LogLevel =
  "trace" | "debug" | "info" | "warn" | "error" | "fatal" | "silent";

/** The `logging` config shape — DATA only; the resolution logic lives in `@indiecrafts/packages-shared-logger`. */
export type LoggingConfig = {
  /** Minimum console level per environment. `"silent"` = no console output at all. */
  levels: Record<Environment, LogLevel>;
  /** Context keys whose values are replaced with `"[REDACTED]"` (case-insensitive match). */
  redactKeys: readonly string[];
};
