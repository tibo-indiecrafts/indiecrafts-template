/**
 * Never-throw persistence for the mobile app's own PREFS, over `AsyncStorage`.
 * AsyncStorage rejects when the device store is full, disabled, or corrupt; every
 * caller would otherwise repeat the same try/catch, so it lives once here. A failed
 * read returns `null`; a failed write is swallowed (a pref that does not persist is
 * not fatal). Keys come from `STORAGE_KEYS` (`@/config`) — never inline strings.
 *
 * SCOPE: non-secret prefs. A runtime SESSION TOKEN — once the reserved `auth` brick
 * lands — belongs in `expo-secure-store` (OS keychain), not here; add a `secureStorage`
 * sibling with this same shape then. Today's api bearer is a build-time bundle GATE
 * (`EXPO_PUBLIC_API_TOKEN`), not a runtime secret, so it stays in env — encrypting a
 * value that already ships inside the bundle is theater, not security.
 *
 * The compliance consent/legal records use the brick's own `createNativeStore` (a
 * package can never import the app); they share only the KEY, via `STORAGE_KEYS`.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  /** The stored string for `key`, or `null` if absent or the store is unavailable. */
  async get(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  /** Persist `value` under `key`. A store failure is swallowed — the write just won't stick. */
  async set(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // Store full/disabled — not fatal; the value simply won't persist.
    }
  },
};
