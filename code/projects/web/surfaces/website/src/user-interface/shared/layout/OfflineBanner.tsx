"use client";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";

/**
 * A slim, non-blocking strip shown while the browser is offline (auto-hides on
 * reconnect via the `online` event). Copy is resolved server-side and passed in
 * (`messages.offline.banner`). `role="status"` + `aria-live="polite"` so a screen
 * reader announces the connectivity change without stealing focus.
 */
export function OfflineBanner({ message }: { message: string }) {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-secondary text-secondary-foreground px-(--gutter) py-2 text-center text-sm"
    >
      {message}
    </div>
  );
}
