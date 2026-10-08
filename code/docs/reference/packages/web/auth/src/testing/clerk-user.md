---
title: "Throwaway Clerk test user"
description: "Creates and removes a +clerk_test user through the Clerk Backend API for the signed-in e2e journeys."
status: stable
---

# Throwaway Clerk test user

> Test-only helper for the e2e journeys of the website, admin and app surfaces.

## Purpose

Clerk signs in existing users only. Each signed-in journey creates its own `+clerk_test` user through the Clerk Backend API and removes it after the run. A Clerk dev or test instance accepts the code `424242` for that address, so no real user or credential is involved. It reads `CLERK_SECRET_KEY` from the run's environment. No app code imports it.

## Exports

- `throwawayClerkUser(name)` — returns `{ email, findId, create, remove }`. `email` is `e2e-<name>-<timestamp>+clerk_test@example.com`; `create()` throws on a Clerk error; `remove()` deletes the user if it still exists; `findId()` answers the user's id or `null`.

## Usage

```ts
import { throwawayClerkUser } from "@indiecrafts/packages-web-auth/testing/clerk-user";

const user = throwawayClerkUser("sign-in");
test.beforeAll(user.create);
test.afterAll(user.remove);
// clerk.signIn({ page, signInParams: { strategy: "email_code", identifier: user.email } })
```

## Source

`code/packages/web/auth/src/testing/clerk-user.ts`
