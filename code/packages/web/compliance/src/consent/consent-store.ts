/**
 * Client-side consent store — the single source of truth for the visitor's
 * per-category cookie choices. Backed by `localStorage` and a custom window event
 * so every consumer (`CookieBanner`, `useConsent`, `<ConsentGate>`) stays in sync
 * across tabs and in-page changes. Pure/framework-free so it can be read from a
 * `useSyncExternalStore` snapshot without a hydration effect.
 */

import { site } from "@indiecrafts/packages-shared-config";
import {
  type ConsentRecord,
  grantedKeys,
  consentUpdate,
} from "@indiecrafts/packages-shared-compliance/shared";
import { type ConsentCategory } from "./consent-signals";
import { reportConsent } from "@indiecrafts/packages-shared-compliance/web";

// The pure decision math (`grantedKeys`, `consentUpdate`) + the `ConsentRecord` shape
// moved to the portable brick so the shells reuse them; re-export here so this brick's
// public surface is unchanged (`applyConsent` + any importer still resolve them).
export { type ConsentRecord, grantedKeys, consentUpdate };

/** GA / GTM injects `window.dataLayer` at runtime — augment the global to push consent updates. */
declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/**
 * `localStorage` key, namespaced by `site.prefix` so two template instances never
 * share a consent record — even on a shared origin or preview domain (localStorage
 * is per-origin, so different domains were already safe; this covers the rest).
 */
export const STORAGE_KEY = `${site.prefix}.cookie-consent`;
// The two window events below are dispatched and heard within ONE document, so
// they can never collide between two separately-deployed sites — no prefix needed.
/** Fired after the stored record changes. */
export const CONSENT_EVENT = "cookie-consent-change";
/** Fired to open the preferences dialog from anywhere (e.g. a footer link). */
export const OPEN_PREFERENCES_EVENT = "cookie-preferences-open";

// `useSyncExternalStore` requires get() to return a STABLE reference when nothing
// changed — so cache the parsed record and only re-parse when the raw string differs.
let cachedRaw: string | null = null;
let cachedRecord: ConsentRecord | null = null;

export const consentStore = {
  get(): ConsentRecord | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedRecord;
    cachedRaw = raw;
    try {
      cachedRecord = raw ? (JSON.parse(raw) as ConsentRecord) : null;
    } catch {
      cachedRecord = null;
    }
    return cachedRecord;
  },
  subscribe(cb: () => void) {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("storage", cb);
    window.addEventListener(CONSENT_EVENT, cb);
    return () => {
      window.removeEventListener("storage", cb);
      window.removeEventListener(CONSENT_EVENT, cb);
    };
  },
  save(record: ConsentRecord) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    window.dispatchEvent(new Event(CONSENT_EVENT));
  },
};

/** Open the preferences dialog (used by `useConsent().openPreferences` + footer links). */
export function openPreferences() {
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}

/**
 * True when the browser sends a legally recognised opt-out signal — Global Privacy
 * Control (`navigator.globalPrivacyControl`) or legacy Do-Not-Track. On first visit
 * the banner treats this as "reject non-essential" (the visitor can still opt in via
 * preferences). GPC is enforceable under CCPA/CPRA and honoured by an increasing
 * number of EU authorities.
 */
export function browserSignalsDeny(): boolean {
  if (typeof navigator === "undefined") return false;
  const gpc = (navigator as Navigator & { globalPrivacyControl?: boolean })
    .globalPrivacyControl;
  return gpc === true || navigator.doNotTrack === "1";
}

/**
 * Union of the server-detected `Sec-GPC: 1` request header (read in `[locale]/layout.tsx`
 * via `headers()`) and `browserSignalsDeny()` — either source denies. Reading the header
 * server-side means the initial consent seed already honours GPC before any client JS runs;
 * the client check still runs too, since a proxy/CDN can strip the header even when the
 * browser sets `navigator.globalPrivacyControl`, and vice versa.
 */
export function signalsDeny(gpcSignal: boolean): boolean {
  return gpcSignal || browserSignalsDeny();
}

/**
 * The `gtag()` command form. gtag.js only runs a `dataLayer` entry that is an
 * `arguments` object — a plain array (`push(["consent", …])`) is silently ignored, so
 * a consent update must go through this, exactly like Google's own snippet.
 */
export function gtag(..._args: unknown[]) {
  window.dataLayer = window.dataLayer ?? [];
  // eslint-disable-next-line prefer-rest-params -- gtag.js requires the arguments object
  window.dataLayer.push(arguments);
}

/**
 * Persist the visitor's choices and push the matching Consent-Mode `update` to
 * `dataLayer` (harmless when no gtag is present). Used by the banner buttons and
 * the preferences dialog alike, so consent is written one way only.
 */
export function applyConsent(
  categories: ConsentCategory[],
  choices: Record<string, boolean>,
  version: string,
  source: "banner" | "preferences" | "auto" = "banner",
) {
  consentStore.save({ v: version, t: Date.now(), choices });
  if (typeof window !== "undefined")
    gtag("consent", "update", consentUpdate(categories, choices));
  // Log the decision server-side (account-scoped) — one funnel covers accept /
  // reject / customize / auto-seed. Fire-and-forget; the route gates anonymous.
  reportConsent(choices, version, source);
}
