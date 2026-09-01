"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import {
  ConsentPreferences,
  createWebStore,
} from "@indiecrafts/packages-shared-compliance/web";
import {
  DEFAULT_CONSENT_CATEGORIES,
  resolveCategories,
  rejectAllChoices,
  type ConsentRecord,
} from "@indiecrafts/packages-shared-compliance/shared";
import { showConsentSavedToast } from "@indiecrafts/packages-web-ui-components/web/consent-toast";
import { Card, CardContent } from "@indiecrafts/packages-web-ui/web/card";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Link } from "@/i18n/routing";
import { site, policyVersion } from "@/config";

// SAME key as `ShellOverlays`'s `consentStore` — this handle reads/writes the identical
// `localStorage` record (and shares its same-tab change event), so a save here is picked
// up by the banner/gate and vice versa.
const consentStore = createWebStore<ConsentRecord>(`${site.prefix}.cookie-consent`);

/**
 * The `/account` "cookie preferences" control — lets a signed-in user re-open and
 * change their cookie consent. A thin wrapper around the shared `ConsentPreferences`
 * toggle list (owns `choices` state + Save), mirroring how `ConsentBanner` uses it.
 */
export function CookiePreferencesSection() {
  const t = useTranslations("consent");
  const record = useSyncExternalStore(consentStore.subscribe, consentStore.get, consentStore.get);
  const [choices, setChoices] = useState<Record<string, boolean>>(() =>
    rejectAllChoices(DEFAULT_CONSENT_CATEGORIES),
  );

  // Seed local edits from the persisted record once it's available (client-only store —
  // null during SSR/hydration, then corrected by `useSyncExternalStore`).
  useEffect(() => {
    if (record) setChoices(record.choices);
  }, [record]);

  const cat = (key: string) => ({
    title: t(`categories.${key}.title`),
    description: t(`categories.${key}.description`),
  });
  const categories = resolveCategories(DEFAULT_CONSENT_CATEGORIES, {
    necessary: cat("necessary"),
    analytics: cat("analytics"),
    marketing: cat("marketing"),
  });

  function handleSave() {
    consentStore.save({ v: policyVersion, t: Date.now(), choices });
    showConsentSavedToast({
      saved: t("saved"),
      description: t("savedBody"),
      manage: t("manage"),
      // Already the settings control being managed — no navigation needed.
      onManage: () => {},
    });
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <h2 className="text-lg leading-none font-semibold tracking-tight">
          {t("preferencesTitle")}
        </h2>
        <ConsentPreferences
          categories={categories}
          choices={choices}
          onChange={(key, value) => setChoices((c) => ({ ...c, [key]: value }))}
        />
        <div className="flex items-center justify-between gap-4">
          <Link href="/legal" className="text-primary text-sm underline underline-offset-4">
            {t("reviewLegal")}
          </Link>
          <Button onClick={handleSave}>{t("save")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
