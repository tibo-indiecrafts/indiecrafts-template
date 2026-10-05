"use client";

/**
 * Loads Google Analytics only once the visitor has granted analytics (basic consent mode).
 *
 * @see docs/reference/packages/web/compliance/src/consent/GoogleAnalytics.md
 */
import { useSyncExternalStore } from "react";
import Script from "next/script";
import { consentUpdate } from "@indiecrafts/packages-shared-compliance/shared";
import type { ConsentCategory } from "./consent-signals";
import { consentRestoreScript } from "./consent-restore";
import { STORAGE_KEY, consentStore } from "./consent-store";

/**
 * Google Analytics in **basic** consent mode: when consent is required, nothing from
 * Google loads — no script, no ping — until the stored record is for the current
 * `version` and grants a category carrying `analytics_storage`. Then gtag.js loads with
 * the stored choice restored before `config`, so the first hit is already consented.
 * Re-renders on a new choice: accepting in the banner loads GA at once; a withdrawal
 * sends a "denied" update (`applyConsent`) and GA is gone from the next page.
 * When consent isn't required (`requireConsent` false), GA loads as a plain tag.
 */
export function GoogleAnalytics({
  id,
  version,
  categories,
  requireConsent,
  nonce,
}: {
  id: string;
  version: string;
  categories: ConsentCategory[];
  requireConsent: boolean;
  nonce?: string;
}) {
  const record = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.get,
    () => null,
  );
  const granted =
    !requireConsent ||
    (record?.v === version &&
      consentUpdate(categories, record.choices).analytics_storage ===
        "granted");
  if (!granted) return null;

  // JSON inside a <script>: escape "<" so a value can never close the tag.
  const gaId = JSON.stringify(id).replace(/</g, "\\u003c");
  const consent = requireConsent
    ? `gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', functionality_storage: 'denied', personalization_storage: 'denied' });
${consentRestoreScript({ storageKey: STORAGE_KEY, version, categories })}
`
    : "";
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`}
        strategy="afterInteractive"
        nonce={nonce}
      />
      <Script id="gtag-init" strategy="afterInteractive" nonce={nonce}>
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
${consent}gtag('js', new Date());
gtag('config', ${gaId});`}
      </Script>
    </>
  );
}
