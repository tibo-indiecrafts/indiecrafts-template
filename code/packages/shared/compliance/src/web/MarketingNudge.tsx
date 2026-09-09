"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@indiecrafts/packages-web-ui/web/button";

export interface MarketingNudgeCopy {
  title: string;
  yes: string;
  no: string;
  dismiss: string;
}

export interface MarketingNudgeProps {
  apiUrl: string;
  getToken: () => Promise<string | null>;
  surface: string;
  /** localStorage key for the per-device snooze (× dismiss). */
  snoozeKey: string;
  copy: MarketingNudgeCopy;
}

/**
 * A one-time post-sign-in prompt for the commercial-email opt-in, shown only when the
 * user has NO decision on record (`GET /v1/consent/marketing-email` → null) — i.e. a
 * pre-existing account, or a social sign-up that bypassed the sign-up checkbox. `[Yes]`/
 * `[No]` record a decision (the flag flips non-null → never shown again); `[×]` snoozes
 * per-device via localStorage. The surface mounts this only for a signed-in user.
 */
export function MarketingNudge({
  apiUrl,
  getToken,
  surface,
  snoozeKey,
  copy,
}: MarketingNudgeProps) {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!apiUrl) return;
    try {
      if (localStorage.getItem(snoozeKey)) return;
    } catch {
      // localStorage unavailable → treat as not snoozed.
    }
    let alive = true;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await fetch(`${apiUrl}/v1/consent/marketing-email`, {
          headers: { authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = (await res.json()) as {
            marketing_email: boolean | null;
          };
          if (alive && data.marketing_email === null) setShow(true);
        }
      } catch {
        // A failed read never shows the nudge.
      }
    })();
    return () => {
      alive = false;
    };
  }, [apiUrl, getToken, snoozeKey]);

  const decide = useCallback(
    async (granted: boolean) => {
      if (busy) return;
      setBusy(true);
      try {
        const token = await getToken();
        await fetch(`${apiUrl}/v1/consent/marketing-email`, {
          method: "POST",
          headers: {
            authorization: `Bearer ${token ?? ""}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({ granted, surface }),
        });
      } catch (error) {
        console.error("marketing nudge save failed", error);
      } finally {
        setShow(false); // decided → the flag is non-null now, so it never returns
        setBusy(false);
      }
    },
    [apiUrl, busy, getToken, surface],
  );

  const snooze = useCallback(() => {
    try {
      localStorage.setItem(snoozeKey, "1");
    } catch {
      // best-effort; without storage it re-appears next load, which is acceptable
    }
    setShow(false);
  }, [snoozeKey]);

  if (!show) return null;
  return (
    <div
      role="dialog"
      aria-label={copy.title}
      className="bg-card text-card-foreground fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md flex-col gap-3 rounded-lg border p-4 shadow-lg sm:inset-x-auto sm:right-4 sm:left-auto"
    >
      <p className="text-sm">{copy.title}</p>
      <div className="flex items-center gap-2">
        <Button size="sm" disabled={busy} onClick={() => void decide(true)}>
          {copy.yes}
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={() => void decide(false)}
        >
          {copy.no}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={busy}
          onClick={snooze}
          aria-label={copy.dismiss}
          className="ml-auto"
        >
          ✕
        </Button>
      </div>
    </div>
  );
}
