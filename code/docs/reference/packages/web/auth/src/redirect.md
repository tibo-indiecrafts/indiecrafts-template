---
title: "Sign-in redirect guard"
description: "Validates redirect targets as same-origin paths and resolves the post-sign-in target."
status: stable
---

# Sign-in redirect guard

> Open-redirect guard for post-sign-in navigation.

## Purpose

Guards redirect targets against open-redirect attacks and resolves where a user lands after sign-in. A target must be a same-origin relative path; anything else falls back to the app home.

## Exports

- `isSafeRelativePath(value)` — type guard. Returns `true` only for a single-leading-slash relative path with no scheme, protocol-relative host, backslash, or control character.
- `resolveSignInRedirect(redirectUrl, home, force?)` — returns a safe `force`, else a safe `redirectUrl`, else `home`.

## Usage

```ts
import { resolveSignInRedirect } from "@indiecrafts/packages-web-auth";

const target = resolveSignInRedirect(searchParams.redirect_url, "/");
```

## Source

`code/packages/web/auth/src/redirect.ts`
