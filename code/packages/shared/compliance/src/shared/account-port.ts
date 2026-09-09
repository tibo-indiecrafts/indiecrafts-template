import type { ErasureSelfResult } from "./erasure-self";

/**
 * The per-surface Clerk seam for the account "Your data" tab. Each surface builds
 * this from its own Clerk SDK (`@clerk/nextjs` for website/app, `@clerk/clerk-react`
 * for the Electron renderer) so this brick — and the tab components below — stay
 * `@clerk/*`-free:
 *
 * - `getToken` — a fresh Clerk session token for the authenticated export/erasure calls.
 * - `submitErasure` — the erasure POST wrapped in the SDK's `useReverification`
 *   (client step-up + auto-retry) and mapped to an `ErasureSelfResult`.
 * - `onDeleted` — after a done/partial erasure: sign out + route home.
 */
export interface AccountAuth {
  getToken: () => Promise<string | null>;
  submitErasure: (email: string) => Promise<ErasureSelfResult>;
  onDeleted: () => void | Promise<void>;
}
