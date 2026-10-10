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
// Resend is the newsletter's only list: a newsletter contact also carries a `locale`
// property and sits in one `newsletter-<code>` language segment.
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

/** Resend's team rate limit is low (a few requests a second) and a newsletter upsert is a short
 *  chain of calls: retry a 429 twice, after `Retry-After` (capped at 2 s). */
function retrying(doFetch: typeof fetch): typeof fetch {
  return async (input, init) => {
    for (let attempt = 0; ; attempt++) {
      const res = await doFetch(input, init);
      if (res.status !== 429 || attempt === 2) return res;
      const wait = Math.min(Number(res.headers.get("retry-after")) || 1, 2);
      await new Promise((r) => setTimeout(r, wait * 1000));
    }
  };
}

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
  /** Segment ids for a NEW contact only (an existing one moves via `syncNewsletterSegments`). */
  segmentIds: string[] = [],
  /** Fields for a NEW contact only — an existing contact keeps its own. */
  createFields: Record<string, unknown> = {},
): Promise<"created" | "updated"> {
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
      ...createFields,
      ...fields,
      ...(topics.length ? { topics } : {}),
      ...(segmentIds.length
        ? { segments: segmentIds.map((id) => ({ id })) }
        : {}),
    }),
  });
  if (res.ok) return "created";
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
  return "updated";
}

/** Create-or-update the contact's per-topic subscriptions. Topics are Resend's per-category
 *  primitive (Resend's `unsubscribed` is the global flag, not per-category); each entry maps
 *  `granted` to Resend's `opt_in`/`opt_out`. Entries with an empty/missing `topicId` are
 *  dropped. `newsletterLocale` (set only when the `news` category changed): a locale → the
 *  `locale` property + that language segment; `null` → out of every language segment. */
export async function syncContactTopics(
  env: ResendAudienceEnv,
  {
    email,
    topics,
    newsletterLocale,
  }: {
    email: string;
    topics: { topicId: string; granted: boolean }[];
    newsletterLocale?: string | null;
  },
  doFetch: typeof fetch = fetch,
): Promise<void> {
  if (!env.RESEND_API_KEY || !email) return;
  const subs = topics
    .filter((t) => t.topicId)
    .map((t): TopicSub => ({
      id: t.topicId,
      subscription: t.granted ? "opt_in" : "opt_out",
    }));
  const f = retrying(doFetch);
  const fields = newsletterLocale
    ? { properties: { locale: newsletterLocale } }
    : {};
  if (subs.length || newsletterLocale)
    await upsertContact(env, email, fields, subs, f);
  if (newsletterLocale !== undefined)
    await syncNewsletterSegments(env, { email, locale: newsletterLocale }, f);
}

/** A confirmed newsletter subscriber: clear the global flag (`unsubscribed: false`), set the
 *  `locale` property and opt INTO the `news` topic in one upsert, then move the contact to its
 *  language segment. No `topicId` → no topic. */
export async function subscribeNewsletterContact(
  env: ResendAudienceEnv,
  {
    email,
    locale,
    topicId,
  }: { email: string; locale: string; topicId?: string },
  doFetch: typeof fetch = fetch,
): Promise<void> {
  if (!env.RESEND_API_KEY || !email) return;
  const f = retrying(doFetch);
  const target = await newsletterSegment(env, locale, f);
  const topics: TopicSub[] = topicId
    ? [{ id: topicId, subscription: "opt_in" }]
    : [];
  // A new contact gets everything in one call; an existing one is updated, then moved.
  const done = await upsertContact(
    env,
    email,
    { unsubscribed: false, properties: { locale } },
    topics,
    f,
    [target.id],
  );
  if (done === "updated")
    await syncNewsletterSegments(env, { email, locale }, f, target);
}

/** A waitlist or contact-form person (`POST /v1/contacts/general`). A new contact gets the
 *  `locale` property; an existing one keeps its fields (its language, its global unsubscribe).
 *  With a `topicId` the contact opts into that topic, new or existing — the caller passes none
 *  for a contact message, or when the person turned the topic off in the preference centre. */
