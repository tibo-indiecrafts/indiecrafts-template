"use server";

/**
 * Turn a person's emails off, or change an account's sign-in email — admin-gated and audited.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/email-actions.md
 */

import { auth, clerkClient } from "@clerk/nextjs/server";
import { isAdmin } from "@indiecrafts/packages-shared-auth";
import { apiFetch } from "@indiecrafts/packages-shared-utils/api-fetch";
import { audit } from "@/lib/audit";
import { revokeActiveSessions } from "@/lib/clerk-sessions";
import { OVERRIDE_REASONS, type OverrideReason } from "@/lib/override-reasons";

type Fail = {
  ok: false;
  error:
    | "forbidden"
    | "invalid"
    | "mismatch"
    | "same"
    | "admin_target"
    | "taken"
    | "unreachable"
    | "failed";
};
export type OverrideResult = { ok: true; resend: "ok" | "failed" | "skipped" } | Fail;
export type ChangeEmailResult =
  { ok: true; resend: "moved" | "none" | "failed" | "skipped" | "unreachable" } | Fail;

const USER_ID = /^user_[A-Za-z0-9]{10,40}$/;
const EMAIL = /^[^@\s/?#%\\]+@[^@\s/?#%\\]+\.[^@\s/?#%\\]+$/;
const KEY = /^[a-z][a-z0-9_-]{0,31}$/;
const isReason = (v: unknown): v is OverrideReason =>
  OVERRIDE_REASONS.includes(v as OverrideReason);

/** The caller must be a signed-in admin (checked on the server, never trusted from the client). */
async function adminId(): Promise<string | null> {
  const { userId, sessionClaims } = await auth();
  return userId && isAdmin(sessionClaims) ? userId : null;
}

/** POST a bearer-gated api route; null when the api is not configured or unreachable. */
async function postApi(
  path: string,
  body: unknown,
): Promise<{ status: number; data: Record<string, unknown> } | null> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await apiFetch(`${url}${path}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return {
      status: res.status,
      data: (await res.json().catch(() => ({}))) as Record<string, unknown>,
    };
  } catch {
    return null;
  }
}

/**
 * Turn email off for a person, on their request — some categories, or everything (`stopAll`:
 * every category + the Resend global unsubscribe). There is deliberately no "turn on": that
 * stays the person's own act. The api writes the proof rows and the audit (with the reason).
 */
export async function turnOffEmails(input: {
  userId?: string;
  email?: string;
  off: string[];
  stopAll: boolean;
  reason: string;
}): Promise<OverrideResult> {
  const actor = await adminId();
  if (!actor) return { ok: false, error: "forbidden" };
  const subject = input.userId
    ? USER_ID.test(input.userId) && { userId: input.userId }
    : input.email && EMAIL.test(input.email.trim()) && { email: input.email.trim() };
  if (
    !subject ||
    !isReason(input.reason) ||
    !Array.isArray(input.off) ||
    !input.off.every((k) => typeof k === "string" && KEY.test(k)) ||
    (input.off.length === 0 && input.stopAll !== true)
  )
    return { ok: false, error: "invalid" };
  const res = await postApi("/v1/admin/email-preferences", {
    ...subject,
    off: input.off,
    stopAll: input.stopAll === true,
    reason: input.reason,
    actorUserId: actor,
  });
  if (!res) return { ok: false, error: "unreachable" };
  if (res.status === 400) return { ok: false, error: "invalid" };
  if (res.status !== 200) return { ok: false, error: "failed" };
  const resend = res.data.resend;
  return {
    ok: true,
    resend: resend === "ok" || resend === "failed" ? resend : "skipped",
  };
}

/**
 * Change an account's sign-in email, for a person who lost access to the old one. A login
 * path, so: admin-only, the new address typed twice, a reason, never an admin's account (an
 * operator does that in the Clerk Dashboard). The new address is added verified + primary,
 * the old one removed, and every session revoked — whoever held the old address is signed
 * out. Clerk notifies the person; `user_profiles` follows via the `user.updated` webhook; the
 * api moves the Resend contact and audits `admin.change_email` with the reason.
 */
export async function changeSignInEmail(input: {
  userId: string;
  email: string;
  confirm: string;
  reason: string;
}): Promise<ChangeEmailResult> {
  const actor = await adminId();
  if (!actor) return { ok: false, error: "forbidden" };
  const email = input.email.trim().toLowerCase();
  if (!USER_ID.test(input.userId) || !EMAIL.test(email) || !isReason(input.reason))
    return { ok: false, error: "invalid" };
  if (email !== input.confirm.trim().toLowerCase())
    return { ok: false, error: "mismatch" };

  const client = await clerkClient();
  let from: string | null;
  try {
    const user = await client.users.getUser(input.userId);
    if (user.publicMetadata?.role === "admin")
      return { ok: false, error: "admin_target" };
    const old = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId);
    from = old?.emailAddress.toLowerCase() ?? null;
    if (from === email) return { ok: false, error: "same" };
    try {
      await client.emailAddresses.createEmailAddress({
        userId: input.userId,
        emailAddress: email,
        verified: true,
        primary: true,
      });
    } catch {
      // Clerk refuses an address another account already uses.
      return { ok: false, error: "taken" };
    }
    if (old) await client.emailAddresses.deleteEmailAddress(old.id);
    await revokeActiveSessions(client, input.userId);
  } catch {
    return { ok: false, error: "failed" };
  }

  const res = from
    ? await postApi("/v1/admin/email-preferences/move", {
        userId: input.userId,
        from,
        to: email,
        reason: input.reason,
        actorUserId: actor,
      })
    : null;
  if (!res || res.status !== 200) {
    // The api writes the audit with the reason; without it, keep a durable trace anyway.
    await audit("admin.change_email", { actor, target: input.userId });
    return { ok: true, resend: "unreachable" };
  }
  const resend = res.data.resend;
  return {
    ok: true,
    resend:
      resend === "moved" || resend === "none" || resend === "failed" ? resend : "skipped",
  };
}
