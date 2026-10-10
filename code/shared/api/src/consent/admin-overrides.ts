/**
 * Admin email overrides: read a person's email preferences, turn them off on request, move a contact.
 *
 * @see docs/reference/shared/api/src/consent/admin-overrides.md
 */
// The admin app (bearer-gated, its server action re-checks the admin role) reads a person's
// email preferences and acts on their request. An admin can only turn email OFF: a category,
// or everything (the global stop). Turning one on stays the person's own act. Each change is a
// consent row (source `admin`), mirrored to Resend, and an `admin_audit` row with a fixed reason
// code — never free text, as `admin_audit` outlives an erasure. The person is an account holder
// (`userId`) or, for a newsletter / waitlist / contact-form person, an email address.
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { logger } from "@indiecrafts/packages-shared-logger";
import { defaultLocale } from "@indiecrafts/packages-shared-config";
import type { Env } from "../index";
import { readProfileLocale } from "../erasure/email";
import { isNewsletterEmail } from "../newsletter/resend-sync";
import {
  getContactTopics,
  getResendContact,
  moveResendContact,
  turnOffContact,
} from "../resend-audience";
import { readState } from "./email-preferences";
import { writePreferences } from "./email-preferences-store";
import {
  fetchEmailPreferences,
  type PrefCategory,
} from "./email-preferences-sanity";
import { USER_ID } from "./history";

/** Why an admin acted — a fixed code, so the audit trail holds no personal data. */
export const OVERRIDE_REASONS = [
  "request_email",
  "request_phone",
  "complaint",
  "bounce",
  "other",
] as const;
export type OverrideReason = (typeof OVERRIDE_REASONS)[number];
const isReason = (v: unknown): v is OverrideReason =>
  OVERRIDE_REASONS.includes(v as OverrideReason);

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });

async function readBody(request: Request): Promise<Record<string, unknown>> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

type Deps = {
  fetchCategories?: (
    env: Env,
    locale: string,
  ) => Promise<{ categories: PrefCategory[] }>;
  doFetch?: typeof fetch;
};

/** Who the admin is looking at. From an email, an account with that address wins, so the
 *  account's own preference centre and the override always agree. */
type Subject = {
  userId: string | null;
  email: string | null;
  fingerprint: string | null;
};

async function resolveSubject(
  db: D1Database,
  salt: string,
  { userId, email }: { userId?: unknown; email?: unknown },
): Promise<Subject | null> {
  if (typeof userId === "string" && userId) {
    if (!USER_ID.test(userId)) return null;
    const row = await db
      .prepare(
        "SELECT email, email_fingerprint FROM user_profiles WHERE user_id = ?",
      )
      .bind(userId)
      .first<{ email: string | null; email_fingerprint: string | null }>();
    return {
      userId,
      email: row?.email ?? null,
      fingerprint: row?.email_fingerprint ?? null,
    };
  }
  if (!isNewsletterEmail(email)) return null;
  const address = email.trim().toLowerCase();
  const fingerprint = await fingerprintEmail(address, salt);
  const account = await db
    .prepare("SELECT user_id FROM user_profiles WHERE email_fingerprint = ?")
    .bind(fingerprint)
    .first<{ user_id: string }>();
  return { userId: account?.user_id ?? null, email: address, fingerprint };
}

/** Append an `admin_audit` row with its reason. Best-effort: logged, never thrown — the
 *  person's request is already honoured when this runs. */
async function auditAdmin(
  env: Env,
  event: string,
  actor: string,
  target: string,
  reason: OverrideReason | null,
): Promise<void> {
  if (!env.AUDIT_DB) return;
  try {
    await env.AUDIT_DB.prepare(
      "INSERT INTO admin_audit (ts, event, actor_user_id, target_user_id, country, ip_hash, reason) VALUES (?, ?, ?, ?, NULL, NULL, ?)",
    )
      .bind(new Date().toISOString(), event, actor, target, reason)
      .run();
  } catch (error) {
    logger.error("admin audit write failed", {
      event,
      name: (error as Error)?.name,
    });
  }
}

