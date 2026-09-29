"use client";

/**
 * Clerk-connected legal re-acceptance banner — supplies `getToken` for cross-surface sync.
 *
 * @see docs/reference/projects/web/website/src/user-interface/legal/SignedInLegalNotice.md
 */
import { useAuth } from "@clerk/nextjs";
import { LegalNotice } from "@indiecrafts/packages-web-compliance/reacceptance/LegalNotice";

/**
 * Wraps `LegalNotice` with Clerk's `getToken` so a SIGNED-IN visitor's acceptance syncs
 * across surfaces: the server-recorded version (from the api Worker's `/v1/consent/legal`)
 * hides this banner, and accepting here records it — so a user who accepted in the app or
 * mobile does not see it again on the website, and vice-versa. Rendered ONLY when a
 * publishable key is set (a `ClerkProvider` exists), so `useAuth` always has its provider;
 * anonymous / no-Clerk builds mount the plain `LegalNotice` (cookie-only) instead.
 */
export function SignedInLegalNotice(props: {
  version: string;
  message: string;
  hrefs: string[];
  acceptLabel: string;
  apiUrl: string;
}) {
  const { getToken } = useAuth();
  return <LegalNotice {...props} getToken={getToken} />;
}
