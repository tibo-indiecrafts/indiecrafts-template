"use client";

import { useAuth, useReverification } from "@clerk/nextjs";
import {
  mapErasureResponse,
  rawErasureFetch,
  type AccountAuth,
  type ChurnSurveyInput,
} from "@indiecrafts/packages-shared-compliance/web";

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
      rawErasureFetch({
        apiUrl,
        getToken: () => getToken({ skipCache: true }),
        email,
        ...survey,
      }),
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
