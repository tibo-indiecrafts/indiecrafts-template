"use client";

/**
 * Persist a locale change to the signed-in user's Clerk metadata.
 *
 * @see docs/reference/packages/web/auth/src/persist-locale.md
 */

import { logger } from "@indiecrafts/packages-shared-logger";

/** The slice of the loaded ClerkJS global (`window.Clerk`) this module uses. */
type ClerkGlobal = {
  user?: {
    unsafeMetadata: Record<string, unknown>;
    update(params: {
      unsafeMetadata: Record<string, unknown>;
    }): Promise<unknown>;
  } | null;
};

/**
 * Persist a locale change to the signed-in user's Clerk `unsafeMetadata.locale`. The api's
 * `user.updated` webhook then mirrors it to `user_profiles.locale`, so the user's
 * transactional + auth emails follow their CURRENT language — not just the one captured at
 * sign-up. Call it right after the URL locale switch.
 *
 * - Reads the loaded ClerkJS global, not a Clerk hook: the website's locale switcher renders
 *   for signed-out visitors without `ClerkProvider` (Clerk loads only when needed), and a
 *   hook would throw there — and pull Clerk into every page's bundle.
 * - No-op when Clerk isn't loaded or no one is signed in, or when the stored locale already
 *   matches (avoids a needless webhook round-trip on every switch).
 * - Best-effort: Clerk's `user.update` REPLACES `unsafeMetadata`, so the existing keys
 *   (e.g. `marketing_email`) are spread back in. A failure only means emails keep the prior
 *   stored locale until the next successful update — the UI already switched via the cookie.
 */
export function persistLocale(locale: string): void {
  const user = (globalThis as { Clerk?: ClerkGlobal }).Clerk?.user;
  if (!user || user.unsafeMetadata.locale === locale) return;
  void user
    .update({ unsafeMetadata: { ...user.unsafeMetadata, locale } })
    .catch((error: unknown) => {
      logger.error("locale sync to Clerk failed", {
        name: (error as Error)?.name,
      });
    });
}
