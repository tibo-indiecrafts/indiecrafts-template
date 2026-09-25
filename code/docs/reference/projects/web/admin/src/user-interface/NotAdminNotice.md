---
title: "Not-admin notice"
description: "Sign-out prompt shown when a signed-in non-admin lands on the admin sign-in route."
status: stable
---

# Not-admin notice

> A way out for a signed-in visitor who is not an admin.

## Purpose

Rendered on the admin sign-in route when the visitor is signed in but is not an admin. Clerk's `<SignIn>` renders nothing for an already-signed-in user, so without this a non-admin would land on a blank page. Sign-out returns them to `/sign-in`, where the form shows.

## Exports

- `NotAdminNotice` — client component taking `message` and `signOutLabel` strings.

## Usage

```tsx
import { NotAdminNotice } from "@/user-interface/NotAdminNotice";

<NotAdminNotice message={t("notAdmin")} signOutLabel={t("signOut")} />;
```

## Source

`code/projects/web/surfaces/admin/src/user-interface/NotAdminNotice.tsx`
