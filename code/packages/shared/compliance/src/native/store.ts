/**
 * Builds an AsyncStorage-backed consent store adapter.
 *
 * @see docs/reference/packages/shared/compliance/src/native/store.md
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Store } from "../shared/consent";

/**
 * Native `Store` adapter — `AsyncStorage`-backed. AsyncStorage is async but the
 * `Store.get()` contract is synchronous, so this keeps an in-memory mirror: hydrate
 * once at creation, serve `get()` from memory, write-through on `save()`. Serves both
 * the consent record and the legal-acceptance record (each under its own `storageKey`,
 * namespaced by `${site.prefix}`).
 *
 * ponytail: a returning visitor sees the prompt for the ~ms until AsyncStorage resolves
 * (memory starts empty). Fine — the consent banner is off by default (`requireConsent`),
 * and a sub-second flash beats blocking launch on storage. Persist a hydration flag if
 * the flash ever matters.
 */
export function createNativeStore<T>(storageKey: string): Store<T> {
  let record: T | null = null;
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((cb) => cb());

  void AsyncStorage.getItem(storageKey).then((raw) => {
    if (!raw) return;
    try {
      record = JSON.parse(raw) as T;
      notify();
    } catch {
      record = null;
    }
  });

  return {
    get: () => record,
    save(next) {
      record = next;
      notify();
      void AsyncStorage.setItem(storageKey, JSON.stringify(next));
    },
    subscribe(cb) {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
  };
}