/** The audit target: the account, else the email fingerprint (never the address). */
const targetOf = (s: Subject) => s.userId ?? `fp:${s.fingerprint}`;

/**
 * `GET /v1/admin/email-preferences?userId=` or `?email=`, with `&actorUserId=` — each category
 * with the account's own choice (`granted`; `null` for a person without an account) and the
 * Resend topic state, plus the contact's global state. Resend unreachable → `resend: null`,
 * never a false "off". Looking is an access to personal data: audited as
 * `admin.view_email_prefs` (by fingerprint for a person without an account).
 */
export async function readOverrideState(
  request: Request,
  env: Env,
  deps: Deps = {},
): Promise<Response> {
  if (!env.MAIN_DB || !env.GDPR_FINGERPRINT_SALT)
    return json({ error: "unavailable" }, 503);
  const params = new URL(request.url).searchParams;
  const actor = params.get("actorUserId") ?? "";
  if (!USER_ID.test(actor)) return json({ error: "invalid" }, 400);
  const subject = await resolveSubject(env.MAIN_DB, env.GDPR_FINGERPRINT_SALT, {
    userId: params.get("userId"),
    email: params.get("email"),
  });
  if (!subject) return json({ error: "invalid" }, 400);
  const fetchCategories = deps.fetchCategories ?? fetchEmailPreferences;
  const locale = subject.userId
    ? await readProfileLocale(env.MAIN_DB, { userId: subject.userId })
    : defaultLocale;
  const { categories } = await fetchCategories(env, locale);
  // The account's own choices, exactly as its preference centre shows them.
  const granted = new Map<string, boolean>();
  if (subject.userId) {
    const state = await readState({
      env,
      db: env.MAIN_DB,
      fetchCategories: async () => ({ categories, notices: [] }),
      userId: subject.userId,
      locale,
    });
    for (const c of state.categories) granted.set(c.key, c.granted);
  }
  const doFetch = deps.doFetch ?? fetch;
  const contact = subject.email
    ? await getResendContact(env, { email: subject.email }, doFetch)
    : null;
  const topics =
    contact?.exists && subject.email
      ? await getContactTopics(env, { email: subject.email }, doFetch)
      : null;
  const topicState = (id?: string) =>
    id ? (topics?.find((t) => t.id === id)?.subscription ?? null) : null;
  await auditAdmin(
    env,
    "admin.view_email_prefs",
    actor,
    targetOf(subject),
    null,
  );
  return json(
    {
      subject: { userId: subject.userId, email: subject.email },
      categories: categories.map((c) => ({
        key: c.key,
        name: c.name,
        granted: subject.userId ? (granted.get(c.key) ?? false) : null,
        topic: topicState(c.resendTopicId),
      })),
      resend: contact,
    },
    200,
  );
}

/**
 * `POST /v1/admin/email-preferences` — `{ userId | email, off: string[], stopAll?, reason,
 * actorUserId }`. Turns the listed categories off (every category with `stopAll`, plus the
 * Resend global unsubscribe). There is no way to turn one on. An account gets its
 * `email_preferences` rows and proof rows (source `admin`); a person without an account gets
 * proof rows keyed by the email fingerprint. Resend is mirrored best-effort: a failure answers
 * `{ ok: true, resend: "failed" }` (the D1 change is the record).
 */
