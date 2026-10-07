---
title: "Sign-in modal button"
description: "A header button that opens Clerk's sign-in modal and carries the visitor's locale into an in-modal sign-up."
status: stable
---

# Sign-in modal button

> Opens Clerk's sign-in modal with `unsafeMetadata.locale`, so a sign-up made inside the modal keeps the language.

## Purpose

Clerk's sign-in modal keeps its "Sign up" step inside the modal: it ignores `signUpUrl`, and that sign-up sends no `unsafeMetadata` unless the opener passes it. Clerk's `<SignInButton>` cannot pass it. This button opens the modal itself with `{ locale }`, so the api's `user.created` webhook stores the locale and the welcome and auth emails go out in the visitor's language. The modal has no marketing checkbox; only the `/sign-up` page (`SignUpView`) offers that decision.

## Exports

- `SignInModalButton({ locale, label })` — a ghost `Button` that calls `clerk.openSignIn({ unsafeMetadata: { locale } })`. A client component; mount it only where `ClerkProvider` is present.

## Usage

```tsx
import { SignInModalButton } from "@indiecrafts/packages-web-auth";

<SignInModalButton locale={useLocale()} label={t("signIn")} />;
```

## Source

`code/packages/web/auth/src/sign-in-modal-button.tsx`
