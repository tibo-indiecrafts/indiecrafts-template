"use client";

import { useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { logger } from "@indiecrafts/packages-shared-logger";

/**
 * Persist a locale change to the signed-in user's Clerk `unsafeMetadata.locale`. The api's
 * `user.updated` webhook then mirrors it to `user_profiles.locale`, so the user's
 * transactional + auth emails follow their CURRENT language — not just the one captured at
 * sign-up. Returns a `(locale) => void` to call right after the URL locale switch.
 *
 * - No-op when signed out, or when the stored locale already matches (avoids a needless
 *   webhook round-trip on every switch).
 * - Best-effort: Clerk's `user.update` REPLACES `unsafeMetadata`, so the existing keys
 *   (e.g. `marketing_email`) are spread back in. A failure only means emails keep the prior
 *   stored locale until the next successful update — the UI already switched via the cookie.
 */
export function usePersistLocale(): (locale: string) => void {
  const { isSignedIn, user } = useUser();
  return useCallback(
    (locale: string) => {
      if (!isSignedIn || !user) return;
      const current = (user.unsafeMetadata as { locale?: unknown } | undefined)
        ?.locale;
      if (current === locale) return;
      void user
        .update({ unsafeMetadata: { ...user.unsafeMetadata, locale } })
        .catch((error: unknown) => {
          logger.error("locale sync to Clerk failed", {
            name: (error as Error)?.name,
          });
        });
    },
    [isSignedIn, user],
  );
}
