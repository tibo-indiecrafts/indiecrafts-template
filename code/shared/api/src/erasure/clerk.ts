import type {
  ErasureAdapter,
  AdapterMatch,
  AdapterPreview,
  AdapterResult,
} from "@indiecrafts/packages-shared-compliance/shared";

// The minimal Clerk surface the erasure adapter needs. The real implementation
// (dynamic import("@clerk/backend") + CLERK_SECRET_KEY) is wired in Phase 4;
// keeping it an injected interface makes this adapter unit-testable with a mock
// and defers the secret + dependency to where the /v1/erasure route assembles it.
export interface ClerkErasureClient {
  findUserIdByEmail(email: string): Promise<string | null>;
  exportUser(userId: string): Promise<unknown>;
  deleteUser(userId: string): Promise<void>;
}

// Clerk holds the identity + credentials. Its erasure IS deletion (there is no
// "pseudonymised Clerk user" — the pseudonymised proof lives in D1/Sanity). So
// anonymize() is a no-op and delete() removes the user.
export function createClerkErasureAdapter(
  client: ClerkErasureClient,
): ErasureAdapter {
  return {
    name: "clerk",

    async findByEmail(email): Promise<AdapterMatch> {
      return { found: (await client.findUserIdByEmail(email)) !== null };
    },

    async export(email): Promise<unknown> {
      const id = await client.findUserIdByEmail(email);
      return id ? await client.exportUser(id) : null;
    },

    async preview(email): Promise<AdapterPreview> {
      const id = await client.findUserIdByEmail(email);
      return {
        store: "clerk",
        wouldAnonymize: {},
        wouldDelete: { clerk_user: id ? 1 : 0 },
      };
    },

    async anonymize(): Promise<AdapterResult> {
      return { store: "clerk", anonymized: {}, deleted: {} };
    },

    async delete(email): Promise<AdapterResult> {
      const id = await client.findUserIdByEmail(email);
      if (id) await client.deleteUser(id);
      return {
        store: "clerk",
        anonymized: {},
        deleted: { clerk_user: id ? 1 : 0 },
      };
    },
  };
}
