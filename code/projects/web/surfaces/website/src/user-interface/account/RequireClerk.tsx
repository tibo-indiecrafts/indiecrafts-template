"use client";

/**
 * Render Clerk UI only under a loaded Clerk; reload once to get it.
 *
 * @see docs/reference/projects/web/website/src/user-interface/account/RequireClerk.md
 */
import { useEffect, type ReactNode } from "react";
import { useClerkActive } from "@indiecrafts/packages-web-auth/clerk-active";
import { logger } from "@indiecrafts/packages-shared-logger";

const RELOADED = "clerk-reload";

/**
 * Wrap a page's Clerk UI (sign-in, sign-up, account). The locale layout mounts Clerk when
 * the request needs it (`shouldLoadClerk`), but a client-side navigation keeps the layout
 * as it was first rendered — e.g. without Clerk for a visitor who was signed out then.
 * Clerk's components would throw there, so this reloads the page once: the layout then
 * renders with Clerk. The session flag stops a loop if Clerk still isn't mounted.
 */
export function RequireClerk({ children }: { children: ReactNode }) {
  const active = useClerkActive();
  useEffect(() => {
    try {
      if (active) {
        sessionStorage.removeItem(RELOADED);
      } else if (sessionStorage.getItem(RELOADED) !== location.pathname) {
        sessionStorage.setItem(RELOADED, location.pathname);
        location.reload();
      }
    } catch (error) {
      // Storage blocked: reloading without the loop guard could spin, so stay put.
      logger.error("RequireClerk: no session storage for the reload guard", error);
    }
  }, [active]);
  return active ? children : null;
}
