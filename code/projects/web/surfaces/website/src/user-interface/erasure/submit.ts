export type ErasureRequestResult = "sent" | "turnstile" | "error";

/**
 * Pure, testable: the one anonymous POST to the public erasure worker route
 * (`POST /v1/erasure/request`). Form-encoded (not JSON) — the worker reads
 * `request.formData()`. The worker always returns a generic 200 for
 * well-formed input (anti-enumeration), so "sent" never confirms a match.
 */
export async function submitErasureRequest(input: {
  apiUrl: string;
  email: string;
  turnstileToken: string | null;
}): Promise<ErasureRequestResult> {
  try {
    const form = new FormData();
    form.set("email", input.email);
    if (input.turnstileToken) form.set("cf-turnstile-response", input.turnstileToken);
    const res = await fetch(`${input.apiUrl}/v1/erasure/request`, {
      method: "POST",
      body: form,
    });
    if (res.status === 200) return "sent";
    if (res.status === 403) return "turnstile";
    return "error";
  } catch {
    return "error";
  }
}

export type ErasureConfirmResult = "done" | "partial" | "mismatch" | "expired" | "error";

/**
 * Pure, testable: the one anonymous POST to the public erasure worker route
 * (`POST /v1/erasure/confirm`). JSON (not FormData) — the worker's confirm
 * route reads `request.json()`.
 */
export async function submitErasureConfirm(input: {
  apiUrl: string;
  token: string;
  email: string;
}): Promise<ErasureConfirmResult> {
  try {
    const res = await fetch(`${input.apiUrl}/v1/erasure/confirm`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: input.token, email: input.email }),
    });
    if (res.status === 200) return "done";
    if (res.status === 207) return "partial";
    if (res.status === 429) return "expired"; // too many attempts → tell them to restart
    if (res.status === 400) return "mismatch"; // bad/expired/used token OR email mismatch
    return "error";
  } catch {
    return "error";
  }
}
