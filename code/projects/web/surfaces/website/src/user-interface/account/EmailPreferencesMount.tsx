"use client";

/**
 * Mounts the email preference centre for a signed-in account.
 *
 * @see docs/reference/projects/web/website/src/user-interface/account/EmailPreferencesMount.md
 */

import { useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  EmailPreferences,
  type EmailPreferencesCopy,
  type EmailPreferencesData,
  type EmailPreferencesUpdate,
} from "./EmailPreferences";

/**
 * The website account-page mount for the email preference centre. Supplies Clerk's
 * `getToken` via a direct api `fetch` (mirrors `MarketingNudgeMount`) against the
 * JWT route `GET/POST /v1/consent/email-preferences`. Gates on `isSignedIn` + a
 * configured api origin.
 */
export function EmailPreferencesMount({
  apiUrl,
  chrome,
}: {
  apiUrl: string;
  chrome: EmailPreferencesCopy;
}) {
  const { isSignedIn, getToken } = useAuth();

  const io = useMemo(
    () => ({
      read: async (): Promise<EmailPreferencesData> => {
        const token = await getToken();
        if (!token) throw new Error("no token"); // never falsely show empty preferences
        const res = await fetch(`${apiUrl}/v1/consent/email-preferences`, {
          headers: { authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`email-preferences ${res.status}`);
        return (await res.json()) as EmailPreferencesData;
      },
      write: async (updates: EmailPreferencesUpdate[]): Promise<void> => {
        const token = await getToken();
        const res = await fetch(`${apiUrl}/v1/consent/email-preferences`, {
          method: "POST",
          headers: {
            authorization: `Bearer ${token ?? ""}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({ updates, surface: "website" }),
        });
        if (!res.ok) throw new Error(`email-preferences ${res.status}`);
      },
    }),
    [apiUrl, getToken],
  );

  if (!isSignedIn || !apiUrl) return null;
  return <EmailPreferences read={io.read} write={io.write} chrome={chrome} />;
}
