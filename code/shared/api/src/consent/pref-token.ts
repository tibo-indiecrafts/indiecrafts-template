// Signed no-login preference token — lets an email link open the preference centre
// without a session. Built on signHmac/verifyHmac (gated-delivery); no expiry, since
// links in already-sent mail must keep working. Low-sensitivity, marketing-prefs scope
// only: the payload carries no PII beyond the user id.
import {
  signHmac,
  verifyHmac,
} from "@indiecrafts/packages-shared-gated-delivery";

export async function signPrefToken(
  secret: string,
  uid: string,
  cat?: string,
): Promise<string> {
  return signHmac(cat ? { uid, cat } : { uid }, secret);
}

export async function verifyPrefToken(
  secret: string,
  token: string,
): Promise<{ uid: string; cat?: string } | null> {
  const payload = await verifyHmac(token, secret);
  if (!payload) return null;
  const { uid, cat } = payload;
  if (typeof uid !== "string" || !uid) return null;
  return typeof cat === "string" && cat ? { uid, cat } : { uid };
}
