"use client";

import { useAuth, useReverification } from "@clerk/nextjs";
import {
  mapErasureResponse,
  rawErasureFetch,
  type AccountAuth,
} from "@indiecrafts/packages-shared-compliance/web";

/**
 * Builds the Clerk-free `AccountAuth` seam from `@clerk/nextjs` for the account tabs.
 * The erasure POST is wrapped in `useReverification` (client step-up modal + auto-retry);
 * `skipCache` so the retry mints a fresh token carrying the updated `fva`. After a
 * done/partial erasure, `onDeleted` signs out and returns home.
 */
export function useClerkAuthPort(apiUrl: string): AccountAuth {
  const { getToken, signOut } = useAuth();
  const eraseWithReverification = useReverification((email: string) =>
    rawErasureFetch({
      apiUrl,
      getToken: () => getToken({ skipCache: true }),
      email,
    }),
  );
  return {
    getToken: () => getToken(),
    submitErasure: async (email) =>
      mapErasureResponse(await eraseWithReverification(email)),
    onDeleted: async () => {
      await signOut();
      if (typeof window !== "undefined") window.location.assign("/");
    },
  };
}
