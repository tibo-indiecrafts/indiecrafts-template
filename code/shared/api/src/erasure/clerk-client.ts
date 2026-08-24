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
      const { data } = await clerk.users.getUserList({
        emailAddress: [email.toLowerCase().trim()],
      });
      return data[0]?.id ?? null;
    },
    async exportUser(userId) {
      const clerk = await clerkFactory();
      return clerk.users.getUser(userId);
    },
    async deleteUser(userId) {
      const clerk = await clerkFactory();
      await clerk.users.deleteUser(userId);
    },
  };
}
