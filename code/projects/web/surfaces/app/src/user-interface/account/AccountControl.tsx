"use client";

/**
 * Wire the shared unified account modal for the app surface.
 *
 * @see docs/reference/projects/web/app/src/user-interface/account/AccountControl.md
 */
import { useLocale, useTranslations } from "next-intl";
import { AccountButton, AccountPage } from "@indiecrafts/packages-web-auth/account";
import {
  buildDeleteAccountCopy,
  buildExportCopy,
  reportConsent,
} from "@indiecrafts/packages-shared-compliance/web";
import {
  DEFAULT_CONSENT_CATEGORIES,
  resolveCategories,
} from "@indiecrafts/packages-shared-compliance/shared";
import { site, features, policyVersion } from "@/config";

/**
 * Wires the shared unified account modal for the app. Builds copy + categories from
 * `messages` and config, then renders either the sidebar-footer trigger (`button`) or
 * the `/account` full-page fallback (`page`). Replaces the old `AccountDeletePanel` +
 * `CookiePreferencesSection`. Mirrors the website's `AccountControl`.
 */
export function AccountControl({ variant }: { variant: "button" | "page" }) {
  const tTabs = useTranslations("account.tabs");
  const tDelete = useTranslations("account.delete");
  const tExport = useTranslations("account.export");
  const tMkt = useTranslations("account.marketing");
  const tEmails = useTranslations("account.emailPreferences");
  const tCat = useTranslations("consent.categories");
  const cat = (key: string) => ({
    title: tCat(`${key}.title`),
    description: tCat(`${key}.description`),
  });
  const categories = resolveCategories(DEFAULT_CONSENT_CATEGORIES, {
    necessary: cat("necessary"),
    analytics: cat("analytics"),
    marketing: cat("marketing"),
  });

  const locale = useLocale();
  const props = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
    showExport: features.exportAccount,
    categories,
    policyVersion,
    consentStorageKey: `${site.prefix}.cookie-consent`,
    surface: "app",
    // The tab already saved the record; log it server-side (signed-in users only).
    onConsentSaved: (choices: Record<string, boolean>, version: string) =>
      reportConsent(choices, version, "preferences"),
    locale,
    copy: {
      consentTabLabel: tTabs("consent"),
      dataTabLabel: tTabs("data"),
      consentTitle: tTabs("consentTitle"),
      consentSaveLabel: tTabs("consentSave"),
      marketingLabel: tMkt("label"),
      emailsTabLabel: tTabs("emails"),
      emailsTitle: tEmails("heading"),
      emailsIntro: tEmails("intro"),
      emailPreferences: {
        noticesHeading: tEmails("noticesHeading"),
        loading: tEmails("loading"),
        error: tEmails("error"),
        retry: tEmails("retry"),
      },
      delete: buildDeleteAccountCopy(tDelete),
      export: buildExportCopy(tExport),
    },
  };

  return variant === "button" ? <AccountButton {...props} /> : <AccountPage {...props} />;
}
