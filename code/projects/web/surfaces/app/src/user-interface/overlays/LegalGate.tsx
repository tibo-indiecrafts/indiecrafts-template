"use client";

/**
 * Show the legal re-acceptance prompt when the policy version is stale.
 *
 * @see docs/reference/projects/web/app/src/user-interface/overlays/LegalGate.md
 */
import { useTranslations } from "next-intl";
import { LegalReacceptancePrompt } from "@indiecrafts/packages-shared-compliance/web";
import {
  needsReacceptance,
  legalUrl,
} from "@indiecrafts/packages-shared-compliance/shared";
import { showConsentSavedToast } from "@indiecrafts/packages-web-ui-components/web/consent-toast";
import { useRouter } from "@/i18n/routing";
import { site, features, policyVersion, type Locale } from "@/config";
import { consentStore, legalStore, useRecord } from "./stores";

/** The legal re-acceptance prompt — shown when the accepted policy version is stale.
 *  Suppressed while the consent banner is up, so only one bottom popup shows at a time. */
export function LegalGate({ locale }: { locale: Locale }) {
  const t = useTranslations("legal.reaccept");
  const tc = useTranslations("consent");
  const router = useRouter();
  const record = useRecord(legalStore);
  const consentRecord = useRecord(consentStore);
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
      onAccept={() => {
        legalStore.save({ version: policyVersion, t: Date.now() });
        showConsentSavedToast({
          saved: t("saved"),
          description: tc("savedBody"),
          manage: tc("manage"),
          onManage: () => router.push("/account"),
        });
      }}
    />
  );
}
