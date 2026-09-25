/**
 * Pseudonymise subject emails in the subscriber and waitlistEntry docs.
 *
 * @see docs/reference/shared/api/src/erasure/sanity.md
 */
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import type {
  AdapterMatch,
  AdapterPreview,
  AdapterResult,
  ErasureAdapter,
} from "@indiecrafts/packages-shared-compliance/shared";

// The Sanity docs that hold a subject email. Pseudonymised (not deleted) so the
// marketing/waitlist records survive with the email replaced by its fingerprint.
const SANITY_ERASURE_TYPES = ["subscriber", "waitlistEntry"] as const;

// The minimal Sanity surface the adapter needs. The real client (raw-HTTP mutate
// against /data/mutate, or writeClient in a Next context) is wired in Phase 4.
export interface SanityErasureClient {
  findByEmail(type: string, email: string): Promise<Array<{ _id: string }>>;
  pseudonymise(id: string, patch: Record<string, unknown>): Promise<void>;
}

export function createSanityErasureAdapter(
  client: SanityErasureClient,
  salt: string,
): ErasureAdapter {
  const email = (e: string): string => e.toLowerCase().trim();

  return {
    name: "sanity",

    async findByEmail(e): Promise<AdapterMatch> {
      let total = 0;
      for (const type of SANITY_ERASURE_TYPES)
        total += (await client.findByEmail(type, email(e))).length;
      return { found: total > 0 };
    },

    async export(e): Promise<unknown> {
      const out: Record<string, Array<{ _id: string }>> = {};
      for (const type of SANITY_ERASURE_TYPES)
        out[type] = await client.findByEmail(type, email(e));
      return out;
    },

    async preview(e): Promise<AdapterPreview> {
      const wouldAnonymize: Record<string, number> = {};
      for (const type of SANITY_ERASURE_TYPES)
        wouldAnonymize[type] = (
          await client.findByEmail(type, email(e))
        ).length;
      return { store: "sanity", wouldAnonymize, wouldDelete: {} };
    },

    async anonymize(e): Promise<AdapterResult> {
      const fp = await fingerprintEmail(email(e), salt);
      const anonymized: Record<string, number> = {};
      for (const type of SANITY_ERASURE_TYPES) {
        const docs = await client.findByEmail(type, email(e));
        for (const doc of docs)
          await client.pseudonymise(doc._id, { email: fp, erased: true });
        anonymized[type] = docs.length;
      }
      return { store: "sanity", anonymized, deleted: {} };
    },

    async delete(): Promise<AdapterResult> {
      return { store: "sanity", anonymized: {}, deleted: {} };
    },
  };
}
