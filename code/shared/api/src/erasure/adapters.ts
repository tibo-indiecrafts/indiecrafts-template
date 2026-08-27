import type { ErasureAdapter } from "@indiecrafts/packages-shared-compliance/shared";
import { type Env } from "../index";
import { createCoreErasureAdapter, createAuditErasureAdapter } from "./d1";
import { createClerkErasureAdapter } from "./clerk";
import { createSanityErasureAdapter } from "./sanity";
import { createOrdersErasureAdapter } from "./orders";
import { createRealClerkClient } from "./clerk-client";
import { createRealSanityClient } from "./sanity-client";

/**
 * The real GDPR erasure adapter set, assembled from `env` secrets. One home for the
 * list that confirm.ts, self.ts, and the Clerk-delete webhook all share.
 *
 * `includeClerk: false` drops the Clerk adapter — used by the `user.deleted` webhook,
 * where the Clerk user is already gone (a Clerk delete would 404). Order is preserved:
 * d1-core, d1-audit, [clerk], sanity, orders.
 */
export function buildErasureAdapters(
  env: Env,
  opts: { includeClerk?: boolean } = {},
): ErasureAdapter[] {
  const includeClerk = opts.includeClerk ?? true;
  return [
    createCoreErasureAdapter(env.CORE_DB!, env.GDPR_FINGERPRINT_SALT!),
    createAuditErasureAdapter(env.DB!, env.CORE_DB!, env.GDPR_FINGERPRINT_SALT!),
    ...(includeClerk
      ? [createClerkErasureAdapter(createRealClerkClient(env.CLERK_SECRET_KEY!))]
      : []),
    createSanityErasureAdapter(
      createRealSanityClient({
        projectId: env.SANITY_PROJECT_ID!,
        dataset: env.SANITY_DATASET!,
        apiVersion: env.SANITY_API_VERSION ?? "2025-01-01",
        writeToken: env.SANITY_API_WRITE_TOKEN!,
        readToken: env.SANITY_API_READ_TOKEN,
      }),
      env.GDPR_FINGERPRINT_SALT!,
    ),
    createOrdersErasureAdapter(),
  ];
}
