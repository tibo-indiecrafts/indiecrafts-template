"use client";

import { useSyncExternalStore } from "react";
import type { ConsentCategory } from "./consent-signals";
import { CookiePreferences } from "./CookiePreferences";
import { consentStore } from "./consent-store";
import { usePreferencesDialog } from "./use-preferences-dialog";

type Props = {
  categories: ConsentCategory[];
  version: string;
};

const EMPTY_CHOICES: Record<string, boolean> = {};

/**
 * Mounts the preferences dialog + its `OPEN_PREFERENCES_EVENT` listener on
 * their own, with no blocking banner. `CookieBanner` already mounts this dialog
 * when `requireCookieConsent` is on — this host covers the case where it's off
 * but a visitor still needs a *working* "manage preferences" entry point, e.g. a
 * CCPA/opt-out visitor clicking the footer "Do Not Sell" link
 * (`DoNotSellLink` / `ManagePreferencesButton` both call the same
 * `openPreferences()`). See `[locale]/layout.tsx`.
 */
export function CookiePreferencesHost({ categories, version }: Props) {
  const record = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.get,
    () => null,
  );
  const [prefsOpen, setPrefsOpen] = usePreferencesDialog();

  if (categories.length === 0) return null;

  return (
    <CookiePreferences
      categories={categories}
      version={version}
      open={prefsOpen}
      onOpenChange={setPrefsOpen}
      current={record?.choices ?? EMPTY_CHOICES}
    />
  );
}
