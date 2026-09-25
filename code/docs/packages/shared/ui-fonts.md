---
title: "@indiecrafts/packages-shared-ui-fonts — the self-hosted fonts"
description: "The self-hosted font files + their metadata, centralized as a design-system brick (like ui-tokens / ui-icons) so every surface ships from one place."
status: stable
---

# `@indiecrafts/packages-shared-ui-fonts` — the self-hosted fonts

The self-hosted **font files** + their metadata, centralized as a design-system brick (like
[`ui-tokens`](/packages/shared/ui-tokens) / [`ui-icons`](/packages/shared/ui-icons)) so every surface ships from one place.

|               |                                                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Files**     | `fonts/Satoshi-Variable.woff2` · `fonts/Satoshi-VariableItalic.woff2` · `fonts/Satoshi-LICENSE.txt`. Google-served families (Geist) carry no file — the app loads them.   |
| **Exports**   | `.` → `src/index.ts` — `FONT_FILES` (key → path + weight/style) + the `FontFile` type. The `FontKey`/`FontRoles` **types** stay in `@indiecrafts/packages-shared-config`. |
| **Consumers** | `website` `src/lib/fonts.ts` (Satoshi via `next/font` `localFont`); a native app via `expo-font`                                                                          |

## Wiring — why the files, not the loader, move here

`next/font` requires **statically-analyzable literal** loader calls, so the loader stays in the app.
The **files** live here; the app's `localFont` points `src.path` at them by **relative path** (not a JS
import — next/font resolves the path relative to the calling file):

```ts
const satoshi = localFont({
  src: [{ path: "../../../../../../packages/shared/ui-fonts/fonts/Satoshi-Variable.woff2", weight: "300 900", style: "normal" }, …],
  variable: "--f-satoshi",
});
```

A native (Expo) app loads the same `.woff2` via `expo-font`. **Add a font:** drop the `.woff2` here, add
a `FONT_FILES` entry + a `FontKey` in config, then a `localFont` call in the app.
