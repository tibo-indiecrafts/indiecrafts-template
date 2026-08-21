"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type VersionResponse,
  versionId,
  isUpdateAvailable,
} from "@indiecrafts/packages-shared-version";

// Re-export the portable compare so web consumers have one import surface.
export { isUpdateAvailable } from "@indiecrafts/packages-shared-version";

/**
 * Polls a version endpoint and reports when the **deployed** build differs from
 * the one this bundle was built with — i.e. a new version shipped while the tab
 * was open.
 *
 * No service worker (the app is OpenNext/Cloudflare), so detection is a small
 * `no-store` poll: on mount, on a gentle interval, and — the real trigger — every
 * time the tab regains focus or the network comes back (people leave tabs open for
 * days). `current` is the id baked into this bundle (e.g. `buildInfo.commit`); the
 * endpoint returns the **live** deploy's id, so an old tab sees the mismatch.
 */
export function useVersionCheck({
  current,
  endpoint = "/api/version",
  intervalMs = 15 * 60 * 1000,
}: {
  current: string;
  endpoint?: string;
  intervalMs?: number;
}): { updateAvailable: boolean; latest: string | null } {
  const [latest, setLatest] = useState<string | null>(null);

  const check = useCallback(async () => {
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as VersionResponse;
      const id = versionId(data);
      if (id) setLatest(id);
    } catch {
      // Network blip — ignore; the next interval / focus retries.
    }
  }, [endpoint]);

  useEffect(() => {
    if (!current) return;
    void check();
    const iv = setInterval(() => void check(), intervalMs);
    const onVisible = () => {
      if (document.visibilityState === "visible") void check();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", () => void check());
    return () => {
      clearInterval(iv);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [check, intervalMs, current]);

  return { updateAvailable: isUpdateAvailable(current, latest), latest };
}
