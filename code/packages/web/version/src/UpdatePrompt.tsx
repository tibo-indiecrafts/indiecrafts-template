"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@indiecrafts/utils/cn";
import { Button } from "@indiecrafts/ui/web/button";
import { useVersionCheck } from "./use-version-check";

/**
 * "A new version is available" banner. Self-contained — no `<Toaster>` needed:
 * fixed bottom, token-styled, `role="status"` + `aria-live`. Copy is passed in
 * (i18n-agnostic, like the status pages). Two update paths: the **Reload** button,
 * and — the safe one — an **automatic reload on the next navigation** (a natural
 * break, no unsaved-input risk). Never a forced/surprise reload.
 */
export function UpdatePrompt({
  current,
  endpoint,
  intervalMs,
  message,
  reloadLabel,
  dismissLabel,
  reloadOnNavigate = true,
}: {
  /** The build id baked into this bundle — e.g. `buildInfo.commit`. */
  current: string;
  /** Version endpoint returning the live deploy's `{ commit }`. Default `/api/version`. */
  endpoint?: string;
  intervalMs?: number;
  message: string;
  reloadLabel: string;
  dismissLabel: string;
  reloadOnNavigate?: boolean;
}) {
  const { updateAvailable } = useVersionCheck({
    current,
    endpoint,
    intervalMs,
  });
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  // Reload on the NEXT navigation once an update is pending — a safe break.
  const availRef = useRef(updateAvailable);
  availRef.current = updateAvailable;
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reloadOnNavigate && availRef.current && typeof window !== "undefined") {
      window.location.reload();
    }
  }, [pathname, reloadOnNavigate]);

  if (!updateAvailable || dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "bg-card text-foreground ring-border/60 fixed right-4 bottom-4 left-4 z-50",
        "mx-auto flex w-auto max-w-md items-center justify-between gap-3 rounded-xl",
        "border-0 p-3 shadow-lg ring-1 backdrop-blur",
      )}
    >
      <p className="text-sm">{message}</p>
      <div className="flex shrink-0 gap-2">
        <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
          {dismissLabel}
        </Button>
        <Button
          size="sm"
          onClick={() =>
            typeof window !== "undefined" && window.location.reload()
          }
        >
          {reloadLabel}
        </Button>
      </div>
    </div>
  );
}
