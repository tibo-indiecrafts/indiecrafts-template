---
title: "Newsletter block renderer"
description: "Server half of the module.newsletter block that owns the feature gate and delegates to the client form."
status: stable
---

# Newsletter block renderer

> Server renderer for `module.newsletter` — gates on the newsletter flag, then delegates to the client form.

## Purpose

`Newsletter` is the server half of the `module.newsletter` block. With the app-injected `newsletter` flag off (`configureBlocks`) it renders nothing, in lockstep with the `/api/newsletter` route returning 404. Otherwise it strips the runtime-injected `components` / `inline` props (functions cannot cross the server-to-client boundary) and hands the resolved copy to the client `<NewsletterForm>`. The Studio switch (`newsletterSettings.enabled`, projected by `MODULES_FRAGMENT`) hides it too; both checks live in `formBlock`.

## Exports

- `Newsletter(props)` — server component that renders the newsletter block from a resolved `NewsletterModule`.

## Usage

```tsx
import { Newsletter } from "@indiecrafts/packages-web-ui-components/web/form/Newsletter";

<Newsletter {...newsletterModule} />;
```

## Source

`code/packages/web/ui-components/src/web/form/Newsletter.tsx`
