/**
 * Mirror the newsletter subscriber list to Resend's `news` topic, and flow Resend unsubscribes back to Sanity.
 *
 * @see docs/reference/shared/api/src/newsletter/resend-sync.md
 */
// The Sanity `subscriber` doc is the newsletter's source of truth; Resend mirrors it so
// there is ONE list (the `news` topic) for Broadcasts. Two directions:
// - `syncNewsletterSubscriber` — website → Resend (POST /v1/newsletter/subscribers).
// - `handleResendContactEvent` — Resend → Sanity (POST /v1/resend/webhook): an unsubscribe
//   made in Resend sets the confirmed subscriber doc(s) to `unsubscribed`. It NEVER sets a
//   doc to `confirmed` — re-subscribing needs the double opt-in.
// Signed-in users' D1 `email_preferences` are NOT touched here (separate flow).
import { defaultLocale } from "@indiecrafts/packages-shared-config";
import { isValidEmail } from "@indiecrafts/packages-shared-utils/form";
import type { Env } from "../index";
import { fetchWithTimeout } from "../http";
import { fetchEmailPreferences } from "../consent/email-preferences-sanity";
import { createRealSanityClient } from "../erasure/sanity-client";
import {
  getContactTopics,
  subscribeNewsletterContact,
  unsubscribeNewsletterContact,
} from "../resend-audience";

/** `isValidEmail` plus no URL-path characters — the email goes raw into Resend's path. */
export function isNewsletterEmail(value: unknown): value is string {
  return (
    typeof value === "string" && isValidEmail(value) && !/[/?#%\\]/.test(value)
  );
}

/** The `news` category's Resend topic id, or undefined when the editor set none. */
async function newsTopicId(
  env: Env,
  locale: string,
  doFetch: typeof fetch,
): Promise<string | undefined> {
  const { categories } = await fetchEmailPreferences(env, locale, doFetch);
  return categories.find((c) => c.key === "news")?.resendTopicId;
}

/** Website → Resend. `granted` → global flag on + `news` opt_in; revoked → `news` opt_out
 *  only. No-op without `RESEND_API_KEY`. Throws on a Resend error (the route logs it). */
export async function syncNewsletterSubscriber(
  env: Env,
  {
    email,
    locale,
    granted,
  }: { email: string; locale: string; granted: boolean },
  doFetch: typeof fetch = fetchWithTimeout,
): Promise<void> {
  if (!env.RESEND_API_KEY) return;
  const topicId = await newsTopicId(env, locale, doFetch);
  if (granted)
    await subscribeNewsletterContact(env, { email, topicId }, doFetch);
  else if (topicId)
    await unsubscribeNewsletterContact(env, { email, topicId }, doFetch);
}

/** A Resend contact webhook event (only the fields we read). */
export type ResendContactEvent = {
  type?: string;
  data?: {
    email?: unknown;
    unsubscribed?: unknown;
    topics?: unknown;
  };
};

const HANDLED = new Set([
  "contact.updated",
  "contact.deleted",
  "contact.topics.updated",
]);

/** Does the Resend contact still want the newsletter? Deleted or globally unsubscribed →
 *  no. Otherwise the `news` topic decides (inline `topics` on `contact.topics.updated`,
 *  else a GET); no topic configured or a failed lookup → only the global flag counts. */
async function wantsNews(
  env: Env,
  evt: ResendContactEvent,
  email: string,
  doFetch: typeof fetch,
): Promise<boolean> {
  if (evt.type === "contact.deleted" || evt.data?.unsubscribed === true)
    return false;
  const topicId = await newsTopicId(env, defaultLocale, doFetch);
  if (!topicId) return true;
  const topics = Array.isArray(evt.data?.topics)
    ? (evt.data.topics as { id?: unknown; subscription?: unknown }[])
    : await getContactTopics(env, { email }, doFetch);
  return topics?.find((t) => t.id === topicId)?.subscription !== "opt_out";
}

/** Resend → Sanity. Returns `"ignored"` for an event this flow does not act on. Throws when
 *  the Sanity write fails (or is unconfigured) so the route answers 500 and Resend retries.
 *  Idempotent: only `confirmed` docs match, so a replay finds nothing left to change. */
export async function handleResendContactEvent(
  env: Env,
  evt: ResendContactEvent,
  doFetch: typeof fetch = fetchWithTimeout,
): Promise<"ignored" | "kept" | "unsubscribed"> {
  if (!evt.type || !HANDLED.has(evt.type)) return "ignored";
  const raw = evt.data?.email;
  if (!isNewsletterEmail(raw)) return "ignored";
  const email = raw.trim().toLowerCase();
  if (await wantsNews(env, evt, email, doFetch)) return "kept";

  const { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_WRITE_TOKEN } = env;
  if (!SANITY_PROJECT_ID || !SANITY_DATASET || !SANITY_API_WRITE_TOKEN)
    throw new Error("sanity write unconfigured");
  const apiVersion = env.SANITY_API_VERSION || "2025-01-01";
  // Query with the write token: it reads the private dataset, and the read must be fresh
  // (not the CDN) so a replay sees the previous write.
  const groq = `*[_type == "subscriber" && email == $email && status == "confirmed"]{ _id }`;
  const res = await doFetch(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v${apiVersion}/data/query/${SANITY_DATASET}` +
      `?query=${encodeURIComponent(groq)}` +
      `&$email=${encodeURIComponent(JSON.stringify(email))}`,
    { headers: { authorization: `Bearer ${SANITY_API_WRITE_TOKEN}` } },
  );
  if (!res.ok) throw new Error(`sanity query ${res.status}`);
  const docs = ((await res.json()) as { result?: { _id: string }[] }).result;
  if (!docs?.length) return "unsubscribed";
  // The erasure client's write is a plain `set` patch by id — reused as-is.
  const sanity = createRealSanityClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion,
    writeToken: SANITY_API_WRITE_TOKEN,
  });
  for (const { _id } of docs)
    await sanity.pseudonymise(_id, { status: "unsubscribed" });
  return "unsubscribed";
}
