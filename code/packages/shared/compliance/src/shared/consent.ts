/**
 * The portable consent core — the pure decision math + the store contract + the
 * default category set.
 * No DOM, no `localStorage`, no `dataLayer`: the web brick's `consent-store.ts` keeps
 * the persistence + Consent-Mode push and imports the math from here; each shell
 * supplies its own `ConsentStore` adapter (`localStorage` on the `app` surface).
 */

import {
  CONSENT_SIGNALS,
  type ConsentCategory,
  type ConsentSignal,
} from "./consent-signals";

/** `v` = consent version (bumping it re-prompts), `t` = timestamp, `choices` per category key. */
export type ConsentRecord = {
  v: string;
  t: number;
  choices: Record<string, boolean>;
};

/**
 * The persistence contract a shell implements over a stored record. `get` returns a
 * STABLE reference when nothing changed (so `useSyncExternalStore` works on web);
 * `subscribe` fires `cb` on every external change. The adapter is `localStorage`.
 * One generic store serves both the consent record
 * and the legal-acceptance record (each under its own key).
 */
export interface Store<T> {
  get(): T | null;
  save(record: T): void;
  subscribe(cb: () => void): () => void;
}

/** The consent store — a `Store` of the visitor's `ConsentRecord`. */
export type ConsentStore = Store<ConsentRecord>;

/** Category keys currently granted — required categories are always granted. */
export function grantedKeys(
  categories: readonly ConsentCategory[],
  choices: Record<string, boolean>,
): Set<string> {
  const set = new Set<string>();
  for (const c of categories) if (c.required || choices[c.key]) set.add(c.key);
  return set;
}

/**
 * The gtag Consent-Mode `update` payload for a set of choices: each of the seven
 * signals is `granted` iff at least one granted category lists it, else `denied`.
 * RN has no `dataLayer`, but the mapping is still the shape a future SDK gates on.
 */
export function consentUpdate(
  categories: readonly ConsentCategory[],
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

/**
 * The default consent taxonomy — the signal mapping only, no copy. Each shell zips
 * in localized `title`/`description` from its `messages` via `resolveCategories`, so
 * the taxonomy stays one source of truth while the wording is per-shell.
 */
export type ConsentCategoryDef = {
  key: string;
  required: boolean;
  signals: ConsentSignal[];
};

export const DEFAULT_CONSENT_CATEGORIES: readonly ConsentCategoryDef[] = [
  {
    key: "necessary",
    required: true,
    signals: ["security_storage", "functionality_storage"],
  },
  { key: "analytics", required: false, signals: ["analytics_storage"] },
  {
    key: "marketing",
    required: false,
    signals: [
      "ad_storage",
      "ad_user_data",
      "ad_personalization",
      "personalization_storage",
    ],
  },
];

/** Merge localized copy into the taxonomy → the `ConsentCategory[]` the banner renders. */
export function resolveCategories(
  defs: readonly ConsentCategoryDef[],
  copy: Record<string, { title: string; description?: string }>,
): ConsentCategory[] {
  return defs.map((d) => ({
    ...d,
    title: copy[d.key]?.title ?? d.key,
    description: copy[d.key]?.description,
  }));
}

/** The injected banner copy — resolved per shell from its `messages` (no i18n dep in the brick). */
export type ConsentBannerCopy = {
  title?: string;
  body: string;
  acceptLabel: string;
  rejectLabel: string;
  customizeLabel: string;
  saveLabel: string;
  backLabel: string;
};

/** Every non-required category granted — the "Accept all" choice. */
export function acceptAllChoices(
  categories: readonly ConsentCategoryDef[],
): Record<string, boolean> {
  return Object.fromEntries(
    categories.filter((c) => !c.required).map((c) => [c.key, true]),
  );
}

/** Every non-required category denied — the "Reject" choice. */
export function rejectAllChoices(
  categories: readonly ConsentCategoryDef[],
): Record<string, boolean> {
  return Object.fromEntries(
    categories.filter((c) => !c.required).map((c) => [c.key, false]),
  );
}
