"use client";

/**
 * Renders the Clerk account UI with custom consent and data tabs.
 *
 * @see docs/reference/packages/web/auth/src/account/account-modal.md
 */

import { useMemo } from "react";
import { UserButton, UserProfile, useAuth } from "@clerk/nextjs";
import {
  AccountConsentTab,
  AccountDataTab,
  EmailPreferences,
  emailPreferencesIo,
  MarketingEmailToggle,
  type DeleteAccountCopy,
  type EmailPreferencesCopy,
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
  /** The "Emails" page: tab label, heading, intro, and the preference centre's chrome. */
  emailsTabLabel: string;
  emailsTitle: string;
  emailsIntro: string;
  emailPreferences: EmailPreferencesCopy;
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
  /** The page locale — the email preference copy is read in it. */
  locale: string;
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

function MailIcon() {
  return (
    <svg {...iconProps}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

/** A custom page's title — the same size as Clerk's own page titles (`headerTitle` in
 *  `authAppearance`), so every page of the account widget reads alike. */
function PageTitle({ children }: { children: string }) {
  return <h1 className="text-foreground text-lg font-semibold">{children}</h1>;
}

// The custom-page contents, shared by <AccountButton> (modal) and <AccountPage>
// (standalone /account). Rendered inside Clerk's <UserProfile>, so their hooks
// (useClerkAuthPort → useAuth/useReverification) have a provider.
function ConsentContent(p: AccountModalProps) {
  const auth = useClerkAuthPort(p.apiUrl);
  return (
    <div className="space-y-6">
      <PageTitle>{p.copy.consentTabLabel}</PageTitle>
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

function EmailsContent(p: AccountModalProps) {
  // Clerk's own getToken is stable across renders (useClerkAuthPort wraps it in a new
  // function each render) — EmailPreferences re-reads whenever `read` changes.
  const { getToken } = useAuth();
  const io = useMemo(
    () => emailPreferencesIo(p.apiUrl, () => getToken(), p.surface, p.locale),
    [p.apiUrl, getToken, p.surface, p.locale],
  );
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <PageTitle>{p.copy.emailsTitle}</PageTitle>
        <p className="text-muted-foreground text-sm text-pretty">
          {p.copy.emailsIntro}
        </p>
      </div>
      <EmailPreferences
        read={io.read}
        write={io.write}
        chrome={p.copy.emailPreferences}
      />
    </div>
  );
}

function DataContent(p: AccountModalProps) {
  const auth = useClerkAuthPort(p.apiUrl);
  return (
    <div className="space-y-6">
      <PageTitle>{p.copy.dataTabLabel}</PageTitle>
      <AccountDataTab
        auth={auth}
        apiUrl={p.apiUrl}
        deleteCopy={p.copy.delete}
        exportCopy={p.copy.export}
        showExport={p.showExport}
      />
    </div>
  );
}

/**
 * The account trigger + modal. Renders Clerk's `<UserButton>` (avatar → "Manage
 * account" opens `<UserProfile>`) with Clerk's built-in Profile/Security/Devices tabs
 * plus our three custom pages: "Privacy & consent", "Emails" and "Your data". One component,
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
        label={props.copy.emailsTabLabel}
        url="emails"
        labelIcon={<MailIcon />}
      >
        <EmailsContent {...props} />
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
    // Clerk caps the card at the VIEWPORT width; next to a sidebar that overflows. Cap it at
    // its container instead (the surface page centres it).
    <UserProfile
      routing="hash"
      appearance={{
        elements: { rootBox: "min-w-0 max-w-full", cardBox: "max-w-full!" },
      }}
    >
      <UserProfile.Page
        label={props.copy.consentTabLabel}
        url="privacy"
        labelIcon={<ShieldIcon />}
      >
        <ConsentContent {...props} />
      </UserProfile.Page>
      <UserProfile.Page
        label={props.copy.emailsTabLabel}
        url="emails"
        labelIcon={<MailIcon />}
      >
        <EmailsContent {...props} />
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
