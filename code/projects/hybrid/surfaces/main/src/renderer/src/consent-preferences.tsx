import { useEffect, useState, useSyncExternalStore } from "react";
import { useIntl } from "react-intl";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { showConsentSavedToast } from "@indiecrafts/packages-web-ui-components/web/consent-toast";
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
import { sitePrefix, policyVersion } from "../../config";

// SAME key as `ShellOverlays`'s `consentStore` (shell.tsx) — this handle reads/writes the
// identical `localStorage` record (and shares its same-tab change event, keyed off the
// storage key), so a save here is picked up by the banner/gate and vice versa.
const consentStore = createWebStore<ConsentRecord>(`${sitePrefix}.cookie-consent`);

/**
 * The desktop "cookie preferences" control — lets a user re-open and change their cookie
 * consent from the Home view (this renderer has no settings screen). A thin wrapper around
 * the shared `ConsentPreferences` toggle list (owns `choices` state + Save), mirroring how
 * `ConsentBannerGate` uses it and the `app` web surface's `/account` control.
 */
export function CookiePreferencesSection() {
  const t = useIntl();
  const record = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.get,
    consentStore.get,
  );
  const [choices, setChoices] = useState<Record<string, boolean>>(() =>
    rejectAllChoices(DEFAULT_CONSENT_CATEGORIES),
  );

  // Seed local edits from the persisted record once it's available (client-only store —
  // null during the first render, then corrected by `useSyncExternalStore`).
  useEffect(() => {
    if (record) setChoices(record.choices);
  }, [record]);

  const cat = (key: string) => ({
    title: t.formatMessage({ id: `consent.categories.${key}.title` }),
    description: t.formatMessage({ id: `consent.categories.${key}.description` }),
  });
  const categories = resolveCategories(DEFAULT_CONSENT_CATEGORIES, {
    necessary: cat("necessary"),
    analytics: cat("analytics"),
    marketing: cat("marketing"),
  });

  function handleSave() {
    consentStore.save({ v: policyVersion, t: Date.now(), choices });
    showConsentSavedToast({
      saved: t.formatMessage({ id: "consent.saved" }),
      description: t.formatMessage({ id: "consent.savedBody" }),
      manage: t.formatMessage({ id: "consent.manage" }),
      // Already the settings control being managed — no navigation needed.
      onManage: () => {},
    });
  }

  return (
    <section
      id="cookie-preferences"
      aria-labelledby="cookie-preferences-heading"
      className="flex w-full max-w-sm flex-col gap-3"
    >
      <h2
        id="cookie-preferences-heading"
        className="text-muted-foreground text-center text-sm font-medium"
      >
        {t.formatMessage({ id: "consent.preferencesTitle" })}
      </h2>
      <ConsentPreferences
        categories={categories}
        choices={choices}
        onChange={(key, value) => setChoices((c) => ({ ...c, [key]: value }))}
      />
      <div className="flex justify-center">
        <Button size="sm" onClick={handleSave}>
          {t.formatMessage({ id: "consent.save" })}
        </Button>
      </div>
    </section>
  );
}
