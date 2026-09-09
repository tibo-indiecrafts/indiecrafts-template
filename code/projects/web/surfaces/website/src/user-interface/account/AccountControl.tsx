"use client";

import { useTranslations } from "next-intl";
import { AccountButton, AccountPage } from "@indiecrafts/packages-web-auth/account";
import {
  buildDeleteAccountCopy,
  buildExportCopy,
} from "@indiecrafts/packages-shared-compliance/web";
import {
  DEFAULT_CONSENT_CATEGORIES,
  resolveCategories,
} from "@indiecrafts/packages-shared-compliance/shared";
import { site, features } from "@/config";

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

  const props = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
    showExport: features.account.export,
    categories,
    // The banner owns re-versioning; the tab preserves the existing record's version,
    // so this is only a fallback for a signed-in user with no consent record yet.
    policyVersion: "1",
    consentStorageKey: `${site.prefix}.cookie-consent`,
    surface: "website",
    copy: {
      consentTabLabel: tTabs("consent"),
      dataTabLabel: tTabs("data"),
      consentTitle: tTabs("consentTitle"),
      consentSaveLabel: tTabs("consentSave"),
      marketingLabel: tMkt("label"),
      delete: buildDeleteAccountCopy(tDelete),
      export: buildExportCopy(tExport),
    },
  };

  return variant === "button" ? <AccountButton {...props} /> : <AccountPage {...props} />;
}