export async function applyOverride(
  request: Request,
  env: Env,
  deps: Deps = {},
): Promise<Response> {
  if (!env.MAIN_DB || !env.GDPR_FINGERPRINT_SALT)
    return json({ error: "unavailable" }, 503);
  const body = await readBody(request);
  const actor = typeof body.actorUserId === "string" ? body.actorUserId : "";
  const stopAll = body.stopAll === true;
  const off = Array.isArray(body.off) ? body.off : [];
  if (
    !USER_ID.test(actor) ||
    !isReason(body.reason) ||
    !off.every((k) => typeof k === "string") ||
    (off.length === 0 && !stopAll)
  )
    return json({ error: "invalid" }, 400);
  const reason = body.reason;
  const subject = await resolveSubject(env.MAIN_DB, env.GDPR_FINGERPRINT_SALT, {
    userId: body.userId,
    email: body.email,
  });
  if (!subject) return json({ error: "invalid" }, 400);

  const locale = subject.userId
    ? await readProfileLocale(env.MAIN_DB, { userId: subject.userId })
    : defaultLocale;
  const { categories } = await (deps.fetchCategories ?? fetchEmailPreferences)(
    env,
    locale,
  );
  const known = new Map(categories.map((c) => [c.key, c]));
  if (!off.every((k) => known.has(k as string)))
    return json({ error: "invalid_category" }, 400);
  const keys = stopAll ? [...known.keys()] : (off as string[]);
  const updates = keys.map((key) => ({ key, granted: false }));

  if (subject.userId) {
    await writePreferences(env.MAIN_DB, {
      userId: subject.userId,
      fingerprint: subject.fingerprint,
      updates,
      surface: "admin",
      country: null,
      marketingKeys: [...known.keys()],
      source: "admin",
    });
  } else {
    const now = new Date().toISOString();
    await env.MAIN_DB.batch(
      keys.map((key) =>
        env
          .MAIN_DB!.prepare(
            "INSERT OR IGNORE INTO consent_events (ts, subject_type, subject_id, email_fingerprint, consent_type, granted, policy_version, surface, source, country, ip_hash, idempotency_key) " +
              "VALUES (?, 'visitor', ?, ?, ?, 0, '1', 'admin', 'admin', NULL, NULL, ?)",
          )
          .bind(
            now,
            subject.fingerprint,
            subject.fingerprint,
            `email_pref:${key}`,
            `admin:${subject.fingerprint}:${now}:${key}`,
          ),
      ),
    );
  }

  let resend: "ok" | "failed" | "skipped" = "skipped";
  if (subject.email && env.RESEND_API_KEY) {
    try {
      await turnOffContact(
        env,
        {
          email: subject.email,
          topicIds: keys
            .map((k) => known.get(k)?.resendTopicId)
            .filter((id): id is string => Boolean(id)),
          stopAll,
        },
        deps.doFetch,
      );
      resend = "ok";
    } catch (error) {
      resend = "failed";
      logger.error("admin override resend sync failed", {
        name: (error as Error)?.name,
      });
    }
  }
  await auditAdmin(
    env,
    stopAll ? "admin.email_stop" : "admin.email_pref_off",
    actor,
    targetOf(subject),
    reason,
  );
  return json({ ok: true, resend }, 200);
}

/**
 * `POST /v1/admin/email-preferences/move` — `{ userId, from, to, reason, actorUserId }`, after
 * the admin changed the account's sign-in email in Clerk. The Resend contact follows (topics,
 * segments, global unsubscribe, `locale`) and the old one is removed; `user_profiles` follows on
 * its own (the Clerk `user.updated` webhook). Audited as `admin.change_email`.
 */
export async function moveContact(
  request: Request,
  env: Env,
  deps: Deps = {},
): Promise<Response> {
  if (!env.MAIN_DB) return json({ error: "unavailable" }, 503);
  const body = await readBody(request);
  const actor = typeof body.actorUserId === "string" ? body.actorUserId : "";
  const userId = typeof body.userId === "string" ? body.userId : "";
  if (
    !USER_ID.test(actor) ||
    !USER_ID.test(userId) ||
    !isReason(body.reason) ||
    !isNewsletterEmail(body.from) ||
    !isNewsletterEmail(body.to)
  )
    return json({ error: "invalid" }, 400);
  const reason = body.reason;
  const from = body.from.trim().toLowerCase();
  const to = body.to.trim().toLowerCase();
  const locale = await readProfileLocale(env.MAIN_DB, { userId });
  let resend: "moved" | "none" | "failed" | "skipped" = "skipped";
  if (env.RESEND_API_KEY) {
    try {
      resend = await moveResendContact(env, { from, to, locale }, deps.doFetch);
    } catch (error) {
      resend = "failed";
      logger.error("admin email move resend failed", {
        name: (error as Error)?.name,
      });
    }
  }
  await auditAdmin(env, "admin.change_email", actor, userId, reason);
  return json({ ok: true, resend }, 200);
}