export async function upsertGeneralContact(
  env: ResendAudienceEnv,
  {
    email,
    locale,
    topicId,
  }: { email: string; locale: string; topicId?: string },
  doFetch: typeof fetch = fetch,
): Promise<void> {
  if (!env.RESEND_API_KEY || !email) return;
  const topics: TopicSub[] = topicId
    ? [{ id: topicId, subscription: "opt_in" }]
    : [];
  await upsertContact(env, email, {}, topics, retrying(doFetch), [], {
    properties: { locale },
  });
}

type Segment = { id: string; name: string };
/** One segment per site language, named `newsletter-<code>` (created by `resend:topics:sync`). */
const NEWSLETTER_SEGMENT = "newsletter-";
const SEGMENT_TTL_MS = 10 * 60_000;
// ponytail: per-isolate cache of the account's segment list (it changes only when the sync
// script runs); a miss refetches once, so a new segment shows up without waiting the TTL.
let segmentCache: { at: number; list: Segment[] } | undefined;

/** Test seam: forget the cached segment list. */
export function clearSegmentCache(): void {
  segmentCache = undefined;
}

async function listNewsletterSegments(
  env: ResendAudienceEnv,
  doFetch: typeof fetch,
): Promise<Segment[]> {
  const res = await doFetch(`${RESEND_API}/segments?limit=100`, {
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}` },
  });
  if (!res.ok) throw new Error(`resend ${res.status}`);
  const { data } = (await res.json()) as { data?: Segment[] };
  return (data ?? []).filter((s) => s.name?.startsWith(NEWSLETTER_SEGMENT));
}

/** The `newsletter-<locale>` segment. Missing (the sync script never ran, or a new locale) →
 *  throws: a subscriber outside every language segment would never get an issue. */
async function newsletterSegment(
  env: ResendAudienceEnv,
  locale: string,
  doFetch: typeof fetch,
): Promise<Segment> {
  const name = `${NEWSLETTER_SEGMENT}${locale}`;
  const fresh = segmentCache && Date.now() - segmentCache.at < SEGMENT_TTL_MS;
  let hit = fresh ? segmentCache!.list.find((s) => s.name === name) : undefined;
  if (!hit) {
    segmentCache = {
      at: Date.now(),
      list: await listNewsletterSegments(env, doFetch),
    };
    hit = segmentCache.list.find((s) => s.name === name);
  }
  if (!hit) throw new Error(`resend segment ${name} missing`);
  return hit;
}

/** Put the contact in `newsletter-<locale>` and out of every other `newsletter-*` segment;
 *  `locale` null → out of all of them. Reads the contact's own segments first, so a repeat
 *  call adds and removes nothing. A missing `newsletter-<locale>` segment throws. An unknown
 *  contact (404) has no segments. Throws on any other Resend error. */
async function syncNewsletterSegments(
  env: ResendAudienceEnv,
  { email, locale }: { email: string; locale: string | null },
  doFetch: typeof fetch = fetch,
  resolved?: Segment,
): Promise<void> {
  if (!env.RESEND_API_KEY || !email) return;
  const headers = { Authorization: `Bearer ${env.RESEND_API_KEY}` };
  const target =
    resolved ??
    (locale ? await newsletterSegment(env, locale, doFetch) : undefined);
  const res = await doFetch(
    `${RESEND_API}/contacts/${email}/segments?limit=100`,
    {
      headers,
    },
  );
  if (!res.ok && res.status !== 404) throw new Error(`resend ${res.status}`);
  const current = res.ok
    ? (((await res.json()) as { data?: Segment[] }).data ?? []).filter((s) =>
        s.name?.startsWith(NEWSLETTER_SEGMENT),
      )
    : [];
  if (target && !current.some((s) => s.id === target.id)) {
    const add = await doFetch(
      `${RESEND_API}/contacts/${email}/segments/${target.id}`,
      {
        method: "POST",
        headers,
      },
    );
    if (!add.ok) throw new Error(`resend ${add.status}`);
  }
  for (const s of current) {
    if (s.id === target?.id) continue;
    const del = await doFetch(
      `${RESEND_API}/contacts/${email}/segments/${s.id}`,
      {
        method: "DELETE",
        headers,
      },
    );
    if (!del.ok && del.status !== 404) throw new Error(`resend ${del.status}`);
  }
}

/** The contact's topic subscriptions (`GET /contacts/{email}/topics`, first 100 — far
 *  above any real topic count). Null when the contact is unknown or the call fails. */
export async function getContactTopics(
  env: ResendAudienceEnv,
  { email }: { email: string },
  doFetch: typeof fetch = fetch,
): Promise<TopicSub[] | null> {
  if (!env.RESEND_API_KEY || !email) return null;
  try {
    const res = await doFetch(
      `${RESEND_API}/contacts/${email}/topics?limit=100`,
      { headers: { Authorization: `Bearer ${env.RESEND_API_KEY}` } },
    );
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: TopicSub[] };
    return Array.isArray(body.data) ? body.data : null;
  } catch {
    return null;
  }
}

/** The contact's global state (`GET /contacts/{email}`): `{ exists: false }` for an unknown
 *  address, `null` when Resend is unconfigured or the call fails. */
export async function getResendContact(
  env: ResendAudienceEnv,
  { email }: { email: string },
  doFetch: typeof fetch = fetch,
): Promise<{ exists: boolean; unsubscribed: boolean } | null> {
  if (!env.RESEND_API_KEY || !email) return null;
  try {
    const res = await doFetch(`${RESEND_API}/contacts/${email}`, {
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}` },
    });
    if (res.status === 404) return { exists: false, unsubscribed: false };
    if (!res.ok) return null;
    const body = (await res.json()) as { unsubscribed?: boolean };
    return { exists: true, unsubscribed: body.unsubscribed === true };
  } catch {
    return null;
  }
}

