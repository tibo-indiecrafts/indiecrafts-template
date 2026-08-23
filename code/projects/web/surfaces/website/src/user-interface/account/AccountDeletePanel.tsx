"use client";

import { useAuth } from "@clerk/nextjs";
import {
  DeleteAccountSection,
  type DeleteAccountCopy,
} from "@indiecrafts/packages-shared-compliance/web";
import { useRouter } from "@/i18n/routing";

/**
 * Client wrapper around the shared `DeleteAccountSection` — wires Clerk's
 * `getToken`/`signOut` and routes home after a successful (or partial)
 * deletion. Copy is resolved server-side by the `/account` page and passed
 * in; `useAuth` isn't re-exported by `@indiecrafts/packages-web-auth` (it only
 * re-exports the themed `SignInButton`/`UserButton`/`Signed{In,Out}`), so this
 * imports it straight from `@clerk/nextjs` (already a direct dep here).
 */
export function AccountDeletePanel({ copy }: { copy: DeleteAccountCopy }) {
  const { getToken, signOut } = useAuth();
  const router = useRouter();

  async function handleDeleted() {
    await signOut();
    router.push("/");
  }

  return (
    <DeleteAccountSection
      copy={copy}
      apiUrl={process.env.NEXT_PUBLIC_API_URL ?? ""}
      getToken={() => getToken()}
      onDeleted={handleDeleted}
    />
  );
}
