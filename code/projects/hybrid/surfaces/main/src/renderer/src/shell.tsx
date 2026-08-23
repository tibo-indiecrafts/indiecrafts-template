import { useEffect, useState, useSyncExternalStore } from "react";
import { useIntl } from "react-intl";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { useVersionCheck } from "@indiecrafts/packages-web-version/use-version-check";
import { VERSION_ENDPOINT } from "@indiecrafts/packages-shared-version";
import {
  ConsentBanner,
  LegalReacceptancePrompt,
  createWebStore,
  browserSignalsDeny,
} from "@indiecrafts/packages-shared-compliance/web";
import {
  DEFAULT_CONSENT_CATEGORIES,
  resolveCategories,
  acceptAllChoices,
  rejectAllChoices,
  needsReacceptance,
  legalUrl,
  LEGAL_PAGE_KEYS,
  type Store,
  type ConsentRecord,
  type ConsentMode,
  type LegalAcceptanceRecord,
  type LegalPageKey,
} from "@indiecrafts/packages-shared-compliance/shared";
import { loadConsentMode } from "./geo";
import {
  localeCodes,
  localeMap,
  pickSuggestedLocale,
  sitePrefix,
  websiteUrl,
  buildId,
  features,
  policyVersion,
  type Locale,
} from "../../config";
import { storedLocale, storeLocale } from "./i18n";
import { AnnouncementChrome } from "./announcement";
import { hasClerk } from "./auth";

// The two persisted records, namespaced per deployment. Created once at module scope.
const consentStore = createWebStore<ConsentRecord>(`${sitePrefix}.cookie-consent`);
const legalStore = createWebStore<LegalAcceptanceRecord>(`${sitePrefix}.legal-ack`);

function useRecord<T>(store: Store<T>): T | null {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

/** Open a website legal page in the user's real browser (via the preload bridge). */
function openLegal(key: LegalPageKey, locale: Locale) {
  if (websiteUrl) void window.desktop.openExternal(legalUrl(websiteUrl, key, locale));
}

/** The legal link-out list (a Home section) — each opens the website page externally. */
export function LegalLinks() {
  const t = useIntl();
  const locale = t.locale as Locale;
  return (
    <section aria-labelledby="legal-heading" className="flex flex-col items-center gap-2">
      <h2 id="legal-heading" className="text-muted-foreground text-sm font-medium">
        {t.formatMessage({ id: "legal.heading" })}
      </h2>
      <div className="flex flex-wrap justify-center gap-2">
        {LEGAL_PAGE_KEYS.map((key) => (
          <Button
            key={key}
            variant="ghost"
            size="sm"
            disabled={!websiteUrl}
            onClick={() => openLegal(key, locale)}
          >
            {t.formatMessage({ id: `legal.${key}` })}
          </Button>
        ))}
      </div>
    </section>
  );
}

function ConsentBannerGate({ mode }: { mode: ConsentMode | null }) {
  const t = useIntl();
  const record = useRecord(consentStore);

  // opt-out / none: no blocking banner — seed the default ONCE (accept-all unless a browser
  // opt-out signal denies; the Electron renderer is Chromium, so GPC/DNT apply). `null` =
  // geo still resolving, so seed nothing yet.
  useEffect(() => {
    if (!features.requireConsent || record || mode === null || mode === "opt-in")
      return;
    consentStore.save({
      v: policyVersion,
      t: Date.now(),
      choices: browserSignalsDeny()
        ? rejectAllChoices(DEFAULT_CONSENT_CATEGORIES)
        : acceptAllChoices(DEFAULT_CONSENT_CATEGORIES),
    });
  }, [mode, record]);

  // `null` = still resolving geo; only opt-in shows the blocking banner.
  if (!features.requireConsent || record || mode !== "opt-in") return null;

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
  // Suppressed while the consent banner is up, so only one bottom popup shows.
  const consentPending = features.requireConsent && !useRecord(consentStore);
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

function VersionPrompt({ endpoint }: { endpoint: string }) {
  const t = useIntl();
  const [dismissed, setDismissed] = useState(false);
  const { updateAvailable } = useVersionCheck({ current: buildId, endpoint });
  if (!updateAvailable || dismissed) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-card text-foreground ring-border/60 fixed inset-x-4 top-4 z-50 mx-auto flex w-auto max-w-md items-center justify-between gap-3 rounded-xl border-0 p-3 shadow-lg ring-1 backdrop-blur"
    >
      <p className="text-sm">{t.formatMessage({ id: "version.message" })}</p>
      <div className="flex shrink-0 gap-2">
        <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
          {t.formatMessage({ id: "version.dismiss" })}
        </Button>
        {/* ponytail: renderer reload applies the website update; a native desktop
            auto-update (electron-updater) is a separate infra task. */}
        <Button size="sm" onClick={() => window.location.reload()}>
          {t.formatMessage({ id: "version.reload" })}
        </Button>
      </div>
    </div>
  );
}

function LocaleSuggest({ active }: { active: Locale }) {
  const t = useIntl();
  const [dismissed, setDismissed] = useState(false);
  const ranked = navigator.languages.map((l) => l.split("-")[0]);
  const suggested = pickSuggestedLocale(ranked, active, localeCodes);
  if (!suggested || dismissed || storedLocale()) return null;
  return (
    <div
      role="status"
      className="bg-card text-foreground ring-border/60 fixed inset-x-4 top-4 z-40 mx-auto flex w-auto max-w-md items-center justify-between gap-3 rounded-xl border-0 p-3 shadow-lg ring-1 backdrop-blur"
    >
      <p className="text-sm">
        {t.formatMessage({ id: "locale.suggest" }, { language: localeMap[suggested].label })}
      </p>
      <div className="flex shrink-0 gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            storeLocale(active); // remember the current choice so we stop asking
            setDismissed(true);
          }}
        >
          {t.formatMessage({ id: "locale.dismiss" })}
        </Button>
        <Button
          size="sm"
          onClick={() => {
            storeLocale(suggested);
            window.location.reload(); // re-run detectLocale → the chosen locale
          }}
        >
          {t.formatMessage({ id: "locale.switch" })}
        </Button>
      </div>
    </div>
  );
}

/** All the shell overlays — consent, legal re-acceptance, version, locale suggestion. */
export function ShellOverlays() {
  const locale = useIntl().locale as Locale;
  // Geo-resolve the consent mode once on launch (via the api `/v1/geo` — the renderer has no
  // cf-ipcountry of its own). `null` until resolved, so the banner never flashes.
  const [consentMode, setConsentMode] = useState<ConsentMode | null>(null);
  useEffect(() => {
    let alive = true;
    void loadConsentMode().then((m) => {
      if (alive) setConsentMode(m);
    });
    return () => {
      alive = false;
    };
  }, []);
  return (
    <>
      {/* Logged-in-only announcements (banner + toast) from the api Worker. Gated on
          `hasClerk` so `useAuth` inside always has its provider. */}
      {hasClerk ? <AnnouncementChrome /> : null}
      <ConsentBannerGate mode={consentMode} />
      <LegalReacceptGate locale={locale} />
      {websiteUrl ? <VersionPrompt endpoint={`${websiteUrl}${VERSION_ENDPOINT}`} /> : null}
      <LocaleSuggest active={locale} />
    </>
  );
}