/** An admin turned email off on the person's request: opt out of `topicIds`, and with
 *  `stopAll` also the global unsubscribe. Never opts anything in. Throws on a Resend error. */
export async function turnOffContact(
  env: ResendAudienceEnv,
  {
    email,
    topicIds,
    stopAll,
  }: { email: string; topicIds: string[]; stopAll: boolean },
  doFetch: typeof fetch = fetch,
): Promise<void> {
  if (!env.RESEND_API_KEY || !email) return;
  const topics = topicIds.map((id): TopicSub => ({
    id,
    subscription: "opt_out",
  }));
  if (!topics.length && !stopAll) return;
  await upsertContact(
    env,
    email,
    stopAll ? { unsubscribed: true } : {},
    topics,
    retrying(doFetch),
  );
}

/** A sign-in email change: the new address gets the old contact's topics, segments (the
 *  newsletter language), global unsubscribe and `locale`, and the old contact is removed — so
 *  the person's choices follow them and nothing more goes to the old address. No old contact →
 *  nothing to move. Throws on a Resend error. */
export async function moveResendContact(
  env: ResendAudienceEnv,
  { from, to, locale }: { from: string; to: string; locale: string },
  doFetch: typeof fetch = fetch,
): Promise<"moved" | "none"> {
  if (!env.RESEND_API_KEY || !from || !to) return "none";
  const f = retrying(doFetch);
  const old = await getResendContact(env, { email: from }, f);
  if (!old) throw new Error("resend unavailable");
  if (!old.exists) return "none";
  const topics = (await getContactTopics(env, { email: from }, f)) ?? [];
  const headers = { Authorization: `Bearer ${env.RESEND_API_KEY}` };
  const segRes = await f(`${RESEND_API}/contacts/${from}/segments?limit=100`, {
    headers,
  });
  if (!segRes.ok && segRes.status !== 404)
    throw new Error(`resend ${segRes.status}`);
  const segments = segRes.ok
    ? (((await segRes.json()) as { data?: Segment[] }).data ?? [])
    : [];
  const created = await upsertContact(
    env,
    to,
    { unsubscribed: old.unsubscribed, properties: { locale } },
    topics.map((t) => ({ id: t.id, subscription: t.subscription })),
    f,
    segments.map((seg) => seg.id),
  );
  // An existing contact at the new address gets the segments one by one (a new one got them
  // on create). A segment it is already in answers 2xx or 409 — both fine.
  if (created === "updated")
    for (const seg of segments) {
      const add = await f(`${RESEND_API}/contacts/${to}/segments/${seg.id}`, {
        method: "POST",
        headers,
      });
      if (!add.ok && add.status !== 409)
        throw new Error(`resend ${add.status}`);
    }
  await deleteResendContact(env, { email: from }, f);
  return "moved";
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
