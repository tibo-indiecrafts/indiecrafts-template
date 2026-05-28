"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui-primitives/button";
import { analytics } from "@/config";

const STORAGE_KEY = "cookie-consent";
type Consent = "accepted" | "rejected" | null;

/**
 * GA / GTM injects `window.dataLayer` at runtime — augment the global so
 * we can push consent updates without an `as any` cast.
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

const consentStore = {
  get(): Consent {
    if (typeof window === "undefined") return null;
    return (localStorage.getItem(STORAGE_KEY) as Consent) ?? null;
  },
  subscribe(cb: () => void) {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("storage", cb);
    window.addEventListener("cookie-consent-change", cb);
    return () => {
      window.removeEventListener("storage", cb);
      window.removeEventListener("cookie-consent-change", cb);
    };
  },
};

function setConsent(choice: Consent) {
  if (choice) localStorage.setItem(STORAGE_KEY, choice);
  else localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("cookie-consent-change"));
}

function manageRequested(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("cookies") === "manage";
}

/**
 * Minimal GDPR cookie banner.
 *
 * Bottom-fixed bar shown on first visit when no choice is stored.
 *   - Accept  → stores "accepted", flips GA Consent Mode to `granted`
 *   - Reject  → stores "rejected", GA stays denied
 * Re-show via `?cookies=manage`.
 *
 * Mounted only when `features.cookieBanner === true` (in `[locale]/layout.tsx`).
 */
export function CookieBanner() {
  const t = useTranslations("cookies");
  const stored = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.get,
    () => null,
  );
  const show = stored === null || manageRequested();

  if (!show) return null;

  function decide(choice: "accepted" | "rejected") {
    setConsent(choice);
    if (analytics.googleAnalyticsId && typeof window !== "undefined") {
      window.dataLayer = window.dataLayer ?? [];
      const value = choice === "accepted" ? "granted" : "denied";
      window.dataLayer.push([
        "consent",
        "update",
        {
          analytics_storage: value,
          ad_storage: value,
          ad_user_data: value,
          ad_personalization: value,
        },
      ]);
    }
  }

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      className="bg-card text-foreground ring-border/60 fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-3xl rounded-2xl p-4 shadow-lg ring-1 backdrop-blur sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          <p id="cookie-banner-title" className="font-medium">
            {t("title")}
          </p>
          <p className="text-muted-foreground mt-1">
            {t("body")}{" "}
            <Link href="/legal" className="underline underline-offset-2">
              {t("learnMore")}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="ghost" size="sm" onClick={() => decide("rejected")}>
            {t("reject")}
          </Button>
          <Button size="sm" onClick={() => decide("accepted")}>
            {t("accept")}
          </Button>
        </div>
      </div>
    </div>
  );
}
