"use client";

import { useSyncExternalStore } from "react";
import { consentStore, openPreferences } from "@/user-interface/shared/layout/consent-store";

/**
 * Read the visitor's cookie-consent choices reactively. Re-renders when consent
 * changes (accept/reject/save, or another tab). Use it to gate features by
 * category — or reach for `<ConsentGate category="…">` for the common
 * render-when-consented case.
 *
 *   const { has, openPreferences } = useConsent();
 *   if (has("marketing")) { …load a pixel… }
 */
export function useConsent() {
  const record = useSyncExternalStore(consentStore.subscribe, consentStore.get, () => null);
  return {
    /** Per-category granted map (necessary categories are handled by the gate/consumers). */
    choices: record?.choices ?? {},
    /** Whether the visitor granted this category. */
    has: (categoryKey: string) => Boolean(record?.choices?.[categoryKey]),
    /** Whether any choice has been recorded yet. */
    decided: record !== null,
    /** Open the preferences dialog. */
    openPreferences,
  };
}
