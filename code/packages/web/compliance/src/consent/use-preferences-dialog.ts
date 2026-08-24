"use client";

import { useEffect, useState } from "react";
import { OPEN_PREFERENCES_EVENT } from "./consent-store";

/**
 * `prefsOpen` state wired to `OPEN_PREFERENCES_EVENT` (dispatched by
 * `openPreferences()` — the footer "Manage preferences" / "Do Not Sell" links)
 * and the `?cookies=manage` query param. Shared by `CookieBanner` (which also
 * needs the flag to hide its blocking bar while the dialog is open) and
 * `CookiePreferencesHost` (the dialog mounted on its own, with no banner) so
 * the listener lives in one place.
 */
export function usePreferencesDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openDialog = () => setOpen(true);
    if (new URLSearchParams(window.location.search).get("cookies") === "manage")
      openDialog();
    window.addEventListener(OPEN_PREFERENCES_EVENT, openDialog);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, openDialog);
  }, []);

  return [open, setOpen] as const;
}
