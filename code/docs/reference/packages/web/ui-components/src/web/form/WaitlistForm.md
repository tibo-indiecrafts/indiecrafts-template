---
title: "Waitlist form"
description: "Client waitlist capture form that posts an email to /api/waitlist to create a waitlistEntry doc."
status: stable
---

# Waitlist form

> Client half of `module.waitlist` — resolved copy in, a `waitlistEntry` doc out.

## Purpose

`WaitlistForm` is the client half of `module.waitlist`, rendered by the server `<Waitlist>` wrapper. Every label is a resolved, per-locale string from the block. It posts to `/api/waitlist`, which creates a `waitlistEntry` document. The name field appears only when `namePlaceholder` is set. A hidden honeypot, a render timestamp, and Turnstile block bots. A `201` response means success; new and already-on are deliberately indistinguishable so membership cannot be enumerated.

## Exports

- `WaitlistFormProps` — type: the resolved copy, `Omit<WaitlistModule, "_type" | "_key" | "hidden">`.
- `WaitlistForm(props)` — the client waitlist capture form component.

## Usage

```tsx
import { WaitlistForm } from "@indiecrafts/packages-web-ui-components/web/form/WaitlistForm";

<WaitlistForm heading="Join the waitlist" buttonLabel="Join the list" />;
```

## Source

`code/packages/web/ui-components/src/web/form/WaitlistForm.tsx`
