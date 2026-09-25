/**
 * Run the full erasure engine on an out-of-band Clerk user deletion.
 *
 * @see docs/reference/shared/api/src/erasure/clerk-deleted.md
 */
import { logger } from "@indiecrafts/packages-shared-logger";
import { sha256Hex } from "@indiecrafts/packages-shared-security/crypto";
import { defaultLocale } from "@indiecrafts/packages-shared-config";
import {
  runErasure,
  type ErasureAdapter,
} from "@indiecrafts/packages-shared-compliance/shared";
import type { Env } from "../index";
import { buildErasureAdapters } from "./adapters";
import { deleteResendContact, suppressResendContact } from "../resend-audience";
import { readChurnEvent } from "../consent/churn-store";
import { fetchEmailPreferences } from "../consent/email-preferences-sanity";

/**
 * Out-of-band Clerk deletion → the full erasure engine (clerk adapter excluded — the user
 * is already gone in Clerk). Reads the stored email + fingerprint BEFORE the engine
 * pseudonymizes the profile (Clerk's user.deleted payload carries no email). Best-effort:
 * the engine never throws; per-adapter failures land in receipt.errors (logged). No
 * completion email — the subject is deleted. `buildAdapters` is injectable for tests.
 */
export async function handleClerkUserDeleted(
  env: Env,
  userId: string,
  ts: string,
  buildAdapters: (env: Env) => ErasureAdapter[] = (e) =>
    buildErasureAdapters(e, { includeClerk: false }),
  del: typeof deleteResendContact = deleteResendContact,
  suppress: typeof suppressResendContact = suppressResendContact,
  fetchPrefs: typeof fetchEmailPreferences = fetchEmailPreferences,
): Promise<void> {
  if (!env.MAIN_DB) return;

  const profile = await env.MAIN_DB.prepare(
    "SELECT email, email_fingerprint FROM user_profiles WHERE user_id = ?",
  )
    .bind(userId)
    .first<{ email: string | null; email_fingerprint: string | null }>();

  // Self-service and RTBF erasure already anonymize user_profiles.email to this placeholder
  // (see d1.ts createCoreErasureAdapter.anonymize) BEFORE this webhook fires — self.ts / the
  // confirm route already suppressed/deleted the REAL email synchronously. Skip the Resend op
  // for the placeholder, or an already-suppressed contact gets re-suppressed under the junk
  // anonymized address. A real email here means an admin-direct Clerk deletion, where this
  // webhook is the first (and only) place processing it — that carve-out still applies below.
  const isAnonymizedPlaceholder =
    profile?.email === `deleted_${userId}@anonymized.local`;

  // Erasure carve-out: a churn_events row (Task 3, self-service only) means this is a
  // self-service churn → suppress the contact (win-back cohort, using the stored email
  // before pseudonymization). No row → explicit RTBF/admin deletion → pure-delete, same as
  // before. Best-effort — a Resend failure never blocks the erasure.
  if (profile?.email && !isAnonymizedPlaceholder) {
    const churn = await readChurnEvent(env.MAIN_DB, userId).catch(() => null);
    try {
      if (churn) {
        const { churnedTopicId, optOutTopicIds } = await fetchPrefs(
          env,
          defaultLocale,
        );
        await suppress(env, {
          email: profile.email,
          reason: churn.reason,
          churnedTopicId,
          optOutTopicIds,
        });
      } else {
        await del(env, { email: profile.email });
      }
    } catch (error) {
      logger.error("clerk-deleted resend op failed", {
        name: (error as Error)?.name,
      });
    }
  }

  // No profile, no fingerprint, or the engine's stores (DB/salt) are unavailable → fall
  // back to the partial pseudonymize (the prior behavior, needs only MAIN_DB) so a delete
  // still scrubs email + name and returns 200.
  if (
    !profile?.email_fingerprint ||
    !env.AUDIT_DB ||
    !env.GDPR_FINGERPRINT_SALT
  ) {
    await env.MAIN_DB.prepare(
      "UPDATE user_profiles SET email = ?, full_name = ?, deleted_at = ?, anonymized = 1 WHERE user_id = ?",
    )
      .bind(`deleted_${userId}@anonymized.local`, "Deleted User", ts, userId)
      .run();
    return;
  }

  const adapters = buildAdapters(env);
  const email = profile.email ?? `deleted_${userId}@anonymized.local`;
  const fingerprint = profile.email_fingerprint;
  await runErasure(adapters, email, {
    mode: "erase",
    dryRun: true,
    ts,
    fingerprint,
  });
  const receipt = await runErasure(adapters, email, {
    mode: "erase",
    dryRun: false,
    ts,
    fingerprint,
  });
  const hadErrors = receipt.errors.length > 0;
  if (hadErrors)
    logger.error("clerk-deleted erasure partial", {
      count: receipt.errors.length,
    });

  // Proof-of-erasure + audit — mirrors self.ts's bookkeeping exactly: an erasure_requests
  // row (no real single-use token here, so a throwaway hash satisfies the NOT NULL column,
  // same as self.ts) AND the admin_audit row. No email — the subject is gone.
  try {
    await env.MAIN_DB.prepare(
      "INSERT INTO erasure_requests (status, token_hash, token_expires_at, attempts, user_id, email_fingerprint, requested_at, confirmed_at, completed_at, due_at, result) " +
        "VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(
        hadErrors ? "confirmed" : "completed",
        await sha256Hex("clerk-deleted:" + crypto.randomUUID()),
        ts,
        userId,
        fingerprint,
        ts,
        ts,
        hadErrors ? null : ts,
        ts,
        JSON.stringify(receipt),
      )
      .run();
    await env.AUDIT_DB.prepare(
      "INSERT INTO admin_audit (ts, event, actor_user_id, target_user_id, country, ip_hash) VALUES (?, ?, ?, ?, NULL, NULL)",
    )
      .bind(ts, "erasure.clerk_deleted", userId, userId)
      .run();
  } catch (error) {
    logger.error("clerk-deleted audit write failed", {
      name: (error as Error)?.name,
    });
  }
}
