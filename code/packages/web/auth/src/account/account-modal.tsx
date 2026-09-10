"use client";

import { UserButton, UserProfile } from "@clerk/nextjs";
import {
  AccountConsentTab,
  AccountDataTab,
  MarketingEmailToggle,
  type DeleteAccountCopy,
  type ExportCopy,
} from "@indiecrafts/packages-shared-compliance/web";
import type { ConsentCategory } from "@indiecrafts/packages-shared-compliance/shared";
import { useClerkAuthPort } from "./use-clerk-auth-port";

/** All copy the account tabs need — resolved per surface from `messages/` and passed in. */
export interface AccountCopy {
  consentTabLabel: string;
  dataTabLabel: string;
  consentTitle: string;
  consentSaveLabel: string;
  /** The commercial-email toggle row label. */
  marketingLabel: string;
  delete: DeleteAccountCopy;
  export: ExportCopy;
}

export interface AccountModalProps {
  apiUrl: string;
  showExport: boolean;
  /** Consent categories already resolved with localized copy by the surface. */
  categories: readonly ConsentCategory[];
  policyVersion: string;
  consentStorageKey: string;
  /** This surface's name — recorded on the marketing consent proof row. */
  surface: string;
  copy: AccountCopy;
}

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

// The two custom-page contents, shared by <AccountButton> (modal) and <AccountPage>
// (standalone /account). Rendered inside Clerk's <UserProfile>, so their hooks
// (useClerkAuthPort → useAuth/useReverification) have a provider.
function ConsentContent(p: AccountModalProps) {
  const auth = useClerkAuthPort(p.apiUrl);
  return (
    <div className="space-y-6">
      <AccountConsentTab
        storageKey={p.consentStorageKey}
        version={p.policyVersion}
        categories={p.categories}
        title={p.copy.consentTitle}
        saveLabel={p.copy.consentSaveLabel}
      />
      <MarketingEmailToggle
        apiUrl={p.apiUrl}
        getToken={auth.getToken}
        label={p.copy.marketingLabel}
        surface={p.surface}
      />
    </div>
  );
}

function DataContent(p: AccountModalProps) {
  const auth = useClerkAuthPort(p.apiUrl);
  return (
    <AccountDataTab
      auth={auth}
      apiUrl={p.apiUrl}
      deleteCopy={p.copy.delete}
      exportCopy={p.copy.export}
      showExport={p.showExport}
    />
  );
}

/**
 * The account trigger + modal. Renders Clerk's `<UserButton>` (avatar → "Manage
 * account" opens `<UserProfile>`) with Clerk's built-in Profile/Security/Devices tabs
 * plus our two custom pages: "Privacy & consent" and "Your data". One component,
 * mounted identically on the website header and the app sidebar. `@clerk/nextjs`-based (website + app).
 */
export function AccountButton(props: AccountModalProps) {
  return (
    <UserButton>
      <UserButton.UserProfilePage
        label={props.copy.consentTabLabel}
        url="privacy"
        labelIcon={<ShieldIcon />}
      >
        <ConsentContent {...props} />
      </UserButton.UserProfilePage>
      <UserButton.UserProfilePage
        label={props.copy.dataTabLabel}
        url="data"
        labelIcon={<DataIcon />}
      >
        <DataContent {...props} />
      </UserButton.UserProfilePage>
    </UserButton>
  );
}

/**
 * The standalone `/account` full-page fallback — same custom pages under Clerk's
 * embedded `<UserProfile>`. `routing="hash"` so no catch-all route is required (sub-nav
 * lives in the URL hash), keeping the surfaces' single `/account` page.
 */
export function AccountPage(props: AccountModalProps) {
  return (
    <UserProfile routing="hash">
      <UserProfile.Page
        label={props.copy.consentTabLabel}
        url="privacy"
        labelIcon={<ShieldIcon />}
      >
        <ConsentContent {...props} />
      </UserProfile.Page>
      <UserProfile.Page
        label={props.copy.dataTabLabel}
        url="data"
        labelIcon={<DataIcon />}
      >
        <DataContent {...props} />
      </UserProfile.Page>
    </UserProfile>
  );
}
