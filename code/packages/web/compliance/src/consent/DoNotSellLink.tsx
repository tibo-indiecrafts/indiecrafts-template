"use client";

import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { openPreferences } from "./consent-store";

type Props = {
  label: string;
  /** Resolved server-side (`resolveConsentMode(...) === "opt-out"`, e.g. a US/CCPA
   *  visitor) so the link never flashes into view for other regions. */
  show: boolean;
};

/**
 * CCPA/CPRA "Do Not Sell or Share My Personal Information" footer link. Opens the
 * same preferences dialog as `ManagePreferencesButton` (`openPreferences()`) — no
 * new consent UI, just a CCPA-labeled entry point shown only in opt-out regions.
 */
export function DoNotSellLink({ label, show }: Props) {
  if (!show) return null;
  return (
    <Button
      variant="link"
      size="sm"
      className="text-muted-foreground hover:text-foreground h-auto p-0"
      onClick={openPreferences}
    >
      {label}
    </Button>
  );
}
