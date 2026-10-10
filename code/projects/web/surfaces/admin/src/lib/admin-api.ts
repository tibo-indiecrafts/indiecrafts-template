/**
 * The admin server actions' shared plumbing: who the admin is, and a bearer POST to the api.
 *
 * @see docs/reference/projects/web/admin/src/lib/admin-api.md
 */
import "server-only";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@indiecrafts/packages-shared-auth";
import { apiFetch } from "@indiecrafts/packages-shared-utils/api-fetch";

/** The caller's user id when they are a signed-in admin — checked on the server, never trusted
 *  from the client. Null otherwise. */
export async function adminId(): Promise<string | null> {
  const { userId, sessionClaims } = await auth();
  return userId && isAdmin(sessionClaims) ? userId : null;
}

/** POST a bearer-gated api route; null when the api is not configured or unreachable. */
export async function postApi(
  path: string,
  body?: unknown,
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
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      // A cron tick or an erasure retry (Clerk + Sanity + D1 + email) can outlast apiFetch's
      // 10 s default — and a client abort may cancel the work half-way.
      timeoutMs: 60_000,
    });
    return {
      status: res.status,
      data: ((await res.json().catch(() => ({}))) ?? {}) as Record<string, unknown>,
    };
  } catch {
    return null;
  }
}
