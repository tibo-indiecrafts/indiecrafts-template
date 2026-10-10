"use server";

/**
 * Turn a person's emails off, or change an account's sign-in email — admin-gated and audited.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/email-actions.md
 */

import { clerkClient } from "@clerk/nextjs/server";
import { isOverrideReason } from "@indiecrafts/packages-shared-compliance/shared";
import { adminId, postApi } from "@/lib/admin-api";
import { audit } from "@/lib/audit";
import { revokeActiveSessions } from "@/lib/clerk-sessions";
import { EMAIL, USER_ID } from "@/lib/ids";

type Fail = {
  ok: false;
  error:
    | "forbidden"
    | "invalid"
    | "mismatch"
    | "same"
    | "admin_target"
    | "taken"
    | "partial"
    | "unreachable"
    | "failed";
};
export type OverrideResult = { ok: true; resend: "ok" | "failed" | "skipped" } | Fail;
export type ChangeEmailResult =
  { ok: true; resend: "moved" | "none" | "failed" | "skipped" | "unreachable" } | Fail;

const KEY = /^[a-z][a-z0-9_-]{0,31}$/;

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
    !isOverrideReason(input.reason) ||
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
  if (res.status === 403) return { ok: false, error: "forbidden" };
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
 * operator does that in the Clerk Dashboard). In this order, each step only after the last:
 *
 * 1. Add the new address, verified + primary. From here the change is real, so it is audited
 *    at once (`admin.change_email` + the reason), whatever the next steps do.
 * 2. Revoke every session — whoever held the old address is signed out. Not all revoked →
 *    `partial`.
 * 3. Remove the old address. Refused → `partial`: the account then has both addresses, which the
 *    operator finishes in the Clerk Dashboard; the dialog says so.
 *
 * Clerk notifies the person; `user_profiles` follows via the `user.updated` webhook; the api
 * then moves the Resend contact (best-effort).
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
  if (
    !USER_ID.test(input.userId) ||
    !EMAIL.test(email) ||
    !isOverrideReason(input.reason)
  )
    return { ok: false, error: "invalid" };
  if (email !== input.confirm.trim().toLowerCase())
    return { ok: false, error: "mismatch" };
  const reason = input.reason;

  const client = await clerkClient();
  let user;
  try {
    user = await client.users.getUser(input.userId);
  } catch {
    return { ok: false, error: "failed" };
  }
  if (user.publicMetadata?.role === "admin") return { ok: false, error: "admin_target" };
  const old = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId);
  const from = old?.emailAddress.toLowerCase() ?? null;
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
  await audit("admin.change_email", { actor, target: input.userId, reason });

  let complete = true;
  try {
    const { revoked, total } = await revokeActiveSessions(client, input.userId);
    if (revoked < total) complete = false;
  } catch {
    complete = false;
  }
  if (old) {
    try {
      await client.emailAddresses.deleteEmailAddress(old.id);
    } catch {
      complete = false;
    }
  }
  if (!complete) return { ok: false, error: "partial" };

  const res = from
    ? await postApi("/v1/admin/email-preferences/move", {
        userId: input.userId,
        from,
        to: email,
        actorUserId: actor,
      })
    : null;
  if (!from) return { ok: true, resend: "none" };
  if (!res || res.status !== 200) return { ok: true, resend: "unreachable" };
  const resend = res.data.resend;
  return {
    ok: true,
    resend:
      resend === "moved" || resend === "none" || resend === "failed" ? resend : "skipped",
  };
}
