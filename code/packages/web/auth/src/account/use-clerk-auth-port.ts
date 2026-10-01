"use client";

/**
 * Builds the Clerk-free AccountAuth seam for the account tabs.
 *
 * @see docs/reference/packages/web/auth/src/account/use-clerk-auth-port.md
 */

import { useAuth, useReverification } from "@clerk/nextjs";
import {
  mapErasureResponse,
  mapExportResponse,
  rawErasureFetch,
  rawExportFetch,
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

/** The export call `useReverification` wraps — extracted, like `callErasureSelf`, so the
 *  step-up path is testable without React/Clerk. */
export function callExportSelf(
  apiUrl: string,
  getToken: () => Promise<string | null>,
  doRawExportFetch: typeof rawExportFetch = rawExportFetch,
) {
  return doRawExportFetch({ apiUrl, getToken });
}

/**
 * Builds the Clerk-free `AccountAuth` seam from `@clerk/nextjs` for the account tabs.
 * The erasure POST (+ optional churn survey) and the data export are wrapped in
 * `useReverification` (client step-up modal + auto-retry); `skipCache` so the retry mints a fresh token carrying the
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
  // The export runs behind the same step-up (the api requires a recent verification).
  const exportWithReverification = useReverification(() =>
    callExportSelf(apiUrl, () => getToken({ skipCache: true })),
  );
  return {
    getToken: () => getToken(),
    submitExport: async () =>
      mapExportResponse(await exportWithReverification()),
    submitErasure: async (email, survey) =>
      mapErasureResponse(await eraseWithReverification(email, survey)),
    onDeleted: async () => {
      await signOut();
      if (typeof window !== "undefined") window.location.assign("/");
    },
  };
}
