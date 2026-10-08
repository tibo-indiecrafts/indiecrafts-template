/**
 * Erase a Resend contact (delete, not pseudonymise) via the erasure adapter.
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
  type ResendAudienceEnv,
} from "../resend-audience";

// Resend mirrors our own records (newsletter subscribers, marketing consent): it holds the
// email plus topic flags, nothing that is not already in D1/Sanity. So erasure IS deletion
// (like `clerk`), and `delete` always runs — a 404 (no contact) is success. No lookup in
// `findByEmail`/`export`/`preview`: the engine reads none of them to decide, and a GET per
// call would add a Resend dependency to the export route for data we already export.
export function createResendErasureAdapter(
  env: ResendAudienceEnv,
  doFetch: typeof fetch = fetchWithTimeout,
): ErasureAdapter {
  return {
    name: "resend",

    async findByEmail(): Promise<AdapterMatch> {
      return { found: false };
    },

    async export(): Promise<unknown> {
      return null;
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
