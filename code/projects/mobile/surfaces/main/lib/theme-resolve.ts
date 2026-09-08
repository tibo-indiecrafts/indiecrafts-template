/**
 * Pure theme-preference logic — no React, no React Native, no storage. Kept apart from
 * `theme-preference.tsx` (which imports the `ui-native` `ThemeProvider`) so it is
 * unit-testable without a native host, mirroring `lib/sign-in-machine.ts`.
 */
export type ThemePreference = "light" | "dark" | "system";

export const THEME_PREFERENCES: readonly ThemePreference[] = [
  "system",
  "light",
  "dark",
];

/** True when a stored string is a valid preference — guards a corrupt or legacy value
 *  from silently forcing an invalid theme. */
export function isThemePreference(
  value: string | null,
): value is ThemePreference {
  return (
    value !== null && (THEME_PREFERENCES as readonly string[]).includes(value)
  );
}

/** The forced theme name for a preference — `undefined` for `"system"` (follow the OS,
 *  which is what the `ui-native` `ThemeProvider` does with no `name`). */
export function resolveThemeName(
  preference: ThemePreference,
): "light" | "dark" | undefined {
  return preference === "system" ? undefined : preference;
}
