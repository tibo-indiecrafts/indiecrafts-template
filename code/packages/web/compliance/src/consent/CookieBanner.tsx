"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@indiecrafts/packages-web-i18n";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import type { ConsentCategory } from "./consent-signals";
import { CookiePreferences } from "./CookiePreferences";
import {
  applyConsent,
  browserSignalsDeny,
  consentStore,
  OPEN_PREFERENCES_EVENT,
} from "./consent-store";

type Props = {
  categories: ConsentCategory[];
  version: string;
  /** Banner copy from Sanity (`cookieConsent.banner`) — the single source, no message fallback. */
  title?: string;
  body?: string;
  /** Honour a browser opt-out signal (GPC / Do-Not-Track) on first visit. Default on. */
  respectGpc?: boolean;
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
}: Props) {
  const t = useTranslations("cookies");
  const record = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.get,
    () => null,
  );
  const [prefsOpen, setPrefsOpen] = useState(false);

  useEffect(() => {
    const open = () => setPrefsOpen(true);
    if (new URLSearchParams(window.location.search).get("cookies") === "manage")
      open();
    window.addEventListener(OPEN_PREFERENCES_EVENT, open);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, open);
  }, []);

  // First visit with a browser opt-out signal (GPC / DNT): record reject-all
  // silently so non-essential stays denied and the banner doesn't nag. The visitor
  // can still opt in through the preferences dialog.
  useEffect(() => {
    if (
      respectGpc &&
      record === null &&
      categories.length > 0 &&
      browserSignalsDeny()
    ) {
      applyConsent(categories, optionalChoices(categories, false), version);
    }
  }, [respectGpc, record, categories, version]);

  if (categories.length === 0) return null;

  const needsConsent = record === null || record.v !== version;
  const showBar = needsConsent && !prefsOpen;

  return (
    <>
      {showBar ? (
        <dialog
          open
          aria-labelledby="cookie-banner-title"
          className="bg-card text-foreground ring-border/60 fixed right-4 bottom-4 left-4 z-50 mx-auto w-auto max-w-3xl rounded-2xl border-0 p-4 shadow-lg ring-1 backdrop-blur sm:p-5"
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
                onClick={() =>
                  applyConsent(
                    categories,
                    optionalChoices(categories, false),
                    version,
                  )
                }
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
                onClick={() =>
                  applyConsent(
                    categories,
                    optionalChoices(categories, true),
                    version,
                  )
                }
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
