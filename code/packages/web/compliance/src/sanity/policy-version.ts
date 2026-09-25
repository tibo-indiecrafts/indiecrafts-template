/**
 * Read the privacy-policy version stamped on consent records.
 *
 * @see docs/reference/packages/web/compliance/src/sanity/policy-version.md
 */

import "server-only";

import { cache } from "react";
import { logger } from "@indiecrafts/packages-shared-logger";
import { client } from "@indiecrafts/packages-web-sanity/client";
import { consentPolicyVersionQuery } from "./queries";

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
  } catch (error) {
    logger.error("consent policy version lookup failed", { error });
    return "";
  }
});
