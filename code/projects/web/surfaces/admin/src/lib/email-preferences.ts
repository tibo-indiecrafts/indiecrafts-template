/**
 * Fetch one person's email preferences from the shared api, for the admin's email panel.
 *
 * @see docs/reference/projects/web/admin/src/lib/email-preferences.md
 */
import "server-only";

/** One category as the admin sees it: the account's own choice (`null` without an account)
 *  and the Resend topic state (`null` when the contact has none). */
export type EmailPrefCategory = {
  key: string;
  name: string;
  granted: boolean | null;
  topic: "opt_in" | "opt_out" | null;
};
export type EmailPrefState = {
  subject: { userId: string | null; email: string | null };
  categories: EmailPrefCategory[];
  /** The Resend contact; `null` when Resend could not be read. */
  resend: { exists: boolean; unsubscribed: boolean } | null;
};

const USER_ID = /^user_[A-Za-z0-9]{10,40}$/;
const EMAIL = /^[^@\s/?#%\\]+@[^@\s/?#%\\]+\.[^@\s/?#%\\]+$/;

/**
 * `GET /v1/admin/email-preferences` (bearer-gated) for an account (`userId`) or an address
 * (`email`). The api audits the view (`admin.view_email_prefs`, actor → target). Returns
 * `null` when it could not be loaded — never a false "no preferences".
 */
export async function fetchEmailPreferences(
  subject: { userId: string } | { email: string },
  actor: string,
): Promise<EmailPrefState | null> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token || !USER_ID.test(actor)) return null;
  const query =
    "userId" in subject
      ? USER_ID.test(subject.userId) && `userId=${encodeURIComponent(subject.userId)}`
      : EMAIL.test(subject.email.trim()) &&
        `email=${encodeURIComponent(subject.email.trim())}`;
  if (!query) return null;
  try {
    const res = await fetch(
      `${url}/v1/admin/email-preferences?${query}&actorUserId=${encodeURIComponent(actor)}`,
      { headers: { authorization: `Bearer ${token}` }, cache: "no-store" },
    );
    if (!res.ok) return null;
    return (await res.json()) as EmailPrefState;
  } catch {
    return null;
  }
}
