"use client";

/**
 * Create the consent and legal stores and a subscription hook.
 *
 * @see docs/reference/projects/web/app/src/user-interface/overlays/stores.md
 */
import { useSyncExternalStore } from "react";
import { createWebStore } from "@indiecrafts/packages-shared-compliance/web";
import type {
  Store,
  ConsentRecord,
  LegalAcceptanceRecord,
} from "@indiecrafts/packages-shared-compliance/shared";
import { site } from "@/config";

// The two persisted records, namespaced per deployment (`site.prefix`). Shared by the
// ConsentGate + LegalGate overlays (the legal gate reads the consent record to suppress
// itself while the consent banner is up).
export const consentStore = createWebStore<ConsentRecord>(
  `${site.prefix}.cookie-consent`,
);
export const legalStore = createWebStore<LegalAcceptanceRecord>(
  `${site.prefix}.legal-ack`,
);

/** Subscribe to a store, hydration-safely (server snapshot = the store's own `get`). */
export function useRecord<T>(store: Store<T>): T | null {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}
