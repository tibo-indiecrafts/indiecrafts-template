/**
 * Export and erase a Resend contact (delete, not pseudonymise) via the erasure adapter.
 *
 * @see docs/reference/shared/api/src/erasure/resend.md
 */
import type {
  AdapterMatch,
  AdapterPreview,
  AdapterResult,
  ErasureAdapter,
} from "@indiecrafts/packages-shared-compliance/shared";
import { fetchWithTimeout } from "../http";
import {
  deleteResendContact,
  getContactTopics,
  type ResendAudienceEnv,
} from "../resend-audience";

const RESEND_API = "https://api.resend.com";

// Resend is the newsletter's only list and mirrors marketing consent: it holds the email,
// the global flag, topic flags, the `locale` property and the language segments. Erasure IS
// deletion (like `clerk`), and `delete` always runs — a 404 (no contact) is success. `export`
// reads the contact for a DSAR bundle (best-effort: any failure → null, never a throw).
// `findByEmail`/`preview` make no call: the engine reads neither to decide.
export function createResendErasureAdapter(
  env: ResendAudienceEnv,
  doFetch: typeof fetch = fetchWithTimeout,
): ErasureAdapter {
  return {
    name: "resend",

    async findByEmail(): Promise<AdapterMatch> {
      return { found: false };
    },

    async export(e): Promise<unknown> {
      if (!env.RESEND_API_KEY) return null;
      const email = e.toLowerCase().trim();
      const headers = { Authorization: `Bearer ${env.RESEND_API_KEY}` };
      try {
        const res = await doFetch(`${RESEND_API}/contacts/${email}`, {
          headers,
        });
        if (!res.ok) return null;
        const c = (await res.json()) as {
          email?: string;
          unsubscribed?: boolean;
          created_at?: string;
          properties?: unknown;
        };
        const seg = await doFetch(
          `${RESEND_API}/contacts/${email}/segments?limit=100`,
          { headers },
        );
        const segments = seg.ok
          ? (
              ((await seg.json()) as { data?: { name: string }[] }).data ?? []
            ).map((s) => s.name)
          : null;
        return {
          email: c.email,
          unsubscribed: c.unsubscribed,
          created_at: c.created_at,
          properties: c.properties,
          topics: await getContactTopics(env, { email }, doFetch),
          segments,
        };
      } catch {
        return null;
      }
    },

    async preview(): Promise<AdapterPreview> {
      return { store: "resend", wouldAnonymize: {}, wouldDelete: {} };
    },

    async anonymize(): Promise<AdapterResult> {
      return { store: "resend", anonymized: {}, deleted: {} };
    },

    async delete(email): Promise<AdapterResult> {
      await deleteResendContact(
        env,
        { email: email.toLowerCase().trim() },
        doFetch,
      );
      // ponytail: 1 = "deleted or already absent" — Resend's 404 hides which.
      return {
        store: "resend",
        anonymized: {},
        deleted: { resend_contact: 1 },
      };
    },
  };
}
