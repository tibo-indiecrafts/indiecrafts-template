import type { ErasureAdapter } from "@indiecrafts/packages-shared-compliance/shared";
import type { Env } from "../index";
import { createCoreErasureAdapter, createAuditErasureAdapter } from "./d1";
import { createClerkErasureAdapter } from "./clerk";
import { createSanityErasureAdapter } from "./sanity";
import { createOrdersErasureAdapter } from "./orders";
import { createRealClerkClient } from "./clerk-client";
import { createRealSanityClient } from "./sanity-client";

/**
 * The real erasure adapters assembled from `env` secrets. One home for the set used by
 * confirm.ts, self.ts, and the Clerk user.deleted webhook.
 * - `clerk` is included only when `includeClerk !== false` AND the secret is set — the
 *   webhook path (delete already done in Clerk) passes `{ includeClerk: false }`.
 * - `sanity` is included only when its secrets are all present, so we never construct a
 *   broken client (the webhook runs best-effort without a Sanity preflight).
 */
export function buildErasureAdapters(
  env: Env,
  opts: { includeClerk?: boolean } = {},
): ErasureAdapter[] {
  // The d1-core pseudonymisation (retained user_id/fingerprint) is non-linkable only
  // because the Clerk user is actually deleted — the `clerk` adapter below, gated by
  // the CLERK_SECRET_KEY 503-guard, is what makes that true.
  const list: ErasureAdapter[] = [
    createCoreErasureAdapter(env.MAIN_DB!, env.GDPR_FINGERPRINT_SALT!),
    createAuditErasureAdapter(
      env.AUDIT_DB!,
      env.MAIN_DB!,
      env.GDPR_FINGERPRINT_SALT!,
    ),
  ];
  if (opts.includeClerk !== false && env.CLERK_SECRET_KEY)
    list.push(
      createClerkErasureAdapter(createRealClerkClient(env.CLERK_SECRET_KEY)),
    );
  if (env.SANITY_API_WRITE_TOKEN && env.SANITY_PROJECT_ID && env.SANITY_DATASET)
    list.push(
      createSanityErasureAdapter(
        createRealSanityClient({
          projectId: env.SANITY_PROJECT_ID,
          dataset: env.SANITY_DATASET,
          apiVersion: env.SANITY_API_VERSION ?? "2025-01-01",
          writeToken: env.SANITY_API_WRITE_TOKEN,
          readToken: env.SANITY_API_READ_TOKEN,
        }),
        env.GDPR_FINGERPRINT_SALT!,
      ),
    );
  list.push(createOrdersErasureAdapter());
  return list;
}
