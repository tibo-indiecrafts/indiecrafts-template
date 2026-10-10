/**
 * Revoke every active Clerk session of a user — shared by the admin's session and email actions.
 *
 * @see docs/reference/projects/web/admin/src/lib/clerk-sessions.md
 */
import "server-only";
import type { clerkClient } from "@clerk/nextjs/server";

type Clerk = Awaited<ReturnType<typeof clerkClient>>;

// Clerk pages session lists at 10 by default; 500 is its max.
// ponytail: one page — a user with > 500 live sessions keeps the rest; page with `offset` if that ever happens.
export const SESSION_LIMIT = 500;

/** Revoke every active session of a user. Tries them all, even when one fails, and
 *  counts the revoked ones, so the caller audits only a real change. */
export async function revokeActiveSessions(
  client: Clerk,
  userId: string,
): Promise<{ revoked: number; total: number }> {
  const { data } = await client.sessions.getSessionList({
    userId,
    status: "active",
    limit: SESSION_LIMIT,
  });
  const results = await Promise.allSettled(
    data.map((s) => client.sessions.revokeSession(s.id)),
  );
  const revoked = results.filter((r) => r.status === "fulfilled").length;
  return { revoked, total: data.length };
}
