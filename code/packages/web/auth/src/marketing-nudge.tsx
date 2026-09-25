"use client";

/**
 * Mount the one-time sign-in marketing-email consent nudge.
 *
 * @see docs/reference/packages/web/auth/src/marketing-nudge.md
 */

import { useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  MarketingNudge,
  type MarketingNudgeCopy,
} from "@indiecrafts/packages-shared-compliance/web";

/**
 * The website/app mount for the one-time sign-in marketing nudge. Supplies Clerk's
 * `getToken` (via direct api `fetch`) and gates on `isSignedIn` (the brick stays
 * @clerk-free). Render it inside `AppClerkProvider`, passing copy resolved by the
 * surface (server `getTranslations`).
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

  const io = useMemo(
    () => ({
      read: async (): Promise<boolean | null> => {
        const token = await getToken();
        if (!token) throw new Error("no token"); // never falsely show the nudge
        const res = await fetch(`${apiUrl}/v1/consent/marketing-email`, {
          headers: { authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`consent ${res.status}`);
        const data = (await res.json()) as { marketing_email: boolean | null };
        return data.marketing_email;
      },
      write: async (granted: boolean): Promise<void> => {
        const token = await getToken();
        const res = await fetch(`${apiUrl}/v1/consent/marketing-email`, {
          method: "POST",
          headers: {
            authorization: `Bearer ${token ?? ""}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({ granted, surface }),
        });
        if (!res.ok) throw new Error(`consent ${res.status}`);
      },
    }),
    [apiUrl, getToken, surface],
  );

  if (!isSignedIn || !apiUrl) return null;
  return (
    <MarketingNudge
      read={io.read}
      write={io.write}
      snoozeKey={snoozeKey}
      copy={copy}
    />
  );
}
