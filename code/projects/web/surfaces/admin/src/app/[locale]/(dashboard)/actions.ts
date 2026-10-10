"use server";

/**
 * Run admin-gated role, session, and settings mutations, re-authorized and audited.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/actions.md
 */

import { auth, clerkClient } from "@clerk/nextjs/server";
import { isAdmin, type Roles } from "@indiecrafts/packages-shared-auth";
import { audit } from "@/lib/audit";
import { revokeActiveSessions, SESSION_LIMIT } from "@/lib/clerk-sessions";
import { apiFetch } from "@indiecrafts/packages-shared-utils/api-fetch";

/**
 * The role-grant path — the crown jewel. Open passwordless sign-up means anyone can
 * create an account, so the ONLY thing between a stranger and admin is this write. It
 * is admin-gated server-side, validates the target id, and audit-logged. Demotion is
 * deliberately not a dashboard action — an operator demotes in the Clerk Dashboard.
 */
type Result =
  | { ok: true }
  | { ok: false; error: "forbidden" | "invalid_user" | "invalid_session" | "failed" };

const USER_ID = /^user_[A-Za-z0-9]+$/;

/** The caller must be a signed-in admin (checked on the server, never trusted from the client). */
async function requireAdmin(): Promise<string> {
  const { userId, sessionClaims } = await auth();
  if (!userId || !isAdmin(sessionClaims)) throw new Error("forbidden");
  return userId;
}

export async function grantAdmin(targetUserId: string): Promise<Result> {
  let actor: string;
  try {
    actor = await requireAdmin();
  } catch {
    return { ok: false, error: "forbidden" };
  }
  if (!USER_ID.test(targetUserId)) return { ok: false, error: "invalid_user" };
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(targetUserId, {
      publicMetadata: { role: "admin" satisfies Roles },
    });
    await audit("admin.grant", { actor, target: targetUserId });
    return { ok: true };
  } catch {
    return { ok: false, error: "failed" };
  }
}

const SESSION_ID = /^sess_[A-Za-z0-9]+$/;

/** A live Clerk session, sanitized for the admin view — device/location are fetched
 *  live from Clerk, never stored (GDPR minimization). */
export type LiveSession = {
  id: string;
  lastActiveAt: number;
  device?: string;
  browser?: string;
  location?: string;
};

/** The target user's currently-active Clerk sessions (the source of truth for "active"),
 *  for the admin sessions screen. Read-only; returns [] on any failure. */
export async function listUserSessions(userId: string): Promise<LiveSession[]> {
  try {
    await requireAdmin();
  } catch {
    return [];
  }
  if (!USER_ID.test(userId)) return [];
  try {
    const client = await clerkClient();
    const { data } = await client.sessions.getSessionList({
      userId,
      status: "active",
      limit: SESSION_LIMIT,
    });
    return data.map((s) => ({
      id: s.id,
      lastActiveAt: s.lastActiveAt,
      device: s.latestActivity?.deviceType ?? undefined,
      browser: s.latestActivity?.browserName ?? undefined,
      location:
        [s.latestActivity?.city, s.latestActivity?.country].filter(Boolean).join(", ") ||
        undefined,
    }));
  } catch {
    return [];
  }
}

/** Revoke one live session — immediate sign-out on that device. Audited. */
export async function revokeSession(sessionId: string): Promise<Result> {
  let actor: string;
  try {
    actor = await requireAdmin();
  } catch {
    return { ok: false, error: "forbidden" };
  }
  if (!SESSION_ID.test(sessionId)) return { ok: false, error: "invalid_session" };
  try {
    const client = await clerkClient();
    await client.sessions.revokeSession(sessionId);
    await audit("admin.revoke_session", { actor, target: sessionId });
    return { ok: true };
  } catch {
    return { ok: false, error: "failed" };
  }
}

/** Revoke ALL of a user's active sessions ("sign out everywhere"). Audited. */
export async function revokeUserSessions(userId: string): Promise<Result> {
  let actor: string;
  try {
    actor = await requireAdmin();
  } catch {
    return { ok: false, error: "forbidden" };
  }
  if (!USER_ID.test(userId)) return { ok: false, error: "invalid_user" };
  let run: { revoked: number; total: number };
  try {
    run = await revokeActiveSessions(await clerkClient(), userId);
  } catch {
    // The session list failed — nothing was revoked, so there is nothing to audit.
    return { ok: false, error: "failed" };
  }
  // Audit any real sign-out, even a partial run; nothing revoked → no audit row.
  if (run.revoked > 0)
    await audit("admin.revoke_user_sessions", { actor, target: userId });
  return run.revoked === run.total ? { ok: true } : { ok: false, error: "failed" };
}

/** Write one operational setting (`GET/PUT /v1/settings`). The api itself validates
 *  the [min,max] bound and writes the `admin_audit` row — this action just forwards
 *  the bearer + the resolved actor id. */
export async function saveSetting(key: string, value: number): Promise<Result> {
  let actor: string;
  try {
    actor = await requireAdmin();
  } catch {
    return { ok: false, error: "forbidden" };
  }
  const url = process.env.API_URL,
    token = process.env.APP_API_TOKEN;
  if (!url || !token) return { ok: false, error: "failed" };
  try {
    const res = await apiFetch(`${url}/v1/settings`, {
      method: "PUT",
      idempotent: true,
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ key, value, actor }),
    });
    return res.ok ? { ok: true } : { ok: false, error: "failed" };
  } catch {
    return { ok: false, error: "failed" };
  }
}
