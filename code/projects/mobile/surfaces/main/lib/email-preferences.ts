/**
 * Email preference centre — shared types + the pure optimistic-toggle helper, split out
 * of `components/EmailPreferences.tsx` so the state transition is unit-testable without
 * an RN render harness (mirrors `lib/sign-in-machine.ts`/`lib/theme-resolve.ts`).
 */

export interface EmailPreferenceCategory {
  key: string;
  /** Already locale-resolved by the api — render as-is. */
  name: string;
  /** Already locale-resolved by the api — render as-is. */
  description: string;
  includeAtSignup: boolean;
  granted: boolean;
}

/** A display-only notice (e.g. transactional/security email) — no switch. */
export interface EmailPreferenceNotice {
  name: string;
  description: string;
}

export interface EmailPreferencesData {
  categories: EmailPreferenceCategory[];
  notices: EmailPreferenceNotice[];
  marketing_email: boolean | null;
}

/** Set one category's `granted` by key, leaving the rest untouched. Used both for the
 *  optimistic update before the POST and to revert on a failed write (call again with
 *  the pre-toggle value). Never mutates the input. */
export function withCategoryGranted(
  categories: EmailPreferenceCategory[],
  key: string,
  granted: boolean,
): EmailPreferenceCategory[] {
  return categories.map((c) => (c.key === key ? { ...c, granted } : c));
}
