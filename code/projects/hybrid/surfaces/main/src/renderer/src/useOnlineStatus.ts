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
 * `true` while the renderer reports a network connection (`navigator.onLine` +
 * `online`/`offline` events). `useSyncExternalStore` for a tear-free read. Twin of the
 * website's `src/hooks/useOnlineStatus.ts` — identical DOM logic; kept app-local because
 * the one shared DOM-hook home (`packages-web-ui`) is shadcn-CLI-managed. Extract to a
 * shared brick if a third DOM consumer appears.
 */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}
