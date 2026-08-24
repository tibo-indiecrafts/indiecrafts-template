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
