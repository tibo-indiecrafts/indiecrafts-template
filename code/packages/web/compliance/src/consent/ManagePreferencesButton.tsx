"use client";

/**
 * Renders a button that opens the cookie preferences dialog.
 *
 * @see docs/reference/packages/web/compliance/src/consent/ManagePreferencesButton.md
 */

import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { openPreferences } from "./consent-store";

/** Opens the cookie preferences dialog (mounted with the banner). */
export function ManagePreferencesButton({ label }: { label: string }) {
  return (
    <Button variant="outline" size="sm" onClick={openPreferences}>
      {label}
    </Button>
  );
}
