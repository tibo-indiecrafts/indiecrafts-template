/**
 * Defines the per-surface Clerk seam for the account data tab.
 *
 * @see docs/reference/packages/shared/compliance/src/shared/account-port.md
 */

import type { ChurnSurveyInput, ErasureSelfResult } from "./erasure-self";
import type { ExportResult } from "./export-self";

/**
 * The per-surface Clerk seam for the account "Your data" tab. Each surface builds
 * this from its own Clerk SDK (`@clerk/nextjs` for website/app, `@clerk/clerk-react`
 * for a plain-React host) so this brick — and the tab components below — stay
 * `@clerk/*`-free:
 *
 * - `getToken` — a fresh Clerk session token for the authenticated export/erasure calls.
 * - `submitErasure` — the erasure POST (+ optional churn survey) wrapped in the SDK's
 *   `useReverification` (client step-up + auto-retry) and mapped to an `ErasureSelfResult`.
 * - `onDeleted` — after a done/partial erasure: sign out + route home.
 */
export interface AccountAuth {
  getToken: () => Promise<string | null>;
  submitErasure: (
    email: string,
    survey?: ChurnSurveyInput,
  ) => Promise<ErasureSelfResult>;
  onDeleted: () => void | Promise<void>;
  /** The export POST wrapped in the SDK's `useReverification` (step-up + auto-retry).
   *  Optional: without it the export runs without a step-up and fails a stale session. */
  submitExport?: () => Promise<ExportResult>;
}
