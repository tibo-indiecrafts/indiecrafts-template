---
title: "Contact block renderer"
description: "Server half of the module.contact block that owns the feature gate and hands resolved copy to the client form."
status: stable
---

# Contact block renderer

> Server renderer for `module.contact` — gates on the app's contact flag, then delegates to the client form.

## Purpose

`Contact` is the server half of the `module.contact` block. With the app-injected `contact` flag off (`configureBlocks`) it renders nothing, in lockstep with the `/api/contact` route returning 404. Otherwise it strips the runtime-injected `components` / `inline` props (a client child cannot receive the non-serializable render-function map) and hands the resolved copy to the client `<ContactForm>`. The Studio switch (`contactSettings.enabled`, projected by `MODULES_FRAGMENT`) hides it too; both checks live in `formBlock`.

## Exports

- `Contact(props)` — server component that renders the contact block from a resolved `ContactModule`.

## Usage

```tsx
import { Contact } from "@indiecrafts/packages-web-ui-components/web/form/Contact";

<Contact {...contactModule} />;
```

## Source

`code/packages/web/ui-components/src/web/form/Contact.tsx`
