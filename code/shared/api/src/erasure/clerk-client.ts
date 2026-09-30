/**
 * Create the real Clerk erasure client over @clerk/backend.
 *
 * @see docs/reference/shared/api/src/erasure/clerk-client.md
 */
import { withTimeout } from "../http";
import type { ClerkClient } from "@clerk/backend";
import type { ClerkErasureClient } from "./clerk";

// Real ClerkErasureClient over @clerk/backend. The factory param is injectable
// so tests supply a fake client and never load the real SDK. The default factory
// dynamically imports @clerk/backend, so it stays out of the module graph until
// erasure actually runs. CLERK_SECRET_KEY is required.
export function createRealClerkClient(
  secretKey: string,
  clerkFactory: () => Promise<ClerkClient> = async () => {
    const { createClerkClient } = await import("@clerk/backend");
    return createClerkClient({ secretKey });
  },
): ClerkErasureClient {
  return {
    async findUserIdByEmail(email) {
      const clerk = await clerkFactory();
      const { data } = await withTimeout(
        clerk.users.getUserList({ emailAddress: [email.toLowerCase().trim()] }),
        5000,
        "clerk",
      );
      return data[0]?.id ?? null;
    },
    async exportUser(userId) {
      const clerk = await clerkFactory();
      return withTimeout(clerk.users.getUser(userId), 5000, "clerk");
    },
    async deleteUser(userId) {
      const clerk = await clerkFactory();
      await withTimeout(clerk.users.deleteUser(userId), 5000, "clerk");
    },
  };
}
