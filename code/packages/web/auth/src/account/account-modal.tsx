"use client";

/**
 * Renders the Clerk account UI with our custom pages (consent, emails, language, data).
 *
 * @see docs/reference/packages/web/auth/src/account/account-modal.md
 */

import { UserButton, UserProfile } from "@clerk/nextjs";
import type {
  DeleteAccountCopy,
  EmailPreferencesCopy,
  ExportCopy,
} from "@indiecrafts/packages-shared-compliance/web";
import type { ConsentCategory } from "@indiecrafts/packages-shared-compliance/shared";
import { DataIcon, GlobeIcon, MailIcon, ShieldIcon } from "./icons";
import {
  ConsentContent,
  DataContent,
  EmailsContent,
  LanguageContent,
} from "./pages";

/** All copy the account tabs need — resolved per surface from `messages/` and passed in. */
export interface AccountCopy {
  consentTabLabel: string;
  dataTabLabel: string;
  consentTitle: string;
  consentSaveLabel: string;
  /** The commercial-email toggle row label. */
  /** The "Emails" page: tab label, heading, intro, and the preference centre's chrome. */
  emailsTabLabel: string;
  emailsTitle: string;
  emailsIntro: string;
  emailPreferences: EmailPreferencesCopy;
  /** The "Language" page: tab label (also its heading) and intro. */
  languageTabLabel: string;
  languageIntro: string;
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
  /** Called after the Privacy tab saves cookie choices — the surface logs + applies them
   *  (the website's `applyConsent`, the app's `reportConsent`). */
  onConsentSaved?: (choices: Record<string, boolean>, version: string) => void;
  /** Called when the user picks a language in the Language tab, before the page switches. */
  onLocaleChange?: (locale: string) => void;
  copy: AccountCopy;
}

/**
 * The account trigger + modal. Renders Clerk's `<UserButton>` (avatar → "Manage
 * account" opens `<UserProfile>`) with Clerk's built-in Profile/Security/Devices tabs
 * plus our four custom pages: "Privacy & consent", "Emails", "Language" and "Your data". One component,
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
        label={props.copy.languageTabLabel}
        url="language"
        labelIcon={<GlobeIcon />}
      >
        <LanguageContent {...props} />
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
        label={props.copy.languageTabLabel}
        url="language"
        labelIcon={<GlobeIcon />}
      >
        <LanguageContent {...props} />
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
