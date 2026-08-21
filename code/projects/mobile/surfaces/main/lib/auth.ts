/**
 * Mobile Clerk config — the publishable key + the token cache. Auth is OPT-IN: with
 * no `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` the app runs exactly as before (the provider
 * is not mounted). The token cache stores the session on `expo-secure-store` (OS
 * keychain), never AsyncStorage — see `@/lib/secure-storage`.
 */
import { secureStorage } from "@/lib/secure-storage";

export const CLERK_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

/** Auth is wired only when the (public) publishable key is set. */
export const hasClerk = CLERK_PUBLISHABLE_KEY.length > 0;

/** Clerk's `tokenCache` contract, backed by the OS keychain. */
export const tokenCache = {
  getToken: (key: string) => secureStorage.get(key),
  saveToken: (key: string, value: string) => secureStorage.set(key, value),
  clearToken: (key: string) => secureStorage.remove(key),
};
