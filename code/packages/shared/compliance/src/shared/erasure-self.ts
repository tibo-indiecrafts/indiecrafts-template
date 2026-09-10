export type ErasureSelfResult = "done" | "partial" | "mismatch" | "error";

/**
 * What one erasure POST resolves to for the mapper: a status carrier on any
 * normal outcome, or Clerk's reverification hint body (`{ clerk_error: … }`)
 * verbatim on a 403 so a `useReverification` wrapper in the surface can detect
 * it and open the step-up modal. The brick never imports `@clerk/*` — it only
 * passes the body through; the Clerk dependency lives in each surface panel.
 */
export type ErasureFetchOutcome = { status: number } | { clerk_error: unknown };

/**
 * The optional churn exit-survey fields, sent alongside the erasure POST. Reason
 * values MUST equal the `CHURN_REASONS` preset codes in the api — the server
 * normalizes anything else to null. Shared by `rawErasureFetch`/`submitAccountErasure`
 * and the `AccountAuth.submitErasure` seam so a surface's step-up wrapper carries them too.
 */
export interface ChurnSurveyInput {
  reason?: string;
  feedback?: string;
  competitor?: string;
}

/**
 * The one authenticated POST to the Slice-A erasure worker route, wrappable by a
 * surface's `useReverification`. It resolves the response into a plain value —
 * NOT a `Response` — because Clerk's `useReverification` auto-`.json()`s a
 * returned `Response` and drops its status; so this carries the status in
 * `{ status }` on the normal path and returns the parsed body on a 403 so the
 * hook can see the reverification hint and retry.
 *
 * `doFetch` is injectable for tests (defaults to the global `fetch`).
 */
export async function rawErasureFetch(
  input: {
    apiUrl: string;
    getToken: () => Promise<string | null>;
    email: string;
  } & ChurnSurveyInput,
  doFetch: typeof fetch = fetch,
): Promise<ErasureFetchOutcome> {
  const token = await input.getToken();
  const res = await doFetch(`${input.apiUrl}/v1/erasure/self`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      email: input.email,
      ...(input.reason ? { reason: input.reason } : {}),
      ...(input.feedback ? { feedback: input.feedback } : {}),
      ...(input.competitor ? { competitor: input.competitor } : {}),
    }),
  });
  // A 403 may carry Clerk's reverification hint. Hand the parsed body back so a
  // `useReverification` wrapper opens the modal + auto-retries; a non-hint 403
  // body has no `status`, so `mapErasureResponse` maps it to "error" as before.
  if (res.status === 403) {
    const body: unknown = await res.json().catch(() => null);
    if (body !== null && typeof body === "object" && "clerk_error" in body) {
      return body;
    }
    return { status: 403 };
  }
  return { status: res.status };
}

/**
 * The status → `ErasureSelfResult` mapping, shared by the default
 * `submitAccountErasure` path AND a surface panel that wraps `rawErasureFetch`
 * in `useReverification`. One source of the mapping — do not duplicate it.
 */
export function mapErasureResponse(
  outcome: ErasureFetchOutcome,
): ErasureSelfResult {
  if (!("status" in outcome)) return "error";
  if (outcome.status === 200) return "done";
  if (outcome.status === 207) return "partial"; // still erased; some stores need manual finish
  if (outcome.status === 400) return "mismatch"; // typed email did not match the account
  return "error";
}

/**
 * Pure, testable: the default (no step-up) erasure submit. A surface that wants
 * Clerk reverification injects its own submit built from `rawErasureFetch` +
 * `mapErasureResponse` instead of calling this.
 */
export async function submitAccountErasure(
  input: {
    apiUrl: string;
    getToken: () => Promise<string | null>;
    email: string;
  } & ChurnSurveyInput,
): Promise<ErasureSelfResult> {
  try {
    return mapErasureResponse(await rawErasureFetch(input));
  } catch {
    return "error";
  }
}
