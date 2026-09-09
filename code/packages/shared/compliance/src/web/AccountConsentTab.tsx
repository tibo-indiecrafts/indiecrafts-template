"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { rejectAllChoices, type ConsentRecord } from "../shared/consent";
import type { ConsentCategory } from "../shared/consent-signals";
import { ConsentPreferences } from "./ConsentPreferences";
import { createWebStore } from "./store";

export interface AccountConsentTabProps {
  /** localStorage key — the SAME one the banner/gate use (`${site.prefix}.cookie-consent`). */
  storageKey: string;
  /** Current policy version, stamped on the saved record. */
  version: string;
  /** Categories already resolved with localized copy by the surface. */
  categories: readonly ConsentCategory[];
  title: string;
  saveLabel: string;
  /** Called after a successful save — e.g. the surface shows a toast. */
  onSaved?: () => void;
}

/**
 * The "Privacy & consent" account page — re-open and change cookie-consent choices.
 * Writes the SAME `localStorage` record the banner/gate read (shared `storageKey` +
 * change event), so a save here is picked up everywhere. Clerk-free; copy + categories
 * + version are injected (no i18n dep). Mirrors the app's former `CookiePreferencesSection`.
 */
export function AccountConsentTab({
  storageKey,
  version,
  categories,
  title,
  saveLabel,
  onSaved,
}: AccountConsentTabProps) {
  const store = useMemo(
    () => createWebStore<ConsentRecord>(storageKey),
    [storageKey],
  );
  // Client-only store — null during SSR/hydration, corrected by useSyncExternalStore.
  const record = useSyncExternalStore(store.subscribe, store.get, () => null);
  const [choices, setChoices] = useState<Record<string, boolean>>(() =>
    rejectAllChoices(categories),
  );
  useEffect(() => {
    if (record) setChoices(record.choices);
  }, [record]);

  function handleSave() {
    store.save({ v: version, t: Date.now(), choices });
    onSaved?.();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      <ConsentPreferences
        categories={categories}
        choices={choices}
        onChange={(key, value) => setChoices((c) => ({ ...c, [key]: value }))}
      />
      <Button onClick={handleSave}>{saveLabel}</Button>
    </div>
  );
}
