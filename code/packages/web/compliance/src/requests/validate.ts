import { isDataRequestType } from "./request-types";

/**
 * Pure validation for the data-subject request form — no Sanity/email graph, so
 * it unit-tests without env. `submit.ts` imports these; the API route calls
 * `submitDataRequest`, never this directly.
 */
export type DataRequestInput = {
  email: string;
  requestType: string;
  /** Consent to process this contact detail to handle the request (Art. 6.1.a). */
  consent: boolean;
  message?: string;
  source?: string;
  language?: string;
  /** Hidden anti-spam field — must be empty for a real submission. */
  honeypot?: string;
  /** Client form-render time (ms) — a near-instant submit is a bot. */
  startedAt?: number;
};

export type DataRequestResult =
  { ok: true } | { ok: false; error: "invalid" | "spam" | "server" };

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MIN_SUBMIT_MS = 2000; // a human takes >2s; a near-instant submit is a bot

/**
 * Too-fast submit heuristic. Skew-safe: only a small POSITIVE gap counts, so a
 * client clock running ahead (negative elapsed) never false-flags a real person.
 */
export function tooFast(startedAt?: number): boolean {
  if (typeof startedAt !== "number") return false;
  const elapsed = Date.now() - startedAt;
  return elapsed >= 0 && elapsed < MIN_SUBMIT_MS;
}

/** Pure validator — cheap to unit-check. */
export function validateDataRequest(
  input: Partial<DataRequestInput>,
): DataRequestResult {
  if ((input.honeypot ?? "").trim() !== "" || tooFast(input.startedAt)) {
    return { ok: false, error: "spam" };
  }
  const email = (input.email ?? "").trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL.test(email))
    return { ok: false, error: "invalid" };
  if (!isDataRequestType(input.requestType))
    return { ok: false, error: "invalid" };
  if (input.consent !== true) return { ok: false, error: "invalid" };
  return { ok: true };
}
