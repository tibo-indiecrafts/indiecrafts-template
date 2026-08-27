"use client";

import { useAuth, useReverification } from "@clerk/nextjs";
import {
  DeleteAccountSection,
  ExportSection,
  makeErasureFetcher,
  type DeleteAccountCopy,
  type ErasureSelfResult,
  type ExportCopy,
} from "@indiecrafts/packages-shared-compliance/web";
import { useRouter } from "@/i18n/routing";

/**
 * Client wrapper around the shared `DeleteAccountSection` + `ExportSection` — wires
 * Clerk's `getToken`/`signOut` and routes home after a successful (or partial)
 * deletion. Copy is resolved server-side by the `/account` page and passed
 * in; `useAuth` isn't re-exported by `@indiecrafts/packages-web-auth` (it only
 * re-exports the themed `SignInButton`/`UserButton`/`Signed{In,Out}`), so this
 * imports it straight from `@clerk/nextjs` (already a direct dep here).
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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

  // Step-up reverification: wrap the erasure POST so a stale session triggers Clerk's
  // step-up modal (the worker returns the reverification-error shape) before it lands.
  const erase = useReverification(
    makeErasureFetcher({ apiUrl, getToken: () => getToken() }),
  );
  const submit = async (email: string): Promise<ErasureSelfResult> => {
    const result = await erase(email);
    return typeof result === "string" ? (result as ErasureSelfResult) : "error";
  };

  async function handleDeleted() {
    await signOut();
    router.replace("/");
  }

  return (
    <div className="space-y-4">
      {showExport ? (
        <ExportSection copy={exportCopy} apiUrl={apiUrl} getToken={() => getToken()} />
      ) : null}
      <DeleteAccountSection
        copy={copy}
        apiUrl={apiUrl}
        getToken={() => getToken()}
        onDeleted={handleDeleted}
        submit={submit}
      />
    </div>
  );
}
