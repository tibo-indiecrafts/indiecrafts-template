import { UserButton, useAuth, useReverification } from "@clerk/clerk-react";
import { useIntl } from "react-intl";
import {
  AccountConsentTab,
  AccountDataTab,
  buildDeleteAccountCopy,
  buildExportCopy,
  mapErasureResponse,
  rawErasureFetch,
  type AccountAuth,
} from "@indiecrafts/packages-shared-compliance/web";
import {
  DEFAULT_CONSENT_CATEGORIES,
  resolveCategories,
} from "@indiecrafts/packages-shared-compliance/shared";
import { apiUrl, features, policyVersion, STORAGE_KEYS } from "../../config";

const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function ShieldIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function DataIcon() {
  return (
    <svg {...iconProps}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5" />
      <path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3" />
    </svg>
  );
}

/** Builds the `AccountAuth` from `@clerk/clerk-react` — the desktop sibling of the
 *  nextjs `useClerkAuthPort`. Step-up wired: `useReverification` wraps the raw erasure
 *  fetch so the worker's 403 (stale `fva`) opens the modal and retries with a fresh token. */
function useClerkReactAuthPort(): AccountAuth {
  const { getToken, signOut } = useAuth();
  const eraseWithReverification = useReverification((email: string) =>
    // skipCache: the retry must mint a FRESH token carrying the updated `fva`; a cached
    // (~60s) token still has the stale `fva` and would re-trip the server gate.
    rawErasureFetch({
      apiUrl: apiUrl ?? "",
      getToken: () => getToken({ skipCache: true }),
      email,
    }),
  );
  return {
    getToken: () => getToken(),
    submitErasure: async (email) =>
      mapErasureResponse(await eraseWithReverification(email)),
    onDeleted: async () => {
      // Virtual routing (no URL) — signing out flips <SignedIn> back to the sign-in panel.
      await signOut();
    },
  };
}

function ConsentContent() {
  const t = useIntl();
  const cat = (key: string) => ({
    title: t.formatMessage({ id: `consent.categories.${key}.title` }),
    description: t.formatMessage({
      id: `consent.categories.${key}.description`,
    }),
  });
  const categories = resolveCategories(DEFAULT_CONSENT_CATEGORIES, {
    necessary: cat("necessary"),
    analytics: cat("analytics"),
    marketing: cat("marketing"),
  });
  return (
    <AccountConsentTab
      storageKey={STORAGE_KEYS.cookieConsent}
      version={policyVersion}
      categories={categories}
      title={t.formatMessage({ id: "account.tabs.consentTitle" })}
      saveLabel={t.formatMessage({ id: "account.tabs.consentSave" })}
    />
  );
}

function DataContent() {
  const t = useIntl();
  const auth = useClerkReactAuthPort();
  const deleteCopy = buildDeleteAccountCopy((k) =>
    t.formatMessage({ id: `account.delete.${k}` }),
  );
  const exportCopy = buildExportCopy((k) =>
    t.formatMessage({ id: `account.export.${k}` }),
  );
  return (
    <AccountDataTab
      auth={auth}
      apiUrl={apiUrl ?? ""}
      deleteCopy={deleteCopy}
      exportCopy={exportCopy}
      showExport={features.exportAccount}
    />
  );
}

/**
 * The desktop account trigger — Clerk's `<UserButton>` (avatar → Manage account +
 * Sign out) with Clerk's built-in Profile/Security tabs plus our two custom pages:
 * "Privacy & consent" and "Your data". The `@clerk/clerk-react` sibling of the nextjs
 * `AccountButton`, reusing the SAME shared tab bodies. The profile opens as a modal
 * (virtual routing) — the desktop-safe path, matching `<SignIn routing="virtual">`.
 */
export function AccountButton() {
  const t = useIntl();
  return (
    <UserButton>
      <UserButton.UserProfilePage
        label={t.formatMessage({ id: "account.tabs.consent" })}
        url="privacy"
        labelIcon={<ShieldIcon />}
      >
        <ConsentContent />
      </UserButton.UserProfilePage>
      <UserButton.UserProfilePage
        label={t.formatMessage({ id: "account.tabs.data" })}
        url="data"
        labelIcon={<DataIcon />}
      >
        <DataContent />
      </UserButton.UserProfilePage>
    </UserButton>
  );
}
