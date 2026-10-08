/**
 * Create and remove a throwaway Clerk test user for the e2e journeys.
 *
 * @see docs/reference/packages/web/auth/src/testing/clerk-user.md
 */

// Test-only: e2e specs import it; no app code does. Reads CLERK_SECRET_KEY from the run's env.
function clerkApi(path: string, init: RequestInit = {}) {
  return fetch(`https://api.clerk.com/v1${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      "content-type": "application/json",
    },
  });
}

/**
 * A throwaway `+clerk_test` user for the signed-in journeys, through the Clerk Backend API
 * (plain fetch, no extra dependency). A Clerk sign-in needs an existing user; a dev/test
 * instance accepts the code `424242` for a `+clerk_test` address, so no real user or
 * credential is involved. Create it in `beforeAll`, `remove()` it in `afterAll`.
 */
export function throwawayClerkUser(name: string) {
  const email = `e2e-${name}-${Date.now()}+clerk_test@example.com`;

  /** The user's id, or null once it is gone. */
  async function findId(): Promise<string | null> {
    const res = await clerkApi(
      `/users?email_address=${encodeURIComponent(email)}`,
    );
    const users = (await res.json()) as Array<{ id: string }>;
    return users[0]?.id ?? null;
  }

  return {
    email,
    findId,
    /** Creates the user; throws on a Clerk error. */
    async create() {
      const res = await clerkApi("/users", {
        method: "POST",
        body: JSON.stringify({
          email_address: [email],
          skip_password_requirement: true,
        }),
      });
      if (!res.ok)
        throw new Error(`create the throwaway Clerk user: ${res.status}`);
    },
    /** Deletes the user if it still exists. */
    async remove() {
      const id = await findId();
      if (id) await clerkApi(`/users/${id}`, { method: "DELETE" });
    },
  };
}
