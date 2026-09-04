"use client";

import { useAuth, useReverification } from "@clerk/nextjs";
import {
  DeleteAccountSection,
  ExportSection,
  mapErasureResponse,
  rawErasureFetch,
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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

  // Step-up wired: wrap the raw erasure fetch so the worker's Clerk
  // reverification 403 (stale `fva`, Task 4) opens the modal and auto-retries.
  const eraseWithReverification = useReverification((email: string) =>
    rawErasureFetch({ apiUrl, getToken: () => getToken(), email }),
  );

  async function handleDeleted() {
    await signOut();
    router.replace("/");
  }

  return (
    <div className="space-y-4">
      {showExport ? (
        <ExportSection
          copy={exportCopy}
          apiUrl={apiUrl}
          getToken={() => getToken()}
        />
      ) : null}
      <DeleteAccountSection
        copy={copy}
        apiUrl={apiUrl}
        getToken={() => getToken()}
        onDeleted={handleDeleted}
        submitErasure={async (email) =>
          mapErasureResponse(await eraseWithReverification(email))
        }
      />
    </div>
  );
}
