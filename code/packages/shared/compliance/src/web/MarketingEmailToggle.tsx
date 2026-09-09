"use client";

import { useCallback, useEffect, useState } from "react";
import { Switch } from "@indiecrafts/packages-web-ui/web/switch";

export interface MarketingEmailToggleProps {
  /** The api origin (e.g. NEXT_PUBLIC_API_URL). Empty → the toggle renders nothing. */
  apiUrl: string;
  /** A fresh Clerk session token for the authenticated api calls (injected — the brick
   *  stays @clerk-free). */
  getToken: () => Promise<string | null>;
  /** The localized row label (e.g. "Commercial emails"). */
  label: string;
  /** The calling surface, recorded on the consent proof row. */
  surface: string;
  onSaved?: () => void;
}

/**
 * The account-settings toggle for the commercial-email opt-in. Reads the current value
 * from `GET /v1/consent/marketing-email` and writes each change with `POST` — the api
 * records the proof, updates `user_profiles.marketing_email`, and syncs the Resend
 * audience. Server-backed (distinct from the localStorage cookie categories in the same
 * tab). Optimistic; reverts on a failed write.
 */
export function MarketingEmailToggle({
  apiUrl,
  getToken,
  label,
  surface,
  onSaved,
}: MarketingEmailToggleProps) {
  const [ready, setReady] = useState(false);
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!apiUrl) return;
    let alive = true;
    void (async () => {
      try {
        const token = await getToken();
        if (token) {
          const res = await fetch(`${apiUrl}/v1/consent/marketing-email`, {
            headers: { authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = (await res.json()) as {
              marketing_email: boolean | null;
            };
            if (alive) setOn(data.marketing_email === true);
          }
        }
      } catch {
        // Leave the default (off); a failed read must not break the account page.
      }
      if (alive) setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [apiUrl, getToken]);

  const change = useCallback(
    async (next: boolean) => {
      if (busy) return;
      setBusy(true);
      setOn(next); // optimistic
      try {
        const token = await getToken();
        const res = await fetch(`${apiUrl}/v1/consent/marketing-email`, {
          method: "POST",
          headers: {
            authorization: `Bearer ${token ?? ""}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({ granted: next, surface }),
        });
        if (!res.ok) throw new Error(`consent ${res.status}`);
        onSaved?.();
      } catch (error) {
        setOn(!next); // revert — the change did not persist
        console.error("marketing-email toggle save failed", error);
      } finally {
        setBusy(false);
      }
    },
    [apiUrl, busy, getToken, onSaved, surface],
  );

  if (!apiUrl) return null;
  return (
    <label className="flex items-center justify-between gap-4 text-sm">
      <span>{label}</span>
      <Switch
        checked={on}
        disabled={!ready || busy}
        onCheckedChange={(v) => void change(v === true)}
        aria-label={label}
      />
    </label>
  );
}
