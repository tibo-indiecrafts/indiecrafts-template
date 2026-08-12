"use client";

import type { ReactNode } from "react";
import { useConsent } from "@/hooks/useConsent";

/**
 * Render children only while the visitor has granted `category` (a consent
 * category `key`, e.g. "marketing"). Re-renders on consent change, so children
 * mount on accept and unmount on withdrawal. The canonical slot for a cookie-
 * setting pixel, embed, or widget that isn't Consent-Mode-aware.
 *
 *   <ConsentGate category="marketing"><MetaPixel /></ConsentGate>
 */
export function ConsentGate({
  category,
  children,
}: {
  category: string;
  children: ReactNode;
}) {
  const { has } = useConsent();
  return has(category) ? <>{children}</> : null;
}
