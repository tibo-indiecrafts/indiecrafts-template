"use client";

import { useOnlineStatus } from "./useOnlineStatus";

/**
 * A slim, non-blocking strip shown while the browser is offline (auto-hides on
 * reconnect via the `online` event). Copy is injected (`message`). `role="status"` +
 * `aria-live="polite"` so a screen reader announces the change without stealing focus.
 * Shared by the website, the `app` surface, and the Electron renderer (all DOM).
 */
export function OfflineBanner({ message }: { message: string }) {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-secondary text-secondary-foreground px-[var(--gutter,1rem)] py-2 text-center text-sm"
    >
      {message}
    </div>
  );
}
