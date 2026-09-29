"use client";

/**
 * Create the consent and legal stores and a subscription hook.
 *
 * @see docs/reference/projects/web/app/src/user-interface/overlays/stores.md
 */
import { useEffect, useState, useSyncExternalStore } from "react";
import { createWebStore } from "@indiecrafts/packages-shared-compliance/web";
import {
  fetchLegalVersion,
  type Store,
  type ConsentRecord,
  type LegalAcceptanceRecord,
} from "@indiecrafts/packages-shared-compliance/shared";
import { site, policyVersion } from "@/config";

// The two persisted records, namespaced per deployment (`site.prefix`). Shared by the
// ConsentGate + LegalGate overlays (the legal gate reads the consent record to suppress
// itself while the consent banner is up).
export const consentStore = createWebStore<ConsentRecord>(
  `${site.prefix}.cookie-consent`,
);
export const legalStore = createWebStore<LegalAcceptanceRecord>(
  `${site.prefix}.legal-ack`,
);

/** Subscribe to a store. `undefined` = not read yet (the server render + hydration):
 *  callers render nothing then, so the server HTML never holds a banner the stored
 *  record would hide — React 19 keeps such stale server DOM on screen. `null` = no record. */
export function useRecord<T>(store: Store<T>): T | null | undefined {
  return useSyncExternalStore(store.subscribe, store.get, () => undefined);
}

/** The effective legal version — the website's live version (one Sanity bump re-prompts
 *  every surface), else the static `policyVersion` when the fetch fails. `null` until the
 *  fetch settles: an Accept before then would record the fallback, and the banner would
 *  come back on the next load. */
export function useEffectiveLegalVersion(): string | null {
  const [version, setVersion] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    void fetchLegalVersion(site.websiteUrl).then((v) => {
      if (alive) setVersion(v || policyVersion);
    });
    return () => {
      alive = false;
    };
  }, []);
  return version;
}
