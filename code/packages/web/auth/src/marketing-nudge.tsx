"use client";

import { useAuth } from "@clerk/nextjs";
import {
  MarketingNudge,
  type MarketingNudgeCopy,
} from "@indiecrafts/packages-shared-compliance/web";

/**
 * The website/app mount for the one-time sign-in marketing nudge. Supplies Clerk's
 * `getToken` and gates on `isSignedIn` (the brick stays @clerk-free). Render it inside
 * `AppClerkProvider`, passing copy resolved by the surface (server `getTranslations`).
 */
export function MarketingNudgeMount({
  apiUrl,
  surface,
  snoozeKey,
  copy,
}: {
  apiUrl: string;
  surface: string;
  snoozeKey: string;
  copy: MarketingNudgeCopy;
}) {
  const { isSignedIn, getToken } = useAuth();
  if (!isSignedIn) return null;
  return (
    <MarketingNudge
      apiUrl={apiUrl}
      getToken={() => getToken()}
      surface={surface}
      snoozeKey={snoozeKey}
      copy={copy}
    />
  );
}
