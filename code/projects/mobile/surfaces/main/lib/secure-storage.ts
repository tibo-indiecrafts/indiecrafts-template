/**
 * Never-throw SECRET persistence over `expo-secure-store` (OS Keychain / Keystore) —
 * the secure sibling of `@/lib/storage` (AsyncStorage, for non-secret prefs). Runtime
 * credentials (the Clerk session + refresh tokens) live here, encrypted at rest, NOT
 * in AsyncStorage (plaintext + rides device backups). Same never-throw shape as
 * `storage`: a failed read → `null`, a failed write/delete is swallowed.
 */
import * as SecureStore from "expo-secure-store";

export const secureStorage = {
  /** The stored string for `key`, or `null` if absent or the keystore is unavailable. */
  async get(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  /** Persist `value` under `key`. A keystore failure is swallowed — Clerk re-authenticates. */
  async set(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Keystore unavailable — not fatal; the session simply won't persist.
    }
  },
  /** Remove `key`. A failure is swallowed. */
  async remove(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // ignore
    }
  },
};
