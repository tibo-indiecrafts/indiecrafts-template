---
title: "Admin role form"
description: "Client form that grants or revokes the admin role by Clerk user id via the server actions."
status: stable
---

# Admin role form

> The one UI for the crown-jewel grant / revoke action.

## Purpose

Drives the `admin` role grant and revoke by Clerk user id. It is a thin client form: the operator enters a `user_...` id and clicks grant or revoke, and the form calls the matching server action. Every call is re-authorized and audited on the server; this form only collects the id and shows a `sonner` toast on success or error.

## Exports

- `AdminRoleForm` — the role form component; takes no props.

## Usage

```tsx
import { AdminRoleForm } from "./admin-role-form";

<AdminRoleForm />;
```

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/admin-role-form.tsx`
