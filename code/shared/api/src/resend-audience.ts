/**
 * Mirrors marketing-email consent decisions to Resend's global Contacts.
 *
 * @see docs/reference/shared/api/src/resend-audience.md
 */
// Mirror a marketing-email consent decision to Resend's global Contacts. Resend renamed
// Audiences to Segments and made Contacts global, so there is no audience id: create is
// `POST /contacts`, and a contact is addressed by email in the path (`/contacts/{email}`).
// Sibling of `erasure/email.ts` — same inline-`fetch` + injectable-seam pattern, no
// `server-only`, no new deps. Best-effort by contract: callers wrap these in try/catch and
// log, so a Resend hiccup never blocks the D1 write that is the real source of truth.
//
// Unset `RESEND_API_KEY` → every function no-ops, so the whole feature degrades to
// capture-only when Resend is unconfigured.

/** The Env slice this module needs — never the full worker `Env`. */
export type ResendAudienceEnv = {
  RESEND_API_KEY?: string;
};

const RESEND_API = "https://api.resend.com";

type Subscription = "opt_in" | "opt_out";
type TopicSub = { id: string; subscription: Subscription };

/** Upsert a global contact. `POST /contacts` creates it (with inline `fields` + `topics`); if
 *  the email already exists (Resend 409/422), `PATCH /contacts/{email}` updates the fields and
 *  `PATCH /contacts/{email}/topics` sets the topics — topics are NOT a `/contacts` PATCH-body
 *  field, they have a dedicated endpoint whose body is a bare array. Raw email in the path:
 *  `@ . +` are all valid path chars, no encoding needed. Best-effort; throws on an unexpected
 *  status so the caller's try/catch can log it. */
async function upsertContact(
  env: ResendAudienceEnv,
  email: string,
  fields: Record<string, unknown>,
  topics: TopicSub[],
  doFetch: typeof fetch,
): Promise<void> {
  const base = `${RESEND_API}/contacts`;
  const headers = {
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
    "content-type": "application/json",
  };

  const res = await doFetch(base, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email,
      ...fields,
      ...(topics.length ? { topics } : {}),
    }),
  });
  if (res.ok) return;
  if (res.status !== 409 && res.status !== 422)
    throw new Error(`resend ${res.status}`);

  // Already exists → update the contact's fields, then its topics (dedicated endpoint).
  if (Object.keys(fields).length) {
    const patch = await doFetch(`${base}/${email}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(fields),
    });
    if (!patch.ok) throw new Error(`resend ${patch.status}`);
  }
  if (topics.length) {
    const patch = await doFetch(`${base}/${email}/topics`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(topics),
    });
    if (!patch.ok) throw new Error(`resend ${patch.status}`);
  }
}

/** Create-or-update the contact with `unsubscribed = !granted` (Resend's global marketing
 *  flag, not per-topic). */
export async function upsertResendContact(
  env: ResendAudienceEnv,
  { email, granted }: { email: string; granted: boolean },
  doFetch: typeof fetch = fetch,
): Promise<void> {
  if (!env.RESEND_API_KEY || !email) return;
  await upsertContact(env, email, { unsubscribed: !granted }, [], doFetch);
}

/** Create-or-update the contact's per-topic subscriptions. Topics are Resend's per-category
 *  primitive (`unsubscribed` above is the global flag, not per-category); each entry maps
 *  `granted` to Resend's `opt_in`/`opt_out`. Entries with an empty/missing `topicId` are
 *  dropped. */
export async function syncContactTopics(
  env: ResendAudienceEnv,
  {
    email,
    topics,
  }: { email: string; topics: { topicId: string; granted: boolean }[] },
  doFetch: typeof fetch = fetch,
): Promise<void> {
  if (!env.RESEND_API_KEY || !email) return;
  const subs = topics
    .filter((t) => t.topicId)
    .map((t): TopicSub => ({
      id: t.topicId,
      subscription: t.granted ? "opt_in" : "opt_out",
    }));
  if (!subs.length) return;
  await upsertContact(env, email, {}, subs, doFetch);
}

/** Suppress a departed contact instead of deleting: global unsubscribe, opt OUT of every
 *  marketing topic, opt INTO the churned topic (cohort tag), and stamp the churn reason as a
 *  contact property. Best-effort. */
export async function suppressResendContact(
  env: ResendAudienceEnv,
  {
    email,
    reason,
    churnedTopicId,
    optOutTopicIds,
  }: {
    email: string;
    reason?: string | null;
    churnedTopicId?: string;
    optOutTopicIds?: string[];
  },
  doFetch: typeof fetch = fetch,
): Promise<void> {
  if (!env.RESEND_API_KEY || !email) return;
  const topics: TopicSub[] = [
    ...(optOutTopicIds ?? []).map((id): TopicSub => ({
      id,
      subscription: "opt_out",
    })),
    ...(churnedTopicId
      ? [{ id: churnedTopicId, subscription: "opt_in" as const }]
      : []),
  ];
  const fields = {
    unsubscribed: true,
    properties: {
      churned_at: new Date().toISOString(),
      churn_reason: reason ?? "",
    },
  };
  await upsertContact(env, email, fields, topics, doFetch);
}

/** Remove the contact — the erasure "pure delete" (no win-back list). A 404 (already gone)
 *  is success. Email in the path (global Contacts). */
export async function deleteResendContact(
  env: ResendAudienceEnv,
  { email }: { email: string },
  doFetch: typeof fetch = fetch,
): Promise<void> {
  if (!env.RESEND_API_KEY || !email) return;
  const res = await doFetch(`${RESEND_API}/contacts/${email}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}` },
  });
  if (!res.ok && res.status !== 404) throw new Error(`resend ${res.status}`);
}
