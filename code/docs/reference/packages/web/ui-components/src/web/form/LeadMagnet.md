---
title: "Lead-magnet block renderer"
description: "Server half of the module.lead-magnet block that shares the newsletter feature gate and delegates to the client form."
status: stable
---

# Lead-magnet block renderer

> Server renderer for `module.lead-magnet` — shares the newsletter flag, then delegates to the client form.

## Purpose

`LeadMagnet` is the server half of the `module.lead-magnet` block. It shares the `newsletter` feature gate: with that app-injected flag off (`configureBlocks`) it renders nothing, in lockstep with the `/api/newsletter` route returning 404. Otherwise it strips the runtime-injected `components` / `inline` props and hands the resolved copy to the client `<LeadMagnetForm>`. The Studio switch (`newsletterSettings.enabled`, projected by `MODULES_FRAGMENT`) hides it too; both checks live in `formBlock`.

## Exports

- `LeadMagnet(props)` — server component that renders the lead-magnet block from a resolved `LeadMagnetModule`.

## Usage

```tsx
import { LeadMagnet } from "@indiecrafts/packages-web-ui-components/web/form/LeadMagnet";

<LeadMagnet {...leadMagnetModule} />;
```

## Source

`code/packages/web/ui-components/src/web/form/LeadMagnet.tsx`
