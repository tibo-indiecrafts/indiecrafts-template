"use client";

/**
 * The account "Language" tab: pick the site + email language.
 *
 * @see docs/reference/packages/web/auth/src/account/language-tab.md
 */

import { locales } from "@indiecrafts/packages-shared-config";
import { useLocaleSwitch } from "@indiecrafts/packages-web-i18n";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@indiecrafts/packages-web-ui/web/toggle-group";
import { usePersistLocale } from "../persist-locale";

/**
 * One option per configured locale (native name), the active one pressed. A single-choice
 * toggle group, not radios: arrow keys only move focus, so a keyboard user browsing the
 * options switches nothing until Enter / Space (WCAG 3.2.2). Picking one does what the
 * header switcher does: saves it to the user's Clerk profile (→ `user_profiles.locale`, the
 * language of their emails), runs `onChange` (the website silences its language
 * suggestion), then switches the page.
 */
export function AccountLanguageTab({
  locale,
  label,
  onChange,
}: {
  /** The active page locale. */
  locale: string;
  /** Accessible name of the group. */
  label: string;
  onChange?: (locale: string) => void;
}) {
  const persistLocale = usePersistLocale();
  const switchTo = useLocaleSwitch();
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      aria-label={label}
      value={locale}
      onValueChange={(next) => {
        // "" = the active option pressed again (Radix deselects); nothing to change.
        if (!next || next === locale) return;
        persistLocale(next);
        onChange?.(next);
        void switchTo(next);
      }}
    >
      {locales.map((l) => (
        <ToggleGroupItem key={l.code} value={l.code} lang={l.code}>
          {l.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
