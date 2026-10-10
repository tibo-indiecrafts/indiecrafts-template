/**
 * Read the admin users list (Clerk) and each user's marketing-email opt-in (the shared api).
 *
 * @see docs/reference/projects/web/admin/src/lib/users.md
 */
import "server-only";
import { clerkClient } from "@clerk/nextjs/server";
import { primaryEmail } from "@/lib/clerk-users";

export type UserRow = {
  id: string;
  email: string;
  role: string;
  created: number;
  lastSignIn: number | null;
};

/** Browse/search Clerk users (the admin app holds the secret). Read-only. */
export async function fetchUsers(query: string): Promise<UserRow[]> {
  try {
    const client = await clerkClient();
    const { data } = await client.users.getUserList({
      limit: 50,
      query: query || undefined,
      orderBy: "-created_at",
    });
    return data.map((u) => ({
      id: u.id,
      email: primaryEmail(u) ?? "—",
      role: typeof u.publicMetadata?.role === "string" ? u.publicMetadata.role : "—",
      created: u.createdAt,
      lastSignIn: u.lastSignInAt,
    }));
  } catch {
    return [];
  }
}

/** The marketing-email opt-in per user id, from the api (bearer-gated). Fail-open: on any
 *  error every id resolves to null ("not asked"), so the list never breaks. */
export async function fetchMarketingConsent(
  userIds: string[],
): Promise<Record<string, number | null>> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token || userIds.length === 0) return {};
  try {
    const res = await fetch(`${url}/v1/profiles/consent`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ userIds }),
      cache: "no-store",
    });
    if (!res.ok) return {};
    return (await res.json()) as Record<string, number | null>;
  } catch {
    return {};
  }
}
