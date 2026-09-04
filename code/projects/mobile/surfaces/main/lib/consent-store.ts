import { createNativeStore } from "@indiecrafts/packages-shared-compliance/native";
import type { ConsentRecord } from "@indiecrafts/packages-shared-compliance/shared";
import { STORAGE_KEYS } from "@/config";

/**
 * THE single `consentStore` instance for `STORAGE_KEYS.cookieConsent`. Unlike the web
 * `createWebStore` (re-reads `localStorage` + a shared `window` event on every
 * get()/save(), so separate instances stay in sync), `createNativeStore` is a plain
 * in-memory closure — two instances for the same key do NOT see each other's saves
 * within a session. So every consumer (`ShellOverlays`, `app/account.tsx`) imports
 * this one instance rather than creating its own.
 */
export const consentStore = createNativeStore<ConsentRecord>(
  STORAGE_KEYS.cookieConsent,
);
