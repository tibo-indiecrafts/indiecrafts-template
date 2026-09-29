"use client";

/**
 * Render the cookie-consent banner and seed the geo default.
 *
 * @see docs/reference/projects/web/app/src/user-interface/overlays/ConsentGate.md
 */
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  ConsentBanner,
  signalsDeny,
} from "@indiecrafts/packages-shared-compliance/web";
import {
  DEFAULT_CONSENT_CATEGORIES,
  resolveCategories,
  acceptAllChoices,
  rejectAllChoices,
  type ConsentMode,
} from "@indiecrafts/packages-shared-compliance/shared";
import { showConsentSavedToast } from "@indiecrafts/packages-web-ui-components/web/consent-toast";
import { useRouter } from "@/i18n/routing";
import { features, policyVersion } from "@/config";
import { useOverlayTurn } from "@indiecrafts/packages-web-ui-components/web/overlay-turn";
import { consentStore, useRecord } from "./stores";

/** The cookie-consent banner + its geo auto-seed. `mode` is the geo-resolved consent mode
 *  (from the layout's `cf-ipcountry`); `gpcSignal` is the server-detected `Sec-GPC: 1` header. */
export function ConsentGate({
  mode,
  gpcSignal,
}: {
  mode: ConsentMode;
  gpcSignal: boolean;
}) {
  const t = useTranslations("consent");
  const router = useRouter();
  const record = useRecord(consentStore);

  // opt-out / none: no blocking banner — seed the default ONCE (accept-all unless a browser
  // or server GPC signal denies), so the record exists for the legal gate + the analytics default.
  useEffect(() => {
    if (!features.requireConsent || record !== null || mode === "opt-in") return;
    consentStore.save({
      v: policyVersion,
      t: Date.now(),
      choices: signalsDeny(gpcSignal)
        ? rejectAllChoices(DEFAULT_CONSENT_CATEGORIES)
        : acceptAllChoices(DEFAULT_CONSENT_CATEGORIES),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close is stable enough; re-arm on version/timer change
  }, [mode, gpcSignal, record]);

  // Only opt-in regions get the blocking banner; opt-out/none rely on the seed + preferences.
  // It is the first overlay in the queue: the others wait until the visitor decides.
  const turn = useOverlayTurn(
    "consent",
    features.requireConsent && record === null && mode === "opt-in",
  );
  if (!turn) return null;

  const cat = (key: string) => ({
    title: t(`categories.${key}.title`),
    description: t(`categories.${key}.description`),
  });
  const categories = resolveCategories(DEFAULT_CONSENT_CATEGORIES, {
    necessary: cat("necessary"),
    analytics: cat("analytics"),
    marketing: cat("marketing"),
  });
  // Explicit accept/reject/save only — the geo auto-seed in the effect above calls
  // `consentStore.save` directly and stays silent.
  const persist = (choices: Record<string, boolean>) => {
    consentStore.save({ v: policyVersion, t: Date.now(), choices });
    showConsentSavedToast({
      saved: t("saved"),
      description: t("savedBody"),
      manage: t("manage"),
      onManage: () => router.push("/account"),
    });
  };

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
