"use client";

/**
 * The account widget's custom-page contents: Privacy & consent, Emails, Language, Your data.
 *
 * @see docs/reference/packages/web/auth/src/account/pages.md
 */

import { useMemo } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import {
  AccountConsentTab,
  AccountDataTab,
  EmailPreferences,
  emailPreferencesIo,
  MarketingEmailToggle,
} from "@indiecrafts/packages-shared-compliance/web";
import type { AccountModalProps } from "./account-modal";
import { AccountLanguageTab } from "./language-tab";
import { useClerkAuthPort } from "./use-clerk-auth-port";

/** A custom page's title — the same size as Clerk's own page titles (`headerTitle` in
 *  `authAppearance`), so every page of the account widget reads alike. */
function PageTitle({ children }: { children: string }) {
  return <h1 className="text-foreground text-lg font-semibold">{children}</h1>;
}

// The custom-page contents, shared by <AccountButton> (modal) and <AccountPage>
// (standalone /account). Rendered inside Clerk's <UserProfile>, so their hooks
// (useClerkAuthPort → useAuth/useReverification) have a provider.
export function ConsentContent(p: AccountModalProps) {
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
        onSaved={p.onConsentSaved}
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

export function EmailsContent(p: AccountModalProps) {
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

export function LanguageContent(p: AccountModalProps) {
  const clerk = useClerk();
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <PageTitle>{p.copy.languageTabLabel}</PageTitle>
        <p className="text-muted-foreground text-sm text-pretty">
          {p.copy.languageIntro}
        </p>
      </div>
      <AccountLanguageTab
        locale={p.locale}
        label={p.copy.languageTabLabel}
        onChange={(locale) => {
          // The switch re-renders the page under the new locale, but Clerk's modal outlives it
          // and loses these custom pages (blank, stale labels): close it first. No-op on the
          // embedded `/account` page.
          clerk.closeUserProfile();
          p.onLocaleChange?.(locale);
        }}
      />
    </div>
  );
}

export function DataContent(p: AccountModalProps) {
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
