/**
 * Web `Store` adapter — `localStorage`-backed, synchronous, for the plain-React shells
 * (the `app` web surface). Serves both
 * the consent record and the legal-acceptance record (each under its own `storageKey`,
 * namespaced by `${site.prefix}`). The website keeps its own richer store
 * (`@indiecrafts/packages-web-compliance`); this is the minimal one the shared UI needs.
 */

import type { Store } from "../shared/consent";

export function createWebStore<T>(storageKey: string): Store<T> {
  // A per-key change event so a same-document `save` re-notifies subscribers
  // (the `storage` event only fires across tabs, not in the writing tab).
  const changeEvent = `store-change:${storageKey}`;
  // Cache the parsed record so `get()` returns a STABLE reference until the raw
  // string changes — required for `useSyncExternalStore`.
  let cachedRaw: string | null = null;
  let cachedRecord: T | null = null;

  return {
    get() {
      if (typeof window === "undefined") return null;
      const raw = localStorage.getItem(storageKey);
      if (raw === cachedRaw) return cachedRecord;
      cachedRaw = raw;
      try {
        cachedRecord = raw ? (JSON.parse(raw) as T) : null;
      } catch {
        cachedRecord = null;
      }
      return cachedRecord;
    },
    save(record) {
      localStorage.setItem(storageKey, JSON.stringify(record));
      window.dispatchEvent(new Event(changeEvent));
    },
    subscribe(cb) {
      if (typeof window === "undefined") return () => {};
      window.addEventListener("storage", cb);
      window.addEventListener(changeEvent, cb);
      return () => {
        window.removeEventListener("storage", cb);
        window.removeEventListener(changeEvent, cb);
      };
    },
  };
}
