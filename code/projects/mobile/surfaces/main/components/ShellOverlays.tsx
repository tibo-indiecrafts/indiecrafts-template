import { useEffect, useState, useSyncExternalStore } from "react";
import { AppState, Linking, View, StyleSheet } from "react-native";
import { useIntl } from "react-intl";
import { getLocales } from "expo-localization";
import { Button, ThemedText, useTheme } from "@indiecrafts/packages-mobile-ui-native";
import {
  ConsentBanner,
  LegalReacceptancePrompt,
  createNativeStore,
} from "@indiecrafts/packages-shared-compliance/native";
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
import {
  versionId,
  isUpdateAvailable,
  VERSION_ENDPOINT,
} from "@indiecrafts/packages-shared-version";
import { OfflineBanner } from "@/components/OfflineBanner";
import { AnnouncementOverlay } from "@/components/AnnouncementOverlay";
import { hasClerk } from "@/lib/auth";
import {
  localeCodes,
  localeMap,
  pickSuggestedLocale,
  STORAGE_KEYS,
  websiteUrl,
  buildId,
  features,
  policyVersion,
  type Locale,
} from "@/config";

// The two persisted records, keyed from the one registry. Created once at module scope.
const consentStore = createNativeStore<ConsentRecord>(STORAGE_KEYS.cookieConsent);
const legalStore = createNativeStore<LegalAcceptanceRecord>(STORAGE_KEYS.legalAck);

function useRecord<T>(store: Store<T>): T | null {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

/** Open a website legal page in the system browser (the RN link-out — zero new deps). */
function openLegal(key: Parameters<typeof legalUrl>[1], locale: Locale) {
  if (websiteUrl) void Linking.openURL(legalUrl(websiteUrl, key, locale));
}

function ConsentGate() {
  const t = useIntl();
  const record = useRecord(consentStore);
  if (!features.requireConsent || record) return null;

  const cat = (key: string) => ({
    title: t.formatMessage({ id: `consent.categories.${key}.title` }),
    description: t.formatMessage({ id: `consent.categories.${key}.description` }),
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
        title: t.formatMessage({ id: "consent.title" }),
        body: t.formatMessage({ id: "consent.body" }),
        acceptLabel: t.formatMessage({ id: "consent.accept" }),
        rejectLabel: t.formatMessage({ id: "consent.reject" }),
        customizeLabel: t.formatMessage({ id: "consent.customize" }),
        saveLabel: t.formatMessage({ id: "consent.save" }),
        backLabel: t.formatMessage({ id: "consent.back" }),
      }}
      onAccept={() => persist(acceptAllChoices(DEFAULT_CONSENT_CATEGORIES))}
      onReject={() => persist(rejectAllChoices(DEFAULT_CONSENT_CATEGORIES))}
      onSave={persist}
    />
  );
}

function LegalReacceptGate({ locale }: { locale: Locale }) {
  const t = useIntl();
  const record = useRecord(legalStore);
  const consentRecord = useRecord(consentStore);
  const consentPending = features.requireConsent && !consentRecord;
  if (consentPending || !needsReacceptance(record, policyVersion)) return null;

  return (
    <LegalReacceptancePrompt
      copy={{
        title: t.formatMessage({ id: "legal.reaccept.title" }),
        body: t.formatMessage({ id: "legal.reaccept.body" }),
        reviewLabel: t.formatMessage({ id: "legal.reaccept.review" }),
        acceptLabel: t.formatMessage({ id: "legal.reaccept.accept" }),
      }}
      onReview={() => openLegal("terms", locale)}
      onAccept={() => legalStore.save({ version: policyVersion, t: Date.now() })}
    />
  );
}

/** AppState-driven poll of a hosted `/api/version`; returns the live deploy id (or null). */
function useNativeVersionCheck(endpoint: string): string | null {
  const [latest, setLatest] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    const check = async () => {
      try {
        const res = await fetch(endpoint);
        if (!res.ok) return;
        const id = versionId(await res.json());
        if (id && alive) setLatest(id);
      } catch {
        // Network blip — the next AppState "active" retries.
      }
    };
    void check();
    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active") void check();
    });
    return () => {
      alive = false;
      sub.remove();
    };
  }, [endpoint]);
  return latest;
}

function VersionBanner({ endpoint }: { endpoint: string }) {
  const t = useIntl();
  const { theme } = useTheme();
  const [dismissed, setDismissed] = useState(false);
  const latest = useNativeVersionCheck(endpoint);
  if (!isUpdateAvailable(buildId, latest) || dismissed) return null;
  // ponytail: informs + dismiss only — `expo-updates`/EAS OTA (the apply half) is a
  // separate infra task, so this nudges to restart/update rather than reloading.
  return (
    <View style={[styles.topBanner, banner(theme)]}>
      <ThemedText variant="muted" style={styles.bannerText}>
        {t.formatMessage({ id: "version.message" })}
      </ThemedText>
      <Button
        label={t.formatMessage({ id: "version.dismiss" })}
        variant="outline"
        onPress={() => setDismissed(true)}
      />
    </View>
  );
}

function LocaleSuggest({
  active,
  chooseLocale,
  hasChoice,
}: {
  active: Locale;
  chooseLocale: (locale: Locale) => void;
  hasChoice: boolean;
}) {
  const t = useIntl();
  const { theme } = useTheme();
  const [dismissed, setDismissed] = useState(false);
  const ranked = getLocales()
    .map((l) => l.languageCode)
    .filter((c): c is string => !!c);
  const suggested = pickSuggestedLocale(ranked, active, localeCodes);
  if (!suggested || dismissed || hasChoice) return null;
  return (
    <View style={[styles.topBannerLower, banner(theme)]}>
      <ThemedText variant="muted" style={styles.bannerText}>
        {t.formatMessage(
          { id: "locale.suggest" },
          { language: localeMap[suggested].label },
        )}
      </ThemedText>
      <View style={styles.actions}>
        <Button
          label={t.formatMessage({ id: "locale.dismiss" })}
          variant="outline"
          onPress={() => {
            chooseLocale(active); // remember the current choice so we stop asking
            setDismissed(true);
          }}
        />
        <Button
          label={t.formatMessage({ id: "locale.switch" })}
          onPress={() => chooseLocale(suggested)}
        />
      </View>
    </View>
  );
}

/** All the mobile shell overlays — consent, legal re-acceptance, version, locale. */
export function ShellOverlays({
  locale,
  chooseLocale,
  hasChoice,
}: {
  locale: Locale;
  chooseLocale: (locale: Locale) => void;
  hasChoice: boolean;
}) {
  return (
    <>
      <OfflineBanner />
      {/* Logged-in-only announcements (banner + toast) from the api Worker. Gated on
          `hasClerk` so `useAuth` inside always has its provider. */}
      {hasClerk ? <AnnouncementOverlay locale={locale} /> : null}
      <ConsentGate />
      <LegalReacceptGate locale={locale} />
      {websiteUrl ? <VersionBanner endpoint={`${websiteUrl}${VERSION_ENDPOINT}`} /> : null}
      <LocaleSuggest active={locale} chooseLocale={chooseLocale} hasChoice={hasChoice} />
    </>
  );
}

const banner = (theme: ReturnType<typeof useTheme>["theme"]) => ({
  backgroundColor: theme.color.card,
  borderColor: theme.color.border,
  borderRadius: theme.radius,
});

const styles = StyleSheet.create({
  topBanner: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 56,
    padding: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  topBannerLower: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 56,
    padding: 14,
    borderWidth: 1,
    gap: 10,
  },
  bannerText: { flex: 1, fontSize: 13 },
  actions: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end", gap: 8 },
});
