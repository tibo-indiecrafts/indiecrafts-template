/**
 * Run a verified erasure request end to end: the engine, the Clerk retry, the row, the audit and the email.
 *
 * @see docs/reference/shared/api/src/erasure/execute.md
 */
// One execution path for every way an erasure runs once the subject's email is known and
// verified: the public confirm link and the admin retry. The caller owns the checks
// (token, attempts, fingerprint, admin bearer); this owns what happens next.
import { logger } from "@indiecrafts/packages-shared-logger";
import {
  runErasure,
  type ErasureAdapter,
} from "@indiecrafts/packages-shared-compliance/shared";
import type { Env } from "../index";
import { buildErasureAdapters } from "./adapters";
import { readProfileLocale, sendErasureCompleteEmail } from "./email";
import { CLERK_STORE } from "./self";

export type ErasureRow = {
  id: number;
  user_id: string | null;
  email_fingerprint: string;
};

export type ExecuteDeps = {
  buildAdapters: (env: Env) => ErasureAdapter[];
  send: typeof sendErasureCompleteEmail;
};

export const defaultExecuteDeps: ExecuteDeps = {
  buildAdapters: buildErasureAdapters,
  send: sendErasureCompleteEmail,
};

export type ExecuteResult = {
  /** `completed` = every store erased; `confirmed` = something still failing (stays open). */
  status: "completed" | "confirmed";
  /** The Clerk user still exists — the one global session kill-switch did not fire. */
  clerkFailed: boolean;
  errors: unknown[];
};

/** A short, factual summary of what stays and why — sent in the completion email. */
function retainedSummary(hadErrors: boolean): string {
  const base =
    "Your account activity log is retained for legal accountability; everything else has been removed.";
  if (!hadErrors) return base;
  return `${base} Some records could not be removed automatically — our team has been notified and will finish this by hand.`;
}

/** Erase a verified subject across every store and record the outcome on the request row.
 *  Never throws for a store failure — those land in `errors`. */
export async function executeErasure(
  env: Env,
  row: ErasureRow,
  email: string,
  deps: ExecuteDeps,
  country: string | null,
): Promise<ExecuteResult> {
  const adapters = deps.buildAdapters(env);
  const ts = new Date().toISOString();
  // Read the recipient's locale for the completion email BEFORE the erasure runs — the
  // profile row is gone once it does.
  const locale = await readProfileLocale(env.MAIN_DB!, {
    userId: row.user_id,
    fingerprint: row.email_fingerprint,
  });
  // A dry-run preview first (mutates nothing), then the live pass that actually erases.
  await runErasure(adapters, email, {
    mode: "erase",
    dryRun: true,
    ts,
    fingerprint: row.email_fingerprint,
  });
  let receipt = await runErasure(adapters, email, {
    mode: "erase",
    dryRun: false,
    ts,
    fingerprint: row.email_fingerprint,
  });

  // Clerk is the one global session/credential kill-switch (every surface's auth is
  // Clerk). A failed Clerk delete must never be reported as a completed erasure — the
  // account is still live and the retained fingerprint is re-linkable. Retry it once
  // inline (same adapter, not a second client), then fail closed. Mirrors self.ts.
  let clerkFailed = false;
  if (receipt.errors.some((e) => e.store === CLERK_STORE)) {
    const clerkAdapter = adapters.find((a) => a.name === CLERK_STORE);
    try {
      if (!clerkAdapter) throw new Error("clerk adapter not configured");
      const retried = await clerkAdapter.delete(email);
      receipt = {
        ...receipt,
        errors: receipt.errors.filter((e) => e.store !== CLERK_STORE),
        stores: [...receipt.stores, retried],
      };
    } catch (error) {
      clerkFailed = true;
      logger.error("erasure clerk retry failed", {
        name: (error as Error)?.name,
      });
    }
  }

  const hadErrors = receipt.errors.length > 0;
  const status = hadErrors ? "confirmed" : "completed";
  await env
    .MAIN_DB!.prepare(
      "UPDATE erasure_requests SET status = ?, confirmed_at = COALESCE(confirmed_at, ?), completed_at = ?, result = ? WHERE id = ?",
    )
    .bind(status, ts, hadErrors ? null : ts, JSON.stringify(receipt), row.id)
    .run();

  // Audit + completion email only when the account was ACTUALLY deleted. If Clerk still
  // fails, the subject must not get an "erasure complete" email while still logged in, and
  // the trail must not claim completion — the `confirmed` row stays open for a retry.
  if (!clerkFailed) {
    // The erasure row above is already committed — a failure writing the audit trail
    // must never turn a completed erasure into a 500.
    try {
      const subjectId = row.user_id ?? row.email_fingerprint;
      await env
        .AUDIT_DB!.prepare(
          "INSERT INTO admin_audit (ts, event, actor_user_id, target_user_id, country, ip_hash) VALUES (?, ?, ?, ?, ?, NULL)",
        )
        .bind(ts, "erasure.completed", subjectId, subjectId, country)
        .run();
    } catch (error) {
      logger.error("erasure audit insert failed", {
        name: (error as Error)?.name,
      });
    }
    // Best-effort: a failed completion email must never undo the erasure already committed.
    try {
      await deps.send(env, {
        to: email,
        retained: retainedSummary(hadErrors),
        locale,
      });
    } catch (error) {
      logger.error("erasure complete email failed", {
        name: (error as Error)?.name,
      });
    }
  }

  return { status, clerkFailed, errors: receipt.errors };
}
