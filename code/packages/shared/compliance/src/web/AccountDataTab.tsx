"use client";

/**
 * Renders the account panel for data export and account erasure.
 *
 * @see docs/reference/packages/shared/compliance/src/web/AccountDataTab.md
 */

import type { DeleteAccountCopy, ExportCopy } from "../shared/account-copy";
import type { AccountAuth } from "../shared/account-port";
import { DeleteAccountSection } from "./DeleteAccountSection";
import { ExportSection } from "./ExportSection";

export interface AccountDataTabProps {
  auth: AccountAuth;
  apiUrl: string;
  deleteCopy: DeleteAccountCopy;
  exportCopy: ExportCopy;
  /** Render the export section (the app's `features.account.export`). */
  showExport: boolean;
}

/**
 * The "Your data" account page — GDPR data export + account erasure, composed from
 * the shared sections (which own their own input + status). Clerk-free: the surface
 * passes an `AccountAuth` built from its SDK. Used as a custom `<UserProfile>` page on
 * every web surface (website/app via `@clerk/nextjs`).
 */
export function AccountDataTab({
  auth,
  apiUrl,
  deleteCopy,
  exportCopy,
  showExport,
}: AccountDataTabProps) {
  return (
    <div className="space-y-4">
      {showExport ? (
        <ExportSection
          copy={exportCopy}
          apiUrl={apiUrl}
          getToken={auth.getToken}
          submitExport={auth.submitExport}
        />
      ) : null}
      <DeleteAccountSection
        copy={deleteCopy}
        apiUrl={apiUrl}
        getToken={auth.getToken}
        onDeleted={auth.onDeleted}
        submitErasure={auth.submitErasure}
      />
    </div>
  );
}
