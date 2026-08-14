import "server-only";

import { cache } from "react";
import { client } from "@indiecrafts/sanity/client";
import { consentPolicyVersionQuery } from "@/sanity/legal-queries";

/**
 * The privacy-policy version (its `lastUpdated` date) a visitor consents to when
 * they opt into the newsletter or waitlist. Stamped on the stored record as GDPR
 * proof of consent — "which version of the policy did they agree to, and when."
 * Server-derived (never from the request); empty string when no privacy
 * `legalPage` exists yet. React-`cache`d per request.
 */
export const getConsentPolicyVersion = cache(async (): Promise<string> => {
  try {
    const date = await client.fetch<string | null>(consentPolicyVersionQuery);
    return date ?? "";
  } catch {
    return "";
  }
});
