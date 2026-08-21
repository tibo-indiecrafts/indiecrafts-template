/**
 * Shared anti-spam + input primitives for public web forms (newsletter, waitlist,
 * contact). The honeypot + too-fast heuristics and the e-mail check live here once,
 * so the three form engines tune them in a single place instead of three copies.
 */

/** A lax e-mail shape check — one `@`, a dot in the domain. Not RFC-perfect on purpose. */
export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** A human takes >2s to fill a form; a near-instant submit is a bot. */
const MIN_SUBMIT_MS = 2000;

/**
 * Too-fast submit heuristic. Skew-safe: only a small POSITIVE gap counts, so a
 * client clock running ahead (negative elapsed) never false-flags a real person.
 */
export function tooFast(startedAt?: number): boolean {
  if (typeof startedAt !== "number") return false;
  const elapsed = Date.now() - startedAt;
  return elapsed >= 0 && elapsed < MIN_SUBMIT_MS;
}

/** True when a submission looks like a bot: a filled honeypot or a too-fast submit. */
export function isSpam(input: {
  honeypot?: string;
  startedAt?: number;
}): boolean {
  return (input.honeypot ?? "").trim() !== "" || tooFast(input.startedAt);
}

/** True when `email` is a plausible, length-bounded address (trims + lowercases first). */
export function isValidEmail(email?: string): boolean {
  const e = (email ?? "").trim().toLowerCase();
  return !!e && e.length <= 254 && EMAIL_RE.test(e);
}

/** Trim + drop empties from a string list (e-mail cc/bcc/to config). */
export const cleanList = (list?: string[] | null): string[] =>
  (list ?? []).map((s) => s.trim()).filter(Boolean);
