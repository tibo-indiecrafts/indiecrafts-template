"use client";

/**
 * Fire one session-log ping per Clerk session.
 *
 * @see docs/reference/packages/web/auth/src/session-logger.md
 */

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

/**
 * Fires ONE session-log ping per Clerk session (deduped in `sessionStorage`) to the
 * app's same-origin `/api/session-log` route — which forwards it to the audit api
 * server-side, so the `APP_API_TOKEN` never reaches the browser. Mount once, app-wide,
 * under `<ClerkProvider>`. Renders nothing.
 */
export function SessionLogger({ surface }: { surface: string }) {
  const { isSignedIn, sessionId } = useAuth();
  useEffect(() => {
    if (!isSignedIn || !sessionId) return;
    const key = `session-logged:${sessionId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      return; // storage unavailable → skip (don't spam on every load)
    }
    void fetch("/api/session-log", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ surface }),
    });
  }, [isSignedIn, sessionId, surface]);
  return null;
}
