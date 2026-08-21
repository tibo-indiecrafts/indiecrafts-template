"use client";

import { useSyncExternalStore } from "react";
import { useTranslations, useLocale } from "next-intl";
import { UpdatePrompt } from "@indiecrafts/packages-web-version/update-prompt";
import {
  ConsentBanner,
  LegalReacceptancePrompt,
  createWebStore,
} from "@indiecrafts/packages-shared-compliance/web";
import {
  DEFAULT_CONSENT_CATEGORIES,
  resolveCategories,
  acceptAllChoices,
  rejectAllChoices,
  needsReacceptance,
  legalUrl,
  type Store,
  type ConsentRecord,
  type LegalAcceptanceRecord,
} from "@indiecrafts/packages-shared-compliance/shared";
import { site, features, policyVersion, type Locale } from "@/config";

// The two persisted records, namespaced per deployment (`site.prefix`).
const consentStore = createWebStore<ConsentRecord>(`${site.prefix}.cookie-consent`);
const legalStore = createWebStore<LegalAcceptanceRecord>(`${site.prefix}.legal-ack`);

function useRecord<T>(store: Store<T>): T | null {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

function ConsentGate() {
  const t = useTranslations("consent");
  const record = useRecord(consentStore);
  if (!features.requireConsent || record) return null;

  const cat = (key: string) => ({
    title: t(`categories.${key}.title`),
    description: t(`categories.${key}.description`),
  });
  const categories = resolveCategories(DEFAULT_CONSENT_CATEGORIES, {
    necessary: cat("necessary"),
    analytics: cat("analytics"),
    marketing: cat("marketing"),
  });
  const persist = (choices: Record<string, boolean>) =>
    consentStore.save({ v: policyVersion, t: Date.now(), choices });

  return (
    <ConsentBanner
      categories={categories}
      copy={{
        title: t("title"),
        body: t("body"),
        acceptLabel: t("accept"),
        rejectLabel: t("reject"),
        customizeLabel: t("customize"),
        saveLabel: t("save"),
        backLabel: t("back"),
      }}
      onAccept={() => persist(acceptAllChoices(DEFAULT_CONSENT_CATEGORIES))}
      onReject={() => persist(rejectAllChoices(DEFAULT_CONSENT_CATEGORIES))}
      onSave={persist}
    />
  );
}

function LegalGate({ locale }: { locale: Locale }) {
  const t = useTranslations("legal.reaccept");
  const record = useRecord(legalStore);
  const consentRecord = useRecord(consentStore);
  // Suppressed while the consent banner is up, so only one bottom popup shows.
  const consentPending = features.requireConsent && !consentRecord;
  if (consentPending || !needsReacceptance(record, policyVersion)) return null;

  return (
    <LegalReacceptancePrompt
      copy={{
        title: t("title"),
        body: t("body"),
        reviewLabel: t("review"),
        acceptLabel: t("accept"),
      }}
      onReview={() => {
        window.location.href = legalUrl(site.websiteUrl, "terms", locale);
      }}
      onAccept={() => legalStore.save({ version: policyVersion, t: Date.now() })}
    />
  );
}

/** Compliance + version overlays for the app shell. Mounted in `[locale]/layout`. */
export function ShellOverlays({ commit }: { commit: string }) {
  const tv = useTranslations("version");
  const locale = useLocale() as Locale;
  return (
    <>
      <ConsentGate />
      <LegalGate locale={locale} />
      <UpdatePrompt
        current={commit}
        message={tv("message")}
        reloadLabel={tv("reload")}
        dismissLabel={tv("dismiss")}
      />
    </>
  );
}
