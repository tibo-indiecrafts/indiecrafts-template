export type ErasureSelfResult = "done" | "partial" | "mismatch" | "error";

/**
 * Map the erasure-worker HTTP status to a UI result. A 403 (reverification required)
 * is NOT mapped here — the client step-up flow handles it before the retry lands here.
 */
export function mapErasureResponse(status: number): ErasureSelfResult {
  if (status === 200) return "done";
  if (status === 207) return "partial"; // still erased; some stores need manual finish
  if (status === 400) return "mismatch"; // typed email did not match the account
  return "error";
}

/**
 * Pure, testable: the one authenticated POST to the Slice-A erasure worker route.
 */
export async function submitAccountErasure(input: {
  apiUrl: string;
  getToken: () => Promise<string | null>;
  email: string;
}): Promise<ErasureSelfResult> {
  try {
    const token = await input.getToken();
    const res = await fetch(`${input.apiUrl}/v1/erasure/self`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ email: input.email }),
    });
    return mapErasureResponse(res.status);
  } catch {
    return "error";
  }
}

/**
 * A fetcher for Clerk's `useReverification`. On the worker's 403 reverification
 * response it returns the parsed hint body — `useReverification` detects that shape,
 * prompts step-up, and retries this fetcher (now with a fresh factor). Otherwise it
 * returns the mapped `ErasureSelfResult`. Wrap it in the surface's own
 * `useReverification` hook (`@clerk/nextjs` on web, `@clerk/clerk-react` on hybrid).
 */
export function makeErasureFetcher(input: {
  apiUrl: string;
  getToken: () => Promise<string | null>;
}): (email: string) => Promise<ErasureSelfResult | unknown> {
  return async (email: string) => {
    const token = await input.getToken();
    const res = await fetch(`${input.apiUrl}/v1/erasure/self`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ email }),
    });
    // 403 = Clerk reverification-error shape; return it raw so useReverification detects it.
    if (res.status === 403) return res.json();
    return mapErasureResponse(res.status);
  };
}
