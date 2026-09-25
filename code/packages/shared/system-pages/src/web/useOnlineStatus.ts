"use client";

/**
 * Track the browser's online/offline status.
 *
 * @see docs/reference/packages/shared/system-pages/src/web/useOnlineStatus.md
 */
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

/**
 * `true` while the browser reports a network connection, tracking the `online`/`offline`
 * events. `useSyncExternalStore` (not `useState` + `useEffect`) so it is hydration-safe:
 * the server snapshot is `true` (assume online — never flash an offline banner during SSR),
 * and the client reads the real `navigator.onLine` on hydration. `onLine` is a coarse signal
 * (a captive portal reads "online"); pair it with a failed request for certainty.
 */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}
