---
title: "Admin nav user menu"
description: "Sidebar footer user menu, with sign-out when Clerk is configured."
status: stable
---

# Admin nav user menu

> The sidebar footer account menu.

## Purpose

The sidebar footer user menu. It is gated on `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: with Clerk configured it shows the account button plus a sign-out item; unconfigured it is a static label with no sign-out, because there is no session to end.

## Exports

- `NavUser` — client component; takes no props.

## Usage

```tsx
import { NavUser } from "@/user-interface/layout/NavUser";

<NavUser />;
```

## Source

`code/projects/web/surfaces/admin/src/user-interface/layout/NavUser.tsx`
