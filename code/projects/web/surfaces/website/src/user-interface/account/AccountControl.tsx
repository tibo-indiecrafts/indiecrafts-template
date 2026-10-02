"use client";

/**
 * Wires the shared unified account modal for the website.
 *
 * @see docs/reference/projects/web/website/src/user-interface/account/AccountControl.md
 */

import { useLocale, useTranslations } from "next-intl";
import { AccountButton, AccountPage } from "@indiecrafts/packages-web-auth/account";
import {
  buildDeleteAccountCopy,
  buildExportCopy,
} from "@indiecrafts/packages-shared-compliance/web";
import {
  DEFAULT_CONSENT_CATEGORIES,
  resolveCategories,
} from "@indiecrafts/packages-shared-compliance/shared";
import { applyConsent } from "@indiecrafts/packages-web-compliance/consent/consent-store";
import { site, features } from "@/config";
import { useCookieConsentConfig } from "./CookieConsentConfig";

/**
 * Wires the shared unified account modal for the website. Builds copy + categories
 * from `messages` and config, then renders either the header trigger (`button`) or
 * the `/account` full-page fallback (`page`). Replaces the old `AccountDeletePanel`.
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
  // The banner's own categories + version (Sanity), so the Privacy tab and the banner
  // agree; the message-based defaults only when Sanity has none.
  const banner = useCookieConsentConfig();
  const categories = banner?.categories.length
    ? banner.categories
    : resolveCategories(DEFAULT_CONSENT_CATEGORIES, {
        necessary: cat("necessary"),
        analytics: cat("analytics"),
        marketing: cat("marketing"),
      });

  const locale = useLocale();
  const props = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
    showExport: features.account.export,
    categories,
    // The banner owns re-versioning; the tab preserves the existing record's version,
    // so this is only used for a signed-in user with no consent record yet.
    policyVersion: banner?.version || "1",
    // A save goes through the banner's own path: store + change event (the page's
    // consent gates update live), the Consent-Mode update, and the server-side log.
    onConsentSaved: (choices: Record<string, boolean>, version: string) =>
      applyConsent(categories, choices, version, "preferences"),
    consentStorageKey: `${site.prefix}.cookie-consent`,
    surface: "website",
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
