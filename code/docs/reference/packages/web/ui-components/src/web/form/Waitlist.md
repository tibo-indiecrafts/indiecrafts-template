---
title: "Waitlist block renderer"
description: "Server half of the module.waitlist block that owns the feature gate and delegates to the client form."
status: stable
---

# Waitlist block renderer

> Server renderer for `module.waitlist` — gates on the waitlist flag, then delegates to the client form.

## Purpose

`Waitlist` is the server half of the `module.waitlist` block. With the app-injected `waitlist` flag off (`configureBlocks`) it renders nothing, in lockstep with the `/api/waitlist` route returning 404. Otherwise it strips the runtime-injected `components` / `inline` props and hands the resolved copy to the client `<WaitlistForm>`.

## Exports

- `Waitlist(props)` — server component that renders the waitlist block from a resolved `WaitlistModule`.

## Usage

```tsx
import { Waitlist } from "@indiecrafts/packages-web-ui-components/web/form/Waitlist";

<Waitlist {...waitlistModule} />;
```

## Source

`code/packages/web/ui-components/src/web/form/Waitlist.tsx`
