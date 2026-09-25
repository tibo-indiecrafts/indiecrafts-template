/**
 * Sign and verify the no-login email-preference token.
 *
 * @see docs/reference/shared/api/src/consent/pref-token.md
 */
// Signed no-login preference token — lets an email link open the preference centre
// without a session. Built on signHmac/verifyHmac (gated-delivery). Low-sensitivity,
// marketing-prefs scope only: the payload carries no PII beyond the user id.
//
// New tokens carry a 1-year `exp` so a leaked link does not grant the capability forever.
// Legacy tokens minted before expiry existed carry no `exp` and stay valid, so links in
// already-sent mail keep working; they age out as those emails are re-sent with fresh tokens.
import {
  signHmac,
  verifyHmac,
} from "@indiecrafts/packages-shared-gated-delivery";

/** 1 year — long enough that real email links keep working, short enough to bound a leak. */
export const PREF_TOKEN_TTL_MS = 365 * 24 * 60 * 60 * 1000;

export async function signPrefToken(
  secret: string,
  uid: string,
  cat?: string,
  now?: number,
): Promise<string> {
  const exp = (now ?? Date.now()) + PREF_TOKEN_TTL_MS;
  return signHmac(cat ? { uid, cat, exp } : { uid, exp }, secret);
}

export async function verifyPrefToken(
  secret: string,
  token: string,
  now?: number,
): Promise<{ uid: string; cat?: string } | null> {
  const payload = await verifyHmac(token, secret);
  if (!payload) return null;
  const { uid, cat, exp } = payload;
  if (typeof uid !== "string" || !uid) return null;
  // A present `exp` is enforced; a missing one (legacy token) stays valid.
  if (typeof exp === "number" && exp <= (now ?? Date.now())) return null;
  return typeof cat === "string" && cat ? { uid, cat } : { uid };
}
