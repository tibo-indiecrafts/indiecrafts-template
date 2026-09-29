"use client";

/**
 * Show the legal re-acceptance prompt when the policy version is stale.
 *
 * @see docs/reference/projects/web/app/src/user-interface/overlays/LegalGate.md
 */
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@clerk/nextjs";
import { LegalReacceptancePrompt } from "@indiecrafts/packages-shared-compliance/web";
import {
  needsReacceptance,
  legalUrl,
  fetchLegalVersion,
  readLegalConsent,
  writeLegalConsent,
} from "@indiecrafts/packages-shared-compliance/shared";
import { showConsentSavedToast } from "@indiecrafts/packages-web-ui-components/web/consent-toast";
import { site, features, policyVersion, type Locale } from "@/config";
import { consentStore, legalStore, useRecord } from "./stores";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

/** The effective legal version — the website's live version, with the static
 *  `policyVersion` as the offline fallback. Unifies the version across surfaces so ONE
 *  Sanity bump re-prompts everywhere. Starts static (SSR-stable), swaps to live once
 *  fetched. */
function useEffectiveLegalVersion(): string {
  const [live, setLive] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    void fetchLegalVersion(site.websiteUrl).then((v) => {
      if (alive) setLive(v);
    });
    return () => {
      alive = false;
    };
  }, []);
  return live || policyVersion;
}

/** The legal re-acceptance prompt — shown when the accepted policy version is stale.
 *  Suppressed while the consent banner is up, so only one bottom popup shows at a time.
 *  `getToken` (signed-in only) syncs acceptance across surfaces via the api Worker: the
 *  server-recorded version suppresses the banner here, and accepting here records it. */
export function LegalGate({
  locale,
  getToken,
}: {
  locale: Locale;
  getToken?: () => Promise<string | null>;
}) {
  const t = useTranslations("legal.reaccept");
  const record = useRecord(legalStore);
  const consentRecord = useRecord(consentStore);
  const version = useEffectiveLegalVersion();
  const consentPending = features.requireConsent && !consentRecord;

  // Signed-in: pull the server-recorded acceptance. If they already accepted THIS
  // version on another surface, deposit it locally so the banner never shows here.
  useEffect(() => {
    if (!getToken || !apiUrl || !version) return;
    let alive = true;
    void readLegalConsent({ apiUrl, getToken }).then((acked) => {
      if (alive && acked === version)
        legalStore.save({ version, t: Date.now() });
    });
    return () => {
      alive = false;
    };
  }, [getToken, version]);

  if (consentPending || !version || !needsReacceptance(record, version))
    return null;

  return (
    <LegalReacceptancePrompt
      copy={{ title: t("title"), body: t("body"), acceptLabel: t("accept") }}
      hrefs={[
        legalUrl(site.websiteUrl, "privacy", locale),
        legalUrl(site.websiteUrl, "terms", locale),
      ]}
      onAccept={() => {
        legalStore.save({ version, t: Date.now() });
        // Accepting policies is not a cookie choice — a bare confirmation.
        showConsentSavedToast({ saved: t("saved") });
        // Signed-in: record it server-side so the banner clears on the user's other
        // surfaces too (best-effort; the local deposit already hid it here).
        if (getToken && apiUrl)
          void writeLegalConsent({ apiUrl, getToken, version, surface: "app" });
      }}
    />
  );
}

/** Clerk-connected mount — supplies `getToken` so acceptance syncs across surfaces.
 *  Rendered ONLY where a `ClerkProvider` exists (a publishable key is set), so `useAuth`
 *  always has its provider; anonymous / no-Clerk builds mount the plain `LegalGate`. */
export function SignedInLegalGate({ locale }: { locale: Locale }) {
  const { getToken } = useAuth();
  return <LegalGate locale={locale} getToken={getToken} />;
}
