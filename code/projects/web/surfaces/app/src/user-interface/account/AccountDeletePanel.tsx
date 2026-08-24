"use client";

import { useAuth } from "@clerk/nextjs";
import {
  DeleteAccountSection,
  ExportSection,
  type DeleteAccountCopy,
  type ExportCopy,
} from "@indiecrafts/packages-shared-compliance/web";
import { useRouter } from "@/i18n/routing";

/**
 * Client wrapper around the shared `DeleteAccountSection` + `ExportSection` — wires
 * Clerk's `getToken`/`signOut` and routes home after a successful (or partial)
 * deletion. Copy is resolved server-side by the `/account` page and passed
 * in. Mirrors the website's `AccountDeletePanel`.
 */
export function AccountDeletePanel({
  copy,
  exportCopy,
  showExport,
}: {
  copy: DeleteAccountCopy;
  exportCopy: ExportCopy;
  showExport: boolean;
}) {
  const { getToken, signOut } = useAuth();
  const router = useRouter();

  async function handleDeleted() {
    await signOut();
    router.replace("/");
  }

  return (
    <div className="space-y-4">
      {showExport ? (
        <ExportSection
          copy={exportCopy}
          apiUrl={process.env.NEXT_PUBLIC_API_URL ?? ""}
          getToken={() => getToken()}
        />
      ) : null}
      {
        // @debt SECURITY - No beforeConfirm here. Clerk's useReverification only triggers on
        // a `session_reverification_required` error from the wrapped call. The erasure worker
        // doesn't emit that error, so wrapping it would resolve immediately without real re-auth.
        // Real step-up needs the worker to declare Clerk reverification, then wrap that fetch in
        // useReverification. The server-side JWT + typed-email match is the current protection.
      }
      <DeleteAccountSection
        copy={copy}
        apiUrl={process.env.NEXT_PUBLIC_API_URL ?? ""}
        getToken={() => getToken()}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
