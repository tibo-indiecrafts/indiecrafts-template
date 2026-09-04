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

  // Step-up wired: wrap the raw erasure fetch so the worker's Clerk
  // reverification 403 (stale `fva`, Task 4) opens the modal and auto-retries.
  const eraseWithReverification = useReverification((email: string) =>
    // skipCache: the post-reverification retry must mint a FRESH token so it
    // carries the updated `fva`; a cached (~60s) token still has the stale `fva`
    // and would re-trip the server gate, silently defeating the step-up.
    rawErasureFetch({
      apiUrl,
      getToken: () => getToken({ skipCache: true }),
      email,
    }),
  );

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
        submitErasure={async (email) =>
          mapErasureResponse(await eraseWithReverification(email))
        }
      />
    </div>
  );
}
