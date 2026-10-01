/**
 * Resolve Clerk user ids to their email, for operator screens that only store the id.
 *
 * @see docs/reference/projects/web/admin/src/lib/clerk-users.md
 */
import "server-only";
import { clerkClient } from "@clerk/nextjs/server";

type EmailFields = {
  primaryEmailAddress: { emailAddress: string } | null;
  emailAddresses: { emailAddress: string }[];
};

/** The user's primary email, else their first one, else null. */
export function primaryEmail(user: EmailFields): string | null {
  return (
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    null
  );
}

/** id → email for the given Clerk user ids (deduped, one call, max 100 — the page
 *  size of the feeds that use it). Fails open to `{}`, so a screen never breaks;
 *  the email is fetched live from Clerk, never stored. */
export async function fetchEmails(userIds: string[]): Promise<Record<string, string>> {
  const ids = [...new Set(userIds)].slice(0, 100);
  if (ids.length === 0) return {};
  try {
    const { data } = await (await clerkClient()).users.getUserList({ userId: ids, limit: 100 });
    return Object.fromEntries(
      data.flatMap((u) => {
        const email = primaryEmail(u);
        return email ? [[u.id, email]] : [];
      }),
    );
  } catch {
    return {};
  }
}
