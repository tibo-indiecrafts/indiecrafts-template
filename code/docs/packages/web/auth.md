---
title: "@indiecrafts/packages-web-auth"
description: The web-tier Clerk layer — themed provider, sign-in/up views, session logging, and redirect guard.
status: stable
order: 1
---

# `@indiecrafts/packages-web-auth` — themed Clerk provider (web tier)

## Purpose

> Clerk auth for the web surfaces, re-homed so app code imports it from one place.

`@indiecrafts/packages-web-auth` is the DOM-coupled web tier over Clerk (`@clerk/nextjs` v7). It
themes Clerk UI from the design tokens, localizes it, logs sessions, and guards redirects. It
depends on the DOM-free `@indiecrafts/packages-shared-auth` for the role contract, plus
`packages-shared-compliance`, `packages-shared-config`, `packages-shared-logger`, `packages-web-i18n`
(the account Language tab's switch), and `packages-web-ui`.

## Exports

Root `.` barrel:

- **`AppClerkProvider`** — token-themed, locale-aware `<ClerkProvider>` wrapper. Inert until
  `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set. Server-component compatible.
- **`authAppearance()`** — Clerk `appearance.variables` mapped to the `ui-tokens` CSS custom
  properties, so sign-in UI carries no hard-coded brand color.
- **`clerkLocalization(locale)`** — the Clerk UI language bundle for a locale.
- **`SignInView` / `SignUpView`** — the prebuilt, themed sign-in/up surfaces for a catch-all route.
- **`SignInModalButton`** — the header's sign-in button: opens Clerk's modal with `unsafeMetadata.locale`, because Clerk signs up inside the modal and `<SignInButton>` can't pass metadata.
- **`SessionLogger`** — fires one audit ping per Clerk session, deduped in `sessionStorage`.
- **`isSafeRelativePath` / `resolveSignInRedirect`** — open-redirect guard and post-sign-in target.
- Re-exported from `@clerk/nextjs`: **`SignInButton`**, **`SignOutButton`**, **`UserButton`**, **`Show`**.

Subpath-only exports (not in the root barrel): `./persist-locale` (`persistLocale`), `./clerk-active` (`useClerkActive`),
`./marketing-nudge` (`MarketingNudgeMount`), `./session-log` (`logSession`), `./account`
(`AccountButton`, `AccountPage` — Clerk's account UI plus our Privacy & consent, Emails, Language and
Your data pages; Language (`AccountLanguageTab`) sets the site and email language, like the header switcher; Clerk's own "Delete account" is hidden, so "Your data" is the one way to delete).

## Usage example

Wrap the root layout, then mount the session logger once app-wide (admin, app). The website loads Clerk only for a signed-in visitor or on its sign-in / sign-up pages: its layout renders these through `next/dynamic` wrappers (`LazyClerk`), and client components check `useClerkActive()` before using Clerk UI.

```tsx
// app/[locale]/layout.tsx
import {
  AppClerkProvider,
  SessionLogger,
} from "@indiecrafts/packages-web-auth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppClerkProvider nonce={nonce} locale={locale}>
      {children}
      <SessionLogger surface="website" />
    </AppClerkProvider>
  );
}
```

## Consumers

The three Next surfaces — **`website`**, **`admin`**, **`app`**.

Source → [`code/packages/web/auth/`](/packages/web/auth). The DOM-free role contract
(`Roles`, `isAdmin`, `AppSessionClaims`) lives in
[`@indiecrafts/packages-shared-auth`](../shared/auth). Full design →
[auth architecture](/shared/architecture/auth).
