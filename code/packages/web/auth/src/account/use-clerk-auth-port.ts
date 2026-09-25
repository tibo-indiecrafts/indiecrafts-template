"use client";

/**
 * Builds the Clerk-free AccountAuth seam for the account tabs.
 *
 * @see docs/reference/packages/web/auth/src/account/use-clerk-auth-port.md
 */

import { useAuth, useReverification } from "@clerk/nextjs";
import {
  mapErasureResponse,
  rawErasureFetch,
  type AccountAuth,
  type ChurnSurveyInput,
} from "@indiecrafts/packages-shared-compliance/web";

/**
 * The call `useReverification` wraps — extracted so it's testable without mocking
 * React/Clerk. `doRawErasureFetch` is injectable for tests (defaults to the real
 * `rawErasureFetch`); asserts the survey actually reaches its input, since a
 * refactor here could otherwise silently drop it with nothing failing.
 */
export function callErasureSelf(
  apiUrl: string,
  getToken: () => Promise<string | null>,
  email: string,
  survey: ChurnSurveyInput | undefined,
  doRawErasureFetch: typeof rawErasureFetch = rawErasureFetch,
) {
  return doRawErasureFetch({ apiUrl, getToken, email, ...survey });
}

/**
 * Builds the Clerk-free `AccountAuth` seam from `@clerk/nextjs` for the account tabs.
 * The erasure POST (+ optional churn survey) is wrapped in `useReverification` (client
 * step-up modal + auto-retry); `skipCache` so the retry mints a fresh token carrying the
 * updated `fva`. After a done/partial erasure, `onDeleted` signs out and returns home.
 */
export function useClerkAuthPort(apiUrl: string): AccountAuth {
  const { getToken, signOut } = useAuth();
  const eraseWithReverification = useReverification(
    (email: string, survey?: ChurnSurveyInput) =>
      callErasureSelf(
        apiUrl,
        () => getToken({ skipCache: true }),
        email,
        survey,
      ),
  );
  return {
    getToken: () => getToken(),
    submitErasure: async (email, survey) =>
      mapErasureResponse(await eraseWithReverification(email, survey)),
    onDeleted: async () => {
      await signOut();
      if (typeof window !== "undefined") window.location.assign("/");
    },
  };
}
