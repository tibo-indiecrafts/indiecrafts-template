"use client";

/**
 * Render the GDPR cookie banner and preferences dialog.
 *
 * @see docs/reference/packages/web/compliance/src/consent/CookieBanner.md
 */

import { useEffect, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@indiecrafts/packages-web-i18n";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { showConsentSavedToast } from "@indiecrafts/packages-web-ui-components/web/consent-toast";
import { useOverlayTurn } from "@indiecrafts/packages-web-ui-components/web/overlay-turn";
import type { ConsentMode } from "@indiecrafts/packages-shared-compliance/shared";
import type { ConsentCategory } from "./consent-signals";
import { CookiePreferences } from "./CookiePreferences";
import {
  applyConsent,
  consentStore,
  openPreferences,
  signalsDeny,
} from "./consent-store";
import { usePreferencesDialog } from "./use-preferences-dialog";
import { writeConsentCookie } from "./consent-cookie";

type Props = {
  categories: ConsentCategory[];
  version: string;
  /** Banner copy from Sanity (`cookieConsent.banner`) — the single source, no message fallback. */
  title?: string;
  body?: string;
  /** Honour a browser opt-out signal (GPC / Do-Not-Track) on first visit. Default on. */
  respectGpc?: boolean;
  /** Server-detected `Sec-GPC: 1` request header, read in `[locale]/layout.tsx` via `headers()`.
   *  Unioned with the client-side `navigator` check (`signalsDeny`) — either source denies.
   *  Default false (no header seen). */
  gpcSignal?: boolean;
  /** The geo-resolved consent mode (from the visitor's country). `opt-in` blocks with the
   *  banner (default); `opt-out`/`none` never block — they auto-seed a default and rely on the
   *  preferences dialog (open via `?cookies=manage` / a Manage-preferences button). */
  mode?: ConsentMode;
  /** Server-read: the consent cookie (`CONSENT_COOKIE`) holds the current `version`. Given,
   *  the banner renders in the first HTML for an undecided visitor instead of after
   *  hydration. Omitted, the banner decides on the client only. */
  decided?: boolean;
};

const EMPTY_CHOICES: Record<string, boolean> = {};

const optionalChoices = (categories: ConsentCategory[], value: boolean) =>
  Object.fromEntries(
    categories.filter((c) => !c.required).map((c) => [c.key, value]),
  );

/**
 * GDPR cookie banner + preferences. Mounted by `[locale]/layout.tsx` when Sanity
 * `siteSettings.analytics.requireCookieConsent` is on. Shows on first visit (or
 * when the consent `version` changes), offering Reject all / Customize / Accept all
 * on equal terms. Choices persist in `localStorage` and push a Consent-Mode update.
 * Open the preferences dialog anywhere via `?cookies=manage` or `openPreferences()`.
 */
export function CookieBanner({
  categories,
  version,
  title,
  body,
  respectGpc = true,
  gpcSignal = false,
  mode = "opt-in",
  decided,
}: Props) {
  const t = useTranslations("cookies");
  const record = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.get,
    () => null,
  );
  const [prefsOpen, setPrefsOpen] = usePreferencesDialog();

  // Explicit accept/reject only — the silent auto-seed in the effect below calls
  // `applyConsent(..., "auto")` directly and never goes through this helper.
  const decide = (choices: Record<string, boolean>) => {
    applyConsent(categories, choices, version, "banner");
    showConsentSavedToast({
      saved: t("saved"),
      description: t("savedBody"),
      manage: t("manage"),
      onManage: openPreferences,
    });
  };

  // Auto-decide on first visit without nagging, where the region allows it:
  //  - opt-in: never decide for the visitor — the banner shows, even with a browser
  //    opt-out signal (GPC / DNT, on by default in Brave). Nothing non-essential runs
  //    before a choice anyway (Consent-Mode defaults are denied), and a silent reject
  //    would leave the visitor no visible way to opt in.
  //  - opt-out / none: never block — seed the default (ACCEPT non-essential), but honour a
  //    browser opt-out signal (GPC / DNT → reject). Changeable later via the preferences dialog.
  useEffect(() => {
    if (record !== null || categories.length === 0 || mode === "opt-in") return;
    const deny = respectGpc && signalsDeny(gpcSignal);
    applyConsent(
      categories,
      optionalChoices(categories, !deny),
      version,
      "auto",
    );
  }, [mode, respectGpc, gpcSignal, record, categories, version]);

  // On the server and during hydration the record is unknown: the consent cookie stands in
  // for it (`decided`), so an undecided visitor gets the banner in the first HTML.
  const needsConsent = useSyncExternalStore(
    consentStore.subscribe,
    () => {
      const stored = consentStore.get();
      return stored === null || stored.v !== version;
    },
    () => decided === false,
  );

  // A visitor who decided before the cookie existed: copy the version into it, so the
  // server stops rendering a banner the client then hides.
  useEffect(() => {
    if (decided === false && record?.v === version) writeConsentCookie(version);
  }, [decided, record, version]);
  // Only opt-in regions get the blocking banner; opt-out/none rely on the seed + preferences.
  // It is the first overlay in the queue: the others wait until the visitor decides.
  const showBar = useOverlayTurn(
    "consent",
    categories.length > 0 && mode === "opt-in" && needsConsent && !prefsOpen,
  );

  if (categories.length === 0) return null;

  return (
    <>
      {showBar ? (
        <dialog
          open
          aria-labelledby="cookie-banner-title"
          className="bg-card text-foreground ring-border/60 fixed right-4 bottom-safe-4 left-4 z-50 mx-auto w-auto max-w-3xl rounded-2xl border-0 p-4 shadow-lg ring-1 backdrop-blur sm:p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              <p id="cookie-banner-title" className="font-medium">
                {title}
              </p>
              <p className="text-muted-foreground mt-1">
                {body}{" "}
                <Link
                  href="/cookie-policy"
                  className="underline underline-offset-2"
                >
                  {t("learnMore")}
                </Link>
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => decide(optionalChoices(categories, false))}
              >
                {t("rejectAll")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPrefsOpen(true)}
              >
                {t("customize")}
              </Button>
              <Button
                size="sm"
                onClick={() => decide(optionalChoices(categories, true))}
              >
                {t("acceptAll")}
              </Button>
            </div>
          </div>
        </dialog>
      ) : null}

      <CookiePreferences
        categories={categories}
        version={version}
        open={prefsOpen}
        onOpenChange={setPrefsOpen}
        current={record?.choices ?? EMPTY_CHOICES}
      />
    </>
  );
}
