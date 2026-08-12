"use client";

import { Button } from "@indiecrafts/ui/button";
import { openPreferences } from "./consent-store";

/** Opens the cookie preferences dialog (mounted with the banner). */
export function ManagePreferencesButton({ label }: { label: string }) {
  return (
    <Button variant="outline" size="sm" onClick={openPreferences}>
      {label}
    </Button>
  );
}
