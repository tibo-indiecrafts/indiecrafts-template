/**
 * App-level theme preference — a persisted `"light" | "dark" | "system"` choice that
 * wraps the design-system `ThemeProvider`. `"system"` (the default) follows the OS
 * scheme via `useColorScheme`; `"light"`/`"dark"` force one and override the OS.
 *
 * The pure logic (validation + name resolution) lives in `./theme-resolve` (RN-free,
 * unit-tested). Persistence lives here in the app — never in the `ui-native` brick (a
 * package can't depend on the app's storage) — over the never-throw `@/lib/storage`
 * (AsyncStorage), keyed by `STORAGE_KEYS.themePreference`. Mirrors the locale-choice
 * pattern in `app/_layout.tsx`.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ThemeProvider } from "@indiecrafts/packages-mobile-ui-native";
import { STORAGE_KEYS } from "@/config";
import { storage } from "@/lib/storage";
import {
  isThemePreference,
  resolveThemeName,
  THEME_PREFERENCES,
  type ThemePreference,
} from "@/lib/theme-resolve";

export { THEME_PREFERENCES, type ThemePreference };

const ThemePreferenceContext = createContext<{
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
} | null>(null);

/** Provides the theme preference + setter, and renders the resolved `ThemeProvider`.
 *  Replaces a bare `<ThemeProvider>` at the top of the app's provider tree. */
export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  // `"system"` until a stored choice is read (async) — same shape as the locale choice.
  const [preference, setStored] = useState<ThemePreference>("system");
  // A user tap can beat the async hydration read. Once the user has chosen (or the read
  // has landed), ignore a late stored value so it can't silently clobber the choice.
  const settled = useRef(false);

  useEffect(() => {
    void storage.get(STORAGE_KEYS.themePreference).then((value) => {
      if (settled.current) return;
      settled.current = true;
      if (isThemePreference(value)) setStored(value);
    });
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    settled.current = true;
    setStored(next);
    void storage.set(STORAGE_KEYS.themePreference, next);
  }, []);

  const value = useMemo(
    () => ({ preference, setPreference }),
    [preference, setPreference],
  );

  return (
    <ThemePreferenceContext.Provider value={value}>
      <ThemeProvider name={resolveThemeName(preference)}>
        {children}
      </ThemeProvider>
    </ThemePreferenceContext.Provider>
  );
}

/** The theme preference + setter. Throws outside a `ThemePreferenceProvider`. */
export function useThemePreference() {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx)
    throw new Error(
      "useThemePreference must be used inside <ThemePreferenceProvider>",
    );
  return ctx;
}
