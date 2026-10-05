/**
 * Fetch one user's consent history from the shared api, and record that an admin viewed it.
 *
 * @see docs/reference/projects/web/admin/src/lib/consent-history.md
 */
import "server-only";
import { audit } from "@/lib/audit";

export type ConsentDecision = {
  ts: string;
  type: string;
  granted: boolean;
  policyVersion: string;
  surface: string;
  source: string | null;
  country: string | null;
};
export type ConsentHistory = {
  current: ConsentDecision[];
  events: ConsentDecision[];
};

const USER_ID = /^user_[A-Za-z0-9]{10,40}$/;

/**
 * `GET /v1/consent/history` (bearer-gated, data-minimized: no IP hash). Viewing a
 * person's consent history is itself an access to personal data, so a successful read
 * writes `admin.view_consent` (actor → target) to the admin audit trail. Returns `null`
 * when it could not be loaded (bad id, unconfigured, api error) — never a false
 * "no decisions".
 */
export async function fetchConsentHistory(
  userId: string,
  actor: string,
): Promise<ConsentHistory | null> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!USER_ID.test(userId) || !url || !token) return null;
  try {
    const res = await fetch(
      `${url}/v1/consent/history?userId=${encodeURIComponent(userId)}`,
      { headers: { authorization: `Bearer ${token}` }, cache: "no-store" },
    );
    if (!res.ok) return null;
    const history = (await res.json()) as ConsentHistory;
    await audit("admin.view_consent", { actor, target: userId });
    return history;
  } catch {
    return null;
  }
}
