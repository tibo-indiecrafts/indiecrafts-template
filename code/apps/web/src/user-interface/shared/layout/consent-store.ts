/**
 * Client-side consent store — the single source of truth for the visitor's
 * per-category cookie choices. Backed by `localStorage` and a custom window event
 * so every consumer (`CookieBanner`, `useConsent`, `<ConsentGate>`) stays in sync
 * across tabs and in-page changes. Pure/framework-free so it can be read from a
 * `useSyncExternalStore` snapshot without a hydration effect.
 */

import {
  CONSENT_SIGNALS,
  type ConsentCategory,
  type ConsentSignal,
} from "@indiecrafts/utils";

/** GA / GTM injects `window.dataLayer` at runtime — augment the global to push consent updates. */
declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export const STORAGE_KEY = "cookie-consent";
/** Fired after the stored record changes. */
export const CONSENT_EVENT = "cookie-consent-change";
/** Fired to open the preferences dialog from anywhere (e.g. a footer link). */
export const OPEN_PREFERENCES_EVENT = "cookie-preferences-open";

/** `v` = consent version (bumping it re-prompts), `t` = timestamp, `choices` per category key. */
export type ConsentRecord = { v: string; t: number; choices: Record<string, boolean> };

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
  if (typeof window !== "undefined") window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
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
) {
  consentStore.save({ v: version, t: Date.now(), choices });
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push(["consent", "update", consentUpdate(categories, choices)]);
  }
}

/** Category keys currently granted — required categories are always granted. */
export function grantedKeys(
  categories: ConsentCategory[],
  choices: Record<string, boolean>,
): Set<string> {
  const set = new Set<string>();
  for (const c of categories) if (c.required || choices[c.key]) set.add(c.key);
  return set;
}

/**
 * The gtag Consent-Mode `update` payload for a set of choices: each of the seven
 * signals is `granted` iff at least one granted category lists it, else `denied`.
 */
export function consentUpdate(
  categories: ConsentCategory[],
  choices: Record<string, boolean>,
): Record<ConsentSignal, "granted" | "denied"> {
  const granted = grantedKeys(categories, choices);
  const allowed = new Set<ConsentSignal>();
  for (const c of categories) {
    if (granted.has(c.key)) c.signals.forEach((s) => allowed.add(s));
  }
  return Object.fromEntries(
    CONSENT_SIGNALS.map((s) => [s, allowed.has(s) ? "granted" : "denied"]),
  ) as Record<ConsentSignal, "granted" | "denied">;
}
