---
title: "Account language tab"
description: "The account widget's Language page: one option per locale; picking one switches the site and the email language."
status: stable
---

# Account language tab

> Pick the site and email language from the account widget.

## Purpose

The content of the account widget's "Language" page (`#/language`). It lists every configured locale by its native name in a single-choice toggle group, with the active page locale pressed. Arrow keys only move focus; Enter, Space or a click picks (a radio group would switch on every arrow press, WCAG 3.2.2). Picking another one does what the header switcher does: it saves the locale to the user's Clerk `unsafeMetadata.locale` (`usePersistLocale` → the `user.updated` webhook → `user_profiles.locale`, the language of their emails), calls `onChange`, then switches the page with `useLocaleSwitch` (the website's content-route resolver applies through `LocaleSwitchProvider`). Pressing the active locale again does nothing.

## Exports

- `AccountLanguageTab({ locale, label, onChange? })` — `locale` is the active page locale, `label` names the radio group, `onChange(locale)` runs before the switch (the website silences its language suggestion there).

## Usage

```tsx
import { AccountLanguageTab } from "./language-tab";

<AccountLanguageTab
  locale={locale}
  label="Language"
  onChange={dismissLocaleSuggest}
/>;
```

## Source

`code/packages/web/auth/src/account/language-tab.tsx`
