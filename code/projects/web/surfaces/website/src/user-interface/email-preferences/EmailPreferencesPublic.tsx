"use client";

import { useMemo } from "react";
import {
  EmailPreferences,
  type EmailPreferencesCopy,
  type EmailPreferencesData,
  type EmailPreferencesUpdate,
} from "@/user-interface/account/EmailPreferences";

/**
 * The public token mount for the email preference centre — no login. Reads/writes
 * against the token route `GET/POST /v1/email-preferences?token=…`. `token` is opaque
 * (from the URL) — sent only in the query/body, never rendered.
 */
export function EmailPreferencesPublic({
  apiUrl,
  token,
  chrome,
}: {
  apiUrl: string;
  token: string;
  chrome: EmailPreferencesCopy;
}) {
  const io = useMemo(
    () => ({
      read: async (): Promise<EmailPreferencesData> => {
        const res = await fetch(
          `${apiUrl}/v1/email-preferences?token=${encodeURIComponent(token)}`,
        );
        if (!res.ok) throw new Error(`email-preferences ${res.status}`);
        return (await res.json()) as EmailPreferencesData;
      },
      write: async (updates: EmailPreferencesUpdate[]): Promise<void> => {
        const res = await fetch(`${apiUrl}/v1/email-preferences`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token, updates }),
        });
        if (!res.ok) throw new Error(`email-preferences ${res.status}`);
      },
    }),
    [apiUrl, token],
  );

  return <EmailPreferences read={io.read} write={io.write} chrome={chrome} />;
}
